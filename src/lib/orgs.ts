import type { FoundingFields } from "@/lib/founding";
import { attribution } from "@/lib/founding";
import type { SalesContext } from "@/lib/brain/types";
import { createHash, randomBytes } from "node:crypto";
import { admin } from "@/lib/supabase-admin";
import { trialDaysFor, trialWindow, type OrgStatus } from "@/lib/trial";

export type Org = {
  id: string;
  status: string;
};

export type OrgRow = FoundingFields & {
  id: string;
  status: OrgStatus | string;
  email: string | null;
  trial_days: number;
  trial_started_at: string | null;
  trial_ends_at: string | null;
  card_deadline_at: string | null;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  stripe_session_id: string | null;
  referral_code: string;
  referred_by_org_id: string | null;
  title: string | null;
  mission: string | null;
  company_url: string | null;
  company_blurb: string | null;
  sales_context?: SalesContext | null;
  card_fingerprint: string | null;
  start_token: string | null;
};

const ORG_COLS =
  "id, status, email, trial_days, trial_started_at, trial_ends_at, card_deadline_at, stripe_customer_id, stripe_subscription_id, stripe_session_id, referral_code, referred_by_org_id, title, mission, company_url, company_blurb, sales_context, card_fingerprint, start_token, founding_state, founding_granted_at, beta_enrolled_at, beta_access_until, base_billing_blocked, comped, is_internal";

function hashKey(plain: string): string {
  return createHash("sha256").update(plain).digest("hex");
}

export function mintKey(): string {
  return `3xr_${randomBytes(24).toString("hex")}`;
}

export function mintReferralCode(): string {
  return randomBytes(4).toString("hex");
}

export function mintStartToken(): string {
  return `st_${randomBytes(16).toString("hex")}`;
}

export function normalizeEmail(raw: string): string {
  return raw.trim().toLowerCase();
}

export function tokenFromRequest(req: Request): string | null {
  const h = req.headers.get("authorization");
  if (h) {
    const m = /^Bearer\s+(.+)$/i.exec(h);
    if (m?.[1]?.trim()) return m[1].trim();
  }
  try {
    const q = new URL(req.url).searchParams.get("key")?.trim();
    return q || null;
  } catch {
    return null;
  }
}

function asRow(data: Record<string, unknown>): OrgRow {
  return {
    founding_state: String(data.founding_state ?? "none"),
    founding_granted_at: data.founding_granted_at as string | null,
    beta_enrolled_at: data.beta_enrolled_at as string | null,
    beta_access_until: data.beta_access_until as string | null,
    base_billing_blocked: data.base_billing_blocked === true,
    comped: data.comped === true,
    is_internal: data.is_internal === true,
    id: String(data.id),
    status: String(data.status),
    email: (data.email as string | null) ?? null,
    trial_days: typeof data.trial_days === "number" ? data.trial_days : 14,
    trial_started_at: (data.trial_started_at as string | null) ?? null,
    trial_ends_at: (data.trial_ends_at as string | null) ?? null,
    card_deadline_at: (data.card_deadline_at as string | null) ?? null,
    stripe_customer_id: (data.stripe_customer_id as string | null) ?? null,
    stripe_subscription_id: (data.stripe_subscription_id as string | null) ?? null,
    stripe_session_id: (data.stripe_session_id as string | null) ?? null,
    referral_code: String(data.referral_code ?? ""),
    referred_by_org_id: (data.referred_by_org_id as string | null) ?? null,
    title: (data.title as string | null) ?? null,
    mission: (data.mission as string | null) ?? null,
    company_url: (data.company_url as string | null) ?? null,
    company_blurb: (data.company_blurb as string | null) ?? null,
    sales_context: (data.sales_context as SalesContext | null) ?? null,
    card_fingerprint: (data.card_fingerprint as string | null) ?? null,
    start_token: (data.start_token as string | null) ?? null,
  };
}

export function devOrg(): OrgRow {
  return {
    id: "dev",
    status: "active",
    email: null,
    trial_days: 14,
    trial_started_at: null,
    trial_ends_at: null,
    card_deadline_at: null,
    stripe_customer_id: null,
    stripe_subscription_id: null,
    stripe_session_id: null,
    referral_code: "dev",
    referred_by_org_id: null,
    title: null,
    mission: null,
    company_url: null,
    company_blurb: null,
    card_fingerprint: null,
    start_token: null,
  };
}

