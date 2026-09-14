import Link from "next/link";
import { DocsEnd } from "@/components/DocsEnd";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbJsonLd, pageMeta } from "@/lib/docs";
import { LIST_PRICE_USD } from "@/lib/stripe-checkout-session";
import { TRUST_LINE } from "@/lib/copy";

export const metadata = pageMeta({
  title: "How much does 3xrep cost",
  description:
    "3xrep costs $" +
    LIST_PRICE_USD +
    "/month for the entire organization. Not per seat. A VP Sales agent next to Claude or ChatGPT and your CRM. It does not record calls.",
  path: "/docs/pricing",
});

export default function PricingPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Docs", path: "/docs" },
          { name: "Pricing", path: "/docs/pricing" },
        ])}
      />
      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-10 px-6 py-16 leading-relaxed">
        <div>
          <h1 className="text-[1.75rem] leading-[1.2] tracking-tight sm:text-[2rem]">
            How much does 3xrep cost
          </h1>
          <p className="text-mute mt-4 max-w-[36rem]">
            ${LIST_PRICE_USD} per month for the entire organization. Not per
            seat. 14 days free. 3xrep is a VP Sales agent you add to Claude, ChatGPT,
            Cursor, or Codex, next to your CRM. It names the stage that
            lies. It does not record calls.
          </p>
        </div>

        <section className="space-y-2">
          <h2 className="text-lg">One price. The whole pipe.</h2>
          <p className="text-dim">
            Gong is about $1,500 a seat and records your calls. Here it is $
            {LIST_PRICE_USD} for the whole pipe, no seats. Local currency at
            checkout.
          </p>
          <p className="text-dim">{TRUST_LINE}</p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg">What you are not paying for</h2>
          <p className="text-dim">
            Not a call recorder. Not a tab inside HubSpot or Salesforce.
            The agent lives next to your CRM connector, in the tool you
            already use.
          </p>
        </section>

        <p>
          <Link href="/install" className="text-foreground hover:underline">
            Install
          </Link>
          <span className="text-dim"> — 14 days free, then ${LIST_PRICE_USD}.</span>
        </p>
      </main>
      <DocsEnd />
    </>
  );
}
