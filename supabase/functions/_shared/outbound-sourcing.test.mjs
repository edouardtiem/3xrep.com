import test from'node:test';import assert from'node:assert/strict';import{runOutboundSourcing}from'./outbound-sourcing.mjs';
function fakeDb(){
 const tables={outbound_sourcing_config:[{id:1,enabled:false,max_daily_contacts:50,buffer_days:2}],outbound_sequences:['A','B'].map((v,i)=>({id:v,cohort:'senior-beta-2026-10-13',version:1,controlled:true,provider_campaign_id:String(i+1)})),outbound_sourcing_candidates:[],outbound_sourcing_runs:[],outbound_prospects:[],outbound_campaign_leads:[]};
 const assignments=new Map();let held=false;
 return {tables,assignments,from(table){let op='read',value,filters=[],single=false,range=null,limit=null;
  const q={select(){return q;},eq(k,v){filters.push(x=>x[k]===v);return q;},in(k,v){filters.push(x=>v.includes(x[k]));return q;},order(){return q;},range(a,b){range=[a,b];return q;},limit(n){limit=n;return q;},single(){single=true;return q;},insert(v){op='insert';value=v;return q;},update(v){op='update';value=v;return q;},upsert(v){op='upsert';value=v;return q;},
   then(resolve,reject){return Promise.resolve().then(()=>{let rows=tables[table];let data=rows.filter(x=>filters.every(f=>f(x)));
    if(op==='insert'){data=(Array.isArray(value)?value:[value]).map(v=>({id:crypto.randomUUID(),discovery_state:'new',import_state:'pending',email_verification_status:'unverified',...v}));rows.push(...data);}
    if(op==='update')data.forEach(x=>Object.assign(x,value));
    if(op==='upsert'){const values=Array.isArray(value)?value:[value];data=values.map(v=>{const old=rows.find(x=>x.prospect_id===v.prospect_id&&x.provider_campaign_id===v.provider_campaign_id);if(old){Object.assign(old,v);return old;}const row={id:crypto.randomUUID(),...v};rows.push(row);return row;});}
    if(range)data=data.slice(range[0],range[1]+1);if(limit!=null)data=data.slice(0,limit);
    return {data:structuredClone(single?data[0]:data),error:null};}).then(resolve,reject);}};return q;},
  async rpc(name,p){if(name==='claim_outbound_sourcing'){if(held)return{data:false,error:null};held=true;return{data:true,error:null};}if(name==='release_outbound_sourcing'){held=false;return{data:null,error:null};}
   if(!assignments.has(p.prospect_uuid))assignments.set(p.prospect_uuid,assignments.size%2?'B':'A');return{data:assignments.get(p.prospect_uuid),error:null};}
 };
}
function system(statuses=['valid','invalid','accept_all'],{active=false,credits=2000}={}){
 const db=fakeDb(),campaigns={'1':[],'2':[]};let fetched=0,checked=0,searches=0;
 const profiles=statuses.map((_,i)=>({id:String(i),firstName:'Sam',lastName:String(i),title:'Senior Account Executive',country:'United States',industry:'Software & Internet',companyHeadCount:'25 - 100',company:{name:`Company ${i}`,website:`company${i}.com`}}));
 const smartprospect={async get(){return{availableCredits:{available:credits-fetched}};},async post(path,body){if(path==='search-contacts'){searches++;const offset=Number(body.scroll_id||0);return{filter_id:7,list:profiles.slice(offset,offset+body.limit),scroll_id:String(offset+body.limit)};}if(path==='fetch-contacts'){fetched+=body.id.length;return{list:[]};}return{list:profiles.filter(p=>body.id.includes(p.id)).map(p=>({...p,email:`sam@${p.company.website}`,status:'found'}))};}};
 const smartlead={async get(path){const id=path.split('/')[1];if(path.endsWith('/leads'))return{data:campaigns[id],total_leads:campaigns[id].length};return{status:active?'ACTIVE':'DRAFTED'};},async post(path,body){const id=path.split('/')[1];campaigns[id].push(...body.lead_list.map(p=>({lead:{id:crypto.randomUUID(),email:p.email,custom_fields:p.custom_fields},campaign_lead_map_id:crypto.randomUUID(),status:'STARTED'})));return{ok:true};}};
 const verifier={async confirmFree(){},async verify(email){checked++;const i=Number(email.match(/company(\d+)/)[1]);return{status:statuses[i],providerStatus:statuses[i],callId:`v${i}`,costMicro:0};}};
 return{db,smartlead,smartprospect,verifier,counts:()=>({fetched,checked,searches}),campaigns};
}
test('only valid addresses are imported; rejected addresses stay in the database and resuming the pinned test spends no new credits',async()=>{
 const s=system();const first=await runOutboundSourcing({...s,mode:'test',testLimit:3});
 assert.equal(first.imported,1);assert.equal(first.invalid,1);assert.equal(first.uncertain,1);assert.equal(s.db.tables.outbound_prospects.length,3);
 assert.equal(s.db.tables.outbound_sourcing_candidates.filter(c=>c.import_state==='imported').length,1);
 const second=await runOutboundSourcing({...s,mode:'test',testLimit:3,candidateIds:first.candidateIds});
 assert.equal(second.alreadyImported,1);assert.equal(second.imported,0);assert.deepEqual(s.counts(),{fetched:3,checked:3,searches:1});
});
test('the same valid batch is balanced between A and B without crossing company or contact assignments',async()=>{
 const s=system(['valid','valid','valid','valid']);const r=await runOutboundSourcing({...s,mode:'test',testLimit:4});
 assert.equal(r.imported,4);assert.equal(s.campaigns['1'].length,2);assert.equal(s.campaigns['2'].length,2);
 assert.equal(s.db.tables.outbound_campaign_leads.every(x=>x.sequence_id===(x.provider_campaign_id==='1'?'A':'B')),true);
 assert.deepEqual(s.db.tables.outbound_campaign_leads.map(x=>x.sequence_id).sort(),['A','A','B','B']);
});
test('an email verifier outage cannot import contacts or enable the daily worker, and the existing lot can recover',async()=>{
 const s=system(['valid']);s.verifier.verify=async()=>{const e=Error('Provider unavailable');e.safeCode='TREG_HTTP_403';throw e;};
 await assert.rejects(()=>runOutboundSourcing({...s,mode:'test',testLimit:1}),{safeCode:'TREG_HTTP_403'});
 assert.equal(s.db.tables.outbound_campaign_leads.length,0);assert.equal(s.db.tables.outbound_sourcing_config[0].enabled,false);
 assert.equal(s.db.tables.outbound_sourcing_candidates[0].email_verification_status,'error');
 assert.equal(s.db.tables.outbound_sourcing_runs[0].status,'failed');
 s.verifier.verify=async()=>({status:'valid',providerStatus:'valid',costMicro:0,callId:'recovered'});
 const recovered=await runOutboundSourcing({...s,mode:'test',testLimit:1,candidateIds:s.db.tables.outbound_sourcing_candidates.map(x=>x.id)});
 assert.equal(recovered.imported,1);assert.equal(s.counts().fetched,1);
});

