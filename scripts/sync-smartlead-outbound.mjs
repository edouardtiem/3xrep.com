import { createClient } from '@supabase/supabase-js';
import { syncOutbound } from '../supabase/functions/_shared/outbound-sync.mjs';
import { createSmartlead } from '../supabase/functions/_shared/smartlead.mjs';

const campaignIds = process.argv.slice(2).filter(arg => arg !== '--dry-run');
if (!campaignIds.length || campaignIds.some(id => !/^\d+$/.test(id))) {
  console.error('Usage: node --env-file=.env.local scripts/sync-smartlead-outbound.mjs [--dry-run] CAMPAIGN_ID ...');
  process.exit(1);
}
for (const name of ['SMARTLEAD_API_KEY', 'SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY']) {
  if (!process.env[name]) throw new Error(`${name} is required`);
}
const db = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });
const smartlead = createSmartlead(process.env.SMARTLEAD_API_KEY);
const { data: sequences, error } = await db.from('outbound_sequences').select('id,provider_campaign_id');
if (error) throw new Error(`Sequence registry ${error.code}`);
const { data: mailboxes, error: mailboxError } = await db.from('outbound_mailboxes').select('id,email');
if (mailboxError) throw new Error(`Mailbox registry ${mailboxError.code}`);
const { staged, ...totals } = await syncOutbound({ db, smartleadGet: smartlead.get, campaignIds,
  sequences: sequences || [], mailboxes: (mailboxes || []).map(m => ({id:m.id,from_email:m.email})),
  dryRun: process.argv.includes('--dry-run') });
void staged;
console.log(JSON.stringify(totals));
