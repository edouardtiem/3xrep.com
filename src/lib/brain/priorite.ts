import type { DealInput, PieceVerdict } from "./types";

export const STAGES = [
  { re: /n[ée]go|negotiation|contract|contrat|closing|commit|verbal|signature|legal|juridique|procurement|achats/i,
    exige: ["qui-tranche", "enjeu-chiffre", "budget", "process-decision", "process-papier", "echeance"] },
  { re: /propos|proposal|devis|quote|pricing|d[ée]mo|[ée]valuation|poc|pilot/i,
    exige: ["qui-tranche", "enjeu-chiffre", "criteres-achat"] },
];
export function stageRequirements(etape?: string | null): string[] {
  return STAGES.find(s => s.re.test(etape ?? ""))?.exige ?? [];
}
export function objectionPiece(phrase: string): string | null {
  if (/cher|prix|co[uû]te|expensive|price|cost/i.test(phrase)) return "enjeu-chiffre";
  if (/budget|pas les moyens|afford|money/i.test(phrase)) return "budget";
  if (/concurren|competitor|alternative|statu quo|status quo|already.*tool|d[ée]jà.*outil/i.test(phrase)) return "concurrents";
  if (/en interne|internal|mon chef|my boss|je dois en parler/i.test(phrase)) return "champion-vs-coach";
  if (/timing|deadline|later|plus tard|d[ée]lai|on verra/i.test(phrase)) return "echeance";
  return null;
}
export function prioriser(deal: DealInput, pieces: PieceVerdict[]): { pieces: PieceVerdict[]; raison: string } {
  const required = stageRequirements(deal.etape);
  const target = objectionPiece(deal.objection ?? "");
  const order = target ? [target, ...required]
    : required.length ? required
    : ["besoin", "enjeu-chiffre", "echeance", "qui-tranche", "budget", "criteres-achat", "process-decision", "champion-vs-coach", "concurrents", "process-papier"];
  const rank = (p: PieceVerdict) => {
    const i = order.indexOf(p.id);
    return (i < 0 ? 50 : i * 2) + (p.etat === "contredit" ? -1 : 0);
  };
  return {
    pieces: pieces.filter(p => p.etat !== "su").sort((a, b) => rank(a) - rank(b) || a.id.localeCompare(b.id)),
    raison: target ? "Le point visé par l’objection citée est traité avant la grille générale."
      : required.length ? "Les preuves exigées pour l’étape déclarée passent en premier."
      : "En découverte, établir le besoin et son enjeu avant d’ouvrir le processus d’achat.",
  };
}
