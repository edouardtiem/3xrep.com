import test from 'node:test';
import assert from 'node:assert/strict';
import { decideRamp, realEvents, metricsFor, localDate } from './ramp-up.mjs';

function fixture(overrides = {}) {
  return {
    account: { id: 1, from_email: 'one@example.com', message_per_day: 5, is_smtp_success: true, is_imap_success: true,
      warmup_details: { status: 'ACTIVE', blocked_reason: false, warmup_created_at: '2026-09-21T19:02:42.915Z' } },
    state: { approved: true, stage: 5, observed_cap: 5 },
    stats: { sent_count: '88', inbox_count: '88', spam_count: '0', stats_by_date: [{ date: '2026-10-11' }] },
    metrics: { attempted: 25, cumulative: 30, bounced: 0, bounceIds: [], rate: 0, effectiveDays: 5, replied: true },
    now: new Date('2026-10-11T23:00:00Z'), ...overrides,
  };
}
test('Paris 01:00 prepares the next US sending day, including DST', () => {
  assert.equal(localDate('2026-10-11T23:00:00Z', 'Europe/Paris'), '2026-10-12');
  assert.equal(decideRamp(fixture()).cap, 15);
  const x = fixture({ now: new Date('2026-11-02T00:00:00Z') });
  x.stats.stats_by_date = [{ date: '2026-11-01' }];
  assert.equal(decideRamp(x).stage, 15); // Never skips straight to 25.
});
test('a delayed run cannot skip stages or count idle days', () => {
  const x = fixture({ now: new Date('2026-11-02T00:00:00Z') });
  x.stats.stats_by_date = [{ date: '2026-11-01' }];
  x.metrics.effectiveDays = 0;
  assert.equal(decideRamp(x).action, 'hold');
});
test('warmup-only week cannot attach or send, even with a configured cap', () => {
  const x = fixture({ now: new Date('2026-09-30T23:00:00Z') });
  x.account.warmup_details.warmup_created_at = '2026-09-30T15:41:44.900Z';
  x.account.message_per_day = 2;
  x.state = { approved: true, stage: 0, observed_cap: 2 };
  x.stats.stats_by_date = [{ date: '2026-09-30' }];
  assert.equal(decideRamp(x).reason, 'warmup_only');
});
test('new box starts at 2 on October 7, without borrowing another box age', () => {
  const x = fixture({ now: new Date('2026-10-06T23:00:00Z') });
  x.account.warmup_details.warmup_created_at = '2026-09-30T15:41:44.900Z';
  x.account.message_per_day = 2;
  x.state = { approved: true, stage: 0, observed_cap: 2 };
  x.stats.stats_by_date = [{ date: '2026-10-06' }];
  assert.deepEqual(decideRamp(x), { action: 'increase', reason: 'next_stage', cap: 2, stage: 2 });
});
test('little evidence, missing data and external cap changes block increases', () => {
  const x = fixture();
  x.metrics.cumulative = 19;
  assert.equal(decideRamp(x).action, 'hold');
  assert.equal(decideRamp(fixture({ complete: false })).reason, 'sender_attribution_incomplete');
  const y = fixture(); y.account.message_per_day = 50;
  assert.equal(decideRamp(y).reason, 'external_cap_change');
  const z = fixture(); z.stats = {};
  assert.equal(decideRamp(z).reason, 'warmup_not_ready');
});
test('small samples require bounce review; unresolved incidents do not age away', () => {
  const x = fixture(); x.metrics.bounceIds = ['b']; x.metrics.bounced = 1;
  assert.equal(decideRamp(x).reason, 'bounce_review_required');
  x.metrics.bounceIds = []; x.state.pending_bounce_ids = ['b'];
  assert.equal(decideRamp(x).reason, 'bounce_review_required');
  x.state.resolved_bounce_ids = ['b'];
  assert.equal(decideRamp(x).cap, 15);
});
test('20 percent reduction is not compounded daily for the same incident', () => {
  const x = fixture(); Object.assign(x.metrics, { attempted: 100, bounced: 3, rate: .03, bounceIds: ['b'] });
  assert.equal(decideRamp(x).cap, 4);
  x.state.handled_bounce_ids = ['b'];
  assert.equal(decideRamp(x).action, 'hold');
});
test('sender block and high bounce rates stop sending', () => {
  const x = fixture(); x.metrics.senderBounce = true;
  assert.equal(decideRamp(x).action, 'stop');
  const y = fixture(); Object.assign(y.metrics, { attempted: 100, rate: .05 });
  assert.equal(decideRamp(y).action, 'stop');
});
test('domain incident blocks a sibling increase', () => {
  assert.equal(decideRamp(fixture({ domainBlocked: true })).reason, 'domain_incident');
});
test('no compound bonus, no volume growth on weekends', () => {
  const x = fixture(); x.state.stage = 25; x.state.observed_cap = 30; x.account.message_per_day = 30;
  Object.assign(x.metrics, { attempted: 80, cumulative: 100, rate: 0 });
  assert.equal(decideRamp(x).action, 'hold');
  const y = fixture({ now: new Date('2026-10-09T23:00:00Z') });
  y.stats.stats_by_date = [{ date: '2026-10-09' }];
  assert.equal(decideRamp(y).reason, 'weekend');
});
test('message history attributes sender; repeat bounce events count one recipient', () => {
  const staged = [{ entries: [{ entry: { lead: { email: 'recipient@example.org' } },
    sent: [{ from: 'One <one@example.com>', stats_id: 'a' }, { from: 'one@example.com', stats_id: 'b' }],
    stats: [{ stats_id: 'a', sent_time: '2026-10-08T14:00:00Z', is_bounced: true },
      { stats_id: 'b', sent_time: '2026-10-09T14:00:00Z', is_bounced: true }] }] }];
  const real = realEvents(staged, [{ id: 1, from_email: 'one@example.com' }]);
  assert.equal(real.complete, true);
  const m = metricsFor(1, real.events, new Date('2026-10-09T23:00:00Z'), '2026-10-07T23:00:00Z');
  assert.equal(m.bounced, 1); assert.equal(m.attempted, 1); assert.equal(m.effectiveDays, 2);
  staged[0].entries[0].sent[0].from = undefined;
  assert.equal(realEvents(staged, [{ id: 1, from_email: 'one@example.com' }]).complete, false);
});
