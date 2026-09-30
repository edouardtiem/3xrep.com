import test from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { PLAYBOOKS } from "./scenarios";
import { calculatePlaybook } from "./calculate";
import { runMoteur } from "../brain/moteur";
import { libraryLandingCampaign } from "./acquisition";
import revision from "./revision.json";

test("public scenarios use real evidence checks and preserve every source quote", () => {
  for (const page of PLAYBOOKS) {
    const views = calculatePlaybook(page);
    page.states.forEach((state, index) => {
      const audit = runMoteur(state.deal);
      assert.equal(audit.refus, null);
      assert.ok(audit.strategy);
      assert.equal(views[index].provenance.rule, audit.strategy.primitive);
      assert.deepEqual(views[index].leverage.map(e => e.quote), audit.strategy.leverage.map(e => e.quote));
      for (const piece of audit.pieces.filter(p => p.etat === "su")) {
        assert.ok(state.deal.sources?.some(s => s.texte.includes(piece.preuve!)));
      }
      const stripped = { ...state.deal, sources: [] };
      const rejected = runMoteur(stripped);
      assert.equal(rejected.strategy?.leverage.length, 0);
      assert.ok(rejected.pieces.every(p => p.etat !== "su"));
    });
  }
});

test("new authority evidence moves the priority to buying criteria", () => {
  const page = PLAYBOOKS[0];
  const audits = page.states.map(state => runMoteur(state.deal));
  assert.equal(audits[0].strategy?.primitive, "impact-to-access");
  assert.equal(audits[1].strategy?.primitive, "champion-to-access");
  assert.equal(audits[2].strategy?.gap.piece, "criteres-achat");
  assert.equal(audits[2].pieces.find(p => p.id === "qui-tranche")?.etat, "su");
});

test("enthusiasm is not supported advocacy, and advocacy does not establish authority", () => {
  const [friendly, supporter] = PLAYBOOKS[1].states.map(state => runMoteur(state.deal));
  assert.equal(calculatePlaybook(PLAYBOOKS[1])[0].pieces.find(p => p.id === "champion-vs-coach")?.claim, "I like the demo. Send me the proposal and I will see what people think.");
  assert.notEqual(friendly.pieces.find(p => p.id === "champion-vs-coach")?.etat, "su");
  assert.equal(supporter.pieces.find(p => p.id === "champion-vs-coach")?.etat, "su");
  assert.notEqual(supporter.pieces.find(p => p.id === "qui-tranche")?.etat, "su");
});

test("measured impact changes price strategy without inventing funding or savings", () => {
  const [unknown, measured, funding] = calculatePlaybook(PLAYBOOKS[2]);
  assert.notEqual(unknown.action, measured.action);
  assert.equal(measured.gapHeld, true);
  assert.equal(funding.gap, "Funding");
  assert.equal(funding.pieces.find(p => p.id === "budget")?.state, "Unknown");
  assert.equal(measured.leverage.find(p => p.piece === "Measured impact")?.quote,
    "We lose 6 hours per week chasing approvals; the time records confirm those 6 hours.");
});

test("revision records the exact commercial source files and calculated results", () => {
  const hash = createHash("sha256");
  for (const file of revision.files) hash.update(file + "\0" + readFileSync(file, "utf8") + "\0");
  assert.equal(revision.engine, hash.digest("hex"));
  for (const page of PLAYBOOKS) for (const state of calculatePlaybook(page)) {
    assert.match(state.provenance.scenario, /^[a-f0-9]{64}$/);
    assert.match(state.provenance.output, /^[a-f0-9]{64}$/);
  }
});

test("scenarios without source evidence fail closed", () => {
  const altered = structuredClone(PLAYBOOKS[0]);
  altered.states[0].deal.sources = [];
  assert.throws(() => calculatePlaybook(altered), /Invalid public scenario/);
});

test("landing attribution has bounded, content-free page identifiers", () => {
  assert.equal(libraryLandingCampaign("/playbooks"), "library.index");
  assert.equal(libraryLandingCampaign("/playbooks/test-sales-champion"), "library.test-sales-champion");
  assert.equal(libraryLandingCampaign("/start"), null);
  assert.equal(libraryLandingCampaign("/playbooks/private/name"), null);
  assert.equal(libraryLandingCampaign("/playbooks/<secret>"), null);
});

 test("a positive cybersecurity pilot does not establish buying criteria or clear supplier review", () => {
  const page = PLAYBOOKS.find(page => page.slug === "cybersecurity-pilot-decision")!;
  const [baseline, pilot, criteria] = calculatePlaybook(page);
  assert.equal(baseline.gap, "Decision criteria");
  assert.equal(pilot.gap, "Decision criteria");
  assert.notEqual(pilot.pieces.find(piece => piece.id === "criteres-achat")?.state, "Supported");
  assert.equal(baseline.action, pilot.action);
  assert.equal(criteria.pieces.find(piece => piece.id === "criteres-achat")?.state, "Supported");
  assert.notEqual(criteria.gap, "Decision criteria");
  assert.equal(criteria.pieces.find(piece => piece.id === "process-papier")?.state, "Unknown");
  assert.equal(criteria.dealName, "Northstar");
  assert.notEqual(criteria.action, pilot.action);
});


test("discovery advances from measured impact to a buyer deadline without inventing urgency", () => {
  const page = PLAYBOOKS.find(page => page.slug === "sales-discovery-questions")!;
  const [before, after] = calculatePlaybook(page);
  assert.equal(before.gap, "Measured impact");
  assert.equal(after.gap, "Buyer deadline");
  assert.notEqual(after.pieces.find(piece => piece.id === "echeance")?.state, "Supported");
  assert.notEqual(before.action, after.action);
});

test("a follow-up reply adds support but does not establish purchasing authority", () => {
  const page = PLAYBOOKS.find(page => page.slug === "sales-follow-up-email")!;
  const [silent, reply] = calculatePlaybook(page);
  assert.equal(silent.pieces.find(piece => piece.id === "champion-vs-coach")?.state, "Unknown");
  assert.equal(reply.pieces.find(piece => piece.id === "champion-vs-coach")?.state, "Supported");
  assert.notEqual(reply.pieces.find(piece => piece.id === "qui-tranche")?.state, "Supported");
  assert.notEqual(silent.provenance.rule, reply.provenance.rule);
});
