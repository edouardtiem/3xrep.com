import type { ContratRendu } from "./types";

export const CONTRAT: ContratRendu = {
  langue: "user, else prompt",
  blocs: [
    {
      id: "call",
      job: "The call, not the person. Describe what the supplied call establishes. No /10: the server has no validated rating rubric. Never invent a score.",
    },
    {
      id: "rate",
      job: "The miss, glued to a line they said (they said Y, you skipped X). Quote the transcript. Otherwise stay quiet - that's a lecture.",
    },
    {
      id: "verrous",
      job: "Three locks before the next meeting, because on THIS deal that's where signature dies. Not fifteen. Not 'in your industry'.",
    },
    {
      id: "plan",
      job: "Plan for the next meeting ON THEIR calendar. 1. 2. 3. Sales moves, not homework (no recap, no slides, no 'send the contract'). Name the method parts the tool returned.",
    },
    {
      id: "objectif",
      job: "One sentence. A named person + a date on THEIR calendar (e.g. the signer is in the room). Not 'move the deal'. If the CRM next step is homework, say it doesn't count and replace it with a slot.",
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
    "homework instead of a meeting",
    "invented objection",
    "+20 XP",
    "wrong answer it was MEDDIC",
  ],
};
