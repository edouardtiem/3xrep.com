// Optional local database check. Install @electric-sql/pglite in a temporary folder,
// then set PGLITE_MODULE to its dist/index.js. Never connects to Supabase.
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
const { PGlite } = await import(process.env.PGLITE_MODULE || '@electric-sql/pglite');
const db = new PGlite();
const read = name => readFile(new URL(`../supabase/migrations/${name}`, import.meta.url), 'utf8');
try {
  await db.exec('create role anon; create role authenticated; create role service_role;');
  for (const name of ['20260902170000_orgs.sql', '20260906160000_mcp_calls.sql', '20260914180000_item6_trial.sql']) await db.exec(await read(name));
  const migration = await read('20260916200000_brain_reliability.sql');
  // pg_cron is Supabase infrastructure and cannot run inside PGlite.
  const memory = migration.split('-- pg_cron')[0];
  await db.exec(memory);
  await db.exec(memory); // migration is repeatable
  const id = '00000000-0000-4000-8000-000000000001';
  await db.query("insert into orgs(id,key_hash,referral_code) values ($1,'test','test')", [id]);
  const record = async (etat = 'trou', hash = 'deal-a') => (await db.query(
    'select * from record_judgment_piece($1,$2,$3,$4,$5,$6,$7,$8)', [id, hash, 'budget', etat, null, 'small', 'discovery', 'ouvert'])).rows[0];
  assert.equal((await record()).times_trou, 1);
  assert.equal((await record()).times_trou, 1);
  await Promise.all(Array.from({ length: 10 }, () => record()));
  assert.equal((await record()).times_trou, 1);
  await db.exec("update judgment_skeleton set judged_at=now()-interval '1 day', trou_since=now()-interval '3 days'");
  assert.equal((await record()).times_trou, 2);
  assert.equal((await record('su')).times_trou, 0);
  assert.equal((await record('su')).trou_since, null);
  assert.equal((await record()).times_trou, 1);
  assert.equal((await record('trou', 'deal-b')).times_trou, 1);
  const privilege = await db.query("select has_function_privilege('anon', 'record_judgment_piece(uuid,text,text,text,text,text,text,text)', 'execute') as allowed");
  assert.equal(privilege.rows[0].allowed, false);
  await db.exec("insert into mcp_calls(tool,ok,created_at) values ('test',true,now()-interval '15 days'),('test',true,now()-interval '13 days')");
  const deletion = migration.match(/\$\$(delete from public\.mcp_calls[^$]+)\$\$/)[1];
  await db.exec(deletion);
  assert.equal((await db.query('select count(*)::int as n from mcp_calls')).rows[0].n, 1);
  console.log('PASS: memory migration, repeated observations, reset, identity, privileges, retention deletion. pg_cron scheduling still requires a Supabase test project.');
} finally { await db.close(); }
