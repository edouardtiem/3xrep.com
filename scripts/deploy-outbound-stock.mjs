// Apply only this session's stock/cap migrations and redeploy the existing job.
// No token rotation, campaign activation or mailbox admission.
import {readFile,writeFile,mkdtemp,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {execFileSync} from 'node:child_process';
const ref='lulnuqhgyqfkhjnuvpsd';
if(new URL(process.env.SUPABASE_URL).hostname!==`${ref}.supabase.co`||(await readFile('supabase/.temp/project-ref','utf8')).trim()!==ref)throw Error('Wrong project');
const directory=await mkdtemp(join(tmpdir(),'3xrep-stock-deploy-'));
function cli(args){try{return execFileSync('supabase',args,{encoding:'utf8',stdio:['ignore','pipe','pipe']});}catch{throw Error(`Supabase ${args.slice(0,2).join(' ')} failed`);}}
async function sql(query){const file=join(directory,'query.sql');await writeFile(file,query,{mode:0o600});return JSON.parse(cli(['db','query','--linked','--file',file,'--output','json'])).rows;}
try{
 for(const [version,name] of [['20261014000000','outbound_verifier_daily_cap'],['20261014010000','outbound_three_day_stock']]){
  if((await sql(`select version from supabase_migrations.schema_migrations where version='${version}';`)).length)continue;
  const source=await readFile(`supabase/migrations/${version}_${name}.sql`,'utf8');
  await sql(`begin;${source}\ninsert into supabase_migrations.schema_migrations(version,name,statements) values('${version}','${name}',array['${source.replaceAll("'","''")}']);commit;`);
 }
 const config=(await sql('select enabled,max_daily_contacts,buffer_days,verifier_endpoint,verifier_max_cost_micro from public.outbound_sourcing_config where id=1;'))[0];
 if(config.max_daily_contacts!==200||config.buffer_days!==3||config.verifier_endpoint!=='trykitt.people.email.verify'||config.verifier_max_cost_micro!==1500)throw Error('Unexpected stock policy');
 cli(['functions','deploy','outbound-control','--project-ref',ref,'--use-api']);
 const secret=(await sql("select decrypted_secret from vault.decrypted_secrets where name='3xrep_outbound_cron_secret';"))[0]?.decrypted_secret;
 if(!secret)throw Error('Cron secret missing');
 const endpoint=`${process.env.SUPABASE_URL}/functions/v1/outbound-control`;
 const denied=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:'{}'});
 if(denied.status!==401)throw Error('Unauthorized request accepted');
 for(const dryRun of [true,false]){
  const response=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json','x-outbound-secret':secret},body:JSON.stringify({dryRun}),signal:AbortSignal.timeout(135000)});
  if(!response.ok)throw Error(`Hosted HTTP ${response.status}`);
  const result=await response.json();if(!result.attributionComplete||!result.sendingPlan)throw Error('Hosted control incomplete');
  if(!dryRun&&!['nothing_needed','success','already_running','already_attempted'].includes(result.sourcing?.status))throw Error('Hosted sourcing failed');
  console.log(JSON.stringify({runId:result.runId,dryRun,sendingPlan:result.sendingPlan,sourcing:result.sourcing,mailboxes:result.decisions.map(d=>({id:d.mailboxId,cap:d.cap,reason:d.reason}))}));
 }
 console.log(JSON.stringify({config,cron:await sql("select jobname,active,schedule,position('Europe/Paris' in command)>0 as paris_guard from cron.job where jobname='3xrep-outbound-cloud-01h';")}));
}finally{await rm(directory,{recursive:true,force:true});}
