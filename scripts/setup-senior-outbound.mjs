import { readFile, writeFile, mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
import { createClient } from '@supabase/supabase-js';
import { createSmartlead } from '../supabase/functions/_shared/smartlead.mjs';
import { syncOutbound } from '../supabase/functions/_shared/outbound-sync.mjs';
import { loadSequencePlans } from './outbound-sequences.mjs';

const ref = 'lulnuqhgyqfkhjnuvpsd';
if (new URL(process.env.SUPABASE_URL).hostname !== `${ref}.supabase.co` ||
    (await readFile('supabase/.temp/project-ref','utf8')).trim() !== ref) throw new Error('Wrong Supabase project');
const directory = await mkdtemp(join(tmpdir(),'3xrep-senior-'));
const db = createClient(process.env.SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY,{auth:{persistSession:false}});
const smartlead = createSmartlead(process.env.SMARTLEAD_API_KEY);
const mailboxIds = [23568551,24049951,24049938,24049619];
async function checked(query) {
  for(let attempt=0;attempt<6;attempt++) {
    const {data,error}=await query;
    if(!error)return data;
    if(!['PGRST205','PGRST204'].includes(error.code)||attempt===5)throw new Error(`Database ${error.code}`);
    await new Promise(resolve=>setTimeout(resolve,1000));
  }
}
function cli(args) {
  try { return execFileSync('supabase',args,{encoding:'utf8',stdio:['ignore','pipe','pipe']}); }
  catch { throw new Error(`Supabase ${args.slice(0,2).join(' ')} failed`); }
}
async function sql(query) {
  const path = join(directory,'query.sql'); await writeFile(path,query,{mode:0o600});
  return JSON.parse(cli(['db','query','--linked','--file',path,'--output','json'])).rows;
}
const quote=value=>`'${value.replaceAll("'","''")}'`;
try {
  const version='20261013200000';
  const installed=await sql(`select version from supabase_migrations.schema_migrations where version='${version}';`);
  if (!installed.length) {
    const migration=await readFile(`supabase/migrations/${version}_outbound_sequences_and_daily_plan.sql`,'utf8');
    await sql(`begin;\n${migration}\ninsert into supabase_migrations.schema_migrations(version,name,statements) values('${version}','outbound_sequences_and_daily_plan',array[${quote(migration)}]);\ncommit;`);
    console.log('Installed only the sequence and daily-plan migration.');
  }
  await sql("notify pgrst, 'reload schema';");
  const plans=await loadSequencePlans();
  const all=await smartlead.get('campaigns/');
  for (const plan of plans) {
    let existing=await checked(db.from('outbound_sequences').select('*').eq('id',plan.id).maybeSingle());
    if (existing && existing.content_hash!==plan.content_hash) throw new Error('Published sequence version differs; create a new version');
    if (!existing) existing=await checked(db.from('outbound_sequences').insert({id:plan.id,cohort:plan.cohort,variant:plan.variant,version:plan.version,
      acquisition_campaign:plan.acquisition_campaign,content_hash:plan.content_hash,steps:plan.steps}).select('*').single());
    let id=existing.provider_campaign_id;
    if (!id) {
      const named=all.filter(c=>c.name===plan.name);
      if (named.length>1) throw new Error('Ambiguous campaign recovery');
      id=String(named[0]?.id || (await smartlead.post('campaigns/create',{name:plan.name})).id);
      if (!/^\d+$/.test(id)) throw new Error('Invalid campaign creation response');
      await checked(db.from('outbound_sequences').update({provider_campaign_id:id}).eq('id',plan.id));
    }
    const campaign=await smartlead.get(`campaigns/${id}`);
    if (!['DRAFTED','PAUSED'].includes(campaign.status)) throw new Error('Refusing to edit a running campaign');
    const leads=await smartlead.get(`campaigns/${id}/leads`,{limit:1,offset:0});
    if (Number(leads.total_leads)>0) throw new Error('Refusing to rewrite an enrolled sequence');
    // A and B use separate campaigns. Each step has a single body; no provider
    // experiment/winner selection can reshuffle the assigned sequence.
    await smartlead.post(`campaigns/${id}/sequences`,{sequences:plan.steps.map(step=>({seq_number:step.seq_number,
      seq_delay_details:step.seq_delay_details,subject:step.variants[0].subject,email_body:step.variants[0].email_body}))});
    const saved=await smartlead.get(`campaigns/${id}/sequences`);
    const steps=Array.isArray(saved)?saved:saved.sequences;
    if (!Array.isArray(steps)||steps.length!==4) throw new Error('Sequence count verification failed');
    for (let i=0;i<4;i++) {
      const actual=steps.find(s=>Number(s.seq_number)===i+1);
      const variants=actual?.sequence_variants||actual?.variants;
      const expected=plan.steps[i];
      const matching = (actual?.subject===expected.variants[0].subject && actual?.email_body===expected.variants[0].email_body) ||
        variants?.some(v=>v.subject===expected.variants[0].subject && v.email_body===expected.variants[0].email_body);
      if (!actual || Number(actual.seq_delay_details?.delay_in_days)!==expected.seq_delay_details.delay_in_days || !matching) throw new Error('Sequence content verification failed');
    }
    await smartlead.post(`campaigns/${id}/settings`,{track_settings:['DONT_LINK_CLICK'],stop_lead_settings:'REPLY_TO_AN_EMAIL',
      follow_up_percentage:100,send_as_plain_text:false,force_plain_text:false,enable_ai_esp_matching:false,
      unsubscribe_text:'Unsubscribe',add_unsubscribe_tag:true});
    await smartlead.post(`campaigns/${id}/schedule`,{timezone:'America/New_York',days_of_the_week:[1,2,3,4,5],
      start_hour:'09:00',end_hour:'17:00',min_time_btw_emails:3,
      max_new_leads_per_day:plan.variant==='A'?3:2});
    await smartlead.post(`campaigns/${id}/email-accounts`,{email_account_ids:mailboxIds});
    const after=await smartlead.get(`campaigns/${id}`);
    const attached=await smartlead.get(`campaigns/${id}/email-accounts`);
    if (after.status==='ACTIVE'||after.track_settings.includes('DONT_EMAIL_OPEN')||after.stop_lead_settings!=='REPLY_TO_AN_EMAIL'||
      !mailboxIds.every(i=>attached.some(a=>Number(a.id)===i))) throw new Error('Campaign settings verification failed');
    await checked(db.from('outbound_sequences').update({controlled:true}).eq('id',plan.id));
    console.log(JSON.stringify({sequence:plan.id,campaign:id,status:after.status,steps:4,mailboxes:attached.length}));
  }
  const accounts=await smartlead.get('email-accounts/',{limit:100,offset:0});
  const saved=await checked(db.from('outbound_mailboxes').select('*'));
  // Bootstrap once, not at every deployment: preserve recovery and daily progress.
  for (const id of mailboxIds) {
    const account=accounts.find(a=>Number(a.id)===id),row=saved.find(a=>Number(a.id)===id);
    if (!account||!row) throw new Error('Approved mailbox missing');
    if (!row.state.daily_plan) {
      const current=Number(account.message_per_day);
      if (!Number.isInteger(current)||current<1||current>43) throw new Error('Invalid starting cap');
      await checked(db.from('outbound_mailboxes').update({state:{...row.state,stage:current,observed_cap:current,
        stage_changed_at:new Date().toISOString(),ever_attached:true,
        daily_plan:{version:2,target:43,baseline:current,started_at:new Date().toISOString()}},updated_at:new Date().toISOString()}).eq('id',id));
    }
  }
  // Review only delivery notifications, save codes and suppression evidence, never bodies.
  const {staged}=await syncOutbound({smartleadGet:smartlead.get,campaignIds:['4023139','4023140'],dryRun:true});
  const reviewed=[];
  for (const c of staged) for (const x of c.entries) {
    if (x.entry.status!=='BLOCKED') continue;
    const bounced=x.stats.filter(s=>s.is_bounced&&!s.sender_bounce);
    if (!bounced.length) continue;
    const history=await smartlead.get(`campaigns/${c.campaignId}/leads/${x.entry.lead.id}/message-history`);
    const notifications=JSON.stringify(history.history.filter(e=>e.type==='REPLY'));
    const code=/5\.1\.1/.test(notifications)?'5.1.1':/5\.2\.1/.test(notifications)?'5.2.1':null;
    if (!code||/5\.7\.[0-9]|spam|policy block/i.test(notifications)) continue;
    for (const stat of bounced) {
      const sent=history.history.find(e=>e.type==='SENT'&&String(e.stats_id)===String(stat.stats_id));
      const source=accounts.find(a=>sent?.from?.toLowerCase().includes(a.from_email.toLowerCase()));
      if (source && mailboxIds.includes(Number(source.id))) reviewed.push({mailbox:Number(source.id),id:String(stat.stats_id),code,reason:'recipient_unavailable',suppressed:true});
    }
  }
  for (const id of mailboxIds) {
    const own=reviewed.filter(r=>r.mailbox===id); if (!own.length) continue;
    const row=await checked(db.from('outbound_mailboxes').select('*').eq('id',id).single());
    await checked(db.from('outbound_mailboxes').update({state:{...row.state,
      resolved_bounce_ids:[...new Set([...(row.state.resolved_bounce_ids||[]),...own.map(x=>x.id)])],
      bounce_reviews:[...(row.state.bounce_reviews||[]).filter(x=>!own.some(y=>y.id===x.id)),...own.map(({id,code,reason,suppressed})=>({id,code,reason,suppressed,reviewed_at:new Date().toISOString()}))]
    }}).eq('id',id));
  }
  console.log(JSON.stringify({reviewedSuppressedRecipientBounces:reviewed.length}));

  const secretRows=await sql("select decrypted_secret from vault.decrypted_secrets where name='3xrep_outbound_cron_secret';");
  const secret=secretRows[0]?.decrypted_secret;if(!secret)throw new Error('Existing cron secret missing');
  const secretFile=join(directory,'smartlead.env');await writeFile(secretFile,`SMARTLEAD_API_KEY=${process.env.SMARTLEAD_API_KEY}\n`,{mode:0o600});
  cli(['secrets','set','--project-ref',ref,'--env-file',secretFile]);
  cli(['functions','deploy','outbound-control','--project-ref',ref,'--use-api']);
  const endpoint=`${process.env.SUPABASE_URL}/functions/v1/outbound-control`;
  const unauthorized=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:'{}'});
  if(unauthorized.status!==401)throw new Error('Unauthorized call not rejected');
  for(const dryRun of[true,false]) {
    const r=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json','x-outbound-secret':secret},body:JSON.stringify({dryRun}),signal:AbortSignal.timeout(135000)});
    if(!r.ok)throw new Error(`Hosted control HTTP ${r.status}`);
    const data=await r.json();if(!data.runId||data.attributionComplete!==true)throw new Error('Control not fully verified');
    console.log(JSON.stringify({runId:data.runId,dryRun,synced:data.synced,decisions:data.decisions.map(({mailboxId,cap,reason})=>({mailboxId,cap,reason}))}));
  }
  const jobs=await sql("select jobname,active,schedule from cron.job where jobname='3xrep-outbound-cloud-01h';");
  if(!jobs.some(j=>j.active))throw new Error('Daily schedule missing or paused');
  console.log(JSON.stringify({dailyJobs:jobs}));
} finally { await rm(directory,{recursive:true,force:true}); }
