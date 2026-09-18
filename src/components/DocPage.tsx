import type { ReactNode } from "react";
import { CopyButton } from "@/components/CopyButton";
import styles from "./docs.module.css";

export function DocPage({ title, lead, children }: { title:string; lead:ReactNode; children:ReactNode }) {
  return <main id="docs-content" className={styles.article}>
    <header className={styles.intro}><h1>{title}</h1><p className={styles.lead}>{lead}</p></header>
    {children}
  </main>;
}
export function DocSection({ title, children }: { title?:string; children:ReactNode }) {
  return <section className={styles.section}>{title ? <h2>{title}</h2> : null}<div className={styles.body}>{children}</div></section>;
}
export function DocPrompt({ children }: { children:string }) {
  return <div className={styles.prompt}><p>“{children}”</p><CopyButton text={children} label="Copy" /></div>;
}
