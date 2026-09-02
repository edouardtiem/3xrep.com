import Link from "next/link";

const links = [
  { href: "/install", label: "Installer" },
  { href: "/spec", label: "Spec" },
];

export function Header() {
  return (
    <header className="flex items-baseline justify-between border-b border-line px-6 py-4">
      <Link href="/" className="text-sm tracking-tight text-fg">
        3xrep
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
