import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { PROMPTS } from "@/lib/landing";
import { mcpUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Docs — 3xrep",
  description:
    "3xrep is a VP Sales agent MCP for Claude Code, Cursor, and Codex. It reads the calls behind your CRM fields and names the stage that lies. Not Gong. We don't record.",
};

const TOOLS = [
  ["pipe_review", "Several deals. Which stage is illegal, which close date is a claim, which hole repeats."],
  ["audit_deal", "One call. The /10, the miss quoted, three locks, a plan, one objective."],
  ["next_question", "The one move that costs on this deal."],
  ["objection_map", "The objection → the piece that isn't held."],
  ["methode_lookup", "MEDDIC, BANT, BEBEDC… a notion, not a deal."],
  ["rattacher", "One sentence from a call → which method, which part."],
] as const;

export default function DocsPage() {
  const connector = mcpUrl();

  return (
    <>
      <Header />
      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-10 px-6 py-16 text-[13px] leading-relaxed">
        <div>
          <h1 className="text-[1.65rem] leading-[1.2] tracking-tight">Docs</h1>
          <p className="text-mute mt-4 max-w-[36rem]">
            3xrep is a VP Sales agent you add to Claude Code, Cursor, or Codex,
            next to your CRM MCP. It reads the calls behind the fields. It
            names the hole that kills the deal, and the stage that lies. We
            don&apos;t record. We don&apos;t store.
          </p>
        </div>

        <section className="space-y-2">
          <h2 className="text-[13px]">Where it lives</h2>
          <p className="text-dim">
            3xrep is a remote MCP server. It lives in your agent — Claude
            Code, Cursor, Codex, Claude (Cowork), ChatGPT Business, Notion
            agents — as one URL, next to the HubSpot, Salesforce, or Notion
            MCP you already use. It does not live in your CRM: nothing to
            install there, no 3xrep tab, no data copied. Your agent reads
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
          <h2 className="text-[13px]">Connector</h2>
          <p className="text-dim">
            <a href="/install" className="text-foreground hover:underline">
              Install
            </a>
            . URL: <span className="text-foreground">{connector}</span>
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-[13px]">Agent spec</h2>
          <p className="text-dim">
            The prompt that travels with them. Claude Project, GPT, Notion
            agent. Also sent as MCP instructions on connect.{" "}
            <a href="/spec" className="text-foreground hover:underline">
              Spec
            </a>
            .
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-[13px]">Tools</h2>
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

        <section className="space-y-3">
          <h2 className="text-[13px]">What the VP says</h2>
          <p className="text-dim">From a Monday pipe review to one call.</p>
          <ol className="text-dim space-y-1">
            {PROMPTS.map((prompt, i) => (
              <li key={prompt}>
                {String(i + 1).padStart(2, "0")} {prompt}
              </li>
            ))}
          </ol>
        </section>

        <section className="text-dim space-y-2">
          <p>Not Gong. We don&apos;t record.</p>
          <p>Not your CRM&apos;s assistant. It fills the fields. We say which ones are empty.</p>
          <p>Not a course.</p>
          <p>Not &ldquo;you close Friday.&rdquo;</p>
          <p className="text-foreground pt-2">
            We name the hole that kills the deal. And the stage that lies.
          </p>
        </section>
      </main>
    </>
  );
}
