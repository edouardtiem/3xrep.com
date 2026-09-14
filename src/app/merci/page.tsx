import { referralStartUrl } from "@/lib/checkout-token";
import { CopyButton } from "@/components/CopyButton";
import { Header } from "@/components/Header";
import { ensureOrgFromCheckout } from "@/lib/checkout-complete";
import { agentSetupPrompt } from "@/lib/landing";
import { orgBySession, revealKey } from "@/lib/orgs";
import { mcpClientJson, mcpUrl, mcpUrlWithKey } from "@/lib/site";
import { LIST_PRICE_USD } from "@/lib/stripe-checkout-session";

export const dynamic = "force-dynamic";

async function orgAndKey(sessionId: string) {
  try {
    await ensureOrgFromCheckout(sessionId);
  } catch {
    /* webhook may already have written */
  }
  const key = await revealKey(sessionId);
  const org = await orgBySession(sessionId);
  return { key, org };
}

export default async function Merci({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id: sessionId } = await searchParams;
  const { key, org } = sessionId ? await orgAndKey(sessionId) : { key: null, org: null };
  const mcpJson = key ? mcpClientJson(key) : null;
  const spec = key ? agentSetupPrompt(mcpUrl(), key) : null;
  const ref = org?.referral_code ? referralStartUrl(org.referral_code) : null;

  return (
    <>
      <Header />
      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-8 px-6 py-16">
        <h1 className="text-3xl font-medium tracking-tight">{key ? "Key" : "Done"}</h1>
        {key && mcpJson ? (
          <>
            <p className="text-sm text-mute">Shown once. The connector needs this key.</p>
            <div className="flex items-center justify-between gap-4 rounded-[10px] border border-line bg-raise px-4 py-3 font-mono text-sm">
              <span className="truncate">{key}</span>
              <CopyButton text={key} />
            </div>
            <pre className="overflow-x-auto rounded-[10px] border border-line bg-raise p-4 font-mono text-xs">
              {mcpJson}
            </pre>
            <CopyButton text={mcpJson} />
            <p className="text-dim text-xs">
              Clients that cannot send a header: use {mcpUrlWithKey(key)}
            </p>
            {spec ? (
              <div className="mt-2">
                <CopyButton tone="loud" label="Copy the agent prompt" text={spec} />
              </div>
            ) : null}
          </>
        ) : (
          <p className="text-mute">
            Card saved or key already shown. The VP keeps judging until the trial ends, then
            Stripe charges. If you paid now, the key was on this page once.
          </p>
        )}
        {ref ? (
          <p className="text-dim text-sm">
            Refer a team: {ref} — you get ${LIST_PRICE_USD} credit when they pay.
          </p>
        ) : null}
      </main>
    </>
  );
}