export async function orgRowFromRequest(req: Request): Promise<OrgRow | null> {
  const token = tokenFromRequest(req);
  if (!token) return null;
  const envKey = process.env.DEV_ORG_KEY;
  if (envKey && token === envKey) return devOrg();
  const db = admin();
  if (!db) return null;
  const { data, error } = await db.from("orgs").select(ORG_COLS).eq("key_hash", hashKey(token)).maybeSingle();
  if (error || !data) return null;
  return asRow(data as Record<string, unknown>);
}

/** Logging: any known org, including trial. */
export async function orgFromRequest(req: Request): Promise<Org | null> {
  const row = await orgRowFromRequest(req);
  if (!row) return null;
  return { id: row.id, status: row.status };
}

export async function orgById(id: string): Promise<OrgRow | null> {
  const db = admin();
  if (!db) return null;
  const { data, error } = await db.from("orgs").select(ORG_COLS).eq("id", id).maybeSingle();
  if (error || !data) return null;
  return asRow(data as Record<string, unknown>);
}

export async function orgByCustomer(stripeCustomerId: string): Promise<OrgRow | null> {
  const db = admin();
  if (!db) return null;
  const { data, error } = await db
    .from("orgs")
    .select(ORG_COLS)
    .eq("stripe_customer_id", stripeCustomerId)
    .maybeSingle();
  if (error || !data) return null;
  return asRow(data as Record<string, unknown>);
}

export async function orgByReferralCode(code: string): Promise<OrgRow | null> {
  const db = admin();
  if (!db) return null;
  const { data, error } = await db
    .from("orgs")
    .select(ORG_COLS)
    .eq("referral_code", code.trim().toLowerCase())
    .maybeSingle();
  if (error || !data) return null;
  return asRow(data as Record<string, unknown>);
}

export async function orgBySession(sessionId: string): Promise<OrgRow | null> {
  const db = admin();
  if (!db) return null;
  const { data, error } = await db
    .from("orgs")
    .select(ORG_COLS)
    .eq("stripe_session_id", sessionId)
    .maybeSingle();
  if (error || !data) return null;
  return asRow(data as Record<string, unknown>);
}

export async function orgByEmail(email: string): Promise<OrgRow | null> {
  const db = admin();
  if (!db) return null;
  const { data, error } = await db.from("orgs").select(ORG_COLS).eq("email", normalizeEmail(email)).maybeSingle();
  if (error || !data) return null;
  return asRow(data as Record<string, unknown>);
}

export async function startTrialOrg(input: {
  email: string;
  ref?: string | null;
  source?: string; campaign?: string; medium?: string;
}): Promise<{ key: string; startToken: string; row: OrgRow } | { exists: true }> {
  const db = admin();
  if (!db) {
    throw new Error("SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY manquants");
  }
  const email = normalizeEmail(input.email);
  const existing = await orgByEmail(email);
  if (existing) return { exists: true };

  let referredBy: string | null = null;
  if (input.ref?.trim()) {
    const parrain = await orgByReferralCode(input.ref.trim().toLowerCase());
    if (parrain && parrain.email !== email) referredBy = parrain.id;
  }

  const plain = mintKey();
  const startToken = mintStartToken();
  const days = trialDaysFor(Boolean(referredBy));
  let code = mintReferralCode();
  for (let i = 0; i < 5; i++) {
    const { error } = await db.from("orgs").insert({
      key_hash: hashKey(plain),
      key_plain: plain,
      status: "trial",
      email,
      trial_days: days,
      referral_code: code,
      referred_by_org_id: referredBy,
      start_token: startToken,
      ...attribution({ source: input.source || (referredBy ? "referral" : undefined), campaign: input.campaign, medium: input.medium }),
    });
    if (!error) {
      const row = await orgByEmail(email);
      if (!row) throw new Error("org start: insert sans lecture");
      return { key: plain, startToken, row };
    }
    if (error.code === "23505" && error.message?.includes("referral_code")) {
      code = mintReferralCode();
      continue;
    }
    throw new Error(error.message || error.code || "org start");
  }
  throw new Error("org start: referral_code collision");
}

export async function revealStartKey(token: string): Promise<string | null> {
  const db = admin();
  if (!db) return null;
  const { data, error } = await db
    .from("orgs")
    .select("id, key_plain")
    .eq("start_token", token)
    .maybeSingle();
  if (error || !data?.key_plain) return null;
  await db.from("orgs").update({ key_plain: null, start_token: null }).eq("id", data.id);
  return data.key_plain as string;
}

