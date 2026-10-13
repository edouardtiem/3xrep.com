import assert from "node:assert/strict";
import { test } from "node:test";
import { createMonitoringSession, MONITORING_COOKIE, SESSION_SECONDS, validMonitoringPassword, validMonitoringSession } from "./monitoring-auth";
import { isPrivateSurface } from "./private-surface";
import { loadMonitoring } from "./monitoring";
import { POST } from "../app/monitoring/session/route";
import { proxy } from "../proxy";
import { NextRequest } from "next/server";

const code = "local-test-code-never-used-in-production";
test("monitoring sessions expire, reject tampering and become invalid after code rotation", () => {
  const saved = process.env.MONITORING_PASSWORD;
  try {
    delete process.env.MONITORING_PASSWORD;
    assert.equal(validMonitoringPassword(code), false);
    assert.equal(validMonitoringSession("anything"), false);
    process.env.MONITORING_PASSWORD = "short";
    assert.throws(() => createMonitoringSession());
    process.env.MONITORING_PASSWORD = code;
    assert.equal(validMonitoringPassword(code), true);
    assert.equal(validMonitoringPassword("wrong"), false);
    const now = 1_800_000_000_000;
    const token = createMonitoringSession(now);
    assert.equal(token.includes(code), false);
    assert.equal(validMonitoringSession(token, now + 1000), true);
    assert.equal(validMonitoringSession(token, now + SESSION_SECONDS * 1000), false);
    assert.equal(validMonitoringSession(token + "x", now), false);
    assert.equal(validMonitoringSession("broken", now), false);
    process.env.MONITORING_PASSWORD = "a-different-local-test-code-for-rotation";
    assert.equal(validMonitoringSession(token, now), false);
  } finally { if (saved === undefined) delete process.env.MONITORING_PASSWORD; else process.env.MONITORING_PASSWORD = saved; }
});
test("private monitoring login rejects cross-origin requests, sets an HttpOnly cookie and can log out", async () => {
  const saved = process.env.MONITORING_PASSWORD;
  process.env.MONITORING_PASSWORD = code;
  const request = (origin: string | null, fields: Record<string, string>) => new Request("https://monitoring.3xrep.com/monitoring/session", { method: "POST", headers: { ...(origin ? { origin } : {}), "x-real-ip": "monitoring-auth-test" }, body: new URLSearchParams(fields) });
  try {
    assert.equal((await POST(request("https://elsewhere.example", { password: code }))).status, 403);
    assert.equal((await POST(request(null, { password: code }))).status, 403);
    const bad = await POST(request("https://monitoring.3xrep.com", { password: "wrong" }));
    assert.match(bad.headers.get("location")!, /error=invalid/);
    assert.equal(bad.headers.get("set-cookie"), null);
    const good = await POST(request("https://monitoring.3xrep.com", { password: code }));
    assert.equal(good.status, 303);
    const cookie = good.headers.get("set-cookie")!;
    assert.match(cookie, /HttpOnly/i); assert.match(cookie, /SameSite=strict/i); assert.match(cookie, /Path=\/monitoring/i);
    assert.equal(cookie.includes(code), false);
    assert.equal(validMonitoringSession(decodeURIComponent(cookie.split(";")[0].slice(MONITORING_COOKIE.length + 1))), true);
    const logout = await POST(request("https://monitoring.3xrep.com", { action: "logout" }));
    assert.match(logout.headers.get("set-cookie")!, /Max-Age=0/i);
    for (let i = 0; i < 3; i++) await POST(request("https://monitoring.3xrep.com", { password: "wrong" }));
    const limited = await POST(request("https://monitoring.3xrep.com", { password: code }));
    assert.match(limited.headers.get("location")!, /error=limited/);
  } finally { if (saved === undefined) delete process.env.MONITORING_PASSWORD; else process.env.MONITORING_PASSWORD = saved; }
});
test("monitoring analytics exclusion covers path and host; private responses cannot be cached or indexed", () => {
  assert.equal(isPrivateSurface("/monitoring", "www.3xrep.com"), true);
  assert.equal(isPrivateSurface("/monitoring/session", "localhost"), true);
  assert.equal(isPrivateSurface("/", "monitoring.3xrep.com"), true);
  assert.equal(isPrivateSurface("/", "www.3xrep.com"), false);
  assert.equal(isPrivateSurface("/monitoring-guide", "www.3xrep.com"), false);
  const home = proxy(new NextRequest("https://monitoring.3xrep.com/"));
  assert.match(home.headers.get("location")!, /\/monitoring$/);
  const proxiedHome = proxy(new NextRequest("http://localhost:4181/", { headers: { host: "monitoring.3xrep.com" } }));
  assert.equal(proxiedHome.headers.get("location"), "http://monitoring.3xrep.com/monitoring");
  const privatePage = proxy(new NextRequest("https://monitoring.3xrep.com/monitoring"));
  assert.match(privatePage.headers.get("cache-control")!, /no-store/);
  assert.match(privatePage.headers.get("x-robots-tag")!, /noindex/);
  assert.match(privatePage.headers.get("content-security-policy")!, /connect-src 'self'/);
  assert.equal(proxy(new NextRequest("https://monitoring.3xrep.com/api/mcp")).status, 404);
  assert.equal(proxy(new NextRequest("https://www.3xrep.com/api/mcp")).headers.get("x-middleware-next"), "1");
});
test("monitoring reads aggregate counts independently from the limited list and never requests keys or call contents", async () => {
  const saved = { fetch: globalThis.fetch, url: process.env.SUPABASE_URL, key: process.env.SUPABASE_SERVICE_ROLE_KEY };
  process.env.SUPABASE_URL = "https://monitoring-test.invalid";
  process.env.SUPABASE_SERVICE_ROLE_KEY = "test-only";
  const requests: URL[] = [];
  let omitCounts = false;
  globalThis.fetch = async (input, options) => {
    const url = new URL(input instanceof Request ? input.url : String(input));
    requests.push(url);
    const select = url.searchParams.get("select")!;
    assert.doesNotMatch(select, /key|input|output,/);
    if (options?.method === "HEAD") {
      assert.equal(url.searchParams.get("is_internal"), "eq.false");
      const count = url.searchParams.has("last_active_at") ? 3 : url.searchParams.has("first_value_at") ? 9 : url.searchParams.has("connector_used_at") ? 12 : 135;
      return new Response(null, { status: 200, headers: omitCounts ? {} : { "content-range": "*/" + count } });
    }
    if (url.pathname.endsWith("mcp_calls")) return Response.json([]);
    assert.equal(url.searchParams.get("limit"), "100");
    return Response.json([{ id: "test", email: "synthetic@example.com", outputs: 0, sessions: 0 }]);
  };
  try {
    const data = await loadMonitoring();
    assert.equal(data.signups, 135); assert.equal(data.connectorUsed, 12); assert.equal(data.firstValue, 9); assert.equal(data.activeSevenDays, 3);
    assert.equal(data.workspaces.length, 1); assert.equal(data.lastCall, null);
    assert.equal(requests.length, 6);
    omitCounts = true;
    await assert.rejects(loadMonitoring(), /counts unavailable/);
    globalThis.fetch = async () => new Response(JSON.stringify({ message: "offline" }), { status: 503 });
    await assert.rejects(loadMonitoring(), /read failed/);
  } finally {
    globalThis.fetch = saved.fetch;
    if (saved.url === undefined) delete process.env.SUPABASE_URL; else process.env.SUPABASE_URL = saved.url;
    if (saved.key === undefined) delete process.env.SUPABASE_SERVICE_ROLE_KEY; else process.env.SUPABASE_SERVICE_ROLE_KEY = saved.key;
  }
});
