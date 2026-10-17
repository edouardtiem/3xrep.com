// Apply only the approved target change, preserving live progress and sending caps.
import {readFile,writeFile,mkdtemp,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {execFileSync} from 'node:child_process';
import {isDeepStrictEqual} from 'node:util';
import {createSmartlead} from '../supabase/functions/_shared/smartlead.mjs';
import {DAILY_RAMP_POLICY,DAILY_RAMP_TARGET,DAILY_RAMP_MAX} from '../supabase/functions/_shared/daily-ramp.mjs';
const ref='lulnuqhgyqfkhjnuvpsd',version='20261017140000',name='outbound_daily_target_46';
if(new URL(process.env.SUPABASE_URL).hostname!==`${ref}.supabase.co`||(await readFile('supabase/.temp/project-ref','utf8')).trim()!==ref)throw Error('Wrong project');
const directory=await mkdtemp(join(tmpdir(),'3xrep-ramp-deploy-'));
function cli(args){try{return execFileSync('supabase',args,{encoding:'utf8',stdio:['ignore','pipe','pipe']});}catch{throw Error(`Supabase ${args.slice(0,2).join(' ')} failed`);}}
async function sql(query){const file=join(directory,'query.sql');await writeFile(file,query,{mode:0o600});return JSON.parse(cli(['db','query','--linked','--file',file,'--output','json'])).rows;}
function progress(rows){return rows.map(row=>{const state=structuredClone(row.state);delete state.daily_plan?.target;delete state.daily_plan?.policy;return{id:row.id,state};});}
try{
 const query='select id,state from public.outbound_mailboxes where id in (23568551,24049951,24049938,24049619) order by id;';
 const before=await sql(query);
 const smartlead=createSmartlead(process.env.SMARTLEAD_API_KEY);
 const caps=async()=>Object.fromEntries((await smartlead.get('email-accounts/',{limit:100,offset:0})).map(a=>[a.id,a.message_per_day]));
 const beforeCaps=await caps();
 if(!(await sql(`select version from supabase_migrations.schema_migrations where version='${version}';`)).length){
  const source=await readFile(`supabase/migrations/${version}_${name}.sql`,'utf8');
  await sql(`begin;${source}\ninsert into supabase_migrations.schema_migrations(version,name,statements) values('${version}','${name}',array['${source.replaceAll("'","''")}']);commit;`);
 }
 const after=await sql(query);
 if(after.length!==4||after.some(r=>r.state.daily_plan?.target!==DAILY_RAMP_TARGET||r.state.daily_plan?.policy!==DAILY_RAMP_POLICY)||!isDeepStrictEqual(progress(before),progress(after)))throw Error('Progress preservation not confirmed');
 cli(['functions','deploy','outbound-control','--project-ref',ref,'--use-api']);
 const secret=(await sql("select decrypted_secret from vault.decrypted_secrets where name='3xrep_outbound_cron_secret';"))[0]?.decrypted_secret;
 if(!secret)throw Error('Cron secret missing');
 const endpoint=process.env.SUPABASE_URL+'/functions/v1/outbound-control';
 const denied=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:'{}'});
 if(denied.status!==401)throw Error('Unauthorized request accepted');
 const response=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json','x-outbound-secret':secret},body:JSON.stringify({dryRun:true}),signal:AbortSignal.timeout(120000)});
 if(!response.ok)throw Error(`Hosted HTTP ${response.status}`);
 const proof=await response.json();
 if(!proof.dryRun||!proof.attributionComplete||proof.decisions?.length!==4||proof.decisions.some(d=>d.policy!==DAILY_RAMP_POLICY||d.reason==='invalid_daily_plan'||d.cap>DAILY_RAMP_MAX))throw Error('Hosted policy not confirmed');
 if(!isDeepStrictEqual(beforeCaps,await caps()))throw Error('Live sending caps changed during deployment');
 console.log(JSON.stringify({runId:proof.runId,policy:DAILY_RAMP_POLICY,target:DAILY_RAMP_TARGET,max:DAILY_RAMP_MAX,progressPreserved:true,capsUnchanged:true,mailboxes:after.map(r=>({id:r.id,baseline:r.state.daily_plan.baseline,target:r.state.daily_plan.target})),decisions:proof.decisions.map(d=>({id:d.mailboxId,cap:d.cap,reason:d.reason})),cron:await sql("select jobname,active,position('Europe/Paris' in command)>0 as paris_guard from cron.job where jobname='3xrep-outbound-cloud-01h';")}));
}finally{await rm(directory,{recursive:true,force:true});}
