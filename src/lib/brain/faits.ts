import { brut, corpus } from "./corpus";
import type { DealInput, Exhibit, ExhibitAuteur, ExhibitSens, ExhibitSource, PieceId } from "./types";

const QUOTE = /«([^»]{8,})»|"([^"]{8,})"|“([^”]{8,})”/g;

const SOURCE_FAIT: Record<ExhibitSource, Fait["source"]> = {
  transcript: "transcript",
  meeting: "meeting",
  mail: "mail",
  note: "note",
  crm: "crm",
};

export type Fait = {
  kind: "fait" | "claim";
  texte: string;
  source: ExhibitSource | "objection";
  auteur: ExhibitAuteur;
  piece?: PieceId;
  sens?: ExhibitSens;
  test_pose?: boolean;
  reponse?: string;
  titre?: string;
  nom?: string;
  verifie: boolean;
  exhibit?: Exhibit;
};

export function extraireFaits(deal: DealInput): Fait[] {
  if (deal.exhibits?.length) return faitsDepuisExhibits(deal);

  const out: Fait[] = [];
  const seen = new Set<string>();
  const push = (
    kind: Fait["kind"],
    texte: string,
    source: Fait["source"],
    auteur: ExhibitAuteur = "inconnu",
  ) => {
    const t = texte.replace(/\s+/g, " ").trim();
    if (t.length < 8 || seen.has(t)) return;
    seen.add(t);
    out.push({ kind, texte: t, source, auteur, verifie: true });
  };

  const scanQuotes = (raw: string | undefined, source: ExhibitSource) => {
    if (!raw) return;
    for (const m of raw.matchAll(new RegExp(QUOTE.source, "g"))) {
      const texte = m[1] ?? m[2] ?? m[3] ?? m[0];
      // Quotes in a note stay a lower-grade fait (B), never A.
      const kind: Fait["kind"] = source === "note" || source === "crm" ? "claim" : "fait";
      const auteur: ExhibitAuteur = source === "note" || source === "crm" ? "rep" : "inconnu";
      push(kind, texte, source, auteur);
    }
  };

  scanQuotes(deal.transcript, "transcript");
  scanQuotes(deal.mails, "mail");
  scanQuotes(deal.meetings, "meeting");
  scanQuotes(deal.notes, "note");
  if (deal.objection) push("claim", deal.objection, "objection", "inconnu");

  const crm =
    /(?:economic buyer|décideur|authority|champion|metrics|métrique|enjeu|budget|pain|besoin|process|timeline|échéance|closing)\s*[:：=]\s*[^\n]{1,40}/gi;
  for (const field of [deal.notes, deal.nextStep]) {
    if (!field) continue;
    for (const m of field.matchAll(crm)) push("claim", m[0], "crm", "crm");
  }

  if (deal.transcript) {
    const stripped = deal.transcript.replace(new RegExp(QUOTE.source, "g"), " ");
    for (const s of stripped.split(/[.!?\n]+/)) push("claim", s, "transcript", "inconnu");
  }

  return out;
}

function faitsDepuisExhibits(deal: DealInput): Fait[] {
  const raw = brut(deal).trim();
  const out: Fait[] = [];
  const seen = new Set<string>();
  for (const e of deal.exhibits ?? []) {
    const t = e.citation.replace(/\s+/g, " ").trim();
    if (t.length < 8 || seen.has(t)) continue;
    seen.add(t);
    const verifie = !raw || raw.includes(e.citation) || raw.includes(t);
    const source = SOURCE_FAIT[e.source];
    const kind: Fait["kind"] =
      e.auteur === "prospect" && (source === "transcript" || source === "meeting" || source === "mail")
        ? "fait"
        : "claim";
    out.push({
      kind,
      texte: t,
      source,
      auteur: e.auteur,
      piece: e.piece,
      sens: e.sens,
      test_pose: e.test_pose,
      reponse: e.reponse,
      titre: e.titre,
      nom: e.nom,
      verifie,
      exhibit: e,
    });
  }
  return out;
}

export function aUnVerbatim(deal: DealInput): boolean {
  return extraireFaits(deal).some(
    (f) =>
      f.kind === "fait" &&
      f.verifie &&
      (f.source === "transcript" || f.source === "meeting" || f.source === "mail"),
  );
}

export function literalementDans(deal: DealInput, s: string): boolean {
  return corpus(deal).includes(s);
}
