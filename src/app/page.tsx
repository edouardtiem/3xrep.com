import Link from "next/link";
import { CheckoutButton } from "@/components/CheckoutButton";
import { CopyButton } from "@/components/CopyButton";
import { SessionTerminal } from "@/components/SessionTerminal";
import { Wordmark } from "@/components/Wordmark";
import { PROMPTS } from "@/lib/landing";
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
      <header className="mx-auto flex w-full max-w-[68rem] items-baseline justify-between px-5 py-6">
        <Link href="/" aria-label="3xrep" className="text-[13px]">
          <Wordmark />
        </Link>
        <Link href="/docs" className="text-[13px]">
          docs
        </Link>
      </header>

      <main className="mx-auto flex w-full max-w-[68rem] flex-1 flex-col px-5 pt-6 pb-24">
        <div className="flex flex-col lg:grid lg:grid-cols-[minmax(0,24rem)_minmax(0,1fr)] lg:grid-rows-[auto_auto] lg:gap-x-14">
          <div>
            <h1 className="max-w-[22rem] text-[1.65rem] leading-[1.2] tracking-tight sm:max-w-none sm:text-[1.85rem]">
              Hire the VP Sales
              <br />
              who doesn&apos;t believe your CRM.
            </h1>
            <p className="text-dim mt-3 text-[13px] italic">
              99 €/month. For the entire organization.
            </p>
          </div>

          <div className="mt-10 lg:col-start-2 lg:row-span-2 lg:mt-0">
            <div className="lg:sticky lg:top-6">
              <SessionTerminal />
            </div>
          </div>

          <div className="mt-6 lg:col-start-1 lg:row-start-2 lg:mt-8">
            <p className="text-mute text-[13px] leading-relaxed">
              Your CRM is green because someone ticked a box. This agent reads
              the calls behind the fields and says what your CRM can&apos;t:
              this stage is a lie. He won&apos;t go easy on you. That&apos;s
              why it works.
            </p>

            <section className="mt-10">
              <p className="text-[13px] leading-relaxed">Where he lives.</p>
              <p className="text-dim mt-2 text-[13px] leading-relaxed">
                Not in your CRM. In your agent — one MCP URL, next to the
                CRM connector you already have. Nothing to install in HubSpot.
                No 3xrep tab. He reads the deal through your CRM and judges
                it in your terminal.
              </p>
              <pre className="text-dim mt-5 overflow-x-auto text-[12px] leading-[1.6]">
                <span className="text-foreground">your agent</span>
                {"   Claude · ChatGPT · Cursor · Codex…\n"}
                {" ├─ "}
                <span className="text-foreground">your CRM</span>
                {"  HubSpot · Salesforce · Notion\n"}
                {" └─ "}
                <span className="text-copper">3xrep</span>
                {"     one URL → the verdict"}
              </pre>
              <p className="text-dim mt-4 text-[13px] leading-relaxed">
                He needs both. Without your CRM connected, he has nothing to
                read.
              </p>
            </section>

            <section id="start" className="mt-10 scroll-mt-8">
              <p className="text-[13px] leading-relaxed">Start.</p>
              <p className="text-dim mt-2 text-[13px] leading-relaxed">
                Add the connector next to your HubSpot, Salesforce, or Notion
                MCP. Run it on your pipe.
              </p>
              <div className="mt-6">
                <CopyBlock label="Connector URL" value={connector} />
              </div>
            </section>

            <section className="mt-10">
              <p className="text-[13px] leading-relaxed">What the VP says.</p>
              <p className="text-dim mt-2 text-[13px] leading-relaxed">
                From a Monday pipe review to one call.
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
                Gong is ~$1,500 a seat and records your calls. Here it&apos;s
                99 € for the whole pipe, no seats, and we don&apos;t record.
              </p>
              <div className="mt-5">
                <CheckoutButton label="Pay 99 € / month / org" />
              </div>
            </section>

            <section className="mt-12 space-y-2 text-[13px] leading-relaxed">
              <p className="text-dim">Not Gong. We don&apos;t record.</p>
              <p className="text-dim">
                Not your CRM&apos;s assistant. It fills the fields. We say which
                ones are empty.
              </p>
              <p className="text-dim">Not a course.</p>
              <p className="text-dim">Not &ldquo;you close Friday.&rdquo;</p>
              <p className="pt-4">
                We name the hole that kills the deal. And the stage that lies.
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
