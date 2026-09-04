import { CopyButton } from "@/components/CopyButton";
import { Header } from "@/components/Header";
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
        <h1 className="text-3xl font-medium tracking-tight">Install</h1>
        <p className="text-mute">
          The workspace admin adds 3xrep once. Each person then Connects with their own CRM
          account — they only see their deals.
        </p>

        <section className="flex flex-col gap-3">
          <h2 className="text-lg">URL</h2>
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
            <h2 className="mb-2 text-lg">ChatGPT Business</h2>
            <p className="text-mute">
              Admin publishes the 3xrep MCP app on the workspace, plus the CRM. Individual auth.
              Same spec on the shared GPT.
            </p>
          </div>
          <div>
            <h2 className="mb-2 text-lg">Notion Custom Agents</h2>
            <p className="text-mute">
              Admin authorizes the 3xrep MCP, pastes the spec on the shared agent. Auth if the
              server asks.
            </p>
          </div>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-lg">Three prompts</h2>
          <ol className="list-decimal space-y-3 pl-5 text-sm text-mute">
            <li>Map this sentence: “anyway I&apos;m the one who runs the tool.”</li>
            <li>What is MEDDIC Economic Buyer, and which other grid names the same box?</li>
            <li>Debrief the call with Julien — notes, transcript, next step are on the record.</li>
          </ol>
        </section>
      </main>
    </>
  );
}
