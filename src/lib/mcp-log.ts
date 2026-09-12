import { AsyncLocalStorage } from "node:async_hooks";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { orgFromRequest } from "@/lib/orgs";

export const MAX_JSON_BYTES = 200_000;
export const RETENTION_DAYS = 14;

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

type LogStore = { req: Request };

const logStore = new AsyncLocalStorage<LogStore>();

export function runWithMcpRequest<T>(req: Request, fn: () => T): T {
  return logStore.run({ req }, fn);
}

/** Documented names first, then Supabase dashboard aliases. Without either pair the brain still answers. */
export function supabaseEnv(): { url: string; key: string } | null {
  const url = process.env.SUPABASE_URL?.trim() || process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() || "";
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() || process.env.SUPABASE_SECRET_KEY?.trim() || "";
  if (!url || !key) return null;
  return { url, key };
}

function admin(): SupabaseClient | null {
  const env = supabaseEnv();
  if (!env) return null;
  return createClient(env.url, env.key, { auth: { persistSession: false, autoRefreshToken: false } });
}

export function capJson(value: unknown): unknown {
  try {
    const raw = JSON.stringify(value) ?? "null";
    if (raw.length <= MAX_JSON_BYTES) return value;
    return { truncated: true, bytes: raw.length };
  } catch {
    return { truncated: true, bytes: 0 };
  }
}

export function evidenceKind(input: unknown): string | null {
  if (!input || typeof input !== "object") return null;
  const o = input as Record<string, unknown>;
  if (typeof o.evidence === "string") return o.evidence;
  if (Array.isArray(o.deals) && o.deals[0] && typeof o.deals[0] === "object") {
    const e = (o.deals[0] as Record<string, unknown>).evidence;
    if (typeof e === "string") return e;
  }
  return null;
}

export function gesteOf(input: unknown): string | null {
  if (!input || typeof input !== "object") return null;
  const g = (input as Record<string, unknown>).geste;
  return typeof g === "string" ? g : null;
}

export function clientOf(req: Request | undefined): string | null {
  if (!req) return null;
  const ua = req.headers.get("user-agent")?.trim();
  if (!ua) return null;
  return ua.slice(0, 200);
}

export function orgIdOf(id: string | undefined): string | null {
  if (!id || !UUID_RE.test(id)) return null;
  return id;
}

function parseToolOutput(result: unknown): unknown {
  if (!result || typeof result !== "object") return result;
  const content = (result as { content?: unknown }).content;
  if (!Array.isArray(content) || content.length === 0) return result;
  const first = content[0] as { text?: unknown };
  if (typeof first.text !== "string") return result;
  try {
    return JSON.parse(first.text);
  } catch {
    return { text: first.text };
  }
}

export type LogCallInput = {
  tool: string;
  ok: boolean;
  input: unknown;
  output: unknown;
  durationMs: number;
};

export async function logCall(row: LogCallInput): Promise<void> {
  try {
    const db = admin();
    if (!db) return;

    const req = logStore.getStore()?.req;
    let orgId: string | null = null;
    if (req) {
      const org = await orgFromRequest(req);
      orgId = orgIdOf(org?.id);
    }

    const { error } = await db.from("mcp_calls").insert({
      tool: row.tool,
      ok: row.ok,
      duration_ms: row.durationMs,
      client: clientOf(req),
      org_id: orgId,
      evidence_kind: evidenceKind(row.input),
      geste: gesteOf(row.input),
      input: capJson(row.input),
      output: capJson(row.output),
    });
    if (error) console.error("mcp_calls insert", error.message);

    const { error: purgeError } = await db
      .from("mcp_calls")
      .delete()
      .lt("created_at", new Date(Date.now() - RETENTION_DAYS * 24 * 60 * 60 * 1000).toISOString());
    if (purgeError) console.error("mcp_calls purge", purgeError.message);
  } catch (err) {
    console.error("mcp_calls", err instanceof Error ? err.message : err);
  }
}

export function withMcpLog<Args extends Record<string, unknown>, R>(
  tool: string,
  run: (args: Args) => R | Promise<R>,
): (args: Args) => Promise<R> {
  return async (args: Args) => {
    const t0 = Date.now();
    try {
      const result = await run(args);
      await logCall({
        tool,
        ok: true,
        input: args,
        output: parseToolOutput(result),
        durationMs: Date.now() - t0,
      });
      return result;
    } catch (err) {
      await logCall({
        tool,
        ok: false,
        input: args,
        output: { error: err instanceof Error ? err.message : "error" },
        durationMs: Date.now() - t0,
      });
      throw err;
    }
  };
}
