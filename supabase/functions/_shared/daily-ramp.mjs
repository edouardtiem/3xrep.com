import { localDate, warmupHealthy } from './ramp-up.mjs';

export function sendingDate(now) {
  return localDate(new Date(new Date(now).getTime() + 12 * 3600000));
}

// Variation is a small, reproducible capacity adjustment, never evidence of
// deliverability. Successful real sending days, not elapsed days, raise the base.
export function decideDailyRamp({ account, state, stats, metrics, now, complete = true, domainBlocked = false, campaignActive = false }) {
  const current = Number(account.message_per_day);
  const plan = state.daily_plan;
  const day = sendingDate(now);
  const result = (action, reason, cap = current, baseline = plan?.baseline) => ({ action, reason, cap, stage: baseline, baseline, sendingDate: day });
  if (!state.approved) return result('hold', 'admission_required');
  if (state.stopped) return result('hold', 'manual_restart_required');
  if (metrics.senderBounce || state.known_complaint || account.is_smtp_success === false || account.is_imap_success === false || account.warmup_details?.blocked_reason) {
    return result('stop', 'delivery_blocked');
  }
  if (metrics.attempted >= 50 && metrics.rate >= .05) return result('stop', 'delivery_blocked');
  if (!plan || !Number.isInteger(plan.baseline) || plan.baseline < 1 || plan.baseline > 43 || plan.target !== 43) return result('hold', 'invalid_daily_plan');
  if (current !== Number(state.observed_cap)) return result('hold', 'external_cap_change');
  if (metrics.attempted >= 50 && metrics.rate >= .02) {
    const fresh = metrics.bounceIds.some(id => !(state.handled_bounce_ids || []).includes(id));
    return fresh ? result('reduce', 'bounce_rate', Math.max(1, Math.floor(current * .8)), Math.max(1, Math.floor(plan.baseline * .8))) : result('hold', 'bounce_incident_already_handled');
  }
  if (!complete) return result('hold', 'sender_attribution_incomplete');
  const unresolved = [...metrics.bounceIds, ...(state.pending_bounce_ids || [])].some(id => !(state.resolved_bounce_ids || []).includes(id));
  if (unresolved || (metrics.attempted >= 50 && metrics.rate >= .01)) return result('hold', 'bounce_review_required');
  if (domainBlocked) return result('hold', 'domain_incident');
  if (!warmupHealthy(account, stats, now)) return result('hold', 'warmup_not_ready');
  if (state.warmup_started_at !== account.warmup_details?.warmup_created_at) return result('hold', 'warmup_start_changed');
  if (new Date(now) - new Date(state.warmup_started_at) < 7 * 86400000) return result('hold', 'warmup_only');
  if ([0, 6].includes(new Date(`${day}T12:00:00Z`).getUTCDay())) return result('hold', 'weekend');
  if (!campaignActive) return result('hold', 'no_active_campaign');
  if (plan.last_planned_date && day <= plan.last_planned_date) return result('hold', 'already_planned');
  if (metrics.cumulative >= 100 && !metrics.replied) return result('hold', 'targeting_review_required');
  if (!metrics.effectiveDays) return result('hold', 'waiting_for_real_sending');
  if (state.cooldown && metrics.effectiveDays < 5) return result('hold', 'recovery_observation');
  let baseline = plan.baseline;
  const requiredDays = baseline < 15 ? 2 : 3;
  if (metrics.effectiveDays >= requiredDays) {
    const proposed = Math.min(43, baseline + (baseline < 15 || baseline >= 30 ? 2 : 3));
    if (proposed > 15 && metrics.cumulative < 20) return result('hold', 'insufficient_real_sending_for_15');
    if (proposed > 25 && metrics.cumulative < 50) return result('hold', 'insufficient_real_sending_for_25');
    if (proposed > 35 && metrics.cumulative < 100) return result('hold', 'insufficient_real_sending_for_35');
    baseline = proposed;
  }
  const epochDays = Math.floor(Date.parse(`${day}T12:00:00Z`) / 86400000);
  // Five sending-day phases with zero mean; separate phases per mailbox.
  const fromMonday = epochDays - 4; // 1970-01-05 was a Monday.
  const businessIndex = Math.floor(fromMonday / 7) * 5 + ((fromMonday % 7 + 7) % 7);
  const variation = [-2, 0, 2, -1, 1][((businessIndex + Number(account.id)) % 5 + 5) % 5];
  const cap = Math.max(1, Math.min(45, baseline + variation));
  return result(cap > current ? 'increase' : cap < current ? 'reduce' : 'plan',
    baseline > plan.baseline ? 'progressive_daily_base' : 'daily_variation', cap, baseline);
}
