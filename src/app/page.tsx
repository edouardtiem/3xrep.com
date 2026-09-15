import { Home } from "@/components/home/Home";
import { LIST_PRICE_USD } from "@/lib/stripe-checkout-session";

export const metadata = {
  title: "3xrep — Your AI believes your CRM. We don't.",
  description: `He lives in Claude or ChatGPT, next to HubSpot. 14 days free, then $${LIST_PRICE_USD} a month for the whole company. We don't join your calls.`,
  alternates: { canonical: "/" },
};

export default function Page() {
  return <Home />;
}
