// Authenticated one-off stock recovery. Does not change sending caps or schedules.
import {readFile,writeFile,mkdtemp,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {execFileSync} from 'node:child_process';
import {createSmartlead} from '../supabase/functions/_shared/smartlead.mjs';
const ref='lulnuqhgyqfkhjnuvpsd';
if(new URL(process.env.SUPABASE_URL).hostname!==`${ref}.supabase.co`||(await readFile('supabase/.temp/project-ref','utf8')).trim()!==ref)throw Error('Wrong project');
const directory=await mkdtemp(join(tmpdir(),'3xrep-stock-recovery-'));
try{
 const file=join(directory,'secret.sql');
 await writeFile(file,"select decrypted_secret from vault.decrypted_secrets where name='3xrep_outbound_cron_secret';",{mode:0o600});
 let rows;try{rows=JSON.parse(execFileSync('supabase',['db','query','--linked','--file',file,'--output','json'],{encoding:'utf8',stdio:['ignore','pipe','pipe']})).rows;}catch{throw Error('Cannot read hosted trigger secret');}
 const secret=rows[0]?.decrypted_secret;if(!secret)throw Error('Trigger secret missing');
 const smartlead=createSmartlead(process.env.SMARTLEAD_API_KEY);
 const caps=async()=>Object.fromEntries((await smartlead.get('email-accounts/',{limit:100,offset:0})).map(a=>[a.id,a.message_per_day]));
 const before=await caps();
 const endpoint=process.env.SUPABASE_URL+'/functions/v1/outbound-control';
 const denied=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({replenishNow:true})});
 if(denied.status!==401)throw Error('Unauthenticated recovery accepted');
 const response=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json','x-outbound-secret':secret},body:JSON.stringify({replenishNow:true}),signal:AbortSignal.timeout(135000)});
 if(!response.ok)throw Error(`Hosted recovery HTTP ${response.status}`);
 const proof=await response.json();
 if(!proof.dryRun||!proof.attributionComplete)throw Error('Delivery audit incomplete');
 const after=await caps();if(JSON.stringify(before)!==JSON.stringify(after))throw Error('Sending caps changed during stock recovery');
 const s=proof.sourcing||{};
 console.log(JSON.stringify({runId:proof.runId,capsUnchanged:true,sourcing:Object.fromEntries(['status','runId','imported','alreadyImported','verified','requested','pending','pendingImports','queuedAfter','shortfall','stockByCampaign','stockTarget','stopReason','reconcileOnly','previouslyVerified','previouslyRequested','creditsRemaining','continuationQueued','code'].filter(k=>s[k]!==undefined).map(k=>[k,s[k]]))}));
 if(s.status==='failed')process.exitCode=1;
}finally{await rm(directory,{recursive:true,force:true});}
