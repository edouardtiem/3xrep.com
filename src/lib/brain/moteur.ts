import { CONTRAT } from "./contrat";
import { artefacts } from "./corpus";
import { selectMethod } from "./method-selection";
import { prioriser } from "./priorite";
import { etatDe } from "./etat";
import { aUnVerbatim, extraireFaits, faitsCourants, literalementDans, type Fait } from "./faits";
import { gesteOf } from "./gestes";
import { layerOf } from "./layer";
import { expand } from "./lexique";
import {
  PIECES,
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
import { correctionsFromAudit } from "@/lib/corrections";
import { actionPourDeal, planChezEux } from "./action";

export type RunOpts = {
  stopAt?: 7 | 8;
};

export const DEMANDE =
  "Paste the transcript in this chat, or connect a notetaker to your CRM (Fireflies, tl;dv, HubSpot CI).";

function gradeOf(deal: DealInput): Grade {
  if (aUnVerbatim(deal)) return "A";
  return artefacts(deal).trim() ? "B" : "C";
}

function gapDe(piece: Piece, faits: Fait[], preuve: Fait | null) {
  const claim =
    faits.find(
      (f) =>
        f.verifie && rattacheA(piece, f) &&
        (f.auteur === "rep" || f.auteur === "crm" || f.kind === "claim"),
    )?.texte ?? null;
  return { claim, fait: preuve?.texte ?? null };
}

function exhibitDe(piece: Piece, faits: Fait[], preuve: Fait | null): Exhibit | undefined {
  return preuve?.exhibit ?? faits.find((f) => f.verifie && rattacheA(piece, f) && f.exhibit)?.exhibit;
}

function passer(piece: Piece, faits: Fait[], text: string): PieceVerdict {
  const preuve = preuveDe(piece, faits);
  const nie = nieDe(piece, faits);
  const declaration = declarationDe(piece, faits, text);
  const vertSansPreuve = piece.vert.test(text);
  const etat = etatDe({
    fait: Boolean(preuve),
    declaration,
    nie,
    vertSansPreuve,
  });
  const nieTexte =
    faits.find((f) => f.verifie && rattacheA(piece, f) && piece.nie.test(f.texte))?.texte ??
    null;
  return {
    id: piece.id,
    etat,
    rattachements: expand(piece.seed),
    preuve: etat === "contredit" ? nieTexte : preuve?.texte ?? null,
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
  if (v.etat === "contredit") return v;
  const preuveFausse = Boolean(v.preuve && piece.fausse_preuve.test(v.preuve));
  const fausse =
    preuveFausse ||
    piece.fausse_preuve.test(text) ||
    faits.some((f) => f.verifie && rattacheA(piece, f) && piece.fausse_preuve.test(f.texte));

  if (v.etat === "su" && (!v.preuve || !(text.includes(v.preuve) || faits.some((f) => f.texte === v.preuve && f.verifie)))) {
    return { ...v, etat: "suppose", raison: "un dire n’est pas une preuve" };
  }

  if (v.etat === "su" && preuveFausse) {
    if (piece.id === "qui-tranche") {
      return { ...v, etat: "vide", raison: "fausse preuve - l’usage n’est pas le budget", preuve: null };
    }
  }

  if (v.etat === "su") return v;

  if (fausse) {
    if (piece.id === "qui-tranche") {
      return { ...v, etat: "vide", raison: "fausse preuve - l’usage n’est pas le budget" };
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
  if (titre) {
    return {
      ...v,
      etat: "suppose",
      raison: `${titre} en face, jamais confirmé : pose la question`,
    };
  }
  return v;
}

function fenetreDe(piece: Piece, deal: DealInput, faits: Fait[]): string | null {
  if (!aUnVerbatim(deal)) return null;
  const allowed = faits.filter(f => f.verifie && f.kind === "fait" && ["transcript", "meeting"].includes(f.source));
  const attache = allowed.find(f => rattacheA(piece, f));
  if (attache) return attache.texte;
  for (const p of piece.perches) {
    const f = allowed.find(x => p.signal.test(x.texte) && literalementDans(deal, x.texte));
    if (f) return f.texte;
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
      : "l’info n’était pas atteignable dans ce call - la provoquer, ne pas inventer un remords",
  };
}

export function runMoteur(deal: DealInput, opts: RunOpts = {}): Audit {
  const stopAt = opts.stopAt ?? 8;
  const gesteDef = gesteOf(deal.geste);
  const layer = layerOf(deal);
  const grade = gradeOf(deal);
  const text = artefacts(deal);
  const allFacts = extraireFaits(deal);
  const faits = faitsCourants(allFacts);
  const methode = selectMethod(deal);
  const jeu = PIECES.filter(p => methode.pieces.includes(p.id));
  const evaluated = jeu.map(p => {
    const verdict = challenger(passer(p, faits, text), p, text, faits);
    const spiced: Partial<Record<string, string>> = { besoin: "Pain", "enjeu-chiffre": "Impact", echeance: "Critical event", "qui-tranche": "Decision", "criteres-achat": "Decision", "process-decision": "Decision" };
    if (methode.grille === "SPICED" && spiced[p.id]) verdict.rattachements = [{ methode: "SPICED", partie: spiced[p.id]! }, ...verdict.rattachements];
    else verdict.rattachements = [...verdict.rattachements].sort((a, b) => Number(b.methode === methode.grille) - Number(a.methode === methode.grille));
    return verdict;
  });
  const priority = prioriser(deal, evaluated);
  const pieces = [...priority.pieces, ...evaluated.filter(p => p.etat === "su")];

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
    });

  const cibles = gesteDef.passe_tous_les_trous ? morts : morts.slice(0, 1);
  const remontees = cibles.map((m) => remonter(pieceOf(m.piece)!, deal, faits));

  const tete = morts[0];
  const tetePiece = tete ? pieceOf(tete.piece) : undefined;

  const geste = tetePiece
    ? { id: gesteDef.id, verbe: tetePiece.verbe, piece: tetePiece.id }
    : {
        id: "none" as const,
        verbe: "Rien à ouvrir - toutes les pièces ont une preuve. Challenger quand même ce qui a l’air vrai.",
        piece: "none",
      };

  const suivants = morts.slice(0, 3).map((m) => pieceOf(m.piece)!.echelle[0].question);
  const refus = text.trim() ? null : REFUS;
  const action = actionPourDeal({
    deal,
    pieces,
    etape: deal.etape,
    refus,
  });
  const plan = stopAt >= 7 ? planChezEux(suivants, action) : [];
  const objectif = stopAt >= 7 ? action.quoi : "";

  const strippe: string[] = ["7/10 du call - barème non défini"];
  if (stopAt >= 8) {
    if (grade !== "A") strippe.push("7/10 du call", "réplique");
  }

  const audit: Audit = {
    geste_demande: gesteDef.id as GesteId,
    layer,
    methode,
    priorite: { piece: tete?.piece ?? null, raison: priority.raison },
    verification: allFacts.filter(f => f.index != null).map(f => ({ index: f.index!, statut: f.verification,
      raison: f.verification === "verifiee" ? "Citation retrouvée dans la source fournie ; auteur et vérité restent déclarés." : "Pas de preuve tenue : fournir le passage source et la question/réponse exactes." })),
    grade,
    pieces,
    trous,
    morts,
    remontees: stopAt >= 6 ? remontees : [],
    geste,
    plan,
    objectif,
    strippe,
    refus,
    demande: grade === "A" ? null : DEMANDE,
    rendu: { ...CONTRAT, blocs: refus ? [{ id: "refus", job: REFUS }]
      : CONTRAT.blocs.filter(b => grade === "A" || !["call", "rate"].includes(b.id)) },
    action,
  };
  if (stopAt >= 8) audit.corrections_crm = correctionsFromAudit(deal, audit);
  return audit;
}

export const REFUS =
  "Insuffisant pour se prononcer : aucun artefact (notes, mails, transcript). Il manque le call. Ne pas remplir le vide.";
