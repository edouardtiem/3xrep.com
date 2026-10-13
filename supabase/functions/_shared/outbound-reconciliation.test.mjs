import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {PGlite} from '@electric-sql/pglite';

test('only productive time-limited runs enqueue private continuations; retries, the fifth continuation and exhausted budgets cannot',async()=>{
 const db=new PGlite();
 try{
  await db.exec(`create role anon;create role authenticated;create role service_role;
   create schema vault;create table vault.decrypted_secrets(name text,decrypted_secret text);
   insert into vault.decrypted_secrets values('3xrep_outbound_cron_secret','test-secret');
   create schema net;create table net.calls(url text,headers jsonb,body jsonb,timeout integer);
   create function net.http_post(url text,headers jsonb,body jsonb,timeout_milliseconds integer) returns bigint language plpgsql as $$
    begin insert into net.calls values(url,headers,body,timeout_milliseconds);return 1;end;$$;
   create table outbound_sourcing_config(id integer primary key,enabled boolean,validated_run_id uuid,max_daily_contacts integer);
   insert into outbound_sourcing_config values(1,true,'11111111-1111-4111-8111-111111111111',200);
   create table outbound_sourcing_runs(id uuid primary key,mode text,status text,sending_date date,result jsonb);`);
  await db.exec(await readFile(new URL('../../migrations/20261014030000_outbound_reconciliation_queue.sql',import.meta.url),'utf8'));
  const day=(await db.query("select ((now()+interval '12 hours') at time zone 'America/New_York')::date::text as day")).rows[0].day;
  const add=async(result,mode='daily',date=day)=>{const id=crypto.randomUUID();await db.query('insert into outbound_sourcing_runs values($1,$2,$3,$4,$5)',[id,mode,'success',date,JSON.stringify(result)]);return id;};
  const enqueue=async id=>(await db.query('select queue_outbound_reconciliation($1) as queued',[id])).rows[0].queued;
  const progress={stopReason:'time_budget',shortfall:10,verified:20,imported:5};
  for(const result of [{...progress,stopReason:'stock_ready'},{...progress,shortfall:0},{...progress,verified:0,imported:0}])assert.equal(await enqueue(await add(result)),false);
  assert.equal(await enqueue(await add(progress,'test')),false);
  assert.equal(await enqueue(await add(progress,'daily','2000-01-01')),false);
  const id=await add(progress);assert.equal(await enqueue(id),true);assert.equal(await enqueue(id),false);
  const call=(await db.query('select * from net.calls')).rows[0];assert.ok(call.url.endsWith('/functions/v1/outbound-control'));assert.deepEqual(call.body,{dryRun:false});assert.equal(call.timeout,135000);
  for(let i=0;i<3;i++)assert.equal(await enqueue(await add(progress)),true);
  assert.equal(await enqueue(await add(progress)),false);assert.equal(Number((await db.query('select count(*) as n from net.calls')).rows[0].n),4);
  await db.exec('update outbound_sourcing_config set continuations_today=0;update outbound_sourcing_runs set result=result||\'{"verified":200}\'::jsonb;');
  assert.equal(await enqueue(await add(progress)),false);
  assert.equal((await db.query("select has_function_privilege('anon','queue_outbound_reconciliation(uuid)','execute') as allowed")).rows[0].allowed,false);
 }finally{await db.close();}
});
