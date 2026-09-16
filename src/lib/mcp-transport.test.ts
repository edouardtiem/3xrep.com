import assert from "node:assert/strict";
import { test } from "node:test";
import { POST } from "../app/api/mcp/route";

// In-process HTTP boundary: no production database, paid account or connector used.
test("MCP transport: initialize, schemas, keys and real tool calls", async () => {
  const vars = ["SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY", "SUPABASE_SECRET_KEY", "DEV_ORG_KEY", "MCP_OPEN_TOOLS"];
  const saved = Object.fromEntries(vars.map(k => [k, process.env[k]]));
  for (const k of vars) delete process.env[k];
  process.env.DEV_ORG_KEY = "local-test-key";
  let id = 0;
  async function call(method: string, params: object, key?: string, bearer = false) {
    const response = await POST(new Request(`http://localhost/api/mcp${key && !bearer ? `?key=${key}` : ""}`, {
      method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json, text/event-stream", ...(bearer ? { Authorization: `Bearer ${key}` } : {}) },
      body: JSON.stringify({ jsonrpc: "2.0", id: ++id, method, params }),
    }));
    assert.equal(response.status, 200);
    const body = await response.text();
    return JSON.parse(body.startsWith("event:") ? body.split("\n").find(l => l.startsWith("data: "))!.slice(6) : body);
  }
  const output = (v: { result: { content: { text: string }[] } }) => JSON.parse(v.result.content[0].text);
  try {
    const init = await call("initialize", { protocolVersion: "2025-03-26", capabilities: {}, clientInfo: { name: "local-test", version: "1" } });
    assert.equal(init.result.serverInfo.name, "3xrep");
    const list = await call("tools/list", {});
    assert.ok(list.result.tools.some((t: { name: string }) => t.name === "plan_horizon"));
    const args = { name: "audit_deal", arguments: { notes: "Premier échange." } };
    assert.match(output(await call("tools/call", args)).refus, /3xrep is not answering/);
    assert.match(output(await call("tools/call", args, "wrong-key")).refus, /3xrep is not answering/);
    for (const bearer of [false, true]) {
      const judged = output(await call("tools/call", args, "local-test-key", bearer));
      assert.equal(judged.refus, null);
      assert.equal(judged.methode.grille, "BANT");
      assert.ok(judged.pieces.length);
    }
    const plan = output(await call("tools/call", { name: "plan_horizon", arguments: { fenetre: 1, maintenant: "2026-09-16T08:00:00+02:00", sources_lues: { crm: "disponible", gmail: "disponible", calendar: "disponible" }, items: [] } }, "local-test-key"));
    assert.equal(plan.demande, null);
    const bad = await call("tools/call", { name: "plan_horizon", arguments: { fenetre: 1, maintenant: "tomorrow", items: [] } }, "local-test-key");
    assert.ok(bad.error || bad.result?.isError);
  } finally {
    for (const k of vars) if (saved[k] === undefined) delete process.env[k]; else process.env[k] = saved[k];
  }
});
