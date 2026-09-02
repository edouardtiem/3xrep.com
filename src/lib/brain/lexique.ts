import type { Rattachement } from "./types";

export type Methode = {
  slug: string;
  nom: string;
  famille: "dossier" | "motivations" | "enjeu" | "argumentation" | "negociation" | "questionnement" | "cycle" | "posture";
  parties: { slug: string; nom: string }[];
};

export const METHODES: Methode[] = [
  {
    slug: "bant",
    nom: "BANT",
    famille: "dossier",
    parties: [
      { slug: "budget", nom: "Budget" },
      { slug: "authority", nom: "Authority" },
      { slug: "need", nom: "Need" },
      { slug: "timeline", nom: "Timeline" },
    ],
  },
  {
    slug: "meddic",
    nom: "MEDDIC",
    famille: "dossier",
    parties: [
      { slug: "metrics", nom: "Metrics" },
      { slug: "economic-buyer", nom: "Economic Buyer" },
      { slug: "decision-criteria", nom: "Decision criteria" },
      { slug: "decision-process", nom: "Decision process" },
      { slug: "identify-pain", nom: "Identify pain" },
      { slug: "champion", nom: "Champion" },
    ],
  },
  {
    slug: "meddpicc",
    nom: "MEDDPICC",
    famille: "dossier",
    parties: [
      { slug: "metrics", nom: "Metrics" },
      { slug: "economic-buyer", nom: "Economic Buyer" },
      { slug: "decision-criteria", nom: "Decision criteria" },
      { slug: "decision-process", nom: "Decision process" },
      { slug: "paper-process", nom: "Paper process" },
      { slug: "identify-pain", nom: "Identify pain" },
      { slug: "champion", nom: "Champion" },
      { slug: "competition", nom: "Competition" },
    ],
  },
  {
    slug: "bebedc",
    nom: "BEBEDC",
    famille: "dossier",
    parties: [
      { slug: "besoin", nom: "Besoin" },
      { slug: "enjeu", nom: "Enjeu" },
      { slug: "budget", nom: "Budget" },
      { slug: "echeance", nom: "Échéance" },
      { slug: "decideurs", nom: "Décideurs" },
      { slug: "concurrents", nom: "Concurrents" },
    ],
  },
  {
    slug: "soncas",
    nom: "SONCAS",
    famille: "motivations",
    parties: [
      { slug: "securite", nom: "Sécurité" },
      { slug: "orgueil", nom: "Orgueil" },
      { slug: "nouveaute", nom: "Nouveauté" },
      { slug: "confort", nom: "Confort" },
      { slug: "argent", nom: "Argent" },
      { slug: "sympathie", nom: "Sympathie" },
    ],
  },
  {
    slug: "soncase",
    nom: "SONCASE",
    famille: "motivations",
    parties: [
      { slug: "securite", nom: "Sécurité" },
      { slug: "orgueil", nom: "Orgueil" },
      { slug: "nouveaute", nom: "Nouveauté" },
      { slug: "confort", nom: "Confort" },
      { slug: "argent", nom: "Argent" },
      { slug: "sympathie", nom: "Sympathie" },
      { slug: "environnement", nom: "Environnement" },
    ],
  },
  {
    slug: "cout-inaction",
    nom: "Coût de l’inaction",
    famille: "enjeu",
    parties: [{ slug: "chiffre", nom: "Chiffre" }],
  },
  {
    slug: "cab",
    nom: "CAB",
    famille: "argumentation",
    parties: [
      { slug: "caracteristique", nom: "Caractéristique" },
      { slug: "avantage", nom: "Avantage" },
      { slug: "benefice", nom: "Bénéfice" },
    ],
  },
  {
    slug: "bac",
    nom: "BAC",
    famille: "argumentation",
    parties: [
      { slug: "benefice", nom: "Bénéfice" },
      { slug: "avantage", nom: "Avantage" },
      { slug: "caracteristique", nom: "Caractéristique" },
    ],
  },
  {
    slug: "crac",
    nom: "CRAC",
    famille: "argumentation",
    parties: [
      { slug: "creuser", nom: "Creuser" },
      { slug: "reformuler", nom: "Reformuler" },
      { slug: "argumenter", nom: "Argumenter" },
      { slug: "controler", nom: "Contrôler" },
    ],
  },
  {
    slug: "acrac",
    nom: "(A)CRAC",
    famille: "argumentation",
    parties: [
      { slug: "accroche", nom: "Accroche" },
      { slug: "creuser", nom: "Creuser" },
      { slug: "reformuler", nom: "Reformuler" },
      { slug: "argumenter", nom: "Argumenter" },
      { slug: "controler", nom: "Contrôler" },
    ],
  },
  {
    slug: "points-brules",
    nom: "Points brûlés",
    famille: "argumentation",
    parties: [{ slug: "accord", nom: "Accord verrouillé" }],
  },
  {
    slug: "contreparties",
    nom: "Contreparties",
    famille: "negociation",
    parties: [{ slug: "echange", nom: "Échange" }],
  },
  {
    slug: "champ",
    nom: "CHAMP",
    famille: "dossier",
    parties: [
      { slug: "challenges", nom: "Challenges" },
      { slug: "authority", nom: "Authority" },
      { slug: "money", nom: "Money" },
      { slug: "prioritization", nom: "Prioritization" },
    ],
  },
  {
    slug: "spiced",
    nom: "SPICED",
    famille: "dossier",
    parties: [
      { slug: "situation", nom: "Situation" },
      { slug: "pain", nom: "Pain" },
      { slug: "impact", nom: "Impact" },
      { slug: "critical-event", nom: "Critical event" },
      { slug: "decision", nom: "Decision" },
      { slug: "economic-buyer", nom: "Economic Buyer" },
    ],
  },
  {
    slug: "gpct",
    nom: "GPCT",
    famille: "dossier",
    parties: [
      { slug: "goals", nom: "Goals" },
      { slug: "plans", nom: "Plans" },
      { slug: "challenges", nom: "Challenges" },
      { slug: "timeline", nom: "Timeline" },
    ],
  },
  {
    slug: "anum",
    nom: "ANUM",
    famille: "dossier",
    parties: [
      { slug: "authority", nom: "Authority" },
      { slug: "need", nom: "Need" },
      { slug: "urgency", nom: "Urgency" },
      { slug: "money", nom: "Money" },
    ],
  },
  {
    slug: "neat",
    nom: "NEAT",
    famille: "dossier",
    parties: [
      { slug: "need", nom: "Need" },
      { slug: "economic-impact", nom: "Economic impact" },
      { slug: "access-to-authority", nom: "Access to authority" },
      { slug: "timeline", nom: "Timeline" },
    ],
  },
  {
    slug: "spin",
    nom: "SPIN",
    famille: "questionnement",
    parties: [
      { slug: "situation", nom: "Situation" },
      { slug: "problem", nom: "Problem" },
      { slug: "implication", nom: "Implication" },
      { slug: "need-payoff", nom: "Need-payoff" },
    ],
  },
  {
    slug: "gap-selling",
    nom: "Gap Selling",
    famille: "questionnement",
    parties: [
      { slug: "etat-actuel", nom: "État actuel" },
      { slug: "etat-voulu", nom: "État voulu" },
      { slug: "gap", nom: "Gap" },
    ],
  },
  {
    slug: "snap",
    nom: "SNAP",
    famille: "argumentation",
    parties: [
      { slug: "simple", nom: "Simple" },
      { slug: "invaluable", nom: "iNvaluable" },
      { slug: "aligned", nom: "Aligned" },
      { slug: "priority", nom: "Priority" },
    ],
  },
  {
    slug: "4c",
    nom: "4C",
    famille: "negociation",
    parties: [
      { slug: "cadre", nom: "Cadre" },
      { slug: "concession", nom: "Concession" },
      { slug: "contrepartie", nom: "Contrepartie" },
      { slug: "contrat", nom: "Contrat" },
    ],
  },
  {
    slug: "spanco",
    nom: "SPANCO",
    famille: "cycle",
    parties: [
      { slug: "suspect", nom: "Suspect" },
      { slug: "prospect", nom: "Prospect" },
      { slug: "approche", nom: "Approche" },
      { slug: "nego", nom: "Négo" },
      { slug: "conclusion", nom: "Conclusion" },
      { slug: "ordre", nom: "Ordre" },
    ],
  },
  {
    slug: "challenger",
    nom: "Challenger",
    famille: "posture",
    parties: [
      { slug: "teach", nom: "Teach" },
      { slug: "tailor", nom: "Tailor" },
      { slug: "take-control", nom: "Take control" },
    ],
  },
  {
    slug: "sandler",
    nom: "Sandler",
    famille: "posture",
    parties: [
      { slug: "pain", nom: "Pain" },
      { slug: "budget", nom: "Budget" },
      { slug: "decision", nom: "Decision" },
      { slug: "upfront-contract", nom: "Upfront contract" },
    ],
  },
  {
    slug: "strategic-selling",
    nom: "Strategic Selling",
    famille: "dossier",
    parties: [
      { slug: "economic-buyer", nom: "Economic Buyer" },
      { slug: "user-buyer", nom: "User Buyer" },
      { slug: "technical-buyer", nom: "Technical Buyer" },
      { slug: "coach", nom: "Coach" },
    ],
  },
];

