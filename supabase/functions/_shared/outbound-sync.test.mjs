import test from 'node:test';
import assert from 'node:assert/strict';
import { syncOutbound } from './outbound-sync.mjs';
import { realEvents } from './ramp-up.mjs';

function database(saved, known = []) {
  return { from(table) {
    let mutation;
    const q = { select(){return q;}, range(){return q;}, order(){return q;}, in(){return q;},
      update(){return q;}, eq(){return q;}, upsert(value){mutation=value;saved.push({table,value});return q;},
      single(){return q;}, then(resolve,reject) {
        const data = table==='outbound_prospects' ? [{id:'p',email:'buyer@example.com',source:'manual'}] :
          table==='outbound_campaign_leads' ? mutation.map(row=>({id:'m',...row})) : known;
        return Promise.resolve({error:null,data}).then(resolve,reject);
      }};
    return q;
  }};
}

const mailbox = {id:7,from_email:'sender@example.org'};
const knownSend = {provider_message_id:'message',provider_stats_id:'stats',sequence_step:2,
  sent_at:'2026-10-13T15:00:00Z',mailbox_id:7,outbound_campaign_leads:{provider_campaign_id:'1',provider_lead_id:'10'}};
function provider(stats, onHistory = () => {}) {
  return async path => path.endsWith('/leads') ? {total_leads:1,data:[{status:'INPROGRESS',campaign_lead_map_id:'map',lead:{id:10,email:'buyer@example.com'}}]} :
    path.endsWith('/statistics') ? {total_stats:stats.length,data:stats} :
      (onHistory(), {history:stats.map((stat,i)=>({type:'SENT',message_id:i?'message2':'message',stats_id:stat.stats_id,
        from:'Edouard <sender@example.org>',time:stat.sent_time,email_seq_number:stat.sequence_number}))});
}
const firstStat = {stats_id:'stats',lead_email:'buyer@example.com',sequence_number:2,is_bounced:false,
  sent_time:'2026-10-13T15:00:00Z',open_time:null,reply_time:'2026-10-13T16:00:00Z',ignore_reply:true};
const args = {campaignIds:['1'],sequences:[{id:'A-v1',provider_campaign_id:'1'}],mailboxes:[mailbox]};

test('sequence, sender and step remain attributable; opens are refreshed and automatic replies excluded', async () => {
  const saved=[];
  const db=database(saved);
  await syncOutbound({...args,db,smartleadGet:provider([firstStat])});
  const opened='2026-10-13T16:00:00Z';
  await syncOutbound({...args,db,smartleadGet:provider([{...firstStat,open_time:opened}])});
  const memberships=saved.filter(x=>x.table==='outbound_campaign_leads');
  assert.equal(memberships[0].value[0].sequence_id,'A-v1');assert.equal(memberships[0].value[0].last_reply_at,null);
  const events=saved.filter(x=>x.table==='outbound_send_events');
  assert.equal(events[0].value[0].mailbox_id,7);assert.equal(events[0].value[0].sequence_step,2);
  assert.equal(events[0].value[0].opened_at,null);assert.equal(events[1].value[0].opened_at,new Date(opened).toISOString());
  assert.equal(events[1].value[0].replied_at,null);
});

test('known attribution skips unchanged histories while refreshing late engagement and preserving ramp evidence', async () => {
  const saved=[];let histories=0;
  const stat={...firstStat,ignore_reply:false,open_time:'2026-10-14T16:00:00Z'};
  const result=await syncOutbound({...args,db:database(saved,[knownSend]),smartleadGet:provider([stat],()=>histories++)});
  assert.equal(histories,0);
  assert.equal(result.sentMessages,1);
  const real=realEvents(result.staged,[mailbox]);
  assert.equal(real.complete,true);assert.equal(real.events[0].accountId,7);assert.equal(real.events[0].replied,true);
  const event=saved.find(x=>x.table==='outbound_send_events').value[0];
  assert.equal(event.opened_at,'2026-10-14T16:00:00.000Z');
  assert.equal(event.provider_message_id,'message');assert.equal(event.sequence_step,2);
});

test('new sends or missing sender evidence force full provider history instead of hiding delivery evidence', async () => {
  for (const [known,stats] of [
    [[knownSend],[firstStat,{...firstStat,stats_id:'stats2',sequence_number:3,sent_time:'2026-10-14T15:00:00Z'}]],
    [[{...knownSend,mailbox_id:null}],[firstStat]],
  ]) {
    let histories=0;
    const result=await syncOutbound({...args,db:database([],known),smartleadGet:provider(stats,()=>histories++),dryRun:true});
    assert.equal(histories,1);assert.equal(result.sentMessages,stats.length);
    assert.equal(realEvents(result.staged,[mailbox]).complete,true);
  }
});

test('late clicks are refreshed per message without changing sender attribution or treating them as replies',async()=>{
 const saved=[];let histories=0;
 await syncOutbound({...args,db:database(saved,[knownSend]),smartleadGet:provider([{...firstStat,click_time:'2026-10-14T16:00:00Z'}],()=>histories++)});
 const e=saved.find(x=>x.table==='outbound_send_events').value[0];
 assert.equal(e.clicked_at,'2026-10-14T16:00:00.000Z');assert.equal(e.replied_at,null);assert.equal(e.mailbox_id,7);assert.equal(histories,0);
});
