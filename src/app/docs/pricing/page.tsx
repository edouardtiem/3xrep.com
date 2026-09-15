import { DocsEnd } from "@/components/DocsEnd";
import { DocPage, DocSection } from "@/components/DocPage";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbJsonLd, pageMeta } from "@/lib/docs";
import { LIST_PRICE_USD } from "@/lib/stripe-checkout-session";
import { TRUST_LINE } from "@/lib/copy";

export const metadata = pageMeta({
  title: "How much does 3xrep cost",
  description:
    "3xrep costs $" +
    LIST_PRICE_USD +
    " a month for the whole company. Not per person who sells. 14 days free. He lives in Claude or ChatGPT, next to HubSpot. We don't join your calls.",
  path: "/docs/pricing",
});

export default function PricingPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Docs", path: "/docs" },
          { name: "Pricing", path: "/docs/pricing" },
        ])}
      />
      <DocPage
        title="How much does 3xrep cost"
        lead={`$${LIST_PRICE_USD} a month for the whole company. Not per person who sells. 14 days free. He lives in Claude or ChatGPT, next to HubSpot. We don't join your calls.`}
      >
        <DocSection title="One price. The whole company.">
          <p>
            After the trial. One price, no matter how many people sell. Gong
            is about $1,250 a month for a team of ten. We are $
            {LIST_PRICE_USD} a month for the whole company. Local currency at
            checkout.
          </p>
          <p>
            No card today. The 14 days start when you review a deal. Day 7:
            add a card (still $0 until day 14).
          </p>
          <p className="text-dim text-[0.8125rem] leading-relaxed">{TRUST_LINE}</p>
        </DocSection>

        <DocSection title="What you are not paying for">
          <p>
            Not a call recorder. Not a tab inside HubSpot. He lives next to
            the file, in the assistant you already use.
          </p>
        </DocSection>

        <DocsEnd />
      </DocPage>
    </>
  );
}
