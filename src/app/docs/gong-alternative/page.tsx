import { DocsEnd } from "@/components/DocsEnd";
import { DocPage, DocSection } from "@/components/DocPage";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbJsonLd, pageMeta } from "@/lib/docs";
import { LIST_PRICE_USD } from "@/lib/stripe-checkout-session";
import { TRUST_LINE } from "@/lib/copy";

export const metadata = pageMeta({
  title: "Gong alternative that doesn't record calls",
  description:
    "Gong records your calls, about $1,250 a month for a team of ten. 3xrep does not join them. He lives in Claude or ChatGPT, next to HubSpot. $" +
    LIST_PRICE_USD +
    " a month for the whole company.",
  path: "/docs/gong-alternative",
});

export default function GongAlternativePage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Docs", path: "/docs" },
          { name: "Gong alternative", path: "/docs/gong-alternative" },
        ])}
      />
      <DocPage
        title="A Gong alternative that doesn't record calls"
        lead={`Gong records the call. Most “no bot” tools still capture audio. 3xrep does not join the call. He lives in Claude or ChatGPT, next to HubSpot. $${LIST_PRICE_USD} a month for the whole company.`}
      >
        <DocSection title="What he judges">
          <p>
            HubSpot is green because someone ticked a box. He reads the calls,
            notes, and mails already on the record — through your connector,
            not ours — and names the stage that isn&apos;t true. Nobody who
            can sign. A close date that is a guess. What repeats.
          </p>
          <p className="text-dim text-[0.8125rem] leading-relaxed">{TRUST_LINE}</p>
        </DocSection>

        <DocSection title="Not a recorder. Not a seat tax.">
          <p>
            We do not replace Gong. We do not score talk-to-listen. We do not
            write back to HubSpot. If you want a note on the deal, Claude
            writes it through HubSpot, after you confirm.
          </p>
          <p>
            Gong is about $1,250 a month for a team of ten. We are $
            {LIST_PRICE_USD} a month for the whole company.
          </p>
        </DocSection>

        <DocsEnd />
      </DocPage>
    </>
  );
}
