import Link from "next/link";
import { Wordmark } from "@/components/Wordmark";

export function Header() {
  return (
    <header className="mx-auto flex w-full max-w-[88rem] items-baseline justify-between px-5 py-6 sm:px-10">
      <Link href="/" aria-label="3xrep" className="text-[0.95rem]">
        <Wordmark />
      </Link>
      <nav className="flex gap-5 text-[0.8125rem] leading-[1.4] text-mute">
        <Link
          href="/docs"
          className="hover:text-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground"
        >
          docs
        </Link>
        <Link
          href="/start"
          className="hover:text-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground"
        >
          beta
        </Link>
      </nav>
    </header>
  );
}
