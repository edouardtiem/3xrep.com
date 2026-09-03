import { issueKey, revokeByCustomer } from "@/lib/orgs";
import { missingWebhookSecrets, stripeClient, stripeWebhookSecret } from "@/lib/stripe-env";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const missing = missingWebhookSecrets();
  if (missing.length) {
    return Response.json({ error: "webhook non configuré", missing }, { status: 503 });
  }

  const stripe = stripeClient();
  const sig = req.headers.get("stripe-signature");
  if (!sig) return Response.json({ error: "signature manquante" }, { status: 400 });
  const raw = await req.text();
  let event;
  try {
    event = await stripe.webhooks.constructEventAsync(raw, sig, stripeWebhookSecret()!);
  } catch {
    return Response.json({ error: "signature invalide" }, { status: 400 });
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      if (session.mode === "subscription") {
        const customer = typeof session.customer === "string" ? session.customer : session.customer?.id ?? null;
        await issueKey({ stripeCustomerId: customer, stripeSessionId: session.id });
      }
    }

    if (event.type === "customer.subscription.deleted") {
      const sub = event.data.object;
      const customerId = typeof sub.customer === "string" ? sub.customer : sub.customer.id;
      await revokeByCustomer(customerId);
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "orgs";
    return Response.json({ error: message }, { status: 500 });
  }

  return Response.json({ received: true });
}
