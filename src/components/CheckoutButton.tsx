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
        className="border border-line bg-fg px-4 py-2 text-[13px] text-bg hover:opacity-90"
      >
        {label}
      </button>
    </form>
  );
}
