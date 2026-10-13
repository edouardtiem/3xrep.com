// Enable only after the real pilot has imported verified contacts and the
// dedicated token has proved both positive and negative endpoint permissions.
import{readFile,writeFile,mkdtemp,rm}from'node:fs/promises';import{tmpdir}from'node:os';import{join}from'node:path';import{execFileSync}from'node:child_process';
import{createClient}from'@supabase/supabase-js';
const ref='lulnuqhgyqfkhjnuvpsd';
if(new URL(process.env.SUPABASE_URL).hostname!==`${ref}.supabase.co`||(await readFile('supabase/.temp/project-ref','utf8')).trim()!==ref)throw Error('Wrong project');
if(!process.env.TREG_TOKEN_FILE)throw Error('Provide a private scoped verifier token file');
const {token}=JSON.parse(await readFile(process.env.TREG_TOKEN_FILE,'utf8'));
const directory=await mkdtemp(join(tmpdir(),'3xrep-sourcing-deploy-'));
const db=createClient(process.env.SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY,{auth:{persistSession:false}});
async function checked(q){const{data,error}=await q;if(error)throw Error(`Database ${error.code}`);return data;}
function cli(args){try{return execFileSync('supabase',args,{encoding:'utf8',stdio:['ignore','pipe','pipe']});}catch{throw Error(`Supabase ${args.slice(0,2).join(' ')} failed`);}}
async function sql(query){const path=join(directory,'query.sql');await writeFile(path,query,{mode:0o600});return JSON.parse(cli(['db','query','--linked','--file',path,'--output','json'])).rows;}
try{
 // Recheck the token's denial without relaying a provider request.
 const deniedUrl=new URL('https://treg.to/call/contactout.people.email.verify');deniedUrl.searchParams.set('email','support@contactout.com');
 const denied=await fetch(deniedUrl,{headers:{'X-Treg-Token':token}});const deny=await denied.json();
 if(denied.status!==403||typeof deny.detail!=='string'||!deny.detail.includes("don't have access to the tool"))throw Error('Verifier endpoint restriction not proven');
 const pilots=await checked(db.from('outbound_sourcing_runs').select('*').eq('mode','test').eq('status','success').order('started_at',{ascending:false}));
 const pilot=pilots.find(p=>p.result?.imported>0&&p.result?.candidateIds?.length===10);
 if(!pilot)throw Error('No successful ten-profile pilot');
 const candidates=await checked(db.from('outbound_sourcing_candidates').select('id,email_verification_status,import_state,sequence_id,verification_provider,verification_checked_at').in('id',pilot.result.candidateIds));
 const imported=candidates.filter(c=>c.import_state==='imported');
 if(!imported.length||imported.some(c=>c.email_verification_status!=='valid'||c.verification_provider!=='trykitt.people.email.verify'||Date.now()-Date.parse(c.verification_checked_at)>86400000))throw Error('Imported contacts do not have fresh Kitt proof');
 await checked(db.from('outbound_sourcing_config').update({verifier_endpoint:'trykitt.people.email.verify',verifier_max_cost_micro:1500}).eq('id',1));
 const env=join(directory,'verifier.env');await writeFile(env,`TREG_TOKEN=${token}\n`,{mode:0o600});
 cli(['secrets','set','--project-ref',ref,'--env-file',env]);
 cli(['functions','deploy','outbound-control','--project-ref',ref,'--use-api']);
 const secret=(await sql("select decrypted_secret from vault.decrypted_secrets where name='3xrep_outbound_cron_secret';"))[0]?.decrypted_secret;
 if(!secret)throw Error('Cron secret missing');
 async function hosted(body){const response=await fetch(`${process.env.SUPABASE_URL}/functions/v1/outbound-control`,{method:'POST',headers:{'Content-Type':'application/json','x-outbound-secret':secret},body:JSON.stringify(body),signal:AbortSignal.timeout(135000)});if(!response.ok)throw Error(`Hosted HTTP ${response.status}`);return response.json();}
 const proof=await hosted({verifierProbe:true});if(proof.status!=='valid'||proof.provider!=='trykitt.people.email.verify'||proof.costMicro>1500)throw Error('Hosted verifier proof failed');
 console.log(JSON.stringify({hostedVerifier:proof}));
 const dry=await hosted({dryRun:true});if(!dry.attributionComplete)throw Error('Hosted delivery control incomplete');
 await checked(db.from('outbound_sourcing_config').update({enabled:true,validated_run_id:pilot.id}).eq('id',1));
 const real=await hosted({dryRun:false});if(!real.attributionComplete||!['nothing_needed','success'].includes(real.sourcing?.status))throw Error('Hosted sourcing state not verified');
 console.log(JSON.stringify({runId:real.runId,sourcing:real.sourcing,synced:real.synced,mailboxes:real.decisions.map(d=>({id:d.mailboxId,cap:d.cap,reason:d.reason})),pilot:pilot.id,imported:imported.length}));
 console.log(JSON.stringify({cron:await sql("select jobname,active,schedule,position('Europe/Paris' in command)>0 as paris_guard from cron.job where jobname='3xrep-outbound-cloud-01h';")}));
}finally{await rm(directory,{recursive:true,force:true});}
