import { correctionsFromPipe, sommePortesCassees } from "@/lib/corrections";
import { A_RISQUE_MOT, actionPourDeal, REGLER_AGENDA } from "./action";
import { STAGES } from "./priorite";
import type { Etat } from "./etat";
import { REFUS, runMoteur } from "./moteur";
import { pieceOf, PIECES } from "./pieces";
import type {
  Action,
  ContratRendu,
  CorrectionCrm,
  DealInput,
  Geste,
  Mort,
  PieceVerdict,
  Rattachement,
} from "./types";

/** Un deal tel que le CRM le raconte : étape, date de close, dernière modif - plus les artefacts. */
export type PipeDeal = DealInput & {
  nom?: string;
  closeDate?: string;
  derniereModif?: string;
  crm_id?: string;
  denouement?: "gagne" | "perdu" | "ouvert";
};

export type Contradiction = { crm_id?: string | null } & (
  | {
      type: "etape_illegale";
      deal: string;
      crm: string;
      piece: string;
      etat: Etat;
      rattachements: Rattachement[];
      raison: string;
    }
  | { type: "date_sans_exhibit"; deal: string; crm: string; piece: string; raison: string }
  | { type: "fiche_figee"; deal: string; crm: string; jours: number; raison: string });

export type PipeDealVerdict = {
  crm_id: string | null;
  methode: import("./method-selection").MethodSelection;
  nom: string;
  etape: string | null;
  closeDate: string | null;
  layer: 0 | 1 | 2;
  grade: "A" | "B" | "C";
  refus: string | null;
  demande: string | null;
  mort: Mort | null;
  geste: Geste | null;
  contradictions: Contradiction[];
  etats: { id: string; etat: Etat }[];
  action: Action | null;
};

export type TrouSystemique = {
  piece: string;
  deals: string[];
  sur: number;
  rattachements: Rattachement[];
  question: string;
};

export type Recommandation = {
  type: "question-mandatory" | "gate-stage" | "train-reflex";
  piece: string;
  deals: string[];
  quoi: string;
  pourquoi: string;
};

export type LundiTotaux = {
  liste: number | null;
  a_risque: number | null;
  ce_mois: number | null;
  ce_mois_a_risque: number | null;
};

export type LundiLecture = {
  etat: "solide" | "fragile" | "indetermine";
  motif: string;
  regler: string;
};

export type Lundi = {
  totaux: LundiTotaux;
  a_risque_mot: typeof A_RISQUE_MOT;
  ce_mois: { nom: string; montant: number | null }[];
  reste: { nom: string; montant: number | null }[];
  lecture: LundiLecture;
};

export type PipeReview = {
  geste: "pipe-review";
  deals: PipeDealVerdict[];
  contradictions: Contradiction[];
  trous_systemiques: TrouSystemique[];
  recommandations: Recommandation[];
  rendu: ContratRendu;
  somme_portes_cassees: number | null;
  corrections_crm: CorrectionCrm[];
  lundi: Lundi;
};

/** Ce qu’une étape CRM prétend. Une pièce non prouvée = l’étape ment. */
const ETAPES = STAGES;

const FIGEE_JOURS = 30;

function jours(depuis: string, now: Date): number | null {
  const t = Date.parse(depuis);
  if (Number.isNaN(t)) return null;
  return Math.floor((now.getTime() - t) / 86_400_000);
}

function actionOf(
  deal: PipeDeal,
  pieces: PieceVerdict[],
  etape: string | null,
  refus: string | null,
  contradictions: Contradiction[],
): Action {
  return actionPourDeal({ deal, pieces, etape, refus, contradictions });
}

