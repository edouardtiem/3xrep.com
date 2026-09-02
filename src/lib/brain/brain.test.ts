import assert from "node:assert/strict";
import { test } from "node:test";
import { scoreDeal } from "./audit";
import { layerOf } from "./layer";
import { rattacher } from "./rattacher";

test("dossier vide → toutes les cases vides, layer 0", () => {
  const a = scoreDeal({});
  assert.equal(a.layer, 0);
  assert.ok(a.cases.every((c) => c.etat === "vide"));
  assert.ok(a.trous.length > 0);
  assert.equal(a.rendu.blocs.length, 5);
});

test("case cochée sans preuve = vide", () => {
  const a = scoreDeal({
    notes: "Economic Buyer: ok\nChampion: oui\nMetrics: ✓",
  });
  const eb = a.cases.find((c) => c.id === "economic_buyer");
  const ch = a.cases.find((c) => c.id === "champion");
  const mx = a.cases.find((c) => c.id === "metrics");
  assert.equal(eb?.etat, "vide");
  assert.equal(ch?.etat, "vide");
  assert.equal(mx?.etat, "vide");
  assert.ok(a.trous.some((t) => t.methode === "BANT" && t.partie === "Authority"));
});

test("layer 2 si comité / montant", () => {
  assert.equal(layerOf({ montant: 120_000, notes: "comité achat, DAF en copie" }), 2);
  assert.equal(layerOf({ montant: 8_000, notes: "cycle court, deux interlocuteurs" }), 1);
});

test("citation ops ≠ preuve Economic Buyer", () => {
  const a = scoreDeal({
    montant: 120_000,
    transcript:
      "Il a dit : « de toute façon c’est moi qui fais tourner l’outil au quotidien ». Deux jours perdus par mois.",
    notes: "Economic Buyer: ok",
  });
  assert.equal(a.cases.find((c) => c.id === "economic_buyer")?.etat, "vide");
  assert.equal(a.layer, 2);
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
