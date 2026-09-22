import type { DealInput, Exhibit, PieceId } from "../types";

/** Readable, synthetic source passages. They exercise real verification, not mocked verdicts. */
export const EVIDENCE: Record<PieceId, string> = {
  besoin: "Our approval delays are a problem: the team misses customer deadlines.",
  "enjeu-chiffre": "We lose 6 hours per week chasing approvals; the time records confirm those 6 hours.",
  "champion-vs-coach": "I advocate for this internally and will introduce you to the CFO for the budget decision.",
  "qui-tranche": "I approve the final purchase budget and nobody else can reject the spending decision.",
  budget: "We have a 12000 euro operating budget for this fiscal year, owned by our finance team.",
  echeance: "We must finish before 2026-10-15 because of the compliance audit.",
  "criteres-achat": "Our decision criteria compare approval time and audit traceability; approval time comes first.",
  "process-decision": "Operations validates the choice, then finance approves the decision before the committee.",
  "process-papier": "Legal reviews the contract, then procurement reviews it within 10 days before signature.",
  concurrents: "Our alternative is to keep the current spreadsheet and do nothing about the manual process.",
};
export function strategyDeal(held: PieceId[], overrides: Partial<DealInput> = {}): DealInput {
  const sources = held.map(piece => ({ id: piece, type: "transcript" as const, texte: `Rep: Can you confirm ${piece} with a concrete example?\nJulien: ${EVIDENCE[piece]}` }));
  const exhibits: Exhibit[] = held.map(piece => ({ source: "transcript", source_id: piece, auteur: "prospect", nom: "Julien", piece, citation: EVIDENCE[piece], question: `Can you confirm ${piece} with a concrete example?`, reponse: EVIDENCE[piece], test_pose: true, sens: "affirme" }));
  return { nom: "Acme", crm_id: "acme", etape: "proposal", sources, exhibits, ...overrides };
}
