import type { ReactNode } from "react";
import Link from "next/link";
import { CheckoutButton } from "@/components/CheckoutButton";
import { CopyButton } from "@/components/CopyButton";
import { Header } from "@/components/Header";
import { JsonLd } from "@/components/JsonLd";
import { TRUST_LINE } from "@/lib/copy";
import { CRM_CONNECTORS, breadcrumbJsonLd, pageMeta } from "@/lib/docs";
import { PROMPTS } from "@/lib/landing";
import { LIST_PRICE_USD } from "@/lib/stripe-checkout-session";
import { mcpUrl } from "@/lib/site";

export const metadata = pageMeta({
  title: "Install the 3xrep MCP",
  description:
    "Add the 3xrep MCP to Claude, Cursor, or ChatGPT, then connect HubSpot, Salesforce, Pipedrive, Attio, or Notion with their official docs. From $" +
    LIST_PRICE_USD +
    "/month for the organization.",
  path: "/install",
});

function Snippet({ label, text }: { label: string; text: string }) {
  return (
    <div className="rounded-[4px] border border-line">
      <div className="flex items-center justify-between gap-3 border-b border-line px-3 py-2">
        <span className="text-dim text-xs tracking-wide uppercase">{label}</span>
        <CopyButton text={text} />
      </div>
      <pre className="overflow-x-auto px-3 py-3 text-[0.8125rem] leading-relaxed whitespace-pre-wrap">
        {text}
      </pre>
    </div>
  );
}

function Fold({ title, children }: { title: string; children: ReactNode }) {
  return (
    <details className="border-b border-line">
      <summary className="cursor-pointer py-2.5">{title}</summary>
      <div className="text-dim pb-3 leading-relaxed">{children}</div>
    </details>
  );
}

function Pay() {
  return (
    <section id="pay" className="flex flex-col gap-4">
      <p className="text-dim text-xs tracking-wide uppercase">Already in?</p>
      <p>
        From ${LIST_PRICE_USD} / month / organization. Local currency and
        language at checkout.
      </p>
      <p className="text-dim leading-relaxed">
        Gong is ~$1,500 a seat and records your calls. Here it&apos;s $
        {LIST_PRICE_USD} for the whole pipe, no seats. {TRUST_LINE}
      </p>
      <CheckoutButton label={`Pay $${LIST_PRICE_USD} / month / org`} />
    </section>
  );
}

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
  const claudeAdd = `claude mcp add --transport http 3xrep ${url}`;

  const howTo = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "Install the 3xrep MCP and connect a CRM",
    description:
      "Add 3xrep to your agent, connect your CRM with the vendor's official MCP, then run a pipe review.",
    step: [
      {
        "@type": "HowToStep",
        name: "Add the 3xrep connector",
        text: `Paste ${url} as a custom MCP connector in Claude, Cursor, Codex, ChatGPT, or Notion.`,
      },
      {
        "@type": "HowToStep",
        name: "Connect your CRM",
        text: "Add your CRM's official MCP next to 3xrep. Follow HubSpot, Salesforce, Pipedrive, Attio, Notion, or Close docs. Each person connects with their own account.",
      },
      {
        "@type": "HowToStep",
        name: "Run it on the pipe",
        text: PROMPTS[0],
      },
    ],
  };

  return (
    <>
      <Header />
      <JsonLd data={breadcrumbJsonLd([{ name: "Install", path: "/install" }])} />
      <JsonLd data={howTo} />
      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-12 px-6 py-16 leading-relaxed">
        <div>
          <h1 className="text-[1.75rem] leading-[1.2] tracking-tight sm:text-[2rem]">
            Add him next to your CRM.
          </h1>
          <p className="text-mute mt-4 max-w-[36rem]">
            One URL in the agent you already use. Their HubSpot or Salesforce
            connector beside it — not inside it. Nothing to install in HubSpot.
            No 3xrep tab. The tools are open. ${LIST_PRICE_USD} / month is for
            the organization that wants the VP on its pipe every Monday.
          </p>
        </div>

        <Pay />

        <section className="flex flex-col gap-4">
          <h2 className="text-lg">1. The URL</h2>
          <p className="text-dim">
            Same address everywhere. The{" "}
            <Link href="/spec" className="text-foreground hover:underline">
              spec
            </Link>{" "}
            travels with it.
          </p>
          <Snippet label="Connector URL" text={url} />
          <div className="border-t border-line">
            <Fold title="Cursor / Codex">
              <p>
                Settings → MCP, or paste the JSON in{" "}
                <span className="text-foreground">.cursor/mcp.json</span>.{" "}
                <a
                  href="https://cursor.com/docs/mcp"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground hover:underline"
                >
                  Cursor docs
                </a>
                . Next to your CRM connector, not instead of it.
              </p>
              <div className="mt-3">
                <Snippet label="mcp.json" text={mcpJson} />
              </div>
            </Fold>
            <Fold title="Claude Code">
              <p>
                Run the command, or add the same JSON to{" "}
                <span className="text-foreground">.mcp.json</span>.
              </p>
              <div className="mt-3">
                <Snippet label="Claude Code" text={claudeAdd} />
              </div>
            </Fold>
            <Fold title="Claude Team / Cowork">
              Owner: Settings → Connectors → Add custom connector. Paste the
              URL. Enable the CRM connector. Each person Connects with their
              own account. Paste the spec in the shared Project.
            </Fold>
            <Fold title="ChatGPT · Notion Custom Agents">
              Admin publishes 3xrep on the workspace, plus the CRM. Each
              person signs in as themselves. Same spec on the shared agent.
            </Fold>
          </div>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="text-lg">2. Your CRM beside it</h2>
          <p className="text-dim">
            They ship the connector. You add it beside 3xrep. Each person
            signs in as themselves — they only see their deals. Without a CRM,
            paste the notes in the chat: he still judges, the fields are
            missing.
          </p>
          <ul className="divide-y divide-line border-y border-line">
            {CRM_CONNECTORS.map((crm) => (
              <li
                key={crm.name}
                className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 py-2.5"
              >
                <span>{crm.name}</span>
                <span className="text-dim">
                  {crm.docs.map((doc, i) => (
                    <span key={doc.href}>
                      {i > 0 ? " · " : null}
                      <a
                        href={doc.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-foreground hover:underline"
                      >
                        {doc.label}
                      </a>
                    </span>
                  ))}
                </span>
              </li>
            ))}
          </ul>
          <p className="text-dim">
            Another CRM with an official connector works the same way.{" "}
            <Link href="/docs/how-it-works" className="text-foreground hover:underline">
              How it works
            </Link>
            .
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-lg">3. Then say</h2>
          <ul className="divide-y divide-line border-y border-line">
            {PROMPTS.map((prompt, i) => (
              <li key={prompt} className="flex items-baseline gap-3 py-2.5">
                <span className="text-dim w-5 shrink-0 text-xs">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="min-w-0 flex-1 leading-snug">{prompt}</p>
                <CopyButton text={prompt} />
              </li>
            ))}
          </ul>
          <p className="text-dim">
            More Monday pipe, debrief, follow-up:{" "}
            <Link href="/docs/use-cases" className="text-foreground hover:underline">
              use cases
            </Link>
            .
          </p>
        </section>

        <section className="flex flex-col gap-4 border-t border-line pt-10">
          <p className="text-dim">That&apos;s the setup. Pay for the org.</p>
          <CheckoutButton label={`Pay $${LIST_PRICE_USD} / month / org`} />
        </section>
      </main>
    </>
  );
}
