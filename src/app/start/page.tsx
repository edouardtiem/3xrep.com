import { publicBetaOffer } from "@/lib/founding";
import Link from "next/link";
import { referralStartUrl } from "@/lib/checkout-token";
import { CopyButton } from "@/components/CopyButton";
import { Header } from "@/components/Header";
import { pageMeta } from "@/lib/docs";
import { agentSetupPrompt } from "@/lib/landing";
import { LOCAL_ONBOARDING_PROMPT } from "@/lib/onboarding";
import { orgById, revealStartKey } from "@/lib/orgs";
import { mcpClientJson, mcpUrl, mcpUrlWithKey } from "@/lib/site";
import { LIST_PRICE_USD } from "@/lib/stripe-checkout-session";
import { admin } from "@/lib/supabase-admin";

export const dynamic = "force-dynamic";

export const metadata = pageMeta({
  title: "Join the 3xrep Beta",
  description: "Use 3xrep on real deals during the Beta. We select up to 20 teams for a free-forever base plan after real use.",
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
        <h2 id="connect-title" className="text-[1.5rem] leading-tight font-medium tracking-[-0.02em]">Connect 3xrep on your computer.</h2>
        <p className="text-mute mt-3 leading-[1.5]">In Claude Desktop, open Connectors → Add custom connector. Paste the private address you copy below. ChatGPT Work desktop setup is in the <Link className="underline underline-offset-4" href="/install">connection guide</Link>.</p>
        <div className="mt-5 flex items-center justify-between gap-4 rounded-lg border border-line bg-raise px-4 py-3 text-sm">
          <code className="truncate">{url}</code>
          <CopyButton text={withKey} label="Copy private address" />
        </div>
        <p className="text-dim mt-2 text-[0.8125rem] leading-[1.5]">The copied address includes your key. Keep it private.</p>
        <p className="text-mute mt-5 leading-[1.5]">You will add your CRM, email and calendar after the short introduction.</p>
      </section>

      <section aria-labelledby="first-question-title">
        <h2 id="first-question-title" className="text-[1.5rem] leading-tight font-medium tracking-[-0.02em]">Start the introduction.</h2>
        <p className="text-mute mt-3 leading-[1.5]">Open a local task in Claude Cowork or ChatGPT Work desktop. Choose a folder on this computer if the app asks for one. Enable 3xrep and send the text below. Your assistant will ask who you are, what you sell, and confirm where to keep your notes before you begin with a deal.</p>
        <p className="mt-4 rounded-lg bg-raise px-5 py-4 leading-[1.5]">“{LOCAL_ONBOARDING_PROMPT}”</p>
        <div className="mt-3"><CopyButton text={LOCAL_ONBOARDING_PROMPT} label="Copy first message" /></div>
      </section>

      <details className="border-t border-line pt-6">
        <summary className="cursor-pointer text-[1rem] leading-[1.5]">Using ChatGPT Work or Cursor?</summary>
        <div className="text-mute mt-5 space-y-5 leading-[1.5]">
          <p><strong className="text-fg font-medium">ChatGPT Work desktop:</strong> your workspace may allow a personal MCP connection through Plugins in developer mode. The full 3xrep setup still needs a real platform test. <Link className="underline underline-offset-4" href="/install">Read the current setup notes</Link>.</p>
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
  const enrollmentOpen = offer.enabled && offer.available;
  const orgId = t ? await orgIdFromStartToken(t) : null;
  const key = t ? await revealStartKey(t) : null;
  const org = orgId ? await orgById(orgId) : null;

  return (
    <>
      <Header />
      <main className="mx-auto flex w-full max-w-[40rem] flex-1 flex-col gap-10 px-5 py-14 sm:px-10">
        <div>
          <h1 className="text-[2rem] leading-[1.1] font-medium tracking-[-0.03em] sm:text-[2.5rem]">
            {key ? "Your workspace is ready." : t ? "Your key was already shown." : enrollmentOpen ? "Join the Beta. Start with one deal." : "Beta enrollment is closed."}
          </h1>
          {!key && !t ? <p className="text-mute mt-5 max-w-[48ch] text-[1.125rem] leading-[1.5]">{enrollmentOpen ? "Enter your work email. We’ll show your private connection key on the next page. Beta access is free, with no card." : "We’re not creating new workspaces right now. You can still read how the Beta works."}</p> : null}
        </div>
        {key ? (
          <>
            {org?.beta_access_until ? <p className="text-mute leading-relaxed">Your beta workspace is ready. Full access, no card required, through {new Date(org.beta_access_until).toLocaleDateString("en-US",{dateStyle:"long",timeZone:"UTC"})}. Ask your assistant for your workspace status whenever you need it.</p> : null}
            <KeyPanel keyPlain={key} referralCode={org?.beta_enrolled_at ? null : org?.referral_code} />
          </>
        ) : t ? (
          <p className="text-mute leading-[1.5]">This link cannot show your key again. Use the key saved in your connector. If you lost it, contact the person who invited you. <Link className="underline underline-offset-4" href="/install">See the connection guide</Link>.</p>
        ) : enrollmentOpen ? (
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
              <p className="text-mute max-w-[52ch] text-[0.875rem] leading-[1.6]">Full access during Beta, with no card. We select up to 20 teams after real use. Selected teams keep the base plan free forever; signing up does not reserve a place. If you are not selected, you choose whether to continue at ${LIST_PRICE_USD}/month per company, plus tax. No automatic charge.</p>
              <button
                type="submit"
                className="w-fit cursor-pointer rounded-lg bg-fg px-5 py-3 text-[0.9375rem] font-medium text-bg hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground"
              >
                Get my beta key
              </button>
            </form>
            <section className="border-t border-line pt-7">
              <h2 className="text-[1.125rem] font-medium">What happens next?</h2>
            <p className="text-mute mt-3 leading-[1.6]">Copy your key and add 3xrep on your computer. Start the guided introduction, choose a local folder for your working notes, then connect your CRM, email and calendar. <Link className="underline underline-offset-4" href="/install">Connection guide</Link>.</p>
            </section>
            <p className="text-dim text-[0.8125rem] leading-[1.5]">We’ll show your Beta access deadline when you join. <Link className="underline underline-offset-4" href="/docs/pricing">Read the Beta terms</Link>.</p>
          </>
        ) : (
          <p className="text-mute leading-[1.6]"><Link className="underline underline-offset-4" href="/docs/pricing">Read the Beta terms</Link>.</p>
        )}
      </main>
    </>
  );
}
