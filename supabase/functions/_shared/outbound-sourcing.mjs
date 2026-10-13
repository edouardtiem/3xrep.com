import {COHORT,SEARCH_FILTERS,qualification,minimalProfile,domainOf,emailOf,sourcingAllowance} from './outbound-sourcing-policy.mjs';
import {sendingDate} from './daily-ramp.mjs';
import {businessDates} from './outbound-stock.mjs';
async function checked(q){const {data,error}=await q;if(error){const e=new Error('Sourcing database request failed');e.safeCode=`DATABASE_${error.code||'FAILED'}`;throw e;}return data;}
const queuedStock=leadLists=>new Set([...leadLists.values()].flat().filter(x=>x.status==='STARTED'&&x.lead?.custom_fields?.email_verification==='valid').map(x=>x.lead.email?.toLowerCase()).filter(Boolean)).size;
const rowsOf=d=>Array.isArray(d)?d:(d?.list||d?.contacts||[]);
async function allRows(db,table,columns){const rows=[];for(let offset=0;;offset+=1000){const data=await checked(db.from(table).select(columns).order('id').range(offset,offset+999));rows.push(...data);if(data.length<1000)return rows;}}
async function campaignLeads(smartlead,id){const rows=[];for(let offset=0;;offset+=100){const d=await smartlead.get(`campaigns/${id}/leads`,{limit:100,offset});if(!Array.isArray(d.data))throw new Error('Invalid campaign contacts');rows.push(...d.data);if(!d.data.length||rows.length>=Number(d.total_leads))return rows;}}
async function mapConcurrent(items,limit,fn){
  let next=0,failed=false;const result=[];
  const workers=await Promise.allSettled(Array.from({length:Math.min(limit,items.length)},async()=>{
    while(next<items.length&&!failed){const i=next++;try{result[i]=await fn(items[i]);}catch(error){failed=true;throw error;}}
  }));
  const failure=workers.find(x=>x.status==='rejected');if(failure)throw failure.reason;return result;
}

