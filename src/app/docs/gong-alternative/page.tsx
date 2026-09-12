import Link from "next/link";
import { DocsEnd } from "@/components/DocsEnd";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbJsonLd, pageMeta } from "@/lib/docs";
import { LIST_PRICE_USD } from "@/lib/stripe-checkout-session";
import { TRUST_LINE } from "@/lib/copy";

export const metadata = pageMeta({
  title: "Gong alternative that doesn't record calls",
  description:
    "Gong records your calls, about $1,500 a seat. 3xrep does not join them. A VP Sales agent next to Claude or ChatGPT and your CRM. From $" +
    LIST_PRICE_USD +
    "/month for the organization.",
  path: "/docs/gong-alternative",
});

export default function GongAlternativePage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Docs", path: "/docs" },
          { name: "Gong alternative", path: "/docs/gong-alternative" },
        ])}
      />
      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-10 px-6 py-16 leading-relaxed">
        <div>
          <h1 className="text-[1.75rem] leading-[1.2] tracking-tight sm:text-[2rem]">
            A Gong alternative that doesn&apos;t record calls
          </h1>
          <p className="text-mute mt-4 max-w-[36rem]">
            Gong records the call. Most “no bot” tools still capture audio.
            3xrep does not join the call. It is a VP Sales agent you add to
            Claude, ChatGPT, Cursor, or Codex, next to your CRM. From $
            {LIST_PRICE_USD}/month for the entire organization.
          </p>
        </div>

        <section className="space-y-2">
          <h2 className="text-lg">What it judges</h2>
          <p className="text-dim">
            The CRM is green because someone ticked a box. This agent reads
            the calls, notes, and mails already on the record — through{" "}
            <em>your</em> CRM connector, not ours — and names the stage that
            lies. Nobody who can sign. A close date that is a claim. A hole
            that repeats.
          </p>
          <p className="text-dim">{TRUST_LINE}</p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg">Not a recorder. Not a seat tax.</h2>
          <p className="text-dim">
            We do not replace Gong. We do not score talk-to-listen. We do
            not write back to HubSpot or Salesforce. If you want a note on
            the deal, your agent writes it through the CRM connector, after
            you confirm.
          </p>
        </section>

        <p>
          <Link href="/install" className="text-foreground hover:underline">
            Install
          </Link>
          <span className="text-dim"> — one URL, next to your CRM.</span>
        </p>
      </main>
      <DocsEnd />
    </>
  );
}
