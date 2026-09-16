import assert from "node:assert/strict";
import { test } from "node:test";
import { scoreDeal } from "./audit";
import { pipeReview } from "./pipe";
import { planHorizon } from "./horizon";
import { objectionMap } from "./objection-map";
import { extraireFaits } from "./faits";
import type { DealInput, Exhibit } from "./types";

const greeting: Exhibit = { source: "transcript", auteur: "prospect", citation: "Bonjour et merci pour votre temps.", piece: "qui-tranche", sens: "affirme", test_pose: true, reponse: "Marie décide du budget." };
const state = (deal: DealInput, id = "qui-tranche") => scoreDeal(deal).pieces.find(p => p.id === id)?.etat;

test("a label and an invented answer cannot turn a greeting into buying authority", () => {
  assert.notEqual(state({ transcript: greeting.citation, exhibits: [greeting] }), "su");
  assert.notEqual(state({ exhibits: [greeting] }), "su");
});

test("an amount does not change source verification", () => {
  const base = { exhibits: [greeting] };
  assert.equal(extraireFaits(base)[0].verifie, false);
  assert.equal(extraireFaits(base)[0].verifie, extraireFaits({ ...base, montant: 1000 })[0].verifie);
});

test("a rejected quote never returns as contradiction, proof, window or objection", () => {
  const citation = "Marie ne décide pas du budget.";
  const a = scoreDeal({ transcript: "Bonjour et merci.", exhibits: [{ ...greeting, citation, sens: "nie" }] });
  assert.notEqual(a.pieces.find(p => p.id === "qui-tranche")?.etat, "contredit");
  assert.equal(a.action?.objection, null);
  assert.ok(a.pieces.every(p => p.preuve !== citation));
  assert.ok(a.remontees.every(r => r.fenetre !== citation));
});

test("one quote may support several pieces without losing a mapping", () => {
  const citation = "Marie valide le budget de 12000 euros.";
  const exhibits: Exhibit[] = ["qui-tranche", "budget"].map(piece => ({ ...greeting, piece: piece as Exhibit["piece"], citation, reponse: citation }));
  assert.equal(extraireFaits({ transcript: citation, exhibits }).length, 2);
});

test("discovery stage corrections agree across audit and pipeline", () => {
  const deal = { crm_id: "a", nom: "A", etape: "découverte", notes: "Premier échange, besoin à explorer." };
  assert.equal(scoreDeal(deal).corrections_crm?.filter(c => c.propriete === "etape").length, 0);
  assert.equal(pipeReview([deal]).corrections_crm.length, 0);
});

test("missing files never make the pipeline solid", () => {
  assert.equal(pipeReview([{ nom: "A" }, { nom: "B" }]).lundi.lecture.etat, "indetermine");
});

test("notes never supply a missed-call quote or a call rating contract", () => {
  const a = scoreDeal({ notes: "Il faut que ça passe en interne." });
  assert.ok(a.remontees.every(r => r.fenetre === null));
  assert.ok(a.rendu.blocs.every(b => !["call", "rate"].includes(b.id)));
});

test("price objections keep their meaning in English and their action targets the selected hole", () => {
  for (const objection of ["C’est trop cher.", "It is too expensive."]) {
    const o = objectionMap({ objection, transcript: objection });
    assert.equal(o.piece, "enjeu-chiffre");
    assert.equal(o.action?.question, "deux jours de qui, à quel coût chargé ?");
  }
});

test("calendar order compares instants instead of ISO strings", () => {
  const p = planHorizon({ fenetre: 1, maintenant: "2026-09-16T08:00:00+02:00", items: [
    { kind: "rdv", quand: "2026-09-16T09:00:00Z", deal: { nom: "A", notes: "Premier échange" } },
    { kind: "rdv", quand: "2026-09-16T10:00:00+02:00", deal: { nom: "B", notes: "Premier échange" } },
  ] });
  assert.deepEqual(p.agenda.map(s => s.heure), ["10:00", "11:00"]);
});

test("a quote in the wrong source is rejected", () => {
  const citation = "Je décide du budget final.";
  const f = extraireFaits({ mails: citation, transcript: "Bonjour", exhibits: [{ ...greeting, citation }] })[0];
  assert.equal(f.verification, "citation_absente");
});

