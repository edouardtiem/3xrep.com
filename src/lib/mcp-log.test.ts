import assert from "node:assert/strict";
import { afterEach, test } from "node:test";
import {
  MAX_JSON_BYTES,
  capJson,
  clientOf,
  evidenceKind,
  gesteOf,
  logCall,
  orgIdOf,
  supabaseEnv,
  withMcpLog,
} from "./mcp-log";

const KEYS = [
  "SUPABASE_URL",
  "SUPABASE_SERVICE_ROLE_KEY",
  "NEXT_PUBLIC_SUPABASE_URL",
  "SUPABASE_SECRET_KEY",
] as const;
const saved = Object.fromEntries(KEYS.map((k) => [k, process.env[k]]));

afterEach(() => {
  for (const k of KEYS) {
    if (saved[k] === undefined) delete process.env[k];
    else process.env[k] = saved[k];
  }
});

test("capJson laisse passer un payload petit", () => {
  const v = { q: "MEDDIC" };
  assert.equal(capJson(v), v);
});

test("capJson tronque au-delà de 200 ko", () => {
  const v = { blob: "x".repeat(MAX_JSON_BYTES + 10) };
  assert.deepEqual(capJson(v), { truncated: true, bytes: JSON.stringify(v).length });
});

test("evidenceKind lit evidence ou deals[0]", () => {
  assert.equal(evidenceKind({ evidence: "transcript" }), "transcript");
  assert.equal(evidenceKind({ deals: [{ evidence: "notes" }] }), "notes");
  assert.equal(evidenceKind({ q: "MEDDIC" }), null);
});

test("gesteOf / orgIdOf / clientOf", () => {
  assert.equal(gesteOf({ geste: "pipe-review" }), "pipe-review");
  assert.equal(orgIdOf("dev"), null);
  assert.equal(orgIdOf("2c1a0b3e-4d5f-6789-abcd-ef0123456789"), "2c1a0b3e-4d5f-6789-abcd-ef0123456789");
  const req = new Request("https://3xrep.com/api/mcp", {
    headers: { "user-agent": "Cursor/1.0" },
  });
  assert.equal(clientOf(req), "Cursor/1.0");
});

test("logCall no-op sans Supabase — pas un throw", async () => {
  for (const k of KEYS) delete process.env[k];
  await logCall({
    tool: "audit_deal",
    ok: true,
    input: {},
    output: {},
    durationMs: 1,
  });
});

test("withMcpLog rend le JSON du tool, même sans Supabase", async () => {
  for (const k of KEYS) delete process.env[k];
  const fn = withMcpLog("methode_lookup", async ({ q }: { q: string }) => ({
    content: [{ type: "text" as const, text: JSON.stringify({ q }) }],
  }));
  const out = await fn({ q: "MEDDIC" });
  assert.deepEqual(out, { content: [{ type: "text", text: '{"q":"MEDDIC"}' }] });
});

test("supabaseEnv lit les noms dashboard si les noms docs sont vides", () => {
  for (const k of KEYS) delete process.env[k];
  assert.equal(supabaseEnv(), null);
  process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.supabase.co";
  process.env.SUPABASE_SECRET_KEY = "sb_secret_test";
  assert.deepEqual(supabaseEnv(), {
    url: "https://example.supabase.co",
    key: "sb_secret_test",
  });
  process.env.SUPABASE_URL = "https://docs-name.supabase.co";
  process.env.SUPABASE_SERVICE_ROLE_KEY = "service-role";
  assert.deepEqual(supabaseEnv(), {
    url: "https://docs-name.supabase.co",
    key: "service-role",
  });
});

test("withMcpLog attend l'écriture avant de rendre", async () => {
  for (const k of KEYS) delete process.env[k];
  process.env.SUPABASE_URL = "https://example.supabase.co";
  process.env.SUPABASE_SERVICE_ROLE_KEY = "service-role";

  let insertDone = false;
  const orig = globalThis.fetch;
  globalThis.fetch = async (input, init) => {
    const url = String(
      typeof input === "string" ? input : input instanceof URL ? input.href : input.url,
    );
    const method = init?.method ?? (input instanceof Request ? input.method : "GET");
    if (url.includes("/rest/v1/mcp_calls") && method === "POST") {
      await new Promise((r) => setTimeout(r, 40));
      insertDone = true;
      return new Response(JSON.stringify([{ id: "1" }]), {
        status: 201,
        headers: { "content-type": "application/json" },
      });
    }
    return new Response(JSON.stringify([]), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  };

  try {
    const fn = withMcpLog("methode_lookup", async ({ q }: { q: string }) => ({
      content: [{ type: "text" as const, text: JSON.stringify({ q }) }],
    }));
    await fn({ q: "MEDDIC" });
    assert.equal(insertDone, true);
  } finally {
    globalThis.fetch = orig;
  }
});
