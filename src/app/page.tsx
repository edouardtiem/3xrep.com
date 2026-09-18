import { publicBetaOffer } from "@/lib/founding";
import type { Metadata } from "next";
import BuddyHome from "@/components/buddy/BuddyHome";
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "3xrep - Your sales day, figured out.",
  description: "Know what to do next on the deal, with your sales buddy inside your AI chat. Start without a credit card.",
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "3xrep - Your sales day, figured out.",
    description: "A next move. A reason for it. A little less on your own.",
    url: "/",
    type: "website",
  },
};

export default async function Page() {
  return <BuddyHome offer={await publicBetaOffer()} />;
}
