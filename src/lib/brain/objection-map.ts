import { scoreDeal } from "./audit";
import type { DealInput } from "./types";

const MAP: { re: RegExp; case: string; crac: string }[] = [
  {
    re: /\b(cher|prix|coûte|coute|trop)\b/i,
    case: "metrics",
    crac: "Creuser le « trop cher » — cher contre quoi. Reformuler le coût d’inaction. Argumenter seulement après le chiffre. Contrôler : le DAF entend-il le même nombre ?",
  },
  {
    re: /\b(budget|pas d[e’']argent|pas les moyens)\b/i,
    case: "budget",
    crac: "Creuser qui tient l’enveloppe. Reformuler : pas de budget ≠ pas de DAF. Argumenter l’accès, pas la remise. Contrôler le millésime.",
  },
  {
    re: /\b(déjà|deja|on a un outil|concurrent|statu quo)\b/i,
    case: "competition",
    crac: "Creuser l’alternative réelle (y compris ne rien faire). Reformuler le coût de rester. Pas une punchline produit.",
  },
  {
    re: /\b(je dois en parler|internal|mon chef|on verra)\b/i,
    case: "champion",
    crac: "Creuser s’il porte ou s’il recule. Reformuler le risque pour lui. Contrôler : il amène le DAF, ou il nomme pourquoi pas.",
  },
];

export function objectionMap(input: DealInput & { objection: string }) {
  const audit = scoreDeal(input);
  const hit = MAP.find((m) => m.re.test(input.objection)) ?? MAP[0];
  const cible = audit.cases.find((c) => c.id === hit.case);
  const trou =
    cible && cible.etat !== "su" && cible.rattachements[0]
      ? {
          methode: cible.rattachements[0].methode,
          partie: cible.rattachements[0].partie,
          preuve: cible.preuve,
          etat: cible.etat,
        }
      : (audit.trous[0] ?? null);
  return {
    objection: input.objection,
    case: hit.case,
    crac: hit.crac,
    trou,
    geste: audit.geste,
    layer: audit.layer,
    rendu: audit.rendu,
  };
}
