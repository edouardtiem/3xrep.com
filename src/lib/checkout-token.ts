import { createHmac, timingSafeEqual } from "node:crypto";
import { siteUrl } from "@/lib/site";

function secret(): string | null {
  return (
    process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() ||
    process.env.STRIPE_SECRET_KEY?.trim() ||
    null
  );
}

export function signOrgId(orgId: string): string | null {
  const s = secret();
  if (!s) return null;
  return createHmac("sha256", s).update(orgId).digest("hex");
}

export function verifyOrgSig(orgId: string, sig: string | null): boolean {
  if (!sig) return false;
  const expected = signOrgId(orgId);
  if (!expected) return false;
  const a = Buffer.from(expected);
  const b = Buffer.from(sig);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export function cardCheckoutUrl(orgId: string): string | null {
  const sig = signOrgId(orgId);
  if (!sig) return null;
  const origin = siteUrl();
  return `${origin}/api/stripe/checkout?mode=card&org=${encodeURIComponent(orgId)}&sig=${sig}`;
}

export function referralStartUrl(code: string): string {
  return `${siteUrl()}/start?ref=${encodeURIComponent(code)}`;
}
