import type { ContratRendu } from "./types";

export const CONTRAT: ContratRendu = {
  langue: "user, else prompt",
  blocs: [
    {
      id: "call",
      job: "The call, not the person. A /10 on the discovery (rapport vs file), not an HR score, not a close probability.",
    },
    {
      id: "rate",
      job: "The miss, glued to a line they said (they said Y, you skipped X). Quote the transcript. Otherwise stay quiet — that's a lecture.",
    },
    {
      id: "verrous",
      job: "Three locks before the next meeting, because on THIS deal that's where signature dies. Not fifteen. Not 'in your industry'.",
    },
    {
      id: "plan",
      job: "Plan for the next call. 1. 2. 3. Short enough to fit in a meeting.",
    },
    {
      id: "objectif",
      job: "One sentence. The move that costs (e.g. the CFO is in the room in R2). Not 'move the deal'.",
    },
  ],
  interdits: [
    "HR score on the rep",
    "close probability",
    "you close Friday",
    "letter checklist",
    "in your industry we often see… without citing this call",
    "12-point plan",
    "vague objective",
    "+20 XP",
    "wrong answer it was MEDDIC",
  ],
};
