import Link from "next/link";
import { DocsEnd } from "@/components/DocsEnd";
import { JsonLd } from "@/components/JsonLd";
import { METHOD_FAMILIES, breadcrumbJsonLd, pageMeta } from "@/lib/docs";

export const metadata = pageMeta({
  title: "Sales methodologies",
  description:
    "MEDDIC, MEDDPICC, BANT, BEBEDC, SPIN, Challenger, SONCAS, CRAC — 3xrep attaches the hole in the deal to the method your team already uses. Evidence from the buyer, not a course.",
  path: "/docs/methods",
});

export default function MethodsPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Docs", path: "/docs" },
          { name: "Methods", path: "/docs/methods" },
        ])}
      />
      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-10 px-6 py-16 leading-relaxed">
        <div>
          <h1 className="text-[1.75rem] leading-[1.2] tracking-tight sm:text-[2rem]">
            Sales methodologies
          </h1>
          <p className="text-mute mt-4 max-w-[36rem]">
            We don&apos;t teach the grid. We name the hole with the words
            your team already uses. Several methods can name the same
            piece. That is intended. A green checkbox without a quote from
            the buyer is empty.
          </p>
        </div>

        <section className="space-y-2">
          <h2 className="text-lg">Not a course. Not one right grid.</h2>
          <p className="text-dim">
            ChatGPT will explain MEDDIC. A skill will print the letters.
            3xrep asks whether Economic Buyer is held on this deal — from
            what they said, not from the field you ticked. The same hole is
            BANT Authority and BEBEDC Décideurs. The spec does not pick a
            winner.{" "}
            <Link
              href="/docs/how-it-works"
              className="text-foreground hover:underline"
            >
              How it works
            </Link>
            .
          </p>
          <p className="text-dim">
            What the buyer said is the only exhibit. What the rep believes
            is a claim. What the CRM shows is a claim until a call, a mail,
            or a meeting proves it. We don&apos;t assume the deal is won.
            We don&apos;t take the prospect at their word.
          </p>
        </section>

        {METHOD_FAMILIES.map((family) => (
          <section key={family.title} className="space-y-5">
            <div className="space-y-2">
              <h2 className="text-lg">{family.title}</h2>
              <p className="text-dim">{family.lead}</p>
            </div>
            {family.methods.map((method) => (
              <div key={method.name} className="space-y-1.5">
                <h3 className="text-foreground">{method.name}</h3>
                <p className="text-dim text-xs">{method.parts}</p>
                <p className="text-dim">{method.forces}</p>
              </div>
            ))}
          </section>
        ))}

        <section className="space-y-2">
          <h2 className="text-lg">The overlap is the point</h2>
          <p className="text-dim">
            Who signs: MEDDIC Economic Buyer, BANT Authority, BEBEDC
            Décideurs, NEAT Access. The number: Metrics, Enjeu, cost of
            inaction. The nice ops: Champion vs coach, Sandler&apos;s
            student. We attach all the names that fit. We don&apos;t quiz
            you on the letters.{" "}
            <span className="text-foreground">methode_lookup</span> and{" "}
            <span className="text-foreground">rattacher</span> exist for a
            notion or a sentence. A deal goes through{" "}
            <span className="text-foreground">audit_deal</span>.
          </p>
        </section>

        <DocsEnd />
      </main>
    </>
  );
}
