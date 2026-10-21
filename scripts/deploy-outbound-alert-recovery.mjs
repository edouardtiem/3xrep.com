// Deploy the general recovery rule and apply only delivery actions now.
import {readFile,writeFile,mkdtemp,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';import {join} from 'node:path';import {execFileSync} from 'node:child_process';import {isDeepStrictEqual} from 'node:util';
import {createClient} from '@supabase/supabase-js';
import {createSmartlead} from '../supabase/functions/_shared/smartlead.mjs';
import {runOutboundControl} from '../supabase/functions/_shared/outbound-control.mjs';
import {DAILY_RAMP_POLICY} from '../supabase/functions/_shared/daily-ramp.mjs';
const ref='lulnuqhgyqfkhjnuvpsd',version='20261021190000',name='outbound_alert_recovery',mailboxId=23568551;
if(new URL(process.env.SUPABASE_URL).hostname!==`${ref}.supabase.co`||(await readFile('supabase/.temp/project-ref','utf8')).trim()!==ref)throw Error('Wrong project');
const directory=await mkdtemp(join(tmpdir(),'3xrep-alert-recovery-'));
const db=createClient(process.env.SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY,{auth:{persistSession:false}}),smartlead=createSmartlead(process.env.SMARTLEAD_API_KEY);
function cli(args){try{return execFileSync('supabase',args,{encoding:'utf8',stdio:['ignore','pipe','pipe']});}catch{throw Error(`Supabase ${args.slice(0,2).join(' ')} failed`);}}
async function sql(query){const file=join(directory,'query.sql');await writeFile(file,query,{mode:0o600});return JSON.parse(cli(['db','query','--linked','--file',file,'--output','json'])).rows;}
async function checked(q){const {data,error}=await q;if(error)throw Error(`Database ${error.code}`);return data;}
try{
 const before=await checked(db.from('outbound_mailboxes').select('id,state'));
 const beforeAccounts=await smartlead.get('email-accounts/',{limit:100,offset:0});
 if(!(await sql(`select version from supabase_migrations.schema_migrations where version='${version}';`)).length){
  const source=await readFile(`supabase/migrations/${version}_${name}.sql`,'utf8');
  await sql(`begin;${source}\ninsert into supabase_migrations.schema_migrations(version,name,statements) values('${version}','${name}',array['${source.replaceAll("'","''")}']);commit;`);
 }
 cli(['functions','deploy','outbound-control','--project-ref',ref,'--use-api']);
 const secret=(await sql("select decrypted_secret from vault.decrypted_secrets where name='3xrep_outbound_cron_secret';"))[0]?.decrypted_secret;
 if(!secret)throw Error('Missing trigger secret');
 const endpoint=process.env.SUPABASE_URL+'/functions/v1/outbound-control';
 const denied=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:'{}'});
 if(denied.status!==401)throw Error('Unauthorized control accepted');
 const response=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json','x-outbound-secret':secret},body:JSON.stringify({dryRun:true}),signal:AbortSignal.timeout(120000)});
 if(!response.ok)throw Error(`Hosted HTTP ${response.status}`);
 const dry=await response.json();if(!dry.attributionComplete||dry.decisions?.some(d=>d.policy!==DAILY_RAMP_POLICY))throw Error('Hosted policy proof incomplete');
 const predicted=dry.decisions.find(d=>d.mailboxId===mailboxId);if(predicted?.cap!==7||predicted.action==='stop')throw Error('Mailbox is not ready for recovery');
 const leads=await smartlead.get('campaigns/4139326/leads',{limit:100,offset:0});
 const bounced=leads.data.find(e=>e.lead.id===4749849096);
 if(!bounced||['STARTED','INPROGRESS'].includes(bounced.status))throw Error('Failed recipient is still sendable');
 const sequences=await checked(db.from('outbound_sequences').select('id,provider_campaign_id,controlled,steps').not('provider_campaign_id','is',null));
 const actual=await runOutboundControl({db,smartlead,sequences,alertsOnly:true});
 if(!actual.attributionComplete)throw Error('Applied control incomplete');
 const after=await checked(db.from('outbound_mailboxes').select('id,state'));
 const main=after.find(r=>r.id===mailboxId);
 if(main?.state.stopped||main?.state.observed_cap!==7)throw Error('Recovery not confirmed');
 for(const row of before.filter(r=>r.id!==mailboxId)){
  const state=after.find(r=>r.id===row.id)?.state;
  if(!state||state.observed_cap!==row.state.observed_cap||state.stage_changed_at!==row.state.stage_changed_at||!isDeepStrictEqual(state.daily_plan,row.state.daily_plan))throw Error('Healthy mailbox progression changed during immediate recovery');
 }
 const accounts=await smartlead.get('email-accounts/',{limit:100,offset:0});
 if(accounts.find(a=>a.id===mailboxId)?.message_per_day!==7)throw Error('Native cap not seven');
 for(const a of beforeAccounts.filter(a=>a.id!==mailboxId))if(accounts.find(b=>b.id===a.id)?.message_per_day!==a.message_per_day)throw Error('Unrelated native cap changed');
 const memberships=[];for(const id of ['4139326','4139384','4023139','4023140']){
  const present=(await smartlead.get(`campaigns/${id}/email-accounts`)).some(a=>a.id===mailboxId);
  if(present!==['4139326','4139384'].includes(id))throw Error('Unexpected recovery campaign association');memberships.push({campaign:id,present});
 }
 console.log(JSON.stringify({dryRunId:dry.runId,runId:actual.runId,policy:DAILY_RAMP_POLICY,recipientExcluded:true,healthyProgressPreserved:true,cap:main.state.observed_cap,recoveryTarget:main.state.daily_plan.recovery_target,sendingPlan:actual.sendingPlan,memberships,decisions:actual.decisions.map(d=>({id:d.mailboxId,cap:d.cap,reason:d.reason})),cron:await sql("select jobname,active,position('Europe/Paris' in command)>0 as paris_guard from cron.job where jobname='3xrep-outbound-cloud-01h';")}));
}finally{await rm(directory,{recursive:true,force:true});}
