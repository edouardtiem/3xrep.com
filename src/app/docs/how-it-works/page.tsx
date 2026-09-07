import Link from "next/link";
import { DocsEnd } from "@/components/DocsEnd";
import { JsonLd } from "@/components/JsonLd";
import { TOOLS, breadcrumbJsonLd, pageMeta } from "@/lib/docs";

export const metadata = pageMeta({
  title:     "How 3xrep works",
  description:
    "3xrep is not a ChatGPT prompt and not a MEDDIC skill. Two MCP connectors: your CRM is the file, 3xrep is the brain. Held, assumed, or empty — from what the buyer said. We don't join your calls.",
  path: "/docs/how-it-works",
});

export default function HowItWorksPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Docs", path: "/docs" },
          { name: "How it works", path: "/docs/how-it-works" },
        ])}
      />
      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-10 px-6 py-16 leading-relaxed">
        <div>
          <h1 className="text-[1.75rem] leading-[1.2] tracking-tight sm:text-[2rem]">
            How it works
          </h1>
          <p className="text-mute mt-4 max-w-[36rem]">
            You talk to your agent. That agent has two connectors. One reads
            the file. One judges it.             The verdict is JSON. Your model dresses
            it. We don&apos;t join your calls. We don&apos;t write to your CRM.
          </p>
        </div>

        <section className="space-y-2">
          <h2 className="text-lg">Two connectors</h2>
          <pre className="text-dim overflow-x-auto text-[0.8125rem] leading-[1.6]">
            <span className="text-foreground">your agent</span>
            {"   Claude · ChatGPT · Cursor · Codex…\n"}
            {" ├─ "}
            <span className="text-foreground">your CRM</span>
            {"  HubSpot · Salesforce · Pipedrive · Attio…\n"}
            {" └─ "}
            <span className="text-copper">3xrep</span>
            {"     one URL → the verdict"}
          </pre>
          <p className="text-dim">
            3xrep does not read HubSpot. It receives what your agent already
            pulled — notes, mails, meetings, transcripts on the record — and
            returns held, assumed, or empty. Your CRM&apos;s official MCP is
            the file. Ours is the brain.{" "}
            <Link href="/install" className="text-foreground hover:underline">
              Install
            </Link>{" "}
            is those two steps.
          </p>
          <p className="text-dim">
            Nothing to install in the CRM. No 3xrep tab. A correction to a
            field is said, then written by you through your CRM connector
            after you confirm. Tool inputs last fourteen days, then go.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg">Why Claude or ChatGPT is not enough</h2>
          <p className="text-dim">
            Claude and ChatGPT already know the grids. Ask for MEDDIC, you
            get a checklist. Ask for a coaching email, you get a polite
            paragraph. That is a skill: markdown the model can ignore the
            moment it wants to be useful.
          </p>
          <p className="text-dim">
            3xrep is a compiler of holes, not a library of methods. The
            grids are aliases of the judgment, not the source. Several
            grids can name the same hole — Economic Buyer, Authority,
            Décideurs — and we keep all three. We don&apos;t pick a good
            one.
          </p>
          <p className="text-dim">
            A VP does not believe the CRM because someone ticked a box. He
            asks what the buyer said, on which call, and whether the door
            was closed. If the quote is missing, the piece is empty. If the
            call is missing, he refuses to fill the gap. That refusal is
            the product.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg">What the buyer said. Not a guess.</h2>
          <p className="text-dim">
            Before it calls a tool, the agent extracts exhibits: who spoke,
            source, date, exact quote, which piece, whether they affirm or
            deny, whether the closing question was asked.
          </p>
          <ul className="text-dim list-disc space-y-1.5 pl-5">
            <li>
              A piece is <span className="text-foreground">held</span> only
              if the buyer said it on a call, a mail, or a meeting, and the
              rep closed the door.
            </li>
            <li>
              A note from the rep is a{" "}
              <span className="text-foreground">claim</span>, not a fact.
            </li>
            <li>
              A title — CFO, manager — is not proof. It is a label.
            </li>
            <li>
              A green checkbox without a quote is{" "}
              <span className="text-foreground">empty</span>.
            </li>
            <li>
              No transcript: paste it in this chat, or connect a notetaker
              so the next call lands on the deal. We don&apos;t invent the
              line they never said.
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg">What the tools return</h2>
          <ul className="text-dim space-y-1.5">
            {TOOLS.map(([name, job]) => (
              <li key={name}>
                <span className="text-foreground">{name}</span> — {job}
              </li>
            ))}
          </ul>
          <p className="text-dim">
            JSON, then a rendering contract. Your agent writes from that.
            No probability of close. No &ldquo;you close Friday.&rdquo; No
            write to the CRM.{" "}
            <Link href="/spec" className="text-foreground hover:underline">
              Spec
            </Link>{" "}
            is the prompt that travels with them.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg">What this is not</h2>
          <p className="text-dim">
            Not Gong. We don&apos;t join your calls. Not your CRM&apos;s
            assistant — it fills the fields, we say which ones are empty. Not
            a course. Not a skill store of MEDDIC markdown.{" "}
            <Link
              href="/docs/use-cases"
              className="text-foreground hover:underline"
            >
              Use cases
            </Link>{" "}
            is what you do with it once both connectors are on.
          </p>
        </section>

        <DocsEnd />
      </main>
    </>
  );
}
