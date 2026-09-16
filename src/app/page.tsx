import type { Metadata } from "next";
import BuddyHome from "@/components/buddy/BuddyHome";
import { LIST_PRICE_USD } from "@/lib/stripe-checkout-session";

export const metadata: Metadata = {
  title: "3xrep — Your sales day, figured out.",
  description: `Know what to do next on the deal, with your sales buddy inside your AI chat. 14 days free, then $${LIST_PRICE_USD}/month for the whole company.`,
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "3xrep — Your sales day, figured out.",
    description: "A next move. A reason for it. A little less on your own.",
    url: "/",
    type: "website",
  },
};

export default function Page() {
  return <BuddyHome />;
}
