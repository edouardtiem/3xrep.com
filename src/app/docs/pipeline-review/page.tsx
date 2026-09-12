import Link from "next/link";
import { DocsEnd } from "@/components/DocsEnd";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbJsonLd, pageMeta } from "@/lib/docs";
import { LIST_PRICE_USD } from "@/lib/stripe-checkout-session";
import { TRUST_LINE } from "@/lib/copy";

export const metadata = pageMeta({
  title: "AI that reviews the pipeline and says which stages are a lie",
  description:
    "Deal stuck after discovery. The CRM is still green. A VP Sales agent that names the illegal stage and the close date that is a claim. It does not record calls. From $" +
    LIST_PRICE_USD +
    "/month for the organization.",
  path: "/docs/pipeline-review",
});

export default function PipelineReviewPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Docs", path: "/docs" },
          { name: "Pipeline review", path: "/docs/pipeline-review" },
        ])}
      />
      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-10 px-6 py-16 leading-relaxed">
        <div>
          <h1 className="text-[1.75rem] leading-[1.2] tracking-tight sm:text-[2rem]">
            AI that reviews the pipeline and says which stages are a lie
          </h1>
          <p className="text-mute mt-4 max-w-[36rem]">
            The CRM is green because someone ticked a box. This agent reads
            the calls, notes, and mails already on the record — through{" "}
            <em>your</em> CRM connector, not ours — and names the stage that
            is illegal. Discovery happened. Nobody who can sign. The close
            date is a claim. From ${LIST_PRICE_USD}/month for the entire
            organization.
          </p>
        </div>

        <section className="space-y-2">
          <h2 className="text-lg">What a Monday review actually returns</h2>
          <p className="text-dim">
            Not a forecast. Not a percentage. Which stage has no buyer who
            can sign. Which close date nobody on their side named. Which
            hole repeats across the pipe. Then one process change — a
            question that is mandatory, a stage to gate or drop.
          </p>
          <p className="text-dim">{TRUST_LINE}</p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg">Not a recorder. Not a coaching tab.</h2>
          <p className="text-dim">
            We do not join the call. We do not score talk-to-listen. We do
            not write the stage back to HubSpot or Salesforce. If you want
            a note on the deal, your agent writes it through the CRM
            connector, after you confirm.
          </p>
        </section>

        <p>
          <Link href="/install" className="text-foreground hover:underline">
            Install
          </Link>
          <span className="text-dim"> — one URL, next to your CRM.</span>
        </p>
      </main>
      <DocsEnd />
    </>
  );
}
