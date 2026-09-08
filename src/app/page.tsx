import Link from "next/link";
import { LIST_PRICE_USD } from "@/lib/stripe-checkout-session";
import { CheckoutButton } from "@/components/CheckoutButton";
import { CopyButton } from "@/components/CopyButton";
import { SessionTerminal } from "@/components/SessionTerminal";
import { Wordmark } from "@/components/Wordmark";
import { WorksWith } from "@/components/WorksWith";
import { TRUST_LINE } from "@/lib/copy";
import { PROMPTS } from "@/lib/landing";
import { mcpUrl } from "@/lib/site";

export const metadata = {
  alternates: { canonical: "/" },
};

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
        <span className="text-dim text-xs tracking-wide uppercase">
          {label}
        </span>
        <CopyButton text={value} />
      </div>
      <pre className="overflow-x-auto px-3 py-3 text-[0.8125rem] leading-relaxed whitespace-pre-wrap">
        {value}
      </pre>
    </div>
  );
}

function HeroPitch({ connector }: { connector: string }) {
  return (
    <>
      <p className="text-mute leading-relaxed">
        Your CRM is green because someone ticked a box. This agent reads
        the calls behind the fields and says what your CRM can&apos;t:
        this stage is a lie. He won&apos;t go easy on you. That&apos;s
        why it works.
      </p>
      <div className="mt-8">
        <CopyBlock label="Connector URL" value={connector} />
      </div>
    </>
  );
}

export default function Home() {
  const connector = mcpUrl();

  return (
    <div className="flex flex-1 flex-col">
      <header className="mx-auto flex w-full items-baseline justify-between px-5 py-6">
        <Link href="/" aria-label="3xrep">
          <Wordmark />
        </Link>
        <Link href="/docs">
          docs
        </Link>
      </header>

      <main className="mx-auto flex w-full flex-1 flex-col px-5 pt-24 pb-24">
        <div className="flex flex-col lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:grid-rows-[auto_auto] lg:items-start lg:gap-x-12">
          <div className="order-1 lg:min-h-[calc(100svh-5.5rem)] lg:w-full lg:max-w-[24rem] lg:justify-self-end">
            <h1 className="text-[1.75rem] leading-[1.2] tracking-tight sm:text-[2rem]">
              Hire the VP Sales agent
              <br />
              who doesn&apos;t believe your CRM
              <br />
              and make you sign more deals.
            </h1>
            <p className="text-dim mt-3 italic">
              From ${LIST_PRICE_USD}/month. For the entire organization.
            </p>
            <div className="mt-6 hidden lg:block">
              <HeroPitch connector={connector} />
            </div>
          </div>

          <div className="order-2 mt-10 min-w-0 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:mt-0 lg:w-full lg:self-stretch">
            <div className="lg:sticky lg:top-24">
              <SessionTerminal />
              <WorksWith />
            </div>
          </div>

          <div className="order-3 mt-6 lg:hidden">
            <HeroPitch connector={connector} />
          </div>

          <div className="order-4 mt-10 lg:col-start-1 lg:row-start-2 lg:mt-8 lg:w-full lg:max-w-[24rem] lg:justify-self-end">
            <section>
              <p className="leading-relaxed">Where he lives.</p>
              <p className="text-dim mt-2 leading-relaxed">
                Not in your CRM. In your agent — one MCP URL, next to the
                CRM connector you already have. Nothing to install in HubSpot.
                No 3xrep tab. He reads the deal through your CRM and judges
                it in your terminal.
              </p>
              <pre className="text-dim mt-5 overflow-x-auto text-[0.8125rem] leading-[1.6]">
                <span className="text-foreground">your agent</span>
                {"   Claude · ChatGPT · Cursor · Notion…\n"}
                {" ├─ "}
                <span className="text-foreground">your CRM</span>
                {"  HubSpot · Salesforce · Pipedrive · Attio…\n"}
                {" └─ "}
                <span className="text-copper">3xrep</span>
                {"     one URL → the verdict"}
              </pre>
              <p className="text-dim mt-4 leading-relaxed">
                He needs both. Without your CRM connected, he has nothing to
                read.
              </p>
            </section>

            <section className="mt-10">
              <p className="leading-relaxed">What the VP says.</p>
              <p className="text-dim mt-2 leading-relaxed">
                From a Monday pipe review to one call.
              </p>
              <ul className="mt-6 divide-y divide-line border-y border-line">
                {PROMPTS.map((prompt, i) => (
                  <li
                    key={prompt}
                    className="flex items-baseline gap-3 py-2.5"
                  >
                    <span className="text-dim w-5 shrink-0 text-xs">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <p className="min-w-0 flex-1 leading-snug">
                      {prompt}
                    </p>
                    <CopyButton text={prompt} />
                  </li>
                ))}
              </ul>
            </section>

            <section className="mt-16 border-t border-line pt-8">
              <p className="text-dim text-xs tracking-wide uppercase">
                Already in?
              </p>
              <p className="mt-2">
                From ${LIST_PRICE_USD} / month / organization. Local currency and language at checkout.
              </p>
              <p className="text-dim mt-2 leading-relaxed">
                Gong is ~$1,500 a seat and records your calls. Here it&apos;s
                ${LIST_PRICE_USD} for the whole pipe, no seats.
              </p>
              <div className="mt-5">
                <CheckoutButton label={`Pay $${LIST_PRICE_USD} / month / org`} />
              </div>
            </section>

            <section className="mt-12 space-y-2 leading-relaxed">
              <p className="text-dim">Not Gong. We don&apos;t join your calls.</p>
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

      <footer className="text-dim mx-auto w-full px-5 pb-10 text-xs leading-relaxed">
        {TRUST_LINE}
      </footer>
    </div>
  );
}