function verdictDeal(
  deal: PipeDeal,
  i: number,
  now: Date,
): { verdict: PipeDealVerdict; pieces: PieceVerdict[]; deal: PipeDeal } {
  const nom = deal.nom?.trim() || `deal ${i + 1}`;
  const etape = deal.etape?.trim() || null;
  const closeDate = deal.closeDate?.trim() || null;
  const audit = runMoteur({ ...deal, geste: "pipe-review" }, { stopAt: 7 });

  if (audit.refus) {
    return {
      verdict: {
        nom,
        crm_id: deal.crm_id ?? null,
        methode: audit.methode,
        etape,
        closeDate,
        layer: audit.layer,
        grade: audit.grade,
        refus: REFUS,
        demande: audit.demande,
        mort: null,
        geste: null,
        contradictions: [],
        etats: audit.pieces.map((p) => ({ id: p.id, etat: p.etat })),
        action: actionOf(deal, audit.pieces, etape, REFUS, []),
      },
      pieces: audit.pieces,
      deal,
    };
  }

  const contradictions: Contradiction[] = [];
  const etatDe = (id: string) => audit.pieces.find((p) => p.id === id);

  const regle = etape ? ETAPES.find((r) => r.re.test(etape)) : undefined;
  if (regle && etape) {
    // Une seule : la pièce qui tue le plus tôt. Pas la liste des cases vides.
    const p = audit.morts.map((m) => etatDe(m.piece)).find((x) => x && regle.exige.includes(x.id));
    if (p) {
      contradictions.push({
        type: "etape_illegale",
        deal: nom,
        crm_id: deal.crm_id ?? null,
        crm: `étape : ${etape}`,
        piece: p.id,
        etat: p.etat,
        rattachements: p.rattachements,
        raison: `${etape} + ${p.rattachements[0]?.partie ?? p.id} ${p.etat} : l’étape ment.${p.raison ? ` ${p.raison}.` : ""}`,
      });
    }
  }

  if (closeDate) {
    const tranche = etatDe("qui-tranche");
    const papier = etatDe("echeance");
    const manque = [tranche, papier].find((p) => p && p.etat !== "su");
    if (manque) {
      contradictions.push({
        type: "date_sans_exhibit",
        deal: nom,
        crm_id: deal.crm_id ?? null,
        crm: `close : ${closeDate}`,
        piece: manque.id,
        raison: `une date de close sans ${manque.rattachements[0]?.partie ?? manque.id} prouvé est un claim, pas un fait.`,
      });
    }
  }

  if (deal.derniereModif) {
    const j = jours(deal.derniereModif, now);
    if (j != null && j > FIGEE_JOURS) {
      contradictions.push({
        type: "fiche_figee",
        deal: nom,
        crm_id: deal.crm_id ?? null,
        crm: `dernière modif : ${deal.derniereModif}`,
        jours: j,
        raison: `la fiche n’a pas bougé depuis ${j} jours : l’étape est un souvenir, pas un état.`,
      });
    }
  }

  return {
    verdict: {
      nom,
      crm_id: deal.crm_id ?? null,
      methode: audit.methode,
      etape,
      closeDate,
      layer: audit.layer,
      grade: audit.grade,
      refus: null,
      demande: audit.demande,
      mort: audit.morts[0] ?? null,
      geste: audit.geste,
      contradictions,
      etats: audit.pieces.map((p) => ({ id: p.id, etat: p.etat })),
      action: actionOf(deal, audit.pieces, etape, null, contradictions),
    },
    pieces: audit.pieces,
    deal,
  };
}

function inCalendarMonth(closeDate: string | null, now: Date): boolean {
  if (!closeDate) return false;
  const t = Date.parse(closeDate);
  if (Number.isNaN(t)) return false;
  const d = new Date(t);
  return d.getUTCFullYear() === now.getUTCFullYear() && d.getUTCMonth() === now.getUTCMonth();
}

function sommeMontants(deals: { montant?: number }[]): number | null {
  let sum = 0;
  let any = false;
  for (const d of deals) {
    if (d.montant == null || !Number.isFinite(d.montant)) continue;
    sum += d.montant;
    any = true;
  }
  return any ? sum : null;
}

function risqueCeMois(c: Contradiction): boolean {
  return c.type === "etape_illegale" || c.type === "date_sans_exhibit" || c.type === "fiche_figee";
}

