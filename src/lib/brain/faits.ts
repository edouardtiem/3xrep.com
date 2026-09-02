import { corpus } from "./corpus";
import type { DealInput } from "./types";

const QUOTE = /«([^»]{8,})»|"([^"]{8,})"|“([^”]{8,})”/g;

export type Fait = {
  kind: "fait" | "claim";
  texte: string;
  source: "transcript" | "notes" | "mails" | "meetings" | "crm" | "objection";
};

export function extraireFaits(deal: DealInput): Fait[] {
  const out: Fait[] = [];
  const seen = new Set<string>();
  const push = (kind: Fait["kind"], texte: string, source: Fait["source"]) => {
    const t = texte.replace(/\s+/g, " ").trim();
    if (t.length < 8 || seen.has(t)) return;
    seen.add(t);
    out.push({ kind, texte: t, source });
  };

  const scanQuotes = (raw: string | undefined, source: Fait["source"]) => {
    if (!raw) return;
    for (const m of raw.matchAll(new RegExp(QUOTE.source, "g"))) {
      push("fait", m[1] ?? m[2] ?? m[3] ?? m[0], source);
    }
  };

  scanQuotes(deal.transcript, "transcript");
  scanQuotes(deal.mails, "mails");
  scanQuotes(deal.meetings, "meetings");
  scanQuotes(deal.notes, "notes");
  if (deal.objection) push("claim", deal.objection, "objection");

  const crm =
    /(?:economic buyer|décideur|authority|champion|metrics|métrique|enjeu|budget|pain|besoin|process|timeline|échéance|closing)\s*[:：=]\s*[^\n]{1,40}/gi;
  for (const field of [deal.notes, deal.nextStep]) {
    if (!field) continue;
    for (const m of field.matchAll(crm)) push("claim", m[0], "crm");
  }

  if (deal.transcript) {
    const stripped = deal.transcript.replace(new RegExp(QUOTE.source, "g"), " ");
    for (const s of stripped.split(/[.!?\n]+/)) push("claim", s, "transcript");
  }

  return out;
}

export function aUnVerbatim(deal: DealInput): boolean {
  return extraireFaits(deal).some((f) => f.kind === "fait");
}

export function literalementDans(deal: DealInput, s: string): boolean {
  return corpus(deal).includes(s);
}
