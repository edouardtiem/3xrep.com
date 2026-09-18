import { LIST_PRICE_USD } from "@/lib/stripe-checkout-session";
import { publicBetaOffer } from "@/lib/founding";
import type { ReactNode } from "react";
import Link from "next/link";
export const dynamic = "force-dynamic";
import { CopyButton } from "@/components/CopyButton";
import { Header } from "@/components/Header";
import { JsonLd } from "@/components/JsonLd";
import { TRUST_LINE } from "@/lib/copy";
import { CRM_CONNECTORS, breadcrumbJsonLd, pageMeta } from "@/lib/docs";

import { mcpUrl } from "@/lib/site";

export const metadata = pageMeta({
  title: "Install 3xrep",
  description:
    "Add 3xrep in Claude or ChatGPT, next to your CRM. Start without a credit card. We don't join your calls.",
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

export default async function Install() {
  const offer = await publicBetaOffer();
  const cta = offer.enabled ? "Join the beta" : "Start 14 days free";
  const url = mcpUrl();
  const mcpJson = JSON.stringify(
    {
      mcpServers: {
        "3xrep": { url, headers: { Authorization: "Bearer YOUR_KEY" } },
      },
    },
    null,
    2,
  );
  const claudeAdd = `claude mcp add --transport http 3xrep ${url} --header "Authorization: Bearer YOUR_KEY"`;

  const howTo = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "Add 3xrep next to HubSpot",
    description:
      "Add 3xrep in Claude or ChatGPT, connect HubSpot, Gmail, and Calendar beside it, then ask what today is.",
    step: [
      {
        "@type": "HowToStep",
        name: cta,
        text: "Get your key. No card today.",
      },
      {
        "@type": "HowToStep",
        name: "Add him in Claude",
        text: `Settings → Connectors → Add custom connector. Use ${url}?key=YOUR_KEY as the URL.`,
      },
      {
        "@type": "HowToStep",
        name: "Connect HubSpot beside it",
        text: "Add HubSpot or Salesforce next to 3xrep. He needs the CRM.",
      },
      {
        "@type": "HowToStep",
        name: "Gmail and Calendar",
        text: "In Claude, connect Gmail and Google Calendar. Then Slack, Notion, a notetaker if you can.",
      },
      {
        "@type": "HowToStep",
        name: "Morning",
        text: "Say: Morning. What's today?",
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
            Use the key from start. Choose your assistant below, then connect
            your CRM, Gmail and Calendar there. Nothing to install inside HubSpot.
          </p>
          <p className="mt-8">
            <Link
              href="/start"
              className="inline-block cursor-pointer rounded-lg bg-fg px-5 py-3 text-[0.9375rem] font-medium text-bg hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground"
            >
              {cta}
            </Link>
          </p>
        </div>

        <section className="space-y-5">
          <h2 className="text-[1.35rem] leading-[1.25] tracking-[-0.02em] sm:text-[1.75rem]">
            The address
          </h2>
          <p className="text-mute leading-[1.5]">
            Use your private key from start. Keep the complete address private.
          </p>
          <Snippet label="Private connector address" text={`${url}?key=YOUR_KEY`} />
        </section>

        <section>
          <h2 className="text-[1.35rem] leading-[1.25] tracking-[-0.02em] sm:text-[1.75rem]">
            Claude
          </h2>
          <p className="text-mute mt-5 leading-[1.5]">
            Settings → Connectors → Add custom connector. Replace YOUR_KEY
            in the address above with your key. Paste that complete address.
            This connection uses the key in the URL, not an OAuth sign-in.
          </p>
          <div className="mt-8 border-t border-line">
            <Fold title="ChatGPT Work — test connection">
              <p>Enable developer mode in Settings → Security and login. Open Plugins,
                choose +, then add a custom MCP server with your private connector address.
                If the workspace does not offer this option, ask its administrator to enable it.</p>
              <p className="mt-3">This setup still needs validation in a real Work workspace.
                It is not a published OAuth plugin. Before using customer data, check that
                3xrep tools appear and run a fictional deal through audit_deal.</p>
              <a className="mt-3 inline-block underline" href="https://developers.openai.com/plugins/deploy/connect-chatgpt">Official ChatGPT connection guide</a>
            </Fold>
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
            Gmail and Calendar
          </h2>
          <p className="text-mute leading-[1.5]">
            In Claude, connect Gmail and Google Calendar. Then Slack, Notion,
            a notetaker if you can. If a connector is unavailable, we can still examine the CRM sources you provide. An empty inbox is not a connection error.
          </p>
        </section>

        <section className="space-y-5">
          <h2 className="text-[1.35rem] leading-[1.25] tracking-[-0.02em] sm:text-[1.75rem]">
            Then say
          </h2>
          <p className="text-[1.125rem] leading-[1.5]">
            Morning. What&apos;s today?
          </p>
          <p className="text-dim text-[0.8125rem] leading-[1.4]">
            Monday still reviews the list: What&apos;s stuck this week?
          </p>
        </section>

        <section className="space-y-5 border-t border-line pt-16">
          <p className="text-[1.35rem] leading-[1.25] tracking-[-0.02em] sm:text-[1.75rem]">
            {offer.enabled ? "Help shape 3xrep." : `$${LIST_PRICE_USD} a month for the whole company.`}
          </p>
          <p className="text-mute leading-[1.5]">
            {offer.enabled ? "Try it with your real sales work. Tell us what helped and what missed." : "After the trial. One price for the whole company."}
          </p>
          <p className="text-dim text-[0.8125rem] leading-relaxed">{TRUST_LINE}</p>
          <p className="text-mute leading-relaxed">{offer.enabled ? "Full beta access. No credit card required. Founding status is awarded separately after real usage, within the 20-place limit." : "Already connected? Ask 3xrep for your workspace status and use the payment link in your chat."}</p>
        </section>
      </main>
    </>
  );
}
