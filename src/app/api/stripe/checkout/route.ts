import { checkoutSessionParams } from "@/lib/stripe-checkout-session";
import { missingCheckoutSecrets, stripeClient } from "@/lib/stripe-env";

export const dynamic = "force-dynamic";

function html(status: number, title: string, body: string) {
  return new Response(
    `<!doctype html><meta charset="utf-8"><title>${title}</title><p>${body}</p><p><a href="/install">Retour — brancher puis payer</a></p>`,
    { status, headers: { "content-type": "text/html; charset=utf-8" } },
  );
}

export async function POST(req: Request) {
  const missing = missingCheckoutSecrets();
  if (missing.length) {
    return html(
      503,
      "Stripe",
      `Checkout $129 non configuré. Secrets manquants : <code>${missing.join("</code>, <code>")}</code>. Les poser sur Vercel (Production) — noms exacts dans <code>docs/checkout.md</code> du git. Pas un faux vert.`,
    );
  }

  try {
    const stripe = stripeClient();
    const session = await stripe.checkout.sessions.create(checkoutSessionParams(req));
    if (!session.url) {
      return html(502, "Stripe", "Checkout sans URL — la session Stripe n’a pas renvoyé de lien.");
    }
    return Response.redirect(session.url, 303);
  } catch (err) {
    const message = err instanceof Error ? err.message : "erreur Stripe";
    return html(
      502,
      "Stripe",
      `Secrets présents, Stripe a refusé la session : ${message}. Vérifier <code>STRIPE_PRICE_ID</code> (abo $129 / mois / USD) et le compte Stripe 3xrep — pas un 503 « non configuré ».`,
    );
  }
}

export { POST as GET };
