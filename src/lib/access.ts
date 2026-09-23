import { cardCheckoutUrl, referralStartUrl } from "@/lib/checkout-token";
import {
  CUTOFF_NEEDS_CARD,
  CUTOFF_NO_KEY,
  CUTOFF_NO_PAYMENT,
} from "@/lib/copy";
import { orgRowFromRequest, startTrialClock, type OrgRow } from "@/lib/orgs";
import { organizationEntitlements, includedBasePlan } from "@/lib/founding";
import { isJudgingTool, openTools } from "@/lib/trial";

export type Access =
  | { kind: "open" }
  | { kind: "no_key" }
  | { kind: "full"; org: OrgRow }
  | { kind: "needs_card"; org: OrgRow; checkoutUrl: string | null }
  | { kind: "lapsed"; org: OrgRow; checkoutUrl: string | null }
  | { kind: "canceled"; org: OrgRow };

export function cutoffPhrase(kind: Access["kind"], checkoutUrl?: string | null): string {
  if (kind === "no_key") return CUTOFF_NO_KEY;
  if (kind === "needs_card") {
    const link = checkoutUrl ? ` ${checkoutUrl}` : "";
    return CUTOFF_NEEDS_CARD + link;
  }
  return CUTOFF_NO_PAYMENT;
}

export async function resolveAccess(req: Request | undefined, now: Date = new Date()): Promise<Access> {
  if (openTools()) return { kind: "open" };
  if (!req) return { kind: "no_key" };
  const org = await orgRowFromRequest(req);
  if (!org) return { kind: "no_key" };
  const gate = organizationEntitlements(org, now);
  const checkoutUrl = org.id === "dev" ? null : cardCheckoutUrl(org.id);
  if (gate === "full") return { kind: "full", org };
  if (gate === "needs_card") return { kind: "needs_card", org, checkoutUrl };
  if (gate === "canceled") return { kind: "canceled", org };
  return { kind: "lapsed", org, checkoutUrl };
}

export function isBlocked(access: Access): access is Exclude<Access, { kind: "open" } | { kind: "full" }> {
  return access.kind !== "open" && access.kind !== "full";
}

export async function maybeStartTrial(org: OrgRow, tool: string): Promise<OrgRow> {
  if (!isJudgingTool(tool)) return org;
  return startTrialClock(org);
}

export function trialExtras(org: OrgRow | null): {
  founding?: { status: string; message: string };
  beta?: { access_until: string; message: string };
  paiement?: { kind: "add_card"; url: string; phrase: string };
  parrainage?: { url: string };
  demande_profil?: string;
} {
  if (!org || org.id === "dev") return {};
  const out: ReturnType<typeof trialExtras> = {};
  if (org.founding_state === "founding") out.founding = { status: "founding", message: "Founding Workspace. Your base plan is free forever." };
  else if (org.beta_access_until && includedBasePlan(org)) out.beta = { access_until: org.beta_access_until, message: "Full beta access. No card required. Founding status is awarded manually after real usage, subject to the 20-place limit." };
  if (!includedBasePlan(org) && !org.base_billing_blocked && org.status !== "active" && !org.stripe_subscription_id && org.trial_started_at) {
    const url = cardCheckoutUrl(org.id);
    if (url) {
      out.paiement = {
        kind: "add_card",
        url,
        phrase:
          "Add a card to keep the VP after day 7. Nothing is charged until the trial ends.",
      };
    }
  }
  if (org.referral_code) {
    out.parrainage = { url: referralStartUrl(org.referral_code) };
  }
  if (!org.company_url) {
    out.demande_profil =
      "Ask for the company's website and a user-confirmed short description, then call set_org_profile. Keep the person's name and role in their local person.md, not the shared organization profile. Do not block a first deal analysis on this.";
  }
  return out;
}
