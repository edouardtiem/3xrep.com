import { LIST_PRICE_CENTS } from "@/lib/stripe-checkout-session";
import { stripeClient, stripeSecret } from "@/lib/stripe-env";
import { admin } from "@/lib/supabase-admin";
import { orgByCustomer, orgById } from "@/lib/orgs";

export function referralBlocked(input: {
  parrainId: string;
  filleulId: string;
  parrainEmail: string | null;
  filleulEmail: string | null;
  parrainCustomer: string | null;
  filleulCustomer: string | null;
  parrainFingerprint: string | null;
  filleulFingerprint: string | null;
}): boolean {
  if (input.parrainId === input.filleulId) return true;
  if (input.parrainEmail && input.filleulEmail && input.parrainEmail === input.filleulEmail) return true;
  if (
    input.parrainCustomer &&
    input.filleulCustomer &&
    input.parrainCustomer === input.filleulCustomer
  ) {
    return true;
  }
  if (
    input.parrainFingerprint &&
    input.filleulFingerprint &&
    input.parrainFingerprint === input.filleulFingerprint
  ) {
    return true;
  }
  return false;
}

export async function creditParrainOnPaid(input: {
  filleulCustomerId: string;
  amountPaid: number;
  cardFingerprint?: string | null;
}): Promise<void> {
  if (input.amountPaid <= 0) return;
  const filleul = await orgByCustomer(input.filleulCustomerId);
  if (!filleul?.referred_by_org_id) return;
  const parrain = await orgById(filleul.referred_by_org_id);
  if (!parrain) return;
  const fp = input.cardFingerprint ?? filleul.card_fingerprint;
  if (
    referralBlocked({
      parrainId: parrain.id,
      filleulId: filleul.id,
      parrainEmail: parrain.email,
      filleulEmail: filleul.email,
      parrainCustomer: parrain.stripe_customer_id,
      filleulCustomer: filleul.stripe_customer_id,
      parrainFingerprint: parrain.card_fingerprint,
      filleulFingerprint: fp,
    })
  ) {
    return;
  }

  const db = admin();
  if (!db) return;

  const { data: existing } = await db
    .from("referral_credits")
    .select("id, status")
    .eq("parrain_id", parrain.id)
    .eq("filleul_id", filleul.id)
    .maybeSingle();
  if (existing?.status === "applied" || existing?.status === "queued") return;

  const { data: row, error } = await db
    .from("referral_credits")
    .insert({
      parrain_id: parrain.id,
      filleul_id: filleul.id,
      amount_cents: LIST_PRICE_CENTS,
      status: "queued",
    })
    .select("id")
    .maybeSingle();
  if (error) {
    if (error.code === "23505") return;
    console.error("referral_credits insert", error.message);
    return;
  }
  if (!row) return;
  await applyQueuedCredits(parrain.id);
}

export async function applyQueuedCredits(parrainId: string): Promise<void> {
  const parrain = await orgById(parrainId);
  if (!parrain?.stripe_customer_id || !stripeSecret()) return;
  const db = admin();
  if (!db) return;
  const { data: queued } = await db
    .from("referral_credits")
    .select("id, amount_cents")
    .eq("parrain_id", parrainId)
    .eq("status", "queued");
  if (!queued?.length) return;
  const stripe = stripeClient();
  for (const c of queued) {
    try {
      const txn = await stripe.customers.createBalanceTransaction(parrain.stripe_customer_id, {
        amount: -Math.abs(c.amount_cents as number),
        currency: "usd",
        description: "3xrep referral credit",
      });
      await db
        .from("referral_credits")
        .update({ status: "applied", stripe_balance_txn: txn.id })
        .eq("id", c.id);
    } catch (err) {
      console.error("referral credit stripe", err instanceof Error ? err.message : err);
    }
  }
}

export async function reverseCreditsForFilleul(filleulCustomerId: string): Promise<void> {
  const filleul = await orgByCustomer(filleulCustomerId);
  if (!filleul) return;
  const db = admin();
  if (!db || !stripeSecret()) return;
  const { data: rows } = await db
    .from("referral_credits")
    .select("id, parrain_id, amount_cents, status, stripe_balance_txn")
    .eq("filleul_id", filleul.id)
    .eq("status", "applied");
  if (!rows?.length) return;
  const stripe = stripeClient();
  for (const c of rows) {
    const parrain = await orgById(c.parrain_id as string);
    if (!parrain?.stripe_customer_id) continue;
    try {
      await stripe.customers.createBalanceTransaction(parrain.stripe_customer_id, {
        amount: Math.abs(c.amount_cents as number),
        currency: "usd",
        description: "3xrep referral credit reversed",
      });
      await db.from("referral_credits").update({ status: "reversed" }).eq("id", c.id);
    } catch (err) {
      console.error("referral reverse", err instanceof Error ? err.message : err);
    }
  }
}
