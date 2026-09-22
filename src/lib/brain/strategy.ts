import { extraireFaits, faitsCourants, type Fait } from "./faits";
import { pieceOf } from "./pieces";
import { objectionPiece, prioriser } from "./priorite";
import type { DealInput, PieceId, PieceVerdict, Remontee } from "./types";
import type { Etat } from "./etat";

export type Strategy = {
  objective: string;
  gap: { piece: PieceId; state: Etat; why_it_matters: string };
  primitive: string;
  leverage: { source_id?: string; quote: string; fact: string; why_useful: string; piece: PieceId }[];
  approach: string;
  contact?: { known_name: string; evidence_anchor: string };
  target: { role: string; desired_outcome: string };
  next_move: { action: string; channel: "call" | "meeting" | "email" | "internal" | "unknown"; timing: string; reason: string };
  wording?: { purpose: string; suggested: string; evidence_anchor?: string };
  questions: { question: string; why: string; evidence_anchor?: string }[];
  branches: { if: string; then: string; why: string }[];
  success_condition: string;
  missing_context: string[];
  do_not: string[];
  preparation: { stage_claim?: string; next_step_claim?: string; window?: string; reflex?: string; related_gaps: string[] };
};

type Primitive = { id: string; requires_held: PieceId[]; target_gap: PieceId; logic: string };
/** Ordered, reusable links between held evidence and a gap. No generated buyer facts. */
export const STRATEGY_PRIMITIVES: Primitive[] = [
  { id: "champion-to-access", requires_held: ["champion-vs-coach"], target_gap: "qui-tranche", logic: "Demander au soutien interne testé de préparer une introduction et le sujet que le responsable de l’investissement doit arbitrer." },
  { id: "impact-to-access", requires_held: ["enjeu-chiffre"], target_gap: "qui-tranche", logic: "Utiliser l’impact confirmé pour proposer une discussion avec la personne qui peut engager la dépense." },
  { id: "pain-to-access", requires_held: ["besoin"], target_gap: "qui-tranche", logic: "Utiliser le problème reconnu comme motif d’accès à la personne qui peut financer sa résolution." },
  { id: "criteria-to-access", requires_held: ["criteres-achat"], target_gap: "qui-tranche", logic: "Proposer de valider les critères avec la personne qui arbitre l’investissement." },
  { id: "impact-to-budget", requires_held: ["enjeu-chiffre"], target_gap: "budget", logic: "Partir du coût confirmé pour distinguer une enveloppe existante d’un investissement à créer." },
  { id: "champion-to-process", requires_held: ["champion-vs-coach"], target_gap: "process-decision", logic: "Reconstituer avec le soutien interne un achat comparable et ses validations réelles." },
  { id: "alternative-to-urgency", requires_held: ["concurrents"], target_gap: "echeance", logic: "Tester la conséquence de conserver l’alternative actuelle et demander à partir de quand elle devient inacceptable." },
  { id: "pain-to-impact", requires_held: ["besoin"], target_gap: "enjeu-chiffre", logic: "Faire mesurer par le prospect les conséquences du problème reconnu avant de discuter du prix." },
  { id: "impact-to-champion", requires_held: ["enjeu-chiffre"], target_gap: "champion-vs-coach", logic: "Tester qui accepte de porter l’impact en interne et d’ouvrir la prochaine validation." },
  { id: "pain-to-criteria", requires_held: ["besoin"], target_gap: "criteres-achat", logic: "Transformer le problème reconnu en critère de choix mesurable par le client." },
  { id: "pain-to-alternative", requires_held: ["besoin"], target_gap: "concurrents", logic: "Comparer la résolution du problème avec le travail manuel, l’outil actuel, la construction interne ou l’inaction." },
  { id: "deadline-to-paper", requires_held: ["echeance"], target_gap: "process-papier", logic: "Remonter depuis l’échéance client pour faire confirmer chaque relecture, son responsable et son délai." },
  { id: "paper-to-decision", requires_held: ["process-papier"], target_gap: "process-decision", logic: "Séparer les validations de choix des relectures du contrat et demander laquelle doit arriver en premier." },
];

