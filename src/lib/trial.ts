export const TRIAL_DAYS_DIRECT = 14;
export const TRIAL_DAYS_REFERRAL = 28;
export const CARD_GRACE_DAYS = 7;

export type OrgStatus = "trial" | "needs_card" | "active" | "lapsed" | "canceled";

export type TrialClock = {
  status: string;
  trial_started_at: string | null;
  trial_ends_at: string | null;
  card_deadline_at: string | null;
  stripe_subscription_id: string | null;
};

export type EffectiveAccess = "full" | "needs_card" | "lapsed" | "canceled";

export const JUDGING_TOOLS = [
  "audit_deal",
  "pipe_review",
  "next_question",
  "objection_map",
  "plan_horizon",
] as const;

export function isJudgingTool(tool: string): boolean {
  return (JUDGING_TOOLS as readonly string[]).includes(tool);
}

export function trialDaysFor(referred: boolean): number {
  return referred ? TRIAL_DAYS_REFERRAL : TRIAL_DAYS_DIRECT;
}

export function addDays(from: Date, days: number): Date {
  return new Date(from.getTime() + days * 86_400_000);
}

export function trialWindow(now: Date, days: number): {
  started: Date;
  ends: Date;
  cardDeadline: Date;
} {
  return {
    started: now,
    ends: addDays(now, days),
    cardDeadline: addDays(now, CARD_GRACE_DAYS),
  };
}

/** Stripe rejects trial_end < 48h from now. Remaining under that → charge now. */
export function stripeTrialEndUnix(trialEndsAt: string | null, now: Date = new Date()): number | null {
  if (!trialEndsAt) return null;
  const end = Date.parse(trialEndsAt);
  if (Number.isNaN(end)) return null;
  const min = now.getTime() + 48 * 3600_000;
  if (end <= now.getTime()) return null;
  if (end < min) return null;
  return Math.floor(end / 1000);
}

export function effectiveAccess(row: TrialClock, now: Date = new Date()): EffectiveAccess {
  if (row.status === "active") return "full";
  if (row.status === "canceled") return "canceled";
  if (row.status === "lapsed") return "lapsed";
  if (!row.trial_started_at) return "full";
  const ends = row.trial_ends_at ? Date.parse(row.trial_ends_at) : NaN;
  if (!Number.isNaN(ends) && now.getTime() > ends) return "lapsed";
  if (row.stripe_subscription_id) return "full";
  const deadline = row.card_deadline_at ? Date.parse(row.card_deadline_at) : NaN;
  if (!Number.isNaN(deadline) && now.getTime() > deadline) return "needs_card";
  return "full";
}

export function openTools(): boolean {
  return process.env.MCP_OPEN_TOOLS === "1";
}

/** After Stripe Checkout: keep trial if the clock is running; activate if they paid now or were lapsed. */
export function statusAfterCheckout(
  row: { status: string; trial_ends_at: string | null },
  paid: boolean,
): OrgStatus {
  if (row.status === "canceled") return "canceled";
  if (row.status === "active") return "active";
  if (paid && (row.status === "lapsed" || !row.trial_ends_at)) return "active";
  if (row.status === "lapsed") return "lapsed";
  return "trial";
}
