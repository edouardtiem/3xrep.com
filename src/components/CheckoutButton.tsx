export function CheckoutButton({ label = "99 € / mois / org" }: { label?: string }) {
  return (
    <form action="/api/stripe/checkout" method="post">
      <button
        type="submit"
        className="rounded-[10px] bg-fg px-4 py-2 text-sm text-bg hover:opacity-90"
      >
        {label}
      </button>
    </form>
  );
}
