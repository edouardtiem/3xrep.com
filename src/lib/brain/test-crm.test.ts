import assert from "node:assert/strict";
import { test } from "node:test";
import { scoreDeal } from "./audit";
import { pipeReview } from "./pipe";
import { TEST_CRM_DEAL_INPUT_SQL, TEST_CRM_PUBLIC_TABLE, toPipeDeal } from "./test-crm";

const NORDIK = toPipeDeal({
  id: "2c11a1f1-b343-4cd0-92f1-4fc0b21c88df",
  nom: "Nordik",
  etape: "Négociation",
  montant: "90000",
  close_date: "2026-09-30",
  derniere_modif: "2026-09-08T10:00:00.000Z",
  notes: "Economic Buyer: ok. Champion: Julien. Stage = Negotiation.",
  mails: "Julien, merci pour ce matin.",
  meetings: "2026-09-08 — Découverte ops — Julien Rault",
  transcript:
    "Julien: « de toute façon c'est moi qui fais tourner l'outil au quotidien ». Deux jours perdus par mois. On a l'habitude de signer en décembre.",
  next_step: "Send contract Friday",
  evidence: "transcript",
  exhibits: [
    {
      nom: "Julien",
      date: "2026-09-08",
      sens: "affirme",
      piece: "qui-tranche",
      titre: "ops",
      auteur: "prospect",
      source: "transcript",
      citation: "c'est moi qui fais tourner l'outil au quotidien",
      test_pose: false,
    },
    {
      nom: "AE",
      sens: "affirme",
      piece: "qui-tranche",
      auteur: "rep",
      source: "note",
      citation: "Economic Buyer: ok",
      test_pose: false,
    },
  ],
});

const DUNE = toPipeDeal({
  id: "38caa5a3-0348-434b-9185-0035d635b021",
  nom: "Dune",
  etape: "Négociation",
  montant: 45000,
  close_date: "2026-09-15",
  derniere_modif: "2026-07-01T10:00:00.000Z",
  notes: null,
  mails: null,
  meetings: null,
  transcript: null,
  next_step: null,
  evidence: null,
  exhibits: [],
});

test("toPipeDeal maps the test CRM row to pipe_review fields", () => {
  assert.equal(NORDIK.nom, "Nordik");
  assert.equal(NORDIK.montant, 90_000);
  assert.equal(NORDIK.closeDate, "2026-09-30");
  assert.equal(NORDIK.evidence, "transcript");
  assert.equal(DUNE.transcript, undefined);
  assert.equal(DUNE.exhibits, undefined);
  assert.equal(TEST_CRM_PUBLIC_TABLE, "test_crm_opportunities");
  assert.match(TEST_CRM_DEAL_INPUT_SQL, /test\.deal_input/);
});

test("Nordik seed: the brain returns a verdict, not a refusal", () => {
  const a = scoreDeal(NORDIK);
  assert.equal(a.refus, null);
  assert.equal(a.pieces.find((p) => p.id === "qui-tranche")?.etat, "vide");
});

test("Dune seed: amount, no call — mapper keeps the empty artefacts", () => {
  assert.equal(DUNE.montant, 45_000);
  assert.equal(DUNE.etape, "Négociation");
  assert.equal(DUNE.transcript, undefined);
  assert.equal(DUNE.notes, undefined);
  assert.equal(DUNE.mails, undefined);
});

test("pipe_review can eat the ten-deal shape (Nordik + Dune)", () => {
  const r = pipeReview([NORDIK, DUNE], new Date("2026-09-12"));
  assert.equal(r.deals.length, 2);
  assert.equal(r.deals[0].refus, null);
  assert.ok(r.deals[0].contradictions.some((c) => c.type === "etape_illegale"));
});
