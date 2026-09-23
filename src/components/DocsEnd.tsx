import Link from "next/link";
import styles from "./docs.module.css";
export function DocsEnd() {
  return <section className={styles.end}>
    <div><h2>Ready to try one deal?</h2><p>Check Beta enrollment, then start in your usual AI chat.</p></div>
    <Link href="/start" className={styles.button}>See Beta status <span aria-hidden="true">↗</span></Link>
  </section>;
}
