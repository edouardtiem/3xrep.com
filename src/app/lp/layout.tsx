import type { Metadata } from "next";
import type { ReactNode } from "react";
import { lpSans } from "@/lib/lp-font";

export const metadata: Metadata = {
  title: "3xrep — preview",
  robots: { index: false, follow: false },
};

export default function LpLayout({ children }: { children: ReactNode }) {
  return (
    <div className={`${lpSans.variable} lp-root flex min-h-full flex-1 flex-col`}>
      {children}
    </div>
  );
}
