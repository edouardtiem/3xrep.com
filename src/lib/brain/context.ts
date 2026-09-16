import type { DealInput, SalesContext } from "./types";

export function contexteOf(deal: DealInput): SalesContext {
  const house = { ...deal.contexte_entreprise };
  const current = deal.contexte ?? {};
  if (current.cycle != null || current.comite != null || current.interlocuteurs != null) {
    delete house.cycle;
    delete house.comite;
    delete house.interlocuteurs;
  }
  return { ...house, ...current };
}
