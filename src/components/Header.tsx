import Link from "next/link";
import { Wordmark } from "@/components/Wordmark";

const links = [
  { href: "/docs", label: "docs" },
  { href: "/install", label: "install" },
];

export function Header() {
  return (
    <header className="flex items-baseline justify-between border-b border-line px-6 py-4">
      <Link href="/" aria-label="3xrep" className="text-sm tracking-tight text-fg">
        <Wordmark />
      </Link>
      <nav className="flex gap-6 text-sm text-mute">
        {links.map((l) => (
          <Link key={l.href} href={l.href} className="hover:text-fg">
            {l.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
