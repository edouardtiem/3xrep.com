import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { MCP_URL, PROMPTS } from "@/lib/landing";

export const metadata: Metadata = {
  title: "Docs — 3xrep",
  description:
    "3xrep is a deal coach MCP for Claude Code, Cursor, and Codex. It names the hole that kills the deal. Not Gong. We don't record.",
};

export default function DocsPage() {
  return (
    <>
      <Header />
      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-10 px-6 py-16 text-[13px] leading-relaxed">
        <div>
          <h1 className="text-[1.65rem] leading-[1.2] tracking-tight">Docs</h1>
          <p className="text-mute mt-4 max-w-[36rem]">
            3xrep is a VP sales agent you add to Claude Code, Cursor, or Codex.
            It reads the deal in your CRM. It names the hole that kills the
            deal. We don&apos;t record. We don&apos;t store.
          </p>
        </div>

        <section className="space-y-2">
          <h2 className="text-[13px]">Connector</h2>
          <p className="text-dim">
            <a href="/install" className="text-foreground hover:underline">
              Install
            </a>
            . URL:{" "}
            <span className="text-foreground">{MCP_URL}</span>
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
          <h2 className="text-[13px]">What the VP can do</h2>
          <p className="text-dim">From a debrief to a full analysis.</p>
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
          <p>Not a CRM.</p>
          <p>Not a course.</p>
          <p>Not &ldquo;you close Friday.&rdquo;</p>
          <p className="text-foreground pt-2">
            We name the hole that kills the deal.
          </p>
        </section>
      </main>
    </>
  );
}
