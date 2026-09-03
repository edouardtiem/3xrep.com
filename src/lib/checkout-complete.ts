import { issueKey } from "@/lib/orgs";
import { stripeClient, stripeSecret } from "@/lib/stripe-env";

/** Si le webhook n’a pas encore tourné : vérifie la session Stripe et pose l’org. */
export async function ensureOrgFromCheckout(sessionId: string): Promise<void> {
  if (!stripeSecret()) return;
  const stripe = stripeClient();
  const session = await stripe.checkout.sessions.retrieve(sessionId);
  if (session.mode !== "subscription") return;
  if (session.status !== "complete" && session.payment_status !== "paid") return;
  const customer = typeof session.customer === "string" ? session.customer : session.customer?.id ?? null;
  await issueKey({ stripeCustomerId: customer, stripeSessionId: session.id });
}