export async function runOutboundSourcing({db,smartprospect,smartlead,verifier,now=new Date(),mode='daily',testLimit=10,candidateIds=null,controlResult=null,deadlineMs=Date.now()+105000}){
  const config=await checked(db.from('outbound_sourcing_config').select('*').eq('id',1).single());
  if(mode==='daily'&&(!config.enabled||!config.validated_run_id))return {status:'disabled'};
  const sequences=await checked(db.from('outbound_sequences').select('*').eq('cohort',COHORT).eq('version',1));
  if(sequences.length!==2||sequences.some(s=>!s.controlled||!s.provider_campaign_id))throw new Error('Acquisition sequences not ready');
  const campaigns=new Map();const leadLists=new Map();
  for(const s of sequences){const id=s.provider_campaign_id;const c=await smartlead.get(`campaigns/${id}`);if(!['DRAFTED','PAUSED','ACTIVE'].includes(c.status))throw new Error('Unsupported campaign state');campaigns.set(id,c);leadLists.set(id,await campaignLeads(smartlead,id));}
  if(mode==='test'&&[...campaigns.values()].some(c=>c.status==='ACTIVE'))throw new Error('Test requires campaigns in draft or paused');
  const queued=queuedStock(leadLists);
  const day=sendingDate(now);
  const active=[...campaigns.values()].every(c=>c.status==='ACTIVE');
  const decisions=controlResult?.decisions||[];
  const unhealthy=['delivery_blocked','bounce_review_required','bounce_rate','domain_incident','warmup_not_ready',
    'sender_attribution_incomplete','external_cap_change','manual_restart_required','manual_stop_other_campaign_required','targeting_review_required','recovery_observation','invalid_daily_plan','warmup_only','warmup_start_changed','bounce_incident_already_handled'];
  const healthy=controlResult?.attributionComplete===true&&decisions.length===4&&decisions.every(d=>d.cap>0&&!unhealthy.includes(d.reason)&&d.action!=='stop');
  const capacity=decisions.reduce((n,d)=>n+Number(d.cap||0),0);
  const stockTarget=Math.ceil(capacity*config.buffer_days);
  const stockPerCampaign=Object.fromEntries(sequences.map((s,index)=>[s.provider_campaign_id,Math.floor(stockTarget/sequences.length)+(index<stockTarget%sequences.length?1:0)]));
  const stockCounts=()=>Object.fromEntries(sequences.map(s=>[s.provider_campaign_id,queuedStock(new Map([[s.provider_campaign_id,leadLists.get(s.provider_campaign_id)]]))]));
  const stockMissing=()=>Object.entries(stockCounts()).reduce((n,[id,count])=>n+Math.max(0,stockPerCampaign[id]-count),0);
  let reconcileOnly=mode==='daily'&&(config.last_attempted_date===day||config.last_completed_date===day);
  const allowancePolicy=reconcileOnly?{...config,last_attempted_date:null,last_completed_date:null}:config;
  const allowance=sourcingAllowance({config:allowancePolicy,mode,testLimit,day,active,healthy,capacity,queued:stockTarget-stockMissing()});
  if(!allowance)return {status:'nothing_needed',queued,active};
  const runId=crypto.randomUUID();
  if(!await checked(db.rpc('claim_outbound_sourcing',{run_id:runId})))return {status:'already_running'};
  await checked(db.from('outbound_sourcing_runs').insert({id:runId,mode,sending_date:day,status:'running'}));
  const result={discovered:0,requested:0,emailsFound:0,noEmail:0,valid:0,invalid:0,uncertain:0,imported:0,queuedBefore:queued,creditBudget:config.max_daily_contacts,candidateIds:[],alreadyImported:0,verified:0,rounds:0,stockTarget,stockPerCampaign,stockDates:businessDates(day,config.buffer_days)};
  async function update(id,fields){await checked(db.from('outbound_sourcing_candidates').update({...fields,updated_at:now.toISOString()}).eq('id',id));}
  try{
    if(mode==='daily'){
      // Re-read while holding the lease: a caller may have read the old date
      // before another worker completed. No second paid discovery that day.
      const current=await checked(db.from('outbound_sourcing_config').select('*').eq('id',1).single());
      if(current.last_attempted_date&&day<current.last_attempted_date){
        await checked(db.from('outbound_sourcing_runs').update({status:'success',finished_at:new Date().toISOString(),result:{status:'already_attempted'}}).eq('id',runId));
        return {runId,status:'already_attempted'};
      }
      reconcileOnly=current.last_attempted_date===day||current.last_completed_date===day;
      if(!reconcileOnly)await checked(db.from('outbound_sourcing_config').update({last_attempted_date:day}).eq('id',1));
    }
    const prior=mode==='daily'?await checked(db.from('outbound_sourcing_runs').select('id,result').eq('mode','daily').eq('sending_date',day)):[];
    const previouslyVerified=prior.filter(r=>r.id!==runId).reduce((n,r)=>n+Number(r.result?.verified||0),0);
    result.reconcileOnly=reconcileOnly;result.previouslyVerified=previouslyVerified;
    await (verifier.confirmAllowedPrice||verifier.confirmFree)();
    const processedIds=new Set();let scrollId=null,searchFilterId=null,searchExhausted=false,creditsExhausted=false,emptyPages=0;const seenPages=new Set();
    // All replacement lots share one lease, one sending date and one budget.
    // Async revelations without a verdict never count as stock.
    while(mode==='test'||stockMissing()>0) {
      if(Date.now()>deadlineMs-30000){result.stopReason='time_budget';break;}
      const remainingChecks=Math.max(0,config.max_daily_contacts-previouslyVerified-result.verified);
      if(remainingChecks<=0){result.stopReason='verification_cap';break;}
      const missingStock=mode==='test'?allowance:stockMissing();
      const batchLimit=Math.min(20,remainingChecks,missingStock);
      const known=await allRows(db,'outbound_sourcing_candidates','*');
      const prospects=await allRows(db,'outbound_prospects','id,email,company_domain,source,source_contact_id');
      const prospectByEmail=new Map(prospects.map(p=>[p.email.toLowerCase(),p]));
      const usedDomains=new Set([...prospects.map(p=>p.company_domain),...known.map(p=>p.company_domain)].filter(Boolean));
      const existingIds=new Set(known.map(c=>c.source_contact_id));
      // Resume requested revelations without issuing a second charged fetch.
      let work=known.filter(c=>c.qualified&&c.import_state==='pending'&&c.discovery_state!=='no_email'&&
        ['new','requested','pending'].includes(c.discovery_state)||c.qualified&&c.import_state==='pending'&&c.email&&
        ['unverified','error','valid'].includes(c.email_verification_status)).filter(c=>(!candidateIds||candidateIds.includes(c.id))&&!processedIds.has(c.id)&&(!reconcileOnly||c.discovery_state!=='new')).slice(0,batchLimit);
      if(work.length<batchLimit&&!candidateIds&&!reconcileOnly&&result.requested<config.max_daily_contacts){
        const preview=await smartprospect.post('search-contacts',{...SEARCH_FILTERS,limit:batchLimit-work.length,...(scrollId?{scroll_id:scrollId}:{})});
        // Subsequent scroll pages omit filter_id; use the search that owns
        // the cursor, not an invented id or a new charged revelation.
        if(preview.filter_id!=null)searchFilterId=Number(preview.filter_id);
        if(!Number.isInteger(searchFilterId)||searchFilterId<1)throw new Error('Invalid prospect search identifier');
        const selected=[];const previewRows=rowsOf(preview);
        const nextScroll=typeof preview.scroll_id==='string'?preview.scroll_id:null;
        const pageKey=JSON.stringify(previewRows.map(p=>String(p.id)));
        searchExhausted=!previewRows.length||!nextScroll||seenPages.has(pageKey);seenPages.add(pageKey);scrollId=nextScroll;
        for(const p of previewRows){
          if(existingIds.has(String(p.id)))continue;
          const reason=qualification(p),domain=domainOf(p.company?.website||'');
          if(reason!=='qualified_provider_profile'||usedDomains.has(domain))continue;
          usedDomains.add(domain);existingIds.add(String(p.id));
          selected.push({source_contact_id:String(p.id),filter_id:searchFilterId,profile:minimalProfile(p),company_domain:domain,
            qualified:true,qualification_reason:reason});
          if(selected.length>=batchLimit-work.length)break;
        }
        if(selected.length){const saved=await checked(db.from('outbound_sourcing_candidates').insert(selected).select('*'));work.push(...saved);result.discovered+=saved.length;}
      }
      result.candidateIds=[...new Set([...result.candidateIds,...(candidateIds||work.map(c=>c.id))])];
      work.forEach(c=>processedIds.add(c.id));
      result.alreadyImported=known.filter(c=>result.candidateIds.includes(c.id)&&c.import_state==='imported').length;
      if(!work.length){
        if(result.requested>=config.max_daily_contacts){result.stopReason='discovery_cap';break;}
        if(mode==='daily'&&!searchExhausted&&++emptyPages<10)continue;
        result.stopReason=reconcileOnly?'pending_results':searchExhausted?'search_exhausted':'no_new_qualified_profiles';break;
      }
      const fresh=work.filter(c=>c.discovery_state==='new'&&!reconcileOnly);
      const analytics=fresh.length?await smartprospect.get('search-analytics'):null;
      const credits=Number(analytics?.availableCredits?.available||0);
      // No purchase and no paid fallback after Smartlead credits are exhausted.
      const reveal=fresh.slice(0,Math.max(0,Math.min(credits,config.max_daily_contacts-result.requested,batchLimit)));
      if(fresh.length&&!reveal.length)creditsExhausted=true;
      for(const filter of [...new Set(reveal.map(c=>c.filter_id))]){
        const batch=reveal.filter(c=>c.filter_id===filter);
        const ids=batch.map(c=>c.source_contact_id);
        await checked(db.from('outbound_sourcing_candidates').update({discovery_state:'requested',requested_at:now.toISOString()}).in('id',batch.map(c=>c.id)));
        batch.forEach(c=>c.discovery_state='requested');
        // Persist before requesting. A lost response is reconciled via get-contacts.
        await smartprospect.post('fetch-contacts',{filter_id:filter,id:ids,visual_limit:ids.length,visual_offset:0});
        result.requested+=ids.length;
      }
      const pending=work.filter(c=>['requested','pending'].includes(c.discovery_state));
      if(pending.length){
        const fetched=rowsOf(await smartprospect.post('get-contacts',{id:pending.map(c=>c.source_contact_id)}));
        const byId=new Map(fetched.map(p=>[String(p.id||p.adapt_id),p]));
        for(const c of pending){const p=byId.get(c.source_contact_id),email=p&&emailOf(p);
          if(email){c.email=email;c.discovery_state='complete';await update(c.id,{email,discovery_state:'complete',email_verification_status:'unverified'});result.emailsFound++;}
          else if(p&&['completed','complete','no_email','failed'].includes(p.status)){c.discovery_state='no_email';await update(c.id,{discovery_state:'no_email',email_verification_status:'no_email'});result.noEmail++;}
          else {c.discovery_state='pending';await update(c.id,{discovery_state:'pending'});}
        }
      }
      const ready=work.filter(c=>c.email&&c.discovery_state==='complete').slice(0,Math.max(0,config.max_daily_contacts-previouslyVerified-result.verified));
      result.rounds++;
      await mapConcurrent(ready,4,async c=>{
        if(Date.now()>deadlineMs-20000){result.stopReason='time_budget';return;}
        if(domainOf(c.email.split('@')[1])!==c.company_domain){await update(c.id,{import_state:'excluded',exclusion_reason:'email_company_mismatch'});c.import_state='excluded';return;}
        if(c.email_verification_status==='valid'&&c.verification_checked_at&&now-new Date(c.verification_checked_at)<86400000)return;
        const requestId=c.verification_checked_at?crypto.randomUUID():(c.verification_request_id||crypto.randomUUID());
        await update(c.id,{verification_request_id:requestId});
        result.verified++;
        let v;try{v=await verifier.verify(c.email,requestId);}catch(error){await update(c.id,{email_verification_status:'error'});throw error;}
        c.email_verification_status=v.status;c.verification_checked_at=now.toISOString();
        await update(c.id,{email_verification_status:v.status,verifier_status:v.providerStatus,verification_checked_at:c.verification_checked_at,
          verification_provider:v.provider||'contactout.people.email.verify',verification_call_id:v.callId,
          verification_cost_micro:Number(c.verification_cost_micro||0)+v.costMicro,
          verification_attempts:[...(c.verification_attempts||[]),{provider:v.provider||'contactout.people.email.verify',http:200,callId:v.callId,costMicro:v.costMicro,checkedAt:c.verification_checked_at,verdict:v.providerStatus}]});
      });
      const importGroups=new Map();
      for(const c of ready.filter(c=>['valid','invalid','accept_all','unknown'].includes(c.email_verification_status))){
        if(c.email_verification_status==='valid'&&(!c.verification_checked_at||now-new Date(c.verification_checked_at)>=86400000))continue;
        if(c.import_state==='excluded')continue;
        const status=c.email_verification_status;
        result[status==='valid'?'valid':status==='invalid'?'invalid':'uncertain']++;
        let prospect=prospectByEmail.get(c.email);
        if(!prospect){
          const p=c.profile;
          prospect=await checked(db.from('outbound_prospects').insert({email:c.email,first_name:p.firstName,last_name:p.lastName,
            full_name:`${p.firstName} ${p.lastName}`,job_title:p.title,company:p.company.name,company_domain:c.company_domain,location:p.country,
            linkedin_url:p.linkedin,source:'smartlead',source_contact_id:c.source_contact_id,email_verification_status:status,qualified_for_senior_beta:true,
            status:status==='invalid'?'skipped':'to_contact'}).select('id,email').single());
          prospectByEmail.set(c.email,prospect);
        }else if(!c.prospect_id){
          await update(c.id,{prospect_id:prospect.id,import_state:'excluded',exclusion_reason:'existing_contact'});continue;
        }else await checked(db.from('outbound_prospects').update({email_verification_status:status}).eq('id',prospect.id));
        await update(c.id,{prospect_id:prospect.id});c.prospect_id=prospect.id;
        if(status!=='valid'){await update(c.id,{import_state:'excluded',exclusion_reason:'email_not_definitively_valid'});continue;}
        const history=await checked(db.from('outbound_campaign_leads').select('first_sent_at,is_bounced,is_unsubscribed,last_reply_at').eq('prospect_id',prospect.id));
        if(history.some(h=>h.first_sent_at||h.is_bounced||h.is_unsubscribed||h.last_reply_at)){await update(c.id,{import_state:'excluded',exclusion_reason:'already_approached_or_suppressed'});continue;}
        const assigned=await checked(db.rpc('assign_senior_beta_sequence',{prospect_uuid:prospect.id}));
        const sequence=sequences.find(s=>s.id===assigned);if(!sequence)throw new Error('Unexpected assignment');
        await update(c.id,{sequence_id:assigned});c.sequence_id=assigned;
        if(!importGroups.has(sequence.provider_campaign_id))importGroups.set(sequence.provider_campaign_id,[]);
        importGroups.get(sequence.provider_campaign_id).push(c);
      }
      for(const [id,batch] of importGroups){
        const missing=batch.filter(c=>!leadLists.get(id).some(x=>x.lead.email?.toLowerCase()===c.email));
        if(missing.length){await smartlead.post(`campaigns/${id}/leads`,{lead_list:missing.map(c=>({email:c.email,first_name:c.profile.firstName,last_name:c.profile.lastName,
          company_name:c.profile.company.name,website:c.company_domain,custom_fields:{job_title:c.profile.title,email_verification:'valid',sequence_version:c.sequence_id}})),
          settings:{ignore_global_block_list:false,ignore_unsubscribe_list:false,ignore_duplicate_leads_in_other_campaign:false}});}
        const actual=missing.length?await campaignLeads(smartlead,id):leadLists.get(id);
        leadLists.set(id,actual);
        for(const c of batch){const entry=actual.find(x=>x.lead.email?.toLowerCase()===c.email);
          if(!entry)throw new Error('Provider import not confirmed');
          if(entry.status!=='STARTED'){await update(c.id,{import_state:'excluded',exclusion_reason:'provider_not_sendable'});continue;}
          await checked(db.from('outbound_campaign_leads').upsert({prospect_id:c.prospect_id,provider:'smartlead',provider_campaign_id:id,
            provider_lead_id:String(entry.lead.id),provider_campaign_lead_map_id:String(entry.campaign_lead_map_id),status:entry.status,sequence_id:c.sequence_id,
            last_synced_at:now.toISOString()},{onConflict:'provider,provider_campaign_id,prospect_id'}));
          await update(c.id,{import_state:'imported',imported_at:now.toISOString()});result.imported++;
        }
      }
      result.pending=(result.pending||0)+work.filter(c=>['requested','pending'].includes(c.discovery_state)).length;
      // Persist each completed lot so later reconciliation shares its spend
      // budget even if the hosted request stops before final bookkeeping.
      await checked(db.from('outbound_sourcing_runs').update({result}).eq('id',runId));
      if(mode==='test'||result.stopReason==='time_budget')break;
      if(creditsExhausted){result.stopReason='credits_exhausted';break;}
      if(searchExhausted){result.stopReason='search_exhausted';break;}
    }
    result.queuedAfter=queuedStock(leadLists);
    result.stockByCampaign=stockCounts();
    result.shortfall=stockMissing();
    result.stopReason||=mode==='test'?'pilot_complete':result.shortfall?'stock_shortfall':'stock_ready';
    result.creditsRemaining=(await smartprospect.get('search-analytics')).availableCredits?.available??null;
    await checked(db.from('outbound_sourcing_runs').update({status:'success',finished_at:new Date().toISOString(),result}).eq('id',runId));
    if(mode==='daily')await checked(db.from('outbound_sourcing_config').update({last_completed_date:day}).eq('id',1));
    return {runId,status:'success',...result};
  }catch(error){await checked(db.from('outbound_sourcing_runs').update({status:'failed',finished_at:new Date().toISOString(),error_code:error.safeCode||'SOURCING_FAILED_REVIEW_REQUIRED',result}).eq('id',runId));throw error;}
  finally{await checked(db.rpc('release_outbound_sourcing',{run_id:runId}));}
}
