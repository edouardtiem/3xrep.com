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
  description: `14 days free. Then $${LIST_PRICE_USD}/month for the entire organization. No card today. The connector needs your key.`,
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
    <>
      <p className="text-sm text-mute">Shown once. Paste the JSON into your agent. Needs the key.</p>
      <div className="flex items-center justify-between gap-4 rounded-[10px] border border-line bg-raise px-4 py-3 font-mono text-sm">
        <span className="truncate">{keyPlain}</span>
        <CopyButton text={keyPlain} />
      </div>
      <pre className="overflow-x-auto rounded-[10px] border border-line bg-raise p-4 font-mono text-xs">
        {mcpJson}
      </pre>
      <CopyButton text={mcpJson} />
      <p className="text-dim text-xs">
        Clients that cannot send a header: use {withKey}
      </p>
      <div className="mt-4">
        <CopyButton tone="loud" label="Copy the agent prompt" text={spec} />
      </div>
      {ref ? (
        <p className="text-dim mt-4 text-sm">
          Refer a team: {ref} — you get ${LIST_PRICE_USD} credit when they pay.
        </p>
      ) : null}
    </>
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
      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-8 px-6 py-16">
        <h1 className="text-3xl font-medium tracking-tight">14 days free</h1>
        {key ? (
          <KeyPanel keyPlain={key} referralCode={org?.referral_code} />
        ) : t ? (
          <p className="text-mute">
            Key already shown. Add a card from a verdict, or pay ${LIST_PRICE_USD} / month from{" "}
            <a href="/install" className="underline">
              install
            </a>
            .
          </p>
        ) : (
          <>
            <p className="text-mute leading-relaxed">
              Work email. No card today. The VP starts when you judge a deal. Day 7: add a
              card (still $0 until day 14). Then ${LIST_PRICE_USD}/month for the organization.
            </p>
            <form action="/api/orgs/start" method="post" className="flex flex-col gap-4">
              {ref ? <input type="hidden" name="ref" value={ref} /> : null}
              <label className="flex flex-col gap-2 text-sm">
                Work email
                <input
                  type="email"
                  name="email"
                  required
                  className="border border-line bg-raise px-3 py-2 font-mono"
                  autoComplete="email"
                />
              </label>
              <button
                type="submit"
                className="cursor-pointer border border-line bg-fg px-4 py-2.5 text-bg hover:opacity-90"
              >
                Start 14 days free
              </button>
            </form>
          </>
        )}
      </main>
    </>
  );
}
