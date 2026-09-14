import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/** Documented names first, then Supabase dashboard aliases. */
export function supabaseEnv(): { url: string; key: string } | null {
  const url = process.env.SUPABASE_URL?.trim() || process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() || "";
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() || process.env.SUPABASE_SECRET_KEY?.trim() || "";
  if (!url || !key) return null;
  return { url, key };
}

export function admin(): SupabaseClient | null {
  const env = supabaseEnv();
  if (!env) return null;
  return createClient(env.url, env.key, { auth: { persistSession: false, autoRefreshToken: false } });
}
