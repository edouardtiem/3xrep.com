/** Full sheet: `/brand/mascot-sheet.png`. Poses: `/brand/mascot/<id>.png`. */
export const MASCOT_SHEET = "/brand/mascot-sheet.png";

export const MASCOT_SRC = {
  curieux: "/brand/mascot/curieux.png",
  sceptique: "/brand/mascot/sceptique.png",
  reflechit: "/brand/mascot/reflechit.png",
  dubitatif: "/brand/mascot/dubitatif.png",
  note: "/brand/mascot/note.png",
  analyse: "/brand/mascot/analyse.png",
  travaille: "/brand/mascot/travaille.png",
  planifie: "/brand/mascot/planifie.png",
  cafe: "/brand/mascot/cafe.png",
  hmm: "/brand/mascot/hmm.png",
  souligne: "/brand/mascot/souligne.png",
  no: "/brand/mascot/no.png",
  next_step: "/brand/mascot/next_step.png",
  journee: "/brand/mascot/journee.png",
  casquette: "/brand/mascot/casquette.png",
  discret: "/brand/mascot/discret.png",
} as const;

export type MascotPose = keyof typeof MASCOT_SRC;

export function mascotSrc(pose: MascotPose): string {
  return MASCOT_SRC[pose];
}