export async function startTrialClock(org: OrgRow, now: Date = new Date()): Promise<OrgRow> {
  if (org.id === "dev" || org.trial_started_at || org.beta_enrolled_at || org.founding_state === "founding" || org.comped || org.status === "active") return org;
  const db = admin();
  if (!db) return org;
  const days = org.trial_days || trialDaysFor(Boolean(org.referred_by_org_id));
  const w = trialWindow(now, days);
  const patch = {
    trial_started_at: w.started.toISOString(),
    trial_ends_at: w.ends.toISOString(),
    card_deadline_at: w.cardDeadline.toISOString(),
    status: "trial",
  };
  const { error } = await db.from("orgs").update(patch).eq("id", org.id).is("trial_started_at", null);
  if (error) throw new Error("Trial clock unavailable");
  return (await orgById(org.id)) ?? { ...org, ...patch };
}

export async function setOrgStatus(
  id: string,
  status: OrgStatus,
  extra: Record<string, unknown> = {},
): Promise<void> {
  const db = admin();
  if (!db) return;
  const { error } = await db.from("orgs").update({ status, ...extra }).eq("id", id);
  if (error) throw error;
}

export async function attachStripe(input: {
  orgId: string;
  stripeCustomerId: string | null;
  stripeSessionId: string;
  stripeSubscriptionId: string | null;
  status: OrgStatus;
  cardFingerprint?: string | null;
}): Promise<void> {
  const db = admin();
  if (!db) {
    throw new Error("SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY manquants");
  }
  const { error } = await db
    .from("orgs")
    .update({
      stripe_customer_id: input.stripeCustomerId,
      stripe_session_id: input.stripeSessionId,
      stripe_subscription_id: input.stripeSubscriptionId,
      status: input.status,
      ...(input.cardFingerprint ? { card_fingerprint: input.cardFingerprint } : {}),
    })
    .eq("id", input.orgId);
  if (error) throw error;
}

export async function issueKey(input: {
  stripeCustomerId: string | null;
  stripeSessionId: string;
  email?: string | null;
  stripeSubscriptionId?: string | null;
}): Promise<string | null> {
  const db = admin();
  if (!db) {
    throw new Error("SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY manquants");
  }

  const existing = await db
    .from("orgs")
    .select("key_plain")
    .eq("stripe_session_id", input.stripeSessionId)
    .maybeSingle();
  if (existing.data) {
    return (existing.data.key_plain as string | null) ?? null;
  }

  const email = input.email ? normalizeEmail(input.email) : null;
  if (email) {
    const byMail = await orgByEmail(email);
    if (byMail) {
      await attachStripe({
        orgId: byMail.id,
        stripeCustomerId: input.stripeCustomerId,
        stripeSessionId: input.stripeSessionId,
        stripeSubscriptionId: input.stripeSubscriptionId ?? byMail.stripe_subscription_id,
        status: "active",
      });
      return null;
    }
  }

  const plain = mintKey();
  let code = mintReferralCode();
  for (let i = 0; i < 5; i++) {
    const { error } = await db.from("orgs").insert({
      key_hash: hashKey(plain),
      key_plain: plain,
      stripe_customer_id: input.stripeCustomerId,
      stripe_session_id: input.stripeSessionId,
      stripe_subscription_id: input.stripeSubscriptionId ?? null,
      status: "active",
      email,
      trial_days: 14,
      referral_code: code,
    });
    if (!error) return plain;
    if (error.code === "23505" && error.message?.includes("referral_code")) {
      code = mintReferralCode();
      continue;
    }
    const raced = await db
      .from("orgs")
      .select("key_plain")
      .eq("stripe_session_id", input.stripeSessionId)
      .maybeSingle();
    if (raced.data) return (raced.data.key_plain as string | null) ?? null;
    throw error;
  }
  throw new Error("org pay-now: referral_code collision");
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
  const { error } = await db.from("orgs").update({ status: "canceled" }).eq("stripe_customer_id", stripeCustomerId);
  if (error) throw error;
}

export async function updateOrgProfile(
  orgId: string,
  profile: {
    title: string;
    mission: string;
    company_url: string;
    company_blurb: string | null;
    sales_context?: SalesContext;
  },
): Promise<void> {
  const db = admin();
  if (!db) return;
  const { error } = await db.from("orgs").update(profile).eq("id", orgId);
  if (error) throw new Error("Impossible d’enregistrer le profil.");
}
