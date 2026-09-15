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
  const url = mcpUrl();

  return (
    <>
      <Header />
      <main className="mx-auto flex w-full max-w-[40rem] flex-1 flex-col gap-12 px-5 py-16 sm:px-10">
        <h1 className="text-[2rem] leading-[1.1] font-medium tracking-[-0.03em] sm:text-[2.5rem]">
          {key ? "Your key. Shown once." : "Done"}
        </h1>
        {key && mcpJson ? (
          <>
            <p className="text-mute max-w-[40ch] text-[1.125rem] leading-[1.5]">
              Add him in Claude, next to HubSpot. Then ask what&apos;s stuck
              this week.
            </p>
            <div className="flex items-center justify-between gap-4 rounded-lg border border-line bg-raise px-4 py-3 font-mono text-sm">
              <span className="truncate">{key}</span>
              <CopyButton text={key} />
            </div>
            <div>
              <p className="text-[1.35rem] leading-[1.25] tracking-[-0.02em] sm:text-[1.75rem]">
                Claude
              </p>
              <p className="text-mute mt-4 leading-[1.5]">
                Settings → Connectors → Add custom connector. Paste this
                address and your key.
              </p>
              <p className="mt-4 font-mono text-sm break-all">{url}</p>
            </div>
            <details className="border-t border-line pt-10">
              <summary className="cursor-pointer text-[1.125rem] leading-[1.5]">
                If you use Cursor
              </summary>
              <div className="mt-6 flex flex-col gap-4">
                <pre className="overflow-x-auto rounded-lg border border-line bg-raise p-4 font-mono text-xs">
                  {mcpJson}
                </pre>
                <CopyButton text={mcpJson} label="Copy JSON" />
                <p className="text-dim text-[0.8125rem]">
                  If the client cannot send a header, use {mcpUrlWithKey(key)}
                </p>
                {spec ? (
                  <CopyButton tone="loud" label="Copy the setup text" text={spec} />
                ) : null}
              </div>
            </details>
          </>
        ) : (
          <p className="text-mute max-w-[40ch] text-[1.125rem] leading-[1.5]">
            Card saved, or the key was already shown. He keeps judging until
            the trial ends, then the card is charged.
          </p>
        )}
        {ref ? (
          <p className="text-dim text-[0.8125rem]">
            Refer a team: {ref} — you get ${LIST_PRICE_USD} credit when they pay.
          </p>
        ) : null}
      </main>
    </>
  );
}
