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
import { CYCLE_AUDIT_PROMPT, CUTOFF_NO_KEY, MCP_INSTRUCTIONS } from "@/lib/copy";
import { withGate } from "@/lib/mcp-gate";
import { runWithMcpRequest } from "@/lib/mcp-log";
import { dealSchema, jsonTool, pipeSchema } from "@/lib/mcp-schema";
import { setProfile } from "@/lib/profile";
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
      withGate("methode_lookup", async ({ q }) => jsonTool(methodeLookup(q))),
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
      withGate("rattacher", async ({ phrase }) => jsonTool(rattacher(phrase))),
    );

    server.registerTool(
      "audit_deal",
      {
        title: "Audit deal",
        description:
          "Use when they talk about ONE deal, a call, or a CRM file. 8 stages on THIS deal (frame → render). Input = CRM artefacts. JSON out: pieces, death, climb-back, one move, contract, souvenir, CRM corrections. Paste this JSON; don't write another verdict. geste=debrief-apres-call (default) or passe-trous. If refus is set: say it, don't fill the gap. Several deals, the pipe, a forecast, a stage: pipe_review. Write in the user's language, or the prompt's. Forbidden: close probability, write_to_crm.",
        inputSchema: dealSchema,
      },
      withGate("audit_deal", async (deal) => jsonTool(scoreDeal(deal))),
    );

    server.registerTool(
      "pipe_review",
      {
        title: "Pipe review",
        description:
          "Use when they talk about the pipeline, several deals, Monday, the forecast, a stage, a close date, what's blocked, or a monthly cycle / process audit. Read the deals through their CRM MCP and pass what the CRM claims (etape, closeDate, derniereModif, crm_id) with the artefacts (notes, mails, transcript). JSON out, per deal: what kills it first, one move, and the contradictions — plus the hole that repeats, one process change, written sum of broken doors, souvenir, CRM corrections. Deals without artefacts come back as refus. Paste this JSON. Forbidden: probability, coverage × win rate, conversion rate, forecast in euros, ranking reps, write_to_crm.",
        inputSchema: pipeSchema,
      },
      withGate("pipe_review", async ({ deals }) => jsonTool(pipeReview(deals))),
    );

    server.registerTool(
      "next_question",
      {
        title: "Next question",
        description:
          "Use when they ask what to ask next on a deal. Stops at stage 7: the move that costs on THIS deal. Same input as audit_deal. Write in the user's language, or the prompt's.",
        inputSchema: dealSchema,
      },
      withGate("next_question", async (deal) => jsonTool(nextQuestion(deal))),
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
      withGate("objection_map", async ({ objection, ...deal }) =>
        jsonTool(objectionMap({ ...deal, objection })),
      ),
    );

    server.registerTool(
      "set_org_profile",
      {
        title: "Set org profile",
        description:
          "Once, at first connection. Title, mission (rep / manager / VP sales / other), their company URL — not a prospect URL. Stores a short blurb of what they sell.",
        inputSchema: z.object({
          title: z.string().describe("Job title"),
          mission: z
            .string()
            .describe("rep / manager / VP sales / other (commercial / manager / directeur commercial / autre)"),
          company_url: z.string().describe("URL of THEIR company site"),
        }),
      },
      withGate("set_org_profile", async (args, org) => {
        if (!org) return jsonTool({ refus: CUTOFF_NO_KEY });
        try {
          const profile = await setProfile(org, args);
          return jsonTool({ ok: true, ...profile });
        } catch (err) {
          return jsonTool({
            ok: false,
            refus: err instanceof Error ? err.message : "profil",
          });
        }
      }),
    );

    server.registerPrompt(
      "cycle_audit",
      {
        title: "Monthly cycle audit",
        description:
          "Once a month: audit the whole sales cycle. Read every open deal through their CRM MCP, call pipe_review, then propose one process change (mandatory question, a stage to gate or drop, a reflex to train). No conversion percentage.",
      },
      () => ({
        messages: [
          {
            role: "user" as const,
            content: { type: "text" as const, text: CYCLE_AUDIT_PROMPT },
          },
        ],
      }),
    );
  },
  {
    serverInfo: { name: "3xrep", version: "0.3.0" },
    instructions: MCP_INSTRUCTIONS,
  },
);

async function gate(req: Request): Promise<Response> {
  if (!rateLimit(clientIp(req))) {
    return new Response(JSON.stringify({ error: "rate_limit" }), { status: 429 });
  }
  return runWithMcpRequest(req, () => handler(req));
}

export { gate as GET, gate as POST, gate as DELETE };