/** Même case, plusieurs grilles. Voulu. */
export const EQUIVALENCES: Rattachement[][] = [
  [
    { methode: "MEDDIC", partie: "Economic Buyer" },
    { methode: "MEDDPICC", partie: "Economic Buyer" },
    { methode: "BANT", partie: "Authority" },
    { methode: "BEBEDC", partie: "Décideurs" },
  ],
  [
    { methode: "MEDDIC", partie: "Metrics" },
    { methode: "MEDDPICC", partie: "Metrics" },
    { methode: "BEBEDC", partie: "Enjeu" },
    { methode: "Coût de l’inaction", partie: "Chiffre" },
  ],
  [
    { methode: "MEDDIC", partie: "Identify pain" },
    { methode: "BANT", partie: "Need" },
    { methode: "BEBEDC", partie: "Besoin" },
  ],
  [
    { methode: "MEDDIC", partie: "Decision process" },
    { methode: "MEDDPICC", partie: "Decision process" },
    { methode: "BANT", partie: "Timeline" },
    { methode: "BEBEDC", partie: "Échéance" },
  ],
  [
    { methode: "MEDDPICC", partie: "Competition" },
    { methode: "BEBEDC", partie: "Concurrents" },
  ],
  [
    { methode: "MEDDIC", partie: "Champion" },
    { methode: "MEDDPICC", partie: "Champion" },
  ],
  [
    { methode: "BANT", partie: "Budget" },
    { methode: "BEBEDC", partie: "Budget" },
  ],
];

export function expand(seed: Rattachement): Rattachement[] {
  const group = EQUIVALENCES.find((g) =>
    g.some((r) => r.methode === seed.methode && r.partie === seed.partie),
  );
  return group ?? [seed];
}

export function findMethode(q: string): Methode | undefined {
  const n = q.trim().toLowerCase();
  return METHODES.find(
    (m) =>
      m.slug === n ||
      m.nom.toLowerCase() === n ||
      m.parties.some((p) => p.slug === n || p.nom.toLowerCase() === n),
  );
}
