import Link from "next/link";
import { DocsEnd } from "@/components/DocsEnd";
import { DocPage, DocSection } from "@/components/DocPage";
import { JsonLd } from "@/components/JsonLd";
import { TRUST_LINE } from "@/lib/copy";
import {
  DOC_FAQ,
  breadcrumbJsonLd,
  faqJsonLd,
  pageMeta,
  softwareJsonLd,
} from "@/lib/docs";
import { LIST_PRICE_USD } from "@/lib/stripe-checkout-session";

export const metadata = pageMeta({
  title: "What is 3xrep",
  description:
    "He lives in Claude or ChatGPT, next to HubSpot. He names what's missing, and the stage that isn't true. 14 days free, then $" +
    LIST_PRICE_USD +
    " a month for the whole company. We don't join your calls.",
  path: "/docs",
});

const TOC = [
  {
    href: "/docs/how-it-works",
    title: "How it works",
    blurb: "Two connectors. What the buyer said. Why Claude alone is not enough.",
  },
  {
    href: "/docs/use-cases",
    title: "Use cases",
    blurb: "Monday. After a call. A date that is a guess. Too expensive.",
  },
  {
    href: "/docs/gong-alternative",
    title: "Gong alternative",
    blurb: `Gong records. We don't join the call. $${LIST_PRICE_USD} for the company.`,
  },
  {
    href: "/docs/pipeline-review",
    title: "Pipeline review",
    blurb: "The list is green. The stage isn't true.",
  },
  {
    href: "/docs/pricing",
    title: "How much does 3xrep cost",
    blurb: `$${LIST_PRICE_USD} a month for the whole company.`,
  },
  {
    href: "/docs/methods",
    title: "Methods",
    blurb: "MEDDIC, BANT, BEBEDC — names for what's missing. Not a course.",
  },
  {
    href: "/install",
    title: "Install",
    blurb: "Claude first. HubSpot beside it.",
  },
] as const;

export default function DocsPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Docs", path: "/docs" }])} />
      <JsonLd data={faqJsonLd()} />
      <JsonLd data={softwareJsonLd()} />
      <DocPage
        title="What is 3xrep"
        lead="He lives in Claude or ChatGPT, next to HubSpot. Not inside HubSpot. He reads the calls behind the fields."
      >
        <nav aria-label="In these docs" className="space-y-6">
          {TOC.map((item) => (
            <p key={item.href} className="text-[1.125rem] leading-[1.5]">
              <Link href={item.href} className="text-foreground hover:underline">
                {item.title}
              </Link>
              <span className="text-mute"> — {item.blurb}</span>
            </p>
          ))}
        </nav>

        <DocSection title="Where he lives">
          <p>
            In the assistant you already use — Claude, ChatGPT, Cursor. One
            address, next to HubSpot or Salesforce. Nothing to install in
            HubSpot. No 3xrep tab.
          </p>
          <p>
            He needs both. Without HubSpot connected, paste the notes in the
            chat. He still judges. The fields are missing.
          </p>
        </DocSection>

        <DocSection title="Not a ChatGPT prompt">
          <p>
            Claude already knows MEDDIC. He recites. He stays useful. He fills
            the gap when the call is missing.{" "}
            <Link href="/docs/how-it-works" className="text-foreground hover:underline">
              How it works
            </Link>{" "}
            is the other thing: held, assumed, or empty — from what the buyer
            said.
          </p>
        </DocSection>

        <DocSection title="What we are not">
          <p>Not Gong. We don&apos;t join your calls.</p>
          <p>
            Not your CRM&apos;s assistant. It fills the fields. We say which
            ones are empty.
          </p>
          <p>Not a course. Not &ldquo;you close Friday.&rdquo;</p>
          <p className="text-foreground">
            We name what&apos;s missing. And the stage in HubSpot that isn&apos;t
            true.
          </p>
          <p className="text-dim text-[0.8125rem] leading-relaxed">{TRUST_LINE}</p>
        </DocSection>

        <DocSection title="Questions">
          <dl className="space-y-10">
            {DOC_FAQ.map((row) => (
              <div key={row.q}>
                <dt className="text-foreground">{row.q}</dt>
                <dd className="mt-3">{row.a}</dd>
              </div>
            ))}
          </dl>
        </DocSection>

        <DocsEnd />
      </DocPage>
    </>
  );
}