test('an asynchronous email search is reconciled without asking Smartlead to reveal the same addresses again',async()=>{
 const s=system(['valid']);const original=s.smartprospect.post;let pending=true;
 s.smartprospect.post=async(path,body)=>path==='get-contacts'&&pending?{list:[]}:original(path,body);
 const first=await runOutboundSourcing({...s,mode:'test',testLimit:1});
 assert.equal(first.pending,1);assert.equal(first.imported,0);pending=false;
 const second=await runOutboundSourcing({...s,mode:'test',testLimit:1,candidateIds:first.candidateIds});
 assert.equal(second.imported,1);assert.equal(s.counts().fetched,1);
});

function daily(s,capacity=4){
 Object.assign(s.db.tables.outbound_sourcing_config[0],{enabled:true,validated_run_id:'pilot',max_daily_contacts:200,buffer_days:3});
 return {...s,mode:'daily',now:new Date('2026-10-14T00:00:00Z'),controlResult:{attributionComplete:true,decisions:[1,2,3,4].map(mailboxId=>({mailboxId,cap:capacity/4,action:'hold',reason:'waiting_for_real_sending'}))}};
}
test('daily replenishment replaces invalid results until three days of VALID stock are read back, then stays idempotent',async()=>{
 const s=system([...Array(12).fill('invalid'),...Array(12).fill('valid')],{active:true});const args=daily(s);
 const r=await runOutboundSourcing(args);
 assert.equal(r.stockTarget,12);assert.equal(r.queuedAfter,12);assert.equal(r.shortfall,0);
 assert.equal(r.verified,24);assert.equal(r.rounds,2);assert.equal(r.stopReason,'stock_ready');
 assert.equal(s.campaigns['1'].length,6);assert.equal(s.campaigns['2'].length,6);
 const count=s.counts();await runOutboundSourcing(args);assert.deepEqual(s.counts(),count);
});
test('all replacement lots share the 200-check daily limit and report the shortfall',async()=>{
 const s=system(Array(600).fill('invalid'),{active:true});const r=await runOutboundSourcing(daily(s,172));
 assert.equal(r.verified,200);assert.equal(r.requested,200);assert.equal(r.imported,0);
 assert.equal(r.stockTarget,516);assert.equal(r.shortfall,516);assert.equal(r.stopReason,'verification_cap');
 assert.equal(s.db.tables.outbound_sourcing_runs.length,1);
});
test('credit exhaustion stops replacement lots without purchasing credits or counting unfinished lookups as stock',async()=>{
 const s=system(Array(100).fill('valid'),{active:true,credits:5});const r=await runOutboundSourcing(daily(s));
 assert.equal(r.requested,5);assert.equal(r.verified,5);assert.equal(r.imported,5);
 assert.equal(r.shortfall,7);assert.equal(r.stopReason,'credits_exhausted');
});
test('a time budget preserves pending contacts and records a visible shortfall without paid calls',async()=>{
 const s=system(Array(30).fill('valid'),{active:true});const r=await runOutboundSourcing({...daily(s),deadlineMs:Date.now()+1000});
 assert.equal(r.verified,0);assert.equal(r.shortfall,12);assert.equal(r.stopReason,'time_budget');
 assert.deepEqual(s.counts(),{fetched:0,checked:0,searches:0});
});
test('exhausted discovery terminates even if no profiles or valid addresses can fill the reserve',async()=>{
 const s=system(['unknown','invalid'],{active:true});const r=await runOutboundSourcing(daily(s));
 assert.equal(r.verified,2);assert.equal(r.queuedAfter,0);assert.equal(r.stopReason,'search_exhausted');
 assert.equal(r.shortfall,12);
});
test('asynchronous discoveries are not re-billed in replacement rounds and do not fill the verified reserve',async()=>{
 const s=system(Array(40).fill('valid'),{active:true});const original=s.smartprospect.post;
 s.smartprospect.post=async(path,body)=>path==='get-contacts'&&body.id.includes('0')?{list:[]}:original(path,body);
 const r=await runOutboundSourcing(daily(s));
 assert.equal(r.queuedAfter,12);assert.equal(r.verified,12);assert.equal(r.pending,12);assert.equal(r.requested,24);
});
test('provider blocked imports never count as available stock',async()=>{
 const s=system(Array(30).fill('valid'),{active:true});const original=s.smartlead.post;
 s.smartlead.post=async(path,body)=>{const r=await original(path,body);for(const c of Object.values(s.campaigns))c.forEach(x=>x.status='BLOCKED');return r;};
 const r=await runOutboundSourcing(daily(s));assert.equal(r.imported,0);assert.equal(r.shortfall,12);
 assert.ok(s.db.tables.outbound_sourcing_candidates.filter(c=>c.exclusion_reason==='provider_not_sendable').length);
});
test('surplus in A does not hide an empty B; each campaign must have its own reserve',async()=>{
 const s=system(Array(100).fill('valid'),{active:true});
 s.campaigns['1']=Array.from({length:12},(_,i)=>({status:'STARTED',lead:{id:`old${i}`,email:`old${i}@other.example`,custom_fields:{email_verification:'valid'}}}));
 const r=await runOutboundSourcing(daily(s));
 assert.equal(r.stockPerCampaign['1'],6);assert.equal(r.stockPerCampaign['2'],6);
 assert.ok(r.stockByCampaign['2']>=6);assert.equal(r.shortfall,0);
 assert.ok(r.queuedAfter>r.stockTarget);
});

