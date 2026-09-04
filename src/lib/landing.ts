export const PROMPTS = [
  "Monday. Review my pipe. What's blocked?",
  "Debrief my last client call.",
  "Which close date this month is a claim, not a fact?",
  "They said it's too expensive. Which piece isn't held?",
] as const;

/** The proof window. One pass, then it stops. */
export const SESSION = {
  prompt: "Monday. Review my pipe. What's blocked?",
  tool: "pipe_review",
  blocks: [
    "9 deals. 4 contradictions. 1 hole that repeats. No percentage.",
    "Acme — “Negotiation” in HubSpot. Nobody who signs has been named. Julien said: “anyway I'm the one who runs the tool day to day.” Usage isn't budget. This stage is illegal.",
    "Bolt — close date Sept 15. No decision process on record. That date is a claim, not a fact.",
    "Cora — last touched 46 days ago. The stage is a memory, not a state.",
    "Repeats on 6 of 9: nobody who signs. One question in every next call: “when this hits budget, do you still sign, or does it go up?”",
    "Dune — no call on record. Not enough to judge. I won't fill the gap.",
  ],
} as const;
