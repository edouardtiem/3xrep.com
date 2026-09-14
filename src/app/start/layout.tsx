import type { ReactNode } from "react";
import { lpSans } from "@/lib/lp-font";

export default function StartLayout({ children }: { children: ReactNode }) {
  return (
    <div className={`${lpSans.variable} lp-root flex min-h-full flex-1 flex-col`}>
      {children}
    </div>
  );
}
