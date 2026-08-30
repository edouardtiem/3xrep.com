import Link from "next/link";

const LINKS = [
  { href: "/da/console", id: "console" },
  { href: "/da/surface", id: "surface" },
  { href: "/da/surface-1.1", id: "1.1" },
] as const;

export function EtudesNav({
  current,
  className,
  hereClass,
}: {
  current: (typeof LINKS)[number]["id"];
  className?: string;
  hereClass?: string;
}) {
  return (
    <nav className={className} aria-label="Études">
      {LINKS.map((l) => (
        <Link
          key={l.href}
          href={l.href}
          className={l.id === current ? hereClass : undefined}
          aria-current={l.id === current ? "page" : undefined}
        >
          {l.id}
        </Link>
      ))}
    </nav>
  );
}
