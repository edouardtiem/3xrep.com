import test from'node:test';import assert from'node:assert/strict';
import{qualification,sourcingAllowance,emailOf,domainOf}from'./outbound-sourcing-policy.mjs';
import{verificationVerdict,createEmailVerifier}from'./email-verifier.mjs';
const p={id:'x',firstName:'Sam',lastName:'Smith',title:'Senior Account Executive',country:'United States',industry:'Software & Internet',companyHeadCount:'25 - 100',company:{website:'https://www.example.com'}};
test('senior individual sellers at small tech companies qualify; managers, juniors and unsupported company sizes do not',()=>{
 assert.equal(qualification(p),'qualified_provider_profile');
 for(const title of['Senior Account Executive Manager','Director of Sales','Junior Account Executive','Account Executive','Sales Team Leader'])assert.notEqual(qualification({...p,title}),'qualified_provider_profile');
 assert.equal(qualification({...p,companyHeadCount:'100 - 250'}),'outside_target');
 assert.equal(qualification({...p,firstName:''}),'incomplete_profile');
 assert.equal(domainOf(p.company.website),'example.com');assert.equal(emailOf({email:'s***@example.com'}),null);
});
test('only explicit valid verdicts admit contacts; accept-all, absent and invalid results stay out',()=>{
 assert.equal(verificationVerdict({data:{status:'valid'}}).status,'valid');
 for(const status of['accept_all','catch_all'])assert.equal(verificationVerdict({data:{status}}).status,'accept_all');
 assert.equal(verificationVerdict({data:{status:'invalid'}}).status,'invalid');
 for(const body of[{}, {success:true},{data:{status:'deliverable'}},{data:{status:'unknown'}}])assert.equal(verificationVerdict(body).status,'unknown');
});
const config={enabled:true,validated_run_id:'verified-run',max_daily_contacts:200,buffer_days:3};
const a={config,mode:'daily',day:'2026-10-14',active:true,healthy:true,capacity:23,queued:0};
test('daily discovery fills only the three-day buffer, waits for active healthy campaigns and never exceeds two hundred checks',()=>{
 assert.equal(sourcingAllowance(a),69);assert.equal(sourcingAllowance({...a,queued:69}),0);
 assert.equal(sourcingAllowance({...a,capacity:172}),200);
 for(const patch of[{active:false},{healthy:false},{day:'2026-10-17'},{config:{...config,enabled:false}}, {config:{...config,last_completed_date:a.day}}])assert.equal(sourcingAllowance({...a,...patch}),0);
 assert.equal(sourcingAllowance({...a,mode:'test',testLimit:100}),10);
});
test('a changed verifier price prevents any address call, and HTTP errors contain no recipient or token',async()=>{
 let calls=0;const v=createEmailVerifier('SECRET',async()=>{calls++;return Response.json({endpoint:{cost:{type:'per_call',usd:.01}}});});
 await assert.rejects(()=>v.verify('buyer@example.com','id'),{safeCode:'VERIFIER_NO_LONGER_FREE'});assert.equal(calls,1);
 const failing=createEmailVerifier('SECRET',async url=>String(url).includes('/catalog/')?Response.json({endpoint:{cost:{type:'free',usd:0}}}):new Response('SECRET buyer@example.com',{status:503}));
 await assert.rejects(()=>failing.verify('buyer@example.com','id'),e=>e.safeCode==='TREG_HTTP_503'&&!e.message.includes('SECRET')&&!e.message.includes('buyer@'));
});

test('a successful free verifier call records its actual verdict and preserves the retry key',async()=>{
 let request;
 const v=createEmailVerifier('SECRET',async(url,options)=>{
  if(String(url).includes('/catalog/'))return Response.json({endpoint:{cost:{type:'free',usd:0}}});
  request=options;return Response.json({status_code:200,data:{status:'valid'}},{headers:{'X-Treg-Cost-Micro':'0','X-Treg-Call-Id':'call'}});
 });
 const r=await v.verify('buyer@example.com','retry-id');
 assert.equal(r.status,'valid');assert.equal(r.costMicro,0);assert.equal(r.callId,'call');assert.equal(request.headers['Idempotency-Key'],'retry-id');
});

test('Kitt requires an explicit price allowance and a positive SMTP/identity check',async()=>{
 const fetcher=async(url,options)=>String(url).includes('/catalog/')?Response.json({endpoint:{cost:{type:'per_success',usd:.0015}}}):
  Response.json({email:JSON.parse(options.body).email,validity:'valid-risky',validSMTP:null,validIdentity:true},{headers:{'X-Treg-Cost-Micro':'1500','X-Treg-Call-Id':'k'}});
 const denied=createEmailVerifier('key',fetcher,{endpointId:'trykitt.people.email.verify',maxCostMicro:0});
 await assert.rejects(()=>denied.verify('buyer@example.com','id'),{safeCode:'VERIFIER_NO_LONGER_FREE'});
 const v=createEmailVerifier('key',fetcher,{endpointId:'trykitt.people.email.verify',maxCostMicro:1500});
 const r=await v.verify('buyer@example.com','id');assert.equal(r.status,'unknown');assert.equal(r.costMicro,1500);
});
test('a daily attempt date prevents another paid run even when the previous attempt failed',()=>{
 assert.equal(sourcingAllowance({...a,config:{...config,last_attempted_date:a.day}}),0);
});
