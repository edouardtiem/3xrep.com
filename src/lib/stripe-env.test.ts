import assert from "node:assert/strict";
import { afterEach, test } from "node:test";
import { missingCheckoutSecrets, missingWebhookSecrets } from "./stripe-env";

const KEYS = ["STRIPE_SECRET_KEY", "STRIPE_PRICE_ID", "STRIPE_WEBHOOK_SECRET"] as const;
const saved = Object.fromEntries(KEYS.map((k) => [k, process.env[k]]));

afterEach(() => {
  for (const k of KEYS) {
    if (saved[k] === undefined) delete process.env[k];
    else process.env[k] = saved[k];
  }
});

test("checkout 503 : liste les secrets manquants, pas un faux vert", () => {
  delete process.env.STRIPE_SECRET_KEY;
  delete process.env.STRIPE_PRICE_ID;
  assert.deepEqual(missingCheckoutSecrets(), ["STRIPE_SECRET_KEY", "STRIPE_PRICE_ID"]);
});

test("checkout OK seulement si les deux secrets checkout sont là", () => {
  process.env.STRIPE_SECRET_KEY = "sk_test_x";
  process.env.STRIPE_PRICE_ID = "price_x";
  assert.deepEqual(missingCheckoutSecrets(), []);
});

test("webhook 503 : STRIPE_WEBHOOK_SECRET manquant", () => {
  process.env.STRIPE_SECRET_KEY = "sk_test_x";
  delete process.env.STRIPE_WEBHOOK_SECRET;
  assert.deepEqual(missingWebhookSecrets(), ["STRIPE_WEBHOOK_SECRET"]);
});
