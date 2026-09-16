import { contenuValide, pieceOf } from "./pieces";
import { artefacts } from "./corpus";
import type { DealInput, Exhibit, ExhibitAuteur, ExhibitSens, ExhibitSource, PieceId } from "./types";

const QUOTE = /«([^»]+)»|"([^"]+)"|“([^”]+)”/g;
export type Verification = "verifiee" | "source_absente" | "citation_absente" | "reponse_absente" | "test_non_verifie";
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
  date?: string;
  verifie: boolean;
  test_verifie: boolean;
  verification: Verification;
  exhibit?: Exhibit;
  index?: number;
};
const normalize = (s: string) => s.replace(/\s+/g, " ").trim();

function sourceText(deal: DealInput, e: Exhibit): string {
  if (e.source_id) {
    const sources = (deal.sources ?? []).filter(s => s.id === e.source_id && s.type === e.source);
    return sources.length === 1 ? sources[0].texte : "";
  }
  return ({ transcript: deal.transcript, mail: deal.mails, meeting: deal.meetings,
    note: deal.notes, crm: deal.notes }[e.source] ?? "");
}

export function extraireFaits(deal: DealInput): Fait[] {
  if (deal.exhibits?.length) {
    const seen = new Set<string>();
    return deal.exhibits.flatMap((e, index): Fait[] => {
      const texte = normalize(e.citation);
      if (!texte) return [];
      // A sentence can name the buyer AND the budget; don't drop either mapping.
      const key = JSON.stringify(e);
      if (seen.has(key)) return [];
      seen.add(key);
      const raw = normalize(sourceText(deal, e));
      const verifie = Boolean(raw && raw.includes(texte));
      const response = normalize(e.reponse ?? "");
      const question = normalize(e.question ?? "");
      const test_verifie = Boolean(verifie && e.test_pose && question && response &&
        raw.includes(question) && raw.includes(response) && raw.indexOf(question) < raw.lastIndexOf(response));
      const verification: Verification = !raw ? "source_absente" : !verifie ? "citation_absente"
        : response && !raw.includes(response) ? "reponse_absente"
        : e.test_pose && !test_verifie ? "test_non_verifie" : "verifiee";
      return [{ kind: e.auteur === "prospect" && ["transcript", "meeting", "mail"].includes(e.source) ? "fait" : "claim",
        texte, source: e.source, auteur: e.auteur, piece: e.piece, sens: e.sens,
        test_pose: e.test_pose, test_verifie, reponse: e.reponse, titre: e.titre,
        nom: e.nom, date: e.source_id ? deal.sources?.find(s => s.id === e.source_id)?.date : e.date,
        verifie, verification, exhibit: e, index }];
    }).sort((a, b) => {
      const ta = Date.parse(a.date ?? ""), tb = Date.parse(b.date ?? "");
      return (Number.isFinite(ta) ? ta : Infinity) - (Number.isFinite(tb) ? tb : Infinity) || (a.index ?? 0) - (b.index ?? 0);
    });
  }
  const out: Fait[] = [];
  const add = (texte: string, source: ExhibitSource, kind: Fait["kind"], auteur: ExhibitAuteur) => {
    const t = normalize(texte);
    if (!t || out.some(f => f.texte === t && f.source === source)) return;
    out.push({ kind, texte: t, source, auteur, verifie: true, test_verifie: false, verification: "verifiee" });
  };
  const sources = [
    { type: "transcript" as const, texte: deal.transcript }, { type: "mail" as const, texte: deal.mails },
    { type: "meeting" as const, texte: deal.meetings }, { type: "note" as const, texte: deal.notes },
    ...(deal.sources ?? []),
  ];
  for (const s of sources) {
    if (!s.texte) continue;
    for (const m of s.texte.matchAll(new RegExp(QUOTE.source, "g"))) {
      add(m[1] ?? m[2] ?? m[3], s.type, ["note", "crm"].includes(s.type) ? "claim" : "fait", "inconnu");
    }
    for (const sentence of s.texte.replace(new RegExp(QUOTE.source, "g"), " ").split(/[.!?\n]+/)) {
      add(sentence, s.type, "claim", ["note", "crm"].includes(s.type) ? "rep" : "inconnu");
    }
  }
  return out;
}

/** Literal source verification is not independent verification of speaker identity or truth. */
export function aUnVerbatim(deal: DealInput): boolean {
  return extraireFaits(deal).some(f => f.kind === "fait" && f.verifie && ["transcript", "meeting"].includes(f.source));
}
export function literalementDans(deal: DealInput, s: string): boolean {
  return normalize(artefacts(deal)).includes(normalize(s));
}

/** Only an identified speaker's later, dated testimony can replace their own earlier testimony.
 * Other speakers and undated sources remain visible as unresolved disagreement. */
export function faitsCourants(faits: Fait[]): Fait[] {
  return faits.filter(f => {
    if (!f.verifie || !f.nom || !Number.isFinite(Date.parse(f.date ?? ""))) return true;
    return !faits.some(other => other !== f && other.verifie && other.test_verifie &&
      other.auteur === "prospect" && other.nom === f.nom && other.piece === f.piece &&
      Boolean(other.piece && pieceOf(other.piece) && (contenuValide(pieceOf(other.piece)!, other) || pieceOf(other.piece)!.nie.test(other.texte))) &&
      Number.isFinite(Date.parse(other.date ?? "")) && Date.parse(other.date!) > Date.parse(f.date!));
  });
}
