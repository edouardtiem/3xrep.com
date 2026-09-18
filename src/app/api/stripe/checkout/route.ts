import { admin } from "@/lib/supabase-admin";
import { getBetaProgram, includedBasePlan } from "@/lib/founding";
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
    const mode: "pay" | "card" = url.searchParams.get("mode") === "card" ? "card" : "pay";
    const orgId = url.searchParams.get("org");
    const sig = url.searchParams.get("sig");

    // Anonymous checkout cannot protect an existing Founding workspace. Require
    // the signed organization link already returned by the connector.
    if (!orgId || !verifyOrgSig(orgId, sig)) return Response.redirect(new URL("/start",req.url),303);
    const org = await orgById(orgId);
    if (!org) return html(404,"Stripe","Workspace not found.");
    if (includedBasePlan(org) || org.base_billing_blocked) return html(409,"Stripe","Your base plan is included. No payment is needed.");
    if (org.status === "active") return html(409,"Stripe","This workspace already pays.");
    if (mode === "card" && !org.trial_ends_at && !org.beta_enrolled_at && org.status !== "lapsed") return html(400,"Stripe","Start with your first deal review, then use the payment link in your chat.");
    const extra = { mode, orgId, email: org.email, trialEndUnix: stripeTrialEndUnix(org.trial_ends_at) };

    const stripe = stripeClient();
    const price = await stripe.prices.retrieve(stripePriceId()!);
    if (!isAnchorPrice(price)) {
      return html(
        502,
        "Stripe",
        `STRIPE_PRICE_ID n’est pas <code>$${LIST_PRICE_USD} USD / mois</code> (reçu ${price.unit_amount ?? "?"} ${price.currency}). Poser le Price 129,00 USD recurring monthly — pas 99 EUR.`,
      );
    }
    const db = admin();
    if (!db) throw new Error("Billing database unavailable");
    const params = checkoutSessionParams(req, extra);
    delete params.integration_identifier;
    if (org.stripe_customer_id) { params.customer=org.stripe_customer_id; delete params.customer_email; }
    const program = await getBetaProgram();
    if (org.beta_enrolled_at && program?.early_promotion_code) params.discounts=[{promotion_code:program.early_promotion_code}];
    const { data: operation, error: operationError } = await db.rpc("begin_base_checkout",{p_org:orgId,p_params:params});
    if (operationError) return html(409,"Stripe","Your workspace cannot open a base-plan checkout right now. Contact the person who invited you.");
    const {data: pending,error:pendingError}=await db.from("orgs").select("checkout_params").eq("id",orgId).single();
    if(pendingError || !pending?.checkout_params) throw new Error("Checkout operation unavailable");
    const session = await stripe.checkout.sessions.create(pending.checkout_params,{idempotencyKey:`base-checkout-${operation}`});
    const {error: finishError}=await db.rpc("finish_base_checkout",{p_org:orgId,p_operation:operation,p_session:session.id});
    if (finishError) throw new Error("Checkout registration failed; retry this link before granting Founding status");
    if (!session.url) {
      return html(502, "Stripe", "Checkout sans URL — la session Stripe n’a pas renvoyé de lien.");
    }
    return Response.redirect(session.url, 303);
  } catch (err) {
    const message = err instanceof Error ? err.message : "erreur Stripe";
    console.error("checkout", message);
    return html(
      502,
      "Stripe",
      "Payment could not be opened. Please retry the same link or contact the person who invited you.",
    );
  }
}

export { POST as GET };
