import Link from "next/link";
import { CopyButton } from "@/components/CopyButton";
import { DocsEnd } from "@/components/DocsEnd";
import { DocPage, DocSection } from "@/components/DocPage";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbJsonLd, pageMeta } from "@/lib/docs";
import { LIST_PRICE_USD } from "@/lib/stripe-checkout-session";

export const metadata = pageMeta({
  title: "CRM says negotiation. Nobody can sign.",
  description:
    "Our CRM says the deal is in negotiation but nobody on their side can sign. Monday review with a director who reads the calls behind the fields. $" +
    LIST_PRICE_USD +
    " a month for the whole company.",
  path: "/docs/use-cases",
});

const CASES = [
  {
    title: "Monday. The list is green. The list is lying.",
    prompt: "Monday. What's stuck this week?",
    body: [
      "HubSpot says Negotiation. Nobody who signs has been named. A close date sits on the card with no process. Last touched 46 days ago.",
      "He does not rank people. He names the stage that isn't true, the date that is a guess, what repeats, and one move. No percentage.",
    ],
  },
  {
    title: "After the call",
    prompt: "Debrief my last client call.",
    body: [
      "Julien said he runs the tool day to day. That is not who signs. Don't send the quote. Book the person who signs, or this file stays a demo.",
      "No transcript: paste it in the chat, or connect Fireflies, tl;dv, or HubSpot so the next call lands on the deal. We don't join your calls.",
    ],
  },
  {
    title: "Which close date is a guess",
    prompt: "Which close date this month is just a guess?",
    body: [
      "A date in HubSpot is what someone typed. Held only if a buyer named the process, the people, the paper. Otherwise the calendar is a hope.",
    ],
  },
  {
    title: "They said it's too expensive",
    prompt: "They said it's too expensive. What's missing?",
    body: [
      "They compared you to in-house. The file has no number they said for what waiting costs. A discount answers a price. It doesn't answer what's missing.",
    ],
  },
  {
    title: "The follow-up that is allowed to exist",
    prompt: "Draft the follow-up from the debrief. Don't send a recap of the demo.",
    body: [
      "3xrep does not write the email. It names what's missing. Claude writes from that, then asks. You confirm. HubSpot sends the mail and logs it on the deal.",
    ],
  },
] as const;

export default function UseCasesPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Docs", path: "/docs" },
          { name: "Use cases", path: "/docs/use-cases" },
        ])}
      />
      <DocPage
        title="Use cases"
        lead="The assistant lives where you already work. HubSpot holds the file. 3xrep judges. Claude can then write the note — through HubSpot, after you confirm."
      >
        {CASES.map((item) => (
          <DocSection key={item.title} title={item.title}>
            {item.body.map((p) => (
              <p key={p}>{p}</p>
            ))}
            <div className="flex items-baseline justify-between gap-4 rounded-lg border border-line bg-raise px-4 py-3">
              <p className="min-w-0 text-[0.9375rem] leading-snug text-foreground">
                {item.prompt}
              </p>
              <CopyButton text={item.prompt} />
            </div>
          </DocSection>
        ))}

        <DocSection title="What we will not do">
          <p>
            Book the demo they asked for before a piece is open. Write a
            &ldquo;just checking in.&rdquo; Forecast a close date. Rank people.
            Record the call. Speak to the buyer. You stay the mouth.
          </p>
          <p>
            <Link href="/docs/how-it-works" className="text-foreground hover:underline">
              How it works
            </Link>
            .
          </p>
        </DocSection>

        <DocsEnd />
      </DocPage>
    </>
  );
}
