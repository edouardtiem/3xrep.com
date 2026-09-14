import type { Audit, CorrectionCrm, DealInput } from "@/lib/brain/types";

export type { CorrectionCrm };

const NE_PAS = "inventer une valeur (nom, date, montant) pour remplir le trou";

export function correctionsFromAudit(deal: DealInput, audit: Audit): CorrectionCrm[] {
  if (audit.refus) return [];
  const out: CorrectionCrm[] = [];
  const tete = audit.morts[0];
  if (deal.etape?.trim() && tete) {
    out.push({
      propriete: "etape",
      crm: deal.etape.trim(),
      piece: tete.piece,
      action: "corriger-apres-confirmation",
      pourquoi: `l’étape « ${deal.etape.trim()} » n’est pas tenue : ${tete.piece} n’a pas de preuve.`,
      ne_pas: NE_PAS,
    });
  }
  for (const p of audit.pieces) {
    if (p.raison !== "case verte sans source") continue;
    out.push({
      propriete: p.id,
      crm: "case verte",
      piece: p.id,
      action: "corriger-apres-confirmation",
      pourquoi: "case cochée sans source — ce n’est pas tenu.",
      ne_pas: "laisser la case verte sans preuve",
    });
  }
  return out.slice(0, 3);
}

export type PipeContradiction = {
  type: string;
  deal: string;
  crm?: string;
  piece?: string;
  raison?: string;
};

export function correctionsFromPipe(contradictions: PipeContradiction[]): CorrectionCrm[] {
  const out: CorrectionCrm[] = [];
  const seen = new Set<string>();
  for (const c of contradictions) {
    if (c.type !== "etape_illegale" || !c.piece || !c.crm) continue;
    const key = `${c.deal}:${c.piece}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push({
      propriete: "etape",
      crm: c.crm,
      piece: c.piece,
      action: "corriger-apres-confirmation",
      pourquoi: c.raison ?? "",
      ne_pas: NE_PAS,
    });
  }
  return out.slice(0, 5);
}

export function sommePortesCassees(
  deals: { nom?: string; montant?: number }[],
  contradictions: PipeContradiction[],
): number | null {
  const illegal = new Set(
    contradictions.filter((c) => c.type === "etape_illegale").map((c) => c.deal),
  );
  if (illegal.size === 0) return null;
  let sum = 0;
  let any = false;
  deals.forEach((d, i) => {
    const nom = d.nom?.trim() || `deal ${i + 1}`;
    if (!illegal.has(nom) || d.montant == null || !Number.isFinite(d.montant)) return;
    sum += d.montant;
    any = true;
  });
  return any ? sum : null;
}
