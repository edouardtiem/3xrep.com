import type Stripe from "stripe";
import type { OrgRow } from "@/lib/orgs";
import { timingSafeEqual } from "node:crypto";
import { admin } from "@/lib/supabase-admin";
import { getBetaProgram } from "@/lib/founding";
import { orgById } from "@/lib/orgs";
import { stripeClient, stripePriceId, stripeSecret } from "@/lib/stripe-env";

export function isFoundingAdmin(req: Request): boolean {
  const secret = process.env.FOUNDING_ADMIN_TOKEN;
  const token = req.headers.get("authorization")?.replace(/^Bearer /i, "");
  if (!secret || secret.length < 32 || !token) return false;
  const expected = Buffer.from(secret); const actual = Buffer.from(token);
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}
export async function requireProgramEnvironment() {
  const program = await getBetaProgram();
  if (!program) throw new Error("Program database unavailable");
  const environment = process.env.FOUNDING_ENVIRONMENT;
  if (!environment || environment !== program.environment) throw new Error("Program environment mismatch");
  if (environment === "production" && process.env.VERCEL_ENV !== "production") throw new Error("Production grants require the production deployment");
  return program;
}
export async function grantFounding(orgId: string, company: string, reason: string) {
  const program = await requireProgramEnvironment();
  const db = admin()!;
  const { data: slot, error } = await db.rpc("prepare_founding_grant", { p_org: orgId, p_company: company, p_reason: reason });
  if (error) throw new Error(error.message);
  const org = await orgById(orgId);
  if (!org) throw new Error("Workspace unavailable");
  if (org.founding_state === "founding") return { slot, status: "founding" };
  const { data: sessions, error: sessionsError } = await db.from("base_checkout_sessions").select("session_id").eq("org_id",orgId);
  if (sessionsError) throw new Error(sessionsError.message);
  const ids = new Set((sessions ?? []).map(s => s.session_id as string));
  if (org.stripe_session_id) ids.add(org.stripe_session_id);
  if (ids.size || org.stripe_customer_id || org.stripe_subscription_id) {
    const secret = stripeSecret();
    if (!secret || !secret.startsWith(program.environment === "production" ? "sk_live_" : "sk_test_") && !secret.startsWith(program.environment === "production" ? "rk_live_" : "rk_test_")) throw new Error("Stripe key environment mismatch");
    const stripe = stripeClient();
    const priceId = stripePriceId();
    if (!priceId) throw new Error("Base Stripe price is required for reconciliation");
    await reconcileFoundingBilling(stripe,org,ids,priceId);
  }

  const { error: finishError } = await db.rpc("finish_founding_grant",{p_org:orgId});
  if (finishError) throw new Error(finishError.message);
  return { slot, status:"founding" };
}

/** Run before opening beta: old anonymous checkout links cannot identify an org. */
export async function closeLegacyCheckouts() {
  const program = await requireProgramEnvironment();
  const secret = stripeSecret();
  if (!secret) return 0; // No configured Stripe, hence no locally created sessions.
  if (!secret.includes(program.environment === "production" ? "_live_" : "_test_")) throw new Error("Stripe key environment mismatch");
  const stripe=stripeClient(); const price=stripePriceId();
  if(!price) throw new Error("Base price missing");
  let closed=0;
  for await(const session of stripe.checkout.sessions.list({status:"open",limit:100})) {
    if(session.mode!=="subscription" || session.client_reference_id || session.metadata?.org_id) continue;
    const lines=await stripe.checkout.sessions.listLineItems(session.id,{limit:100});
    if(lines.data.some(line=>line.price?.id===price)) {await stripe.checkout.sessions.expire(session.id);closed++;}
  }
  return closed;
}

/** Reconcile before awarding, preserving optional products and failing closed. */
export async function reconcileFoundingBilling(stripe: Stripe, org: OrgRow, ids: Set<string>, priceId: string) {
    const subscriptions = new Set<string>();
    if (org.stripe_subscription_id) subscriptions.add(org.stripe_subscription_id);
    // Include legacy customer sessions that predate our checkout registry.
    if (org.stripe_customer_id) {
      for await (const session of stripe.checkout.sessions.list({ customer: org.stripe_customer_id, limit:100 })) {
        if (session.mode === "subscription") ids.add(session.id);
      }
      for await (const sub of stripe.subscriptions.list({ customer:org.stripe_customer_id,status:"all",limit:100 })) {
        if (sub.items.data.some(item => item.price.id === priceId)) subscriptions.add(sub.id);
      }
    }
    for (const id of ids) {
      let session = await stripe.checkout.sessions.retrieve(id);
      const lines = await stripe.checkout.sessions.listLineItems(id,{limit:100});
      if (!lines.data.some(line=>line.price?.id === priceId)) continue;
      if (session.status === "open") {
        try { session = await stripe.checkout.sessions.expire(id); }
        catch { session = await stripe.checkout.sessions.retrieve(id); if (session.status === "open") throw new Error("Checkout still open; retry grant"); }
      }
      const sub = typeof session.subscription === "string" ? session.subscription : session.subscription?.id;
      if (sub) subscriptions.add(sub);
    }
    for (const id of subscriptions) {
      const sub = await stripe.subscriptions.retrieve(id);
      if (sub.schedule && sub.status !== "canceled") throw new Error("Resolve the subscription schedule before granting Founding status");
      const base = sub.items.data.filter(item => item.price.id === priceId);
      if (!base.length || sub.status === "canceled") continue;
      // Preserve optional add-ons; only remove the base entitlement's item.
      if (base.length === sub.items.data.length) {
        await stripe.subscriptions.cancel(id,{invoice_now:false,prorate:false});
      } else {
        await stripe.subscriptions.update(id,{items:base.map(item=>({id:item.id,deleted:true})),proration_behavior:"none"}, {idempotencyKey:`founding-base-${org.id}-${id}`});
      }
    }
    // Outstanding invoices must be explicitly settled or voided before we promise
    // free forever. Never silently erase a debt or an optional add-on invoice.
    if (org.stripe_customer_id) {
      for (const status of ["open","draft"] as const) {
        for await (const invoice of stripe.invoices.list({customer:org.stripe_customer_id,status,limit:100})) {
          for await (const line of stripe.invoices.listLineItems(invoice.id,{limit:100})) {
            if (line.pricing?.price_details?.price === priceId) throw new Error(`Resolve base-plan invoice ${invoice.id} in Stripe, then retry this grant`);
          }
        }
      }
    }

}