test('scroll pages may omit the original filter id and keep the same cursor token',async()=>{
 const s=system([...Array(12).fill('invalid'),...Array(12).fill('valid')],{active:true});
 const original=s.smartprospect.post;let page=0;
 s.smartprospect.post=async(path,body)=>{
  if(path!=='search-contacts'){
   if(path==='fetch-contacts')assert.equal(body.filter_id,7);
   return original(path,body);
  }
  const r=await original(path,{...body,scroll_id:String(page++*12)});
  if(page>1)delete r.filter_id;r.scroll_id='stable-provider-cursor';return r;
 };
 const r=await runOutboundSourcing(daily(s));assert.equal(r.shortfall,0);assert.equal(r.verified,24);assert.equal(r.rounds,2);
});

test('same-day reconciliation completes asynchronous requests without repeating discovery and shares the verification budget',async()=>{
 const s=system(Array(20).fill('valid'),{active:true});const original=s.smartprospect.post;let pending=true;
 s.smartprospect.post=async(path,body)=>path==='get-contacts'&&pending?{list:[]}:original(path,body);
 const args=daily(s);const first=await runOutboundSourcing(args);assert.equal(first.imported,0);assert.equal(first.verified,0);
 const before=s.counts();pending=false;const r=await runOutboundSourcing(args);
 assert.equal(r.reconcileOnly,true);assert.equal(r.shortfall,0);assert.equal(r.imported,12);
 assert.equal(s.counts().fetched,before.fetched);assert.equal(s.counts().searches,before.searches);
});
test('reconciliation cannot spend another 200 checks after the daily verification budget is used',async()=>{
 const s=system(['valid'],{active:true});const args=daily(s);
 s.db.tables.outbound_sourcing_config[0].last_attempted_date='2026-10-14';
 s.db.tables.outbound_sourcing_runs.push({id:'previous',mode:'daily',sending_date:'2026-10-14',result:{verified:200}});
 const r=await runOutboundSourcing(args);assert.equal(r.verified,0);assert.equal(r.stopReason,'verification_cap');assert.equal(r.previouslyVerified,200);
 assert.deepEqual(s.counts(),{fetched:0,checked:0,searches:0});
});

