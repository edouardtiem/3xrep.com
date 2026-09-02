export type AngleRule = {
  id: string;
  etage: number[];
  si_viole: string;
};

export const ANGLE: AngleRule[] = [
  { id: "un-dire-nest-pas-une-preuve", etage: [4, 7], si_viole: "degrade en suppose" },
  { id: "case-verte-sans-source", etage: [4], si_viole: "vide" },
  { id: "jamais-verbatim-absent", etage: [8], si_viole: "strip replique" },
  { id: "jamais-proba", etage: [8], si_viole: "strip" },
  { id: "un-seul-objectif", etage: [8], si_viole: "strip le second" },
  { id: "note-le-call-pas-la-personne", etage: [8], si_viole: "strip" },
];
