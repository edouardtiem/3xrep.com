import Link from "next/link";
import { publicBetaOffer } from "@/lib/founding";
import { DocsEnd } from "@/components/DocsEnd";
import { DocPage, DocSection, DocPrompt } from "@/components/DocPage";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbJsonLd,pageMeta } from "@/lib/docs";
import { LIST_PRICE_USD } from "@/lib/stripe-checkout-session";
export const dynamic="force-dynamic";
export const metadata=pageMeta({title:"Beta, Founding 20 and pricing",description:"Understand the current beta offer, how Founding Workspaces are selected, and the standard price for your company.",path:"/docs/pricing"});
export default async function PricingPage(){
  const offer=await publicBetaOffer();
  return <>
    <JsonLd data={breadcrumbJsonLd([{name:"Guide",path:"/docs"},{name:"Beta & pricing",path:"/docs/pricing"}])}/>
    <DocPage title={offer.enabled ? "Help shape your sales buddy." : "One plan for your whole company."} lead={offer.enabled ? "Try 3xrep with real sales work. Tell us what helps, what misses, and what makes you come back. Full access during beta, without a credit card." : `The standard plan is $${LIST_PRICE_USD} a month per company, plus applicable tax. Start with a 14-day trial. No card needed to begin.`}>
      <DocSection title="What Founding 20 means.">
        <p>We are building 3xrep with up to 20 organizations using it in their day-to-day work. A selected Founding Workspace keeps its base plan free forever.</p>
        {offer.enabled ? <p>{offer.available ? "Founding places are available for review. Signing up does not reserve one." : "All 20 Founding places have been allocated. You can still join the beta while it is open, but new workspaces will not receive a free-forever place."}</p> : <p>Public beta enrollment is currently closed. Workspaces that have already earned Founding status keep their free-forever base plan.</p>}
        <p>Future optional extras may be paid. The Founding entitlement belongs to the organization, so it is not lost when one person leaves the team.</p>
      </DocSection>
      {offer.enabled ? <>
        <DocSection title="Use it. Come back. Tell us what happened."><p>Qualification looks for useful results across several sessions and days. Opening pages or signing up is not enough.</p><p>Once a workspace meets the usage criteria, we review it manually for a place. You receive confirmation if it is awarded. Qualification alone does not guarantee selection.</p></DocSection>
        <DocSection title="What happens after beta."><p>Your access deadline is shown when you join and in your workspace status. If you are not awarded a Founding place, you can choose whether to continue on the paid plan. We will not charge you automatically.</p><p>The standard price is ${LIST_PRICE_USD} a month for the whole company, plus applicable tax. There is no per-seat charge.</p></DocSection>
      </> : <DocSection title="How the standard trial works."><p>The 14 days start with your first deal review. After day 7, a card is required to continue the standard trial. Nothing is charged until the trial ends.</p><p>Use the payment link provided in your chat for your existing workspace. You do not need to create a second workspace to pay.</p></DocSection>}
      <DocSection title="Check your workspace whenever you need to."><p>Ask in the chat where you connected 3xrep. It can show your access, your beta deadline or your Founding number.</p><DocPrompt>What is my 3xrep workspace status?</DocPrompt><p>For setup help, use the <Link href="/install">connection guide</Link>. To understand what is stored, read <Link href="/docs/gong-alternative">context and privacy</Link>.</p></DocSection>
      <DocsEnd />
    </DocPage>
  </>;
}
