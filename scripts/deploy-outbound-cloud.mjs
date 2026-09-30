import { readFile, writeFile, mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
import { randomBytes } from 'node:crypto';
import { createClient } from '@supabase/supabase-js';

// Deliberately scoped to this project. Never push or repair unrelated migrations.
const ref = 'lulnuqhgyqfkhjnuvpsd';
if (new URL(process.env.SUPABASE_URL).hostname !== `${ref}.supabase.co`) throw new Error('Wrong Supabase project');
for (const name of ['SUPABASE_SERVICE_ROLE_KEY', 'SMARTLEAD_API_KEY']) if (!process.env[name]) throw new Error(`${name} missing`);
const dir = await mkdtemp(join(tmpdir(), '3xrep-outbound-'));
function cli(args) {
  try { return execFileSync('supabase', args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }); }
  catch { throw new Error(`Supabase ${args.slice(0, 2).join(' ')} failed; inspect the private platform logs`); }
}
function quote(value) { return `'${value.replaceAll("'", "''")}'`; }
async function query(sql) {
  const file = join(dir, 'query.sql');
  await writeFile(file, sql, { mode: 0o600 });
  return JSON.parse(cli(['db', 'query', '--linked', '--file', file, '--output', 'json'])).rows;
}
try {
  const version = '20260930200000';
  const present = await query(`select version from supabase_migrations.schema_migrations where version = '${version}';`);
  if (!present.length) {
    const migration = await readFile(`supabase/migrations/${version}_outbound_cloud_control.sql`, 'utf8');
    await query(`begin;\n${migration}\ninsert into supabase_migrations.schema_migrations(version,name,statements) values ('${version}','outbound_cloud_control',array[${quote(migration)}]);\ncommit;`);
    console.log('Installed only the outbound cloud migration.');
  }
  const db = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });
  const { data: existing, error } = await db.from('outbound_mailboxes').select('id');
  if (error) throw new Error('Mailbox state read failed');
  const allowedIds = new Set(['23568551', '24049951', '24049938', '24049619']);
  const missing = [...allowedIds].some(id => !existing.some(e => String(e.id) === id));
  const initial = missing ? JSON.parse(await readFile('data/outbound/ramp-up-state.json', 'utf8')) : { accounts: {} };
  for (const [id, state] of Object.entries(initial.accounts)) {
    if (!allowedIds.has(id) || existing.some(e => String(e.id) === id)) continue;
    const { email, approved, ...rest } = state;
    const { error } = await db.from('outbound_mailboxes').insert({ id: Number(id), email, domain: email.split('@')[1], approved,
      state: { ...rest, ever_attached: rest.campaign_ids.length > 0 } });
    if (error) throw new Error('Mailbox bootstrap failed');
  }
  // Reuse the same trigger secret on subsequent deployments to avoid a cutover gap.
  const secretRows = await query("select decrypted_secret from vault.decrypted_secrets where name = '3xrep_outbound_cron_secret';");
  const secret = secretRows[0]?.decrypted_secret || randomBytes(32).toString('hex');
  const file = join(dir, 'secrets.env');
  await writeFile(file, `SMARTLEAD_API_KEY=${process.env.SMARTLEAD_API_KEY}\nOUTBOUND_CRON_SECRET=${secret}\n`, { mode: 0o600 });
  cli(['secrets', 'set', '--project-ref', ref, '--env-file', file]);
  cli(['functions', 'deploy', 'outbound-control', '--project-ref', ref, '--use-api']);
  console.log('Function deployed; credentials transferred privately.');

  const endpoint = `${process.env.SUPABASE_URL}/functions/v1/outbound-control`;
  const unauthorized = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' });
  if (unauthorized.status !== 401) throw new Error('Unauthorized request not rejected');
  for (const dryRun of [true, false]) {
    const response = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-outbound-secret': secret },
      body: JSON.stringify({ dryRun }), signal: AbortSignal.timeout(135000) });
    if (!response.ok) throw new Error(`Hosted control returned HTTP ${response.status}; inspect outbound_control_runs`);
    const result = await response.json();
    if (!result.runId || result.status === 'already_running' || result.attributionComplete !== true) throw new Error('Hosted control not fully verified');
    console.log(JSON.stringify({ runId: result.runId, dryRun, synced: result.synced, attributionComplete: result.attributionComplete,
      decisions: result.decisions.map(({ mailboxId, action, reason, cap }) => ({ mailboxId, action, reason, cap })) }));
  }

  if (!secretRows.length) await query(`select vault.create_secret(${quote(secret)}, '3xrep_outbound_cron_secret');`);
  // pg_cron is UTC. Two candidate hours plus a Paris-time guard yield one
  // daily invocation at 01:00, in summer and winter, without changing server timezone.
  await query(`create extension if not exists pg_net with schema extensions;
select cron.schedule('3xrep-outbound-cloud-01h', '0 23,0 * * *', $job$
  select net.http_post(
    url := '${endpoint}',
    headers := jsonb_build_object('Content-Type','application/json','x-outbound-secret',
      (select decrypted_secret from vault.decrypted_secrets where name = '3xrep_outbound_cron_secret')),
    body := '{"dryRun":false}'::jsonb, timeout_milliseconds := 135000)
  where extract(hour from now() at time zone 'Europe/Paris') = 1;
$job$);`);
  console.log('Verified cloud control enabled for 01:00 Europe/Paris.');
} finally { await rm(dir, { recursive: true, force: true }); }
