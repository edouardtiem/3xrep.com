import { CheckoutButton } from "@/components/CheckoutButton";
import { CopyButton } from "@/components/CopyButton";
import { Header } from "@/components/Header";
import { PROMPTS } from "@/lib/landing";
import { mcpUrl } from "@/lib/site";

export default function Install() {
  const url = mcpUrl();
  const mcpJson = JSON.stringify(
    {
      mcpServers: {
        "3xrep": { url },
      },
    },
    null,
    2,
  );

  return (
    <>
      <Header />
      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-12 px-6 py-16">
        <div className="flex flex-col gap-3">
          <h1 className="text-3xl font-medium tracking-tight">Connect, then pay.</h1>
          <p className="text-mute">
            The workspace admin adds 3xrep once. Each person then Connects with their own CRM
            account — they only see their deals. The tools are open. 99 € / month is for the
            organization that wants the VP on its pipe every Monday.
          </p>
        </div>

        <section className="flex flex-col gap-3">
          <h2 className="text-lg">1. Connector URL</h2>
          <div className="flex items-center justify-between gap-4 rounded-[10px] border border-line bg-raise px-4 py-3 font-mono text-sm">
            <span className="truncate">{url}</span>
            <CopyButton text={url} />
          </div>
          <pre className="overflow-x-auto rounded-[10px] border border-line bg-raise p-4 font-mono text-xs">
            {mcpJson}
          </pre>
        </section>

        <section className="flex flex-col gap-6 text-sm leading-relaxed">
          <div>
            <h2 className="mb-2 text-lg">Claude Code / Cursor / Codex</h2>
            <p className="text-mute">
              Paste the JSON above in your MCP config, next to your HubSpot, Salesforce, or Notion
              MCP. The spec travels with the connector.
            </p>
          </div>
          <div>
            <h2 className="mb-2 text-lg">Claude Team / Cowork</h2>
            <p className="text-mute">
              Owner: Settings → Connectors → Add custom connector. Paste the URL. Enable the CRM
              connector. Each user: Connect (OAuth in their name). Paste the{" "}
              <a className="text-fg underline-offset-2 hover:underline" href="/spec">
                spec
              </a>{" "}
              in the shared Project.
            </p>
          </div>
          <div>
            <h2 className="mb-2 text-lg">ChatGPT Business · Notion Custom Agents</h2>
            <p className="text-mute">
              Admin publishes the 3xrep MCP on the workspace, plus the CRM. Individual auth. Same
              spec on the shared agent.
            </p>
          </div>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-lg">First prompts</h2>
          <ol className="list-decimal space-y-3 pl-5 text-sm text-mute">
            {PROMPTS.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ol>
        </section>

        <section className="flex flex-col gap-4 border-t border-line pt-10">
          <h2 className="text-lg">2. Pay 99 € / month / organization</h2>
          <p className="text-sm text-mute">
            Stripe subscription, one organization, no seats. After payment:{" "}
            <span className="font-mono">/merci</span> and a key for your org. Gong is ~$1,500 a
            seat. We don&apos;t record. We don&apos;t store.
          </p>
          <CheckoutButton label="Pay 99 € / month / org" />
        </section>
      </main>
    </>
  );
}
