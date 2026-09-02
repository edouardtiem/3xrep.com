import { expand } from "./lexique";
import type { Rattachement } from "./types";

export type CaseId =
  | "economic_buyer"
  | "champion"
  | "metrics"
  | "pain"
  | "criteria"
  | "process"
  | "paper"
  | "competition"
  | "budget"
  | "timeline";

export type CaseRule = {
  id: CaseId;
  seed: Rattachement;
  /** Priorité du geste (plus bas = coûte plus). */
  prio: number;
  geste: string;
  signal: RegExp;
  preuve: RegExp;
  vert: RegExp;
};

export const CASES: CaseRule[] = [
  {
    id: "economic_buyer",
    seed: { methode: "MEDDIC", partie: "Economic Buyer" },
    prio: 0,
    geste: "Convier celui qui tranche le budget — le nommer, ou faire dire pourquoi il ne viendrait pas.",
    signal:
      /\b(daf|cfo|dg|ceo|directeur financier|directrice financière|qui (?:tranche|signe|décide)|budget|autorité|authority|economic buyer|décideur)/i,
    preuve:
      /(?:daf|cfo|dg|ceo|directeur financier|directrice financière).{0,60}(?:signe|tranche|décide|budget)/i,
    vert: /(?:economic buyer|décideur|authority)\s*[:：]\s*(?:ok|oui|yes|✓|x|coché)/i,
  },
  {
    id: "champion",
    seed: { methode: "MEDDIC", partie: "Champion" },
    prio: 2,
    geste: "Tester le champion : qu’est-ce qu’il risque s’il porte ça en interne, et le DAF n’est pas convaincu ?",
    signal: /\b(champion|coach|se propose|je pousse|en interne)/i,
    preuve: /(?:risque|réputation|je pousse|en interne).{0,80}(?:daf|comité|comite)/i,
    vert: /champion\s*[:：]\s*(?:ok|oui|yes|✓)/i,
  },
  {
    id: "metrics",
    seed: { methode: "MEDDIC", partie: "Metrics" },
    prio: 1,
    geste: "Faire valider en euros, à voix haute, le coût de ne rien faire.",
    signal:
      /\b(jour|jours|heure|€|eur|euros|coût|cout|perte|downtime|métrique|metrics|enjeu|inaction)/i,
    preuve: /\d[\d\s]*\s*(?:€|eur|k€|euros)/i,
    vert: /(?:metrics|métrique|enjeu)\s*[:：]\s*(?:ok|oui|yes|✓)/i,
  },
  {
    id: "pain",
    seed: { methode: "MEDDIC", partie: "Identify pain" },
    prio: 3,
    geste: "Coller la douleur à une phrase du transcript, pas à un persona.",
    signal: /\b(douleur|pain|besoin|need|problème|probleme)/i,
    preuve: /«[^»]{12,160}»|"[^"]{12,160}"/,
    vert: /(?:pain|douleur|besoin|need)\s*[:：]\s*(?:ok|oui|yes|✓)/i,
  },
  {
    id: "criteria",
    seed: { methode: "MEDDIC", partie: "Decision criteria" },
    prio: 5,
    geste: "Demander les critères écrits — qui les a posés, et ce qui ferait perdre.",
    signal: /\b(critère|critere|criteria|cahier des charges)/i,
    preuve: /cahier des charges|critères?\s+(?:écrits|notés|posés)/i,
    vert: /(?:decision criteria|critères?)\s*[:：]\s*(?:ok|oui|yes|✓)/i,
  },
  {
    id: "process",
    seed: { methode: "MEDDIC", partie: "Decision process" },
    prio: 4,
    geste: "Demander le chemin réel : qui relit, quel délai, quelle alternative déjà sur la table.",
    signal: /\b(process|processus|comité|comite|décembre|decembre|pilote|go\/no|timeline|échéance)/i,
    preuve: /\b(semaines?|jours?|mois)\b.{0,40}\b(contrat|signature|comité|comite)/i,
    vert: /(?:decision process|process(?:us)?)\s*[:：]\s*(?:ok|oui|yes|✓)/i,
  },
  {
    id: "paper",
    seed: { methode: "MEDDPICC", partie: "Paper process" },
    prio: 6,
    geste: "Sortir le process papier : juridique, DPA, qui paraphe.",
    signal: /\b(papier|juridique|contrat|dpa|achat|procurement|paper)/i,
    preuve: /\b(dpa|juridique|procurement|paraphe|achat)\b.{0,40}\b(relit|signe|délai|delai)/i,
    vert: /paper process\s*[:：]\s*(?:ok|oui|yes|✓)/i,
  },
  {
    id: "competition",
    seed: { methode: "MEDDPICC", partie: "Competition" },
    prio: 7,
    geste: "Nommer l’alternative réelle — y compris le statu quo.",
    signal: /\b(concurrent|concurrence|alternative|statu quo|déjà un outil|deja un outil)/i,
    preuve: /\b(statu quo|concurrent|alternative)\b.{0,40}[A-ZÉÈ][\w-]{2,}/,
    vert: /(?:competition|concurren(?:t|ce|ts)?)\s*[:：]\s*(?:ok|oui|yes|✓)/i,
  },
  {
    id: "budget",
    seed: { methode: "BANT", partie: "Budget" },
    prio: 8,
    geste: "Budget : enveloppe, millésime, et qui la tient — pas « on verra ».",
    signal: /\b(budget|enveloppe|capex|opex)/i,
    preuve: /\d[\d\s]*\s*(?:€|eur|k€|euros)/i,
    vert: /budget\s*[:：]\s*(?:ok|oui|yes|✓)/i,
  },
  {
    id: "timeline",
    seed: { methode: "BANT", partie: "Timeline" },
    prio: 9,
    geste: "Une date qui coûte si on la rate — pas « on avance si le pilote passe ».",
    signal: /\b(timeline|échéance|echeance|date|décembre|q[1-4]|cette année)/i,
    preuve: /\b(20\d{2}|janvier|février|mars|avril|mai|juin|juillet|août|septembre|octobre|novembre|décembre)\b/i,
    vert: /(?:timeline|échéance)\s*[:：]\s*(?:ok|oui|yes|✓)/i,
  },
];

export function rattachementsOf(rule: CaseRule): Rattachement[] {
  return expand(rule.seed);
}
