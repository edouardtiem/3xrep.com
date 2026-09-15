import type { ReactNode } from "react";
import Link from "next/link";
import { CheckoutButton } from "@/components/CheckoutButton";
import { CopyButton } from "@/components/CopyButton";
import { Header } from "@/components/Header";
import { JsonLd } from "@/components/JsonLd";
import { TRUST_LINE } from "@/lib/copy";
import { CRM_CONNECTORS, breadcrumbJsonLd, pageMeta } from "@/lib/docs";
import { LIST_PRICE_USD } from "@/lib/stripe-checkout-session";
import { mcpUrl } from "@/lib/site";

export const metadata = pageMeta({
  title: "Install 3xrep",
  description:
    "Add him in Claude or ChatGPT, next to HubSpot. 14 days free, then $" +
    LIST_PRICE_USD +
    " a month for the whole company. We don't join your calls.",
  path: "/install",
});

function Snippet({ label, text }: { label: string; text: string }) {
  return (
    <div className="rounded-lg border border-line bg-raise">
      <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-2">
        <span className="text-dim text-[0.75rem]">{label}</span>
        <CopyButton text={text} />
      </div>
      <pre className="overflow-x-auto px-4 py-3 font-mono text-[0.8125rem] leading-relaxed whitespace-pre-wrap">
        {text}
      </pre>
    </div>
  );
}

function Fold({ title, children }: { title: string; children: ReactNode }) {
  return (
    <details className="border-b border-line">
      <summary className="cursor-pointer py-4">{title}</summary>
      <div className="text-mute pb-6 leading-[1.5]">{children}</div>
    </details>
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
    name: "Add 3xrep next to HubSpot",
    description:
      "Add 3xrep in Claude or ChatGPT, connect HubSpot beside it, then ask what's stuck this week.",
    step: [
      {
        "@type": "HowToStep",
        name: "Start 14 days free",
        text: "Get your key. No card today.",
      },
      {
        "@type": "HowToStep",
        name: "Add him in Claude",
        text: `Settings → Connectors → Add custom connector. Paste ${url} and your key.`,
      },
      {
        "@type": "HowToStep",
        name: "Connect HubSpot beside it",
        text: "Add HubSpot or Salesforce next to 3xrep. He needs both.",
      },
      {
        "@type": "HowToStep",
        name: "Monday",
        text: "Say: Monday. What's stuck this week?",
      },
    ],
  };

  return (
    <>
      <Header />
      <JsonLd data={breadcrumbJsonLd([{ name: "Install", path: "/install" }])} />
      <JsonLd data={howTo} />
      <main className="mx-auto flex w-full max-w-[40rem] flex-1 flex-col gap-16 px-5 py-16 sm:px-10">
        <div>
          <h1 className="text-[2rem] leading-[1.1] font-medium tracking-[-0.03em] sm:text-[2.5rem]">
            Add him next to HubSpot.
          </h1>
          <p className="text-mute mt-6 max-w-[40ch] text-[1.125rem] leading-[1.5]">
            You already have a key from start. Claude first. HubSpot beside
            it. Nothing to install inside HubSpot.
          </p>
          <p className="mt-8">
            <Link
              href="/start"
              className="inline-block cursor-pointer rounded-lg bg-fg px-5 py-3 text-[0.9375rem] font-medium text-bg hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground"
            >
              Start 14 days free
            </Link>
          </p>
        </div>

        <section className="space-y-5">
          <h2 className="text-[1.35rem] leading-[1.25] tracking-[-0.02em] sm:text-[1.75rem]">
            The address
          </h2>
          <p className="text-mute leading-[1.5]">
            Same everywhere. It needs your key.
          </p>
          <Snippet label="Address" text={url} />
        </section>

        <section>
          <h2 className="text-[1.35rem] leading-[1.25] tracking-[-0.02em] sm:text-[1.75rem]">
            Claude or ChatGPT
          </h2>
          <p className="text-mute mt-5 leading-[1.5]">
            Settings → Connectors → Add custom connector. Paste the address
            and the key.
          </p>
          <div className="mt-8 border-t border-line">
            <Fold title="Cursor">
              <p>
                Settings → MCP, or paste this in{" "}
                <span className="text-foreground">.cursor/mcp.json</span>. Next
                to HubSpot, not instead of it.
              </p>
              <div className="mt-4">
                <Snippet label="mcp.json" text={mcpJson} />
              </div>
            </Fold>
            <Fold title="Claude Code">
              <p>Run the command, or add the same file as .mcp.json.</p>
              <div className="mt-4">
                <Snippet label="Claude Code" text={claudeAdd} />
              </div>
            </Fold>
          </div>
        </section>

        <section className="space-y-5">
          <h2 className="text-[1.35rem] leading-[1.25] tracking-[-0.02em] sm:text-[1.75rem]">
            HubSpot beside it
          </h2>
          <p className="text-mute leading-[1.5]">
            They ship the connector. You add it beside 3xrep. Each person
            signs in as themselves.
          </p>
          <ul className="divide-y divide-line border-y border-line">
            {CRM_CONNECTORS.map((crm) => (
              <li
                key={crm.name}
                className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 py-4"
              >
                <span>{crm.name}</span>
                <span className="text-dim text-[0.8125rem]">
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
        </section>

        <section className="space-y-5">
          <h2 className="text-[1.35rem] leading-[1.25] tracking-[-0.02em] sm:text-[1.75rem]">
            Then say
          </h2>
          <p className="text-[1.125rem] leading-[1.5]">
            Monday. What&apos;s stuck this week?
          </p>
        </section>

        <section className="space-y-5 border-t border-line pt-16">
          <p className="text-[1.35rem] leading-[1.25] tracking-[-0.02em] sm:text-[1.75rem]">
            ${LIST_PRICE_USD} a month for the whole company.
          </p>
          <p className="text-mute leading-[1.5]">
            After the trial. Gong is about $1,250 a month for a team of ten.
          </p>
          <p className="text-dim text-[0.8125rem] leading-relaxed">{TRUST_LINE}</p>
          <CheckoutButton
            label={`Pay $${LIST_PRICE_USD} a month`}
            className="cursor-pointer rounded-lg bg-fg px-5 py-3 text-[0.9375rem] font-medium text-bg hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground"
          />
        </section>
      </main>
    </>
  );
}
