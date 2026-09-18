import assert from "node:assert/strict";
import {test} from "node:test";
import {readFile} from "node:fs/promises";
import {PGlite} from "@electric-sql/pglite";

test("PostgreSQL: qualification, grants, concurrency cap, revocation, RLS, beta transition",async()=>{
  const db=new PGlite();
  try{
    await db.exec("create role anon; create role authenticated; create role service_role bypassrls; grant usage on schema public to service_role,anon,authenticated;");
    for(const file of ["20260902170000_orgs.sql","20260914180000_item6_trial.sql","20260918120000_founding_20.sql"]){
      await db.exec(await readFile(`supabase/migrations/${file}`,"utf8"));
    }
    await db.exec("update founding_program set enabled=true,ends_at=now()+interval '30 days';");
    const create=async(n:number,status="trial")=>{
      const r=await db.query<{id:string;founding_state:string;beta_access_until:string}>("insert into orgs(key_hash,referral_code,status,email) values($1,$2,$3,$4) returning *",[`key${n}`,`ref${n}`,status,`org${n}@example.com`]);return r.rows[0];
    };
    const first=await create(0);
    assert.equal(first.founding_state,"candidate");assert.ok(first.beta_access_until);
    await assert.rejects(db.query("select prepare_founding_grant($1,'company-0','early signup')",[first.id]),/not qualified/);
    await db.query("select record_beta_usage($1,'methode_lookup',null,false)",[first.id]);
    assert.equal((await db.query("select * from beta_events where kind='meaningful_output'")).rows.length,0);
    for(let i=0;i<3;i++){
      await db.query("select record_beta_usage($1,'plan_horizon',7,true)",[first.id]);
      if(i<2) await db.query("update beta_events set created_at=created_at-interval '1 day' where org_id=$1 and kind='meaningful_output'",[first.id]);
    }
    const d=(await db.query<{founding_state:string;sessions:number;active_days:number}>("select * from founding_dashboard where id=$1",[first.id])).rows[0];
    assert.equal(d.founding_state,"qualified");assert.equal(Number(d.sessions),3);assert.equal(Number(d.active_days),3);
    const slot=(await db.query<{prepare_founding_grant:number}>("select prepare_founding_grant($1,'company-0','three active days')",[first.id])).rows[0].prepare_founding_grant;
    assert.equal(slot,1);
    await assert.rejects(db.query("select begin_base_checkout($1)",[first.id]),/included/);
    await db.query("select finish_founding_grant($1)",[first.id]);
    await db.query("select finish_founding_grant($1)",[first.id]);
    assert.equal((await db.query("select * from beta_events where kind='founding_granted'")).rows.length,1);
    await db.query("update orgs set status='canceled' where id=$1",[first.id]);
    assert.equal((await db.query<{founding_state:string}>("select founding_state from orgs where id=$1",[first.id])).rows[0].founding_state,"founding");
    await assert.rejects(db.query("delete from orgs where id=$1",[first.id]),/foreign key/);
    // Concurrent callers queue through PostgreSQL transactions; every allocation is unique.
    const others=[];
    for(let i=1;i<=20;i++){const o=await create(i);others.push(o);await db.query("update orgs set founding_state='qualified' where id=$1",[o.id]);}
    const grants=await Promise.allSettled(others.map((o,i)=>db.query("select prepare_founding_grant($1,$2,'manually verified use')",[o.id,`company-${i+1}`])));
    assert.equal(grants.filter(r=>r.status==='fulfilled').length,19);
    assert.equal(grants.filter(r=>r.status==='rejected').length,1);
    assert.equal((await db.query("select * from founding_slots")).rows.length,20);
    await db.query("select manage_founding($1,'revoke','abuse confirmed')",[first.id]);
    await assert.rejects(db.query("select prepare_founding_grant($1,'company-extra','real activity')",[others[19].id]),/20 places/);
    await db.query("select prepare_founding_grant($1,'company-0','restore same workspace')",[first.id]);
    await db.query("select finish_founding_grant($1)",[first.id]);
    const internal=await create(100);
    await db.query("update orgs set is_internal=true,founding_state='qualified' where id=$1",[internal.id]);
    await assert.rejects(db.query("select prepare_founding_grant($1,'internal-company','internal activity')",[internal.id]),/internal workspace/);
    await db.query("select record_beta_usage($1,'audit_deal',null,true)",[internal.id]);
    assert.equal((await db.query("select * from beta_events where org_id=$1 and kind='meaningful_output'",[internal.id])).rows.length,0);
    const paid=await create(22,"active");assert.equal(paid.founding_state,"none");
    await db.exec("select end_public_beta();");
    const after=await create(23);assert.equal(after.founding_state,"none");assert.equal(after.beta_access_until,null);
    const grace=(await db.query<{days:number}>("select extract(epoch from (beta_access_until-now()))/86400 as days from orgs where id=$1",[first.id])).rows[0];
    assert.ok(Number(grace.days)>13 && Number(grace.days)<=14);
    // Checkout reservation survives a crash and prevents a simultaneous award.
    await db.query("update orgs set founding_state='qualified' where id=$1",[after.id]);
    const op=(await db.query<{begin_base_checkout:string}>("select begin_base_checkout($1)",[after.id])).rows[0].begin_base_checkout;
    assert.equal((await db.query<{begin_base_checkout:string}>("select begin_base_checkout($1)",[after.id])).rows[0].begin_base_checkout,op);
    await assert.rejects(db.query("select prepare_founding_grant($1,'last-company','verified activity')",[after.id]),/checkout in progress/);
    await db.query("select finish_base_checkout($1,$2,'cs_test')",[after.id,op]);
    await db.exec("set role anon;");
    await assert.rejects(db.query("select * from founding_dashboard"),/permission denied/);
    await assert.rejects(db.query("select prepare_founding_grant($1,'evil','attempt bypass')",[after.id]),/permission denied/);
    await db.exec("reset role;");
  }finally{await db.close();}
});
