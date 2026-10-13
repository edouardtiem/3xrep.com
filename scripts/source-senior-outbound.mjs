import{readFile}from'node:fs/promises';import{createClient}from'@supabase/supabase-js';
import{createSmartlead}from'../supabase/functions/_shared/smartlead.mjs';
import{createSmartprospect}from'../supabase/functions/_shared/smartprospect.mjs';
import{createEmailVerifier}from'../supabase/functions/_shared/email-verifier.mjs';
import{runOutboundSourcing}from'../supabase/functions/_shared/outbound-sourcing.mjs';
if(new URL(process.env.SUPABASE_URL).hostname!=='lulnuqhgyqfkhjnuvpsd.supabase.co')throw Error('Wrong project');
// Supply the dedicated agent token through environment or a private local file.
const token=process.env.TREG_TOKEN||(process.env.TREG_TOKEN_FILE?JSON.parse(await readFile(process.env.TREG_TOKEN_FILE,'utf8')).token:null);
const db=createClient(process.env.SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY,{auth:{persistSession:false}});
const {data:previous,error}=await db.from('outbound_sourcing_runs').select('result').eq('mode','test').order('started_at').limit(1);
if(error)throw new Error('Cannot read test batch');
const candidateIds=previous[0]?.result?.candidateIds?.length?previous[0].result.candidateIds:null;
const {data:policy,error:policyError}=await db.from('outbound_sourcing_config').select('verifier_endpoint,verifier_max_cost_micro').eq('id',1).single();
if(policyError)throw new Error('Cannot read verifier policy');
const result=await runOutboundSourcing({db,smartlead:createSmartlead(process.env.SMARTLEAD_API_KEY),smartprospect:createSmartprospect(process.env.SMARTLEAD_API_KEY),
  verifier:createEmailVerifier(token,undefined,{endpointId:policy.verifier_endpoint,maxCostMicro:policy.verifier_max_cost_micro}),mode:'test',testLimit:10,candidateIds});
console.log(JSON.stringify(result));
