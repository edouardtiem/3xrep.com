import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { PGlite } from '@electric-sql/pglite';
import { loadSequencePlans } from '../../../scripts/outbound-sequences.mjs';

test('approved openings and follow-ups compile into distinct versioned four-step plans', async () => {
  const plans = await loadSequencePlans();
  assert.deepEqual(plans.map(s => s.variant), ['A','B']);
  assert.notEqual(plans[0].content_hash, plans[1].content_hash);
  for (const s of plans) {
    assert.deepEqual(s.steps.map(x => x.seq_delay_details.delay_in_days), [0,4,5,7]);
    assert.equal(s.steps.length, 4);
    assert.deepEqual(s.steps.slice(1).map(x => x.variants[0].subject), ['','','']);
    assert.ok(s.steps[2].variants[0].email_body.includes(s.acquisition_campaign));
  }
});
test('new assignments are balanced, idempotent, verified and exclusive per company; tables stay private', async () => {
  const db = new PGlite();
  try {
    await db.exec(`create role anon;create role authenticated;create role service_role;
      create table outbound_prospects(id uuid primary key,email_verification_status text,company_domain text);
      create table outbound_campaign_leads(id uuid primary key,prospect_id uuid,first_sent_at timestamptz,is_bounced boolean,is_unsubscribed boolean,last_reply_at timestamptz);
      create table outbound_send_events(campaign_lead_id uuid,sequence_step int);
      create table outbound_mailboxes(id bigint primary key); create table outbound_control_runs(id uuid primary key);
      create table orgs(id uuid,acquisition_source text,acquisition_campaign text,is_internal boolean,activated_at timestamptz);
      create table beta_events(org_id uuid,kind text);`);
    await db.exec(await readFile(new URL('../../migrations/20261013200000_outbound_sequences_and_daily_plan.sql',import.meta.url),'utf8'));
    for (const [index,variant] of ['A','B'].entries()) await db.query(`insert into outbound_sequences(id,cohort,variant,version,provider_campaign_id,acquisition_campaign,content_hash,steps)
      values($1,'senior-beta-2026-10-13',$2,1,$3,$1,'hash','[]')`,[variant,variant,String(index)]);
    const ids=['11111111-1111-4111-8111-111111111111','22222222-2222-4222-8222-222222222222','33333333-3333-4333-8333-333333333333'];
    for (const [i,id] of ids.entries()) await db.query('insert into outbound_prospects values($1,$2,$3,$4)',[id,i===2?'unknown':'valid',`company-${i}.com`,true]);
    const assign=async id=>(await db.query('select assign_senior_beta_sequence($1) as id',[id])).rows[0].id;
    assert.equal(await assign(ids[0]),'A'); assert.equal(await assign(ids[0]),'A'); assert.equal(await assign(ids[1]),'B');
    await assert.rejects(assign(ids[2]),/CONTACT_NOT_QUALIFIED/);
    await db.query('update outbound_prospects set email_verification_status=$1,company_domain=$2 where id=$3',['valid','company-0.com',ids[2]]);
    await assert.rejects(assign(ids[2]),/duplicate key/);
    assert.equal((await db.query("select has_table_privilege('anon','outbound_sequence_results','select') as allowed")).rows[0].allowed,false);
    assert.equal((await db.query("select has_function_privilege('authenticated','assign_senior_beta_sequence(uuid)','execute') as allowed")).rows[0].allowed,false);
  } finally { await db.close(); }
});
