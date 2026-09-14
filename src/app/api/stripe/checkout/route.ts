import {
  checkoutSessionParams,
  isAnchorPrice,
  LIST_PRICE_USD,
} from "@/lib/stripe-checkout-session";
import { missingCheckoutSecrets, stripeClient, stripePriceId } from "@/lib/stripe-env";
import { orgById } from "@/lib/orgs";
import { verifyOrgSig } from "@/lib/checkout-token";
import { stripeTrialEndUnix } from "@/lib/trial";

export const dynamic = "force-dynamic";

function html(status: number, title: string, body: string) {
  return new Response(
    `<!doctype html><meta charset="utf-8"><title>${title}</title><p>${body}</p><p><a href="/start">Start 14 days free</a> · <a href="/install">Install</a></p>`,
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
    const url = new URL(req.url);
    const mode = url.searchParams.get("mode") === "card" ? "card" : "pay";
    const orgId = url.searchParams.get("org");
    const sig = url.searchParams.get("sig");

    let extra: {
      mode?: "pay" | "card";
      orgId?: string;
      email?: string | null;
      trialEndUnix?: number | null;
    } = { mode };

    if (mode === "card") {
      if (!orgId || !verifyOrgSig(orgId, sig)) {
        return html(400, "Stripe", "Lien carte invalide. Repars de l’essai.");
      }
      const org = await orgById(orgId);
      if (!org) return html(404, "Stripe", "Organisation introuvable.");
      if (org.status === "active") {
        return html(400, "Stripe", "This organization already pays.");
      }
      if (!org.trial_ends_at && org.status !== "lapsed") {
        return html(
          400,
          "Stripe",
          "The trial clock starts on the first judgment. Add a card from the verdict.",
        );
      }
      extra = {
        mode: "card",
        orgId,
        email: org.email,
        trialEndUnix: stripeTrialEndUnix(org.trial_ends_at),
      };
    }

    const stripe = stripeClient();
    const price = await stripe.prices.retrieve(stripePriceId()!);
    if (!isAnchorPrice(price)) {
      return html(
        502,
        "Stripe",
        `STRIPE_PRICE_ID n’est pas <code>$${LIST_PRICE_USD} USD / mois</code> (reçu ${price.unit_amount ?? "?"} ${price.currency}). Poser le Price 129,00 USD recurring monthly — pas 99 EUR.`,
      );
    }
    const session = await stripe.checkout.sessions.create(checkoutSessionParams(req, extra));
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
