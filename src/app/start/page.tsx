import { publicBetaOffer } from "@/lib/founding";
import Link from "next/link";
import { referralStartUrl } from "@/lib/checkout-token";
import { CopyButton } from "@/components/CopyButton";
import { Header } from "@/components/Header";
import { pageMeta } from "@/lib/docs";
import { agentSetupPrompt } from "@/lib/landing";
import { orgById, revealStartKey } from "@/lib/orgs";
import { mcpClientJson, mcpUrl, mcpUrlWithKey } from "@/lib/site";
import { LIST_PRICE_USD } from "@/lib/stripe-checkout-session";
import { admin } from "@/lib/supabase-admin";

export const dynamic = "force-dynamic";

export const metadata = pageMeta({
  title: "Start with 3xrep",
  description: "Get your workspace key and try 3xrep in your AI chat. No card to start.",
  path: "/start",
});

async function orgIdFromStartToken(token: string): Promise<string | null> {
  const db = admin();
  if (!db) return null;
  const { data } = await db.from("orgs").select("id").eq("start_token", token).maybeSingle();
  return data?.id ?? null;
}

function KeyPanel({
  keyPlain,
  referralCode,
}: {
  keyPlain: string;
  referralCode?: string | null;
}) {
  const url = mcpUrl();
  const mcpJson = mcpClientJson(keyPlain);
  const withKey = mcpUrlWithKey(keyPlain);
  const spec = agentSetupPrompt(url, keyPlain);
  const ref = referralCode ? referralStartUrl(referralCode) : null;
  return (
    <div className="flex flex-col gap-12">
      <section aria-labelledby="key-title">
        <h2 id="key-title" className="text-[1.5rem] leading-tight font-medium tracking-[-0.02em]">Copy your key now.</h2>
        <p className="text-mute mt-3 leading-[1.5]">You will need it to connect 3xrep. For your privacy, this page shows it only once.</p>
        <div className="mt-5 flex items-center justify-between gap-4 rounded-lg border border-line bg-raise px-4 py-3 text-sm">
          <code className="truncate">{keyPlain}</code>
          <CopyButton text={keyPlain} label="Copy key" />
        </div>
      </section>

      <section aria-labelledby="connect-title">
        <h2 id="connect-title" className="text-[1.5rem] leading-tight font-medium tracking-[-0.02em]">Connect in Claude.</h2>
        <p className="text-mute mt-3 leading-[1.5]">Open Settings → Connectors → Add custom connector. Paste the address below.</p>
        <div className="mt-5 flex items-center justify-between gap-4 rounded-lg border border-line bg-raise px-4 py-3 text-sm">
          <code className="truncate">{url}</code>
          <CopyButton text={withKey} label="Copy private address" />
        </div>
        <p className="text-dim mt-2 text-[0.8125rem] leading-[1.5]">The copied address includes your key. Keep it private.</p>
        <p className="text-mute mt-5 leading-[1.5]">Connect your CRM alongside 3xrep when available. You can begin with deal notes in your chat. <Link className="underline underline-offset-4" href="/install">See the connection guide</Link>.</p>
      </section>

      <section aria-labelledby="first-question-title">
        <h2 id="first-question-title" className="text-[1.5rem] leading-tight font-medium tracking-[-0.02em]">Ask about one deal.</h2>
        <p className="mt-4 rounded-lg bg-raise px-5 py-4 leading-[1.5]">“How should I move this deal forward, and what should I say?”</p>
      </section>

      <details className="border-t border-line pt-6">
        <summary className="cursor-pointer text-[1rem] leading-[1.5]">Using ChatGPT Work or Cursor?</summary>
        <div className="text-mute mt-5 space-y-5 leading-[1.5]">
          <p><strong className="text-fg font-medium">ChatGPT Work:</strong> your workspace may allow a personal MCP connection through Plugins in developer mode. This 3xrep path still needs an end-to-end test. <Link className="underline underline-offset-4" href="/install">Read the current setup notes</Link>.</p>
          <div><p><strong className="text-fg font-medium">Cursor:</strong> copy this configuration into your MCP settings.</p><pre className="mt-3 overflow-x-auto rounded-lg border border-line bg-raise p-4 font-mono text-xs">{mcpJson}</pre><div className="mt-3"><CopyButton text={mcpJson} label="Copy configuration" /></div></div>
          <CopyButton label="Copy the setup text" text={spec} />
        </div>
      </details>

      {ref ? (
        <p className="text-dim text-[0.8125rem]">Refer a team: {ref} - you get ${LIST_PRICE_USD} credit when they pay.</p>
      ) : null}
    </div>
  );
}

