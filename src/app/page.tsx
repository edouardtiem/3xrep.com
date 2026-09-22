import { publicBetaOffer } from "@/lib/founding";
import type { Metadata } from "next";
import BuddyHome from "@/components/buddy/BuddyHome";
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "3xrep - Every deal needs a strategy.",
  description: "Build your next deal move from buyer evidence: the approach, the words to use, and what to do depending on the answer. Inside your AI chat.",
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "3xrep - Every deal needs a strategy.",
    description: "Deal strategy, down to the next conversation.",
    url: "/",
    type: "website",
  },
};

export default async function Page() {
  return <BuddyHome offer={await publicBetaOffer()} />;
}
