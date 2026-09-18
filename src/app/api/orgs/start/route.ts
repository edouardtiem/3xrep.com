import { clientIp, rateLimit } from "@/lib/rate-limit";
import { startTrialOrg } from "@/lib/orgs";

export const dynamic = "force-dynamic";

function html(status: number, title: string, body: string) {
  return new Response(
    `<!doctype html><meta charset="utf-8"><title>${title}</title><p>${body}</p><p><a href="/start">Retour</a></p>`,
    { status, headers: { "content-type": "text/html; charset=utf-8" } },
  );
}

export async function POST(req: Request) {
  if (!rateLimit(`signup:${clientIp(req)}`, 5, 60_000)) return html(429, "Start", "Too many attempts. Try again in a minute.");
  const form = await req.formData();
  const email = String(form.get("email") ?? "").trim();
  const ref = String(form.get("ref") ?? "").trim() || null;
  if (!email || !email.includes("@")) {
    return html(400, "Start", "Work email required.");
  }
  try {
    const out = await startTrialOrg({ email, ref, source: String(form.get("utm_source") ?? ""), campaign: String(form.get("utm_campaign") ?? ""), medium: String(form.get("utm_medium") ?? "") });
    if ("exists" in out) {
      return html(
        409,
        "Start",
        "This email already has a workspace. Use the key saved in your connector. If you lost it, contact the person who invited you. Do not pay again to recover a key.",
      );
    }
    return Response.redirect(new URL(`/start?t=${encodeURIComponent(out.startToken)}`, req.url), 303);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("orgs/start", message);
    return html(503, "Start", "We could not create your workspace. Please try again shortly.");
  }
}
