import { z } from "zod";
import { admin } from "@/lib/supabase-admin";
import { isFoundingAdmin } from "@/lib/founding-admin";

export const dynamic = "force-dynamic";
const headers = { "Cache-Control": "no-store" };
const updateSchema = z.object({
  id: z.uuid(),
  status: z.enum(["new", "reviewing", "fixed", "needs_details"]),
  note: z.string().max(1000).optional(),
});

export async function GET(req: Request) {
  if (!isFoundingAdmin(req)) return Response.json({ error: "Unauthorized" }, { status: 401, headers });
  const db = admin();
  if (!db) return Response.json({ error: "Unavailable" }, { status: 503, headers });
  const { data, error } = await db.from("user_feedback")
    .select("*,feedback_outputs(tool,engine_version,created_at)")
    .gt("expires_at", new Date().toISOString()).order("created_at", { ascending: false }).limit(200);
  if (error) return Response.json({ error: "Feedback unavailable" }, { status: 503, headers });
  return Response.json({ feedback: data, activeUsers: null, retentionDays: 180 }, { headers });
}

export async function PATCH(req: Request) {
  if (!isFoundingAdmin(req)) return Response.json({ error: "Unauthorized" }, { status: 401, headers });
  const parsed = updateSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: "Invalid update" }, { status: 400, headers });
  const db = admin();
  if (!db) return Response.json({ error: "Unavailable" }, { status: 503, headers });
  const { data, error } = await db.from("user_feedback").update({
    status: parsed.data.status, admin_note: parsed.data.note ?? null,
  }).eq("id", parsed.data.id).gt("expires_at", new Date().toISOString()).select("id,status").maybeSingle();
  if (error) return Response.json({ error: "Update failed" }, { status: 503, headers });
  if (!data) return Response.json({ error: "Feedback not found" }, { status: 404, headers });
  return Response.json({ ok: true, ...data }, { headers });
}
