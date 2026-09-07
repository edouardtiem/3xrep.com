import assert from "node:assert/strict";
import { test } from "node:test";
import { stripeCheckoutLocale } from "./stripe-checkout-session";

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
