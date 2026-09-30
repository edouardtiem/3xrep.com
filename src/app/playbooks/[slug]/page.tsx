import Link from "next/link";
import { notFound } from "next/navigation";
import { PLAYBOOKS, findPlaybook } from "@/lib/playbooks/scenarios";
import { calculatePlaybook } from "@/lib/playbooks/calculate";
import { DealExplorer } from "@/components/playbooks/DealExplorer";
import { JsonLd } from "@/components/JsonLd";
import { pageMeta, breadcrumbJsonLd } from "@/lib/docs";
import styles from "@/components/playbooks/library.module.css";

export const dynamicParams = false;
export function generateStaticParams() { return PLAYBOOKS.map(page => ({ slug: page.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const page = findPlaybook((await params).slug);
  if (!page) notFound();
  return pageMeta({ title: page.title, description: page.description, path: `/playbooks/${page.slug}` });
}
export default async function PlaybookPage({ params }: { params: Promise<{ slug: string }> }) {
  const page = findPlaybook((await params).slug);
  if (!page) notFound();
  const states = calculatePlaybook(page);
  return <main id="library-content" className={styles.page}>
    <JsonLd data={breadcrumbJsonLd([{ name: "Sales Strategy Library", path: "/playbooks" }, { name: page.title, path: `/playbooks/${page.slug}` }])} />
    <nav aria-label="Breadcrumb" className={styles.breadcrumb}><Link href="/playbooks">Sales Strategy Library</Link></nav>
    <div className={styles.intro}><h1>{page.title}</h1><p className={styles.answer}>{page.answer}</p></div>
    <section className={styles.articleSection}><h2>A practical way to approach it</h2><ol className={styles.steps}>{page.steps.map(step => <li key={step.title}><h3>{step.title}</h3><p>{step.text}</p></li>)}</ol></section>
    {page.examples && <section className={styles.articleSection}><h2>Examples to adapt to your buyer</h2>{page.examples.map(example => <div key={example.title}><h3>{example.title}</h3><p className={styles.prompt}>{example.text}</p></div>)}</section>}
    <section className={styles.articleSection}><h2>Meet the fictional deal.</h2><p>{page.context}</p><p className={styles.note}>{page.buyingContext ?? "Software purchase · Multiple stakeholders"}. The declared context guides method selection; it does not prove any part of the buying decision.</p><dl className={styles.actors}>{page.actors.map(actor => <div key={actor.name}><dt>{actor.name}</dt><dd className={styles.role}>{actor.role}</dd><dd>{actor.limit}</dd></div>)}</dl></section>
    <DealExplorer states={states} prompt={page.prompt} />
    <section className={styles.articleSection}><h2>Where this approach has limits</h2><p>{page.limits}</p><ul className={styles.links}>{page.sources.map(source => <li key={source.href}><a href={source.href}>{source.label}</a></li>)}</ul><p><Link href="/docs/methods">Explore the methods behind the recommendation</Link>.</p></section>

    <section className={styles.articleSection}><h2>Explore another sales strategy.</h2><ul className={styles.links}>{PLAYBOOKS.filter(item => item.slug !== page.slug).map(item => <li key={item.slug}><Link href={`/playbooks/${item.slug}`}>{item.title}</Link></li>)}</ul></section>
  </main>;
}
