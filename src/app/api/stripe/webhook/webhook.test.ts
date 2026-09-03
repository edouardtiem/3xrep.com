import assert from "node:assert/strict";
import { afterEach, test } from "node:test";
import Stripe from "stripe";

const KEYS = ["STRIPE_SECRET_KEY", "STRIPE_WEBHOOK_SECRET"] as const;
const saved = Object.fromEntries(KEYS.map((k) => [k, process.env[k]]));

afterEach(() => {
  for (const k of KEYS) {
    if (saved[k] === undefined) delete process.env[k];
    else process.env[k] = saved[k];
  }
});

test("webhook sans secrets → 503 + missing, pas un 200", async () => {
  delete process.env.STRIPE_SECRET_KEY;
  delete process.env.STRIPE_WEBHOOK_SECRET;
  const { POST } = await import("./route");
  const res = await POST(new Request("http://localhost/api/stripe/webhook", { method: "POST", body: "{}" }));
  assert.equal(res.status, 503);
  const body = (await res.json()) as { missing: string[] };
  assert.ok(body.missing.includes("STRIPE_SECRET_KEY"));
  assert.ok(body.missing.includes("STRIPE_WEBHOOK_SECRET"));
});

test("webhook signature invalide → 400", async () => {
  process.env.STRIPE_SECRET_KEY = "sk_test_placeholder_not_a_real_key";
  process.env.STRIPE_WEBHOOK_SECRET = "whsec_test_secret";
  const { POST } = await import("./route");
  const res = await POST(
    new Request("http://localhost/api/stripe/webhook", {
      method: "POST",
      headers: { "stripe-signature": "t=1,v1=deadbeef" },
      body: "{}",
    }),
  );
  assert.equal(res.status, 400);
});

test("webhook signature valide checkout.session.completed sans Supabase → 500 (pas un faux vert)", async () => {
  process.env.STRIPE_SECRET_KEY = "sk_test_placeholder_not_a_real_key";
  const secret = "whsec_test_secret";
  process.env.STRIPE_WEBHOOK_SECRET = secret;
  delete process.env.SUPABASE_URL;
  delete process.env.SUPABASE_SERVICE_ROLE_KEY;

  const payload = JSON.stringify({
    id: "evt_test",
    object: "event",
    type: "checkout.session.completed",
    data: {
      object: {
        id: "cs_test_1",
        object: "checkout.session",
        mode: "subscription",
        customer: "cus_test",
      },
    },
  });
  const header = Stripe.webhooks.generateTestHeaderString({ payload, secret });
  const { POST } = await import("./route");
  const res = await POST(
    new Request("http://localhost/api/stripe/webhook", {
      method: "POST",
      headers: { "stripe-signature": header },
      body: payload,
    }),
  );
  assert.equal(res.status, 500);
  const body = (await res.json()) as { error: string };
  assert.match(body.error, /SUPABASE/);
});
