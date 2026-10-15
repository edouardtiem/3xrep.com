import { localDate, warmupHealthy, commercialSignals } from './ramp-up.mjs';

export function sendingDate(now) {
  return localDate(new Date(new Date(now).getTime() + 12 * 3600000));
}

export const DAILY_RAMP_POLICY = 'accelerated-2026-10-14';

// Operational evidence can complement native bounce statistics. A confirmed
// temporary refusal needs an id and timestamp; resolving it is a separate act.
export function confirmedRefusals(state, now) {
  return (state.delivery_incidents || []).filter(i => i.kind === 'temporary_refusal' && i.confirmed === true &&
    typeof i.id === 'string' && i.id.length > 0 && Number.isFinite(Date.parse(i.at)) && Date.parse(i.at) <= Number(new Date(now)));
}

function resolved(incident, now) {
  return Number.isFinite(Date.parse(incident.resolved_at)) && Date.parse(incident.resolved_at) >= Date.parse(incident.at) &&
    Date.parse(incident.resolved_at) <= Number(new Date(now));
}

// Variation is a small, reproducible capacity adjustment, never evidence of
// deliverability. Successful real sending days, not elapsed days, raise the base.
export function decideDailyRamp({ account, state, stats, metrics, now, complete = true, domainBlocked = false, campaignActive = false }) {
  const current = Number(account.message_per_day);
  const plan = state.daily_plan;
  const day = sendingDate(now);
  const result = (action, reason, cap = current, baseline = plan?.baseline, recoveryTarget = plan?.recovery_target ?? null) =>
    ({ action, reason, cap, stage: baseline, baseline, sendingDate: day, policy: DAILY_RAMP_POLICY, recoveryTarget, signals: commercialSignals(metrics) });
  if (!state.approved) return result('hold', 'admission_required');
  if (state.stopped) return result('hold', 'manual_restart_required');
  if (metrics.senderBounce || state.known_complaint || account.is_smtp_success === false || account.is_imap_success === false || account.warmup_details?.blocked_reason) {
    return result('stop', 'delivery_blocked');
  }
  if (metrics.attempted >= 50 && metrics.rate >= .05) return result('stop', 'delivery_blocked');
  if (!plan || !Number.isInteger(plan.baseline) || plan.baseline < 1 || plan.baseline > 43 || plan.target !== 43 ||
    (plan.recovery_target != null && (!Number.isInteger(plan.recovery_target) || plan.recovery_target < 1 || plan.recovery_target > 43))) return result('hold', 'invalid_daily_plan');
  if (current !== Number(state.observed_cap)) return result('hold', 'external_cap_change');
  const handled = new Set(state.handled_bounce_ids || []);
  const freshRecipients = (metrics.bounceGroups || []).filter(ids => ids.length > 0 && ids.every(id => !handled.has(id))).length;
  const fresh = freshRecipients > 0;
  const refusals = confirmedRefusals(state, now);
  const freshRefusal = refusals.some(i => !((state.handled_delivery_incident_ids || []).includes(i.id)) &&
    Number(new Date(now)) - Date.parse(i.at) <= 7 * 86400000);
  if ((fresh && metrics.attempted >= 50 && metrics.rate >= .02) || freshRecipients >= 2 || freshRefusal) {
    const cap = Math.max(1, Math.floor(current / 2));
    return result('reduce', freshRefusal ? 'temporary_refusal' : 'bounce_rate', cap,
      Math.min(cap, Math.max(1, Math.floor(plan.baseline / 2))), Math.max(plan.baseline, plan.recovery_target || 0));
  }
  if (!complete) return result('hold', 'sender_attribution_incomplete');
  const unresolved = [...metrics.bounceIds, ...(state.pending_bounce_ids || [])].some(id => !(state.resolved_bounce_ids || []).includes(id));
  // Already handled and resolved failures stay in the audit, but cannot punish
  // the mailbox twice or prevent recovery while the seven-day window expires.
  const activeGroups = (metrics.bounceGroups || []).filter(ids => ids.some(id => !handled.has(id) || !(state.resolved_bounce_ids || []).includes(id)));
  if (unresolved || (metrics.attempted >= 50 && activeGroups.length / metrics.attempted >= .01)) return result('hold', 'bounce_review_required');
  if (refusals.some(i => !resolved(i, now))) return result('hold', 'temporary_refusal_review_required');
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
      baseline < 20 ? Math.min(20, baseline + 3) : baseline < 40 ? Math.min(40, baseline + 5) : Math.min(43, baseline + 3);
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
  const cap = Math.max(1, Math.min(45, baseline + (recovering ? 0 : variation)));
  return result(cap > current ? 'increase' : cap < current ? 'reduce' : 'plan',
    baseline > plan.baseline ? (recovering ? 'gradual_recovery' : 'progressive_daily_base') : (recovering ? 'recovery_hold' : 'daily_variation'),
    cap, baseline, stillRecovering ? plan.recovery_target : null);
}
