import { createHash, randomBytes } from "node:crypto";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export type Org = {
  id: string;
  status: string;
};

function hashKey(plain: string): string {
  return createHash("sha256").update(plain).digest("hex");
}

export function mintKey(): string {
  return `3xr_${randomBytes(24).toString("hex")}`;
}

function admin(): SupabaseClient | null {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

function bearer(req: Request): string | null {
  const h = req.headers.get("authorization");
  if (!h) return null;
  const m = /^Bearer\s+(.+)$/i.exec(h);
  return m?.[1]?.trim() || null;
}

export async function orgFromRequest(req: Request): Promise<Org | null> {
  const token = bearer(req);
  if (!token) return null;
  const dev = process.env.DEV_ORG_KEY;
  if (dev && token === dev) return { id: "dev", status: "active" };
  const db = admin();
  if (!db) return null;
  const { data, error } = await db
    .from("orgs")
    .select("id, status")
    .eq("key_hash", hashKey(token))
    .maybeSingle();
  if (error || !data) return null;
  if (data.status !== "active") return null;
  return { id: data.id, status: data.status };
}

export async function issueKey(input: {
  stripeCustomerId: string | null;
  stripeSessionId: string;
}): Promise<string> {
  const plain = mintKey();
  const db = admin();
  if (!db) {
    throw new Error("SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY manquants");
  }
  const { error } = await db.from("orgs").insert({
    key_hash: hashKey(plain),
    key_plain: plain,
    stripe_customer_id: input.stripeCustomerId,
    stripe_session_id: input.stripeSessionId,
    status: "active",
  });
  if (error) throw error;
  return plain;
}

export async function revealKey(sessionId: string): Promise<string | null> {
  const db = admin();
  if (!db) return null;
  const { data, error } = await db
    .from("orgs")
    .select("id, key_plain")
    .eq("stripe_session_id", sessionId)
    .maybeSingle();
  if (error || !data?.key_plain) return null;
  await db.from("orgs").update({ key_plain: null }).eq("id", data.id);
  return data.key_plain as string;
}

export async function revokeByCustomer(stripeCustomerId: string): Promise<void> {
  const db = admin();
  if (!db) return;
  await db.from("orgs").update({ status: "canceled" }).eq("stripe_customer_id", stripeCustomerId);
}
