import assert from "node:assert/strict";
import { test } from "node:test";
import { readFile } from "node:fs/promises";
import { PGlite } from "@electric-sql/pglite";
import { GET, PATCH } from "../app/api/admin/feedback/route";
import { feedbackSchema } from "./feedback";

test("feedback: separate explicit ratings from actions and permit unsolicited words", () => {
  assert.equal(feedbackSchema.safeParse({ kind: "spontaneous", answer: "Too much detail." }).success, true);
  assert.equal(feedbackSchema.safeParse({ kind: "action", answer: "I tried it." }).success, false);
  assert.equal(feedbackSchema.safeParse({ kind: "spontaneous", answer: "   " }).success, false);
  assert.equal(feedbackSchema.safeParse({ kind: "outcome", output_id: "00000000-0000-4000-8000-000000000001", answer: "They answered.", useful: true }).success, false);
});

test("PostgreSQL feedback: paid workspaces, concurrent invitations, ownership, independent responses, expiry and permissions", async () => {
  const db = new PGlite();
  try {
    await db.exec("create role anon; create role authenticated; create role service_role bypassrls;");
    for (const file of ["20260902170000_orgs.sql", "20260914180000_item6_trial.sql", "20260918120000_founding_20.sql", "20260930190000_user_feedback.sql"]) {
      await db.exec(await readFile(`supabase/migrations/${file}`, "utf8"));
    }
    const create = async (n: number) => (await db.query<{ id: string }>("insert into orgs(key_hash,referral_code,status) values($1,$2,'active') returning id", [`key${n}`, `ref${n}`])).rows[0].id;
    const a = await create(1), b = await create(2);
    const output = async () => (await db.query<{ record_beta_usage: string }>("select record_beta_usage($1,'audit_deal',null,true)", [a])).rows[0].record_beta_usage;
    const first = await output(), second = await output();
    const claim = async (id: string, org = a) => (await db.query<{ prepare_feedback_output: boolean }>("select prepare_feedback_output($1,$2,'audit_deal','v1')", [org, id])).rows[0].prepare_feedback_output;
    const offered = await Promise.all([claim(first), claim(second)]);
    assert.equal(offered.filter(Boolean).length, 1);
    await assert.rejects(claim(first, b), /Unknown workspace result/);
    await db.query("update feedback_prompt_state set last_offered_at=now()-interval '8 days' where org_id=$1", [a]);
    assert.equal(await claim(await output()), true);
    await db.query("insert into user_feedback(org_id,output_id,kind,answer,useful) values($1,$2,'opinion','Too abstract.',false)", [a, first]);
    await db.query("insert into user_feedback(org_id,output_id,kind,answer) values($1,$2,'action','I asked the question.'),($1,$2,'outcome','They introduced the buyer.')", [a, first]);
    assert.equal((await db.query("select * from user_feedback where org_id=$1", [a])).rows.length, 3);
    await assert.rejects(db.query("insert into user_feedback(org_id,output_id,kind,answer) values($1,$2,'opinion','Wrong workspace')", [b, first]), /foreign key/);
    await assert.rejects(db.query("insert into user_feedback(org_id,output_id,kind,answer,useful) values($1,$2,'outcome','No rating',true)", [a, second]), /check constraint/);
    await db.query("insert into user_feedback(org_id,kind,answer) values($1,'spontaneous','Please simplify.')", [b]);
    // Editing the opinion retains the initial expiry and the independently shared outcome.
    await db.exec("update user_feedback set expires_at=now()-interval '1 day' where kind='opinion';");
    await db.query("insert into user_feedback(org_id,output_id,kind,answer) values($1,$2,'opinion','Actually useful') on conflict(org_id,output_id,kind) do update set answer=excluded.answer", [a, first]);
    await db.exec("select purge_user_feedback();");
    assert.equal((await db.query("select * from user_feedback where kind='opinion'")).rows.length, 0);
    assert.equal((await db.query("select * from user_feedback where kind='outcome'")).rows.length, 1);
    await db.exec("set role anon;");
    await assert.rejects(db.query("select * from user_feedback"), /permission denied/);
    await assert.rejects(db.query("select prepare_feedback_output($1,$2,'audit_deal','v1')", [a, first]), /permission denied/);
    await assert.rejects(db.query("select purge_user_feedback()"), /permission denied/);
    await db.exec("reset role;");
  } finally { await db.close(); }
});

test("feedback administration rejects unauthenticated reads and changes", async () => {
  assert.equal((await GET(new Request("http://localhost/api/admin/feedback"))).status, 401);
  assert.equal((await PATCH(new Request("http://localhost/api/admin/feedback", { method: "PATCH", body: "{}" }))).status, 401);
});
