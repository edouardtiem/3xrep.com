import Link from "next/link";
import { DocsEnd } from "@/components/DocsEnd";
import { JsonLd } from "@/components/JsonLd";
import { TRUST_LINE } from "@/lib/copy";
import { PROMPTS } from "@/lib/landing";
import {
  DOC_FAQ,
  TOOLS,
  breadcrumbJsonLd,
  faqJsonLd,
  pageMeta,
  softwareJsonLd,
} from "@/lib/docs";
import { mcpUrl } from "@/lib/site";
import { LIST_PRICE_USD } from "@/lib/stripe-checkout-session";

export const metadata = pageMeta({
  title: "What is 3xrep",
  description:
    "3xrep is a VP Sales agent you add to Claude, ChatGPT, Cursor, or Codex next to your CRM. It names the stage that lies. It does not record calls. From $" +
    LIST_PRICE_USD +
    "/month for the organization.",
  path: "/docs",
});

const TOC = [
  {
    href: "/docs/how-it-works",
    title: "How it works",
    blurb:
      "Two connectors. Evidence, not a guess. Why Claude or ChatGPT alone is not a VP.",
  },
  {
    href: "/docs/use-cases",
    title: "Use cases",
    blurb:
      "Monday pipe. Call debrief. Follow-up that writes back to the CRM. Agent routines.",
  },
  {
    href: "/docs/gong-alternative",
    title: "Gong alternative",
    blurb: `Gong records. 3xrep does not join the call. Same VP, $${LIST_PRICE_USD} / org.`,
  },
  {
    href: "/docs/pipeline-review",
    title: "Pipeline review",
    blurb:
      "The CRM is still green after discovery. The VP names the stage that is a lie.",
  },
  {
    href: "/docs/methods",
    title: "Methods",
    blurb:
      "MEDDIC, BANT, BEBEDC, SPIN… aliases of the hole. Not a course. What the buyer said.",
  },
  {
    href: "/install",
    title: "Install",
    blurb: "Add the 3xrep MCP. Connect your CRM with their docs. Then pay.",
  },
] as const;

export default function DocsPage() {
  const connector = mcpUrl();

  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Docs", path: "/docs" }])} />
      <JsonLd data={faqJsonLd()} />
      <JsonLd data={softwareJsonLd()} />
      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-10 px-6 py-16 leading-relaxed">
        <div>
          <h1 className="text-[1.75rem] leading-[1.2] tracking-tight sm:text-[2rem]">
            What is 3xrep
          </h1>
          <p className="text-mute mt-4 max-w-[36rem]">
            3xrep is a VP Sales agent you add to Claude, ChatGPT, Cursor, or
            Codex, next to your CRM MCP. It reads the calls behind the fields.
            It names the hole that kills the deal, and the stage that lies.{" "}
            {TRUST_LINE}
          </p>
        </div>

        <nav aria-label="In this docs" className="space-y-4">
          {TOC.map((item) => (
            <p key={item.href}>
              <Link href={item.href} className="text-foreground hover:underline">
                {item.title}
              </Link>
              <span className="text-dim"> — {item.blurb}</span>
            </p>
          ))}
        </nav>

        <section className="space-y-2">
          <h2 className="text-lg">Where it lives</h2>
          <p className="text-dim">
            3xrep is a remote MCP server. It lives in your agent — Claude
            Code, Cursor, Codex, Claude (Cowork), ChatGPT, Notion agents — as
            one URL, next to the HubSpot, Salesforce, Pipedrive, Attio, or
            Notion MCP you already use. It does not live in your CRM: nothing
            to install there, no 3xrep tab. Your agent reads
            the deal through your CRM connector and calls 3xrep for the
            verdict.
          </p>
          <p className="text-dim">
            It needs both. Without a CRM connected to your agent, there is
            nothing to read — paste the notes or transcript in the chat and
            it works on that, without the CRM fields.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg">Not a ChatGPT prompt</h2>
          <p className="text-dim">
            Claude and ChatGPT already know MEDDIC, BANT, SPIN, Challenger.
            They recite. They stay useful. They fill the gap when the call is
            missing.{" "}
            <Link
              href="/docs/how-it-works"
              className="text-foreground hover:underline"
            >
              How it works
            </Link>{" "}
            is the compiler: held, assumed, or empty, from what the buyer
            said. A skill can be ignored. The JSON cannot.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg">Connector</h2>
          <p className="text-dim">
            <Link href="/install" className="text-foreground hover:underline">
              Install
            </Link>
            . URL: <span className="text-foreground">{connector}</span>
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg">Agent spec</h2>
          <p className="text-dim">
            The prompt that travels with them. Claude Project, GPT, Notion
            agent. Also sent as MCP instructions on connect.{" "}
            <Link href="/spec" className="text-foreground hover:underline">
              Spec
            </Link>
            .
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg">Tools</h2>
          <ul className="text-dim space-y-1.5">
            {TOOLS.map(([name, job]) => (
              <li key={name}>
                <span className="text-foreground">{name}</span> — {job}
              </li>
            ))}
          </ul>
          <p className="text-dim">
            Every tool returns JSON and a rendering contract. Your agent
            writes from it. No probability, no forecast, no write to the CRM.
            When there is no call on record, the tool returns a refusal and
            the agent says so.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg">Exhibits</h2>
          <p className="text-dim">
            The agent extracts before it calls: who spoke, source, date,
            exact quote, which hole, whether they affirm or deny, whether
            the closing question was asked. A note from the AE is a claim,
            not a fact. A title is not proof. A piece is held only if the
            buyer said it on a call, mail, or meeting, and the AE closed
            the door.
          </p>
          <p className="text-dim">
            No transcript on the deal: the verdict asks to paste it in this
            chat, or to connect a notetaker (Fireflies, tl;dv, HubSpot CI)
            so the next call lands on the CRM. Tool inputs are kept 14 days.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg">What the VP says</h2>
          <p className="text-dim">From a Monday pipe review to one call.</p>
          <ol className="text-dim space-y-1">
            {PROMPTS.map((prompt, i) => (
              <li key={prompt}>
                {String(i + 1).padStart(2, "0")} {prompt}
              </li>
            ))}
          </ol>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg">FAQ</h2>
          <dl className="space-y-5">
            {DOC_FAQ.map((row) => (
              <div key={row.q}>
                <dt className="text-foreground">{row.q}</dt>
                <dd className="text-dim mt-1">{row.a}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="text-dim space-y-2">
          <p>Not Gong. We don&apos;t join your calls.</p>
          <p>
            Not your CRM&apos;s assistant. It fills the fields. We say which
            ones are empty.
          </p>
          <p>Not a course.</p>
          <p>Not &ldquo;you close Friday.&rdquo;</p>
          <p className="text-foreground pt-2">
            We name the hole that kills the deal. And the stage that lies.
          </p>
        </section>

        <DocsEnd />
      </main>
    </>
  );
}
