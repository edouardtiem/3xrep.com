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
  const enrollmentOpen=offer.enabled && offer.available;
  return <>
    <JsonLd data={breadcrumbJsonLd([{name:"Guide",path:"/docs"},{name:"Beta & pricing",path:"/docs/pricing"}])}/>
    <DocPage title="The Beta: 20 teams, free forever." lead={enrollmentOpen ? "Use 3xrep on real deals during Beta, free and without a card. We select up to 20 teams after real use. Selected teams keep the base plan free forever." : "Beta enrollment is closed for now. Existing Beta workspaces keep the access deadline shown when they joined."}>
      <DocSection title="The 20 beta teams.">
        <p>We choose teams that use 3xrep on real sales work. Signing up alone does not reserve a place.</p>
        {!enrollmentOpen ? <p>{offer.enabled ? "All 20 free-forever places have been allocated. New enrollment is closed." : "New enrollment is closed. There is no standard trial signup while we recruit Beta teams."}</p> : null}
        <p>Future optional extras may be paid. The free-forever base plan belongs to the organization, so it is not lost when one person leaves the team.</p>
      </DocSection>
      <DocSection title="Use it. Come back. Tell us what happened."><p>Qualification looks for useful results across several sessions and days. Opening pages or signing up is not enough.</p><p>We review qualifying workspaces manually. We confirm a free-forever place if one is awarded; qualification alone does not guarantee selection.</p></DocSection>
      <DocSection title="What happens after beta."><p>Your access deadline is shown when you join and in your workspace status. If your team is not selected, you choose whether to continue on the paid plan. We do not charge you automatically.</p><p>The standard price is ${LIST_PRICE_USD} a month for the whole company, plus applicable tax. There is no per-seat charge.</p></DocSection>
      <DocSection title="Check your workspace whenever you need to."><p>Ask in the chat where you connected 3xrep. It can show your access, your beta deadline or your place number if selected.</p><DocPrompt>What is my 3xrep workspace status?</DocPrompt><p>For setup help, use the <Link href="/install">connection guide</Link>. To understand what is stored, read <Link href="/docs/gong-alternative">context and privacy</Link>.</p></DocSection>
      <DocsEnd />
    </DocPage>
  </>;
}
