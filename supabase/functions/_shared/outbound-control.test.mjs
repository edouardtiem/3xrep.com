import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { PGlite } from '@electric-sql/pglite';
import { runOutboundControl } from './outbound-control.mjs';

function environment({ failReadback = false } = {}) {
  const account = { id: 1, from_email: 'one@3xrepgrow.com', message_per_day: 2, is_smtp_success: true, is_imap_success: true,
    warmup_details: { status: 'ACTIVE', warmup_created_at: '2026-09-30T15:41:44.900Z' } };
  const state = { approved: true, stage: 0, observed_cap: 2, ever_attached: false };
  const rows = [{ id: 1, approved: true, email: account.from_email, state: { ...state } }];
  const writes = [];
  const attached = new Map([['4023139', []], ['4023140', []]]);
  let posted = false;
  const smartlead = {
    get: async path => {
      if (path === 'email-accounts/') return [account];
      if (path === 'email-accounts/1/') return { ...account, message_per_day: posted && failReadback ? 50 : 2 };
      if (path.endsWith('/warmup-stats')) return { sent_count: 88, inbox_count: 88, spam_count: 0, stats_by_date: [{ date: '2026-10-06' }] };
      if (path === 'campaigns/') return [{ id: 4023139, status: 'ACTIVE' }, { id: 4023140, status: 'ACTIVE' }];
      const id = path.split('/')[1];
      if (path.endsWith('/email-accounts')) return attached.get(id).map(id => ({ id }));
      return { status: 'ACTIVE', max_leads_per_day: 1, min_time_btwn_emails: 120,
        scheduler_cron_value: { tz: 'America/New_York', days: [1, 2, 3, 4, 5], startHour: '09:00', endHour: '17:00' } };
    },
    post: async (path, body) => {
      writes.push({ path, body });
      if (path.endsWith('/email-accounts')) attached.get(path.split('/')[1]).push(...body.email_account_ids);
      else posted = true;
    },
    remove: async () => { throw new Error('Unexpected removal'); },
  };
  const db = {
    rpc: async name => ({ data: name === 'claim_outbound_control', error: null }),
    from(table) {
      let op, value, filter;
      const q = {
        select() { op ||= 'select'; return q; }, single() { return q; },
        insert(v) { op = 'insert'; value = v; return q; }, update(v) { op = 'update'; value = v; return q; },
        eq(name, v) { filter = [name, v]; return q; },
        then(resolve, reject) {
          if (table === 'outbound_mailboxes' && op === 'update' && filter?.[1] === 1) rows[0].state = structuredClone(value.state);
          const data = table === 'outbound_mailboxes' && op === 'select' ? structuredClone(rows) : { id: 'action-id' };
          return Promise.resolve({ data, error: null }).then(resolve, reject);
        },
      };
      return q;
    },
  };
  return { db, smartlead, writes, rows, sync: async () => ({ staged: [], campaigns: 2, sentMessages: 0 }), now: new Date('2026-10-06T23:00:00Z') };
}

test('hosted dry run cannot change sending caps or campaign associations', async () => {
  const x = environment();
  const result = await runOutboundControl({ ...x, dryRun: true });
  assert.equal(result.decisions[0].stage, 2);
  assert.deepEqual(x.writes, []);
  assert.equal(x.rows[0].state.stage, 0);
});
test('initial cap is set and read back before admitting a new mailbox', async () => {
  const x = environment();
  const result = await runOutboundControl(x);
  assert.equal(result.attributionComplete, true);
  assert.deepEqual(x.writes.map(w => w.path), ['email-accounts/1', 'campaigns/4023139/email-accounts', 'campaigns/4023140/email-accounts']);
  assert.deepEqual(x.writes[0].body, { max_email_per_day: 2 });
  assert.equal(x.rows[0].state.stage, 2);
});
test('failed cap verification cannot attach a mailbox or record a successful rise', async () => {
  const x = environment({ failReadback: true });
  await assert.rejects(runOutboundControl(x), /Cap verification failed/);
  assert.equal(x.writes.length, 1);
  assert.equal(x.rows[0].state.stage, 0);
});
test('database lease excludes a concurrent worker; acquisition tables remain private', async () => {
  const db = new PGlite();
  try {
    await db.exec('create role anon; create role authenticated; create role service_role;');
    await db.exec(await readFile(new URL('../../migrations/20260930200000_outbound_cloud_control.sql', import.meta.url), 'utf8'));
    const a = '11111111-1111-4111-8111-111111111111', b = '22222222-2222-4222-8222-222222222222';
    assert.equal((await db.query('select claim_outbound_control($1) as ok', [a])).rows[0].ok, true);
    assert.equal((await db.query('select claim_outbound_control($1) as ok', [b])).rows[0].ok, false);
    await db.query('select release_outbound_control($1)', [b]);
    assert.equal((await db.query('select claim_outbound_control($1) as ok', [b])).rows[0].ok, false);
    await db.query('select release_outbound_control($1)', [a]);
    assert.equal((await db.query('select claim_outbound_control($1) as ok', [b])).rows[0].ok, true);
    assert.equal((await db.query("select has_table_privilege('anon','outbound_mailboxes','select') as allowed")).rows[0].allowed, false);
    assert.equal((await db.query("select has_function_privilege('authenticated','claim_outbound_control(uuid)','execute') as allowed")).rows[0].allowed, false);
  } finally { await db.close(); }
});
