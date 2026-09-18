import Link from "next/link";
import { DocsEnd } from "@/components/DocsEnd";
import { DocPage, DocSection, DocPrompt } from "@/components/DocPage";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbJsonLd,pageMeta } from "@/lib/docs";
export const metadata=pageMeta({title:"Review your pipeline with 3xrep",description:"Find what needs attention across your deals, question unsupported close dates, and prepare for the next 7 or 30 days.",path:"/docs/pipeline-review"});
export default function PipelineReviewPage(){return <>
  <JsonLd data={breadcrumbJsonLd([{name:"Guide",path:"/docs"},{name:"Your pipeline",path:"/docs/pipeline-review"}])}/>
  <DocPage title="See what needs attention across your deals." lead="A pipeline review should help you decide where to spend your time. Bring the deal context into your chat and ask what needs a closer look.">
    <DocSection title="Start with what the deals actually show."><p>Your CRM may say “proposal” while the person approving the purchase is still unknown. A close date may be entered before the buyer’s decision process is clear. 3xrep helps you spot those gaps and choose a next move for each deal.</p><DocPrompt>Review my open deals. Which ones need attention, and what should I do next?</DocPrompt></DocSection>
    <DocSection title="Use the view that fits your question."><p><strong>Today:</strong> prepare for the conversations and commitments in front of you.</p><p><strong>Next 7 days:</strong> see what needs preparing before it becomes urgent.</p><p><strong>Next 30 days:</strong> take a longer view of upcoming decisions and open questions.</p><p>A review across deals and a plan for your calendar answer different questions. Your assistant can use both when the relevant context is available.</p><DocPrompt>Look at the next 30 days. Which buyer decisions should I prepare for?</DocPrompt></DocSection>
    <DocSection title="Ask why a date or stage is uncertain."><p>The useful answer names the evidence and the question still open. For example: has the buyer confirmed who decides, what they need to see, and when they can make that decision?</p><p>3xrep does not turn those gaps into a made-up probability of winning. It gives you something to investigate or act on.</p></DocSection>
    <DocSection title="Keep the next review connected to the work."><p>When new information arrives, return to the deal in your chat. Where a stable CRM deal identifier is available, 3xrep keeps a compact record of gaps to support continuity.</p><p>Your assistant’s current context still matters. <Link href="/docs/gong-alternative">Read what 3xrep remembers</Link>.</p></DocSection>
    <DocsEnd />
  </DocPage>
</>;}
