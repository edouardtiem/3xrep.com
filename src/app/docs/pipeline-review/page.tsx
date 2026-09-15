import { DocsEnd } from "@/components/DocsEnd";
import { DocPage, DocSection } from "@/components/DocPage";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbJsonLd, pageMeta } from "@/lib/docs";
import { LIST_PRICE_USD } from "@/lib/stripe-checkout-session";
import { TRUST_LINE } from "@/lib/copy";

export const metadata = pageMeta({
  title: "AI that reviews the pipeline and says which stages are a lie",
  description:
    "Deal stuck after discovery. The CRM is still green. A director who names the stage that isn't true and the close date that is a guess. It does not record calls. From $" +
    LIST_PRICE_USD +
    " a month for the whole company.",
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
      <DocPage
        title="AI that reviews the pipeline and says which stages are a lie"
        lead={`HubSpot is green because someone ticked a box. He reads the calls already on the record — through your connector, not ours — and names the stage that isn't true. Discovery happened. Nobody who can sign. The close date is a guess. $${LIST_PRICE_USD} a month for the whole company.`}
      >
        <DocSection title="What a Monday review actually returns">
          <p>
            Not a forecast. Not a percentage. Four written cuts: the list, at
            risk, this month, this month at risk. Then each file: a sales
            move, a date in the prospect&apos;s calendar. Solid or fragile.
            One house rule.
          </p>
          <p className="text-dim text-[0.8125rem] leading-relaxed">{TRUST_LINE}</p>
        </DocSection>

        <DocSection title="Not a recorder. Not a coaching tab.">
          <p>
            We do not join the call. We do not score talk-to-listen. We do not
            write the stage back to HubSpot. If you want a note on the deal,
            Claude writes it through HubSpot, after you confirm.
          </p>
        </DocSection>

        <DocsEnd />
      </DocPage>
    </>
  );
}
