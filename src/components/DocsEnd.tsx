import Link from "next/link";

export function DocsEnd() {
  return (
    <section className="border-t border-line pt-16">
      <p className="text-[1.35rem] leading-[1.25] tracking-[-0.02em] sm:text-[1.75rem]">
        Add him to Claude. Next to HubSpot.
      </p>
      <p className="mt-8">
        <Link
          href="/start"
          className="inline-block cursor-pointer rounded-lg bg-fg px-5 py-3 text-[0.9375rem] font-medium text-bg hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground"
        >
          Start 14 days free
        </Link>
      </p>
    </section>
  );
}
