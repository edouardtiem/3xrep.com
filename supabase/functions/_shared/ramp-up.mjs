export const CAMPAIGNS = ['4023139', '4023140'];
export const DOMAINS = ['get3xrep.com', '3xrepgrow.com'];
const STAGES = [0, 2, 5, 15, 25];

export function localDate(value, timeZone = 'America/New_York') {
  return new Intl.DateTimeFormat('en-CA', { timeZone, year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date(value));
}
function weekday(date) { return ![0, 6].includes(new Date(`${date}T12:00:00Z`).getUTCDay()); }
function daysBetween(a, b) { return Math.round((Date.parse(`${b}T12:00:00Z`) - Date.parse(`${a}T12:00:00Z`)) / 86400000); }

export function senderEmail(value) {
  if (typeof value !== 'string') return null;
  const emails = value.toLowerCase().match(/[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9.-]+\.[a-z]{2,}/g);
  return emails?.length === 1 ? emails[0] : null;
}

export function realEvents(staged, accounts) {
  const byEmail = new Map(accounts.map(a => [a.from_email.toLowerCase(), a.id]));
  const events = new Map();
  let complete = true;
  for (const campaign of staged) for (const item of campaign.entries) {
    for (const stat of item.stats) {
      if (!stat.sent_time) continue;
      const sent = item.sent.find(s => String(s.stats_id) === String(stat.stats_id));
      const accountId = byEmail.get(senderEmail(sent?.from));
      if (!sent || !accountId || !Number.isFinite(Date.parse(stat.sent_time)) || typeof stat.is_bounced !== 'boolean') { complete = false; continue; }
      events.set(String(stat.stats_id), {
        id: String(stat.stats_id), accountId,
        // Only kept in memory to deduplicate; never put recipient addresses in logs.
        recipient: item.entry.lead.email.trim().toLowerCase(),
        sentAt: stat.sent_time, bounced: stat.is_bounced,
        senderBounce: stat.sender_bounce === true,
        replied: !stat.is_bounced && !stat.ignore_reply && !!stat.reply_time,
      });
    }
    for (const sent of item.sent) if (!item.stats.some(s => String(s.stats_id) === String(sent.stats_id))) complete = false;
  }
  return { events: [...events.values()], complete };
}

export function metricsFor(id, events, now, changedAt) {
  const today = localDate(now);
  const own = events.filter(e => Number(e.accountId) === Number(id));
  const window = own.filter(e => { const age = daysBetween(localDate(e.sentAt), today); return age >= 0 && age <= 7; });
  const attempted = new Set(window.map(e => e.recipient)).size;
  const bounced = new Set(window.filter(e => e.bounced).map(e => e.recipient)).size;
  const hour = Number(new Intl.DateTimeFormat('en-GB', { timeZone: 'America/New_York', hour: '2-digit', hourCycle: 'h23' }).format(new Date(now)));
  const effectiveDays = new Set(own.filter(e => {
    const date = localDate(e.sentAt);
    return changedAt && Date.parse(e.sentAt) >= Date.parse(changedAt) && Date.parse(e.sentAt) <= Date.parse(now) &&
      (date < today || (date === today && hour >= 17)) && weekday(date);
  }).map(e => localDate(e.sentAt))).size;
  return {
    attempted, bounced, rate: attempted ? bounced / attempted : null,
    cumulative: new Set(own.map(e => e.recipient)).size,
    replied: own.some(e => e.replied), effectiveDays,
    bounceIds: window.filter(e => e.bounced).map(e => e.id).sort(),
    senderBounce: window.some(e => e.senderBounce),
  };
}

export function warmupHealthy(account, stats, now) {
  const w = account.warmup_details;
  if (account.is_smtp_success !== true || account.is_imap_success !== true || w?.status !== 'ACTIVE' || w.blocked_reason) return false;
  const dates = stats?.stats_by_date?.map(s => s.date).filter(d => /^\d{4}-\d{2}-\d{2}$/.test(d)).sort();
  if (!dates?.length) return false;
  const age = daysBetween(dates.at(-1), localDate(now));
  const sent = Number(stats.sent_count), inbox = Number(stats.inbox_count), spam = Number(stats.spam_count);
  return age >= 0 && age <= 2 && Number.isFinite(sent) && sent >= 20 && Number.isFinite(inbox) && inbox >= 0 && inbox <= sent && Number.isFinite(spam) && spam >= 0 && inbox / sent >= 0.95;
}

export function decideRamp({ account, state, stats, metrics, now, complete = true, domainBlocked = false }) {
  const result = (action, reason, cap = account.message_per_day, stage = state.stage) => ({ action, reason, cap, stage });
  if (!state.approved) return result('hold', 'admission_required');
  if (state.stopped) return result('hold', 'manual_restart_required');
  const severe = metrics.senderBounce || state.known_complaint || account.is_smtp_success === false || account.is_imap_success === false || !!account.warmup_details?.blocked_reason;
  if (severe || (metrics.attempted >= 50 && metrics.rate >= 0.05)) return result('stop', 'delivery_blocked');
  if (Number(account.message_per_day) !== Number(state.observed_cap)) return result('hold', 'external_cap_change');
  if (!complete) return result('hold', 'sender_attribution_incomplete');
  if (!STAGES.includes(state.stage)) return result('hold', 'invalid_state');
  if (metrics.attempted >= 50 && metrics.rate >= 0.02) {
    const fresh = metrics.bounceIds.some(id => !(state.handled_bounce_ids || []).includes(id));
    return fresh ? result('reduce', 'bounce_rate', Math.max(1, Math.floor(account.message_per_day * 0.8))) : result('hold', 'bounce_incident_already_handled');
  }
  const unresolved = [...metrics.bounceIds, ...(state.pending_bounce_ids || [])].some(id => !(state.resolved_bounce_ids || []).includes(id));
  if (unresolved || (metrics.attempted >= 50 && metrics.rate >= 0.01)) return result('hold', 'bounce_review_required');
  if (domainBlocked) return result('hold', 'domain_incident');
  if (metrics.cumulative >= 100 && !metrics.replied) return result('hold', 'targeting_review_required');
  if (!warmupHealthy(account, stats, now)) return result('hold', 'warmup_not_ready');

  // At 01:00 Paris, it is still the previous day in New York. Prepare the
  // next sending day, while evaluating health on observations available now.
  const nextSendingDate = localDate(new Date(new Date(now).getTime() + 12 * 3600000));
  if (!weekday(nextSendingDate)) return result('hold', 'weekend');
  const started = account.warmup_details?.warmup_created_at;
  if (!started || !Number.isFinite(Date.parse(started))) return result('hold', 'warmup_start_missing');
  if (state.warmup_started_at && state.warmup_started_at !== started) return result('hold', 'warmup_start_changed');
  const age = daysBetween(localDate(started), nextSendingDate);
  const nominal = age < 7 ? 0 : age < 14 ? 2 : age < 21 ? 5 : age < 28 ? 15 : 25;
  if (nominal === 0) return result('hold', 'warmup_only');
  if (state.cooldown && metrics.effectiveDays < 5) return result('hold', 'recovery_observation');
  const nextStage = STAGES[STAGES.indexOf(state.stage) + 1];
  if (nextStage && nominal >= nextStage) {
    if (nextStage === 15 && (metrics.effectiveDays < 5 || metrics.cumulative < 20)) return result('hold', 'insufficient_real_sending_for_15');
    if (nextStage === 25 && (metrics.effectiveDays < 5 || metrics.cumulative < 50)) return result('hold', 'insufficient_real_sending_for_25');
    return result('increase', 'next_stage', nextStage, nextStage);
  }
  if (state.stage >= 5 && metrics.effectiveDays >= 5 && metrics.attempted >= 50 && metrics.rate < 0.01) {
    const cap = Math.floor(state.stage * 1.2);
    if (account.message_per_day < cap) return result('increase', 'healthy_margin', cap);
  }
  return result('hold', 'unchanged');
}
