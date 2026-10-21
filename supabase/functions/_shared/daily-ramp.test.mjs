import test from 'node:test';
import assert from 'node:assert/strict';
import { decideDailyRamp, sendingDate } from './daily-ramp.mjs';

function fixture(baseline = 11) {
  return { account: { id: 7, message_per_day: baseline, is_smtp_success: true, is_imap_success: true,
    warmup_details: { status: 'ACTIVE', warmup_created_at: '2026-09-21T19:02:42.915Z' } },
    state: { approved: true, observed_cap: baseline, warmup_started_at: '2026-09-21T19:02:42.915Z',
      daily_plan: { version: 2, target: 46, baseline } },
    stats: { sent_count: 80, inbox_count: 80, spam_count: 0, stats_by_date: [{ date: '2026-10-13' }] },
    metrics: { attempted: 80, cumulative: 160, bounced: 0, rate: 0, bounceIds: [], bounceGroups: [], effectiveDays: 3, healthyDays: 3, replied: true },
    now: new Date('2026-10-13T23:00:00Z'), complete: true, campaignActive: true };
}
test('daily bases advance a bounded step; outages and idle dates never cause catch-up', () => {
  const x = fixture(); assert.equal(decideDailyRamp(x).baseline, 16);
  x.now = new Date('2026-11-03T00:00:00Z'); x.stats.stats_by_date = [{ date: '2026-11-02' }];
  assert.equal(decideDailyRamp(x).baseline, 16);
  x.metrics.effectiveDays = 0;
  assert.equal(decideDailyRamp(x).reason, 'waiting_for_real_sending');
  assert.equal(decideDailyRamp({ ...fixture(), campaignActive: false }).reason, 'no_active_campaign');
});
test('variations at the target stay between 44 and 48 with a weekly average of 46', () => {
  const caps = [];
  for (const date of ['12','13','14','15','16']) {
    const x = fixture(46); x.now = new Date(`2026-10-${date}T10:00:00Z`);
    x.stats.stats_by_date = [{ date: `2026-10-${date}` }];
    caps.push(decideDailyRamp(x).cap);
  }
  assert.deepEqual([...caps].sort((a,b) => a-b), [44,45,46,47,48]);
  assert.equal(caps.reduce((a,b) => a+b) / 5, 46);
});
test('planning is idempotent within a sending day and handles the Paris winter clock', () => {
  const x = fixture(); x.state.daily_plan.last_planned_date = '2026-10-14';
  assert.equal(decideDailyRamp(x).reason, 'already_planned');
  assert.equal(sendingDate('2026-11-03T00:00:00Z'), '2026-11-03');
  x.state.daily_plan.last_planned_date = null; x.now = new Date('2026-10-16T23:00:00Z');
  x.stats.stats_by_date = [{ date: '2026-10-16' }];
  assert.equal(decideDailyRamp(x).reason, 'weekend');
});
test('missing attribution and external edits hold; an unresolved alert selects seven', () => {
 assert.equal(decideDailyRamp({...fixture(),complete:false}).reason,'sender_attribution_incomplete');
 const x=fixture();x.state.pending_bounce_ids=['old'];
 assert.equal(decideDailyRamp(x).cap,7);
 x.state.resolved_bounce_ids=['old'];assert.equal(decideDailyRamp(x).baseline,16);
 x.account.message_per_day=45;assert.equal(decideDailyRamp(x).reason,'external_cap_change');
});

test('real recipient evidence gates higher bases; lack of replies only signals review', () => {
  const x = fixture(25); x.metrics.cumulative = 49;
  assert.equal(decideDailyRamp(x).reason, 'insufficient_real_sending_for_25');
  const y = fixture(35); y.metrics.cumulative = 99;
  assert.equal(decideDailyRamp(y).reason, 'insufficient_real_sending_for_35');
  y.metrics.cumulative = 150; y.metrics.replied = false;
  const d = decideDailyRamp(y);
  assert.equal(d.reason, 'progressive_daily_base');
  assert.equal(d.baseline, 40);
  assert.deepEqual(d.signals, ['no_reply_after_100_contacts']);
});
test('delivery alerts select seven even at a high bounce rate; unusable connections still stop', () => {
 const x=fixture(25);Object.assign(x.metrics,{rate:.10,bounced:3,bounceIds:['b'],bounceGroups:[['b']]});
 const d=decideDailyRamp(x);assert.equal(d.cap,7);assert.equal(d.baseline,7);assert.equal(d.recoveryTarget,25);
 x.state.handled_bounce_ids=['b'];assert.notEqual(decideDailyRamp(x).reason,'delivery_alert');
 x.account.is_smtp_success=false;assert.equal(decideDailyRamp(x).action,'stop');
 const y=fixture();y.metrics.senderBounce=true;y.metrics.senderBounceIds=['sender'];
 assert.equal(decideDailyRamp(y).cap,7);
 const z=fixture();z.stats={};assert.equal(decideDailyRamp(z).reason,'warmup_not_ready');
});

