import type { ReactNode } from "react";
import { Header } from "@/components/Header";
import styles from "@/components/docs.module.css";
export default function PlaybooksLayout({ children }: { children: ReactNode }) {
  return <><a href="#library-content" className={styles.skip}>Skip to content</a><Header />{children}</>;
}
