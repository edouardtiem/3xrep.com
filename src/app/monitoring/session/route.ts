import { NextResponse } from "next/server";
import { createMonitoringSession, MONITORING_COOKIE, monitoringConfigured, SESSION_SECONDS, validMonitoringPassword } from "@/lib/monitoring-auth";
import { clientIp, rateLimit } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";
export async function POST(req: Request) {
  // Next's development proxy uses its bind address in req.url. The browser's
  // same-origin form submission carries the public Host header instead.
  const requestUrl = new URL(req.url);
  const publicHost = req.headers.get("host") ?? requestUrl.host;
  const origin = new URL(requestUrl.protocol + "//" + publicHost).origin;
  if (req.headers.get("origin") !== origin) return new Response("Forbidden", { status: 403 });
  const redirect = (error?: string) => {
    const response = NextResponse.redirect(new URL(error ? "/monitoring?error=" + error : "/monitoring", origin), 303);
    response.headers.set("Cache-Control", "private, no-store");
    return response;
  };
  if (Number(req.headers.get("content-length") ?? 0) > 4096) return new Response("Request too large", { status: 413 });
  const form = await req.formData().catch(() => null);
  if (!form) return redirect("invalid");
  const cookieOptions = { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict" as const, path: "/monitoring" };
  if (form.get("action") === "logout") {
    const response = redirect();
    response.cookies.set(MONITORING_COOKIE, "", { ...cookieOptions, maxAge: 0 });
    return response;
  }
  if (!monitoringConfigured()) return redirect("unavailable");
  if (!rateLimit("monitoring-login:" + clientIp(req), 5, 15 * 60_000)) return redirect("limited");
  const input = form.get("password");
  if (typeof input !== "string" || !validMonitoringPassword(input)) return redirect("invalid");
  const response = redirect();
  response.cookies.set(MONITORING_COOKIE, createMonitoringSession(), { ...cookieOptions, maxAge: SESSION_SECONDS });
  return response;
}
