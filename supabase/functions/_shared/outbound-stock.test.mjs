import test from 'node:test';
import assert from 'node:assert/strict';
import {businessDates,firstSendBudget} from './outbound-stock.mjs';
const steps=[0,4,5,7].map((delay,index)=>({seq_number:index+1,seq_delay_details:{delay_in_days:delay}}));
const args={capacity:23,day:'2026-10-16',campaignIds:['A','B'],sequences:['A','B'].map(id=>({provider_campaign_id:id,steps}))};
const entry=(status,time,extra={})=>({entry:{status},sent:[],stats:[{sequence_number:1,sent_time:time,...extra}]});
test('a Friday reserve covers Friday, Monday and Tuesday, rather than the weekend',()=>{
 assert.deepEqual(businessDates('2026-10-16'),['2026-10-16','2026-10-19','2026-10-20']);
});
test('without follow-ups all mailbox capacity can start new contacts instead of being divided by four',()=>{
 assert.equal(firstSendBudget({...args,staged:['A','B'].map(campaignId=>({campaignId,entries:[]}))}).newLeads,23);
});
test('due follow-ups reserve capacity; future, replied and stopped contacts do not',()=>{
 const staged=[{campaignId:'A',entries:[entry('INPROGRESS','2026-10-12T15:00:00Z'),entry('INPROGRESS','2026-10-15T15:00:00Z'),
  entry('INPROGRESS','2026-10-12T15:00:00Z',{reply_time:'2026-10-13T15:00:00Z'}),entry('STOPPED','2026-10-12T15:00:00Z')]},{campaignId:'B',entries:[]}];
 const r=firstSendBudget({...args,staged});assert.equal(r.dueFollowups,1);assert.equal(r.newLeads,22);assert.equal(r.uncertain,0);
});
test('missing step evidence is visible and keeps a conservative allowance',()=>{
 const r=firstSendBudget({...args,staged:[{campaignId:'A',entries:[entry('INPROGRESS',null)]},{campaignId:'B',entries:[]}]});
 assert.equal(r.uncertain,1);assert.equal(r.newLeads,5);
});