const QUESTIONS: Record<PieceId, [string, string, string]> = {
  "qui-tranche": ["Pour vérifier si ce sujet mérite un investissement, qui peut en arbitrer le budget avec nous ?", "Quand une dépense de ce type est approuvée, qui peut encore la refuser ?", "Pouvons-nous convenir ensemble d’un créneau pour valider ce point ?"],
  budget: ["Pour résoudre un problème de cet ordre, utilisez-vous une enveloppe existante ou faut-il en créer une ?", "Qui tient cette enveloppe, sur quelle période, et comment un achat comparable a-t-il été financé ?", "Quelle preuve faut-il réunir avant de faire arbitrer cette dépense ?"],
  "enjeu-chiffre": ["Qui subit ce problème, à quelle fréquence, et quel temps ou coût cela représente-t-il selon vous ?", "Comment avez-vous mesuré cette conséquence, et qui peut confirmer le calcul ?", "Quelle part de ce coût un changement pourrait-il réellement éviter ?"],
  besoin: ["Quel problème concret rencontrez-vous aujourd’hui, et dans quelle situation récente ?", "Qui en subit les conséquences ?", "Qu’est-ce qui a changé pour que vous regardiez ce sujet maintenant ?"],
  "champion-vs-coach": ["Seriez-vous prêt à porter ce sujet dans la prochaine discussion interne et à nous y associer ?", "Qu’est-ce que cette décision change pour vous personnellement ?", "Quelle introduction pouvez-vous organiser, et à quelle date ?"],
  "process-decision": ["Sur le dernier achat comparable, qui a validé quoi et dans quel ordre ?", "Qui pouvait bloquer le choix, même après un accord de principe ?", "Quelle est la prochaine validation et quand pouvons-nous la préparer ensemble ?"],
  "process-papier": ["Qui relit le contrat, dans quel ordre, et quel délai chaque équipe doit-elle confirmer ?", "Les achats, la sécurité et le juridique interviennent-ils avant ou après le choix ?", "Qui peut confirmer ce chemin avec nous avant de retenir une date de signature ?"],
  concurrents: ["À part notre solution, quelle option garderiez-vous : outil actuel, tableur, travail manuel, construction interne ou ne rien changer ?", "Pourquoi cette alternative est-elle acceptable aujourd’hui ?", "Qu’est-ce qui devrait devenir vrai pour justifier de la remplacer ?"],
  echeance: ["Combien de temps pouvez-vous conserver la situation actuelle et avec quelles conséquences ?", "Quel événement chez vous impose une date, et que se passe-t-il si elle glisse ?", "Quelles validations doivent être terminées avant cet événement ?"],
  "criteres-achat": ["Comment vérifierez-vous qu’une solution résout le problème décrit ?", "Quel critère départage réellement les options, et qui le valide ?", "Pouvons-nous convenir du test à faire au prochain rendez-vous ?"],
};
const SUCCESS: Record<PieceId, string> = {
  "qui-tranche": "La personne qui arbitre la dépense est identifiée, son autorité testée, et une introduction ou un rendez-vous est accepté.",
  budget: "Le client confirme une enveloppe et son responsable, ou le chemin pour créer le budget.",
  "enjeu-chiffre": "Le client confirme une mesure, sa source et les conséquences du problème.",
  besoin: "Le client décrit un problème actuel et une conséquence concrète.",
  "champion-vs-coach": "Le contact accepte une action interne observable ; son soutien ne repose plus sur sa seule amabilité.",
  "process-decision": "Les validations, leurs responsables et la prochaine étape sont confirmés par le client.",
  "process-papier": "Les équipes, l’ordre des relectures et les délais sont confirmés avant de retenir une date de signature.",
  concurrents: "L’alternative réelle et les conditions pour la remplacer sont exprimées par le client.",
  echeance: "Une échéance client et la conséquence de son report sont confirmées.",
  "criteres-achat": "Le client confirme les critères de choix, leur ordre et la personne qui les valide.",
};
const branch = (condition: string, then: string, why: string) => ({ if: condition, then, why });

