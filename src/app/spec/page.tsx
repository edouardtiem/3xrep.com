import { CopyButton } from "@/components/CopyButton";
import { Header } from "@/components/Header";
import { AGENT_SPEC } from "@/lib/copy";
import { pageMeta } from "@/lib/docs";

export const metadata = pageMeta({
  title: "Agent spec",
  description:
    "Optional agent instructions for a local desktop setup with 3xrep. The guided introduction starts with the start_onboarding tool.",
  path: "/spec",
});

export default function SpecPage() {
  return (
    <>
      <Header />
      <main className="mx-auto flex w-full max-w-[40rem] flex-1 flex-col gap-10 px-5 py-16 sm:px-10">
        <div className="flex items-baseline justify-between gap-4">
          <h1 className="text-[2rem] leading-[1.1] font-medium tracking-[-0.03em] sm:text-[2.5rem]">
            Spec
          </h1>
          <CopyButton text={AGENT_SPEC} />
        </div>
        <p className="text-mute max-w-[40ch] text-[1.125rem] leading-[1.5]">
          Optional instructions for a local desktop assistant. Start with the
          guided introduction on the connection page; your assistant can keep
          these instructions in the folder you authorize.
        </p>
        <pre className="overflow-x-auto whitespace-pre-wrap rounded-lg border border-line bg-raise p-6 font-mono text-xs leading-relaxed">
          {AGENT_SPEC}
        </pre>
      </main>
    </>
  );
}
