import type { Etat } from "./etat";

export type Layer = 0 | 1 | 2;

export type Rattachement = {
  methode: string;
  partie: string;
};

export type Trou = {
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
};

export type Geste = {
  verbe: string;
  case: string;
};

export type ContratRendu = {
  blocs: { id: string; job: string }[];
  interdits: string[];
};

export type Audit = {
  cases: { id: string; etat: Etat; rattachements: Rattachement[]; preuve: string | null }[];
  trous: Trou[];
  geste: Geste;
  layer: Layer;
  rendu: ContratRendu;
};
