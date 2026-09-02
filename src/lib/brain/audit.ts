import { corpus, hit } from "./corpus";
import { CONTRAT } from "./contrat";
import { etatDe } from "./etat";
import { layerOf } from "./layer";
import { CASES, rattachementsOf } from "./playbooks";
import type { Audit, DealInput, Geste, Trou } from "./types";

export function scoreDeal(deal: DealInput): Audit {
  const text = corpus(deal);
  const layer = layerOf(deal);
  const cases = CASES.map((rule) => {
    const preuve = hit(rule.preuve, text);
    const signal = rule.signal.test(text);
    const vertSansPreuve = rule.vert.test(text);
    const etat = etatDe({
      signal,
      preuve: Boolean(preuve),
      vertSansPreuve,
    });
    return {
      id: rule.id,
      etat,
      rattachements: rattachementsOf(rule),
      preuve,
      prio: rule.prio,
      geste: rule.geste,
    };
  });

  const trous: Trou[] = cases.flatMap((c) =>
    c.etat === "su"
      ? []
      : c.rattachements.map((r) => ({
          methode: r.methode,
          partie: r.partie,
          preuve: c.preuve,
          etat: c.etat,
        })),
  );

  const cible = cases
    .filter((c) => c.etat !== "su")
    .sort((a, b) => a.prio - b.prio)[0];

  const geste: Geste = cible
    ? { verbe: cible.geste, case: cible.id }
    : { verbe: "Rien à ouvrir — toutes les cases ont une preuve. Challenger quand même ce qui a l’air vrai.", case: "none" };

  return {
    cases: cases.map(({ id, etat, rattachements, preuve }) => ({
      id,
      etat,
      rattachements,
      preuve,
    })),
    trous,
    geste,
    layer,
    rendu: CONTRAT,
  };
}