test('two healthy used days advance by five, bounded by forty-six', () => {
  for (const [before, after] of [[4,9],[14,19],[18,23],[20,25],[25,30],[38,43],[40,45],[43,46],[45,46],[46,46]]) {
    const x = fixture(before); x.metrics.healthyDays = 2;
    assert.equal(decideDailyRamp(x).baseline, after);
    x.metrics.healthyDays = 1;
    assert.equal(decideDailyRamp(x).baseline, before);
  }
  const x = fixture(); x.metrics.effectiveDays = 8; x.metrics.healthyDays = 0;
  assert.equal(decideDailyRamp(x).baseline, 11);
});

test('one fresh recipient alert selects seven; acknowledged recipient events do not repeat it', () => {
 const x=fixture(11);Object.assign(x.metrics,{attempted:23,rate:2/23,bounceIds:['a','b'],bounceGroups:[['a','b']]});
 assert.equal(decideDailyRamp(x).cap,7);
 x.metrics.bounceGroups=[['a'],['b']];assert.equal(decideDailyRamp(x).cap,7);
 x.state.handled_bounce_ids=['a','b'];assert.equal(decideDailyRamp(x).baseline,16);
});

test('a fresh alert applies after same-day planning; the same alert cannot apply twice', () => {
 const x=fixture(46);x.account.message_per_day=48;x.state.observed_cap=48;
 x.state.daily_plan.last_planned_date='2026-10-14';
 Object.assign(x.metrics,{rate:.03,bounceIds:['a','b'],bounceGroups:[['a'],['b']]});
 const d=decideDailyRamp(x);assert.equal(d.cap,7);assert.equal(d.baseline,7);assert.equal(d.recoveryTarget,46);
 x.state.handled_bounce_ids=['a','b'];assert.equal(decideDailyRamp(x).reason,'already_planned');
});

test('recovery waits for three clean sending days, then advances by two without erasing incidents', () => {
 const x=fixture(7);x.state.cooldown=true;x.state.daily_plan.recovery_target=25;
 Object.assign(x.metrics,{rate:.03,bounceIds:['b'],bounceGroups:[['b']],healthyDays:2});x.state.handled_bounce_ids=['b'];
 assert.equal(decideDailyRamp(x).reason,'recovery_observation');
 x.metrics.healthyDays=3;const d=decideDailyRamp(x);
 assert.equal(d.reason,'gradual_recovery');assert.equal(d.cap,9);assert.equal(d.recoveryTarget,25);
 x.state.cooldown=false;x.state.daily_plan.baseline=9;x.state.observed_cap=9;x.account.message_per_day=9;
 x.metrics.healthyDays=1;assert.equal(decideDailyRamp(x).cap,9);
 x.metrics.healthyDays=2;assert.equal(decideDailyRamp(x).cap,11);
 x.state.daily_plan.baseline=24;x.state.observed_cap=24;x.account.message_per_day=24;
 assert.equal(decideDailyRamp(x).cap,25);assert.equal(decideDailyRamp(x).recoveryTarget,null);
});

test('a confirmed refusal selects seven once and clean days permit recovery without manual resolution', () => {
 const x=fixture(25);x.state.delivery_incidents=[{id:'refusal-1',kind:'temporary_refusal',confirmed:true,at:'2026-10-13T16:00:00Z'}];
 assert.equal(decideDailyRamp(x).reason,'delivery_alert');assert.equal(decideDailyRamp(x).cap,7);
 x.state.handled_delivery_incident_ids=['refusal-1'];assert.equal(decideDailyRamp(x).baseline,30);
 x.state.delivery_incidents.push({id:'refusal-2',kind:'temporary_refusal',confirmed:true,at:'2026-10-13T17:00:00Z'});
 assert.equal(decideDailyRamp(x).cap,7);
});

