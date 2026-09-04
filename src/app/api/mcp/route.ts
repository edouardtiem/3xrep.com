import { createMcpHandler } from "mcp-handler";
import { z } from "zod";
import { methodeLookup, nextQuestion, objectionMap, rattacher, scoreDeal } from "@/lib/brain";
import { MCP_INSTRUCTIONS } from "@/lib/copy";
import { dealSchema, jsonTool } from "@/lib/mcp-schema";
import { clientIp, rateLimit } from "@/lib/rate-limit";

const handler = createMcpHandler(
  (server) => {
    server.registerTool(
      "methode_lookup",
      {
        title: "Method lookup",
        description:
          "Use when they ask what a method, letter, or notion is (MEDDIC, Authority, CRAC…). Lexicon only — not a deal. If they have a CRM file, call audit_deal.",
        inputSchema: z.object({
          q: z.string().describe("Method or part name (MEDDIC, Authority, CRAC…)"),
        }),
      },
      async ({ q }) => jsonTool(methodeLookup(q)),
    );

    server.registerTool(
      "rattacher",
      {
        title: "Map a sentence",
        description:
          "Use when they paste one sentence from a call. Maps it to a method + part. One sentence, not a deal. Beyond that, refuse. To name what's missing on THEIR deal: audit_deal.",
        inputSchema: z.object({
          phrase: z.string().describe("One sentence, max 280 characters, no newlines."),
        }),
      },
      async ({ phrase }) => jsonTool(rattacher(phrase)),
    );

    server.registerTool(
      "audit_deal",
      {
        title: "Audit deal",
        description:
          "Use when they talk about a deal, a call, a pipeline, or a CRM file. 8 stages on THIS deal (frame → render). Input = CRM artefacts. JSON out: pieces, death, climb-back, one move, contract. Paste this JSON; don't write another verdict. geste=debrief-apres-call (default) or passe-trous. Write in the user's language, or the prompt's. Forbidden: close probability, write_to_crm.",
        inputSchema: dealSchema,
      },
      async (deal) => jsonTool(scoreDeal(deal)),
    );

    server.registerTool(
      "next_question",
      {
        title: "Next question",
        description:
          "Use when they ask what to ask next on a deal. Stops at stage 7: the move that costs on THIS deal. Same input as audit_deal. Write in the user's language, or the prompt's.",
        inputSchema: dealSchema,
      },
      async (deal) => jsonTool(nextQuestion(deal)),
    );

    server.registerTool(
      "objection_map",
      {
        title: "Objection map",
        description:
          "Use when they quote an objection (price, timing, competitor). Objection → unheld piece → CRAC. Not a punchline. Write in the user's language, or the prompt's.",
        inputSchema: dealSchema.extend({
          objection: z.string().describe("The objection as heard, one sentence."),
        }),
      },
      async ({ objection, ...deal }) => jsonTool(objectionMap({ ...deal, objection })),
    );
  },
  {
    serverInfo: { name: "3xrep", version: "0.1.0" },
    instructions: MCP_INSTRUCTIONS,
  },
);

async function gate(req: Request): Promise<Response> {
  if (!rateLimit(clientIp(req))) {
    return new Response(JSON.stringify({ error: "rate_limit" }), { status: 429 });
  }
  return handler(req);
}

export { gate as GET, gate as POST, gate as DELETE };
