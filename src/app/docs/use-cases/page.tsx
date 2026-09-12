import Link from "next/link";
import { CopyButton } from "@/components/CopyButton";
import { DocsEnd } from "@/components/DocsEnd";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbJsonLd, pageMeta } from "@/lib/docs";
import { PROMPTS } from "@/lib/landing";

export const metadata = pageMeta({
  title: "CRM says negotiation. Nobody can sign.",
  description:
    "Our CRM says the deal is in negotiation but nobody on their side can sign. Monday pipe review with a VP Sales agent that reads the calls behind the fields.",
  path: "/docs/use-cases",
});

const CASES = [
  {
    title: "Monday. The pipe is green. The pipe is lying.",
    prompt: PROMPTS[0],
    tool: "pipe_review",
    body: [
      "The CRM says Negotiation. Nobody who signs has been named. A close date sits on the card with no decision process on record. Last touched 46 days ago, stage unchanged.",
      "The VP does not rank reps. He names the illegal stage, the close date that is a claim, the hole that repeats, and one process change — a mandatory question, a stage to gate or drop. No percentage. Deals with no call: not enough to judge.",
    ],
  },
  {
    title: "Deal stuck after discovery. The CRM is still green.",
    prompt:
      "Deal stuck after discovery. The CRM is still green. What is actually held?",
    tool: "audit_deal",
    body: [
      "The demo went well. The stage did not move because the buyer did something — it moved because the rep logged activity. Nobody who can sign was named. The next step is follow up.",
      "The VP does not send another recap. He names the hole: the person who signs is empty, or the close date is a claim. Then one question that costs. No percentage.",
    ],
  },
  {
    title: "After the call — the debrief",
    prompt: PROMPTS[1],
    tool: "audit_deal",
    body: [
      "One deal. The /10 is the discovery, not the person. The miss glued to a line they said. Three locks before the next meeting. A plan. One objective — the move that costs.",
      "No transcript on the record: paste it in the chat, or connect Fireflies, tl;dv, or HubSpot Conversation Intelligence so the next call lands on the deal. We don't join your calls. We don't invent the replica.",
    ],
  },
  {
    title: "After the visio — the follow-up that is allowed to exist",
    prompt: "Draft the follow-up from the debrief. Don't send a recap of the demo.",
    tool: "audit_deal → your model writes → CRM MCP sends",
    body: [
      "3xrep does not write the email. It names the hole. Your agent writes from that: the question that costs, not a recap of slides they sat through. Then it asks. You confirm. Your CRM connector sends the mail and logs it on the deal — HubSpot, Salesforce, Pipedrive, Attio, whoever hosts the file.",
      "That is the loop a routine can run: visio ends, notetaker drops the transcript on the record, the agent debriefs, drafts, waits, writes the note, sends. Intelligence back in the CRM. Not a second tab of coaching.",
    ],
  },
  {
    title: "The note on the deal",
    prompt: "Put the debrief on the deal as a note. Don't touch the stage.",
    tool: "your CRM MCP, after confirmation",
    body: [
      "The verdict stays in the chat until you say yes. Then their connector creates a note. Optionally a task: bring the person who signs to the next meeting. 3xrep has no write_to_crm. Properties, probability, stage — not our job. The timeline is.",
    ],
  },
  {
    title: "They said it's too expensive",
    prompt: PROMPTS[3],
    tool: "objection_map",
    body: [
      "The objection is the piece that isn't held. Price without a number they said is Metrics empty. Don't punch a line. Dig, rename, then argue — CRAC, not a script.",
    ],
  },
  {
    title: "Which close date is a claim",
    prompt: PROMPTS[2],
    tool: "pipe_review",
    body: [
      "A date in the CRM is what the rep typed. Held only if a buyer named the process, the people, the paper. Otherwise the forecast is a hope. The VP says so.",
    ],
  },
] as const;

export default function UseCasesPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Docs", path: "/docs" },
          { name: "Use cases", path: "/docs/use-cases" },
        ])}
      />
      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-10 px-6 py-16 leading-relaxed">
        <div>
          <h1 className="text-[1.75rem] leading-[1.2] tracking-tight sm:text-[2rem]">
            Use cases
          </h1>
          <p className="text-mute mt-4 max-w-[36rem]">
            The agent lives where you already work. The CRM holds the file.
            3xrep judges. Your model can then write the note and the mail —
            through your CRM MCP, after you confirm.
          </p>
        </div>

        {CASES.map((item) => (
          <section key={item.title} className="space-y-3">
            <h2 className="text-lg">{item.title}</h2>
            {item.body.map((p) => (
              <p key={p} className="text-dim">
                {p}
              </p>
            ))}
            <div className="flex items-baseline justify-between gap-4 border border-line px-3 py-2.5">
              <p className="min-w-0 text-[0.8125rem] leading-snug">{item.prompt}</p>
              <CopyButton text={item.prompt} />
            </div>
            <p className="text-dim text-xs">
              <span className="text-copper">{item.tool}</span>
            </p>
          </section>
        ))}

        <section className="space-y-2">
          <h2 className="text-lg">Routines — the agent runs it again</h2>
          <p className="text-dim">
            Claude scheduled tasks, ChatGPT scheduled tasks, Cowork, a Cursor
            rule: same two connectors, on a clock. Monday pipe. After each
            transcribed meeting: debrief, draft, ask, write the note, send
            the follow-up. The CRM becomes the memory. 3xrep stays the
            judgment that refuses a green box.
          </p>
          <p className="text-dim">
            That is stronger than a chatbot with a MEDDIC prompt, and
            stronger than a CRM assistant that fills fields. One names the
            hole. The other puts the consequence back on the record.{" "}
            <Link
              href="/docs/how-it-works"
              className="text-foreground hover:underline"
            >
              How it works
            </Link>
            .
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg">What we will not do in a use case</h2>
          <p className="text-dim">
            Book the demo they asked for before a piece is open. Write a
            &ldquo;just checking in.&rdquo; Forecast a close date. Rank
            people. Record the call. Speak to the buyer. You stay the
            mouth. The VP stays the brain.
          </p>
        </section>

        <DocsEnd />
      </main>
    </>
  );
}
