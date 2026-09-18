import type Stripe from "stripe";
import { orgById, setOrgStatus, type OrgRow } from "@/lib/orgs";
import { stripePriceId } from "@/lib/stripe-env";
import { admin } from "@/lib/supabase-admin";
import type { OrgStatus } from "@/lib/trial";

export function subscriptionAccessStatus(status: string): OrgStatus {
  if (status === "active") return "active";
  if (status === "trialing") return "trial";
  if (status === "canceled") return "canceled";
  return "lapsed";
}
/** Read current Stripe state: delayed/repeated webhooks must not restore stale access. */
export async function syncBaseSubscription(stripe: Stripe, org: OrgRow, subscriptionId: string) {
  const current=await orgById(org.id);
  if(!current) throw new Error("Workspace unavailable during billing reconciliation");
  org=current;
  // A delayed event for a replaced base subscription cannot cancel its replacement.
  if(org.stripe_subscription_id && org.stripe_subscription_id !== subscriptionId) return;
  const sub=await stripe.subscriptions.retrieve(subscriptionId);
  const base=sub.items.data.filter(item=>item.price.id===stripePriceId());
  if(!base.length) {
    if(org.stripe_subscription_id === subscriptionId && org.founding_state !== "founding" && !org.comped) await setOrgStatus(org.id,"lapsed");
    return; // Unrelated optional add-ons never determine base access.
  }
  if(org.founding_state === "founding" || org.founding_state === "pending" || org.comped) {
    if(sub.status !== "canceled") {
      if(base.length === sub.items.data.length) await stripe.subscriptions.cancel(sub.id,{invoice_now:false,prorate:false});
      else await stripe.subscriptions.update(sub.id,{items:base.map(item=>({id:item.id,deleted:true})),proration_behavior:"none"},{idempotencyKey:`founding-base-${org.id}-${sub.id}`});
      const db=admin();
      if(!db) throw new Error("Billing audit unavailable");
      const {error}=await db.from("founding_audit").insert({org_id:org.id,action:"unexpected_base_subscription",note:`Removed base item from ${sub.id}. Review associated invoices for any payment requiring reconciliation.`});
      if(error) throw error;
    }
    return;
  }
  await setOrgStatus(org.id,subscriptionAccessStatus(sub.status),{stripe_subscription_id:sub.id});
}
