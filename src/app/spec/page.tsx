import { CopyButton } from "@/components/CopyButton";
import { Header } from "@/components/Header";
import { AGENT_SPEC } from "@/lib/copy";

export default function SpecPage() {
  return (
    <>
      <Header />
      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-8 px-6 py-16">
        <div className="flex items-baseline justify-between gap-4">
          <h1 className="text-3xl font-medium tracking-tight">Agent spec</h1>
          <CopyButton text={AGENT_SPEC} />
        </div>
        <p className="text-sm text-mute">
          One text, theirs. They paste it in a Claude Project, a GPT, a Notion agent. It holds
          our URL. It travels when they change jobs. Also sent as MCP server instructions on
          install.
        </p>
        <pre className="overflow-x-auto whitespace-pre-wrap rounded-[10px] border border-line bg-raise p-6 font-mono text-xs leading-relaxed">
          {AGENT_SPEC}
        </pre>
      </main>
    </>
  );
}
