// Ingest actual Treg receipts from the approved pilot; never infer validity from
// HTTP success alone. The file is private, outside Git, and not a hosted input.
import{readFile}from'node:fs/promises';import{createClient}from'@supabase/supabase-js';
import{effectiveEvidence}from'../supabase/functions/_shared/verification-evidence.mjs';
const path=process.argv[2];if(!path)throw Error('Provide the private pilot receipts file');
if(new URL(process.env.SUPABASE_URL).hostname!=='lulnuqhgyqfkhjnuvpsd.supabase.co')throw Error('Wrong project');
const rows=JSON.parse(await readFile(path,'utf8'));if(!Array.isArray(rows)||rows.length>10)throw Error('Pilot must have at most ten rows');
const db=createClient(process.env.SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY,{auth:{persistSession:false}});
async function checked(q){const{data,error}=await q;if(error)throw Error(`Database ${error.code}`);return data;}
const totals={valid:0,invalid:0,uncertain:0,costMicro:0};
for(const row of rows){
 const c=await checked(db.from('outbound_sourcing_candidates').select('*').eq('id',row.candidateId).single());
 if(c.email!==row.email||!c.qualified||c.import_state==='imported')throw Error('Pilot receipt does not match an unimported qualified candidate');
 if(!row.attempts.length||row.attempts.some(a=>!a.callId||!Number.isInteger(a.costMicro)||a.costMicro<0||a.costMicro>1780||!Number.isFinite(Date.parse(a.checkedAt))))throw Error('Invalid Treg receipt');
 const v=effectiveEvidence(row.attempts);if(!v.checkedAt||Date.now()-Date.parse(v.checkedAt)>86400000)throw Error('Fresh completed verification required');
 let p=await checked(db.from('outbound_prospects').select('id').eq('email',row.email).maybeSingle());
 if(p&&!c.prospect_id)throw Error('Existing contact requires review');
 if(!p){const profile=c.profile;p=await checked(db.from('outbound_prospects').insert({email:row.email,first_name:profile.firstName,last_name:profile.lastName,
  full_name:`${profile.firstName} ${profile.lastName}`,job_title:profile.title,company:profile.company.name,company_domain:c.company_domain,location:profile.country,
  linkedin_url:profile.linkedin,source:'smartlead',source_contact_id:c.source_contact_id,email_verification_status:v.status,qualified_for_senior_beta:true,
  status:v.status==='invalid'?'skipped':'to_contact'}).select('id').single());}
 else await checked(db.from('outbound_prospects').update({email_verification_status:v.status}).eq('id',p.id));
 await checked(db.from('outbound_sourcing_candidates').update({prospect_id:p.id,email_verification_status:v.status,verifier_status:v.providerStatus,
  verification_provider:v.provider,verification_checked_at:v.checkedAt,verification_call_id:v.callId,verification_cost_micro:v.costMicro,
  verification_attempts:row.attempts.map(({provider,http,callId,costMicro,checkedAt,body})=>({provider,http,callId,costMicro,checkedAt,
    ...(http===200?{verdict:provider==='trykitt.people.email.verify'?body.validity:body.result}: {})})),
  import_state:v.status==='valid'?'pending':'excluded',exclusion_reason:v.status==='valid'?null:'email_not_definitively_valid'}).eq('id',c.id));
 totals[v.status==='valid'?'valid':v.status==='invalid'?'invalid':'uncertain']++;totals.costMicro+=v.costMicro;
}
console.log(JSON.stringify(totals));
