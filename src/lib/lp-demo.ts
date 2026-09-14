export type DemoMode = "alone" | "with";

export type DemoDeal = readonly [name: string, stage: string, note: string];

export type DemoThread = {
  id: string;
  label: string;
  question: string;
  hubAction: string;
  hubSummary: string;
  deals: readonly DemoDeal[];
  brainAction: string;
  brainSummary: string;
  with: readonly string[];
  withPunch: string;
  alone: readonly string[];
  alonePunch: string;
};

export const LP_THREADS: readonly DemoThread[] = [
  {
    id: "monday",
    label: "What's stuck this week?",
    question: "Monday. What's stuck this week?",
    hubAction: "search deals",
    hubSummary: "9 open deals",
    deals: [
      ["Acme", "Negotiation", "Close Sept 15"],
      ["Bolt", "Negotiation", "Close Sept 15"],
      ["Cora", "Proposal", "Last touch 46d"],
    ],
    brainAction: "review deals",
    brainSummary: "9 deals. 4 files that don't match the calls. What's missing shows up again.",
    with: [
      "Acme — “Negotiation.” Nobody who signs. Julien runs the tool day to day. This isn't negotiation.",
      "Bolt — close Sept 15. No decision process. That date is a guess.",
      "Cora — 46 days untouched. HubSpot still says proposal. Nobody has touched it.",
    ],
    withPunch: "He remembers what's missing, not the call.",
    alone: [
      "You're in good shape for Monday. Acme and Bolt are in negotiation. Cora is in proposal — might just need a nudge.",
    ],
    alonePunch: "Nothing looks blocked.",
  },
  {
    id: "debrief",
    label: "Debrief last call",
    question: "Debrief my last client call.",
    hubAction: "read last meeting",
    hubSummary: "Acme · 12 Sept · 41 min",
    deals: [
      ["Acme", "Negotiation", "Meeting 12 Sept"],
      ["Julien", "Ops lead", "On the call"],
      ["Quote", "Not sent", "Task: today"],
    ],
    brainAction: "debrief call",
    brainSummary: "The file and the call don't match. Who signs wasn't in the room.",
    with: [
      "Julien said he runs the tool day to day. That is not who signs.",
      "HubSpot says Negotiation. The call never named a budget or a date on their side.",
      "Don't send the quote. Book the person who signs, or this file stays a demo.",
    ],
    withPunch: "He remembers what's missing, not the call.",
    alone: [
      "Solid call. Julien was engaged. Next step: send the quote today while it's warm.",
    ],
    alonePunch: "Looks like a real negotiation.",
  },
  {
    id: "dates",
    label: "Close dates",
    question: "Which close date this month is just a guess?",
    hubAction: "search close dates",
    hubSummary: "4 deals closing in September",
    deals: [
      ["Bolt", "Negotiation", "Close Sept 15"],
      ["Acme", "Negotiation", "Close Sept 20"],
      ["Nadir", "Proposal", "Close Sept 28"],
    ],
    brainAction: "check close dates",
    brainSummary: "Two close dates with no process behind them.",
    with: [
      "Bolt — Sept 15. No process on record. That date is a guess.",
      "Acme — Sept 20. Same: nobody who signs, no next meeting on their calendar.",
      "Nadir — Sept 28. Last paper is your proposal. Their date isn't in the file.",
    ],
    withPunch: "A close date with no process is a guess.",
    alone: [
      "Four deals are dated this month. Bolt is closest — Sept 15 — then Acme and Nadir. Worth a push this week.",
    ],
    alonePunch: "The calendar looks full.",
  },
  {
    id: "price",
    label: "Too expensive",
    question: "They said it's too expensive. What's missing?",
    hubAction: "read deal notes",
    hubSummary: "Acme · $48k · Negotiation",
    deals: [
      ["Acme", "Negotiation", "Amount $48,000"],
      ["Note", "12 Sept", "Too expensive vs in-house"],
    ],
    brainAction: "read the objection",
    brainSummary: "They named a price. Not what waiting costs them.",
    with: [
      "They compared you to in-house. The file has no number they said for what in-house costs, or what waiting costs.",
      "A discount answers a price. It doesn't answer what's missing.",
      "Next call: get the figure they use for doing nothing. Then the $48k means something.",
    ],
    withPunch: "Don't send a new number until theirs is on the record.",
    alone: [
      "Classic price pushback. Send the ROI one-pager and offer a 10% first-year discount if they sign this month.",
    ],
    alonePunch: "Keep it moving.",
  },
];
