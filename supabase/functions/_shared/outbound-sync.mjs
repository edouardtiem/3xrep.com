import { senderEmail } from './ramp-up.mjs';

export async function syncOutbound({ db, smartleadGet, campaignIds, dryRun = false, sequences = [], mailboxes = [] }) {
const sequenceByCampaign = new Map(sequences.map(s => [String(s.provider_campaign_id), s.id]));
const mailboxByEmail = new Map(mailboxes.map(a => [a.from_email.toLowerCase(), Number(a.id)]));
const dateOrNull = value => value && Number.isFinite(Date.parse(value)) ? new Date(value).toISOString() : null;
async function getCampaignLeads(campaignId) {
  const leads = [];
  const limit = 100;
  for (let offset = 0; ; offset += limit) {
    const page = await smartleadGet(`campaigns/${campaignId}/leads`, { limit, offset });
    if (!Array.isArray(page.data)) throw new Error(`Invalid lead list for campaign ${campaignId}`);
    leads.push(...page.data);
    if (page.data.length === 0 || leads.length >= Number(page.total_leads)) break;
  }
  return leads;
}

async function getCampaignStats(campaignId) {
  const byEmail = new Map();
  const limit = 100;
  let count = 0;
  for (let offset = 0; ; offset += limit) {
    const page = await smartleadGet(`campaigns/${campaignId}/statistics`, { limit, offset });
    if (!Array.isArray(page.data)) throw new Error(`Invalid statistics for campaign ${campaignId}`);
    for (const stat of page.data) {
      const email = stat.lead_email?.trim().toLowerCase();
      if (!email) continue;
      if (!byEmail.has(email)) byEmail.set(email, []);
      byEmail.get(email).push(stat);
    }
    count += page.data.length;
    if (page.data.length === 0 || count >= Number(page.total_stats)) break;
  }
  return byEmail;
}

function companyDomain(lead) {
  for (const value of [lead.website, lead.company_url, lead.email?.split('@')[1]]) {
    if (!value) continue;
    try {
      const hostname = new URL(value.includes('://') ? value : `https://${value}`).hostname;
      if (hostname.includes('.')) return hostname.toLowerCase().replace(/^www\./, '');
    } catch {
      // A missing or malformed website does not prevent the contact from syncing.
    }
  }
  return null;
}

async function getExistingProspects() {
  const byEmail = new Map();
  for (let offset = 0; ; offset += 1000) {
    const { data, error } = await db.from('outbound_prospects')
      .select('id,email,source,source_contact_id,first_name,last_name,full_name,job_title,company,company_domain,location,linkedin_url,email_verification_status')
      .range(offset, offset + 999);
    if (error) throw error;
    for (const row of data) byEmail.set(row.email.trim().toLowerCase(), row);
    if (data.length < 1000) break;
  }
  return byEmail;
}

function prospectFields(lead) {
  const firstName = lead.first_name?.trim() || null;
  const lastName = lead.last_name?.trim() || null;
  const verification = lead.custom_fields?.email_verification;
  return {
    first_name: firstName,
    last_name: lastName,
    full_name: [firstName, lastName].filter(Boolean).join(' ') || null,
    job_title: lead.custom_fields?.job_title || null,
    company: lead.company_name || null,
    company_domain: companyDomain(lead),
    location: lead.location || null,
    linkedin_url: lead.linkedin_profile || null,
    email_verification_status: typeof verification === 'string' ? verification : null,
  };
}

async function saveProspect(lead, byEmail) {
  const email = lead.email?.trim().toLowerCase();
  if (!email || !email.includes('@')) throw new Error('Smartlead returned a lead without a valid email field');
  const existing = byEmail.get(email);
  const fields = prospectFields(lead);
  if (existing) {
    const updates = {};
    for (const [key, value] of Object.entries(fields)) {
      if (value && !existing[key]) updates[key] = value;
    }
    if (existing.source === 'smartlead' && !existing.source_contact_id) {
      updates.source_contact_id = String(lead.id);
    }
    if (Object.keys(updates).length) {
      const { error } = await db.from('outbound_prospects').update(updates).eq('id', existing.id);
      if (error) throw error;
      Object.assign(existing, updates);
    }
    return { id: existing.id, inserted: false };
  }

  const row = {
    email,
    ...fields,
    source: 'smartlead',
    source_contact_id: String(lead.id),
    status: 'to_contact',
  };
  const { data, error } = await db.from('outbound_prospects').insert(row).select('id').single();
  if (error) throw error;
  byEmail.set(email, { id: data.id, email, ...row });
  return { id: data.id, inserted: true };
}

function membershipRow(campaignId, entry, prospectId, sent, stats) {
  const sentTimes = sent.map((event) => Date.parse(event.time)).filter(Number.isFinite);
  const firstSentAt = sentTimes.length ? new Date(Math.min(...sentTimes)).toISOString() : null;
  const replyTimes = stats
    .filter((stat) => !stat.is_bounced && !stat.ignore_reply && stat.reply_time)
    .map((stat) => Date.parse(stat.reply_time))
    .filter(Number.isFinite);
  return {
    prospect_id: prospectId,
    provider: 'smartlead',
    provider_campaign_id: campaignId,
    provider_lead_id: String(entry.lead.id),
    provider_campaign_lead_map_id: String(entry.campaign_lead_map_id),
    status: entry.status,
    lead_category_id: entry.lead_category_id == null ? null : String(entry.lead_category_id),
    first_sent_at: firstSentAt,
    is_bounced: stats.some((stat) => stat.is_bounced === true),
    is_unsubscribed: stats.some((stat) => stat.is_unsubscribed === true),
    last_reply_at: replyTimes.length ? new Date(Math.max(...replyTimes)).toISOString() : null,
    last_synced_at: new Date().toISOString(),
    ...(sequenceByCampaign.has(String(campaignId)) ? { sequence_id: sequenceByCampaign.get(String(campaignId)) } : {}),
  };
}

function eventRows(membershipId, sent, stats) {
  return sent.map((event) => {
    const stat = stats.find(s => String(s.stats_id) === String(event.stats_id));
    const step = Number(event.email_seq_number ?? stat?.sequence_number);
    return {
    campaign_lead_id: membershipId,
    provider_message_id: String(event.message_id || event.stats_id),
    sequence_step: Number.isInteger(step) && step > 0 ? step : null,
    sent_at: new Date(event.time).toISOString(),
    ...(mailboxes.length ? {
      mailbox_id: mailboxByEmail.get(senderEmail(event.from)) || null,
      provider_stats_id: event.stats_id == null ? null : String(event.stats_id),
      opened_at: dateOrNull(stat?.open_time),
      clicked_at: dateOrNull(stat?.click_time),
      replied_at: stat?.is_bounced || stat?.ignore_reply ? null : dateOrNull(stat?.reply_time),
      is_bounced: stat?.is_bounced === true,
    } : {}),
  }; });
}

// Reuse only sender attribution already proved from provider message history.
// Statistics are still replayed in full, so late opens/replies and missed runs
// remain visible. Any new or unidentified send requires a fresh history read.
async function getKnownSends() {
  const known = new Map();
  if (!db || !mailboxes.length) return known;
  const emailByMailbox = new Map(mailboxes.map(a => [Number(a.id), a.from_email]));
  for (let offset = 0; ; offset += 1000) {
    const { data, error } = await db.from('outbound_send_events')
      .select('provider_message_id,provider_stats_id,sequence_step,sent_at,mailbox_id,outbound_campaign_leads!inner(provider_campaign_id,provider_lead_id)')
      .in('outbound_campaign_leads.provider_campaign_id', campaignIds).order('id').range(offset, offset + 999);
    if (error) throw error;
    for (const row of data) {
      const membership = row.outbound_campaign_leads;
      const key = `${membership.provider_campaign_id}:${membership.provider_lead_id}`;
      if (!known.has(key)) known.set(key, []);
      known.get(key).push({ type: 'SENT', message_id: row.provider_message_id, stats_id: row.provider_stats_id,
        email_seq_number: row.sequence_step, time: row.sent_at, from: emailByMailbox.get(Number(row.mailbox_id)) });
    }
    if (data.length < 1000) break;
  }
  return known;
}

const knownSends = await getKnownSends();
const staged = [];
for (const campaignId of campaignIds) {
  const leads = await getCampaignLeads(campaignId);
  const statsByEmail = await getCampaignStats(campaignId);
  const entries = [];
  for (const entry of leads) {
    if (!entry.lead?.id || !entry.lead.email) throw new Error(`Incomplete lead in campaign ${campaignId}`);
    let sent = [];
    if (entry.status !== 'STARTED') {
      const stats = statsByEmail.get(entry.lead.email.trim().toLowerCase()) || [];
      const sentStats = stats.filter(s => s.sent_time);
      const known = knownSends.get(`${campaignId}:${entry.lead.id}`);
      const complete = known?.length === sentStats.length && known.every(event => event.from && event.stats_id &&
        sentStats.some(stat => String(stat.stats_id) === String(event.stats_id))) &&
        sentStats.every(stat => known.some(event => String(event.stats_id) === String(stat.stats_id)));
      if (complete) {
        sent = known;
      } else {
        const history = await smartleadGet(`campaigns/${campaignId}/leads/${entry.lead.id}/message-history`);
        if (!Array.isArray(history.history)) throw new Error(`Invalid message history in campaign ${campaignId}`);
        sent = history.history.filter((event) => event.type === 'SENT' && (event.message_id || event.stats_id) && Number.isFinite(Date.parse(event.time)));
      }
    }
    entries.push({ entry, sent, stats: statsByEmail.get(entry.lead.email.trim().toLowerCase()) || [] });
  }
  staged.push({ campaignId, entries });
}

const totals = {
  campaigns: staged.length,
  campaignLeads: staged.reduce((sum, item) => sum + item.entries.length, 0),
  sentMessages: staged.reduce((sum, item) => sum + item.entries.reduce((n, x) => n + x.sent.length, 0), 0),
  bouncedLeads: staged.reduce((sum, item) => sum + item.entries.filter((x) => x.stats.some((stat) => stat.is_bounced === true)).length, 0),
  insertedProspects: 0,
  matchedProspects: 0,
};

if (!dryRun) {
  const byEmail = await getExistingProspects();
  const pending = [];
  for (const { campaignId, entries } of staged) {
    for (const { entry, sent, stats } of entries) {
      const saved = await saveProspect(entry.lead, byEmail);
      totals[saved.inserted ? 'insertedProspects' : 'matchedProspects']++;
      pending.push({ row: membershipRow(campaignId, entry, saved.id, sent, stats), sent, stats });
    }
  }
  for (let offset = 0; offset < pending.length; offset += 250) {
    const batch = pending.slice(offset, offset + 250);
    const { data, error } = await db.from('outbound_campaign_leads')
      .upsert(batch.map(x => x.row), { onConflict: 'provider,provider_campaign_id,prospect_id' })
      .select('id,provider_campaign_id,prospect_id');
    if (error) throw error;
    const ids = new Map(data.map(x => [`${x.provider_campaign_id}:${x.prospect_id}`, x.id]));
    const events = batch.flatMap(x => {
      const id = ids.get(`${x.row.provider_campaign_id}:${x.row.prospect_id}`);
      if (!id) throw new Error('Missing membership after upsert');
      return eventRows(id, x.sent, x.stats);
    });
    for (let at = 0; at < events.length; at += 500) {
      const { error: eventError } = await db.from('outbound_send_events')
        .upsert(events.slice(at, at + 500), { onConflict: 'campaign_lead_id,provider_message_id' });
      if (eventError) throw eventError;
    }
  }
}

return { dryRun, ...totals, staged };

}
