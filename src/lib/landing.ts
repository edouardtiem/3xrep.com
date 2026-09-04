export const MCP_URL =
  process.env.NEXT_PUBLIC_MCP_URL ?? "https://mcp.3xrep.com";

export const PROMPTS = [
  "Debrief my last client call.",
  "What's blocked this week. Challenge.",
  "They said it's too expensive. Which piece isn't held?",
  "Prepare me a QBR for tomorrow.",
] as const;

export const DEBRIEF = {
  prompt: "Debrief the call with Julien.",
  tool: "audit_deal",
  blocks: [
    "Good call, 7/10. Julien is in. The need is real. The file is still an ops deal.",
    "He said: “anyway I'm the one who runs the tool day to day.” You went to rollout. You could have asked: “and when this hits budget, do you still sign, or does it go up?” — Economic Buyer empty, Champion untested.",
    "Before the next one, lock: who signs the budget; the cost of doing nothing (two days lost a month, not in money); the paper process. Without that it dies at signature.",
    "Plan R2\n1. Julien brings the CFO — or names them, and why they wouldn't come.\n2. The two days / month, validated in currency, out loud.\n3. The real path: who rereads the contract, what delay, what alternative is already on the table.",
    "Objective: the CFO is in the room in R2.",
  ],
} as const;
