import { METHOD_GUIDANCE } from "./method-guidance";
import { contexteOf } from "./context";
import { stageRequirements, objectionPiece } from "./priorite";
import { corpus } from "./corpus";
import { layerOf } from "./layer";
import type { DealInput, PieceId } from "./types";

export type MethodSelection = {
  grille: "BANT" | "SPICED" | "MEDDIC" | "MEDDPICC";
  intervention: "SPIN" | "CRAC" | "Contreparties" | "BAC" | "Gap Selling";
  raison: string;
  usage: string;
  provisoire: boolean;
  manque: string[];
  reevaluer_si: string[];
  sources: string[];
  provenance_intervention: { source: string | null; usage: string; adaptation: string };
  adaptation: string;
  pieces: PieceId[];
};

export function selectMethod(deal: DealInput): MethodSelection {
  const c = contexteOf(deal);
  const text = corpus(deal);
  const layer = layerOf(deal);
  const paper = c.papier ?? /juridique|legal|procurement|contract|contrat|achats|dpa/i.test(text);
  const competition = c.concurrence ?? /concurren|competitor|alternative|statu quo|status quo/i.test(text);
  const grille = layer === 2 ? (paper || competition ? "MEDDPICC" : "MEDDIC")
    : c.cycle === "moyen" ? "SPICED" : "BANT";
  const moment = c.moment;
  const intervention = deal.objection?.trim() || moment === "objection" ? "CRAC"
    : moment === "negociation" || /n[ée]go|discount|remise/i.test(deal.etape ?? "") ? "Contreparties"
    : moment === "demo" || /d[ée]mo/i.test(deal.etape ?? "") ? "BAC"
    : c.probleme_reconnu === false ? "Gap Selling" : "SPIN";
  const usage = {
    SPIN: "Partir du problème attesté, creuser ses conséquences puis demander la valeur d’un changement. Ne pas réciter quatre questions.",
    CRAC: "Creuser la phrase citée, reformuler le désaccord, argumenter avec les preuves disponibles, puis vérifier la réponse. Ne pas inventer la cause du refus.",
    Contreparties: "Avant une concession, nommer ce qui est demandé, son coût et la contrepartie à confirmer. Aucune remise automatique.",
    BAC: "Partir du bénéfice lié au besoin attesté ; montrer ensuite l’avantage et la caractéristique qui le soutiennent.",
    "Gap Selling": "Comparer la situation actuelle documentée et la situation souhaitée. Demander ce que cet écart change ; ne pas inventer une douleur.",
  }[intervention];
  const base: PieceId[] = ["besoin", "qui-tranche", "budget", "echeance"];
  const pieces: PieceId[] = grille === "BANT" ? base
    : grille === "SPICED" ? ["besoin", "enjeu-chiffre", "echeance", "qui-tranche", "criteres-achat", "process-decision"]
    : ["besoin", "enjeu-chiffre", "qui-tranche", "champion-vs-coach", "criteres-achat", "process-decision", "echeance"];
  // Stage requirements and a concrete objection may legitimately borrow from another grid.
  if (layer === 0 || /prix|price|cher|expensive|cost/i.test(deal.objection ?? "")) pieces.push("enjeu-chiffre");
  if (grille === "MEDDPICC") pieces.push("process-papier", "concurrents");
  if (paper) pieces.push("process-papier");
  if (competition) pieces.push("concurrents");
  if (layer > 0 && /n[ée]go|contract|contrat|signature|closing/i.test(deal.etape ?? "")) pieces.push("budget", "process-papier", "enjeu-chiffre");
  if (/internal|en interne|mon chef/i.test(deal.objection ?? "")) pieces.push("champion-vs-coach");
  pieces.push(...stageRequirements(deal.etape) as PieceId[]);
  const target = objectionPiece(deal.objection ?? "");
  if (target) pieces.push(target as PieceId);
  for (const e of deal.exhibits ?? []) if (e.piece) pieces.push(e.piece);
  if (/champion|coach/i.test(text)) pieces.push("champion-vs-coach");
  if (/metrics|m[ée]trique|enjeu|co[uû]t|inaction|perd|perte/i.test(text)) pieces.push("enjeu-chiffre");
  const manque = [!c.cycle ? "durée du cycle" : null,
    c.interlocuteurs == null && c.comite == null ? "nombre d’interlocuteurs ou comité" : null].filter((s): s is string => Boolean(s));
  return {
    grille, intervention, usage,
    provenance_intervention: METHOD_GUIDANCE[intervention === "Gap Selling" ? "gap-selling" : intervention.toLowerCase()],
    raison: grille === "BANT" ? "Qualification courte ou contexte encore incomplet : budget, autorité, besoin et échéance."
      : grille === "SPICED" ? "Cycle moyen déclaré : besoin, impact, événement critique et décision."
      : grille === "MEDDPICC" ? "Affaire complexe avec contrat ou concurrence à examiner."
      : "Affaire complexe : valeur, autorité, critères, processus et champion.",
    provisoire: manque.length > 0, manque,
    reevaluer_si: ["le cycle de cette affaire diffère du cycle habituel", "un comité, un passage juridique ou une alternative apparaît", "le moment de vente ou le problème à résoudre change"],
    sources: grille === "SPICED" ? ["https://winningbydesign.com/spiced-framework/"]
      : grille === "BANT" ? ["https://www.salesforce.com/blog/what-is-bant-lead-generation/"]
      : ["https://meddicc.com/meddpicc-sales-methodology-and-process"],
    adaptation: "Sélection et priorité : règles 3xrep, pas une prescription universelle de la méthode. Les critères de preuve sont conservateurs. Le contexte déclaré guide le choix, il ne prouve aucune pièce. L’intervention est un guidage, pas une méthode intégralement automatisée.",
    pieces: [...new Set(pieces)],
  };
}
