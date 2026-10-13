import test from 'node:test';
import assert from 'node:assert/strict';
import { decideDailyRamp, sendingDate } from './daily-ramp.mjs';

function fixture(baseline = 11) {
  return { account: { id: 7, message_per_day: baseline, is_smtp_success: true, is_imap_success: true,
    warmup_details: { status: 'ACTIVE', warmup_created_at: '2026-09-21T19:02:42.915Z' } },
    state: { approved: true, observed_cap: baseline, warmup_started_at: '2026-09-21T19:02:42.915Z',
      daily_plan: { version: 2, target: 43, baseline } },
    stats: { sent_count: 80, inbox_count: 80, spam_count: 0, stats_by_date: [{ date: '2026-10-13' }] },
    metrics: { attempted: 80, cumulative: 160, bounced: 0, rate: 0, bounceIds: [], effectiveDays: 3, replied: true },
    now: new Date('2026-10-13T23:00:00Z'), complete: true, campaignActive: true };
}
test('daily bases advance a bounded step; outages and idle dates never cause catch-up', () => {
  const x = fixture(); assert.equal(decideDailyRamp(x).baseline, 13);
  x.now = new Date('2026-11-03T00:00:00Z'); x.stats.stats_by_date = [{ date: '2026-11-02' }];
  assert.equal(decideDailyRamp(x).baseline, 13);
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
  x.state.resolved_bounce_ids = ['old']; assert.equal(decideDailyRamp(x).baseline, 13);
  x.account.message_per_day = 45;
  assert.equal(decideDailyRamp(x).reason, 'external_cap_change');
});
test('real recipient evidence gates higher bases and lack of replies triggers review', () => {
  const x = fixture(25); x.metrics.cumulative = 49;
  assert.equal(decideDailyRamp(x).reason, 'insufficient_real_sending_for_25');
  const y = fixture(35); y.metrics.cumulative = 99;
  assert.equal(decideDailyRamp(y).reason, 'insufficient_real_sending_for_35');
  y.metrics.cumulative = 150; y.metrics.replied = false;
  assert.equal(decideDailyRamp(y).reason, 'targeting_review_required');
});
test('delivery incidents reduce once and severe failures stop', () => {
  const x = fixture(25); Object.assign(x.metrics, { rate: .03, bounced: 3, bounceIds: ['b'] });
  const d = decideDailyRamp(x); assert.equal(d.cap, 20); assert.equal(d.baseline, 20);
  x.state.handled_bounce_ids = ['b'];
  assert.equal(decideDailyRamp(x).reason, 'bounce_incident_already_handled');
  x.metrics.senderBounce = true; assert.equal(decideDailyRamp(x).action, 'stop');
  const z = fixture(); z.stats = {}; assert.equal(decideDailyRamp(z).reason, 'warmup_not_ready');
});
