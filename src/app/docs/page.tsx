import Link from "next/link";
import { DocsEnd } from "@/components/DocsEnd";
import { DocPage, DocSection, DocPrompt } from "@/components/DocPage";
import { JsonLd } from "@/components/JsonLd";
import { Blob } from "@/components/buddy/Blob";
import { Hand } from "@/components/buddy/Hand";
import { DOC_FAQ, breadcrumbJsonLd, faqJsonLd, pageMeta, softwareJsonLd } from "@/lib/docs";
import styles from "@/components/docs.module.css";

export const metadata=pageMeta({title:"Start with 3xrep",description:"Start with one deal, see what 3xrep can help you decide, and find setup or pricing details when you need them.",path:"/docs"});
const guides=[
  {href:"/docs/how-it-works",title:"How it works",description:"What your assistant brings, what 3xrep adds, and what you decide."},
  {href:"/docs/use-cases",title:"Questions to try",description:"A few ways to start with a real deal."},
  {href:"/docs/pipeline-review",title:"Across your deals",description:"Find where to focus today or prepare ahead."},
  {href:"/docs/gong-alternative",title:"Privacy and memory",description:"What is stored, for how long, and what stays in your hands."},
  {href:"/docs/pricing",title:"Beta and pricing",description:"How the 20 teams are selected and what follows Beta."},
  {href:"/docs/methods",title:"Sales methods",description:"Optional background on how 3xrep reasons."},
];
export default function DocsPage() {
  return <>
    <JsonLd data={breadcrumbJsonLd([{name:"Guide",path:"/docs"}])} /><JsonLd data={faqJsonLd()} /><JsonLd data={softwareJsonLd()} />
    <DocPage title="One deal is enough to start." lead="You do not need to read every guide or learn a sales method. Bring a real deal to your AI chat and ask 3xrep what to do next.">
      <DocSection title="Already connected? Ask this.">
        <DocPrompt>How should I move this deal forward, and what should I say?</DocPrompt>
        <p>3xrep works from the context your assistant can access. If a detail is missing, it should tell you what to find out first.</p>
      </DocSection>
      <DocSection title="New to 3xrep?">
        <p><Link href="/start">Check Beta enrollment</Link> to get a private key. Then add 3xrep to Claude and start with your deal notes. <Link href="/install">See the connection steps</Link>.</p>
      </DocSection>
      <div className={styles.welcome}><Blob pose="note" /><Hand className={styles.hand}>One useful next move. Then the next.</Hand></div>
      <nav aria-label="Explore the guide" className={styles.guides}>{guides.map(item=><Link className={styles.guide} key={item.href} href={item.href}><strong>{item.title}</strong><span>{item.description}</span><span aria-hidden="true">↗</span></Link>)}</nav>
      <DocSection title="Quick answers">
        <div className={styles.faq}>{DOC_FAQ.map(row=><details key={row.q}><summary>{row.q}</summary><p>{row.a}</p></details>)}</div>
      </DocSection>
      <DocsEnd />
    </DocPage>
  </>;
}