test("exact question and answer are required for a held fact", () => {
  const citation = "Je décide du budget final.";
  const question = "Qui d’autre doit valider ?";
  const reponse = "Personne, je valide seul le budget.";
  const deal: DealInput = { transcript: `${citation} ${question} ${reponse}`, exhibits: [{ ...greeting, citation, question, reponse }] };
  assert.equal(state(deal), "su");
  assert.notEqual(state({ ...deal, transcript: `${citation} ${reponse}` }), "su");
});

test("method selection uses deal context before the company's normal cycle", async () => {
  const { selectMethod } = await import("./method-selection");
  assert.equal(selectMethod({ contexte_entreprise: { cycle: "long", comite: true }, contexte: { cycle: "court" } }).grille, "BANT");
  assert.equal(selectMethod({ contexte: { cycle: "moyen", interlocuteurs: 2 } }).grille, "SPICED");
  assert.equal(selectMethod({ contexte: { cycle: "long", papier: true } }).grille, "MEDDPICC");
  assert.equal(selectMethod({}).provisoire, true);
  assert.equal(selectMethod({ contexte: { moment: "demo" } }).intervention, "BAC");
  assert.equal(selectMethod({ objection: "too expensive" }).intervention, "CRAC");
});

test("a later verified update replaces only the same identified speaker", async () => {
  const { faitsCourants } = await import("./faits");
  const old = "Je ne signe pas.";
  const citation = "Je décide maintenant du budget final.";
  const question = "Qui valide ?", reponse = "Je valide seul le budget.";
  const deal: DealInput = { sources: [
    { id: "old", type: "mail", date: "2026-09-01", texte: old },
    { id: "new", type: "mail", date: "2026-09-15", texte: `${citation} ${question} ${reponse}` },
  ], exhibits: [
    { source: "mail", source_id: "old", auteur: "prospect", nom: "Marie", citation: old, piece: "qui-tranche", sens: "nie" },
    { source: "mail", source_id: "new", auteur: "prospect", nom: "Marie", citation, question, reponse, piece: "qui-tranche", sens: "affirme", test_pose: true },
  ] };
  assert.equal(faitsCourants(extraireFaits(deal)).length, 1);
  assert.equal(state(deal), "su");
  deal.exhibits![1].nom = "Paul";
  assert.equal(faitsCourants(extraireFaits(deal)).length, 2);
  assert.equal(state(deal), "contredit");
});

test("empty connected sources are not missing connectors", () => {
  const p = planHorizon({ fenetre: 1, maintenant: "2026-09-16T08:00:00+02:00", sources_lues: { crm: "disponible", gmail: "disponible", calendar: "disponible" }, items: [] });
  assert.equal(p.demande, null);
});

test("a legitimate sourced reply may be drafted, never sent", () => {
  const citation = "Nous perdons deux heures par jour.";
  const p = planHorizon({ fenetre: 1, maintenant: "2026-09-16T08:00:00+02:00", items: [{ kind: "mail", mail: { sens: "entrant", extrait: citation }, deal: { mails: citation, exhibits: [{ source: "mail", auteur: "prospect", citation, piece: "besoin", sens: "affirme" }] } }] });
  assert.equal(p.agenda[0].draft.ecrire, true);
  assert.match(p.agenda[0].draft.contrainte, /jamais envoi/);
});

test("the local day accounts for the autumn daylight-saving change", () => {
  const p = planHorizon({ fenetre: 1, maintenant: "2026-10-25T08:00:00+01:00", fuseau: "Europe/Paris", items: [
    { kind: "rdv", quand: "2026-10-24T22:30:00Z", deal: { nom: "start", notes: "Premier échange" } },
    { kind: "rdv", quand: "2026-10-25T22:30:00Z", deal: { nom: "end", notes: "Premier échange" } },
    { kind: "rdv", quand: "2026-10-25T23:30:00Z", deal: { nom: "tomorrow", notes: "Premier échange" } },
  ] });
  assert.deepEqual(p.agenda.map(s => s.nom), ["start", "end"]);
});

test("a bare negative answer does not confirm the initial authority claim", () => {
  const citation = "Je décide du budget final.", question = "Vous confirmez pouvoir signer ?", reponse = "Non.";
  assert.notEqual(state({ transcript: `${citation} ${question} ${reponse}`, exhibits: [{ ...greeting, citation, question, reponse }] }), "su");
});

test("French and English buying-committee context select the same grid", async () => {
  const { selectMethod } = await import("./method-selection");
  assert.equal(selectMethod({ notes: "cycle long avec comité" }).grille, selectMethod({ notes: "long sales cycle with buying committee" }).grille);
});
