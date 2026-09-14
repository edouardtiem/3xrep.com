import { attachStripe, issueKey, orgById } from "@/lib/orgs";
import { applyQueuedCredits } from "@/lib/referrals";
import { stripeClient, stripeSecret } from "@/lib/stripe-env";
import { statusAfterCheckout } from "@/lib/trial";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Si le webhook n’a pas encore tourné : vérifie la session Stripe et pose l’org. */
export async function ensureOrgFromCheckout(sessionId: string): Promise<void> {
  if (!stripeSecret()) return;
  const stripe = stripeClient();
  const session = await stripe.checkout.sessions.retrieve(sessionId);
  if (session.mode !== "subscription") return;
  if (session.status !== "complete") return;
  const customer = typeof session.customer === "string" ? session.customer : session.customer?.id ?? null;
  const orgId = session.metadata?.org_id || session.client_reference_id;
  if (orgId && UUID_RE.test(orgId)) {
    const org = await orgById(orgId);
    if (!org) return;
    const sub =
      typeof session.subscription === "string" ? session.subscription : session.subscription?.id ?? null;
    await attachStripe({
      orgId,
      stripeCustomerId: customer,
      stripeSessionId: session.id,
      stripeSubscriptionId: sub,
      status: statusAfterCheckout(org, session.payment_status === "paid"),
    });
    await applyQueuedCredits(orgId);
    return;
  }
  if (session.payment_status !== "paid") return;
  await issueKey({
    stripeCustomerId: customer,
    stripeSessionId: session.id,
    email: session.customer_email ?? session.customer_details?.email ?? null,
  });
}
