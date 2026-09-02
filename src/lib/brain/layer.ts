import { corpus } from "./corpus";
import type { DealInput, Layer } from "./types";

export function layerOf(deal: DealInput): Layer {
  const t = corpus(deal);
  if (!t.trim() && deal.montant == null) return 0;
  if (/\b(premier prospect|je démarre|pas de crm|tableur)\b/i.test(t) && deal.montant == null) {
    return 0;
  }
  const long =
    (deal.montant != null && deal.montant >= 50_000) ||
    /\b(comité|comite|juridique|dpa|cycle long|meddic|meddpicc|daf|cfo)\b/i.test(t);
  return long ? 2 : 1;
}
