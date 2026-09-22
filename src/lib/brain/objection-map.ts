import { objectionPiece } from "./priorite";
import { runMoteur } from "./moteur";
import type { DealInput, Rattachement } from "./types";

const MAP: { re: RegExp; piece: string; crac: string }[] = [
  {
    re: /\b(cher|prix|coûte|coute|expensive|price|cost)\b/i,
    piece: "enjeu-chiffre",
    crac: "Creuser le « trop cher » - cher contre quoi. Reformuler le coût d’inaction. Argumenter seulement après le chiffre. Contrôler : le DAF entend-il le même nombre ?",
  },
  {
    re: /\b(budget|pas d[e’']argent|pas les moyens|money|afford)\b/i,
    piece: "budget",
    crac: "Creuser qui tient l’enveloppe. Reformuler : pas de budget ≠ pas de DAF. Argumenter l’accès, pas la remise. Contrôler le millésime.",
  },
  {
    re: /\b(déjà|deja|on a un outil|concurrent|statu quo|competitor|alternative|status quo|already)\b/i,
    piece: "concurrents",
    crac: "Creuser l’alternative réelle (y compris ne rien faire). Reformuler le coût de rester. Pas une punchline produit.",
  },
  {
    re: /\b(je dois en parler|internal|mon chef|my boss|en interne|on verra)\b/i,
    piece: "champion-vs-coach",
    crac: "Ce n’est pas une objection prix - c’est décideurs / champion. Creuser s’il porte ou s’il recule. Contrôler : il amène celui qui signe, ou il nomme pourquoi pas.",
  },
];

export function objectionMap(input: DealInput & { objection: string }) {
  const phrase = input.objection.trim();
  const audit = runMoteur({ ...input, objection: phrase });
  if (!phrase) {
    return {
      objection: "",
      refus: "Coller la phrase exacte. Ne pas inventer l’objection.",
      piece: null,
      crac: null,
      trou: null,
      rattachements: [] as Rattachement[],
      geste: audit.geste,
      layer: audit.layer,
      morts: audit.morts,
      rendu: audit.rendu,
      action: audit.action ?? null,
    };
  }
  const hit = MAP.find((m) => m.re.test(phrase));
  const piece = objectionPiece(phrase) ?? audit.morts[0]?.piece ?? "qui-tranche";
  const cible = audit.pieces.find((c) => c.id === piece);
  const rattachements: Rattachement[] = cible?.rattachements ?? [];
  const trou =
    cible && cible.etat !== "su" && rattachements[0]
      ? {
          piece: cible.id,
          methode: rattachements[0].methode,
          partie: rattachements[0].partie,
          preuve: cible.preuve,
          etat: cible.etat,
          rattachements,
        }
      : null;
  const crac =
    hit?.crac ??
    "Creuser dans le prochain rendez-vous. Proposer une formulation ancrée dans les preuves, sans envoi automatique.";
  const base = audit.action;
  const question = cible?.etat === "su" ? "Ce point est documenté : qu’est-ce qui a changé, ou qu’est-ce qui bloque encore ?" : base?.question ?? null;
  return {
    strategy: audit.strategy,
    objection: phrase,
    pieces: audit.pieces,
    methode: audit.methode,
    priorite: audit.priorite,
    verification: audit.verification,
    refus: audit.refus,
    corrections_crm: audit.corrections_crm,
    piece,
    crac,
    trou,
    rattachements,
    geste: audit.geste,
    layer: audit.layer,
    morts: audit.morts,
    rendu: audit.rendu,
    action: {
      quoi: `Dans le prochain rendez-vous chez eux, creuser cette phrase - pas un mail de réplique.${question ? ` Poser : « ${question} »` : ""}`,
      pourquoi: base?.pourquoi ?? "",
      rattachements,
      objection: phrase,
      next_step_cote: base?.next_step_cote ?? "absent",
      question,
    },
  };
}
