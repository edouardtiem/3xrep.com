import type { Etat } from "./etat";

export type Layer = 0 | 1 | 2;

export type GesteId = "debrief-apres-call" | "passe-trous" | "pipe-review";

export type Evidence = "transcript" | "notes" | "emails" | "chat_paste";

export type Grade = "A" | "B" | "C";

export type ExhibitSource = "transcript" | "meeting" | "mail" | "note" | "crm";

export type ExhibitAuteur = "prospect" | "rep" | "crm" | "inconnu";

export type ExhibitSens = "affirme" | "nie";

export type PieceId =
  | "qui-tranche"
  | "champion-vs-coach"
  | "enjeu-chiffre"
  | "besoin"
  | "budget"
  | "echeance"
  | "criteres-achat"
  | "process-decision"
  | "process-papier"
  | "concurrents";

export type SourceDocument = { id: string; type: ExhibitSource; texte: string; date?: string };
export type SalesContext = {
  cycle?: "court" | "moyen" | "long";
  interlocuteurs?: number;
  comite?: boolean;
  papier?: boolean;
  concurrence?: boolean;
  probleme_reconnu?: boolean;
  moment?: "qualification" | "decouverte" | "demo" | "objection" | "negociation" | "signature";
  entreprise?: string;
};

/** One attributed line. The client LLM extracts; the server verifies and judges. */
export type Exhibit = {
  source: ExhibitSource;
  auteur: ExhibitAuteur;
  nom?: string;
  titre?: string;
  date?: string;
  citation: string;
  piece?: PieceId;
  sens?: ExhibitSens;
  test_pose?: boolean;
  question?: string;
  source_id?: string;
  reponse?: string;
};

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
  exhibits?: Exhibit[];
  sources?: SourceDocument[];
  contexte?: SalesContext;
  contexte_entreprise?: SalesContext;
  crm_id?: string;
  nom?: string;
  denouement?: "gagne" | "perdu" | "ouvert";
};

export type Geste = {
  id: GesteId | "none";
  verbe: string;
  piece: string;
};

export type NextStepCote = "eux" | "nous" | "absent";

/** Sales move the user reads - not a flag. */
export type Action = {
  quoi: string;
  pourquoi: string;
  rattachements: Rattachement[];
  objection: string | null;
  next_step_cote: NextStepCote;
  question: string | null;
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
  gap: { claim: string | null; fait: string | null };
  exhibit?: Exhibit;
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

export type CorrectionCrm = {
  crm_id?: string | null;
  affaire?: string;
  propriete: string;
  crm: string;
  piece: string;
  action: "corriger-apres-confirmation";
  pourquoi: string;
  ne_pas: string;
};

export type Audit = {
  geste_demande: GesteId;
  layer: Layer;
  methode: import("./method-selection").MethodSelection;
  priorite: { piece: string | null; raison: string };
  verification: { index: number; statut: string; raison: string }[];
  grade: Grade;
  pieces: PieceVerdict[];
  trous: Trou[];
  morts: Mort[];
  remontees: Remontee[];
  geste: Geste;
  plan: string[];
  objectif: string;
  strippe: string[];
  /** Aucun artefact : le VP ne se prononce pas. Il ne remplit pas le vide. */
  refus: string | null;
  /** Grade < A : coller le transcript, ou brancher un notetaker. */
  demande: string | null;
  rendu: ContratRendu;
  corrections_crm?: CorrectionCrm[];
  action?: Action;
  strategy?: import("./strategy").Strategy | null;
};
