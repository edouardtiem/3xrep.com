import Link from "next/link";
import { DocsEnd } from "@/components/DocsEnd";
import { DocPage, DocSection } from "@/components/DocPage";
import { JsonLd } from "@/components/JsonLd";
import { METHOD_FAMILIES, breadcrumbJsonLd, pageMeta } from "@/lib/docs";

export const metadata = pageMeta({
  title: "Sales methodologies",
  description:
    "MEDDIC, MEDDPICC, BANT, BEBEDC, SPIN, Challenger, SONCAS, CRAC — 3xrep names what's missing with the words your team already uses. Evidence from the buyer, not a course.",
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
      <DocPage
        title="Sales methodologies"
        lead="We don't teach the grid. We name what's missing with the words your team already uses. Several methods can name the same piece. A green checkbox without a quote is empty."
      >
        <DocSection title="Not a course. Not one right grid.">
          <p>
            ChatGPT will explain MEDDIC. 3xrep asks whether the person who
            signs is held on this deal — from what they said, not from the
            field you ticked. The same gap is Authority and Décideurs. We
            don&apos;t pick a winner.{" "}
            <Link href="/docs/how-it-works" className="text-foreground hover:underline">
              How it works
            </Link>
            .
          </p>
        </DocSection>

        {METHOD_FAMILIES.map((family) => (
          <DocSection key={family.title} title={family.title}>
            <p>{family.lead}</p>
            {family.methods.map((method) => (
              <div key={method.name} className="space-y-2 pt-4">
                <h3 className="text-foreground">{method.name}</h3>
                <p className="text-dim text-[0.8125rem]">{method.parts}</p>
                <p>{method.forces}</p>
              </div>
            ))}
          </DocSection>
        ))}

        <DocSection title="The overlap is the point">
          <p>
            Who signs: Economic Buyer, Authority, Décideurs. The number: a
            figure they said, not a slide. We attach all the names that fit.
            We don&apos;t quiz you on the letters.
          </p>
        </DocSection>

        <DocsEnd />
      </DocPage>
    </>
  );
}
