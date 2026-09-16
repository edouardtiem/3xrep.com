import type { DealInput } from "./types";

export function brut(deal: DealInput): string {
  return [
    deal.etape,
    deal.montant != null ? String(deal.montant) : "",
    deal.notes,
    deal.mails,
    deal.meetings,
    deal.transcript,
    deal.nextStep,
    deal.objection,
    ...(deal.sources ?? []).map(s => s.texte),
  ]
    .filter(Boolean)
    .join("\n");
}

export function corpus(deal: DealInput): string {
  return brut(deal);
}

export function hit(re: RegExp, text: string): string | null {
  const m = text.match(re);
  return m?.[0] ?? null;
}

/** Only artefacts, never stage/amount/next-step or unsupported extracted claims. */
export function artefacts(deal: DealInput): string {
  return [deal.notes, deal.mails, deal.meetings, deal.transcript,
    ...(deal.sources ?? []).map(s => s.texte)].filter(Boolean).join("\n");
}
