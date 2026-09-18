import { pieceOf } from "./pieces";
import { extraireFaits, faitsCourants } from "./faits";
import { prioriser } from "./priorite";
import type { Action, DealInput, NextStepCote, PieceVerdict, Rattachement } from "./types";

export const A_RISQUE_MOT = "pas la pratique de ces grilles, donc à risque";

export const REGLER_AGENDA =
  "Pas d’étape suivante sans date dans l’agenda du prospect.";

const ETAPE_TARDIVE =
  /\b(n[ée]go\w*|negotiation|contract|contrat|closing|commit\w*|verbal|signature|legal|juridique|procurement|achats|propos\w*|proposal|devis|quote|pricing|d[ée]mo\w*|[ée]valuation|poc|pilot\w*)\b/i;

const CHEZ_NOUS =
  /\b(send|envoy\w*|relanc\w*|pr[ée]par\w*|r[ée]pondre|repondre|reply|draft|follow[- ]?up|obtenir (un )?(cr[ée]neau|slot)|get (a |an )?(slot|meeting|hold))\b/i;

const PAPIER =
  /\b(contrat|contract|paper|devis|quote|sow|proposition commerciale)\b/i;

const DATE_CHEZ_EUX =
  /\b(\d{4}-\d{2}-\d{2}|(?:le|on|the)\s+\d{1,2}(?:st|nd|rd|th)?)\b/i;

const PERSONNE = /\b(?:avec|with)\s+[\p{Lu}][\p{L}'’-]+/u;

export function nextStepCote(nextStep: string | undefined | null): NextStepCote {
  const s = nextStep?.trim();
  if (!s) return "absent";
  if (CHEZ_NOUS.test(s)) return "nous";
  if (PERSONNE.test(s) && DATE_CHEZ_EUX.test(s)) return "eux";
  return "nous";
}

export function nommerGrilles(rattachements: Rattachement[]): string {
  return rattachements.map((r) => `${r.methode} ${r.partie}`).join(" / ");
}

export function objectionCitee(deal: DealInput): string | null {
  const nie = faitsCourants(extraireFaits(deal)).find(f =>
    f.verifie && f.auteur === "prospect" && f.kind === "fait" && f.sens === "nie" &&
    Boolean(f.piece && pieceOf(f.piece)?.nie.test(f.texte)));
  return nie?.texte ?? null;
}

function aUnAppel(deal: DealInput): boolean {
  return extraireFaits(deal).some(f => f.verifie && ["transcript", "meeting", "mail"].includes(f.source));
}

export function actionPourDeal(input: {
  deal: DealInput;
  pieces: PieceVerdict[];
  etape?: string | null;
  refus?: string | null;
  contradictions?: { type: string }[];
}): Action {
  const deal = input.deal;
  const cote = nextStepCote(deal.nextStep);
  const tranche = input.pieces.find((p) => p.id === "qui-tranche");
  const tete = prioriser(deal, input.pieces).pieces[0];
  const rattachements = tete?.rattachements ?? [];
  const def = tete ? pieceOf(tete.id) : undefined;
  const question = def?.echelle[0]?.question ?? def?.question ?? null;
  const tardive = Boolean(input.etape && ETAPE_TARDIVE.test(input.etape));
  const signerVide = Boolean(tranche && tranche.etat !== "su");
  const objection = aUnAppel(deal) ? objectionCitee(deal) : null;
  const figee = input.contradictions?.some((c) => c.type === "fiche_figee") ?? false;
  const papierChezNous = cote === "nous" && PAPIER.test(deal.nextStep ?? "");
  const q = question ? ` Poser : « ${question} »` : "";

  let quoi: string;
  if (input.refus && !aUnAppel(deal) && !deal.notes?.trim()) {
    quoi = tardive
      ? `Le call manque. Poser un créneau avec celui qui peut signer - pas une négo avec l’ops. Ne pas inventer d’objection.`
      : `Le call manque. Ne pas inventer d’objection. Poser un rendez-vous daté dans l’agenda du prospect.`;
  } else if (papierChezNous && signerVide) {
    quoi = `Ne pas envoyer le contrat.${q || " Obtenir un nom ou un rendez-vous avec celui qui signe."}`;
  } else if (tardive && signerVide) {
    quoi = `Poser un créneau avec celui qui peut signer - pas une négo avec la personne en face.${q}`;
  } else if (!tete) {
    quoi = "Aucun manque établi dans les pièces examinées. Confirmer la prochaine étape convenue, sans inventer un nouveau trou.";
  } else if (cote === "nous") {
    quoi = `La prochaine étape écrite (« ${deal.nextStep} ») est chez nous : ça ne compte pas. Poser une date dans l’agenda du prospect.${q}`;
  } else if (cote === "eux") {
    quoi = `Garder ce rendez-vous. Y ouvrir la case vide.${q}`;
  } else if (figee) {
    quoi = `Appeler pour poser un rendez-vous daté chez eux, ou retirer la date de close du tableau.`;
  } else {
    quoi = def?.verbe ?? "Poser un rendez-vous daté dans l’agenda du prospect.";
  }

  const grilles = nommerGrilles(rattachements);
  const pourquoi = [
    grilles ? `Même case : ${grilles}.` : null,
    tardive && signerVide ? `Étape tardive sans celui qui signe : ${A_RISQUE_MOT}.` : null,
    papierChezNous && signerVide
      ? "Un papier à quelqu’un qui n’a pas le stylo meurt à la signature."
      : null,
    cote === "nous" ? "Envoyer, relancer ou préparer n’est pas une prochaine étape." : null,
  ]
    .filter(Boolean)
    .join(" ");

  return {
    quoi,
    pourquoi: pourquoi || def?.cout_du_retard || REGLER_AGENDA,
    rattachements,
    objection,
    next_step_cote: cote,
    question,
  };
}

export function planChezEux(questions: string[], action: Action): string[] {
  const rest = questions
    .filter((q) => !action.quoi.includes(q))
    .slice(0, 2)
    .map((q) => `Dans le prochain rendez-vous chez eux : « ${q} »`);
  return [action.quoi, ...rest].slice(0, 3);
}
