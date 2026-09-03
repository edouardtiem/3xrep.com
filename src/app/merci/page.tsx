import { CopyButton } from "@/components/CopyButton";
import { Header } from "@/components/Header";
import { ensureOrgFromCheckout } from "@/lib/checkout-complete";
import { revealKey } from "@/lib/orgs";
import { mcpUrl } from "@/lib/site";

async function keyForSession(sessionId: string): Promise<string | null> {
  const first = await revealKey(sessionId);
  if (first) return first;
  try {
    await ensureOrgFromCheckout(sessionId);
  } catch {
    return null;
  }
  return revealKey(sessionId);
}

export default async function Merci({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id: sessionId } = await searchParams;
  const key = sessionId ? await keyForSession(sessionId) : null;
  const url = mcpUrl();
  const mcpJson = key
    ? JSON.stringify(
        {
          mcpServers: {
            "3xrep": {
              url,
              headers: { Authorization: `Bearer ${key}` },
            },
          },
        },
        null,
        2,
      )
    : null;

  return (
    <>
      <Header />
      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-8 px-6 py-16">
        <h1 className="text-3xl font-medium tracking-tight">Key</h1>
        {key && mcpJson ? (
          <>
            <p className="text-sm text-mute">Shown once. Tools don&apos;t require a key.</p>
            <div className="flex items-center justify-between gap-4 rounded-[10px] border border-line bg-raise px-4 py-3 font-mono text-sm">
              <span className="truncate">{key}</span>
              <CopyButton text={key} />
            </div>
            <pre className="overflow-x-auto rounded-[10px] border border-line bg-raise p-4 font-mono text-xs">
              {mcpJson}
            </pre>
            <CopyButton text={mcpJson} />
          </>
        ) : (
          <p className="text-mute">
            Key already revealed, unknown session, or Stripe / Supabase not wired yet.
          </p>
        )}
      </main>
    </>
  );
}
