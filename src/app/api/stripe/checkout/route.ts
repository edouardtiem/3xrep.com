import { randomBytes } from "node:crypto";
import Stripe from "stripe";
import { siteUrl } from "@/lib/site";

function client(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY manquant");
  return new Stripe(key);
}

export async function POST() {
  const price = process.env.STRIPE_PRICE_ID;
  if (!process.env.STRIPE_SECRET_KEY || !price) {
    return new Response(
      `<!doctype html><meta charset="utf-8"><title>Stripe</title><p>Stripe n’est pas configuré. Les tools MCP n’exigent pas de paiement.</p><p><a href="/">Retour</a></p>`,
      { status: 503, headers: { "content-type": "text/html; charset=utf-8" } },
    );
  }
  const stripe = client();
  const origin = siteUrl();
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [{ price, quantity: 1 }],
    success_url: `${origin}/merci?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/`,
    integration_identifier: `3xrep-org-${randomBytes(4).toString("hex")}`,
  });
  if (!session.url) {
    return Response.json({ error: "Checkout sans URL" }, { status: 500 });
  }
  return Response.redirect(session.url, 303);
}

export { POST as GET };
