/** Density for founder X posts. Not live home copy - that is lp-demo / CoworkDemo. */
export const PROMPTS = [
  "Monday. Review my pipe. What's blocked?",
  "Debrief my last client call.",
  "Which close date this month is a claim, not a fact?",
  "They said it's too expensive. Which piece isn't held?",
] as const;

/** What the visitor pastes into the agent. Not page copy. */
export function agentSetupPrompt(url: string, key?: string) {
  const auth = key
    ? `\n\nAuthorization header: Bearer ${key}\nOr append ?key= to the URL if the client cannot send headers.`
    : `\n\nThe connector needs your key (start at https://3xrep.com/start).`;
  const json = key
    ? `{
  "mcpServers": {
    "3xrep": {
      "url": "${url}",
      "headers": { "Authorization": "Bearer ${key}" }
    }
  }
}`
    : `{
  "mcpServers": {
    "3xrep": { "url": "${url}" }
  }
}`;
  return `Add 3xrep as a remote MCP connector next to my CRM (HubSpot, Salesforce, Pipedrive, Attio, or Close) - not instead of it. Nothing to install in the CRM.

Use Claude Cowork or ChatGPT Work on a computer with access to a folder I authorize. After connecting 3xrep, send the first message shown at https://3xrep.com/install so the assistant asks about me and my company, confirms my local folder, and creates the working Markdown files. Then connect my CRM, email and calendar. Do not claim local memory exists until the files are written successfully.

URL: ${url}${auth}

Claude Code:
claude mcp add --transport http 3xrep ${url}${key ? ` --header "Authorization: Bearer ${key}"` : ""}

Cursor - merge this into .cursor/mcp.json:
${json}

Claude Desktop: Connectors → Add custom connector → paste the private URL.
ChatGPT Work desktop: enable developer mode, then Plugins → + → add the MCP server. Select the 3xrep plugin for the first message.

After local setup and source connections, say: Morning. What's today?`;
}

/** Density reference for founder X posts. Not the live home. Do not restore SessionTerminal. */
export const SESSION = {
  prompt: "Monday. Review my pipe. What's blocked?",
  tool: "pipe_review",
  blocks: [
    "9 deals. 4 contradictions. 1 hole that repeats. No percentage.",
    "Acme - “Negotiation” in HubSpot. Nobody who signs has been named. Julien said: “anyway I'm the one who runs the tool day to day.” Usage isn't budget. This stage is illegal.",
    "Bolt - close date Sept 15. No decision process on record. That date is a claim, not a fact.",
    "Cora - last touched 46 days ago. The stage is a memory, not a state.",
    "Repeats on 6 of 9: nobody who signs. One question in every next call: “when this hits budget, do you still sign, or does it go up?”",
    "Dune - no call on record. Not enough to judge. I won't fill the gap.",
    "He remembers the hole, not the call.",
  ],
} as const;

/** Phone: stop at Bolt. Desktop keeps the rest. */
export const SESSION_MOBILE_BLOCK_COUNT = 3;

export function sessionBlocks(compact: boolean) {
  return compact
    ? SESSION.blocks.slice(0, SESSION_MOBILE_BLOCK_COUNT)
    : SESSION.blocks;
}
