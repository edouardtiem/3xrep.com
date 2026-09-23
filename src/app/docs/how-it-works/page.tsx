import Link from "next/link";
import { DocsEnd } from "@/components/DocsEnd";
import { DocPage, DocSection, DocPrompt } from "@/components/DocPage";
import { JsonLd } from "@/components/JsonLd";
import { TOOLS, breadcrumbJsonLd, pageMeta } from "@/lib/docs";
import styles from "@/components/docs.module.css";
export const metadata=pageMeta({title:"How 3xrep works",description:"Your AI brings the context. 3xrep helps you find the priority, understand what is missing, and choose a next move.",path:"/docs/how-it-works"});
export default function HowItWorksPage(){return <>
  <JsonLd data={breadcrumbJsonLd([{name:"Guide",path:"/docs"},{name:"How it works",path:"/docs/how-it-works"}])}/>
  <DocPage title="Your context. A clearer next move." lead="Your CRM, inbox and calendar tell your AI what happened. 3xrep adds sales judgment so you can decide what deserves attention next.">
    <DocSection title="It starts in your usual chat.">
      <p>Add 3xrep as a connector in your AI assistant, alongside the tools you use for work. Your assistant brings the relevant notes, messages and deal details to 3xrep. You keep talking in the same chat.</p>
      <p>Start in Claude Cowork or ChatGPT Work on your computer. Your assistant first asks about you and your company, then helps you choose a local folder for working notes. Add your CRM, inbox and calendar next. <Link href="/install">See the connection steps</Link>.</p>
      <p className={styles.note}>ChatGPT Work setup is documented; end-to-end validation is still in progress. Availability depends on your workspace and connectors.</p>
    </DocSection>
    <DocSection title="Ask about a real moment.">
      <p>Before a call, bring the latest deal context. After it, bring what the buyer said. When they reply, return to the conversation. New evidence can change the advice.</p>
      <DocPrompt>They asked for a proposal. What should I clarify before sending it?</DocPrompt>
    </DocSection>
    <DocSection title="Get an action and a reason.">
      <p>3xrep looks at what is supported by the available evidence, what is still an assumption, and what needs clarifying. It recommends a sales move and explains the reasoning behind it.</p>
      <p>For example, a buyer asking for a proposal may still leave a question open: who will approve the purchase? The next useful step could be bringing that person into the conversation.</p>
      <p>If information is missing, 3xrep says so. It can still help with the available context, without inventing a quote or treating a CRM field as proof.</p>
    </DocSection>
    <DocSection title="You decide what happens next.">
      <p>Your AI can help draft a reply or prepare a note from the recommendation. You review it and decide what to send. Changes to your CRM happen through your own tools, with your approval.</p>
      <p>3xrep does not join calls or write to your CRM. <Link href="/docs/gong-alternative">Read how context and memory are handled</Link>.</p>
    </DocSection>
    <DocSection title="If you want to see the tools">
      <div className={styles.reference}><details><summary>The tools your assistant uses</summary><dl>{TOOLS.map(([name,job])=><div key={name}><dt><code>{name}</code></dt><dd>{job}</dd></div>)}</dl></details></div>
      <p>You do not need to remember their names. Ask in your own words. The <Link href="/spec">agent setup instructions</Link> describe how your assistant should use them.</p>
    </DocSection>
    <DocsEnd />
  </DocPage>
</>;}
