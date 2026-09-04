import assert from "node:assert/strict";
import { test } from "node:test";
import { scoreDeal } from "./audit";
import { layerOf } from "./layer";
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
