// Import only a caller-approved, qualified and verified list already in Supabase.
// This command finds no contacts, changes no campaign status and sends no replies.
import { createClient } from '@supabase/supabase-js';
import { createSmartlead } from '../supabase/functions/_shared/smartlead.mjs';
import { syncOutbound } from '../supabase/functions/_shared/outbound-sync.mjs';
import { CAMPAIGNS } from '../supabase/functions/_shared/ramp-up.mjs';

const ids=process.argv.slice(2).filter(a=>a!=='--dry-run');
const dryRun=process.argv.includes('--dry-run');
if(!ids.length||ids.some(id=>!/^[a-f0-9-]{36}$/i.test(id)))throw new Error('Provide approved Supabase prospect UUIDs');
if(new URL(process.env.SUPABASE_URL).hostname!=='lulnuqhgyqfkhjnuvpsd.supabase.co')throw new Error('Wrong project');
const db=createClient(process.env.SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY,{auth:{persistSession:false}});
const smartlead=createSmartlead(process.env.SMARTLEAD_API_KEY);
async function checked(query){const {data,error}=await query;if(error)throw new Error(`Database ${error.code}`);return data;}
const sequences=await checked(db.from('outbound_sequences').select('*').eq('cohort','senior-beta-2026-10-13'));
let imported=0;
for(const id of [...new Set(ids)]) {
  const p=await checked(db.from('outbound_prospects').select('*').eq('id',id).single());
  if(!p.qualified_for_senior_beta||!['valid','verified'].includes(p.email_verification_status?.toLowerCase())||!p.company_domain||!p.first_name)throw new Error('Contact is not qualified, verified and complete');
  const history=await checked(db.from('outbound_campaign_leads').select('first_sent_at,is_bounced,is_unsubscribed,last_reply_at').eq('prospect_id',id));
  if(history.some(x=>x.first_sent_at||x.is_bounced||x.is_unsubscribed||x.last_reply_at))throw new Error('Contact already approached or suppressed');
  if(dryRun)continue;
  const assigned=await checked(db.rpc('assign_senior_beta_sequence',{prospect_uuid:id}));
  const s=sequences.find(s=>s.id===assigned);if(!s?.provider_campaign_id)throw new Error('Sequence not prepared');
  const campaign=await smartlead.get(`campaigns/${s.provider_campaign_id}`);
  if(!['DRAFTED','PAUSED'].includes(campaign.status))throw new Error('Import requires a non-running campaign; launch is a separate operation');
  const result=await smartlead.post(`campaigns/${s.provider_campaign_id}/leads`,{lead_list:[{email:p.email,first_name:p.first_name,last_name:p.last_name||'',
    company_name:p.company||'',website:p.company_domain,custom_fields:{job_title:p.job_title||'',email_verification:p.email_verification_status,sequence_version:s.id}}],
    settings:{ignore_global_block_list:false,ignore_unsubscribe_list:false,ignore_duplicate_leads_in_other_campaign:false}});
  if(result.ok===false)throw new Error('Provider refused contact import');
  imported++;
}
if(!dryRun) {
  const mailboxes=await checked(db.from('outbound_mailboxes').select('id,email'));
  const campaignIds=[...new Set([...CAMPAIGNS,...sequences.map(s=>s.provider_campaign_id).filter(Boolean)])];
  const {staged,...totals}=await syncOutbound({db,smartleadGet:smartlead.get,campaignIds,sequences,
    mailboxes:mailboxes.map(m=>({id:m.id,from_email:m.email}))});
  void staged;console.log(JSON.stringify({imported,synced:totals}));
}else console.log(JSON.stringify({dryRun:true,qualifiedVerifiedContacts:ids.length}));
