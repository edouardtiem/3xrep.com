import { CAMPAIGNS, DOMAINS, realEvents, metricsFor, decideRamp } from './ramp-up.mjs';
import { syncOutbound } from './outbound-sync.mjs';
import { decideDailyRamp, sendingDate } from './daily-ramp.mjs';
import { firstSendBudget } from './outbound-stock.mjs';

async function checked(query) {
  const { data, error } = await query;
  if (error) throw new Error(`Database ${error.code || 'request_failed'}`);
  return data;
}

export async function runOutboundControl({ db, smartlead, now = new Date(), dryRun = false, sync = syncOutbound, sequences = [] }) {
  const campaignIds = [...new Set([...CAMPAIGNS, ...sequences.map(s => String(s.provider_campaign_id))])];
  const controlledIds = sequences.length ? sequences.filter(s => s.controlled).map(s => String(s.provider_campaign_id)) : CAMPAIGNS;
  const runId = crypto.randomUUID();
  const locked = await checked(db.rpc('claim_outbound_control', { run_id: runId }));
  if (!locked) return { status: 'already_running' };
  await checked(db.from('outbound_control_runs').insert({ id: runId, status: 'running' }));
  let finished = false;
  try {
    const accounts = [];
    for (let offset = 0; ; offset += 100) {
      const page = await smartlead.get('email-accounts/', { limit: 100, offset });
      if (!Array.isArray(page)) throw new Error('Invalid account list');
      // Immediately discard provider credentials.
      accounts.push(...page.map(a => ({ id: a.id, from_email: a.from_email, message_per_day: a.message_per_day,
        is_smtp_success: a.is_smtp_success, is_imap_success: a.is_imap_success,
        warmup_details: a.warmup_details ? { status: a.warmup_details.status, blocked_reason: !!a.warmup_details.blocked_reason,
          warmup_created_at: a.warmup_details.warmup_created_at } : null })));
      if (page.length < 100) break;
      if (offset >= 10000) throw new Error('Account pagination limit');
    }
    const saved = await checked(db.from('outbound_mailboxes').select('*'));
    const states = new Map(saved.map(s => [Number(s.id), { ...s.state, approved: s.approved }]));
    const candidates = accounts.filter(a => DOMAINS.includes(a.from_email?.split('@')[1]) && !states.has(Number(a.id)));
    for (const a of candidates) await checked(db.from('outbound_mailboxes').insert({ id: a.id, email: a.from_email,
      domain: a.from_email.split('@')[1], approved: false, state: { stage: 0, observed_cap: a.message_per_day,
        warmup_started_at: a.warmup_details?.warmup_created_at, discovered_at: now.toISOString() } }));

    // Reuses the historical, idempotent portability importer. All acquisition
    // history is read; no rolling-window loss after a missed execution.
    const { staged, ...synced } = await sync({ db, smartleadGet: smartlead.get, campaignIds, dryRun, sequences,
      mailboxes: accounts.filter(a => states.has(Number(a.id))) });
    const real = realEvents(staged, accounts);
    const memberships = new Map();
    const campaigns = new Map();
    for (const id of campaignIds) {
      const list = await smartlead.get(`campaigns/${id}/email-accounts`);
      if (!Array.isArray(list)) throw new Error('Invalid campaign membership');
      memberships.set(id, new Set(list.map(a => Number(a.id))));
      campaigns.set(id, await smartlead.get(`campaigns/${id}`));
    }
    const unknownActiveCampaign = new Set();
    // Account-level limits cover all campaigns, so inspect every association.
    const allCampaigns = await smartlead.get('campaigns/');
    if (!Array.isArray(allCampaigns)) throw new Error('Invalid campaign list');
    for (const c of allCampaigns) if ((!controlledIds.includes(String(c.id)) && c.status === 'ACTIVE') ||
      (!campaignIds.includes(String(c.id)) && c.status === 'PAUSED')) {
      const list = await smartlead.get(`campaigns/${c.id}/email-accounts`);
      if (!Array.isArray(list)) throw new Error('Invalid other campaign membership');
      for (const a of list) unknownActiveCampaign.add(Number(a.id));
    }
    const blockedDomains = new Set(accounts.filter(a => states.get(Number(a.id))?.approved &&
      (a.is_smtp_success === false || a.is_imap_success === false || a.warmup_details?.blocked_reason ||
        states.get(Number(a.id))?.known_complaint || real.events.some(e => e.accountId === a.id && e.senderBounce)))
      .map(a => a.from_email.split('@')[1]));
    const decisions = [];
    for (const account of accounts) {
      const state = states.get(Number(account.id));
      if (!state?.approved) continue;
      const ownCampaigns = campaignIds.filter(id => memberships.get(id).has(Number(account.id)));
      const stats = await smartlead.get(`email-accounts/${account.id}/warmup-stats`);
      const metrics = metricsFor(account.id, real.events, now, state.stage_changed_at);
      state.pending_bounce_ids = [...new Set([...(state.pending_bounce_ids || []),
        ...real.events.filter(e => e.accountId === account.id && e.bounced).map(e => e.id)])];
      if (!dryRun) await checked(db.from('outbound_mailboxes').update({ state, updated_at: now.toISOString() }).eq('id', account.id));
      const daily = state.daily_plan?.version === 2;
      let decision = (daily ? decideDailyRamp : decideRamp)({ account, state, stats, metrics, now,
        complete: real.complete && !unknownActiveCampaign.has(Number(account.id)),
        domainBlocked: blockedDomains.has(account.from_email.split('@')[1]),
        campaignActive: ownCampaigns.some(id => controlledIds.includes(id) && campaigns.get(id).status === 'ACTIVE') });
      if (decision.action === 'stop' && unknownActiveCampaign.has(Number(account.id))) {
        decision = { ...decision, action: 'hold', reason: 'manual_stop_other_campaign_required' };
      }
      const summary = { mailboxId: account.id, ...decision, metrics: { attempted: metrics.attempted, bounced: metrics.bounced,
        cumulative: metrics.cumulative, effectiveDays: metrics.effectiveDays } };
      decisions.push(summary);
      if (!dryRun && daily) await checked(db.from('outbound_mailbox_daily').upsert({ mailbox_id: account.id,
        sending_date: sendingDate(now), run_id: runId, observed_cap: Number(account.message_per_day), planned_cap: decision.cap,
        baseline: decision.baseline, decision: decision.reason, metrics: summary.metrics,
        warmup: { sent: Number(stats.sent_count), inbox: Number(stats.inbox_count), spam: Number(stats.spam_count),
          latest: stats.stats_by_date?.map(s => s.date).sort().at(-1) || null } }, { onConflict: 'mailbox_id,sending_date' }));
      if (dryRun || decision.action === 'hold') continue;

      const pending = await checked(db.from('outbound_control_actions').insert({ run_id: runId, mailbox_id: account.id,
        action: decision.action, decision: summary, status: 'pending' }).select('id').single());
      try {
        if (decision.action === 'stop') {
          for (const id of ownCampaigns) {
            await smartlead.remove(`campaigns/${id}/email-accounts`, { email_account_ids: [account.id] });
            const after = await smartlead.get(`campaigns/${id}/email-accounts`);
            if (after.some(a => Number(a.id) === Number(account.id))) throw new Error('Stop verification failed');
            memberships.get(id).delete(Number(account.id));
          }
          state.stopped = true;
          state.previous_campaign_ids = ownCampaigns;
        } else {
          await smartlead.post(`email-accounts/${account.id}`, { max_email_per_day: decision.cap });
          const after = await smartlead.get(`email-accounts/${account.id}/`);
          if (Number(after.message_per_day) !== decision.cap) throw new Error('Cap verification failed');
          account.message_per_day = decision.cap;
          state.observed_cap = decision.cap;
          const deliveryReduction = decision.action === 'reduce' && decision.reason === 'bounce_rate';
          if (state.stage !== decision.stage || (daily ? deliveryReduction : decision.action === 'reduce')) state.stage_changed_at = now.toISOString();
          state.stage = decision.stage;
          state.cooldown = daily ? Boolean(deliveryReduction || (state.cooldown && metrics.effectiveDays < 5)) : decision.action === 'reduce';
          if (deliveryReduction) state.handled_bounce_ids = [...new Set([...(state.handled_bounce_ids || []), ...metrics.bounceIds])];
          if (daily) state.daily_plan = { ...state.daily_plan, baseline: decision.baseline, last_planned_date: decision.sendingDate };
          // Only a first admission to stage 2 can attach a previously unused box.
          if (!daily && decision.stage === 2 && !ownCampaigns.length && !state.ever_attached) {
            for (const id of controlledIds) {
              if (campaigns.get(id).status !== 'ACTIVE') throw new Error('Campaign not active');
              await smartlead.post(`campaigns/${id}/email-accounts`, { email_account_ids: [account.id] });
              const afterList = await smartlead.get(`campaigns/${id}/email-accounts`);
              if (!afterList.some(a => Number(a.id) === Number(account.id))) throw new Error('Membership verification failed');
              memberships.get(id).add(Number(account.id));
            }
            state.ever_attached = true;
          }
        }
        await checked(db.from('outbound_mailboxes').update({ state, updated_at: now.toISOString() }).eq('id', account.id));
        await checked(db.from('outbound_control_actions').update({ status: 'confirmed' }).eq('id', pending.id));
      } catch (error) {
        await checked(db.from('outbound_control_actions').update({ status: 'failed' }).eq('id', pending.id));
        throw error;
      }
    }
    // Reserve only follow-ups due from real send history. The provider schedule
    // accepts max_new_leads_per_day, not the historical max_leads_per_day.
    // Actual total sends remain bounded by each mailbox across all campaigns.
    const allowedIds = new Set(saved.filter(s => s.approved).map(s => Number(s.id)));
    const activeIds = new Set([...memberships.values()].flatMap(s => [...s]));
    const budget = accounts.filter(a => allowedIds.has(Number(a.id)) && activeIds.has(Number(a.id)) && !states.get(Number(a.id))?.stopped &&
      states.get(Number(a.id))?.stage > 0)
      .reduce((n, a) => n + Math.min(Number(a.message_per_day), Number(states.get(Number(a.id)).observed_cap)), 0);
    const sendingPlan=firstSendBudget({capacity:budget,day:sendingDate(now),staged,sequences,campaignIds:controlledIds});
    if (!dryRun && real.complete && budget > 0) for (let index = 0; index < controlledIds.length; index++) {
      const id = controlledIds[index], c = campaigns.get(id), ids = memberships.get(id);
      const schedule = c.scheduler_cron_value;
      const newLeadBudget = Math.max(controlledIds.length, sendingPlan.newLeads);
      const rotation = Math.floor(Date.parse(`${sendingDate(now)}T12:00:00Z`) / 86400000) % controlledIds.length;
      const cap = Math.floor(newLeadBudget / controlledIds.length) +
        ((index + rotation) % controlledIds.length < newLeadBudget % controlledIds.length ? 1 : 0);
      if ([...ids].some(a => !allowedIds.has(a) || unknownActiveCampaign.has(a)) || c.status !== 'ACTIVE' ||
          !schedule || schedule.tz !== 'America/New_York' || cap < 1 || Number(c.max_new_leads_per_day ?? c.max_leads_per_day) === cap) continue;
      const pending = await checked(db.from('outbound_control_actions').insert({ run_id: runId, action: 'campaign_new_lead_cap',
        decision: { campaignId: id, cap }, status: 'pending' }).select('id').single());
      await smartlead.post(`campaigns/${id}/schedule`, { timezone: schedule.tz, days_of_the_week: schedule.days,
        start_hour: schedule.startHour, end_hour: schedule.endHour, min_time_btw_emails: c.min_time_btwn_emails,
        max_new_leads_per_day: cap,
        ...(c.schedule_start_time ? { schedule_start_time: c.schedule_start_time } : {}) });
      const after = await smartlead.get(`campaigns/${id}`);
      if (Number(after.max_new_leads_per_day ?? after.max_leads_per_day) !== cap) throw new Error('Campaign cap verification failed');
      await checked(db.from('outbound_control_actions').update({ status: 'confirmed' }).eq('id', pending.id));
    }
    const result = { dryRun, synced, attributionComplete: real.complete, newCandidates: candidates.map(a => a.id), decisions, sendingPlan };
    await checked(db.from('outbound_control_runs').update({ status: 'success', finished_at: new Date().toISOString(), result }).eq('id', runId));
    finished = true;
    return { runId, ...result };
  } catch (error) {
    await checked(db.from('outbound_control_runs').update({ status: 'failed', finished_at: new Date().toISOString(),
      error_code: error.safeCode || 'CONTROL_FAILED_REVIEW_REQUIRED' }).eq('id', runId));
    finished = true;
    throw error;
  } finally {
    if (!finished) await checked(db.from('outbound_control_runs').update({ status: 'failed', finished_at: new Date().toISOString(),
      error_code: 'CONTROL_FAILED_REVIEW_REQUIRED' }).eq('id', runId));
    await checked(db.rpc('release_outbound_control', { run_id: runId }));
  }
}
