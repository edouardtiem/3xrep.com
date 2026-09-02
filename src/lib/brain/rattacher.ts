import { expand, METHODES } from "./lexique";
import type { Rattachement } from "./types";

export const RATTACHER_MAX = 280;

export type RattacherOk = { ok: true; phrase: string; rattachements: Rattachement[] };
export type RattacherMur = {
  ok: false;
  mur: string;
};

const TRIGGERS: { re: RegExp; seed: Rattachement }[] = [
  { re: /\b(daf|cfo|signe|tranche|economic buyer|autorité|authority)\b/i, seed: { methode: "MEDDIC", partie: "Economic Buyer" } },
  { re: /\b(champion|coach|ops|en interne)\b/i, seed: { methode: "MEDDIC", partie: "Champion" } },
  { re: /\b(jour|€|euro|coût|cout|inaction|métrique|metrics)\b/i, seed: { methode: "MEDDIC", partie: "Metrics" } },
  { re: /\b(trop cher|prix|remise)\b/i, seed: { methode: "CRAC", partie: "Creuser" } },
  { re: /\b(process|comité|comite|papier|juridique)\b/i, seed: { methode: "MEDDIC", partie: "Decision process" } },
  { re: /\b(budget)\b/i, seed: { methode: "BANT", partie: "Budget" } },
  { re: /\b(besoin|douleur|pain)\b/i, seed: { methode: "MEDDIC", partie: "Identify pain" } },
];

export function rattacher(phrase: string): RattacherOk | RattacherMur {
  const p = phrase.trim();
  if (p.includes("\n") || p.length > RATTACHER_MAX) {
    return {
      ok: false,
      mur: "rattacher prend une phrase, pas un dossier. Au-delà, c’est audit_deal — 99 € / org.",
    };
  }
  const rattachements: Rattachement[] = [];
  const seen = new Set<string>();
  for (const t of TRIGGERS) {
    if (!t.re.test(p)) continue;
    for (const r of expand(t.seed)) {
      const k = `${r.methode}:${r.partie}`;
      if (seen.has(k)) continue;
      seen.add(k);
      rattachements.push(r);
    }
  }
  if (rattachements.length === 0) {
    const fallback = METHODES.find((m) => m.nom.toLowerCase() === p.toLowerCase());
    if (fallback) {
      return {
        ok: true,
        phrase: p,
        rattachements: fallback.parties.map((part) => ({
          methode: fallback.nom,
          partie: part.nom,
        })),
      };
    }
    return { ok: true, phrase: p, rattachements: [] };
  }
  return { ok: true, phrase: p, rattachements };
}
