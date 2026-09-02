import type { Layer, Rattachement } from "./types";

export type Famille = "dossier" | "motivations" | "enjeu";

export type Piece = {
  id: string;
  famille: Famille;
  layerMin: Layer;
  seed: Rattachement;
  question: string;
  signal: RegExp;
  preuve_valide: RegExp;
  fausse_preuve: RegExp;
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
      /\b(daf|cfo|dg|ceo|directeur financier|directrice financière|qui (?:tranche|signe|décide)|autorité|authority|economic buyer|décideur)\b/i,
    preuve_valide:
      /(?:daf|cfo|dg|ceo|directeur financier|directrice financière).{0,80}(?:signe|tranche|décide|budget)/i,
    fausse_preuve:
      /c['’]est moi qui (?:décide|fais tourner|fait tourner)|moi qui fais tourner l['’]outil/i,
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
    preuve_valide:
      /(?:risque|réputation|je pousse|en interne).{0,80}(?:daf|comité|comite)/i,
    fausse_preuve: /c['’]est moi qui fais tourner|l['’]ops gentil/i,
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
      /\b(jour|jours|heure|€|eur|euros|coût|cout|perte|downtime|métrique|metrics|enjeu|inaction)\b/i,
    preuve_valide: /\d[\d\s]*\s*(?:€|eur|k€|euros)/i,
    fausse_preuve: /ça leur coûterait cher|notre roi|notre slide/i,
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
    preuve_valide:
      /[«"][^»"]{0,160}(?:perdus|douleur|problème|probleme|pain)[^»"]{0,80}[»"]/i,
    fausse_preuve: /persona|ils veulent le meilleur/i,
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
    preuve_valide: /\d[\d\s]*\s*(?:€|eur|k€|euros).{0,40}(?:budget|enveloppe)/i,
    fausse_preuve: /on verra|pas les moyens|budget\s*[:：]\s*(?:ok|oui)/i,
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
    seed: { methode: "MEDDIC", partie: "Decision process" },
    question: "le chemin réel : qui relit, quel délai, quelle alternative",
    signal:
      /\b(process|processus|comité|comite|décembre|decembre|pilote|go\/no|timeline|échéance|closing|habitude de signer)\b/i,
    preuve_valide: /\b(semaines?|jours?|mois)\b.{0,40}\b(contrat|signature|comité|comite|juridique)/i,
    fausse_preuve: /habitude de signer|on signe en décembre|closing\s*[=:]\s*décembre/i,
    vert: /(?:decision process|process(?:us)?|timeline|échéance)\s*[:：]\s*(?:ok|oui|yes|✓)/i,
    test: "qui relit le contrat, quel délai, quelle alternative déjà sur la table ?",
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
        question: "quelle alternative est déjà sur la table — y compris ne rien faire ?",
        donne: "concurrents, ou le statu quo",
      },
    ],
    gain: {
      savoir: "le process réel, daté",
      faire: "ne pas croire la date de close CRM",
    },
    cout_du_retard: "décembre arrive, le papier n’a pas commencé",
    verbe: "Demander le chemin réel : qui relit, quel délai, quelle alternative.",
    objectif: "Un process nommé par eux, pas une habitude.",
  },
  {
    id: "concurrents",
    famille: "dossier",
    layerMin: 1,
    seed: { methode: "MEDDPICC", partie: "Competition" },
    question: "l’alternative réelle, y compris ne rien faire",
    signal: /\b(concurrent|concurrence|alternative|statu quo|déjà un outil|deja un outil)\b/i,
    preuve_valide: /\b(statu quo|concurrent|alternative|ne rien faire)\b/i,
    fausse_preuve: /on est seuls|pas de concurrent/i,
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
];

export function pieceOf(id: string): Piece | undefined {
  return PIECES.find((p) => p.id === id);
}
