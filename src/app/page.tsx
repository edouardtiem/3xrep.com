import { CopyButton } from "@/components/CopyButton";
import { SessionTerminal } from "@/components/SessionTerminal";
import { Wordmark } from "@/components/Wordmark";
import { MCP_URL, PROMPTS } from "@/lib/landing";

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
  return (
    <div className="flex flex-1 flex-col">
      <header className="mx-auto flex w-full max-w-[68rem] items-baseline justify-between px-5 py-6">
        <a href="/" aria-label="3xrep" className="text-[13px]">
          <Wordmark />
        </a>
        <a href="/docs" className="text-[13px]">
          docs
        </a>
      </header>

      <main className="mx-auto flex w-full max-w-[68rem] flex-1 flex-col px-5 pt-6 pb-24">
        <div className="flex flex-col lg:grid lg:grid-cols-[minmax(0,24rem)_minmax(0,1fr)] lg:grid-rows-[auto_auto] lg:gap-x-14">
          <div>
            <h1 className="max-w-[22rem] text-[1.65rem] leading-[1.2] tracking-tight sm:max-w-none sm:text-[1.85rem]">
              Hire the best VP Sales agent
              <br />
              for 99 €/month.
            </h1>
            <p className="text-dim mt-3 text-[13px] italic">
              for the entire organization
            </p>
          </div>

          <div className="mt-10 lg:col-start-2 lg:row-span-2 lg:mt-0">
            <div className="lg:sticky lg:top-6">
              <SessionTerminal />
            </div>
          </div>

          <div className="mt-6 lg:col-start-1 lg:row-start-2 lg:mt-8">
            <p className="text-mute text-[13px] leading-relaxed">
              This agent is the méthode that makes you close. Spoiler: he
              won&apos;t go easy on you. That&apos;s why it works.
            </p>

            <p className="text-dim mt-8 text-[11px] tracking-wide">
              Claude Code · Cursor · Codex
            </p>

            <section id="start" className="mt-10 scroll-mt-8">
              <p className="text-[13px] leading-relaxed">Start.</p>
              <p className="text-dim mt-2 text-[13px] leading-relaxed">
                Add the connector. Run it on a real deal.
              </p>
              <div className="mt-6">
                <CopyBlock label="Connector URL" value={MCP_URL} />
              </div>
            </section>

            <section className="mt-10">
              <p className="text-[13px] leading-relaxed">What the VP can do.</p>
              <p className="text-dim mt-2 text-[13px] leading-relaxed">
                From a debrief to a full analysis.
              </p>
              <ul className="mt-6 divide-y divide-line border-y border-line">
                {PROMPTS.map((prompt, i) => (
                  <li
                    key={prompt}
                    className="flex items-baseline gap-3 py-2.5"
                  >
                    <span className="text-dim w-5 shrink-0 text-[11px]">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <p className="min-w-0 flex-1 text-[13px] leading-snug">
                      {prompt}
                    </p>
                    <CopyButton text={prompt} />
                  </li>
                ))}
              </ul>
            </section>

            <section className="mt-16 border-t border-line pt-8">
              <p className="text-dim text-[11px] tracking-wide uppercase">
                Already in?
              </p>
              <p className="mt-2 text-[13px]">99 € / month / organization.</p>
              <p className="text-dim mt-2 text-[13px] leading-relaxed">
                Gong is ~$1,500 a seat. Here it&apos;s 99 € for the whole
                organization. We don&apos;t record.
              </p>
            </section>

            <section className="mt-12 space-y-2 text-[13px] leading-relaxed">
              <p className="text-dim">Not Gong. We don&apos;t record.</p>
              <p className="text-dim">Not a CRM.</p>
              <p className="text-dim">Not a course.</p>
              <p className="text-dim">Not &ldquo;you close Friday.&rdquo;</p>
              <p className="pt-4">
                We name the hole that kills the deal.
              </p>
            </section>
          </div>
        </div>
      </main>

      <footer className="text-dim mx-auto w-full max-w-[68rem] px-5 pb-10 text-[11px] leading-relaxed">
        Your CRM and your prompts stay where they are. We don&apos;t record.
        We don&apos;t store.
      </footer>
    </div>
  );
}
