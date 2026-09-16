import type { Fait } from "./faits";
import type { Layer, PieceId, Rattachement } from "./types";

export type Famille = "dossier" | "motivations" | "enjeu";

export const SOURCES_REELLES = new Set<Fait["source"]>(["transcript", "meeting", "mail"]);

export type Piece = {
  id: PieceId;
  famille: Famille;
  layerMin: Layer;
  seed: Rattachement;
  question: string;
  signal: RegExp;
  fausse_preuve: RegExp;
  nie: RegExp;
  prior_titre?: RegExp;
  vert: RegExp;
  test: string;
  mort: { etage: string; quand: string; phrase: string; ordre: number };
  perches: { signal: RegExp; exemple: string; reflexe: string }[];
  echelle: { cran: number; question: string; donne: string }[];
  gain: { savoir: string; faire: string };
  cout_du_retard: string;
  verbe: string;
  objectif: string;
};

export const PIECES: Piece[] = [
  {
    id: "qui-tranche",
    famille: "dossier",
    layerMin: 0,
    seed: { methode: "MEDDIC", partie: "Economic Buyer" },
    question: "qui signe le bon de commande sur ce deal",
    signal:
      /\b(daf|cfo|dg|ceo|directeur financier|directrice financière|qui (?:tranche|signe|décide)|autorité|authority|economic buyer|décideur|i (?:sign|decide)|decision[- ]maker)\b/i,
    fausse_preuve:
      /c['’]est moi qui (?:fais tourner|fait tourner)|moi qui fais tourner l['’]outil|i (?:run|operate) the tool/i,
    nie: /(?:ne (?:signe|tranche|décide) pas|n['’]est pas (?:celui|celle) qui (?:signe|décide)|(?:do|does)(?:n['’]t| not) sign|(?:do|does)(?:n['’]t| not) decide)/i,
    prior_titre:
      /\b(c-level|c[eofi]o|daf|dg|dga|pdg|directeur|directrice|director|vp|vice[- ]president|head of|chief \w+ officer|gérant|gérante|président|présidente|founder|fondateur|fondatrice)\b/i,
    vert: /(?:economic buyer|décideur|authority)\s*[:：]\s*(?:ok|oui|yes|✓|x|coché)/i,
    test: "quand ça passe en budget, c’est encore toi qui signes, ou ça remonte ?",
    mort: {
      etage: "signature",
      quand: "fin de cycle",
      phrase: "il faut que j’en parle en interne",
      ordre: 0,
    },
    perches: [
      {
        signal: /fais tourner l['’]outil|usage quotidien|c['’]est moi qui/i,
        exemple: "c’est moi qui fais tourner l’outil",
        reflexe: "usage-nest-pas-budget",
      },
      {
        signal: /\b(on|ils|en interne|il faut que ça passe)\b/i,
        exemple: "après il faut que ça passe en interne",
        reflexe: "pronom-nest-pas-personne",
      },
    ],
    echelle: [
      {
        cran: 1,
        question: "quand ça passe en budget, c’est toi qui signes ?",
        donne: "un nom, ou l’aveu que ça remonte",
      },
      {
        cran: 2,
        question: "la dernière fois que vous avez acheté un outil comme ça, ça s’est passé comment ?",
        donne: "le process réel, pas le process déclaré",
      },
      {
        cran: 3,
        question: "qui a dit non la dernière fois, et sur quoi ?",
        donne: "le critère du DAF, et l’objection qui arrivera",
      },
    ],
    gain: {
      savoir: "le nom et le critère de celui qui tranche",
      faire: "convier le DAF séance tenante, tant qu’il est en confiance",
    },
    cout_du_retard: "une relance à motiver, et l’invitation se négocie maintenant",
    verbe: "Faire nommer qui signe quand ça passe en budget — cette semaine.",
    objectif: "Le DAF est dans la pièce au prochain rdv.",
  },
  {
    id: "champion-vs-coach",
    famille: "dossier",
    layerMin: 1,
    seed: { methode: "MEDDIC", partie: "Champion" },
    question: "est-ce un champion (vend en notre absence, risque perso) ou un coach",
    signal: /\b(champion|coach|je pousse|en interne|ops)\b/i,
    fausse_preuve: /c['’]est moi qui fais tourner|l['’]ops gentil|i run the tool/i,
    nie: /pas (?:un |le )?champion|not (?:a |our )?champion|c['’]est un coach|is a coach/i,
    vert: /champion\s*[:：]\s*(?:ok|oui|yes|✓)/i,
    test: "qu’est-ce que tu risques si tu portes ça et que le DAF dit non ?",
    mort: {
      etage: "accès",
      quand: "avant le comité",
      phrase: "je dois en parler en interne",
      ordre: 3,
    },
    perches: [
      {
        signal: /fais tourner l['’]outil|champion/i,
        exemple: "c’est moi qui fais tourner l’outil",
        reflexe: "coach-dit-la-meme-phrase",
      },
    ],
    echelle: [
      {
        cran: 1,
        question: "tu lui parles de nous quand je ne suis pas là ?",
        donne: "s’il vend en ton absence, ou s’il est fan",
      },
      {
        cran: 2,
        question: "qu’est-ce que tu risques si le DAF dit non ?",
        donne: "un enjeu perso, ou rien",
      },
      {
        cran: 3,
        question: "tu m’ouvres le DAF, ou tu me dis pourquoi pas ?",
        donne: "l’accès, ou le trou nommé",
      },
    ],
    gain: {
      savoir: "champion testé, ou coach nommé",
      faire: "demander l’intro, pas la gentillesse",
    },
    cout_du_retard: "tu continues à briefer un fan",
    verbe: "Tester le champion : le risque perso, et l’accès au DAF.",
    objectif: "Julien ouvre le DAF, ou nomme pourquoi pas.",
  },
  {
    id: "enjeu-chiffre",
    famille: "enjeu",
    layerMin: 0,
    seed: { methode: "MEDDIC", partie: "Metrics" },
    question: "le coût de ne rien faire, en euros, dit par eux",
    signal:
      /\b(jour|jours|heure|€|eur|euros|\$|usd|dollars?|coût|cout|cost of inaction|perte|downtime|métrique|metrics|enjeu|inaction)\b/i,
    fausse_preuve: /ça leur coûterait cher|notre roi|notre slide|our roi slide/i,
    nie: /pas (?:d['’]enjeu|de chiffre)|no (?:metric|number|cost of inaction)/i,
    vert: /(?:metrics|métrique|enjeu)\s*[:：]\s*(?:ok|oui|yes|✓)/i,
    test: "deux jours de qui, à quel coût chargé ?",
    mort: {
      etage: "prix",
      quand: "à l’objection",
      phrase: "c’est trop cher",
      ordre: 1,
    },
    perches: [
      {
        signal: /\d+\s*jours?|jours? perdus|heures? perdu/i,
        exemple: "deux jours perdus par mois",
        reflexe: "chiffre-raconte-nest-pas-valide",
      },
    ],
    echelle: [
      {
        cran: 1,
        question: "deux jours de qui, à quel coût chargé ?",
        donne: "un montant",
      },
      {
        cran: 2,
        question: "sur un an ça fait tant — c’est un budget qui existe déjà quelque part ?",
        donne: "ligne budgétaire, ou pas",
      },
      {
        cran: 3,
        question: "si ce n’est pas budgété, qui arbitre, et quand ?",
        donne: "on retombe sur qui-tranche et l’échéance",
      },
    ],
    gain: {
      savoir: "le coût de l’inaction en euros, dit par lui",
      faire: "l’objection prix devient une soustraction",
    },
    cout_du_retard: "le chiffre que tu poses toi après coup ne vaut pas celui qu’il a dit",
    verbe: "Faire valider en euros, à voix haute, le coût de ne rien faire.",
    objectif: "Le chiffre est dit par eux avant le prochain rdv.",
  },
  {
    id: "besoin",
    famille: "dossier",
    layerMin: 0,
    seed: { methode: "MEDDIC", partie: "Identify pain" },
    question: "la douleur actuelle, pas un gain futur",
    signal: /\b(douleur|pain|besoin|need|problème|probleme|perdus)\b/i,
    fausse_preuve: /persona|ils veulent le meilleur|they want the best/i,
    nie: /pas de (?:douleur|besoin|problème)|no (?:pain|need|problem)/i,
    vert: /(?:pain|douleur|besoin|need)\s*[:：]\s*(?:ok|oui|yes|✓)/i,
    test: "pourquoi maintenant — qu’est-ce qui a changé ?",
    mort: {
      etage: "découverte",
      quand: "si le fil meurt",
      phrase: "on n’a pas le temps",
      ordre: 6,
    },
    perches: [
      {
        signal: /jours? perdus|problème|douleur/i,
        exemple: "deux jours perdus par mois",
        reflexe: "un-dire-nest-pas-une-preuve",
      },
    ],
    echelle: [
      {
        cran: 1,
        question: "ça se voit comment, concrètement, cette semaine ?",
        donne: "un fait, pas un persona",
      },
      {
        cran: 2,
        question: "pourquoi maintenant, et plus en janvier ?",
        donne: "le déclencheur",
      },
      {
        cran: 3,
        question: "si on ne fait rien, qui trinque en premier ?",
        donne: "le nom derrière le besoin",
      },
    ],
    gain: {
      savoir: "la douleur actuelle, collée à une phrase",
      faire: "arrêter de pitcher le gain",
    },
    cout_du_retard: "tu vends un futur, ils vivent un présent",
    verbe: "Coller la douleur à une phrase du call, pas à un persona.",
    objectif: "Le besoin est une phrase d’eux, pas un pitch.",
  },
  {
    id: "budget",
    famille: "dossier",
    layerMin: 1,
    seed: { methode: "BANT", partie: "Budget" },
    question: "enveloppe, millésime, et qui la tient",
    signal: /\b(budget|enveloppe|capex|opex)\b/i,
    fausse_preuve: /on verra|pas les moyens|we'll see|budget\s*[:：]\s*(?:ok|oui)/i,
    nie: /pas de budget|no budget|n['’]est pas budgété|not budgeted/i,
    vert: /budget\s*[:：]\s*(?:ok|oui|yes|✓)/i,
    test: "c’est un budget qui existe déjà quelque part ?",
    mort: {
      etage: "proposition",
      quand: "quand on parle prix",
      phrase: "on n’a pas prévu",
      ordre: 2,
    },
    perches: [
      {
        signal: /jours? perdus|budget/i,
        exemple: "deux jours perdus par mois",
        reflexe: "chiffre-raconte-nest-pas-valide",
      },
    ],
    echelle: [
      {
        cran: 1,
        question: "c’est un budget qui existe déjà, ou ça se crée ?",
        donne: "enveloppe, ou pas",
      },
      {
        cran: 2,
        question: "de quelle année, et qui la tient ?",
        donne: "millésime + nom",
      },
      {
        cran: 3,
        question: "si ce n’est pas là, qui arbitre ?",
        donne: "retombe sur qui-tranche",
      },
    ],
    gain: {
      savoir: "s’il y a une ligne, et qui la tient",
      faire: "ne pas envoyer de tarif dans le vide",
    },
    cout_du_retard: "le prix arrive trop tôt, ou trop tard",
    verbe: "Budget : enveloppe, millésime, et qui la tient — pas « on verra ».",
    objectif: "Une enveloppe nommée, ou l’aveu qu’il faut la créer.",
  },
  {
    id: "process-papier",
    famille: "dossier",
    layerMin: 2,
    seed: { methode: "MEDDPICC", partie: "Paper process" },
    question: "le chemin du contrat : qui relit, quel délai",
    signal:
      /contrat|contract|legal|juridique|procurement|achats|paper process/i,
    fausse_preuve:
      /habitude de signer|on signe en décembre|we usually sign in december|closing\s*[=:]\s*décembre/i,
    nie: /pas de process|no (?:decision )?process|il n['’]y a pas de chemin/i,
    vert: /(?:decision process|process(?:us)?|timeline|échéance)\s*[:：]\s*(?:ok|oui|yes|✓)/i,
    test: "qui relit le contrat, dans quel ordre et sous quel délai ?",
    mort: {
      etage: "signature",
      quand: "juridique / achats",
      phrase: "c’est chez legal",
      ordre: 4,
    },
    perches: [
      {
        signal: /décembre|decembre|habitude de signer|closing/i,
        exemple: "on a l’habitude de signer en décembre",
        reflexe: "habitude-nest-pas-process",
      },
    ],
    echelle: [
      {
        cran: 1,
        question: "qui relit le contrat, et en combien de temps ?",
        donne: "un chemin, pas une saison",
      },
      {
        cran: 2,
        question: "la dernière fois, ça a glissé où ?",
        donne: "le vrai goulot",
      },
      {
        cran: 3,
        question: "qu’est-ce qui peut bloquer la signature après la décision ?",
        donne: "les obstacles au contrat",
      },
    ],
    gain: {
      savoir: "le process réel, daté",
      faire: "ne pas croire la date de close CRM",
    },
    cout_du_retard: "décembre arrive, le papier n’a pas commencé",
    verbe: "Demander le chemin du contrat : qui relit, quel délai.",
    objectif: "Un process nommé par eux, pas une habitude.",
  },
  {
    id: "concurrents",
    famille: "dossier",
    layerMin: 1,
    seed: { methode: "MEDDPICC", partie: "Competition" },
    question: "l’alternative réelle, y compris ne rien faire",
    signal: /\b(concurrent|concurrence|alternative|statu quo|déjà un outil|deja un outil)\b/i,
    fausse_preuve: /on est seuls|pas de concurrent|we('re| are) the only/i,
    nie: /pas d['’]alternative|no (?:competitor|alternative|status quo)/i,
    vert: /(?:competition|concurren(?:t|ce|ts)?)\s*[:：]\s*(?:ok|oui|yes|✓)/i,
    test: "à part nous, vous regardez quoi — y compris ne rien faire ?",
    mort: {
      etage: "choix",
      quand: "quand une grille arrive",
      phrase: "on compare avec X",
      ordre: 5,
    },
    perches: [
      {
        signal: /déjà un outil|concurrent|statu quo|on compare/i,
        exemple: "on a déjà un outil",
        reflexe: "un-dire-nest-pas-une-preuve",
      },
    ],
    echelle: [
      {
        cran: 1,
        question: "à part nous, vous regardez quoi — y compris ne rien faire ?",
        donne: "une alternative nommée",
      },
      {
        cran: 2,
        question: "qu’est-ce qui ferait rester / partir ?",
        donne: "le critère de choix",
      },
      {
        cran: 3,
        question: "qui porte l’alternative en interne ?",
        donne: "un nom, souvent un autre coach",
      },
    ],
    gain: {
      savoir: "contre qui on joue, y compris le rien",
      faire: "ne pas remplir une grille à l’aveugle",
    },
    cout_du_retard: "tu es la colonne d’un RFP que tu n’as pas vu venir",
    verbe: "Nommer l’alternative réelle — y compris le statu quo.",
    objectif: "L’alternative est dite, ou provoquée au prochain call.",
  },
  {
    id: "echeance", famille: "dossier", layerMin: 0,
    seed: { methode: "BANT", partie: "Timeline" },
    question: "pour quelle date, et que se passe-t-il si elle glisse ?",
    signal: /[ée]ch[ée]ance|deadline|critical event|[ée]v[ée]nement|timeline|avant le|before|renewal|renouvellement|closing|d[ée]cembre/i,
    fausse_preuve: /notre fin de trimestre|our quarter/i,
    nie: /pas de date|no deadline|no date/i,
    vert: /(?:timeline|[ée]ch[ée]ance)\s*[:：]\s*(?:ok|oui|yes|✓)/i,
    test: "quelle date vient de chez vous, et quelle conséquence si elle glisse ?",
    mort: { etage: "priorité", quand: "quand le projet peut attendre", phrase: "on verra plus tard", ordre: 2 },
    perches: [{ signal: /date|deadline|audit|renewal|renouvellement/i, exemple: "avant notre audit", reflexe: "habitude-nest-pas-process" }],
    echelle: [
      { cran: 1, question: "quelle date vient de chez vous ?", donne: "une échéance client" },
      { cran: 2, question: "que se passe-t-il si elle glisse ?", donne: "la conséquence du retard" },
      { cran: 3, question: "qui doit décider avant cette date ?", donne: "le chemin vers cette échéance" },
    ],
    gain: { savoir: "date et conséquence confirmées", faire: "adapter la prochaine action à leur urgence" },
    cout_du_retard: "le calendrier commercial peut masquer l’absence d’urgence client",
    verbe: "Faire confirmer l’échéance du client et la conséquence d’un retard.",
    objectif: "Une date client et sa raison.",
  },
  {
    id: "criteres-achat", famille: "dossier", layerMin: 1,
    seed: { methode: "MEDDIC", partie: "Decision criteria" },
    question: "sur quels critères allez-vous choisir ?",
    signal: /crit[èe]re|criteria|requirement|exigen|comparer|compare/i,
    fausse_preuve: /ils veulent le meilleur|they want the best/i,
    nie: /pas de crit[èe]re|no criteria/i,
    vert: /(?:criteria|crit[èe]res?)\s*[:：]\s*(?:ok|oui|yes|✓)/i,
    test: "qu’est-ce qui départagera les options, et qui valide ces critères ?",
    mort: { etage: "choix", quand: "avant la démonstration ou l’évaluation", phrase: "ce n’est pas notre critère", ordre: 3 },
    perches: [{ signal: /comparer|compare|crit[èe]re|criteria/i, exemple: "on compare les options", reflexe: "un-dire-nest-pas-une-preuve" }],
    echelle: [
      { cran: 1, question: "sur quels critères allez-vous choisir ?", donne: "les exigences du client" },
      { cran: 2, question: "lequel passe avant les autres ?", donne: "l’arbitrage" },
      { cran: 3, question: "qui les valide ?", donne: "la personne responsable du choix" },
    ],
    gain: { savoir: "les critères du client", faire: "préparer une démonstration utile" },
    cout_du_retard: "la démonstration peut répondre aux mauvais critères",
    verbe: "Faire confirmer les critères qui départagent les options.", objectif: "Des critères exprimés par le client.",
  },
  {
    id: "process-decision", famille: "dossier", layerMin: 1,
    seed: { methode: "MEDDIC", partie: "Decision process" },
    question: "qui intervient dans le choix, dans quel ordre ?",
    signal: /d[ée]cision|decision|comit[ée]|committee|validation|approval/i,
    fausse_preuve: /habitude de signer|usually sign/i,
    nie: /pas de process|no decision process/i,
    vert: /(?:decision process|processus)\s*[:：]\s*(?:ok|oui|yes|✓)/i,
    test: "quelles étapes et quelles personnes séparent cette discussion de la décision ?",
    mort: { etage: "décision", quand: "avant le choix", phrase: "il manque une validation", ordre: 4 },
    perches: [{ signal: /comit[ée]|committee|approval|validation/i, exemple: "ça passe au comité", reflexe: "habitude-nest-pas-process" }],
    echelle: [
      { cran: 1, question: "qui intervient dans le choix, dans quel ordre ?", donne: "les étapes du choix" },
      { cran: 2, question: "qui peut bloquer cette décision ?", donne: "les validations nécessaires" },
      { cran: 3, question: "quand chaque validation peut-elle avoir lieu ?", donne: "le calendrier du choix" },
    ],
    gain: { savoir: "le chemin de décision", faire: "chercher la prochaine validation" },
    cout_du_retard: "une validation inconnue peut déplacer la décision",
    verbe: "Faire décrire le chemin de décision, avant le chemin du contrat.", objectif: "Étapes, personnes et ordre confirmés.",
  },
];

export function pieceOf(id: string): Piece | undefined {
  return PIECES.find((p) => p.id === id);
}

export function rattacheA(piece: Piece, f: Fait): boolean {
  if (f.piece) return f.piece === piece.id;
  return piece.signal.test(f.texte) || piece.fausse_preuve.test(f.texte) || piece.nie.test(f.texte);
}

/** Tenue : prospect + source réelle + affirme + test posé et répondu. */
export function preuveDe(piece: Piece, faits: Fait[]): Fait | null {
  return (
    faits.find(
      (f) =>
        f.auteur === "prospect" &&
        f.verifie &&
        SOURCES_REELLES.has(f.source) &&
        f.sens !== "nie" &&
        rattacheA(piece, f) &&
        f.test_verifie &&
        contenuValide(piece, f),
    ) ?? null
  );
}

export function declarationDe(piece: Piece, faits: Fait[], text: string): boolean {
  if (faits.some((f) => f.verifie && rattacheA(piece, f) && f.sens !== "nie")) return true;
  return piece.signal.test(text) || piece.fausse_preuve.test(text);
}

export function nieDe(piece: Piece, faits: Fait[]): boolean {
  return faits.some((f) => f.verifie && rattacheA(piece, f) &&
    piece.nie.test(f.texte));
}

export function priorTitreDe(piece: Piece, faits: Fait[], text: string): string | null {
  if (!piece.prior_titre) return null;
  for (const f of faits) {
    if (!f.verifie) continue;
    if (f.titre && piece.prior_titre.test(f.titre)) return f.titre.trim();
    if (f.texte && piece.prior_titre.test(f.texte)) return f.texte.match(piece.prior_titre)?.[0] ?? null;
  }
  const m = text.match(piece.prior_titre);
  return m?.[0] ?? null;
}

/** Conservative EN/FR content checks. These do not claim to establish real-world truth.
 * Unsupported language/content stays supposed; host labels alone never satisfy a piece. */
export function contenuValide(piece: Piece, f: Fait): boolean {
  // A bare rejection of the checking question cannot confirm the initial claim.
  // A longer answer such as "non, personne d’autre" is evaluated in context below.
  if (/^(?:non|no|nope|pas moi|not me|je ne sais pas|i don['’]t know)[.!\s]*$/i.test(f.reponse?.trim() ?? "")) return false;
  const text = `${f.texte} ${f.reponse ?? ""}`;
  if (piece.fausse_preuve.test(text) || piece.nie.test(text)) return false;
  const checks: Record<string, RegExp[]> = {
    "qui-tranche": [/(?:je|moi|nous|[Ii]|[Ww]e|[A-ZÀ-Ý][\p{L}'’-]+).{0,50}(?:sign|d[ée]cid|valid|approv|arbitr|authori)/u, /budget|d[ée]cisi|decision|achat|purchas|final|personne d.autre|nobody else/i],
    "champion-vs-coach": [/d[ée]fend|port[ée]|vend|sponsor|advocat|introduc|intro|convain|convinc/i, /interne|internal|comit|committee|d[ée]cid|decision|daf|cfo|budget/i],
    "enjeu-chiffre": [/\d/, /perd|perte|co[uû]t|cost|sav|gain|reduc|impact|heures?|hours?|jours?|days?|risque|risk/i],
    besoin: [/probl[èe]me|problem|douleur|pain|perd|perte|bloqu|block|manqu|miss|ineffic|risque|risk|retard|delay/i],
    budget: [/\d/, /budget|enveloppe|fund|capex|opex/i],
    concurrents: [/alternative|concurren|competitor|compar|instead|plut[oô]t|statu quo|status quo|ne rien faire|do nothing/i],
    "process-papier": [/contrat|contract|legal|juridique|achats|procurement|signat|signature/i, /puis|ensuite|then|after|before|avant|jours?|days?|semaines?|weeks?/i],
    "process-decision": [/d[ée]cid|decision|choisi|choix|select|approv|valid/i, /puis|ensuite|then|after|before|avant|comit|committee|[0-9]/i],
    "criteres-achat": [/crit[èe]re|criteria|requirement|exigen|choisir|choose|compar/i],
    echeance: [/\d{4}-\d{2}-\d{2}|\d{1,2} (?:jan|f[ée]v|feb|mar|avr|apr|mai|may|juin|jun|juil|jul|ao[uû]|aug|sep|oct|nov|d[ée]c)/i, /avant|before|because|car|pour|audit|contrat|contract|lancement|launch|[ée]ch[ée]ance|deadline/i],
  };
  return (checks[piece.id] ?? []).length > 0 && checks[piece.id].every(re => re.test(text));
}
