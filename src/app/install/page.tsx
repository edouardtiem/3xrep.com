import { LIST_PRICE_USD } from "@/lib/stripe-checkout-session";
import { publicBetaOffer } from "@/lib/founding";
import type { ReactNode } from "react";
import Link from "next/link";
export const dynamic = "force-dynamic";
import { CopyButton } from "@/components/CopyButton";
import { Header } from "@/components/Header";
import { JsonLd } from "@/components/JsonLd";
import { CRM_CONNECTORS, breadcrumbJsonLd, pageMeta } from "@/lib/docs";

import { mcpUrl } from "@/lib/site";
import { LOCAL_ONBOARDING_PROMPT } from "@/lib/onboarding";

export const metadata = pageMeta({
  title: "Install 3xrep",
  description:
    "Connect 3xrep on your computer, choose a local folder for your working memory, then add your CRM. No credit card required.",
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
  const enrollmentOpen = offer.enabled && offer.available;
  const cta = enrollmentOpen ? "Get my beta key" : "See Beta status";
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
    name: "Set up 3xrep on your computer",
    description: "Get a private key, add the connector, and start a guided introduction with local working memory.",
    step: [
      {
        "@type": "HowToStep",
        name: cta,
        text: "When Beta enrollment is open, enter your work email and copy the private key shown once. No card is required.",
      },
      {
        "@type": "HowToStep",
        name: "Connect 3xrep in Claude",
        text: `Settings → Connectors → Add custom connector. Use ${url}?key=YOUR_KEY as the URL.`,
      },
      {
        "@type": "HowToStep",
        name: "Set up local working memory",
        text: "Open a local desktop task, ask 3xrep to start onboarding, answer its questions, and authorize a local folder for Markdown notes.",
      },
    ],
  };

  return (
    <>
      <Header />
      <JsonLd data={breadcrumbJsonLd([{ name: "Install", path: "/install" }])} />
      {enrollmentOpen ? <JsonLd data={howTo} /> : null}
      <main className="mx-auto flex w-full max-w-[40rem] flex-1 flex-col gap-12 px-5 py-16 sm:px-10">
        <div>
          <h1 className="text-[2rem] leading-[1.1] font-medium tracking-[-0.03em] sm:text-[2.5rem]">
            Connect 3xrep in your chat.
          </h1>
          <p className="text-mute mt-6 max-w-[40ch] text-[1.125rem] leading-[1.5]">
            Start in Claude Cowork or ChatGPT Work on your computer. A short introduction sets up your local working notes before your first deal.
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
            1. Get your key.
          </h2>
          <p className="text-mute leading-[1.5]">
            {enrollmentOpen ? "Enter your work email on the start page. Copy the private key when it appears: we show it only once." : "When Beta enrollment reopens, this page will lead you to a private key. Existing members can use the key saved in their connector."}
          </p>
        </section>

        <section className="space-y-5">
          <h2 className="text-[1.35rem] leading-[1.25] tracking-[-0.02em] sm:text-[1.75rem]">
            2. Add 3xrep to your assistant.
          </h2>
          <p className="text-mute leading-[1.5]">
            In Claude Desktop, open Connectors → Add custom connector. Replace YOUR_KEY below with your key and paste the complete address. Keep it private. For ChatGPT Work desktop, see the connection steps below.
          </p>
          <Snippet label="Your private connector address" text={`${url}?key=YOUR_KEY`} />
        </section>

        <section className="space-y-5">
          <h2 className="text-[1.35rem] leading-[1.25] tracking-[-0.02em] sm:text-[1.75rem]">3. Introduce yourself and choose a folder.</h2>
          <p className="text-mute leading-[1.5]">Open a local task in Claude Cowork or ChatGPT Work desktop. If the app asks for a folder when you start, choose one on this computer. Enable 3xrep for the first message below. The assistant will ask about your role, company and customers, then confirm that folder with you before creating <code>person.md</code>, <code>company.md</code> and <code>day.md</code>.</p>
          <Snippet label="First message to your assistant" text={LOCAL_ONBOARDING_PROMPT} />
          <p className="text-mute leading-[1.5]">A connector cannot start a conversation by itself or open a folder on your behalf. If the assistant cannot access a local folder, it must tell you and stop the file setup.</p>
        </section>

        <section className="space-y-5">
          <h2 className="text-[1.35rem] leading-[1.25] tracking-[-0.02em] sm:text-[1.75rem]">4. Connect your sources and start.</h2>
          <p className="text-mute leading-[1.5]">Add your CRM, email and calendar in the same assistant. Check that each connection can actually read your data. You can start with deal notes if your CRM is not ready yet.</p>
          <p className="rounded-lg bg-raise px-5 py-4 leading-[1.5]">“How should I move this deal forward, and what should I say?”</p>
          <p className="text-mute leading-[1.5]">Your assistant should read and update the local notes after useful exchanges. 3xrep itself does not get access to files on your computer.</p>
        </section>

        <section className="border-t border-line pt-5">
          <h2 className="text-[1.35rem] leading-[1.25] tracking-[-0.02em] sm:text-[1.75rem]">Other ways to connect</h2>
          <p className="text-mute mt-3 leading-[1.5]">Open these only if you use another assistant or want to connect a source of deal context.</p>
          <div className="mt-5 border-t border-line">
            <Fold title="ChatGPT Work desktop - test connection">
              <p>Enable developer mode in Settings → Security and login. Open Plugins,
                choose +, then add a custom MCP server with your private connector address.
                If the workspace does not offer this option, ask its administrator to enable it.</p>
              <p className="mt-3">Open a local folder in the desktop app before the first task. This setup still needs validation in a real Work workspace. It is not a published OAuth plugin. Before using customer data, check that start_onboarding appears and run a fictional deal through audit_deal.</p>
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
            <Fold title="CRM connectors">
              <p>Connect your CRM in your AI assistant alongside 3xrep. Each person signs in as themselves. Nothing needs to be installed inside your CRM to try 3xrep with notes.</p>
              <ul className="mt-4 divide-y divide-line border-y border-line">
                {CRM_CONNECTORS.map((crm) => <li key={crm.name} className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 py-3"><span>{crm.name}</span><span className="text-dim text-[0.8125rem]">{crm.docs.map((doc, i) => <span key={doc.href}>{i > 0 ? " · " : null}<a href={doc.href} target="_blank" rel="noopener noreferrer" className="text-foreground hover:underline">{doc.label}</a></span>)}</span></li>)}
              </ul>
            </Fold>
          </div>
        </section>

        <section className="space-y-5 border-t border-line pt-16">
          <p className="text-[1.35rem] leading-[1.25] tracking-[-0.02em] sm:text-[1.75rem]">
            {enrollmentOpen ? "Help shape 3xrep." : "Beta enrollment is closed for now."}
          </p>
          <p className="text-mute leading-[1.5]">
            {enrollmentOpen ? "Try it with your real sales work. Tell us what helped and what missed." : "Existing Beta workspaces can keep using 3xrep through their access deadline."}
          </p>
          <p className="text-dim text-[0.8125rem] leading-relaxed">3xrep does not join your calls or write to your CRM. Context sent to its tools is kept for 14 days, then deleted. A short record of unanswered deal questions may remain, without transcripts.</p>
          <p className="text-mute leading-relaxed">{enrollmentOpen ? "Full beta access. No credit card required. We select up to 20 teams for a free-forever base plan after real usage." : `If you are not selected, you can choose the $${LIST_PRICE_USD}/month company plan after Beta. We do not charge you automatically.`}</p>
        </section>
      </main>
    </>
  );
}