test('delayed provider imports are confirmed by bounded readbacks instead of aborting the whole batch',async()=>{
 const s=system(Array(12).fill('valid'),{active:true});const get=s.smartlead.get;let reads=0;
 s.smartlead.get=async(path,...args)=>{const result=await get(path,...args);if(path.endsWith('/leads')&&result.data.length&&++reads<=2)return{data:[],total_leads:0};return result;};
 const r=await runOutboundSourcing({...daily(s),wait:async()=>{}});
 assert.equal(r.status,'success');assert.equal(r.imported,12);assert.equal(r.shortfall,0);
});
test('an unconfirmed provider import remains pending and does not prevent the other campaign from filling',async()=>{
 const s=system(Array(12).fill('valid'),{active:true});const get=s.smartlead.get;
 s.smartlead.get=async(path,...args)=>path==='campaigns/1/leads'?{data:[],total_leads:0}:get(path,...args);
 const r=await runOutboundSourcing({...daily(s),wait:async()=>{}});
 assert.equal(r.status,'success');assert.equal(r.pendingImports,6);assert.equal(r.imported,6);
 assert.equal(s.db.tables.outbound_sourcing_candidates.filter(c=>c.import_state==='pending').length,6);
 assert.equal(s.db.tables.outbound_sourcing_runs[0].status,'success');
});
test('already imported and contacted people are reconciled without a new verification or import',async()=>{
 const s=system(Array(12).fill('valid'),{active:true});const args=daily(s);
 await runOutboundSourcing(args);
 const candidate=s.db.tables.outbound_sourcing_candidates[0];candidate.import_state='pending';candidate.verification_checked_at='2026-10-01T00:00:00Z';
 for(const list of Object.values(s.campaigns))for(const entry of list)if(entry.lead.email===candidate.email)entry.status='INPROGRESS';
 const before=s.counts();const r=await runOutboundSourcing(args);
 assert.equal(candidate.import_state,'imported');assert.ok(r.alreadyImported>=1);assert.deepEqual(s.counts(),before);
});
test('manual weekend replenishment keeps the calendar date and budget; automatic weekend runs stay idle',async()=>{
 const s=system(Array(12).fill('valid'),{active:true});const args={...daily(s),now:new Date('2026-10-17T08:00:00Z')};
 assert.equal((await runOutboundSourcing(args)).status,'nothing_needed');
 const r=await runOutboundSourcing({...args,allowWeekend:true});
 assert.equal(r.imported,12);assert.equal(r.verified,12);assert.deepEqual(r.stockDates,['2026-10-19','2026-10-20','2026-10-21']);
 assert.equal(s.db.tables.outbound_sourcing_runs[0].sending_date,'2026-10-17');
});

