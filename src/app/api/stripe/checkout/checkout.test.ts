import assert from "node:assert/strict";
import { afterEach, test } from "node:test";

const KEYS = ["STRIPE_SECRET_KEY", "STRIPE_PRICE_ID"] as const;
const saved = Object.fromEntries(KEYS.map((k) => [k, process.env[k]]));

afterEach(() => {
  for (const k of KEYS) {
    if (saved[k] === undefined) delete process.env[k];
    else process.env[k] = saved[k];
  }
});

test("POST /api/stripe/checkout sans clés → 503 HTML qui nomme les secrets", async () => {
  delete process.env.STRIPE_SECRET_KEY;
  delete process.env.STRIPE_PRICE_ID;
  const { POST } = await import("./route");
  const res = await POST();
  assert.equal(res.status, 503);
  const body = await res.text();
  assert.match(body, /STRIPE_SECRET_KEY/);
  assert.match(body, /STRIPE_PRICE_ID/);
  assert.doesNotMatch(body, /checkout\.stripe\.com/);
});
