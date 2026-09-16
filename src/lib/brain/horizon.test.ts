import assert from "node:assert/strict";
import { test } from "node:test";
import { planHorizon } from "./horizon";
import { HORIZON_NOW, horizonDayRows, toHorizonItems } from "./test-crm";

const items = toHorizonItems(horizonDayRows());

function dump(plan: unknown): string {
  return JSON.stringify(plan);
}

test("assembleur : 4 rdv, 2 tâches, 1 mail entrant du 16 sept", () => {
  assert.equal(items.filter((i) => i.kind === "rdv").length, 4);
  assert.equal(items.filter((i) => i.kind === "tache").length, 2);
  const mails = items.filter((i) => i.kind === "mail");
  assert.equal(mails.length, 1);
  assert.equal(mails[0]?.mail?.sens, "entrant");
  assert.equal(items.find((i) => i.deal.nom === "Nordik")?.deal.crm_id, "2c11a1f1-b343-4cd0-92f1-4fc0b21c88df");
});

test("fenetre=1 : 14 h et 16 h ; Dune = trou, pas un script de propale", () => {
  const p = planHorizon({ fenetre: 1, maintenant: HORIZON_NOW, items });
  const rdvs = p.agenda.filter((s) => s.kind === "rdv");
  assert.equal(rdvs.length, 2);
  assert.ok(rdvs.some((s) => s.heure === "14:00" && s.nom === "Nordik"));
  assert.ok(rdvs.some((s) => s.heure === "16:00" && s.nom === "Dune"));

  const dune = p.agenda.find((s) => s.nom === "Dune");
  assert.ok(dune);
  assert.match(dune.action?.quoi ?? "", /call manque/i);
  assert.equal(dune.draft.ecrire, false);
  assert.match(dune.draft.contrainte, /propale/i);
  assert.doesNotMatch(dune.draft.contrainte, /voici|bonjour|slide/i);
  assert.ok(dune.refus);

  assert.ok(p.hors_fenetre.some((h) => h.nom === "Helios"));
  assert.ok(p.hors_fenetre.some((h) => h.nom === "Nacre"));
  assert.equal(p.agenda.some((s) => s.nom === "Helios"), false);
});

test("mail de chasse : n’écris pas — jamais un corps marketing", () => {
  const p = planHorizon({ fenetre: 1, maintenant: HORIZON_NOW, items });
  const mail = p.agenda.find((s) => s.kind === "mail");
  assert.ok(mail);
  assert.equal(mail.mail?.sens, "entrant");
  assert.equal(mail.draft.ecrire, false);
  assert.match(mail.draft.contrainte, /n’écris pas|plaquette/i);
  assert.doesNotMatch(mail.draft.contrainte, /Bonjour|Voici notre|offrez-vous/i);
  assert.ok(!mail.draft.contrainte.includes("\n\n"));
});

test("fenetre=7 contient le jour ; 30 plus large", () => {
  const d1 = planHorizon({ fenetre: 1, maintenant: HORIZON_NOW, items });
  const d7 = planHorizon({ fenetre: 7, maintenant: HORIZON_NOW, items });
  const d30 = planHorizon({ fenetre: 30, maintenant: HORIZON_NOW, items });

  assert.ok(d7.agenda.some((s) => s.nom === "Nordik" && s.heure === "14:00"));
  assert.ok(d7.agenda.some((s) => s.nom === "Dune"));
  assert.ok(d7.agenda.some((s) => s.nom === "Helios"));
  assert.equal(d7.agenda.some((s) => s.nom === "Nacre"), false);
  assert.ok(d7.hors_fenetre.some((h) => h.nom === "Nacre"));

  assert.ok(d30.agenda.some((s) => s.nom === "Nacre"));
  assert.ok(d30.agenda.length > d7.agenda.length);
  assert.ok(d7.agenda.length > d1.agenda.length);
});

test("sans Gmail ni Calendar : on juge le CRM, on demande les connecteurs", () => {
  const p = planHorizon({
    fenetre: 1,
    maintenant: HORIZON_NOW,
    items: items.filter((i) => i.kind === "tache").slice(0, 1),
  });
  assert.match(p.demande ?? "", /Gmail/);
  assert.equal(p.refus, null);
});

test("pas de write_to_crm dans le JSON", () => {
  const p = planHorizon({ fenetre: 1, maintenant: HORIZON_NOW, items });
  assert.equal(dump(p).includes("write_to_crm"), false);
  assert.ok(p.agenda.every((s) => !("write_to_crm" in s)));
});
