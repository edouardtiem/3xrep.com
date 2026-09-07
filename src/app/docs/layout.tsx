import type { ReactNode } from "react";
import { DocsNav } from "@/components/DocsNav";
import { Header } from "@/components/Header";

export default function DocsLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      <DocsNav />
      {children}
    </>
  );
}
