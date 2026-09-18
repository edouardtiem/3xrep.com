import Link from "next/link";
import styles from "./docs.module.css";
export function DocsEnd() {
  return <section className={styles.end}>
    <div><h2>Bring your next deal.</h2><p>Start with one question in your usual AI chat.</p></div>
    <Link href="/start" className={styles.button}>Get started <span aria-hidden="true">↗</span></Link>
  </section>;
}
