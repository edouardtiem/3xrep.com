import { createClient } from '@supabase/supabase-js';

const campaignIds = process.argv.slice(2).filter((arg) => arg !== '--dry-run');
const dryRun = process.argv.includes('--dry-run');

if (campaignIds.length === 0 || campaignIds.some((id) => !/^\d+$/.test(id))) {
  console.error('Usage: node --env-file=.env.local scripts/sync-smartlead-outbound.mjs [--dry-run] CAMPAIGN_ID ...');
  process.exit(1);
}

for (const name of ['SMARTLEAD_API_KEY', 'SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY']) {
  if (!process.env[name]) throw new Error(`${name} is required`);
}

const db = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

async function smartleadGet(path, params = {}) {
  const url = new URL(`https://server.smartlead.ai/api/v1/${path}`);
  url.searchParams.set('api_key', process.env.SMARTLEAD_API_KEY);
  for (const [key, value] of Object.entries(params)) url.searchParams.set(key, String(value));
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Smartlead HTTP ${response.status} on ${path}`);
  return response.json();
}

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

async function saveMembership(campaignId, entry, prospectId, sent, stats) {
  const sentTimes = sent.map((event) => Date.parse(event.time)).filter(Number.isFinite);
  const firstSentAt = sentTimes.length ? new Date(Math.min(...sentTimes)).toISOString() : null;
  const replyTimes = stats
    .filter((stat) => !stat.is_bounced && stat.reply_time)
    .map((stat) => Date.parse(stat.reply_time))
    .filter(Number.isFinite);
  const row = {
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
  };
  const { data, error } = await db.from('outbound_campaign_leads')
    .upsert(row, { onConflict: 'provider,provider_campaign_id,prospect_id' })
    .select('id').single();
  if (error) throw error;

  const events = sent.map((event) => ({
    campaign_lead_id: data.id,
    provider_message_id: String(event.message_id || event.stats_id),
    sequence_step: Number.isInteger(Number(event.email_seq_number)) ? Number(event.email_seq_number) : null,
    sent_at: new Date(event.time).toISOString(),
  }));
  if (events.length) {
    const { error: eventError } = await db.from('outbound_send_events')
      .upsert(events, { onConflict: 'campaign_lead_id,provider_message_id', ignoreDuplicates: true });
    if (eventError) throw eventError;
  }
}

const staged = [];
for (const campaignId of campaignIds) {
  const leads = await getCampaignLeads(campaignId);
  const statsByEmail = await getCampaignStats(campaignId);
  const entries = [];
  for (const entry of leads) {
    if (!entry.lead?.id || !entry.lead.email) throw new Error(`Incomplete lead in campaign ${campaignId}`);
    let sent = [];
    if (entry.status !== 'STARTED') {
      const history = await smartleadGet(`campaigns/${campaignId}/leads/${entry.lead.id}/message-history`);
      if (!Array.isArray(history.history)) throw new Error(`Invalid message history in campaign ${campaignId}`);
      sent = history.history.filter((event) => event.type === 'SENT' && (event.message_id || event.stats_id) && Number.isFinite(Date.parse(event.time)));
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
  for (const { campaignId, entries } of staged) {
    for (const { entry, sent, stats } of entries) {
      const saved = await saveProspect(entry.lead, byEmail);
      totals[saved.inserted ? 'insertedProspects' : 'matchedProspects']++;
      await saveMembership(campaignId, entry, saved.id, sent, stats);
    }
  }
}

console.log(JSON.stringify({ dryRun, ...totals }));