function safeName(f: Fait, deal: DealInput): string | undefined {
  const name = f.nom?.trim();
  if (!name) return;
  const e = f.exhibit;
  const source = e?.source_id ? deal.sources?.find(s => s.id === e.source_id && s.type === e.source)?.texte
    : ({ transcript: deal.transcript, meeting: deal.meetings, mail: deal.mails } as Record<string, string | undefined>)[f.source];
  // Host metadata alone cannot introduce a person into the recommendation.
  if (source?.includes(name)) return name;
}

export function buildStrategy(deal: DealInput, pieces: PieceVerdict[], remontees: Remontee[] = []): Strategy | null {
  const objectionTarget = objectionPiece(deal.objection ?? "");
  const gap = (objectionTarget ? pieces.find(p => p.id === objectionTarget) : undefined) ?? prioriser(deal, pieces).pieces[0];
  const def = gap && pieceOf(gap.id);
  if (!gap || !def) return null;
  const facts = faitsCourants(extraireFaits(deal));
  const held = new Map(pieces.filter(p => p.etat === "su").map(p => [p.id, p]));
  const evidence = (id: PieceId) => facts.find(f => f.verifie && f.verification === "verifiee" && f.test_verifie && f.kind === "fait" && f.auteur === "prospect" && f.sens !== "nie" && held.get(id)?.preuve === f.texte);
  const primitive = STRATEGY_PRIMITIVES.find(p => p.target_gap === def.id && p.requires_held.every(id => evidence(id)));
  const related: Record<PieceId, PieceId[]> = {
    "qui-tranche": ["enjeu-chiffre", "besoin", "champion-vs-coach", "budget", "criteres-achat"],
    budget: ["enjeu-chiffre", "besoin"], "enjeu-chiffre": ["besoin"], besoin: [],
    "champion-vs-coach": ["enjeu-chiffre", "besoin"], concurrents: ["besoin"],
    echeance: ["concurrents", "besoin"], "criteres-achat": ["besoin"],
    "process-decision": ["champion-vs-coach", "process-papier"],
    "process-papier": ["echeance", "process-decision"],
  };
  const ids = [...new Set([...(primitive?.requires_held ?? []), def.id, ...related[def.id]])];
  const usable = ids.flatMap(id => { const f = evidence(id); return f ? [{ id, f }] : []; });
  const main = usable[0];
  const quote = (f: Fait) => f.exhibit?.citation ?? f.texte;
  const leverage = usable.map(({ id, f }) => ({ piece: id, source_id: f.exhibit?.source_id, quote: quote(f), fact: quote(f), why_useful: primitive?.requires_held.includes(id) ? primitive.logic : `Point confirmé à confronter à ${def.id}, sans supposer qu’il résout ce manque.` }));
  let approach = primitive?.logic ?? `Faire établir ${def.question} avec un exemple réel du client.`;
  let questions = [...QUESTIONS[def.id]];
  let branches = [
    branch("Le client donne un exemple précis", "Faire confirmer qui intervient et convenir de la prochaine validation avec une date proposée par le client.", "Transformer la réponse en engagement vérifiable."),
    branch("Le client ne sait pas", "Demander qui peut le vérifier et proposer de l’associer à la discussion.", "Une absence de réponse ne prouve pas un refus."),
    branch("Le client ne souhaite pas avancer", "Demander ce qui devrait changer et convenir de suspendre le sujet si aucune raison actuelle n’apparaît.", "Ne pas inventer une urgence."),
  ];
  const doNot = ["Ne pas inventer de personne, de chiffre, de date ou de citation.", "Ne jamais envoyer automatiquement le message proposé."];
  const missing = leverage.length ? [] : ["Aucune preuve tenue utilisable : la formulation reste générale jusqu’à une réponse client vérifiable."];
  let objective = SUCCESS[def.id];
  let move = approach;
  if (def.id === "qui-tranche") {
    const champion = evidence("champion-vs-coach");
    const pain = evidence("besoin") ?? evidence("enjeu-chiffre");
    approach = champion ? approach : pain ? "Faire du problème confirmé la raison d’une introduction. Tester d’abord si le contact accepte de la préparer ; son statut de soutien interne reste à vérifier." : "Demander comment un achat comparable a été décidé. Tester le pouvoir de décision et obtenir une introduction sans attribuer un rôle au contact.";
    const budget = evidence("budget");
    if (budget && !pain && !champion) approach = "Partir de l’enveloppe confirmée pour demander un rendez-vous avec son responsable et vérifier qui autorise réellement la dépense.";
    move = `${approach} Proposer cette validation avant d’envoyer une proposition.`;
    if (champion) questions[0] = "Pouvez-vous préparer avec nous l’introduction auprès de la personne qui arbitre l’investissement, en partant du sujet que vous portez en interne ?";
    if (budget && !pain && !champion) questions[0] = "Pour cette enveloppe, pouvons-nous associer son responsable afin de vérifier qui peut autoriser la dépense ?";
    branches = [
      branch("La personne à associer est trop occupée", "Demander quel arbitrage court justifierait sa présence et proposer au contact de valider ce motif avant l’invitation.", "L’accès doit servir une décision utile pour elle."),
      branch("Le contact dit pouvoir décider seul", "Demander qui approuve cette dépense, pour quel périmètre, et qui pouvait la refuser lors du dernier achat comparable.", "Un titre ou une déclaration ne confirme pas l’autorité."),
      branch("Le contact propose de transmettre la proposition en interne", "Ne pas envoyer la proposition à l’aveugle. Préparer ensemble le problème, les critères et la rencontre de validation.", "Un transfert de document ne donne ni accès ni accord."),
      branch("Le contact accepte l’introduction", "Préparer le problème confirmé, les inconnues et l’arbitrage attendu ; demander une date acceptée par les participants.", "Donner un objectif précis au rendez-vous."),
    ];
    doNot.push("Ne pas demander seulement « le décideur ». Ne pas confondre responsable financier, utilisateur et signataire.");
    if (!champion) missing.push("Le soutien interne du contact n’est pas confirmé.");
  }
  if (def.id === "budget") {
    if (!evidence("enjeu-chiffre")) {
      approach = "Faire d’abord mesurer les conséquences du problème par le client ; utiliser ensuite ce chiffre pour ouvrir le financement.";
      move = approach;
      objective = "Obtenir un impact confirmé avant de demander comment le financer.";
      questions = [QUESTIONS["enjeu-chiffre"][0], QUESTIONS["enjeu-chiffre"][1], QUESTIONS.budget[0]];
      missing.push("L’impact chiffré n’est pas confirmé ; ne pas présenter une estimation comme leur chiffre.");
    }
    branches = [
      branch("Une enveloppe existe", "Demander son responsable, sa période et les règles pour engager la dépense.", "Un montant seul ne donne pas l’autorisation d’acheter."),
      branch("Il faut créer une enveloppe", "Demander qui arbitre les nouvelles dépenses et quelle preuve préparer pour cette personne.", "Construire le chemin de financement."),
      branch("Il est trop tôt pour parler budget", "Demander quel impact ou quel résultat doit être confirmé avant cette discussion.", "Faire préciser le préalable au lieu de forcer un chiffre."),
    ];
    doNot.push("Ne pas ouvrir par « quel est votre budget ? » sans motif client.");
  }
  if (def.id === "enjeu-chiffre" && /prix|cher|price|expensive|cost/i.test(deal.objection ?? "")) {
    approach = evidence("enjeu-chiffre") ? "Revenir au coût confirmé et demander ce qui rend le prix disproportionné : périmètre, impact évitable ou financement." : "Creuser « cher par rapport à quoi » et faire confirmer le coût du problème avant de discuter d’une concession.";
    move = approach;
    questions[0] = "Quand vous dites que le prix est trop élevé, le comparez-vous au coût du problème, à une alternative ou à l’enveloppe disponible ?";
    doNot.push("Ne pas proposer une remise sans contrepartie ni coût confirmé.");
    branches = [branch("Le client conteste l’impact", "Refaire le calcul avec ses données et réduire le périmètre aux conséquences confirmées.", "Ne pas défendre un chiffre que le client ne reconnaît plus."), branch("Le client confirme l’impact mais manque de budget", QUESTIONS.budget[0], "Distinguer valeur et financement."), branch("Le client demande une remise", "Demander quelle contrepartie vérifiable et quel périmètre seraient discutés, sans promettre de réduction.", "Négocier un échange explicite.")];
  }
  if (def.id === "concurrents") branches = [branch("Un fournisseur est nommé", "Demander ce qui le rend préférable sur le critère prioritaire et comment le client testera ce critère.", "Comparer sur leurs critères, sans inventer les défauts du concurrent."), branch("L’alternative est le tableur, le travail manuel ou l’outil actuel", "Demander ce qui fonctionne encore et quel coût rendrait cette situation inacceptable.", "Comprendre pourquoi le statu quo tient."), branch("Le client envisage de construire en interne ou de ne rien faire", "Demander qui porte cette option, ses contraintes et ce qui justifierait de changer.", "L’inaction et la construction interne sont aussi des choix.")];
  const window = remontees.find(r => r.piece === gap.id);
  const verifiedWindow = window?.fenetre && facts.find(f => f.verifie && f.verification === "verifiee" && f.kind === "fait" && f.texte === window.fenetre);
  const contact = usable.map(x => ({ f: x.f, name: safeName(x.f, deal) })).find(x => x.name);
  const anchor = main ? quote(main.f) : undefined;
  const suggested = anchor ? `Vous avez dit : « ${anchor} ». ${questions[0]}` : questions[0];
  return {
    objective, gap: { piece: def.id, state: gap.etat, why_it_matters: def.cout_du_retard },
    primitive: primitive?.id ?? `establish-${def.id}`, leverage, approach,
    contact: contact?.name ? { known_name: contact.name, evidence_anchor: quote(contact.f) } : undefined,
    target: { role: def.id === "qui-tranche" ? "Personne qui arbitre l’investissement, autorité à vérifier" : "Interlocuteur capable de confirmer ce point", desired_outcome: objective },
    next_move: { action: move, channel: "meeting", timing: /propos|devis|quote|contract|contrat/i.test(`${deal.etape ?? ""} ${deal.nextStep ?? ""}`) ? "Avant la proposition ou le contrat" : "Lors de la prochaine discussion ; convenir d’une date", reason: `${def.gain.savoir}. ${def.cout_du_retard}.` },
    wording: { purpose: "Ouvrir la prochaine conversation", suggested, evidence_anchor: anchor },
    questions: questions.map((q, i) => ({ question: i === 0 ? suggested : q, why: i === 0 ? approach : i === 1 ? "Tester la réponse, pas seulement recueillir une déclaration." : "Obtenir un engagement observable pour la suite.", evidence_anchor: i === 0 ? anchor : undefined })),
    branches, success_condition: objective, missing_context: missing, do_not: doNot,
    preparation: { stage_claim: deal.etape, next_step_claim: deal.nextStep, window: verifiedWindow ? quote(verifiedWindow) : undefined, reflex: verifiedWindow ? window?.reflexe ?? undefined : undefined, related_gaps: pieces.filter(p => p.etat !== "su" && p.id !== gap.id).map(p => p.id) },
  };
}
