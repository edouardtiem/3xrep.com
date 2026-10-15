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
function dailyEnvironment({ baseline = 43, cap = 45, failReadback = false } = {}) {
  const x = environment();
  x.now = new Date('2026-10-13T23:00:00Z');
  const start = '2026-09-21T19:02:42.915Z';
  x.rows[0].state = { approved:true,stage:baseline,observed_cap:cap,warmup_started_at:start,stage_changed_at:'2026-10-11T00:00:00Z',
    daily_plan:{version:2,target:43,baseline},ever_attached:true };
  let mailboxCap=cap;
  const campaignCaps=new Map([['4023139',1],['4023140',1]]);
  const get=x.smartlead.get,post=x.smartlead.post;
  const account={id:1,from_email:'one@3xrepgrow.com',is_smtp_success:true,is_imap_success:true,
    warmup_details:{status:'ACTIVE',warmup_created_at:start}};
  x.smartlead.get=async path=>{
    if(path==='email-accounts/')return [{...account,message_per_day:mailboxCap}];
    if(path==='email-accounts/1/')return {...account,message_per_day:failReadback ? 99 : mailboxCap};
    if(path.endsWith('/warmup-stats'))return {sent_count:80,inbox_count:80,spam_count:0,stats_by_date:[{date:x.now.toISOString().slice(0,10)}]};
    if(path.endsWith('/email-accounts'))return [{id:1}];
    if(campaignCaps.has(path.split('/')[1])&&!path.endsWith('/'))return {...await get(path),max_new_leads_per_day:campaignCaps.get(path.split('/')[1])};
    return get(path);
  };
  x.smartlead.post=async(path,body)=>{
    await post(path,body);
    if(path==='email-accounts/1')mailboxCap=body.max_email_per_day;
    if(path.endsWith('/schedule')){
      assert.equal('max_leads_per_day' in body,false);
      campaignCaps.set(path.split('/')[1],body.max_new_leads_per_day);
    }
  };
  const from=x.db.from;
  x.db.from=table=>table==='outbound_mailbox_daily'?{upsert:async()=>({data:{},error:null})}:from(table);
  x.sequences=[{id:'A',provider_campaign_id:'4023139',controlled:true},{id:'B',provider_campaign_id:'4023140',controlled:true}];
  x.sync=async()=>({staged:[{entries:[{entry:{lead:{email:'buyer@example.org'}},
    sent:[{stats_id:'a',from:account.from_email},{stats_id:'b',from:account.from_email}],
    stats:[{stats_id:'a',sent_time:'2026-10-12T15:00:00Z',is_bounced:false},
      {stats_id:'b',sent_time:'2026-10-13T15:00:00Z',is_bounced:false}]}]}]});
  return x;
}
test('daily variation downward is not a delivery penalty and a repeated run cannot change it twice', async () => {
  const x = dailyEnvironment();
  const result=await runOutboundControl(x);
  assert.equal(result.decisions[0].reason,'daily_variation');
  assert.ok(x.rows[0].state.observed_cap<45&&x.rows[0].state.observed_cap>=41);
  assert.equal(x.rows[0].state.cooldown,false);
  assert.equal(x.rows[0].state.stage_changed_at,'2026-10-11T00:00:00Z');
  const mutations=x.writes.length;
  const again=await runOutboundControl(x);
  assert.equal(again.decisions[0].reason,'already_planned');
  assert.equal(x.writes.length,mutations);
});
function sendingHistory(dates) {
  return { staged: [{ entries: dates.map(([date, bounced], i) => ({
    entry: { lead: { email: `buyer${i}@example.org` } },
    sent: [{ stats_id: `event-${i}`, from: 'one@3xrepgrow.com' }],
    stats: [{ stats_id: `event-${i}`, sent_time: `${date}T15:00:00Z`, is_bounced: bounced, reply_time: bounced ? null : `${date}T16:00:00Z` }],
  })) }] };
}
test('verified halving persists recovery; repeated runs do not halve again and three healthy days resume slowly', async () => {
  const x = dailyEnvironment({baseline:25,cap:25});
  const history = [['2026-10-12',true],['2026-10-13',true]];
  x.sync = async () => sendingHistory(history);
  const reduced = await runOutboundControl(x);
  assert.equal(reduced.decisions[0].cap,12);
  assert.equal(x.rows[0].state.daily_plan.recovery_target,25);
  assert.equal(x.rows[0].state.cooldown,true);
  assert.equal(x.rows[0].state.stage_changed_at,x.now.toISOString());
  assert.deepEqual(x.rows[0].state.handled_bounce_ids,['event-0','event-1']);
  const writes=x.writes.length;
  assert.equal((await runOutboundControl(x)).decisions[0].reason,'bounce_review_required');
  assert.equal(x.writes.length,writes);
  x.rows[0].state.resolved_bounce_ids=['event-0','event-1'];
  history.push(['2026-10-14',false],['2026-10-15',false]);
  x.now=new Date('2026-10-15T23:00:00Z');
  assert.equal((await runOutboundControl(x)).decisions[0].reason,'recovery_observation');
  assert.equal(x.rows[0].state.observed_cap,12);
  history.push(['2026-10-16',false]);
  x.now=new Date('2026-10-18T23:00:00Z');
  const recovered=await runOutboundControl(x);
  assert.equal(recovered.decisions[0].reason,'gradual_recovery');
  assert.equal(x.rows[0].state.observed_cap,14);
  assert.equal(x.rows[0].state.cooldown,false);
  assert.equal(x.rows[0].state.daily_plan.recovery_target,25);
});
test('a failed native readback cannot mark an incident handled or enter recovery', async () => {
  const x = dailyEnvironment({baseline:25,cap:25,failReadback:true});
  x.sync=async()=>sendingHistory([['2026-10-12',true],['2026-10-13',true]]);
  await assert.rejects(runOutboundControl(x),/Cap verification failed/);
  assert.equal(x.rows[0].state.observed_cap,25);
  assert.equal(x.rows[0].state.cooldown,undefined);
  assert.equal(x.rows[0].state.handled_bounce_ids,undefined);
  assert.equal(x.rows[0].state.daily_plan.recovery_target,undefined);
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

test('no-reply signal is returned and saved with daily metrics without blocking growth', async () => {
  const x = dailyEnvironment({baseline:11,cap:11});
  x.sync = async () => {
    const history = sendingHistory(Array.from({length:100}, (_, i) => [i < 50 ? '2026-10-12' : '2026-10-13', false]));
    for (const e of history.staged[0].entries) e.stats[0].reply_time = null;
    return history;
  };
  let savedDaily;
  const from = x.db.from;
  x.db.from = table => table === 'outbound_mailbox_daily' ? {upsert:async row => {
    savedDaily = row; return {data:{},error:null};
  }} : from(table);
  const result = await runOutboundControl(x);
  const decision = result.decisions[0];
  assert.equal(decision.reason, 'progressive_daily_base');
  assert.equal(decision.baseline, 14);
  assert.deepEqual(decision.signals, ['no_reply_after_100_contacts']);
  assert.deepEqual(savedDaily.metrics.signals, decision.signals);
  assert.equal(x.rows[0].state.daily_plan.baseline, 14);
});
