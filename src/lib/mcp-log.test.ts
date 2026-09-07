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
} from "./mcp-log";

const KEYS = ["SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY"] as const;
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
  delete process.env.SUPABASE_URL;
  delete process.env.SUPABASE_SERVICE_ROLE_KEY;
  await logCall({
    tool: "audit_deal",
    ok: true,
    input: {},
    output: {},
    durationMs: 1,
  });
});

test("withMcpLog rend le JSON du tool, même sans Supabase", async () => {
  delete process.env.SUPABASE_URL;
  delete process.env.SUPABASE_SERVICE_ROLE_KEY;
  const { withMcpLog } = await import("./mcp-log");
  const fn = withMcpLog("methode_lookup", async ({ q }: { q: string }) => ({
    content: [{ type: "text" as const, text: JSON.stringify({ q }) }],
  }));
  const out = await fn({ q: "MEDDIC" });
  assert.deepEqual(out, { content: [{ type: "text", text: '{"q":"MEDDIC"}' }] });
});
