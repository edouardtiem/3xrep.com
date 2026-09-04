import { corpus } from "./corpus";
import type { Etat } from "./etat";
import { REFUS, runMoteur } from "./moteur";
import { PIECES } from "./pieces";
import type {
  ContratRendu,
  DealInput,
  Geste,
  Mort,
  PieceVerdict,
  Rattachement,
} from "./types";

/** Un deal tel que le CRM le raconte : étape, date de close, dernière modif — plus les artefacts. */
export type PipeDeal = DealInput & {
  nom?: string;
  closeDate?: string;
  derniereModif?: string;
};

export type Contradiction =
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
  | { type: "fiche_figee"; deal: string; crm: string; jours: number; raison: string };

export type PipeDealVerdict = {
  nom: string;
  etape: string | null;
  closeDate: string | null;
  layer: 0 | 1 | 2;
  grade: "A" | "B" | "C";
  refus: string | null;
  mort: Mort | null;
  geste: Geste | null;
  contradictions: Contradiction[];
};

export type TrouSystemique = {
  piece: string;
  deals: string[];
  sur: number;
  rattachements: Rattachement[];
  question: string;
};

export type PipeReview = {
  geste: "pipe-review";
  deals: PipeDealVerdict[];
  contradictions: Contradiction[];
  trous_systemiques: TrouSystemique[];
  rendu: ContratRendu;
};

/** Ce qu’une étape CRM prétend. Une pièce non prouvée = l’étape ment. */
const ETAPES: { re: RegExp; exige: string[] }[] = [
  {
    re: /\b(n[ée]go\w*|negotiation|contract|contrat|closing|commit\w*|verbal|signature|legal|juridique|procurement|achats)\b/i,
    exige: ["qui-tranche", "enjeu-chiffre", "budget", "process-papier"],
  },
  {
    re: /\b(propos\w*|proposal|devis|quote|pricing|d[ée]mo\w*|[ée]valuation|poc|pilot\w*)\b/i,
    exige: ["qui-tranche", "enjeu-chiffre"],
  },
];

const FIGEE_JOURS = 30;

function jours(depuis: string, now: Date): number | null {
  const t = Date.parse(depuis);
  if (Number.isNaN(t)) return null;
  return Math.floor((now.getTime() - t) / 86_400_000);
}

function verdictDeal(
  deal: PipeDeal,
  i: number,
  now: Date,
): { verdict: PipeDealVerdict; pieces: PieceVerdict[] } {
  const nom = deal.nom?.trim() || `deal ${i + 1}`;
  const etape = deal.etape?.trim() || null;
  const closeDate = deal.closeDate?.trim() || null;
  const audit = runMoteur({ ...deal, geste: "pipe-review" }, { stopAt: 7 });

  if (!corpus(deal).replace(etape ?? "", "").trim()) {
    return {
      verdict: {
        nom,
        etape,
        closeDate,
        layer: audit.layer,
        grade: audit.grade,
        refus: REFUS,
        mort: null,
        geste: null,
        contradictions: [],
      },
      pieces: audit.pieces,
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
    const papier = etatDe("process-papier");
    const manque = [tranche, papier].find((p) => p && p.etat !== "su");
    if (manque) {
      contradictions.push({
        type: "date_sans_exhibit",
        deal: nom,
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
        crm: `dernière modif : ${deal.derniereModif}`,
        jours: j,
        raison: `la fiche n’a pas bougé depuis ${j} jours : l’étape est un souvenir, pas un état.`,
      });
    }
  }

  return {
    verdict: {
      nom,
      etape,
      closeDate,
      layer: audit.layer,
      grade: audit.grade,
      refus: null,
      mort: audit.morts[0] ?? null,
      geste: audit.geste,
      contradictions,
    },
    pieces: audit.pieces,
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

export const CONTRAT_PIPE: ContratRendu = {
  langue: "user, else prompt",
  blocs: [
    {
      id: "pipe",
      job: "The pipe, not the rep. N deals, N contradictions, N holes that repeat. No percentage, no coverage, no weighted pipeline.",
    },
    {
      id: "contradictions",
      job: "One per line: what the CRM claims (stage, close date, last touch) vs what the calls prove (the piece, its state). 'This stage is illegal' is allowed. 'This close date is a claim' is allowed. Quote, or stay quiet.",
    },
    {
      id: "systemique",
      job: "The hole that repeats across deals. One sentence, the deals it touches, the one question to ask in every next call.",
    },
    {
      id: "gestes",
      job: "One move per deal — the one that costs. Not a to-do list. Skip deals with nothing to open.",
    },
    {
      id: "refus",
      job: "Deals with no artefact: 'not enough to judge — the call is missing'. Never fill the gap with the CRM fields.",
    },
  ],
  interdits: [
    "close probability",
    "coverage × win rate",
    "forecast in euros",
    "ranking reps",
    "you close Friday",
    "rewriting CRM fields — say the correction, they write it in their CRM",
    "inventing a quote to sound tough",
  ],
};

export function pipeReview(deals: PipeDeal[], now: Date = new Date()): PipeReview {
  const runs = deals.map((d, i) => verdictDeal(d, i, now));
  const verdicts = runs.map((r) => r.verdict);
  return {
    geste: "pipe-review",
    deals: verdicts,
    contradictions: verdicts.flatMap((v) => v.contradictions),
    trous_systemiques: trousSystemiques(
      runs.filter((r) => !r.verdict.refus).map((r) => ({ nom: r.verdict.nom, pieces: r.pieces })),
    ),
    rendu: CONTRAT_PIPE,
  };
}
