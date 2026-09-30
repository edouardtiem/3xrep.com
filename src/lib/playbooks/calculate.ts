import { createHash } from "node:crypto";
import { runMoteur } from "../brain/moteur";
import type { Etat } from "../brain/etat";
import type { Playbook } from "./scenarios";
import type { CalculatedState } from "./types";
import translations from "./en.json";
import revision from "./revision.json";

const en: Record<string, string> = translations;
function translate(value: string): string {
  const translated = en[value];
  if (!translated) throw new Error(`Unreviewed library translation: ${value}`);
  return translated;
}
const names: Record<string, string> = {
  besoin: "Buyer problem", "enjeu-chiffre": "Measured impact", "qui-tranche": "Buying authority",
  "champion-vs-coach": "Internal support", budget: "Funding", echeance: "Buyer deadline",
  "criteres-achat": "Decision criteria", "process-decision": "Decision process",
  "process-papier": "Contract process", concurrents: "Alternatives",
};
const states: Record<Etat, string> = { su: "Supported", suppose: "Assumed", vide: "Unknown", contredit: "Contradicted" };
const methodNames: Record<string, string> = { "Coût de l’inaction": "Cost of inaction" };
const methodParts: Record<string, string> = { "Décideurs": "Decision-makers", "Échéance": "Deadline", "Enjeu": "Stakes", "Chiffre": "Number", "Besoin": "Need" };
const hash = (value: unknown) => createHash("sha256").update(JSON.stringify(value)).digest("hex");

/** Presentation only: all commercial decisions come from runMoteur. Unknown translations fail closed. */
export function calculatePlaybook(page: Playbook): CalculatedState[] {
  return page.states.map(state => {
    const audit = runMoteur(state.deal);
    if (audit.refus || !audit.strategy) throw new Error(`Invalid public scenario: ${page.slug}/${state.id}`);
    const strategy = audit.strategy;
    const suggested = strategy.wording?.suggested ?? "";
    const anchor = strategy.wording?.evidence_anchor;
    const prefix = anchor ? `Vous avez dit : « ${anchor} ». ` : "";
    if (prefix && !suggested.startsWith(prefix)) throw new Error("Unexpected evidence wording format");
    const question = translate(prefix ? suggested.slice(prefix.length) : suggested);
    return {
      id: state.id, label: state.label, change: state.change, dealName: state.deal.nom ?? "Example deal", stage: state.deal.etape ?? "Not declared",
      pieces: audit.pieces.map(piece => ({ id: piece.id, label: names[piece.id], state: states[piece.etat],
        quote: piece.preuve,
        claim: !piece.preuve && piece.exhibit && audit.verification.some(v => v.index === state.deal.exhibits?.indexOf(piece.exhibit!) && v.statut === "verifiee") ? piece.exhibit.citation : null,
        reason: piece.raison ? translate(piece.raison) : null, methods: piece.rattachements.map(m => ({ methode: methodNames[m.methode] ?? m.methode, partie: methodParts[m.partie] ?? m.partie })) })),
      gap: names[strategy.gap.piece], gapHeld: strategy.gap.state === "su", why: translate(strategy.gap.why_it_matters),
      action: translate(strategy.next_move.action), timing: translate(strategy.next_move.timing),
      wording: anchor ? `You said: “${anchor}” ${question}` : question,
      success: translate(strategy.success_condition),
      leverage: strategy.leverage.map(e => ({ quote: e.quote, piece: names[e.piece] })),
      branches: strategy.branches.map(b => ({ condition: translate(b.if), action: translate(b.then), why: translate(b.why) })),
      methods: [audit.methode.grille, audit.methode.intervention],
      missing: strategy.missing_context.map(translate), doNot: strategy.do_not.map(translate),
      sourcePassages: (state.deal.sources ?? []).map(source => ({ id: source.id, text: source.texte })),
      provenance: { engine: revision.engine, scenario: hash(state.deal), output: hash(audit), presentation: hash(translations), rule: strategy.primitive },
    };
  });
}
