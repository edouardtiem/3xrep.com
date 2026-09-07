import Link from "next/link";

export function DocsEnd() {
  return (
    <section className="border-t border-line pt-8">
      <p className="text-dim">
        Two connectors. Then run it on the pipe.{" "}
        <Link href="/install" className="text-foreground hover:underline">
          Install
        </Link>
        .
      </p>
    </section>
  );
}
