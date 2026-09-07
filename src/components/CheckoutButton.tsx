import { LIST_PRICE_USD } from "@/lib/stripe-checkout-session";

export function CheckoutButton({
  label = `Pay $${LIST_PRICE_USD} / month / org`,
}: {
  label?: string;
}) {
  return (
    <form action="/api/stripe/checkout" method="post">
      <button
        type="submit"
        className="cursor-pointer border border-line bg-fg px-4 py-2.5 text-bg hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground"
      >
        {label}
      </button>
    </form>
  );
}
