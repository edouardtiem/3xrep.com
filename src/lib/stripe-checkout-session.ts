import { randomBytes } from "node:crypto";
import type Stripe from "stripe";
import { siteUrl } from "@/lib/site";
import { stripePriceId } from "@/lib/stripe-env";

/** Anchor price (USD). Checkout may show local currency via Adaptive Pricing. */
export const LIST_PRICE_USD = 129;
export const LIST_PRICE_CENTS = LIST_PRICE_USD * 100;

/** The Price behind STRIPE_PRICE_ID must be this — never display $129 and charge 99 €. */
export function isAnchorPrice(price: {
  currency: string | null;
  unit_amount: number | null;
  recurring?: { interval: string } | null;
}): boolean {
  return (
    price.currency === "usd" &&
    price.unit_amount === LIST_PRICE_CENTS &&
    price.recurring?.interval === "month"
  );
}

const STRIPE_LOCALES = new Set<Stripe.Checkout.SessionCreateParams.Locale>([
  "auto",
  "bg",
  "cs",
  "da",
  "de",
  "el",
  "en",
  "en-GB",
  "es",
  "es-419",
  "et",
  "fi",
  "fr",
  "fr-CA",
  "hr",
  "hu",
  "id",
  "it",
  "ja",
  "ko",
  "lt",
  "lv",
  "ms",
  "mt",
  "nb",
  "nl",
  "pl",
  "pt",
  "pt-BR",
  "ro",
  "ru",
  "sk",
  "sl",
  "sv",
  "th",
  "tr",
  "vi",
  "zh",
  "zh-HK",
  "zh-TW",
]);

/** Map Accept-Language to a Stripe Checkout locale, else auto (browser). */
export function stripeCheckoutLocale(req: Request): Stripe.Checkout.SessionCreateParams.Locale {
  const header = req.headers.get("accept-language");
  if (!header) return "auto";

  for (const part of header.split(",")) {
    const tag = part.trim().split(";")[0]?.trim();
    if (!tag) continue;
    if (STRIPE_LOCALES.has(tag as Stripe.Checkout.SessionCreateParams.Locale)) {
      return tag as Stripe.Checkout.SessionCreateParams.Locale;
    }
    const base = tag.split("-")[0];
    if (STRIPE_LOCALES.has(base as Stripe.Checkout.SessionCreateParams.Locale)) {
      return base as Stripe.Checkout.SessionCreateParams.Locale;
    }
  }
  return "auto";
}

export function checkoutSessionParams(req: Request): Stripe.Checkout.SessionCreateParams {
  const origin = siteUrl();
  return {
    mode: "subscription",
    line_items: [{ price: stripePriceId()!, quantity: 1 }],
    success_url: `${origin}/merci?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/install`,
    integration_identifier: `3xrep-org-${randomBytes(4).toString("hex")}`,
    locale: stripeCheckoutLocale(req),
    adaptive_pricing: { enabled: true },
  };
}
