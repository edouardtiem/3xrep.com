import Stripe from "stripe";

export function stripeSecret(): string | undefined {
  const key = process.env.STRIPE_SECRET_KEY?.trim();
  return key || undefined;
}

export function stripePriceId(): string | undefined {
  const id = process.env.STRIPE_PRICE_ID?.trim();
  return id || undefined;
}

export function stripeWebhookSecret(): string | undefined {
  const secret = process.env.STRIPE_WEBHOOK_SECRET?.trim();
  return secret || undefined;
}

export function missingCheckoutSecrets(): string[] {
  const miss: string[] = [];
  if (!stripeSecret()) miss.push("STRIPE_SECRET_KEY");
  if (!stripePriceId()) miss.push("STRIPE_PRICE_ID");
  return miss;
}

export function missingWebhookSecrets(): string[] {
  const miss: string[] = [];
  if (!stripeSecret()) miss.push("STRIPE_SECRET_KEY");
  if (!stripeWebhookSecret()) miss.push("STRIPE_WEBHOOK_SECRET");
  return miss;
}

export function stripeClient(): Stripe {
  const key = stripeSecret();
  if (!key) throw new Error("STRIPE_SECRET_KEY manquant");
  return new Stripe(key);
}
