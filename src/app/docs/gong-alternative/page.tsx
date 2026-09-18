import Link from "next/link";
import { DocsEnd } from "@/components/DocsEnd";
import { DocPage,DocSection } from "@/components/DocPage";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbJsonLd,pageMeta } from "@/lib/docs";
export const metadata=pageMeta({title:"Call notes, memory and privacy",description:"How 3xrep uses the context you bring, what it remembers, and how it fits alongside your existing call-recording tools.",path:"/docs/gong-alternative"});
export default function ContextPage(){return <>
  <JsonLd data={breadcrumbJsonLd([{name:"Guide",path:"/docs"},{name:"Context & privacy",path:"/docs/gong-alternative"}])}/>
  <DocPage title="Your sales context stays yours." lead="3xrep helps you work with the notes, messages and deal details available in your AI chat. You choose the tools you connect and the context you bring.">
    <DocSection title="Bring the call back to your chat."><p>If your notes or transcript are already accessible through your CRM or another connected tool, your assistant can use them. You can also paste notes into your own chat when needed.</p><p>3xrep does not join meetings or record audio. It receives the relevant context your assistant sends to its tools.</p></DocSection>
    <DocSection title="If you already use Gong or a notetaker."><p>Keep the setup that captures your conversations. 3xrep helps with the next step once the relevant notes or transcript are available to your assistant.</p><p>It is not a replacement for a recording library or a manager’s call-review workflow. You do not need to change your recording tool just to try it.</p></DocSection>
    <DocSection title="What is kept, and for how long."><p><strong>Tool inputs and results:</strong> retained for 14 days to improve 3xrep, then deleted. This can include call text when your assistant sends it.</p><p><strong>A compact record of deal gaps:</strong> kept beyond those 14 days to support continuity when the deal can be identified. It does not contain the transcript.</p><p><strong>Usage and optional feedback:</strong> dates, features used and feedback you choose to share are stored separately to understand whether 3xrep is useful over time.</p><p>There is no permanent call archive in 3xrep.</p></DocSection>
    <DocSection title="You stay in control of the next action."><p>3xrep does not fetch your inbox itself or write to your CRM. Your assistant uses the connectors available in your workspace. You review drafts and approve any changes through your own tools.</p><p><Link href="/docs/how-it-works">See how the tools work together</Link>.</p></DocSection>
    <DocsEnd />
  </DocPage>
</>;}
