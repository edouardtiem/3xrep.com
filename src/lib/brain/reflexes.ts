export type Reflexe = {
  id: string;
  quand: string;
  alors: string;
  piege: string;
};

export const REFLEXES: Reflexe[] = [
  {
    id: "usage-nest-pas-budget",
    quand: "quelqu’un revendique l’usage quotidien de l’outil",
    alors: "séparer qui s’en sert de qui paie, dans la phrase suivante",
    piege: "prendre l’enthousiasme de l’ops pour de l’autorité",
  },
  {
    id: "pronom-nest-pas-personne",
    quand: "pronom flou sur la décision (on, ils, en interne)",
    alors: "exiger un nom avant d’enchaîner",
    piege: "laisser « l’interne » comme un process",
  },
  {
    id: "chiffre-raconte-nest-pas-valide",
    quand: "un volume, des jours, une perte, sans euros dits par eux",
    alors: "faire convertir par lui, à voix haute",
    piege: "poser le ROI slide à sa place",
  },
  {
    id: "habitude-nest-pas-process",
    quand: "une saison, un souvenir, « on signe en décembre »",
    alors: "demander le chemin réel : qui relit, quel délai, quelle alternative",
    piege: "prendre la date de close CRM pour un process",
  },
  {
    id: "accord-sans-date-nest-pas-accord",
    quand: "oui verbal, « on se reparle », next step sans créneau",
    alors: "une date et une personne dans la pièce, ou ce n’est pas un close",
    piege: "noter un MAP sans exhibit",
  },
  {
    id: "case-verte-sans-source-est-vide",
    quand: "une case CRM cochée, un « ok » d’AE",
    alors: "exiger la phrase, le mail, le nom — sinon vide",
    piege: "auditer le vert comme s’il était tenu",
  },
  {
    id: "coach-dit-la-meme-phrase",
    quand: "l’ops dit exactement ce qu’un champion dirait",
    alors: "tester le risque perso, l’accès EB, la vente en ton absence",
    piege: "taguer Champion parce qu’il est gentil",
  },
  {
    id: "oui-verbal-sans-date-nest-pas-close",
    quand: "ils ont dit oui, ou « on avance »",
    alors: "date + personne, sinon claim",
    piege: "forwarder le deal d’une étape",
  },
  {
    id: "trop-cher-sans-inaction-nest-pas-prix",
    quand: "« trop cher » / silence sur le tarif",
    alors: "l’objection est Metrics vide, pas une punchline",
    piege: "lâcher une remise",
  },
  {
    id: "un-dire-nest-pas-une-preuve",
    quand: "l’AE raconte (« Julien est notre champion »)",
    alors: "ranger en claim, jamais en fait",
    piege: "écrire le debrief comme si c’était tenu",
  },
];

export function reflexeOf(id: string): Reflexe | undefined {
  return REFLEXES.find((r) => r.id === id);
}
