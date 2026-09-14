import assert from "node:assert/strict";
import { test } from "node:test";
import {
  checkoutSessionParams,
  isAnchorPrice,
  LIST_PRICE_CENTS,
  LIST_PRICE_USD,
  stripeCheckoutLocale,
} from "./stripe-checkout-session";

test("stripeCheckoutLocale: fr-FR → fr", () => {
  const req = new Request("http://localhost/api/stripe/checkout", {
    headers: { "accept-language": "fr-FR,fr;q=0.9,en;q=0.8" },
  });
  assert.equal(stripeCheckoutLocale(req), "fr");
});

test("stripeCheckoutLocale: en-GB conservé", () => {
  const req = new Request("http://localhost/api/stripe/checkout", {
    headers: { "accept-language": "en-GB,en;q=0.9" },
  });
  assert.equal(stripeCheckoutLocale(req), "en-GB");
});

test("stripeCheckoutLocale: absent → auto", () => {
  const req = new Request("http://localhost/api/stripe/checkout");
  assert.equal(stripeCheckoutLocale(req), "auto");
});

test("checkoutSessionParams card mode: trial_end + always collect", () => {
  process.env.STRIPE_PRICE_ID = "price_test";
  const req = new Request("http://localhost/api/stripe/checkout");
  const params = checkoutSessionParams(req, {
    mode: "card",
    orgId: "2c1a0b3e-4d5f-6789-abcd-ef0123456789",
    email: "a@b.com",
    trialEndUnix: 1_800_000_000,
  });
  assert.equal(params.payment_method_collection, "always");
  assert.equal(params.client_reference_id, "2c1a0b3e-4d5f-6789-abcd-ef0123456789");
  assert.equal(params.customer_email, "a@b.com");
  assert.equal(params.subscription_data?.trial_end, 1_800_000_000);
});

test("isAnchorPrice: $129 USD monthly only", () => {
  assert.equal(LIST_PRICE_USD, 129);
  assert.equal(LIST_PRICE_CENTS, 12900);
  assert.equal(
    isAnchorPrice({ currency: "usd", unit_amount: 12900, recurring: { interval: "month" } }),
    true,
  );
  assert.equal(
    isAnchorPrice({ currency: "eur", unit_amount: 9900, recurring: { interval: "month" } }),
    false,
  );
  assert.equal(
    isAnchorPrice({ currency: "usd", unit_amount: 9900, recurring: { interval: "month" } }),
    false,
  );
});
