import { CONTRAT } from "./contrat";
import { corpus, hit } from "./corpus";
import { etatDe } from "./etat";
import { aUnVerbatim, extraireFaits, literalementDans } from "./faits";
import { gesteOf } from "./gestes";
import { layerOf } from "./layer";
import { expand } from "./lexique";
import { PIECES, type Piece } from "./pieces";
import type {
  Audit,
  DealInput,
  GesteId,
  Grade,
  Mort,
  PieceVerdict,
  Remontee,
  Trou,
} from "./types";

export type RunOpts = {
  stopAt?: 7 | 8;
};

function gradeOf(deal: DealInput): Grade {
  if (aUnVerbatim(deal)) return "A";
  if (deal.evidence === "chat_paste") return "C";
  if (deal.notes || deal.mails || deal.meetings || deal.nextStep || deal.transcript) return "B";
  return "C";
}

function cadrer(layer: Audit["layer"], familles: Piece["famille"][]) {
  return PIECES.filter((p) => p.layerMin <= layer && familles.includes(p.famille));
}

function passer(piece: Piece, text: string): PieceVerdict {
  const preuve = hit(piece.preuve_valide, text);
  const signal = piece.signal.test(text) || piece.fausse_preuve.test(text);
  const vertSansPreuve = piece.vert.test(text);
  const etat = etatDe({ signal, preuve: Boolean(preuve), vertSansPreuve });
  return {
    id: piece.id,
    etat,
    rattachements: expand(piece.seed),
    preuve,
    raison: vertSansPreuve && !preuve ? "case verte sans source" : undefined,
  };
}

function challenger(v: PieceVerdict, piece: Piece, text: string): PieceVerdict {
  const fausse = piece.fausse_preuve.test(text);
  if (!fausse && v.etat !== "su") return v;

  if (v.etat === "su" && (!v.preuve || !text.includes(v.preuve))) {
    return { ...v, etat: "suppose", raison: "un dire n’est pas une preuve" };
  }

  if (!fausse) return v;

  if (piece.id === "qui-tranche") {
    return { ...v, etat: "vide", raison: "fausse preuve — l’usage n’est pas le budget" };
  }
  if (piece.id === "champion-vs-coach") {
    return { ...v, etat: "suppose", raison: "un coach dit la même phrase" };
  }
  if (piece.id === "process-papier") {
    return { ...v, etat: "suppose", raison: "habitude, pas un process" };
  }
  if (piece.id === "enjeu-chiffre" && !hit(piece.preuve_valide, text)) {
    return { ...v, etat: "suppose", raison: "un chiffre raconté n’est pas un chiffre validé" };
  }
  return v;
}

function fenetreDe(piece: Piece, deal: DealInput): string | null {
  const blob = corpus(deal);
  const faits = extraireFaits(deal);
  for (const p of piece.perches) {
    const f = faits.find((x) => p.signal.test(x.texte) && literalementDans(deal, x.texte));
    if (f) return f.texte;
    if (p.exemple && blob.includes(p.exemple)) return p.exemple;
    const m = blob.match(p.signal);
    if (m?.[0] && blob.includes(m[0])) return m[0];
  }
  return null;
}

function remonter(piece: Piece, deal: DealInput): Remontee {
  const fenetre = fenetreDe(piece, deal);
  const perch = piece.perches.find((p) =>
    fenetre ? p.signal.test(fenetre) || (p.exemple && fenetre.includes(p.exemple)) : false,
  );
  return {
    piece: piece.id,
    fenetre,
    reflexe: fenetre ? (perch?.reflexe ?? null) : null,
    echelle: piece.echelle,
    gain: piece.gain,
    cout_du_retard: fenetre
      ? piece.cout_du_retard
      : "l’info n’était pas atteignable dans ce call — la provoquer, ne pas inventer un remords",
  };
}

export function runMoteur(deal: DealInput, opts: RunOpts = {}): Audit {
  const stopAt = opts.stopAt ?? 8;
  const gesteDef = gesteOf(deal.geste);
  const layer = layerOf(deal);
  const grade = gradeOf(deal);
  const text = corpus(deal);

  const jeu = cadrer(layer, gesteDef.familles);
  const pieces = jeu.map((p) => challenger(passer(p, text), p, text));

  const trous: Trou[] = pieces.flatMap((c) =>
    c.etat === "su"
      ? []
      : c.rattachements.map((r) => ({
          piece: c.id,
          methode: r.methode,
          partie: r.partie,
          preuve: c.preuve,
          etat: c.etat,
        })),
  );

  const morts: Mort[] = pieces
    .filter((c) => c.etat !== "su")
    .map((c) => {
      const p = PIECES.find((x) => x.id === c.id)!;
      return { piece: c.id, ...p.mort };
    })
    .sort((a, b) => a.ordre - b.ordre);

  const cibles = gesteDef.passe_tous_les_trous ? morts : morts.slice(0, 1);
  const remontees = cibles.map((m) => remonter(PIECES.find((p) => p.id === m.piece)!, deal));

  const tete = morts[0];
  const tetePiece = tete ? PIECES.find((p) => p.id === tete.piece) : undefined;

  const geste = tetePiece
    ? { id: gesteDef.id, verbe: tetePiece.verbe, piece: tetePiece.id }
    : {
        id: "none" as const,
        verbe: "Rien à ouvrir — toutes les pièces ont une preuve. Challenger quand même ce qui a l’air vrai.",
        piece: "none",
      };

  const suivants = morts.slice(0, 3).map((m) => PIECES.find((p) => p.id === m.piece)!.echelle[0].question);
  const plan = suivants.length > 0 ? suivants : [];
  const objectif = tetePiece?.objectif ?? "";

  const strippe: string[] = [];
  if (stopAt >= 8) {
    if (grade !== "A") {
      strippe.push("7/10 du call", "réplique");
    }
  }

  return {
    geste_demande: gesteDef.id as GesteId,
    layer,
    grade,
    pieces,
    trous,
    morts,
    remontees: stopAt >= 6 ? remontees : [],
    geste,
    plan: stopAt >= 7 ? plan : [],
    objectif: stopAt >= 7 ? objectif : "",
    strippe,
    refus: text.trim() ? null : REFUS,
    rendu: CONTRAT,
  };
}

export const REFUS =
  "Insuffisant pour se prononcer : aucun artefact (notes, mails, transcript). Il manque le call. Ne pas remplir le vide.";
