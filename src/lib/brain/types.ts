import type { Etat } from "./etat";

export type Layer = 0 | 1 | 2;

export type GesteId = "debrief-apres-call" | "passe-trous";

export type Evidence = "transcript" | "notes" | "emails" | "chat_paste";

export type Grade = "A" | "B" | "C";

export type Rattachement = {
  methode: string;
  partie: string;
};

export type Trou = {
  piece: string;
  methode: string;
  partie: string;
  preuve: string | null;
  etat: Etat;
};

export type DealInput = {
  etape?: string;
  montant?: number;
  notes?: string;
  mails?: string;
  meetings?: string;
  transcript?: string;
  nextStep?: string;
  geste?: GesteId;
  evidence?: Evidence;
  objection?: string;
};

export type Geste = {
  id: GesteId | "none";
  verbe: string;
  piece: string;
};

export type ContratRendu = {
  langue: "user, else prompt";
  blocs: { id: string; job: string }[];
  interdits: string[];
};

export type PieceVerdict = {
  id: string;
  etat: Etat;
  rattachements: Rattachement[];
  preuve: string | null;
  raison?: string;
};

export type Mort = {
  piece: string;
  etage: string;
  quand: string;
  phrase: string;
  ordre: number;
};

export type Remontee = {
  piece: string;
  fenetre: string | null;
  reflexe: string | null;
  echelle: { cran: number; question: string; donne: string }[];
  gain: { savoir: string; faire: string };
  cout_du_retard: string;
};

export type Audit = {
  geste_demande: GesteId;
  layer: Layer;
  grade: Grade;
  pieces: PieceVerdict[];
  trous: Trou[];
  morts: Mort[];
  remontees: Remontee[];
  geste: Geste;
  plan: string[];
  objectif: string;
  strippe: string[];
  rendu: ContratRendu;
};
