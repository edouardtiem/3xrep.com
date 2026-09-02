import { scoreDeal } from "./audit";
import type { DealInput } from "./types";

export function nextQuestion(deal: DealInput) {
  const audit = scoreDeal(deal);
  return {
    geste: audit.geste,
    layer: audit.layer,
    trou: audit.trous[0] ?? null,
    rendu: audit.rendu,
  };
}
