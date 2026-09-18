import { admin } from "@/lib/supabase-admin";
import { trialExtras } from "@/lib/access";
import { createMcpHandler } from "mcp-handler";
import { z } from "zod";
import {
  methodeLookup,
  nextQuestion,
  objectionMap,
  pipeReview,
  planHorizon,
  rattacher,
  scoreDeal,
} from "@/lib/brain";
import { CYCLE_AUDIT_PROMPT, CUTOFF_NO_KEY, MCP_INSTRUCTIONS, MORNING_PROMPT } from "@/lib/copy";
import { withGate } from "@/lib/mcp-gate";
import { runWithMcpRequest } from "@/lib/mcp-log";
import { dealSchema, horizonSchema, jsonTool, pipeSchema, salesContextSchema } from "@/lib/mcp-schema";
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
          "Use when they talk about ONE deal, a call, or a CRM file. JSON out includes action (quoi, pourquoi, methods) plus pieces, death, climb-back, five-block contract, souvenir, CRM corrections. Speak action — don't invent a second verdict. geste=debrief-apres-call (default) or passe-trous. If refus is set: say it, don't fill the gap. Several deals: pipe_review. Write in the user's language. Forbidden: close probability, write_to_crm, invented objection.",
        inputSchema: dealSchema,
      },
      withGate("audit_deal", async (deal) => jsonTool(scoreDeal(deal))),
    );

    server.registerTool(
      "pipe_review",
      {
        title: "Pipe review",
        description:
          "Use when they talk about the pipeline, several deals, Monday, the forecast, a stage, a close date, what's blocked, or a monthly cycle / process audit. Read the deals through their CRM MCP and pass what the CRM claims (etape, closeDate, derniereModif, crm_id) with the artefacts. JSON out: lundi (four written sums, this month, the rest, solid/fragile, one rule) plus per-deal action. Speak lundi, don't dump a lab report. Forbidden: probability, coverage × win rate, conversion rate, forecast in euros, signature théorique, ranking reps, write_to_crm.",
        inputSchema: pipeSchema,
      },
      withGate("pipe_review", async ({ deals }) => jsonTool(pipeReview(deals))),
    );

    server.registerTool(
      "plan_horizon",
      {
        title: "Plan horizon",
        description:
          "Use in the morning, or for the next 7 / 30 days. The host assistant already read Gmail, Calendar, and the CRM — pass those items. fenetre=1 today, 7 this week, 30 this month. JSON out: agenda (heure, action, trou, draft constraints, CRM corrections), hors_fenetre to defer. Speak agenda — don't invent a second verdict. If draft.ecrire is false, don't write the mail. Forbidden: close probability, write_to_crm, invented quotes, a marketing body. Without Gmail/Calendar: still pass CRM deals; speak demande. pipe_review stays for Monday / the cycle.",
        inputSchema: horizonSchema,
      },
      withGate("plan_horizon", async (input) =>
        jsonTool(planHorizon(input)),
      ),
    );

    server.registerTool(
      "next_question",
      {
        title: "Next question",
        description:
          "Use when they ask what to ask next on a deal. Returns action: the question, why (methods), who must be in the room. If the file says send the contract and the signer isn't held: don't send. Same input as audit_deal. Write in the user's language.",
        inputSchema: dealSchema,
      },
      withGate("next_question", async (deal) => jsonTool(nextQuestion(deal))),
    );

    server.registerTool(
      "objection_map",
      {
        title: "Objection map",
        description:
          "Use when they quote an objection (price, timing, competitor, 'I need to talk internally'). Objection → unheld piece → CRAC in the next meeting — not a punchline email. If they didn't paste the sentence, ask; don't invent. Write in the user's language.",
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
          contexte: salesContextSchema.optional(),
          company_blurb: z.string().max(500).optional().describe("User-corrected company description, when supplied."),
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

    server.registerTool("workspace_status", {
      title: "Workspace status",
      description: "Show the organization's beta or Founding base-plan entitlement. No individual user tracking.",
      inputSchema: z.object({}),
    }, withGate("workspace_status", async (_args, org) => {
      if (!org) return jsonTool({ refus: CUTOFF_NO_KEY });
      const db = admin();
      const { data, error } = db && org.id !== "dev" ? await db.from("founding_slots").select("slot").eq("org_id",org.id).maybeSingle() : {data:null,error:null};
      if (error) throw new Error("Workspace status unavailable");
      return jsonTool({ ...trialExtras(org), founding_status:org.founding_state, slot:data?.slot ?? null,
        message:org.founding_state === "founding" ? `Founding Workspace #${String(data?.slot).padStart(2,"0")}. Base plan free forever.` : "Founding places are awarded manually after meaningful use. Signup does not reserve a place." });
    }));
    server.registerTool("beta_feedback", {
      title: "Share feedback",
      description: "Save the user's own feedback on a 3xrep result, only after they agree. Use output_id from that result. Do not include customer names or deal content. Never infer a rating.",
      inputSchema:z.object({output_id:z.uuid(),useful:z.boolean(),comment:z.string().max(1000).optional()}),
    }, withGate("beta_feedback",async (input,org) => {
      if (!org || org.id === "dev") return jsonTool({refus:"A workspace key is required."});
      const db=admin();
      if (!db) throw new Error("Feedback unavailable");
      const {data:event,error:readError}=await db.from("beta_events").select("id").eq("id",input.output_id).eq("org_id",org.id).eq("kind","meaningful_output").maybeSingle();
      if(readError || !event) return jsonTool({refus:"This result does not belong to your workspace."});
      const {error}=await db.from("beta_feedback").upsert({org_id:org.id,output_id:input.output_id,useful:input.useful,comment:input.comment ?? null},{onConflict:"org_id,output_id"});
      if(error) throw new Error("Feedback could not be saved");
      return jsonTool({ok:true,message:"Feedback saved. Thank you."});
    }));

    server.registerPrompt(
      "morning",
      {
        title: "This morning",
        description:
          "Today: read Gmail, Calendar, and the CRM through the user's available connectors, call plan_horizon fenetre=1, speak the agenda. day.md is theirs. No write_to_crm.",
      },
      () => ({
        messages: [
          {
            role: "user" as const,
            content: { type: "text" as const, text: MORNING_PROMPT },
          },
        ],
      }),
    );

    server.registerPrompt(
      "cycle_audit",
      {
        title: "Monthly cycle audit",
        description:
          "Once a month: audit the whole sales cycle. Read every open deal through their CRM MCP, call pipe_review, speak the Monday page plus one house rule. No conversion percentage.",
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
