import type { ReactNode } from "react";
import { DocsNav } from "@/components/DocsNav";
import { Header } from "@/components/Header";
import styles from "@/components/docs.module.css";
export default function DocsLayout({ children }: { children:ReactNode }) {
  return <><a href="#docs-content" className={styles.skip}>Skip to the guide</a><Header /><div className={styles.shell}><DocsNav />{children}</div></>;
}
