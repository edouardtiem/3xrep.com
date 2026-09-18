"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { DOC_NAV } from "@/lib/docs";
import styles from "./docs.module.css";

export function DocsNav() {
  const path=usePathname();
  return <nav aria-label="Documentation" className={styles.nav}>
    <p className={styles.navTitle}>The 3xrep guide</p>
    <ul>{DOC_NAV.map(item=><li key={item.href}><Link href={item.href} aria-current={path===item.href ? "page" : undefined}>{item.label}</Link></li>)}</ul>
    <Link href="/install" className={styles.setup}>Connect 3xrep <span aria-hidden="true">↗</span></Link>
  </nav>;
}
