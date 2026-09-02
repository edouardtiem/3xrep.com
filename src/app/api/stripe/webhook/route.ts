import Stripe from "stripe";
import { issueKey, revokeByCustomer } from "@/lib/orgs";

export async function POST(req: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const key = process.env.STRIPE_SECRET_KEY;
  if (!secret || !key) {
    return Response.json({ error: "webhook non configuré" }, { status: 503 });
  }
  const stripe = new Stripe(key);
  const sig = req.headers.get("stripe-signature");
  if (!sig) return Response.json({ error: "signature manquante" }, { status: 400 });
  const raw = await req.text();
  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(raw, sig, secret);
  } catch {
    return Response.json({ error: "signature invalide" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const customer = typeof session.customer === "string" ? session.customer : session.customer?.id ?? null;
    await issueKey({ stripeCustomerId: customer, stripeSessionId: session.id });
  }

  if (event.type === "customer.subscription.deleted") {
    const sub = event.data.object;
    const customerId = typeof sub.customer === "string" ? sub.customer : sub.customer.id;
    await revokeByCustomer(customerId);
  }

  return Response.json({ received: true });
}
