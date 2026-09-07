"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { DOC_NAV } from "@/lib/docs";

export function DocsNav() {
  const path = usePathname();

  return (
    <nav
      aria-label="Docs"
      className="border-b border-line px-6"
    >
      <ul className="mx-auto flex w-full max-w-2xl gap-6 overflow-x-auto py-3 text-sm">
        {DOC_NAV.map((item) => {
          const on =
            item.href === "/docs"
              ? path === "/docs"
              : path === item.href || path.startsWith(`${item.href}/`);
          return (
            <li key={item.href} className="shrink-0">
              <Link
                href={item.href}
                aria-current={on ? "page" : undefined}
                className={on ? "text-foreground" : "text-mute hover:text-foreground"}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
