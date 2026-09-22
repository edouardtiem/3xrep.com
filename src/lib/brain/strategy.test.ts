import assert from "node:assert/strict";
import { test } from "node:test";
import { runMoteur } from "./moteur";
import { nextQuestion } from "./next-question";
import { objectionMap } from "./objection-map";
import { planHorizon } from "./horizon";
import { pipeReview } from "./pipe";
import { EVIDENCE, strategyDeal } from "./fixtures/strategy-deals";
import type { PieceId } from "./types";
import { MCP_INSTRUCTIONS, AGENT_SPEC } from "../copy";

const strategy = (d: Parameters<typeof runMoteur>[0]) => { const s = runMoteur(d).strategy; assert.ok(s); return s; };

test("known pain opens an access route using the exact quote, not a made-up signer", () => {
  const s = strategy(strategyDeal(["besoin"]));
  assert.equal(s.primitive, "pain-to-access");
  assert.equal(s.gap.piece, "qui-tranche");
  assert.ok(s.wording?.suggested.includes(EVIDENCE.besoin));
  assert.equal(s.contact?.known_name, "Julien");
  assert.doesNotMatch(JSON.stringify(s), /Maya|Marie/);
  assert.ok(s.branches.some(b => /occupée/.test(b.if)));
  assert.ok(s.branches.some(b => /décider seul/.test(b.if)));
});

test("missing evidence gives a general path and explicit missing context", () => {
  const s = strategy({ notes: "We plan to send a proposal.", etape: "proposal" });
  assert.equal(s.leverage.length, 0);
  assert.ok(s.missing_context.length);
  assert.equal(s.wording?.evidence_anchor, undefined);
  assert.equal(s.contact, undefined);
});

test("budget uses confirmed impact; absent impact is obtained first", () => {
  const s = strategy(strategyDeal(["enjeu-chiffre"], { objection: "No budget" }));
  assert.equal(s.primitive, "impact-to-budget");
  assert.ok(s.wording?.suggested.includes(EVIDENCE["enjeu-chiffre"]));
  assert.match(s.questions[0].question, /enveloppe existante/);
  assert.equal(s.branches.length, 3);
  const empty = strategy(strategyDeal(["besoin"], { objection: "No budget" }));
  assert.match(empty.next_move.action, /d’abord mesurer/);
  assert.match(empty.questions[0].question, /fréquence/);
  assert.ok(empty.missing_context.some(m => /impact chiffré/.test(m)));
});

test("tested champion and friendly coach take different access paths", () => {
  const champion = strategy(strategyDeal(["besoin", "champion-vs-coach"]));
  const coach = strategy(strategyDeal(["besoin"], { notes: "Julien is a friendly coach" }));
  assert.equal(champion.primitive, "champion-to-access");
  assert.notEqual(champion.approach, coach.approach);
  assert.ok(coach.missing_context.some(m => /soutien interne/.test(m)));
});

test("weak authority, CFO title and proposal forwarding never count as access", () => {
  for (const text of ["I am the decision maker.", "I am the CFO.", "I'll pass the proposal internally.", "Je transmettrai la proposition en interne."]) {
    const s = strategy({ etape: "proposal", transcript: text, exhibits: [{ source: "transcript", auteur: "prospect", titre: "CFO", citation: text, piece: "qui-tranche" }] });
    assert.notEqual(s.gap.state, "su");
    assert.ok(s.branches.some(b => /Ne pas envoyer la proposition/.test(b.then)));
    assert.match(s.do_not.join(" "), /autorité|signataire/);
  }
});

test("known budget owner without access becomes a meeting request, not invented authority", () => {
  const s = strategy(strategyDeal(["budget"]));
  assert.match(s.next_move.action, /rendez-vous avec son responsable/);
  assert.equal(s.leverage[0].quote, EVIDENCE.budget);
  assert.notEqual(s.gap.state, "su");
});

test("price objection returns to impact, never proposes a discount", () => {
  for (const objection of ["It is too expensive", "C’est trop cher"]) {
    const out = objectionMap({ ...strategyDeal(["enjeu-chiffre"]), objection });
    assert.equal(out.strategy?.gap.piece, "enjeu-chiffre");
    assert.match(out.strategy!.approach, /coût confirmé/);
    assert.ok(out.strategy!.branches.some(b => /remise/.test(b.if) && /sans promettre/.test(b.then)));
  }
});

test("named supplier and status quo stay grounded in their exact alternatives", () => {
  for (const quote of ["Our alternative is Vendor Z rather than a manual process.", EVIDENCE.concurrents]) {
    const d = strategyDeal(["concurrents"], { objection: "We have an alternative" });
    d.sources![0].texte = d.sources![0].texte.replace(EVIDENCE.concurrents, quote);
    d.exhibits![0].citation = quote; d.exhibits![0].reponse = quote;
    const s = strategy(d);
    assert.ok(s.wording!.suggested.includes(quote));
    assert.equal(s.branches.length, 3);
  }
});

