import type { ReactNode } from "react";

export function DocPage({
  title,
  lead,
  children,
}: {
  title: string;
  lead: ReactNode;
  children: ReactNode;
}) {
  return (
    <main className="mx-auto flex w-full max-w-[40rem] flex-1 flex-col gap-16 px-5 py-16 sm:px-10">
      <div>
        <h1 className="text-[2rem] leading-[1.1] font-medium tracking-[-0.03em] sm:text-[2.5rem]">
          {title}
        </h1>
        <p className="text-mute mt-6 max-w-[40ch] text-[1.125rem] leading-[1.5]">{lead}</p>
      </div>
      {children}
    </main>
  );
}

export function DocSection({
  title,
  children,
}: {
  title?: string;
  children: ReactNode;
}) {
  return (
    <section className="space-y-5">
      {title ? (
        <h2 className="text-[1.35rem] leading-[1.25] tracking-[-0.02em] sm:text-[1.75rem]">
          {title}
        </h2>
      ) : null}
      <div className="text-mute space-y-5 text-[1.125rem] leading-[1.5]">{children}</div>
    </section>
  );
}
