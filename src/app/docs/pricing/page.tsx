import { publicBetaOffer } from "@/lib/founding";
export const dynamic = "force-dynamic";
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
    " a month for the whole company at the standard price. See the current beta or trial offer. He lives in your AI chat.",
  path: "/docs/pricing",
});

export default async function PricingPage() {
  const offer=await publicBetaOffer();
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
        lead={offer.enabled ? "Full access during beta. No credit card required. Founding 20 helps us learn from real sales work." : `$${LIST_PRICE_USD} a month for the whole company. Not per person who sells. 14 days free.`}
      >
        <DocSection title={offer.enabled ? "Founding 20" : "One price. The whole company."}>
          {offer.enabled ? <>
            <p>{offer.available ? "Use 3xrep across several days. If your organization qualifies and is selected for one of the 20 Founding places, its base plan stays free forever. A signup does not reserve a place." : "All 20 Founding places have been allocated. New workspaces can still use the beta while it is open, without a free-forever place."}</p>
            <p>Future optional extras may be paid. Your beta access deadline is shown when you join and in your workspace status. We will not charge you automatically.</p>
            <p>Standard price after beta: ${LIST_PRICE_USD} a month for the whole company, plus applicable tax.</p>
          </> : <>
            <p>One price, no matter how many people sell. ${LIST_PRICE_USD} a month for the whole company. Local currency at checkout.</p>
            <p>No card today. The 14 days start when you review a deal. Day 7: add a card (still $0 until day 14).</p>
          </>}
          <p className="text-dim text-[0.8125rem] leading-relaxed">{TRUST_LINE}</p>
          <p>Usage dates, feature counts and feedback you choose to share help us improve 3xrep. These are separate from the call text deleted after 14 days.</p>
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
