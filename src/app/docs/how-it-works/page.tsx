import Link from "next/link";
import { DocsEnd } from "@/components/DocsEnd";
import { DocPage, DocSection } from "@/components/DocPage";
import { JsonLd } from "@/components/JsonLd";
import { TOOLS, breadcrumbJsonLd, pageMeta } from "@/lib/docs";

export const metadata = pageMeta({
  title: "How 3xrep works",
  description:
    "Two connectors: HubSpot is the file, 3xrep is the judgment. Held, assumed, or empty — from what the buyer said. We don't join your calls.",
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
      <DocPage
        title="How it works"
        lead="You talk to Claude. Claude has two connectors. One reads the file. One judges it. We don't join your calls. We don't write to HubSpot."
      >
        <DocSection title="Two connectors">
          <p>He lives in Claude or ChatGPT, next to HubSpot. Not inside HubSpot.</p>
          <p>
            3xrep does not read HubSpot itself. It receives what Claude already
            pulled — notes, mails, meetings, transcripts on the record — and
            returns held, assumed, or empty.{" "}
            <Link href="/install" className="text-foreground hover:underline">
              Install
            </Link>{" "}
            is those two steps.
          </p>
          <p>
            A correction to a field is said, then written by you through
            HubSpot, after you confirm. Call text lasts fourteen days, then
            goes.
          </p>
        </DocSection>

        <DocSection title="Why Claude alone is not enough">
          <p>
            Ask for MEDDIC, you get a checklist. Ask for a coaching email, you
            get a polite paragraph. That is a file of instructions the model
            can ignore the moment it wants to be useful.
          </p>
          <p>
            A director does not believe HubSpot because someone ticked a box.
            He asks what the buyer said, on which call, and whether the door
            was closed. If the quote is missing, the piece is empty. If the
            call is missing, he refuses to fill the gap. That refusal is the
            product.
          </p>
        </DocSection>

        <DocSection title="What the buyer said">
          <p>
            Before it calls a tool, Claude extracts exhibits: who spoke,
            source, date, exact quote, which piece, whether they affirm or
            deny.
          </p>
          <ul className="list-disc space-y-3 pl-5">
            <li>
              Held only if the buyer said it on a call, a mail, or a meeting,
              and the door was closed.
            </li>
            <li>A note from the commercial is a claim, not a fact.</li>
            <li>A title — CFO, manager — is a label, not proof.</li>
            <li>A green checkbox without a quote is empty.</li>
            <li>
              No transcript: paste it in this chat, or connect a notetaker so
              the next call lands on the deal. We don&apos;t invent the line
              they never said.
            </li>
          </ul>
        </DocSection>

        <DocSection title="What the tools return">
          <ul className="space-y-3">
            {TOOLS.map(([name, job]) => (
              <li key={name}>
                <span className="text-foreground">{name}</span>
                <span> — {job}</span>
              </li>
            ))}
          </ul>
          <p>
            No probability of close. No &ldquo;you close Friday.&rdquo; No
            write to HubSpot.{" "}
            <Link href="/spec" className="text-foreground hover:underline">
              Spec
            </Link>{" "}
            is the text that travels with them.
          </p>
        </DocSection>

        <DocsEnd />
      </DocPage>
    </>
  );
}
