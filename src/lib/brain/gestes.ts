import type { GesteId } from "./types";

export type GesteDef = {
  id: GesteId;
  declencheur: string;
  familles: Array<"dossier" | "motivations" | "enjeu">;
  contrat: string;
  grade_min: "A" | "B" | "C";
  passe_tous_les_trous: boolean;
};

export const GESTES: GesteDef[] = [
  {
    id: "debrief-apres-call",
    declencheur: "débriefe le call",
    familles: ["dossier", "motivations", "enjeu"],
    contrat: "sortie.md",
    grade_min: "B",
    passe_tous_les_trous: false,
  },
  {
    id: "passe-trous",
    declencheur: "deal qui cale, passe sur les trous",
    familles: ["dossier", "motivations", "enjeu"],
    contrat: "cerveau.md §7",
    grade_min: "B",
    passe_tous_les_trous: true,
  },
];

export function gesteOf(id: GesteId | undefined): GesteDef {
  return GESTES.find((g) => g.id === id) ?? GESTES[0];
}
