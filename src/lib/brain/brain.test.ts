import assert from "node:assert/strict";
import { test } from "node:test";
import { scoreDeal } from "./audit";
import { layerOf } from "./layer";
import { pipeReview } from "./pipe";
import { rattacher } from "./rattacher";

const JULIEN = {
  etape: "découverte",
  montant: 120_000,
  notes: "Economic Buyer: ok. Julien est notre champion. closing = décembre",
  transcript:
    "Il a dit : « de toute façon c’est moi qui fais tourner l’outil au quotidien ». Deux jours perdus par mois. On a l’habitude de signer en décembre.",
};

test("dossier vide → pièces vides, layer 0", () => {
  const a = scoreDeal({});
  assert.equal(a.layer, 0);
  assert.ok(a.pieces.every((c) => c.etat === "vide"));
  assert.ok(a.trous.length > 0);
  assert.equal(a.rendu.blocs.length, 5);
  assert.ok(!a.pieces.some((p) => p.id === "process-papier"));
});

test("case cochée sans preuve = vide", () => {
  const a = scoreDeal({
    notes: "Economic Buyer: ok\nChampion: oui\nMetrics: ✓",
  });
  const eb = a.pieces.find((c) => c.id === "qui-tranche");
  const ch = a.pieces.find((c) => c.id === "champion-vs-coach");
  const mx = a.pieces.find((c) => c.id === "enjeu-chiffre");
  assert.equal(eb?.etat, "vide");
  assert.equal(ch?.etat, "vide");
  assert.equal(mx?.etat, "vide");
  assert.ok(a.trous.some((t) => t.methode === "BANT" && t.partie === "Authority"));
});

test("layer 2 si comité / montant", () => {
  assert.equal(layerOf({ montant: 120_000, notes: "comité achat, DAF en copie" }), 2);
  assert.equal(layerOf({ montant: 8_000, notes: "cycle court, deux interlocuteurs" }), 1);
});

test("citation ops ≠ preuve qui-tranche", () => {
  const a = scoreDeal({
    montant: 120_000,
    transcript:
      "Il a dit : « de toute façon c’est moi qui fais tourner l’outil au quotidien ». Deux jours perdus par mois.",
    notes: "Economic Buyer: ok",
  });
  assert.equal(a.pieces.find((c) => c.id === "qui-tranche")?.etat, "vide");
  assert.equal(a.layer, 2);
});

test("Julien — 8 étages : vide, mort, fenêtre, un geste", () => {
  const a = scoreDeal(JULIEN);
  assert.equal(a.geste_demande, "debrief-apres-call");
  assert.equal(a.grade, "A");
  assert.equal(a.pieces.find((c) => c.id === "qui-tranche")?.etat, "vide");
  assert.equal(a.pieces.find((c) => c.id === "enjeu-chiffre")?.etat, "suppose");
  assert.equal(a.pieces.find((c) => c.id === "process-papier")?.etat, "suppose");
  assert.equal(a.morts[0]?.piece, "qui-tranche");
  const r = a.remontees.find((x) => x.piece === "qui-tranche");
  assert.ok(r?.fenetre?.includes("fais tourner"));
  assert.equal(r?.reflexe, "usage-nest-pas-budget");
  assert.equal(a.geste.piece, "qui-tranche");
  assert.ok(a.plan.length >= 1);
  assert.ok(a.objectif.length > 0);
  assert.equal(a.strippe.length, 0);
  assert.equal(a.remontees.length, 1);
});

test("passe-trous remonte chaque trou, y compris sans fenêtre", () => {
  const a = scoreDeal({ ...JULIEN, geste: "passe-trous" });
  assert.ok(a.remontees.length > 1);
  const conc = a.remontees.find((x) => x.piece === "concurrents");
  assert.equal(conc?.fenetre ?? null, null);
});

test("sans verbatim → strip 7/10 et réplique", () => {
  const a = scoreDeal({
    montant: 120_000,
    notes: "Economic Buyer: ok. Call avec Julien, il est chaud.",
  });
  assert.equal(a.grade, "B");
  assert.ok(a.strippe.includes("réplique"));
});

test("rattacher refuse un dossier", () => {
  const mur = rattacher("ligne 1\nligne 2");
  assert.equal(mur.ok, false);
  const ok = rattacher("Le DAF n’est pas dans l’appel.");
  assert.equal(ok.ok, true);
  if (ok.ok) {
    assert.ok(ok.rattachements.some((r) => r.partie === "Economic Buyer"));
  }
});

test("contrat: langue = user, else prompt", () => {
  const a = scoreDeal({});
  assert.equal(a.rendu.langue, "user, else prompt");
});

test("aucun artefact → refus, pas de verdict inventé", () => {
  assert.ok(scoreDeal({}).refus);
  assert.equal(scoreDeal(JULIEN).refus, null);
});

test("pipe_review — négo + EB vide : l’étape ment ; date de close = claim", () => {
  const r = pipeReview(
    [
      { ...JULIEN, nom: "Acme", etape: "Négociation", closeDate: "2026-09-30" },
      { nom: "Vide", etape: "Négociation", closeDate: "2026-09-15" },
    ],
    new Date("2026-09-04"),
  );
  const acme = r.deals[0];
  assert.equal(acme.refus, null);
  assert.ok(
    acme.contradictions.some((c) => c.type === "etape_illegale" && c.piece === "qui-tranche"),
  );
  assert.ok(acme.contradictions.some((c) => c.type === "date_sans_exhibit"));
  assert.equal(acme.mort?.piece, "qui-tranche");
  assert.ok(r.deals[1].refus);
  assert.equal(r.deals[1].contradictions.length, 0);
  assert.ok(r.rendu.interdits.includes("coverage × win rate"));
});

test("pipe_review — découverte n’est pas illégale ; fiche figée ; trou systémique", () => {
  const r = pipeReview(
    [
      { ...JULIEN, nom: "A", etape: "Découverte", derniereModif: "2026-07-01" },
      { nom: "B", etape: "Découverte", notes: "Economic Buyer: ok. Champion: oui." },
      { nom: "C", etape: "Discovery", montant: 20_000, notes: "Call ops, il est chaud." },
    ],
    new Date("2026-09-04"),
  );
  assert.ok(!r.contradictions.some((c) => c.type === "etape_illegale"));
  assert.ok(r.contradictions.some((c) => c.type === "fiche_figee" && c.deal === "A"));
  const eb = r.trous_systemiques.find((t) => t.piece === "qui-tranche");
  assert.equal(eb?.sur, 3);
  assert.equal(eb?.deals.length, 3);
  assert.ok(eb?.question.length);
});
