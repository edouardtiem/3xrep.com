import { contexteOf } from "./context";
import { corpus } from "./corpus";
import type { DealInput, Layer } from "./types";

export function layerOf(deal: DealInput): Layer {
  const c = contexteOf(deal);
  // Deal context wins over the organisation's usual cycle and lexical fallbacks.
  if (c.cycle === "long" || c.comite === true || (c.interlocuteurs ?? 0) > 2) return 2;
  if (c.cycle === "court" || c.cycle === "moyen" || c.comite === false) return 1;
  const t = corpus(deal);
  if (!t.trim() && deal.montant == null) return 0;
  if (/(premier prospect|je démarre|pas de crm|tableur|first prospect|starting out|no crm|spreadsheet)/i.test(t) && deal.montant == null) return 0;
  return (deal.montant != null && deal.montant >= 50_000) ||
    /comit[ée]|committee|juridique|legal|procurement|dpa|cycle long|long (?:sales )?cycle|meddic|meddpicc|\bdaf\b|\bcfo\b/i.test(t) ? 2 : 1;
}