export default async function Start({
  searchParams,
}: {
  searchParams: Promise<{ t?: string; ref?: string; utm_source?:string; utm_medium?:string; utm_campaign?:string }>;
}) {
  const { t, ref, utm_source, utm_medium, utm_campaign } = await searchParams;
  const offer = await publicBetaOffer();
  const orgId = t ? await orgIdFromStartToken(t) : null;
  const key = t ? await revealStartKey(t) : null;
  const org = orgId ? await orgById(orgId) : null;

  return (
    <>
      <Header />
      <main className="mx-auto flex w-full max-w-[40rem] flex-1 flex-col gap-10 px-5 py-14 sm:px-10">
        <div>
          <h1 className="text-[2rem] leading-[1.1] font-medium tracking-[-0.03em] sm:text-[2.5rem]">
            {key ? "Your workspace is ready." : t ? "Your key was already shown." : offer.enabled ? "Start with one real deal." : "Try 3xrep on one deal."}
          </h1>
          {!key && !t ? <p className="text-mute mt-5 max-w-[48ch] text-[1.125rem] leading-[1.5]">Enter your work email. We’ll create a workspace and show your private connection key on the next page. No card needed now.</p> : null}
        </div>
        {key ? (
          <>
            {org?.beta_access_until ? <p className="text-mute leading-relaxed">Your beta workspace is ready. Full access, no card required, through {new Date(org.beta_access_until).toLocaleDateString("en-US",{dateStyle:"long",timeZone:"UTC"})}. Ask your assistant for your workspace status whenever you need it.</p> : null}
            <KeyPanel keyPlain={key} referralCode={offer.enabled ? null : org?.referral_code} />
          </>
        ) : t ? (
          <p className="text-mute leading-[1.5]">This link cannot show your key again. Use the key saved in your connector. If you lost it, contact the person who invited you. <Link className="underline underline-offset-4" href="/install">See the connection guide</Link>.</p>
        ) : (
          <>
            <form action="/api/orgs/start" method="post" className="flex flex-col gap-5">
              {utm_source ? <input type="hidden" name="utm_source" value={utm_source.slice(0,100)} /> : null}
              {utm_medium ? <input type="hidden" name="utm_medium" value={utm_medium.slice(0,100)} /> : null}
              {utm_campaign ? <input type="hidden" name="utm_campaign" value={utm_campaign.slice(0,100)} /> : null}
              {ref ? <input type="hidden" name="ref" value={ref} /> : null}
              <label className="flex flex-col gap-2 text-[0.9375rem]">
                Work email
                <input
                  type="email"
                  name="email"
                  required
                  className="rounded-lg border border-line bg-raise px-3 py-2.5"
                  autoComplete="email"
                />
              </label>
              <p className="text-mute max-w-[52ch] text-[0.875rem] leading-[1.6]">{offer.enabled ? (offer.available ? "Full access during beta. No card required. If selected after real use, your team keeps the base plan free forever. A signup does not reserve a place." : "Full access during beta. No card required. All 20 free-forever places have been allocated.") : `Your 14 days start with your first deal review. After day 7, a card is needed to continue. The standard plan is $${LIST_PRICE_USD}/month. The payment page shows when billing begins; adding a card in the last 48 hours may start billing immediately. Without a card, access pauses and there is no charge.`}</p>
              <button
                type="submit"
                className="w-fit cursor-pointer rounded-lg bg-fg px-5 py-3 text-[0.9375rem] font-medium text-bg hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground"
              >
                Get my key
              </button>
            </form>
            <section className="border-t border-line pt-7">
              <h2 className="text-[1.125rem] font-medium">What happens next?</h2>
              <p className="text-mute mt-3 leading-[1.6]">Copy your key, add 3xrep in Claude, then ask about a deal. Your CRM can provide the context, or you can start with notes you bring to the chat. <Link className="underline underline-offset-4" href="/install">Connection guide</Link>.</p>
            </section>
            <p className="text-dim text-[0.8125rem] leading-[1.5]">{offer.enabled ? (offer.available ? "We select up to 20 teams after meaningful use. Signing up does not reserve a place." : "All 20 free-forever places have been allocated. You can still join the beta.") : "We are still looking for 20 beta teams, but beta enrollment is not open yet. This standard trial does not reserve a place."}</p>
          </>
        )}
      </main>
    </>
  );
}
