import Link from "next/link";
import { DocsEnd } from "@/components/DocsEnd";
import { DocPage, DocSection, DocPrompt } from "@/components/DocPage";
import { JsonLd } from "@/components/JsonLd";
import { Blob } from "@/components/buddy/Blob";
import { Hand } from "@/components/buddy/Hand";
import { DOC_FAQ, breadcrumbJsonLd, faqJsonLd, pageMeta, softwareJsonLd } from "@/lib/docs";
import styles from "@/components/docs.module.css";

export const metadata=pageMeta({title:"Your guide to 3xrep",description:"Get your sales buddy ready, find a useful first question, and make 3xrep part of your sales day.",path:"/docs"});
const guides=[
  {href:"/docs/how-it-works",title:"Get to know your sales buddy",description:"How your context becomes a useful next move."},
  {href:"/docs/use-cases",title:"Find your first question",description:"Start the day, prepare a call, or work through a reply."},
  {href:"/docs/pipeline-review",title:"Look beyond today",description:"Review your deals and prepare for the next 7 or 30 days."},
  {href:"/docs/methods",title:"Understand the advice",description:"The sales methods behind a question or recommendation."},
  {href:"/docs/gong-alternative",title:"Know what happens to your context",description:"Call notes, recordings, memory and privacy."},
  {href:"/docs/pricing",title:"Beta, Founding 20 & pricing",description:"What is included, how places are awarded, and what comes next."},
];
export default function DocsPage() {
  return <>
    <JsonLd data={breadcrumbJsonLd([{name:"Guide",path:"/docs"}])} /><JsonLd data={faqJsonLd()} /><JsonLd data={softwareJsonLd()} />
    <DocPage title="A little help for your sales day." lead="Your sales buddy helps you work out what deserves attention, why it matters, and what to do next. Here’s how to bring 3xrep into the chat where you already work.">
      <DocSection title="Start with the deal in front of you.">
        <p>Connect 3xrep alongside your CRM in your AI assistant. In Claude, add your inbox and calendar when available. Then ask about your day, an upcoming call, or a buyer’s latest reply.</p>
        <DocPrompt>Morning. What needs my attention today?</DocPrompt>
        <p>New here? <Link href="/install">Follow the connection guide</Link>. Already connected? <Link href="/docs/use-cases">Find a question to try</Link>.</p>
      </DocSection>
      <div className={styles.welcome}><Blob pose="note" /><Hand className={styles.hand}>One useful next move. Then the next.</Hand></div>
      <nav aria-label="Explore the guide" className={styles.guides}>{guides.map(item=><Link className={styles.guide} key={item.href} href={item.href}><strong>{item.title}</strong><span>{item.description}</span><span aria-hidden="true">↗</span></Link>)}</nav>
      <DocSection title="A few things to know">
        <div className={styles.faq}>{DOC_FAQ.map(row=><details key={row.q}><summary>{row.q}</summary><p>{row.a}</p></details>)}</div>
      </DocSection>
      <DocsEnd />
    </DocPage>
  </>;
}