test('commercial review holds growth without penalizing delivery; recovery state must be bounded', () => {
  const x = fixture(); x.state.targeting_review_required = true;
  assert.equal(decideDailyRamp(x).action,'hold'); assert.equal(decideDailyRamp(x).cap,11);
  x.state.targeting_review_required = false; x.state.daily_plan.recovery_target = 99;
  assert.equal(decideDailyRamp(x).reason,'invalid_daily_plan');
});
test('a duplicate event for an acknowledged failed recipient does not restart the observation', () => {
 const x=fixture(12);Object.assign(x.metrics,{rate:.03,bounceIds:['a','b','new-a'],bounceGroups:[['a','new-a'],['b']]});
 x.state.handled_bounce_ids=['a','b'];assert.notEqual(decideDailyRamp(x).reason,'delivery_alert');
});

test('reply signal starts at one hundred contacts and never overrides delivery or manual holds', () => {
  const x = fixture(); x.metrics.replied = false; x.metrics.cumulative = 99;
  assert.deepEqual(decideDailyRamp(x).signals, []);
  x.metrics.cumulative = 100;
  assert.deepEqual(decideDailyRamp(x).signals, ['no_reply_after_100_contacts']);
  assert.equal(decideDailyRamp(x).baseline, 16);
  x.metrics.replied = true;
  assert.deepEqual(decideDailyRamp(x).signals, []);
  x.metrics.replied = false; x.state.targeting_review_required = true;
  assert.equal(decideDailyRamp(x).reason, 'targeting_review_required');
  x.account.is_smtp_success = false;
  assert.equal(decideDailyRamp(x).action, 'stop');
  assert.deepEqual(decideDailyRamp(x).signals, ['no_reply_after_100_contacts']);
});

test('new five-message steps preserve recipient gates and the two-day observation', () => {
  const x = fixture(14); x.metrics.healthyDays = 1;
  assert.equal(decideDailyRamp(x).baseline,14);
  x.metrics.healthyDays = 2; x.metrics.cumulative = 19;
  assert.equal(decideDailyRamp(x).reason,'insufficient_real_sending_for_15');
  x.metrics.cumulative = 20;
  assert.equal(decideDailyRamp(x).baseline,19);
  x.state.daily_plan.target = 43;
  assert.equal(decideDailyRamp(x).reason,'invalid_daily_plan');
});

test('target migration preserves caps, bases, healthy-day history and recovery state', async () => {
  const {PGlite} = await import('@electric-sql/pglite');
  const {readFile} = await import('node:fs/promises');
  const db = new PGlite();
  try {
    await db.exec('create table outbound_mailboxes(id bigint primary key,approved boolean,state jsonb,updated_at timestamptz);');
    const original={daily_plan:{version:2,target:43,baseline:14,last_planned_date:'2026-10-16',recovery_target:25},observed_cap:12,
      stage_changed_at:'2026-10-15T23:00:00Z',cooldown:true,pending_bounce_ids:['old'],resolved_bounce_ids:['old']};
    for(const id of [23568551,24049951,24049938,24049619])await db.query('insert into outbound_mailboxes values($1,true,$2,now())',[id,original]);
    await db.query('insert into outbound_mailboxes values(99,false,$1,now())',[original]);
    await db.exec(await readFile(new URL('../../migrations/20261017140000_outbound_daily_target_46.sql',import.meta.url),'utf8'));
    const rows=(await db.query('select * from outbound_mailboxes order by id')).rows;
    assert.deepEqual(rows.find(r=>r.id===99).state,original);
    for(const row of rows.filter(r=>r.id!==99)){
      assert.equal(row.state.daily_plan.target,46);
      assert.equal(row.state.daily_plan.policy,'accelerated-2026-10-17');
      const expected=structuredClone(original);expected.daily_plan.target=46;expected.daily_plan.policy='accelerated-2026-10-17';
      assert.deepEqual(row.state,expected);
    }
  } finally {await db.close();}
});

test('an alert never increases a smaller cap and an authorized stopped mailbox restarts at seven',()=>{
 const x=fixture(4);x.metrics.bounceIds=['a'];x.metrics.bounceGroups=[['a']];assert.equal(decideDailyRamp(x).cap,4);
 const y=fixture(14);y.state.stopped=true;assert.equal(decideDailyRamp(y).reason,'manual_restart_required');
 y.state.auto_delivery_recovery=true;const d=decideDailyRamp(y);assert.equal(d.cap,7);assert.equal(d.restart,true);assert.equal(d.recoveryTarget,14);
 y.account.is_imap_success=false;assert.equal(decideDailyRamp(y).action,'stop');
});
