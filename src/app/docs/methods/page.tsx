import { DocsEnd } from "@/components/DocsEnd";
import { DocPage,DocSection } from "@/components/DocPage";
import { JsonLd } from "@/components/JsonLd";
import { METHOD_FAMILIES,breadcrumbJsonLd,pageMeta } from "@/lib/docs";
import styles from "@/components/docs.module.css";
export const metadata=pageMeta({title:"The sales methods behind 3xrep",description:"How 3xrep uses sales methods to explain a recommendation and adapt it to the deal in front of you.",path:"/docs/methods"});
export default function MethodsPage(){return <>
  <JsonLd data={breadcrumbJsonLd([{name:"Guide",path:"/docs"},{name:"Sales methods",path:"/docs/methods"}])}/>
  <DocPage title="A reason behind the recommendation." lead="Sales methods help 3xrep explain why a question matters or a next step is worth taking. The advice should fit your deal, from a short buying cycle to a decision involving several people.">
    <DocSection title="The method helps you ask a better question."><p>Suppose you know who uses the product, but not who approves the purchase. Different methods give that question different names: Economic Buyer in MEDDIC, Authority in BANT, Decision-makers in BEBEDC.</p><p>The practical next step is to clarify how the purchase gets approved. You can use that advice without memorizing a framework.</p></DocSection>
    <DocSection title="Explore the methods by what they help with."><p>Open a group to see the ideas behind the advice. These are reference descriptions, not a checklist every deal must follow.</p>
      <div className={styles.reference}>{METHOD_FAMILIES.map(family=><details key={family.title}><summary>{family.title}</summary><p>{family.lead}</p><dl>{family.methods.map(method=><div key={method.name}><dt>{method.name}</dt><dd className={styles.parts}>{method.parts}</dd><dd>{method.forces}</dd></div>)}</dl></details>)}</div>
    </DocSection>
    <DocSection title="The evidence still comes first."><p>A framework does not prove that a deal is ready to progress. 3xrep works from the context available, distinguishes assumptions from support, and asks for what is missing.</p><p>As new information arrives, the recommendation can change. A useful method helps explain that change.</p></DocSection>
    <DocsEnd />
  </DocPage>
</>;}
