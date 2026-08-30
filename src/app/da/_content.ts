export type Etat = "vide" | "suppose" | "su";

export type Cell = {
  id: string;
  label: string;
  su?: string;
  suppose?: string;
};

export const PARCOURS_JOUEUR = "Call avec l’ops";

export const CAS = {
  id: "acme-julien",
  titre_joueur: "Call Acme — Julien, ops",
  entreprise: "Acme",
  en_face: "Julien Morel, directeur ops",
};

export const CELLS: Cell[] = [
  { id: "face", label: "En face", su: "Julien Morel, directeur ops — Lyon" },
  { id: "decide", label: "Qui décide" },
  { id: "champion", label: "Champion", suppose: "Julien se propose" },
  { id: "metrique", label: "Métrique", suppose: "« Deux jours perdus / semaine » — Julien" },
  { id: "douleur", label: "Douleur" },
  { id: "critere", label: "Critère" },
  { id: "process", label: "Process", suppose: "« On avance si le pilote passe »" },
];

export const AUTRES_CAS = [
  { id: "acme-julien", titre_joueur: "Call Acme — Julien, ops", playable: true },
  { id: "bridor-samira", titre_joueur: "Call Bridor — Samira, ops", playable: false },
  { id: "alstom-karim", titre_joueur: "Call Alstom — Karim, ops", playable: false },
] as const;

export const NEXT: Record<Etat, Etat> = {
  vide: "suppose",
  suppose: "su",
  su: "vide",
};

export function startEtat(c: Cell): Etat {
  if (c.su) return "su";
  if (c.suppose) return "suppose";
  return "vide";
}

export function initialEtats(): Record<string, Etat> {
  return Object.fromEntries(CELLS.map((c) => [c.id, startEtat(c)]));
}

export function cellValue(c: Cell, e: Etat): string {
  if (e === "su") return c.su ?? c.suppose ?? "Posé";
  if (e === "suppose") return c.suppose ?? "Supposé — pas de preuve";
  return "—";
}

export const DECIDE_DECOUVERT = "Le DAF. Pas dans l’appel. C’est lui qui tranche.";

export function sortieCopy(cran: "voir" | "inclure" | "absent"): {
  titre: string;
  trou: string;
} {
  if (cran === "voir") {
    return {
      titre: "J’ai sorti le DAF. Il était dans la pièce.",
      trou: "MEDDIC Economic Buyer tenu. BANT Authority tenue. BEBEDC Décideurs : vu.",
    };
  }
  if (cran === "inclure") {
    return {
      titre: "Je l’ai mis dans la décision sans l’avoir en face.",
      trou: "BEBEDC Décideurs : compris, pas vu. Contrepartie : accès via l’ops.",
    };
  }
  return {
    titre: "Le DAF a dit non. Je n’avais qu’un ops.",
    trou: "Trou nommé : MEDDIC Economic Buyer vide — coach, pas champion. BANT Authority vide.",
  };
}
