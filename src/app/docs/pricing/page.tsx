import Link from "next/link";
import { publicBetaOffer } from "@/lib/founding";
import { DocsEnd } from "@/components/DocsEnd";
import { DocPage, DocSection, DocPrompt } from "@/components/DocPage";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbJsonLd,pageMeta } from "@/lib/docs";
import { LIST_PRICE_USD } from "@/lib/stripe-checkout-session";
export const dynamic="force-dynamic";
export const metadata=pageMeta({title:"Beta and pricing",description:"Learn how 20 teams can earn a free-forever base plan through real use, and see the standard price.",path:"/docs/pricing"});
export default async function PricingPage(){
  const offer=await publicBetaOffer();
  return <>
    <JsonLd data={breadcrumbJsonLd([{name:"Guide",path:"/docs"},{name:"Beta & pricing",path:"/docs/pricing"}])}/>
    <DocPage title={offer.enabled ? "Help shape your sales buddy." : "One plan for your whole company."} lead={offer.enabled ? "Try 3xrep with real sales work. Tell us what helps, what misses, and what makes you come back. Full access during beta, without a credit card." : `The standard plan is $${LIST_PRICE_USD} a month per company, plus applicable tax. Start with a 14-day trial. No card needed to begin.`}>
      <DocSection title="The 20 beta teams.">
        <p>We are looking for 20 teams to shape 3xrep through real sales work. Teams selected after using it keep the base plan free forever.</p>
        {offer.enabled ? <p>{offer.available ? "Signing up does not reserve a place. We select teams after meaningful use." : "All 20 free-forever places have been allocated. You can still join the beta while it is open."}</p> : <p>Beta enrollment is not open yet. You can start a 14-day trial now, but a trial does not reserve a place.</p>}
        <p>Future optional extras may be paid. The free-forever base plan belongs to the organization, so it is not lost when one person leaves the team.</p>
      </DocSection>
      {offer.enabled ? <>
        <DocSection title="Use it. Come back. Tell us what happened."><p>Qualification looks for useful results across several sessions and days. Opening pages or signing up is not enough.</p><p>Once a workspace meets the usage criteria, we review it manually for a place. You receive confirmation if it is awarded. Qualification alone does not guarantee selection.</p></DocSection>
        <DocSection title="What happens after beta."><p>Your access deadline is shown when you join and in your workspace status. If your team is not selected for a free-forever place, you can choose whether to continue on the paid plan. We will not charge you automatically.</p><p>The standard price is ${LIST_PRICE_USD} a month for the whole company, plus applicable tax. There is no per-seat charge.</p></DocSection>
      </> : <DocSection title="How the standard trial works."><p>The 14 days start with your first deal review. After day 7, a card is required to continue. Without a card, access pauses and there is no charge.</p><p>If you add a card with at least 48 hours left in the trial, the ${LIST_PRICE_USD} monthly plan starts when the trial ends, plus applicable tax. If less than 48 hours remain, checkout may start billing immediately. The payment page shows the billing start. Use the link in your chat for your existing workspace.</p></DocSection>}
      <DocSection title="Check your workspace whenever you need to."><p>Ask in the chat where you connected 3xrep. It can show your access, your beta deadline or your place number if selected.</p><DocPrompt>What is my 3xrep workspace status?</DocPrompt><p>For setup help, use the <Link href="/install">connection guide</Link>. To understand what is stored, read <Link href="/docs/gong-alternative">context and privacy</Link>.</p></DocSection>
      <DocsEnd />
    </DocPage>
  </>;
}