test('explicit stock recovery resumes discovery with one shared daily request budget',async()=>{
 const s=system(Array(40).fill('valid'),{active:true});const args=daily(s,8);
 Object.assign(s.db.tables.outbound_sourcing_config[0],{last_attempted_date:'2026-10-14'});
 s.db.tables.outbound_sourcing_runs.push({id:'earlier',mode:'daily',sending_date:'2026-10-14',result:{verified:0,requested:195,discoveryCursor:{scrollId:'0',filterId:7}}});
 const r=await runOutboundSourcing({...args,resumeDiscovery:true});
 assert.equal(r.previouslyRequested,195);assert.equal(r.requested,5);assert.equal(s.counts().fetched,5);
 assert.equal(r.stopReason,'discovery_cap');assert.equal(r.verified,5);
 const before=s.counts();const again=await runOutboundSourcing({...args,resumeDiscovery:true});
 assert.equal(again.requested,0);assert.equal(again.stopReason,'discovery_cap');assert.deepEqual(s.counts(),before);
});

test('an explicit import refusal records a safe failure without counting the contacts as stock',async()=>{
 const s=system(['valid'],{active:true});s.smartlead.post=async()=>({success:false});
 await assert.rejects(()=>runOutboundSourcing(daily(s)),{safeCode:'SMARTLEAD_IMPORT_DECLINED'});
 const run=s.db.tables.outbound_sourcing_runs[0];
 assert.equal(run.status,'failed');assert.equal(run.error_code,'SMARTLEAD_IMPORT_DECLINED');
 assert.equal(run.result.failureStage,'provider_import');assert.equal(run.result.imported,0);
});

test('a stopped mailbox does not block stock replenishment for the healthy active mailboxes',async()=>{
 const s=system(Array(20).fill('valid'),{active:true});const args=daily(s);
 args.controlResult.decisions[0]={mailboxId:1,cap:14,action:'hold',reason:'manual_restart_required',sendingEligible:false};
 args.controlResult.sendingPlan={capacity:3};
 const r=await runOutboundSourcing(args);assert.equal(r.stockTarget,9);assert.equal(r.shortfall,0);
});