function lundiOf(
  runs: { verdict: PipeDealVerdict; deal: PipeDeal }[],
  trous: TrouSystemique[],
  aRisque: number | null,
  now: Date,
): Lundi {
  const ligne = (r: { verdict: PipeDealVerdict; deal: PipeDeal }) => ({
    nom: r.verdict.nom,
    montant: r.deal.montant != null && Number.isFinite(r.deal.montant) ? r.deal.montant : null,
  });
  const ceMoisRuns = runs.filter((r) => inCalendarMonth(r.verdict.closeDate, now));
  const resteRuns = runs.filter((r) => !inCalendarMonth(r.verdict.closeDate, now));
  const liste = sommeMontants(runs.map((r) => r.deal));
  const ce_mois = sommeMontants(ceMoisRuns.map((r) => r.deal));
  const ceMoisRisque = ceMoisRuns.filter((r) => r.verdict.contradictions.some(risqueCeMois));
  const ce_mois_a_risque = sommeMontants(ceMoisRisque.map((r) => r.deal));
  const fragile = liste != null && aRisque != null && aRisque * 2 >= liste;
  const incomplete = runs.some(r => r.verdict.refus || r.deal.montant == null ||
    r.verdict.etats.some(p => p.etat !== "su"));
  const nNous = runs.filter((r) => r.verdict.action?.next_step_cote === "nous").length;
  const top = trous[0];
  const etapes = nNous
    ? `${nNous} prochaine${nNous > 1 ? "s" : ""} étape${nNous > 1 ? "s" : ""} chez nous.`
    : "Les prochaines étapes datées chez le prospect comptent.";
  const motif = top
    ? `${top.piece} se répète sur ${top.deals.length} affaires sur ${top.sur}. ${etapes}`
    : etapes;
  return {
    totaux: { liste, a_risque: aRisque, ce_mois, ce_mois_a_risque },
    a_risque_mot: A_RISQUE_MOT,
    ce_mois: ceMoisRuns.map(ligne),
    reste: resteRuns.map(ligne),
    lecture: {
      etat: fragile ? "fragile" : incomplete ? "indetermine" : "solide",
      motif: incomplete && !fragile ? "Données ou preuves insuffisantes pour conclure à une liste solide. " + motif : motif,
      regler: REGLER_AGENDA,
    },
  };
}

function trousSystemiques(juges: { nom: string; pieces: PieceVerdict[] }[]): TrouSystemique[] {
  if (juges.length < 2) return [];
  const seuil = Math.max(2, Math.ceil(juges.length / 2));
  const out: TrouSystemique[] = [];
  for (const piece of PIECES) {
    const touches = juges.filter((j) => {
      const p = j.pieces.find((x) => x.id === piece.id);
      return p != null && p.etat !== "su";
    });
    if (touches.length < seuil) continue;
    out.push({
      piece: piece.id,
      deals: touches.map((j) => j.nom),
      sur: juges.length,
      rattachements: touches[0].pieces.find((x) => x.id === piece.id)?.rattachements ?? [],
      question: piece.echelle[0]?.question ?? piece.question,
    });
  }
  // Deux au plus, dans l’ordre de la mort. Six trous systémiques = une grille, pas un verdict.
  const ordre = (id: string) => PIECES.find((p) => p.id === id)?.mort.ordre ?? 99;
  return out
    .sort((a, b) => b.deals.length - a.deals.length || ordre(a.piece) - ordre(b.piece))
    .slice(0, 2);
}

