import { admin } from "@/lib/supabase-admin";
import { effectiveAccess, type TrialClock, type EffectiveAccess } from "@/lib/trial";

export type FoundingFields = {
  founding_state?: string;
  founding_granted_at?: string | null;
  beta_enrolled_at?: string | null;
  beta_access_until?: string | null;
  base_billing_blocked?: boolean;
  comped?: boolean;
  is_internal?: boolean;
};
export type BetaProgram = {
  enabled: boolean; ends_at: string | null; environment: "test" | "production";
  transition_days: number; min_sessions: number; min_active_days: number; min_outputs: number;
  early_promotion_code: string | null;
};
export function includedBasePlan(org: FoundingFields, now = new Date()): boolean {
  return org.founding_state === "founding" || org.comped === true ||
    (!!org.beta_access_until && Date.parse(org.beta_access_until) > now.getTime());
}
export function organizationEntitlements(org: TrialClock & FoundingFields, now = new Date()): EffectiveAccess {
  if (includedBasePlan(org, now)) return "full";
  // Beta participants have a fixed, announced transition deadline, not a fresh trial.
  if (org.beta_enrolled_at && org.status !== "active") return "lapsed";
  return effectiveAccess(org, now);
}
export function betaOpen(program: BetaProgram | null, now = new Date()): boolean {
  return !!program?.enabled && !!program.ends_at && Date.parse(program.ends_at) > now.getTime();
}
export async function getBetaProgram(): Promise<BetaProgram | null> {
  const db = admin();
  if (!db) return null;
  const { data, error } = await db.from("founding_program").select("*").eq("id", true).single();
  if (error?.code === "42P01") return null;
  if (error) throw new Error("Founding program unavailable. Apply the Founding 20 migration.");
  return data as BetaProgram;
}
export async function publicBetaOffer() {
  const program = await getBetaProgram();
  if (!betaOpen(program)) return { enabled: false, available: false, endsAt: null };
  const db = admin()!;
  const { count, error } = await db.from("founding_slots").select("slot", { count: "exact", head: true });
  if (error) throw new Error("Founding availability unavailable");
  return { enabled: true, available: count !== null && count < 20, endsAt: program!.ends_at };
}

/** Only metadata is retained. No deal, email, transcript or generated text here. */
export function meaningfulOutput(tool: string, output: unknown): boolean {
  if (!output || typeof output !== "object") return false;
  const data = output as Record<string, unknown>;
  if (data.refus || data.error || data.ok === false || data.isError) return false;
  const useful = (v: unknown) => !!v && typeof v === "object" &&
    !(v as Record<string, unknown>).refus && !!(v as Record<string, unknown>).action;
  if (tool === "plan_horizon") return Array.isArray(data.agenda) && data.agenda.some(useful);
  if (tool === "pipe_review") return Array.isArray(data.deals) && data.deals.some(useful);
  return ["audit_deal", "next_question", "objection_map"].includes(tool) && !!data.action;
}
export async function recordBetaUsage(orgId: string, tool: string, input: Record<string, unknown>, output: unknown): Promise<string | null> {
  if (orgId === "dev") return null;
  const db = admin();
  if (!db) throw new Error("Usage database unavailable");
  const meaningful = meaningfulOutput(tool, output);
  const horizon = tool === "plan_horizon" && [1,7,30].includes(Number(input.fenetre)) ? Number(input.fenetre) : null;
  const { data, error } = await db.rpc("record_beta_usage", {
    p_org: orgId, p_tool: tool, p_horizon: meaningful ? horizon : null, p_meaningful: meaningful,
  });
  if (error) throw new Error(`Usage recording failed: ${error.message}`);
  return data as string | null;
}

export function attribution(input: { source?: unknown; campaign?: unknown; medium?: unknown }) {
  const clean = (v: unknown) => typeof v === "string" ? v.replace(/[^a-zA-Z0-9_.-]/g, "").slice(0,100) || null : null;
  return { acquisition_source: clean(input.source) ?? "direct", acquisition_campaign: clean(input.campaign), acquisition_medium: clean(input.medium) };
}
