import type { DealInput } from "./types";

export function corpus(deal: DealInput): string {
  return [
    deal.etape,
    deal.montant != null ? String(deal.montant) : "",
    deal.notes,
    deal.mails,
    deal.meetings,
    deal.transcript,
    deal.nextStep,
  ]
    .filter(Boolean)
    .join("\n");
}

export function hit(re: RegExp, text: string): string | null {
  const m = text.match(re);
  return m?.[0] ?? null;
}
