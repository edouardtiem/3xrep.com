import { runMoteur } from "./moteur";
import type { Audit, DealInput } from "./types";

export function scoreDeal(deal: DealInput): Audit {
  return runMoteur(deal);
}
