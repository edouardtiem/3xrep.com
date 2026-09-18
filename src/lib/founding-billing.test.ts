import assert from "node:assert/strict";
import {test} from "node:test";
import type Stripe from "stripe";
import {reconcileFoundingBilling} from "./founding-admin";
import {devOrg} from "./orgs";
import {subscriptionAccessStatus} from "./stripe-base-access";

function scenario(mixed=false, invoice=false, failure=false){
  const actions:string[]=[];
  const sub={id:"sub_1",status:"active",schedule:null,items:{data:[{id:"si_base",price:{id:"price_base"}},...(mixed ? [{id:"si_extra",price:{id:"price_extra"}}] : [])]}};
  const stripe={
    checkout:{sessions:{
      list:()=>[{id:"cs_1",mode:"subscription"}],
      retrieve:async()=>({id:"cs_1",status:"open",subscription:"sub_1"}),
      listLineItems:async()=>({data:[{price:{id:"price_base"}}]}),
      expire:async()=>{actions.push("expire");if(failure) throw new Error("Stripe unavailable");return {id:"cs_1",status:"expired",subscription:"sub_1"};},
    }},
    subscriptions:{list:()=>[sub],retrieve:async()=>sub,
      cancel:async(_id:string,params:unknown)=>{assert.deepEqual(params,{invoice_now:false,prorate:false});actions.push("cancel");},
      update:async(_id:string,params:unknown)=>{assert.deepEqual(params,{items:[{id:"si_base",deleted:true}],proration_behavior:"none"});actions.push("remove-base");},
    },
    invoices:{list:({status}:{status:string})=>invoice && status === "open" ? [{id:"in_open"}] : [],listLineItems:()=>[{pricing:{price_details:{price:"price_base"}}}]},
  } as unknown as Stripe;
  const org={...devOrg(),id:"org-1",stripe_customer_id:"cus_1",stripe_subscription_id:"sub_1"};
  return {stripe,org,actions};
}
test("grant expires open checkouts and cancels base subscription without a new invoice",async()=>{
  const s=scenario();await reconcileFoundingBilling(s.stripe,s.org,new Set(),"price_base");assert.deepEqual(s.actions,["expire","cancel"]);
});
test("grant removes only the base item and preserves future optional add-ons",async()=>{
  const s=scenario(true);await reconcileFoundingBilling(s.stripe,s.org,new Set(),"price_base");assert.deepEqual(s.actions,["expire","remove-base"]);
});
test("grant stays pending when a checkout cannot expire or an unpaid base invoice exists",async()=>{
  const fail=scenario(false,false,true);await assert.rejects(reconcileFoundingBilling(fail.stripe,fail.org,new Set(),"price_base"),/still open/);assert.deepEqual(fail.actions,["expire"]);
  const debt=scenario(false,true);await assert.rejects(reconcileFoundingBilling(debt.stripe,debt.org,new Set(),"price_base"),/Resolve base-plan invoice/);
});
test("subscription status is conservative, including paused and incomplete",()=>{
  assert.equal(subscriptionAccessStatus("active"),"active");
  assert.equal(subscriptionAccessStatus("trialing"),"trial");
  assert.equal(subscriptionAccessStatus("canceled"),"canceled");
  for(const status of ["past_due","unpaid","paused","incomplete","incomplete_expired"]) assert.equal(subscriptionAccessStatus(status),"lapsed");
});

test("billing reconciliation ignores old subscriptions, reads current state and preserves Founding",async()=>{
  const {syncBaseSubscription}=await import("./stripe-base-access");
  const names=["SUPABASE_URL","SUPABASE_SERVICE_ROLE_KEY","STRIPE_PRICE_ID"];
  const saved=Object.fromEntries(names.map(name=>[name,process.env[name]]));
  const original=globalThis.fetch;
  let row={...devOrg(),id:"a3d2d3d0-1111-4111-8111-111111111111",status:"trial",stripe_subscription_id:"sub_current",founding_state:"none"};
  const changes:Record<string,unknown>[]=[];
  let canceled=0;
  try{
    process.env.SUPABASE_URL="https://database.invalid";process.env.SUPABASE_SERVICE_ROLE_KEY="test-key";process.env.STRIPE_PRICE_ID="price_base";
    globalThis.fetch=async(input,init)=>{
      const url=String(input);
      if(init?.method === "PATCH") { const patch=JSON.parse(String(init.body));changes.push(patch);row={...row,...patch};return new Response(null,{status:204}); }
      if(url.includes("founding_audit")) return new Response(null,{status:201});
      return new Response(JSON.stringify(row),{headers:{"Content-Type":"application/json"}});
    };
    const stripe={subscriptions:{retrieve:async()=>({id:"sub_current",status:"active",items:{data:[{id:"item",price:{id:"price_base"}}]}}),cancel:async()=>{canceled++;}}} as unknown as Stripe;
    await syncBaseSubscription(stripe,row,"sub_old");assert.equal(changes.length,0);
    await syncBaseSubscription(stripe,row,"sub_current");assert.equal(row.status,"active");
    row={...row,status:"canceled",founding_state:"founding"};
    const before=changes.length;
    await syncBaseSubscription(stripe,row,"sub_current");
    assert.equal(canceled,1);assert.equal(changes.length,before);assert.equal(row.founding_state,"founding");
  }finally{
    globalThis.fetch=original;
    for(const name of names){if(saved[name]===undefined)delete process.env[name];else process.env[name]=saved[name];}
  }
});
