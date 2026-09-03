import { CheckoutButton } from "@/components/CheckoutButton";
import { CopyButton } from "@/components/CopyButton";
import { SessionTerminal } from "@/components/SessionTerminal";
import { AGENT_SPEC, PROMPTS } from "@/lib/landing";
import { mcpUrl } from "@/lib/site";

function CopyBlock({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[4px] border border-line">
      <div className="flex items-center justify-between gap-3 border-b border-line px-3 py-2">
        <span className="text-dim text-[11px] tracking-wide uppercase">
          {label}
        </span>
        <CopyButton text={value} />
      </div>
      <pre className="overflow-x-auto px-3 py-3 text-[12.5px] leading-relaxed whitespace-pre-wrap">
        {value}
      </pre>
    </div>
  );
}

export default function Home() {
  const connector = mcpUrl();

  return (
    <div className="flex flex-1 flex-col">
      <header className="mx-auto flex w-full max-w-[42rem] items-baseline justify-between px-5 py-6">
        <a href="/" className="text-[13px]">
          3xrep
        </a>
        <a href="#start" className="text-[13px]">
          Start — 3 audits
        </a>
      </header>

      <main className="mx-auto flex w-full max-w-[42rem] flex-1 flex-col px-5 pb-24">
        <h1 className="max-w-[22rem] text-[1.65rem] leading-[1.2] tracking-tight sm:max-w-none sm:text-[1.85rem]">
          Hire the best VP Sales agent
          <br />
          for 99 €/month.
        </h1>
        <p className="text-dim mt-3 text-[13px] italic">
          for the entire organization
        </p>

        <div className="mt-10">
          <SessionTerminal />
        </div>

        <p className="text-mute mt-6 max-w-[36rem] text-[13px] leading-relaxed">
          This agent is the méthode that makes you close. Spoiler: he
          won&apos;t go easy on you. That&apos;s why it works.
        </p>

        <p className="text-dim mt-8 text-[11px] tracking-wide">
          Claude Code · Cursor · Codex
        </p>

        <section id="start" className="mt-20 scroll-mt-8">
          <p className="text-[13px] leading-relaxed">
            Start — 3 audits. Then the card.
          </p>
          <p className="text-dim mt-2 max-w-[34rem] text-[13px] leading-relaxed">
            Add the connector. Paste the spec. Run it on a real deal. The
            fourth audit is the wall.
          </p>

          <div className="mt-8 flex flex-col gap-3">
            <CopyBlock label="Connector URL" value={connector} />
            <CopyBlock label="Spec" value={AGENT_SPEC} />
          </div>

          <ul className="mt-8 flex flex-col gap-3">
            {PROMPTS.map((prompt, i) => (
              <li key={prompt} className="rounded-[4px] border border-line">
                <div className="flex items-center justify-between gap-3 px-3 py-2">
                  <span className="text-dim text-[11px]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <CopyButton text={prompt} />
                </div>
                <p className="px-3 pb-3 text-[13px]">{prompt}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-20 border-t border-line pt-8">
          <p className="text-dim text-[11px] tracking-wide uppercase">
            Already in?
          </p>
          <p className="mt-2 text-[13px]">99 € / month / organization.</p>
          <p className="text-dim mt-2 max-w-[32rem] text-[13px] leading-relaxed">
            Modjo is ~99 € a seat. Here it&apos;s 99 € for the whole team.
            No demo.{" "}
            <a href="/install" className="text-foreground underline-offset-2 hover:underline">
              Install then pay
            </a>
            .
          </p>
          <div className="mt-5">
            <CheckoutButton label="Pay 99 € / month / org" />
          </div>
        </section>

        <section className="text-dim mt-16 space-y-2 text-[13px] leading-relaxed">
          <p>Not Gong. We don&apos;t record.</p>
          <p>Not a CRM.</p>
          <p>Not a course.</p>
          <p>Not &ldquo;you close Friday.&rdquo;</p>
        </section>
      </main>

      <footer className="text-dim mx-auto w-full max-w-[42rem] px-5 pb-10 text-[11px] leading-relaxed">
        Your CRM and your prompts stay where they are. We don&apos;t record.
        We don&apos;t store.
      </footer>
    </div>
  );
}