function recommandations(
  trous: TrouSystemique[],
  contradictions: Contradiction[],
): Recommandation[] {
  const out: Recommandation[] = [];
  const top = trous[0];
  if (top) {
    const piece = pieceOf(top.piece);
    out.push({
      type: "question-mandatory",
      piece: top.piece,
      deals: top.deals,
      quoi: `rendre obligatoire avant le prochain rdv : « ${top.question} »`,
      pourquoi: `${top.piece} non tenu sur ${top.deals.length} deals sur ${top.sur}. Sans ça le dossier meurt à ${piece?.mort.etage ?? "signature"}.`,
    });
  }

  const groups = new Map<string, { crm: string; piece: string; deals: string[] }>();
  for (const c of contradictions) {
    if (c.type !== "etape_illegale") continue;
    const regle = ETAPES.findIndex((r) => r.re.test(c.crm));
    const key = `${regle}::${c.piece}`;
    const g = groups.get(key) ?? { crm: c.crm, piece: c.piece, deals: [] };
    if (!g.deals.includes(c.deal)) g.deals.push(c.deal);
    groups.set(key, g);
  }
  const illegal = [...groups.values()].sort((a, b) => b.deals.length - a.deals.length)[0];
  if (illegal && illegal.deals.length >= 2) {
    out.push({
      type: "gate-stage",
      piece: illegal.piece,
      deals: illegal.deals,
      quoi: `gater l’étape (ou la supprimer) : ${illegal.crm} n’existe pas tant que ${illegal.piece} n’est pas tenu`,
      pourquoi: `l’étape ment sur ${illegal.deals.length} deals. Un forecast sur cette étape est un souvenir.`,
    });
  }

  if (top) {
    const reflexe = pieceOf(top.piece)?.perches[0]?.reflexe;
    if (reflexe) {
      out.push({
        type: "train-reflex",
        piece: top.piece,
        deals: top.deals,
        quoi: `former le réflexe ${reflexe} - pas un module, le geste dans le call`,
        pourquoi: `c’est la porte de ${top.piece}. L’info du deal suivant ne viendra pas d’un cours.`,
      });
    }
  }

  return out.slice(0, 3);
}

export const CONTRAT_PIPE: ContratRendu = {
  langue: "user, else prompt",
  blocs: [
    {
      id: "totaux",
      job: "Four written sums, not a forecast: total list, at risk (late stage that is not market practice), what the file says this month, this month at risk. Speak lundi.a_risque_mot. No percentage.",
    },
    {
      id: "ce_mois",
      job: "Named deals this month. Each: the sales move (quoi), why (methods from action.rattachements), objection only if action.objection is a quote. Late stage without the signer: a meeting with whoever signs, not a negotiation with ops. Homework next-steps don't count.",
    },
    {
      id: "reste",
      job: "The rest of the list. Same shape, less urgency.",
    },
    {
      id: "lecture",
      job: "Solid or fragile. The repeating pattern. One house rule for tomorrow (lundi.lecture.regler). No 'you'll close more'.",
    },
    {
      id: "refus",
      job: "Deals with no artefact: the call is missing. Don't invent an objection. Never fill the gap with CRM fields.",
    },
  ],
  interdits: [
    "close probability",
    "coverage × win rate",
    "conversion rate",
    "from x to y",
    "you'll close more",
    "forecast in euros",
    "signature théorique",
    "forte chance de perdre",
    "MEDDIC score",
    "ranking reps",
    "you close Friday",
    "rewriting CRM fields - say the correction, they write it in their CRM",
    "inventing a quote to sound tough",
  ],
};

export function pipeReview(deals: PipeDeal[], now: Date = new Date()): PipeReview {
  const runs = deals.map((d, i) => verdictDeal(d, i, now));
  const verdicts = runs.map((r) => r.verdict);
  const contradictions = verdicts.flatMap((v) => v.contradictions);
  const trous = trousSystemiques(
    runs.filter((r) => !r.verdict.refus).map((r) => ({ nom: r.verdict.nom, pieces: r.pieces })),
  );
  const somme = sommePortesCassees(deals, contradictions);
  return {
    geste: "pipe-review",
    deals: verdicts,
    contradictions,
    trous_systemiques: trous,
    recommandations: recommandations(trous, contradictions),
    rendu: CONTRAT_PIPE,
    somme_portes_cassees: somme,
    corrections_crm: correctionsFromPipe(contradictions),
    lundi: lundiOf(runs, trous, somme, now),
  };
}
