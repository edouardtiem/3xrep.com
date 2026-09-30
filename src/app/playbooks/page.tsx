import Link from "next/link";
import { PLAYBOOKS } from "@/lib/playbooks/scenarios";
import { pageMeta, breadcrumbJsonLd } from "@/lib/docs";
import { JsonLd } from "@/components/JsonLd";
import styles from "@/components/playbooks/library.module.css";
export const metadata = pageMeta({ title: "Sales Strategy Library", description: "Explore practical B2B deal strategies: discovery questions, follow-up emails, price objections and buying decisions grounded in evidence.", path: "/playbooks" });
const groups = [
  { id: "discovery", title: "Prepare the discovery conversation", text: "Choose questions that establish the problem, its impact and the buyer’s next validation." },
  { id: "follow-up", title: "Follow up with a useful next step", text: "Reconnect a meeting, demo or unanswered proposal to the decision the buyer needs to make." },
  { id: "objections", title: "Understand what blocks the purchase", text: "Clarify the objection before choosing an answer or discussing a concession." },
  { id: "decision", title: "Move the buying decision forward", text: "Test support, reach the person who decides and agree the evidence an evaluation must produce." },
];
export default function LibraryPage() {
  return <main id="library-content" className={styles.page}>
    <JsonLd data={breadcrumbJsonLd([{ name: "Sales Strategy Library", path: "/playbooks" }])} />
    <div className={styles.intro}><h1>Sales Strategy Library</h1><p className={styles.answer}>A buyer problem. A decision to make. A next move grounded in evidence.</p><p className={styles.note}>Explore fictional software and cybersecurity deals with several stakeholders. See how new evidence changes the strategy, then bring the approach to your own deal.</p></div>
    {groups.map(group => <section key={group.id} className={styles.articleSection}><h2>{group.title}</h2><p>{group.text}</p><div className={styles.index}>{PLAYBOOKS.filter(page => page.topic === group.id).map(page => <Link key={page.slug} href={`/playbooks/${page.slug}`} className={styles.entry}><h3>{page.title}</h3><p><span className={styles.note}>{page.industry ?? "Business software"} · </span>{page.description}</p><span aria-hidden="true">↗</span></Link>)}</div></section>)}
    <section className={styles.articleSection}><h2>Start with the situation in front of you.</h2><p>Every guide is useful without an account. The interactive examples show supported evidence, assumptions and unknowns. Possible buyer replies are hypotheses to prepare for, not predictions.</p><p>Want to understand the frameworks? <Link href="/docs/methods">Read about the methods behind 3xrep</Link>.</p></section>
  </main>;
}
