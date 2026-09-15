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
  title: "Start 14 days free",
  description: `14 days free. Then $${LIST_PRICE_USD} a month for the whole company. No card today.`,
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
    <div className="flex flex-col gap-16">
      <div>
        <p className="text-[1.35rem] leading-[1.25] tracking-[-0.02em] sm:text-[1.75rem]">
          Your key. Shown once.
        </p>
        <p className="text-mute mt-4 leading-[1.5]">
          Add him in Claude, next to HubSpot. Then ask what&apos;s stuck this
          week.
        </p>
        <div className="mt-6 flex items-center justify-between gap-4 rounded-lg border border-line bg-raise px-4 py-3 font-mono text-sm">
          <span className="truncate">{keyPlain}</span>
          <CopyButton text={keyPlain} />
        </div>
      </div>

      <div>
        <p className="text-[1.35rem] leading-[1.25] tracking-[-0.02em] sm:text-[1.75rem]">
          Claude
        </p>
        <p className="text-mute mt-4 leading-[1.5]">
          Settings → Connectors → Add custom connector. Paste this address and
          your key.
        </p>
        <p className="mt-4 font-mono text-sm break-all">{url}</p>
      </div>

      <div>
        <p className="text-[1.35rem] leading-[1.25] tracking-[-0.02em] sm:text-[1.75rem]">
          ChatGPT
        </p>
        <p className="text-mute mt-4 leading-[1.5]">
          Settings → Connectors → Add custom connector. Same address, same key.
        </p>
      </div>

      <p className="text-mute leading-[1.5]">
        Then connect HubSpot (or Salesforce) next to 3xrep. He needs both.
      </p>

      <div>
        <p className="text-[1.35rem] leading-[1.25] tracking-[-0.02em] sm:text-[1.75rem]">
          Monday
        </p>
        <p className="text-mute mt-4 leading-[1.5]">
          In Claude, say: Monday. What&apos;s stuck this week?
        </p>
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
            If the client cannot send a header, use {withKey}
          </p>
          <CopyButton tone="loud" label="Copy the setup text" text={spec} />
        </div>
      </details>

      {ref ? (
        <p className="text-dim text-[0.8125rem]">
          Refer a team: {ref} — you get ${LIST_PRICE_USD} credit when they pay.
        </p>
      ) : null}
    </div>
  );
}

export default async function Start({
  searchParams,
}: {
  searchParams: Promise<{ t?: string; ref?: string }>;
}) {
  const { t, ref } = await searchParams;
  const orgId = t ? await orgIdFromStartToken(t) : null;
  const key = t ? await revealStartKey(t) : null;
  const org = orgId ? await orgById(orgId) : null;

  return (
    <>
      <Header />
      <main className="mx-auto flex w-full max-w-[40rem] flex-1 flex-col gap-12 px-5 py-16 sm:px-10">
        <div>
          <h1 className="text-[2rem] leading-[1.1] font-medium tracking-[-0.03em] sm:text-[2.5rem]">
            Start 14 days free
          </h1>
          {key ? null : (
            <p className="text-mute mt-6 max-w-[40ch] text-[1.125rem] leading-[1.5]">
              He lives in Claude, next to HubSpot. Not inside HubSpot.
            </p>
          )}
        </div>
        {key ? (
          <KeyPanel keyPlain={key} referralCode={org?.referral_code} />
        ) : t ? (
          <p className="text-mute leading-[1.5]">
            Key already shown. Add a card from a verdict, or pay $
            {LIST_PRICE_USD} a month from{" "}
            <a
              href="/install"
              className="underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground"
            >
              install
            </a>
            .
          </p>
        ) : (
          <>
            <ol className="text-mute max-w-[40ch] space-y-5 text-[1.125rem] leading-[1.5]">
              <li>Add him in Claude or ChatGPT.</li>
              <li>Monday, ask what&apos;s stuck.</li>
              <li>The 14 days start when you review a deal.</li>
            </ol>
            <form action="/api/orgs/start" method="post" className="flex flex-col gap-6">
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
              <button
                type="submit"
                className="w-fit cursor-pointer rounded-lg bg-fg px-5 py-3 text-[0.9375rem] font-medium text-bg hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground"
              >
                Start 14 days free
              </button>
            </form>
            <p className="text-dim max-w-[40ch] text-[0.8125rem] leading-[1.4]">
              No card today. Day 7: add a card (still $0 until day 14). Then $
              {LIST_PRICE_USD} a month for the whole company.
            </p>
          </>
        )}
      </main>
    </>
  );
}
