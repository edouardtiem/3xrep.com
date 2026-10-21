import { localDate, warmupHealthy, commercialSignals } from './ramp-up.mjs';

export function sendingDate(now) {
  return localDate(new Date(new Date(now).getTime() + 12 * 3600000));
}

export const DAILY_RAMP_POLICY = 'alert-recovery-2026-10-21';
export const DAILY_RAMP_TARGET = 46;
export const DAILY_RAMP_MAX = 48;

// Operational evidence can complement native bounce statistics. A confirmed
// temporary refusal needs an id and timestamp; resolving it is a separate act.
export function confirmedRefusals(state, now) {
  return (state.delivery_incidents || []).filter(i => i.kind === 'temporary_refusal' && i.confirmed === true &&
    typeof i.id === 'string' && i.id.length > 0 && Number.isFinite(Date.parse(i.at)) && Date.parse(i.at) <= Number(new Date(now)));
}

export function deliveryAlertEvidence(state, metrics, now) {
  const known = new Set([...(state.handled_bounce_ids || []), ...(state.resolved_bounce_ids || [])]);
  const groups = metrics.bounceGroups || [];
  const grouped = new Set(groups.flat());
  const knownRecipientIds = new Set(groups.filter(ids => ids.some(id => known.has(id))).flat());
  const bounceIds = [...new Set([
    ...groups.filter(ids => ids.length && !ids.some(id => known.has(id))).flat(),
    ...(state.pending_bounce_ids || []).filter(id => !grouped.has(id) && !known.has(id)),
    ...(metrics.senderBounceIds || []).filter(id => !known.has(id) && !knownRecipientIds.has(id)),
  ])];
  const refusalIds = confirmedRefusals(state, now)
    .filter(i => !(state.handled_delivery_incident_ids || []).includes(i.id)).map(i => i.id);
  const unattributedSender = metrics.senderBounce && !metrics.senderBounceIds?.length && !state.handled_unattributed_sender_alert;
  return { bounceIds, refusalIds, fresh: bounceIds.length > 0 || refusalIds.length > 0 || unattributedSender, unattributedSender };
}

// Variation is a small, reproducible capacity adjustment, never evidence of
// deliverability. Successful real sending days, not elapsed days, raise the base.
export function decideDailyRamp({ account, state, stats, metrics, now, complete = true, domainBlocked = false, campaignActive = false, alertsOnly = false }) {
  const current = Number(account.message_per_day);
  const plan = state.daily_plan;
  const day = alertsOnly ? localDate(now) : sendingDate(now);
  const result = (action, reason, cap = current, baseline = plan?.baseline, recoveryTarget = plan?.recovery_target ?? null) =>
    ({ action, reason, cap, stage: baseline, baseline, sendingDate: day, policy: DAILY_RAMP_POLICY, recoveryTarget, signals: commercialSignals(metrics) });
  if (!state.approved) return result('hold', 'admission_required');
  if (state.known_complaint || account.is_smtp_success === false || account.is_imap_success === false || account.warmup_details?.blocked_reason) {
    return result('stop', 'delivery_blocked');
  }
  if (!plan || !Number.isInteger(plan.baseline) || plan.baseline < 1 || plan.baseline > DAILY_RAMP_TARGET || plan.target !== DAILY_RAMP_TARGET ||
    (plan.recovery_target != null && (!Number.isInteger(plan.recovery_target) || plan.recovery_target < 1 || plan.recovery_target > DAILY_RAMP_TARGET))) return result('hold', 'invalid_daily_plan');
  if (current !== Number(state.observed_cap)) return result('hold', 'external_cap_change');
  if (state.stopped && !state.auto_delivery_recovery) return result('hold', 'manual_restart_required');
  if (!complete) return result('hold', 'sender_attribution_incomplete');
  if (state.stopped && state.auto_delivery_recovery && !warmupHealthy(account, stats, now)) return result('hold', 'warmup_not_ready');
  if (state.stopped && domainBlocked) return result('hold', 'domain_incident');
  const alerts = deliveryAlertEvidence(state, metrics, now);
  if (alerts.fresh || state.stopped && state.auto_delivery_recovery) {
    // Never increase an already smaller cap because an alert was received.
    const cap = Math.max(1, Math.min(7, current));
    return { ...result('reduce', 'delivery_alert', cap, cap, Math.max(plan.baseline, plan.recovery_target || 0, cap)),
      ...(state.stopped ? { restart: true } : {}) };
  }
  if (alertsOnly) return result('hold', 'delivery_check_only');
  if (domainBlocked) return result('hold', 'domain_incident');
  if (!warmupHealthy(account, stats, now)) return result('hold', 'warmup_not_ready');
  if (state.warmup_started_at !== account.warmup_details?.warmup_created_at) return result('hold', 'warmup_start_changed');
  if (new Date(now) - new Date(state.warmup_started_at) < 7 * 86400000) return result('hold', 'warmup_only');
  if ([0, 6].includes(new Date(`${day}T12:00:00Z`).getUTCDay())) return result('hold', 'weekend');
  if (!campaignActive) return result('hold', 'no_active_campaign');
  if (plan.last_planned_date && day <= plan.last_planned_date) return result('hold', 'already_planned');
  if (state.targeting_review_required) return result('hold', 'targeting_review_required');
  if (!metrics.effectiveDays) return result('hold', 'waiting_for_real_sending');
  const healthyDays = metrics.healthyDays;
  if (!Number.isInteger(healthyDays) || healthyDays < 0) return result('hold', 'healthy_day_evidence_missing');
  if (state.cooldown && healthyDays < 3) return result('hold', 'recovery_observation');
  let baseline = plan.baseline;
  const recovering = Number.isInteger(plan.recovery_target) && plan.recovery_target > baseline;
  if (healthyDays >= 2) {
    const proposed = recovering ? Math.min(plan.recovery_target, baseline + 2) :
      Math.min(DAILY_RAMP_TARGET, baseline + 5);
    if (proposed > baseline && proposed > 15 && metrics.cumulative < 20) return result('hold', 'insufficient_real_sending_for_15');
    if (proposed > baseline && proposed > 25 && metrics.cumulative < 50) return result('hold', 'insufficient_real_sending_for_25');
    if (proposed > baseline && proposed > 35 && metrics.cumulative < 100) return result('hold', 'insufficient_real_sending_for_35');
    baseline = proposed;
  }
  const epochDays = Math.floor(Date.parse(`${day}T12:00:00Z`) / 86400000);
  // Five sending-day phases with zero mean; separate phases per mailbox.
  const fromMonday = epochDays - 4; // 1970-01-05 was a Monday.
  const businessIndex = Math.floor(fromMonday / 7) * 5 + ((fromMonday % 7 + 7) % 7);
  const variation = [-2, 0, 2, -1, 1][((businessIndex + Number(account.id)) % 5 + 5) % 5];
  const stillRecovering = recovering && baseline < plan.recovery_target;
  const cap = Math.max(1, Math.min(DAILY_RAMP_MAX, baseline + (recovering ? 0 : variation)));
  return result(cap > current ? 'increase' : cap < current ? 'reduce' : 'plan',
    baseline > plan.baseline ? (recovering ? 'gradual_recovery' : 'progressive_daily_base') : (recovering ? 'recovery_hold' : 'daily_variation'),
    cap, baseline, stillRecovering ? plan.recovery_target : null);
}
