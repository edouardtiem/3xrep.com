import type { ContratRendu } from "./types";

export const CONTRAT: ContratRendu = {
  blocs: [
    {
      id: "call",
      job: "Le call, pas la personne. Note /10 de la découverte (rapport vs dossier), pas une note RH, pas une proba de close.",
    },
    {
      id: "rate",
      job: "Le raté, collé à une réplique. Citer le transcript (il a dit Y, tu as oublié X). Sinon se taire — c’est un cours.",
    },
    {
      id: "verrous",
      job: "Trois choses à verrouiller avant le prochain, parce que sur CE dossier la signature coince là. Pas quinze. Pas « dans ton industrie ».",
    },
    {
      id: "plan",
      job: "Plan du prochain rdv. 1. 2. 3. Assez court pour tenir dans un call.",
    },
    {
      id: "objectif",
      job: "Une phrase. Le geste qui coûte (ex. le DAF est dans la pièce en R2). Pas « avancer le deal ».",
    },
  ],
  interdits: [
    "note RH sur le commercial",
    "proba de close",
    "tu closes vendredi",
    "checklist de lettres à cocher",
    "dans ton industrie on voit souvent… sans citer ce call",
    "plan de 12 points",
    "objectif flou",
    "+20 XP",
    "mauvaise réponse c’était MEDDIC",
  ],
};
