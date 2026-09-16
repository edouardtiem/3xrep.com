import type { ReactNode } from "react";
import { Caveat } from "next/font/google";

const hand = Caveat({ subsets: ["latin"], weight: "500" });

export function Hand({
  children,
  className = "",
  delay,
}: {
  children: ReactNode;
  className?: string;
  delay?: 1 | 2 | 3 | 4;
}) {
  const ink = delay ? `buddy-ink buddy-ink-${delay}` : "";
  return (
    <span
      className={`${hand.className} text-copper ${ink} ${className}`.trim()}
    >
      {children}
    </span>
  );
}
