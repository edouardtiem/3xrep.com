import test from 'node:test';
import assert from 'node:assert/strict';
import { decideDailyRamp, sendingDate } from './daily-ramp.mjs';

function fixture(baseline = 11) {
  return { account: { id: 7, message_per_day: baseline, is_smtp_success: true, is_imap_success: true,
    warmup_details: { status: 'ACTIVE', warmup_created_at: '2026-09-21T19:02:42.915Z' } },
    state: { approved: true, observed_cap: baseline, warmup_started_at: '2026-09-21T19:02:42.915Z',
      daily_plan: { version: 2, target: 43, baseline } },
    stats: { sent_count: 80, inbox_count: 80, spam_count: 0, stats_by_date: [{ date: '2026-10-13' }] },
    metrics: { attempted: 80, cumulative: 160, bounced: 0, rate: 0, bounceIds: [], bounceGroups: [], effectiveDays: 3, healthyDays: 3, replied: true },
    now: new Date('2026-10-13T23:00:00Z'), complete: true, campaignActive: true };
}
test('daily bases advance a bounded step; outages and idle dates never cause catch-up', () => {
  const x = fixture(); assert.equal(decideDailyRamp(x).baseline, 14);
  x.now = new Date('2026-11-03T00:00:00Z'); x.stats.stats_by_date = [{ date: '2026-11-02' }];
  assert.equal(decideDailyRamp(x).baseline, 14);
  x.metrics.effectiveDays = 0;
  assert.equal(decideDailyRamp(x).reason, 'waiting_for_real_sending');
  assert.equal(decideDailyRamp({ ...fixture(), campaignActive: false }).reason, 'no_active_campaign');
});
test('variations at the target stay between 41 and 45 with a weekly average of 43', () => {
  const caps = [];
  for (const date of ['12','13','14','15','16']) {
    const x = fixture(43); x.now = new Date(`2026-10-${date}T10:00:00Z`);
    x.stats.stats_by_date = [{ date: `2026-10-${date}` }];
    caps.push(decideDailyRamp(x).cap);
  }
  assert.deepEqual([...caps].sort((a,b) => a-b), [41,42,43,44,45]);
  assert.equal(caps.reduce((a,b) => a+b) / 5, 43);
});
test('planning is idempotent within a sending day and handles the Paris winter clock', () => {
  const x = fixture(); x.state.daily_plan.last_planned_date = '2026-10-14';
  assert.equal(decideDailyRamp(x).reason, 'already_planned');
  assert.equal(sendingDate('2026-11-03T00:00:00Z'), '2026-11-03');
  x.state.daily_plan.last_planned_date = null; x.now = new Date('2026-10-16T23:00:00Z');
  x.stats.stats_by_date = [{ date: '2026-10-16' }];
  assert.equal(decideDailyRamp(x).reason, 'weekend');
});
test('missing attribution, unresolved bounces and external edits block daily rises', () => {
  assert.equal(decideDailyRamp({ ...fixture(), complete: false }).reason, 'sender_attribution_incomplete');
  const x = fixture(); x.state.pending_bounce_ids = ['old'];
  assert.equal(decideDailyRamp(x).reason, 'bounce_review_required');
  x.state.resolved_bounce_ids = ['old']; assert.equal(decideDailyRamp(x).baseline, 14);
  x.account.message_per_day = 45;
  assert.equal(decideDailyRamp(x).reason, 'external_cap_change');
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
test('delivery incidents reduce once and severe failures stop', () => {
  const x = fixture(25); Object.assign(x.metrics, { rate: .03, bounced: 3, bounceIds: ['b'], bounceGroups: [['b']] });
  const d = decideDailyRamp(x); assert.equal(d.cap, 12); assert.equal(d.baseline, 12); assert.equal(d.recoveryTarget, 25);
  x.state.handled_bounce_ids = ['b'];
  assert.equal(decideDailyRamp(x).reason, 'bounce_review_required');
  x.metrics.senderBounce = true; assert.equal(decideDailyRamp(x).action, 'stop');
  const z = fixture(); z.stats = {}; assert.equal(decideDailyRamp(z).reason, 'warmup_not_ready');
});

test('two healthy used days advance by three to twenty, then five to forty, then forty-three', () => {
  for (const [before, after] of [[4,7],[18,20],[20,25],[25,30],[38,40],[40,43]]) {
    const x = fixture(before); x.metrics.healthyDays = 2;
    assert.equal(decideDailyRamp(x).baseline, after);
    x.metrics.healthyDays = 1;
    assert.equal(decideDailyRamp(x).baseline, before);
  }
  const x = fixture(); x.metrics.effectiveDays = 8; x.metrics.healthyDays = 0;
  assert.equal(decideDailyRamp(x).baseline, 11);
});

test('a confirmed cluster uses distinct failed recipients, even before fifty recipients', () => {
  const x = fixture(11);
  Object.assign(x.metrics, {attempted:23,rate:2/23,bounceIds:['a','b'],bounceGroups:[['a','b']]});
  assert.equal(decideDailyRamp(x).reason, 'bounce_review_required');
  x.metrics.bounceGroups = [['a'],['b']];
  assert.equal(decideDailyRamp(x).cap, 5);
  x.state.handled_bounce_ids = ['a','b']; x.state.resolved_bounce_ids = ['a','b'];
  assert.equal(decideDailyRamp(x).baseline, 14);
});

test('halving is allowed after same-day planning; old incidents cannot halve again', () => {
  const x = fixture(43); x.account.message_per_day = 45; x.state.observed_cap = 45;
  x.state.daily_plan.last_planned_date = '2026-10-14';
  Object.assign(x.metrics,{rate:.03,bounceIds:['a','b'],bounceGroups:[['a'],['b']]});
  assert.equal(decideDailyRamp(x).cap, 22);
  assert.equal(decideDailyRamp(x).baseline, 21);
  x.state.handled_bounce_ids = ['a','b']; x.state.resolved_bounce_ids = ['a','b'];
  assert.equal(decideDailyRamp(x).reason, 'already_planned');
});

test('recovery waits for three healthy actual days and resolved failures, then rises by two', () => {
  const x = fixture(12); x.state.cooldown = true; x.state.daily_plan.recovery_target = 25;
  Object.assign(x.metrics,{rate:.03,bounceIds:['b'],bounceGroups:[['b']],healthyDays:2});
  x.state.handled_bounce_ids = ['b'];
  assert.equal(decideDailyRamp(x).reason,'bounce_review_required');
  x.state.resolved_bounce_ids = ['b'];
  assert.equal(decideDailyRamp(x).reason,'recovery_observation');
  x.metrics.healthyDays = 3;
  const d = decideDailyRamp(x);
  assert.equal(d.reason,'gradual_recovery'); assert.equal(d.cap,14); assert.equal(d.recoveryTarget,25);
  x.state.cooldown = false; x.state.daily_plan.baseline = 14; x.state.observed_cap = 14; x.account.message_per_day = 14;
  x.metrics.healthyDays = 1; assert.equal(decideDailyRamp(x).cap,14);
  x.metrics.healthyDays = 2; assert.equal(decideDailyRamp(x).cap,16);
  x.state.daily_plan.baseline = 24; x.state.observed_cap = 24; x.account.message_per_day = 24;
  assert.equal(decideDailyRamp(x).cap,25); assert.equal(decideDailyRamp(x).recoveryTarget,null);
});

test('confirmed temporary refusal halves once and holds until explicit resolution', () => {
  const x = fixture(25);
  x.state.delivery_incidents = [{id:'refusal-1',kind:'temporary_refusal',confirmed:true,at:'2026-10-13T16:00:00Z'}];
  assert.equal(decideDailyRamp(x).reason,'temporary_refusal'); assert.equal(decideDailyRamp(x).cap,12);
  x.state.handled_delivery_incident_ids = ['refusal-1'];
  assert.equal(decideDailyRamp(x).reason,'temporary_refusal_review_required');
  x.state.delivery_incidents[0].resolved_at = '2026-10-13T21:00:00Z';
  assert.equal(decideDailyRamp(x).baseline,30);
  x.state.delivery_incidents[0].confirmed = false;
  assert.equal(decideDailyRamp(x).baseline,30);
});
test('commercial review holds growth without penalizing delivery; recovery state must be bounded', () => {
  const x = fixture(); x.state.targeting_review_required = true;
  assert.equal(decideDailyRamp(x).action,'hold'); assert.equal(decideDailyRamp(x).cap,11);
  x.state.targeting_review_required = false; x.state.daily_plan.recovery_target = 99;
  assert.equal(decideDailyRamp(x).reason,'invalid_daily_plan');
});
test('a later bounce event for an already penalized recipient is reviewed without another halving', () => {
  const x = fixture(12);
  Object.assign(x.metrics,{rate:.03,bounceIds:['a','b','new-a'],bounceGroups:[['a','new-a'],['b']]});
  x.state.handled_bounce_ids = ['a','b']; x.state.resolved_bounce_ids = ['a','b'];
  assert.equal(decideDailyRamp(x).action,'hold'); assert.equal(decideDailyRamp(x).cap,12);
});

test('reply signal starts at one hundred contacts and never overrides delivery or manual holds', () => {
  const x = fixture(); x.metrics.replied = false; x.metrics.cumulative = 99;
  assert.deepEqual(decideDailyRamp(x).signals, []);
  x.metrics.cumulative = 100;
  assert.deepEqual(decideDailyRamp(x).signals, ['no_reply_after_100_contacts']);
  assert.equal(decideDailyRamp(x).baseline, 14);
  x.metrics.replied = true;
  assert.deepEqual(decideDailyRamp(x).signals, []);
  x.metrics.replied = false; x.state.targeting_review_required = true;
  assert.equal(decideDailyRamp(x).reason, 'targeting_review_required');
  x.metrics.senderBounce = true;
  assert.equal(decideDailyRamp(x).action, 'stop');
  assert.deepEqual(decideDailyRamp(x).signals, ['no_reply_after_100_contacts']);
});
