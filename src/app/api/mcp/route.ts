import { createMcpHandler } from "mcp-handler";
import { z } from "zod";
import {
  methodeLookup,
  nextQuestion,
  objectionMap,
  pipeReview,
  rattacher,
  scoreDeal,
} from "@/lib/brain";
import { MCP_INSTRUCTIONS } from "@/lib/copy";
import { dealSchema, jsonTool, pipeSchema } from "@/lib/mcp-schema";
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
          "Use when they talk about ONE deal, a call, or a CRM file. 8 stages on THIS deal (frame → render). Input = CRM artefacts. JSON out: pieces, death, climb-back, one move, contract. Paste this JSON; don't write another verdict. geste=debrief-apres-call (default) or passe-trous. If refus is set: say it, don't fill the gap. Several deals, the pipe, a forecast, a stage: pipe_review. Write in the user's language, or the prompt's. Forbidden: close probability, write_to_crm.",
        inputSchema: dealSchema,
      },
      async (deal) => jsonTool(scoreDeal(deal)),
    );

    server.registerTool(
      "pipe_review",
      {
        title: "Pipe review",
        description:
          "Use when they talk about the pipeline, several deals, Monday, the forecast, a stage, a close date, or ask what's blocked. Read the deals through their CRM MCP and pass what the CRM claims (etape, closeDate, derniereModif) with the artefacts (notes, mails, transcript). JSON out, per deal: what kills it first, one move, and the contradictions — etape_illegale (stage vs proven pieces), date_sans_exhibit (close date as a claim), fiche_figee (stale record) — plus the hole that repeats across deals. Deals without artefacts come back as refus. Paste this JSON. Forbidden: probability, coverage × win rate, forecast in euros, ranking reps, write_to_crm.",
        inputSchema: pipeSchema,
      },
      async ({ deals }) => jsonTool(pipeReview(deals)),
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
    serverInfo: { name: "3xrep", version: "0.2.0" },
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
