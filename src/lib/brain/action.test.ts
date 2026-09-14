import assert from "node:assert/strict";
import { test } from "node:test";
import {
  A_RISQUE_MOT,
  actionPourDeal,
  nextStepCote,
  objectionCitee,
} from "./action";
import { AGENT_SPEC, CYCLE_AUDIT_PROMPT, MCP_INSTRUCTIONS } from "../copy";
import { nextQuestion } from "./next-question";
import { objectionMap } from "./objection-map";
import { pipeReview } from "./pipe";

test("next step: chez nous vs chez eux vs absent", () => {
  assert.equal(nextStepCote(undefined), "absent");
  assert.equal(nextStepCote("Send contract Friday"), "nous");
  assert.equal(nextStepCote("Relancer Marie"), "nous");
  assert.equal(nextStepCote("Préparer les questions sécurité"), "nous");
  assert.equal(nextStepCote("Répondre au mail de Thomas"), "nous");
  assert.equal(nextStepCote("Obtenir un créneau avec le directeur financier"), "nous");
  assert.equal(nextStepCote("Call avec Inès la semaine prochaine"), "nous");
  assert.equal(nextStepCote("Call de suivi avec Antoine le 18"), "eux");
});

test("pas d’appel → pas d’objection inventée", () => {
  const a = actionPourDeal({
    deal: { etape: "Négociation", montant: 45_000, nextStep: undefined },
    pieces: [
      {
        id: "qui-tranche",
        etat: "vide",
        rattachements: [
          { methode: "MEDDIC", partie: "Economic Buyer" },
          { methode: "BANT", partie: "Authority" },
          { methode: "BEBEDC", partie: "Décideurs" },
        ],
        preuve: null,
        gap: { claim: null, fait: null },
      },
    ],
    etape: "Négociation",
    refus: "Insuffisant",
  });
  assert.equal(a.objection, null);
  assert.match(a.quoi, /call manque/i);
  assert.doesNotMatch(a.quoi, /objection du call/i);
  assert.match(a.pourquoi, new RegExp(A_RISQUE_MOT));
});

test("envoyer le contrat sans celui qui signe → ne pas envoyer", () => {
  const a = actionPourDeal({
    deal: {
      etape: "Négociation",
      nextStep: "Send contract Friday",
      transcript: "c’est moi qui fais tourner l’outil",
      exhibits: [
        {
          source: "transcript",
          auteur: "prospect",
          citation: "c’est moi qui fais tourner l’outil au quotidien",
          piece: "qui-tranche",
          sens: "affirme",
        },
      ],
    },
    pieces: [
      {
        id: "qui-tranche",
        etat: "vide",
        rattachements: [{ methode: "MEDDIC", partie: "Economic Buyer" }],
        preuve: null,
        gap: { claim: "Economic Buyer: ok", fait: null },
      },
    ],
    etape: "Négociation",
  });
  assert.equal(a.next_step_cote, "nous");
  assert.match(a.quoi, /ne pas envoyer/i);
  assert.match(a.pourquoi, /stylo/i);
});

test("citation qui nie → objection ; relancer = chez nous", () => {
  const deal = {
    etape: "Négociation" as const,
    nextStep: "Relancer Karim",
    exhibits: [
      {
        source: "transcript" as const,
        auteur: "prospect" as const,
        citation: "moi je ne signe pas, ça passe au comité",
        piece: "qui-tranche" as const,
        sens: "nie" as const,
      },
    ],
  };
  assert.equal(objectionCitee(deal), "moi je ne signe pas, ça passe au comité");
  const a = actionPourDeal({
    deal,
    pieces: [
      {
        id: "qui-tranche",
        etat: "contredit",
        rattachements: [{ methode: "MEDDIC", partie: "Economic Buyer" }],
        preuve: "moi je ne signe pas, ça passe au comité",
        gap: { claim: null, fait: "moi je ne signe pas, ça passe au comité" },
      },
    ],
    etape: "Négociation",
  });
  assert.equal(a.objection, "moi je ne signe pas, ça passe au comité");
  assert.equal(a.next_step_cote, "nous");
});

test("pipe_review — quatre coupes écrites, pas un forecast", () => {
  const r = pipeReview(
    [
      {
        nom: "Late",
        etape: "Négociation",
        montant: 90_000,
        closeDate: "2026-09-30",
        transcript: "c’est moi qui fais tourner l’outil",
        nextStep: "Send contract Friday",
      },
      {
        nom: "Frozen",
        etape: "Négociation",
        montant: 45_000,
        closeDate: "2026-09-15",
        derniereModif: "2026-07-01",
        notes: "Call ops.",
      },
      {
        nom: "Later",
        etape: "Découverte",
        montant: 28_000,
        closeDate: "2026-12-15",
        notes: "Call ops.",
        nextStep: "Call de suivi avec Antoine le 18",
      },
    ],
    new Date("2026-09-14"),
  );
  assert.equal(r.lundi.totaux.liste, 163_000);
  assert.equal(r.lundi.totaux.a_risque, 135_000);
  assert.equal(r.lundi.totaux.ce_mois, 135_000);
  assert.equal(r.lundi.totaux.ce_mois_a_risque, 135_000);
  assert.equal(r.lundi.a_risque_mot, A_RISQUE_MOT);
  assert.equal(r.lundi.lecture.etat, "fragile");
  assert.match(r.lundi.lecture.regler, /agenda du prospect/i);
  const late = r.deals.find((d) => d.nom === "Late");
  assert.match(late?.action?.quoi ?? "", /ne pas envoyer/i);
  const frozen = r.deals.find((d) => d.nom === "Frozen");
  assert.equal(frozen?.action?.objection, null);
  const later = r.deals.find((d) => d.nom === "Later");
  assert.equal(later?.action?.next_step_cote, "eux");
  assert.ok(!JSON.stringify(r.lundi).includes("signature théorique"));
  assert.ok(!JSON.stringify(r.deals.map((d) => d.action)).includes("forte chance"));
});

test("next_question — contrat sans signataire : ne pas envoyer", () => {
  const q = nextQuestion({
    etape: "Négociation",
    nextStep: "Send contract Friday",
    transcript: "c’est moi qui fais tourner l’outil au quotidien",
  });
  assert.match(q.action?.quoi ?? "", /ne pas envoyer/i);
});

test("objection_map — en interne n’est pas le prix ; phrase exigée", () => {
  const vide = objectionMap({ objection: "   " });
  assert.match(vide.refus ?? "", /phrase exacte/i);
  const o = objectionMap({
    objection: "je dois en parler en interne",
    transcript: "il a dit je dois en parler en interne",
    montant: 120_000,
  });
  assert.equal(o.piece, "champion-vs-coach");
  assert.match(o.crac ?? "", /pas une objection prix/i);
  assert.match(o.action?.quoi ?? "", /rendez-vous/i);
  assert.ok((o.rattachements?.length ?? 0) > 1);
});

test("consigne assistant : page du lundi, pas un dump", () => {
  assert.match(MCP_INSTRUCTIONS, /lundi/);
  assert.match(MCP_INSTRUCTIONS, /don't write a sequence/i);
  assert.match(MCP_INSTRUCTIONS, /Extract before you call/);
  assert.match(MCP_INSTRUCTIONS, /Never default to French/);
  assert.match(AGENT_SPEC, /Monday page/);
  assert.match(CYCLE_AUDIT_PROMPT, /not market practice/);
});
