import Link from "next/link";
import styles from "./docs.module.css";
export function DocsEnd() {
  return <section className={styles.end}>
    <div><h2>Ready to try one deal?</h2><p>Get a private key, then start in your usual AI chat.</p></div>
    <Link href="/start" className={styles.button}>Get my key <span aria-hidden="true">↗</span></Link>
  </section>;
}
