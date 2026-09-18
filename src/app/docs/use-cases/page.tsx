import { DocsEnd } from "@/components/DocsEnd";
import { DocPage, DocSection, DocPrompt } from "@/components/DocPage";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbJsonLd, pageMeta } from "@/lib/docs";
import styles from "@/components/docs.module.css";
export const metadata=pageMeta({title:"Questions to try with 3xrep",description:"Useful starting points for your sales day: morning priorities, call preparation, next steps, buyer objections and follow-ups.",path:"/docs/use-cases"});
const cases=[
  {title:"Start the day with a priority.",body:"Bring your calendar, recent messages and open deals through the tools connected to your assistant. 3xrep helps you prepare for what is coming and see what needs attention first.",prompt:"Morning. What needs my attention today?"},
  {title:"Go into the call with a useful question.",body:"Work from the latest notes and what you already know about the buyer. Find the question that would help you understand their situation or move the conversation forward.",prompt:"Help me prepare for my next call. What do I need to find out?"},
  {title:"Turn the call into a next step.",body:"Bring the notes or transcript into your usual chat. 3xrep helps separate what became clearer from what still needs an answer, then suggests what to do next.",prompt:"Here are the notes from my call. What changed, and what should I do next?"},
  {title:"Know what to do when they go quiet.",body:"Start with their last message and what you promised. You may owe them an answer before they owe you a reply. The recommendation follows the evidence in the conversation.",prompt:"This buyer has gone quiet. Based on our last exchange, what is the useful next move?"},
  {title:"Understand the objection before answering.",body:"Share the buyer’s actual words and the surrounding context. If price is the objection, explore what they are comparing it with and whether the value is clear before choosing a response.",prompt:"They said it is too expensive. Help me understand what to clarify before I respond."},
  {title:"Look ahead while there is time to prepare.",body:"Review the next week or month using the context available in your assistant. See which conversations need preparation and which questions could hold a deal up.",prompt:"Look at the next 7 days. What should I prepare now?"},
];
export default function UseCasesPage(){return <>
  <JsonLd data={breadcrumbJsonLd([{name:"Guide",path:"/docs"},{name:"Questions to try",path:"/docs/use-cases"}])}/>
  <DocPage title="A question for the moment you’re in." lead="You do not need a special script. Start with what happened, what is coming up, or the part of a deal you are unsure about.">
    <p className={styles.note}>These are starting prompts, not sample results. The answer depends on the context your assistant can access.</p>
    {cases.map(item=><DocSection key={item.title} title={item.title}><p>{item.body}</p><DocPrompt>{item.prompt}</DocPrompt></DocSection>)}
    <DocSection title="Come back with what happened."><p>The buyer replied. Someone new joined the conversation. The meeting moved. Bring that change back to your chat so the next recommendation can account for it.</p><p>If advice helped or missed the mark, say so. Your assistant can offer to save your feedback. You choose whether to share it.</p></DocSection>
    <DocsEnd />
  </DocPage>
</>;}
