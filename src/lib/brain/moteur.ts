import { CONTRAT } from "./contrat";
import { corpus } from "./corpus";
import { etatDe } from "./etat";
import { aUnVerbatim, extraireFaits, literalementDans, type Fait } from "./faits";
import { gesteOf } from "./gestes";
import { layerOf } from "./layer";
import { expand } from "./lexique";
import {
  PIECES,
  SOURCES_REELLES,
  declarationDe,
  nieDe,
  pieceOf,
  priorTitreDe,
  preuveDe,
  rattacheA,
  type Piece,
} from "./pieces";
import type {
  Audit,
  DealInput,
  Exhibit,
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

export const DEMANDE =
  "Paste the transcript in this chat, or connect a notetaker to your CRM (Fireflies, tl;dv, HubSpot CI). We don't store it.";

function gradeOf(deal: DealInput): Grade {
  const faits = extraireFaits(deal);
  if (
    faits.some(
      (f) => f.auteur === "prospect" && f.verifie && SOURCES_REELLES.has(f.source),
    )
  ) {
    return "A";
  }
  if (deal.evidence === "chat_paste" && aUnVerbatim(deal)) return "A";
  if (!deal.exhibits?.length && deal.transcript && aUnVerbatim(deal)) return "A";
  if (deal.evidence === "chat_paste") return "C";
  if (
    deal.notes ||
    deal.mails ||
    deal.meetings ||
    deal.nextStep ||
    deal.transcript ||
    deal.exhibits?.length
  ) {
    return "B";
  }
  return "C";
}

function cadrer(layer: Audit["layer"], familles: Piece["famille"][]) {
  return PIECES.filter((p) => p.layerMin <= layer && familles.includes(p.famille));
}

function gapDe(piece: Piece, faits: Fait[], preuve: Fait | null) {
  const claim =
    faits.find(
      (f) =>
        rattacheA(piece, f) &&
        (f.auteur === "rep" || f.auteur === "crm" || f.kind === "claim"),
    )?.texte ?? null;
  return { claim, fait: preuve?.texte ?? null };
}

function exhibitDe(piece: Piece, faits: Fait[], preuve: Fait | null): Exhibit | undefined {
  return preuve?.exhibit ?? faits.find((f) => rattacheA(piece, f) && f.exhibit)?.exhibit;
}

function passer(piece: Piece, faits: Fait[], text: string): PieceVerdict {
  const preuve = preuveDe(piece, faits);
  const nie = nieDe(piece, faits, text);
  const declaration = declarationDe(piece, faits, text);
  const vertSansPreuve = piece.vert.test(text);
  const etat = etatDe({
    fait: Boolean(preuve),
    declaration,
    nie,
    vertSansPreuve,
  });
  const nieTexte =
    faits.find((f) => rattacheA(piece, f) && f.sens === "nie")?.texte ??
    text.match(piece.nie)?.[0] ??
    null;
  return {
    id: piece.id,
    etat,
    rattachements: expand(piece.seed),
    preuve: preuve?.texte ?? (etat === "contredit" ? nieTexte : null),
    raison: nie
      ? "exhibit qui nie"
      : vertSansPreuve && !preuve
        ? "case verte sans source"
        : undefined,
    gap: gapDe(piece, faits, preuve),
    exhibit: exhibitDe(piece, faits, preuve),
  };
}

function challenger(v: PieceVerdict, piece: Piece, text: string, faits: Fait[]): PieceVerdict {
  const preuveFausse = Boolean(v.preuve && piece.fausse_preuve.test(v.preuve));
  const fausse =
    preuveFausse ||
    piece.fausse_preuve.test(text) ||
    faits.some((f) => rattacheA(piece, f) && piece.fausse_preuve.test(f.texte));

  if (v.etat === "su" && (!v.preuve || !(text.includes(v.preuve) || faits.some((f) => f.texte === v.preuve && f.verifie)))) {
    return { ...v, etat: "suppose", raison: "un dire n’est pas une preuve" };
  }

  if (v.etat === "su" && preuveFausse) {
    if (piece.id === "qui-tranche") {
      return { ...v, etat: "vide", raison: "fausse preuve — l’usage n’est pas le budget", preuve: null };
    }
  }

  if (v.etat === "su") return v;

  if (fausse) {
    if (piece.id === "qui-tranche") {
      return { ...v, etat: "vide", raison: "fausse preuve — l’usage n’est pas le budget" };
    }
    if (piece.id === "champion-vs-coach") {
      return { ...v, etat: "suppose", raison: "un coach dit la même phrase" };
    }
    if (piece.id === "process-papier") {
      return { ...v, etat: "suppose", raison: "habitude, pas un process" };
    }
    if (piece.id === "enjeu-chiffre") {
      return { ...v, etat: "suppose", raison: "un chiffre raconté n’est pas un chiffre validé" };
    }
  }

  const titre = priorTitreDe(piece, faits, text);
  if (titre && v.etat !== "contredit") {
    return {
      ...v,
      etat: "suppose",
      raison: `${titre} en face, jamais confirmé : pose la question`,
    };
  }
  return v;
}

function fenetreDe(piece: Piece, deal: DealInput, faits: Fait[]): string | null {
  const attache = faits.find((x) => rattacheA(piece, x) && x.auteur === "prospect" && x.verifie);
  if (attache) return attache.texte;
  const blob = corpus(deal);
  for (const p of piece.perches) {
    const f = faits.find((x) => p.signal.test(x.texte) && literalementDans(deal, x.texte));
    if (f) return f.texte;
    if (p.exemple && blob.includes(p.exemple)) return p.exemple;
    const m = blob.match(p.signal);
    if (m?.[0] && blob.includes(m[0])) return m[0];
  }
  return null;
}

function remonter(piece: Piece, deal: DealInput, faits: Fait[]): Remontee {
  const fenetre = fenetreDe(piece, deal, faits);
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
  const faits = extraireFaits(deal);

  const jeu = cadrer(layer, gesteDef.familles);
  const pieces = jeu.map((p) => challenger(passer(p, faits, text), p, text, faits));

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
      const p = pieceOf(c.id)!;
      return { piece: c.id, ...p.mort };
    })
    .sort((a, b) => a.ordre - b.ordre);

  const cibles = gesteDef.passe_tous_les_trous ? morts : morts.slice(0, 1);
  const remontees = cibles.map((m) => remonter(pieceOf(m.piece)!, deal, faits));

  const tete = morts[0];
  const tetePiece = tete ? pieceOf(tete.piece) : undefined;

  const geste = tetePiece
    ? { id: gesteDef.id, verbe: tetePiece.verbe, piece: tetePiece.id }
    : {
        id: "none" as const,
        verbe: "Rien à ouvrir — toutes les pièces ont une preuve. Challenger quand même ce qui a l’air vrai.",
        piece: "none",
      };

  const suivants = morts.slice(0, 3).map((m) => pieceOf(m.piece)!.echelle[0].question);
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
    demande: grade === "A" ? null : DEMANDE,
    rendu: CONTRAT,
  };
}

export const REFUS =
  "Insuffisant pour se prononcer : aucun artefact (notes, mails, transcript). Il manque le call. Ne pas remplir le vide.";
