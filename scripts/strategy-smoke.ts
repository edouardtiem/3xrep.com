/** Local HTTP checks. Uses an explicitly configured dev organization, never a customer key. */
import assert from "node:assert/strict";
import { strategyDeal } from "../src/lib/brain/fixtures/strategy-deals";

async function main() {
  const base = process.env.MCP_URL ?? "http://127.0.0.1:3004";
  assert.ok(["127.0.0.1", "localhost"].includes(new URL(base).hostname), "Local server only");
  const key = process.env.DEV_ORG_KEY;
  assert.ok(key, "Set the local server DEV_ORG_KEY and the same key for this check");
  let id = 0;
  async function rpc(method: string, params: unknown, auth = true) {
    const response = await fetch(`${base}/api/mcp`, { method: "POST", headers: { "content-type": "application/json", accept: "application/json, text/event-stream", ...(auth ? { authorization: `Bearer ${key}` } : {}) }, body: JSON.stringify({ jsonrpc: "2.0", id: ++id, method, params }) });
    assert.equal(response.status, 200);
    const text = await response.text();
    const event = text.split("\n").find(l => l.startsWith("data:"));
    const data = JSON.parse(event ? event.slice(5) : text);
    assert.equal(data.error, undefined, JSON.stringify(data.error));
    return data.result;
  }
  const init = await rpc("initialize", { protocolVersion: "2025-03-26", capabilities: {}, clientInfo: { name: "strategy-local-check", version: "1" } });
  assert.match(init.instructions, /Strategy is the primary/);
  const listed = await rpc("tools/list", {});
  assert.ok(listed.tools.some((t: {name: string}) => t.name === "plan_horizon"));
  const call = async (name: string, args: unknown, auth = true) => {
    const result = await rpc("tools/call", { name, arguments: args }, auth);
    assert.ok(!result.isError, JSON.stringify(result));
    return JSON.parse(result.content[0].text);
  };
  const deal = strategyDeal(["besoin"]);
  const cutoff = await call("audit_deal", deal, false);
  assert.match(cutoff.refus, /no key/);
  for (const name of ["audit_deal", "next_question"]) {
    const out = await call(name, deal);
    assert.equal(out.strategy.primitive, "pain-to-access");
    assert.equal(out.strategy.leverage[0].quote, deal.exhibits![0].citation);
    assert.equal(out.strategy.branches.length, 4);
  }
  const objection = await call("objection_map", { ...strategyDeal(["enjeu-chiffre"]), objection: "No budget" });
  assert.equal(objection.strategy.primitive, "impact-to-budget");
  const pipe = await call("pipe_review", { deals: [deal] });
  assert.equal(pipe.deals[0].strategy.primitive, "pain-to-access");
  assert.equal(pipe.coaching.length, 1);
  for (const fenetre of [1, 7, 30]) {
    const horizon = await call("plan_horizon", { fenetre, maintenant: "2026-09-22T08:00:00+02:00", items: [{ kind: "affaire", deal }] });
    assert.equal(horizon.brief.priorities[0].strategy.primitive, "pain-to-access");
  }
  for (const path of ["/", "/start", "/install", "/docs"]) {
    const response = await fetch(`${base}${path}`);
    assert.equal(response.status, 200, path);
  }
  console.log("PASS: MCP initialization, catalog, access denial, five strategy tools, 1/7/30 horizons, four public pages.");
}
main().catch(error => { console.error(error); process.exitCode = 1; });
