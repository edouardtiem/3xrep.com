import { runMoteur } from "./moteur";
import type { DealInput } from "./types";

export function nextQuestion(deal: DealInput) {
  const audit = runMoteur(deal);
  return {
    strategy: audit.strategy,
    geste: audit.geste,
    pieces: audit.pieces,
    methode: audit.methode,
    priorite: audit.priorite,
    verification: audit.verification,
    refus: audit.refus,
    corrections_crm: audit.corrections_crm,
    layer: audit.layer,
    trou: audit.trous[0] ?? null,
    mort: audit.morts[0] ?? null,
    demande: audit.demande,
    rendu: audit.rendu,
    action: audit.action ?? null,
  };
}
