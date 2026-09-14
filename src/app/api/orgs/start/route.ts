import { startTrialOrg } from "@/lib/orgs";

export const dynamic = "force-dynamic";

function html(status: number, title: string, body: string) {
  return new Response(
    `<!doctype html><meta charset="utf-8"><title>${title}</title><p>${body}</p><p><a href="/start">Retour</a></p>`,
    { status, headers: { "content-type": "text/html; charset=utf-8" } },
  );
}

export async function POST(req: Request) {
  const form = await req.formData();
  const email = String(form.get("email") ?? "").trim();
  const ref = String(form.get("ref") ?? "").trim() || null;
  if (!email || !email.includes("@")) {
    return html(400, "Start", "Work email required.");
  }
  try {
    const out = await startTrialOrg({ email, ref });
    if ("exists" in out) {
      return html(
        409,
        "Start",
        "This email already started. The key was shown once. Add a card from the first verdict, or pay from /install.",
      );
    }
    return Response.redirect(new URL(`/start?t=${encodeURIComponent(out.startToken)}`, req.url), 303);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("orgs/start", message);
    if (/SUPABASE|Could not find the/.test(message) || message.includes("column") || message.includes("schema")) {
      return html(
        503,
        "Start",
        `Essai non configuré. Appliquer la migration item 6 sur le projet 3xrep. Détail : <code>${message}</code>.`,
      );
    }
    if (message.includes("SUPABASE")) {
      return html(
        503,
        "Start",
        `Essai non configuré. Secrets manquants : <code>SUPABASE_URL</code>, <code>SUPABASE_SERVICE_ROLE_KEY</code>.`,
      );
    }
    return html(502, "Start", message);
  }
}
