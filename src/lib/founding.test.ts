import assert from "node:assert/strict";
import { test } from "node:test";
import { includedBasePlan,organizationEntitlements,meaningfulOutput,attribution,betaOpen } from "./founding";
import { isFoundingAdmin } from "./founding-admin";
const now=new Date("2026-10-01T12:00:00Z");
const expired={status:"lapsed",trial_started_at:"2026-08-01",trial_ends_at:"2026-08-15",card_deadline_at:"2026-08-08",stripe_subscription_id:null};
test("entitlements preserve paid access, beta deadlines and permanent Founding rights",()=>{
  assert.equal(organizationEntitlements({...expired,status:"active"},now),"full");
  assert.equal(organizationEntitlements({...expired,beta_enrolled_at:"2026-09-18",beta_access_until:"2026-11-01"},now),"full");
  assert.equal(organizationEntitlements({...expired,beta_enrolled_at:"2026-09-18",beta_access_until:"2026-09-30"},now),"lapsed");
  for(const status of ["canceled","lapsed","needs_card","trial","active"]) assert.equal(organizationEntitlements({...expired,status,founding_state:"founding"},now),"full");
  assert.equal(organizationEntitlements({...expired,founding_state:"revoked"},now),"lapsed");
  assert.equal(includedBasePlan({founding_state:"pending"},now),false);
  assert.equal(organizationEntitlements({...expired,comped:true},now),"full");
});
test("only actual outputs count; refusals, empty horizon and lookup do not",()=>{
  assert.equal(meaningfulOutput("audit_deal",{action:{quoi:"Ask"}}),true);
  assert.equal(meaningfulOutput("audit_deal",{refus:"No evidence",action:{}}),false);
  assert.equal(meaningfulOutput("plan_horizon",{agenda:[]}),false);
  assert.equal(meaningfulOutput("plan_horizon",{agenda:[{refus:"missing",action:{}}]}),false);
  assert.equal(meaningfulOutput("plan_horizon",{agenda:[{refus:null,action:{quoi:"Ask"}}]}),true);
  assert.equal(meaningfulOutput("pipe_review",{deals:[{action:{quoi:"Ask"}}]}),true);
  assert.equal(meaningfulOutput("methode_lookup",{action:{}}),false);
});
test("admin rejects missing, weak, wrong-length and query-string credentials",()=>{
  const saved=process.env.FOUNDING_ADMIN_TOKEN;
  try{
    delete process.env.FOUNDING_ADMIN_TOKEN;
    assert.equal(isFoundingAdmin(new Request("https://example.com")),false);
    process.env.FOUNDING_ADMIN_TOKEN="a".repeat(40);
    assert.equal(isFoundingAdmin(new Request("https://example.com?token="+"a".repeat(40))),false);
    assert.equal(isFoundingAdmin(new Request("https://example.com",{headers:{authorization:"Bearer wrong"}})),false);
    assert.equal(isFoundingAdmin(new Request("https://example.com",{headers:{authorization:"Bearer "+"a".repeat(40)}})),true);
  }finally{if(saved===undefined) delete process.env.FOUNDING_ADMIN_TOKEN; else process.env.FOUNDING_ADMIN_TOKEN=saved;}
});
test("source is bounded metadata and no configured beta is off",()=>{
  assert.equal(attribution({}).acquisition_source,"direct");
  assert.equal(attribution({source:"gojiberry",campaign:"founding-20"}).acquisition_campaign,"founding-20");
  assert.equal(attribution({source:"x".repeat(200)}).acquisition_source.length,100);
  assert.equal(betaOpen(null,now),false);
});
test("admin routes enforce authorization before reading configuration or data",async()=>{
  const {GET,POST}=await import("../app/api/admin/founding/route");
  assert.equal((await GET(new Request("https://example.com"))).status,401);
  assert.equal((await POST(new Request("https://example.com",{method:"POST",body:'{"action":"end_beta"}'}))).status,401);
});

test("public signup does not create a standard trial while Beta is closed",async()=>{
  const names=["SUPABASE_URL","NEXT_PUBLIC_SUPABASE_URL","SUPABASE_SERVICE_ROLE_KEY","SUPABASE_SECRET_KEY"];
  const saved=Object.fromEntries(names.map(name=>[name,process.env[name]]));
  try{
    for(const name of names) delete process.env[name];
    const {POST}=await import("../app/api/orgs/start/route");
    const res=await POST(new Request("https://example.com/api/orgs/start",{method:"POST",body:new URLSearchParams({email:"new@example.com"})}));
    assert.equal(res.status,409);
    assert.match(await res.text(),/No workspace or standard trial was created/);
  }finally{
    for(const name of names){if(saved[name]===undefined)delete process.env[name];else process.env[name]=saved[name];}
  }
});

test("real access resolver honors beta and Founding while rejecting an unknown key",async()=>{
  const {resolveAccess,trialExtras,maybeStartTrial}=await import("./access");
  const {devOrg}=await import("./orgs");
  const names=["SUPABASE_URL","SUPABASE_SERVICE_ROLE_KEY","MCP_OPEN_TOOLS","DEV_ORG_KEY"];
  const saved=Object.fromEntries(names.map(name=>[name,process.env[name]]));
  const original=globalThis.fetch;
  let row:Record<string,unknown>|null={...devOrg(),id:"a3d2d3d0-1111-4111-8111-111111111111",status:"canceled",founding_state:"founding"};
  try{
    process.env.SUPABASE_URL="https://database.invalid";
    process.env.SUPABASE_SERVICE_ROLE_KEY="test-key";
    delete process.env.MCP_OPEN_TOOLS;delete process.env.DEV_ORG_KEY;
    globalThis.fetch=async()=>new Response(JSON.stringify(row),{headers:{"Content-Type":"application/json"}});
    const req=new Request("https://example.com/api/mcp",{headers:{Authorization:"Bearer workspace-key"}});
    assert.equal((await resolveAccess(req,now)).kind,"full");
    row={...row,founding_state:"candidate",beta_enrolled_at:"2026-09-18",beta_access_until:"2026-11-01"};
    const beta=await resolveAccess(req,now);assert.equal(beta.kind,"full");
    if(beta.kind==='full') {
      assert.equal(trialExtras(beta.org).paiement,undefined);
      assert.equal((await maybeStartTrial(beta.org,"audit_deal")).status,"canceled");
    }
    row={...row,beta_access_until:"2026-09-30"};assert.equal((await resolveAccess(req,now)).kind,"lapsed");
    row=null;assert.equal((await resolveAccess(req,now)).kind,"no_key");
  }finally{
    globalThis.fetch=original;
    for(const name of names){if(saved[name]===undefined)delete process.env[name];else process.env[name]=saved[name];}
  }
});