test("pre-call, audit and horizon expose the same strategy with reasons and branches", () => {
  const deal = strategyDeal(["besoin"]);
  const out = nextQuestion(deal);
  assert.deepEqual(out.strategy, runMoteur(deal).strategy);
  assert.ok(out.strategy!.questions.every(q => q.why));
  assert.ok(out.strategy!.do_not.length);
  const h = planHorizon({ fenetre: 1, maintenant: "2026-09-22T08:00:00+02:00", items: [{ kind: "rdv", quand: "2026-09-22T14:00:00+02:00", deal }] });
  assert.deepEqual(h.agenda[0].strategy, out.strategy);
});

test("rejected sources, invented responses and representative notes never become leverage", () => {
  for (const mode of ["missing-source", "wrong-response", "rep", "undated-conflict", "newer-denial"] as const) {
    const d = strategyDeal(["besoin"]);
    if (mode === "missing-source") d.sources = [];
    if (mode === "wrong-response") d.exhibits![0].reponse = "A reply that never occurred.";
    if (mode === "rep") d.exhibits![0].auteur = "rep";
    if (mode === "undated-conflict" || mode === "newer-denial") {
      d.sources![0].date = "2026-09-01";
      const citation = "There is no problem.";
      d.sources!.push({ id: "denial", type: "transcript", texte: `Do you still have a problem? ${citation}`, date: mode === "newer-denial" ? "2026-09-22" : undefined });
      d.exhibits!.push({ source: "transcript", source_id: "denial", auteur: "prospect", nom: "Julien", citation, piece: "besoin", sens: "nie", question: "Do you still have a problem?", reponse: citation, test_pose: true });
    }
    assert.equal(strategy(d).leverage.length, 0, mode);
  }
});

test("untrusted metadata cannot introduce a stakeholder name", () => {
  const d = strategyDeal(["besoin"]); d.exhibits![0].nom = "Invented Person";
  const s = strategy(d);
  assert.equal(s.contact, undefined);
  assert.doesNotMatch(JSON.stringify(s), /Invented Person/);
  for (const instructions of [MCP_INSTRUCTIONS, AGENT_SPEC]) assert.match(instructions, /never infer the signer/);
});

test("French evidence stays exact, including its whitespace and accents", () => {
  const d = strategyDeal(["besoin"]);
  const citation = "Ce problème nous fait perdre  six heures par semaine.";
  d.sources![0].texte = `Julien : Pouvez-vous confirmer ? ${citation}`;
  Object.assign(d.exhibits![0], { citation, question: "Pouvez-vous confirmer ?", reponse: citation });
  assert.equal(strategy(d).leverage[0].quote, citation);
});

test("morning brief ranks actionable late-stage gap ahead of earliest meeting", () => {
  const h = planHorizon({ fenetre: 1, maintenant: "2026-09-22T08:00:00+02:00", items: [
    { kind: "rdv", quand: "2026-09-22T09:00:00+02:00", deal: { nom: "Early", notes: "Discovery planned", etape: "discovery" } },
    { kind: "tache", quand: "2026-09-22T15:00:00+02:00", deal: strategyDeal(["besoin"], { nextStep: "Send proposal" }) },
  ] });
  assert.equal(h.agenda[0].nom, "Early");
  assert.equal(h.brief!.priorities[0].deal, "Acme");
  assert.ok(h.brief!.priorities[0].why_today.length);
});

test("7/30 day preparation anticipates paper delays; invalid dates and closed deals stay out", () => {
  for (const fenetre of [7, 30] as const) {
    const h = planHorizon({ fenetre, maintenant: "2026-09-22T08:00:00+02:00", items: [
      { kind: "affaire", deal: { ...strategyDeal(["besoin"], { etape: "legal" }), closeDate: "2026-09-27" } },
      { kind: "affaire", deal: strategyDeal(["besoin"], { nom: "Closed", crm_id: "closed", denouement: "gagne" }) },
      { kind: "rdv", quand: "invalid", deal: strategyDeal(["besoin"]) },
    ] });
    assert.equal(h.brief!.priorities.length, 1);
    assert.match(h.brief!.priorities[0].why_today.join(" "), /juridique/);
    assert.equal(h.hors_fenetre.length, 1);
  }
});

test("all selected gaps have questions, branches and observable success; manager gets coaching", () => {
  const ids = Object.keys(EVIDENCE) as PieceId[];
  for (const missing of ids) {
    const d = strategyDeal(ids.filter(id => id !== missing), { etape: "legal", contexte: { cycle: "long", comite: true, concurrence: true } });
    const s = strategy(d);
    assert.equal(s.gap.piece, missing);
    assert.ok(s.questions.length && s.branches.length && s.success_condition);
  }
  const p = pipeReview([strategyDeal(["besoin"]), strategyDeal(["besoin"], { nom: "Bolt", crm_id: "bolt" })]);
  assert.equal(p.coaching.length, 2);
  assert.ok(p.trous_systemiques.length);
  assert.equal(p.deals[0].strategy?.primitive, "pain-to-access");
});
