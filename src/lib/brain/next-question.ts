import { runMoteur } from "./moteur";
import type { DealInput } from "./types";

export function nextQuestion(deal: DealInput) {
  const audit = runMoteur(deal, { stopAt: 7 });
  return {
    geste: audit.geste,
    layer: audit.layer,
    trou: audit.trous[0] ?? null,
    mort: audit.morts[0] ?? null,
    rendu: audit.rendu,
  };
}
