import { z } from "zod";
import { admin } from "@/lib/supabase-admin";
import { jsonTool } from "@/lib/mcp-schema";

// Bump when the strategy or feedback contract changes. No commercial text in the registry.
export const FEEDBACK_ENGINE_VERSION = "deal-strategy-2026-09-30";
export const feedbackSchema = z.object({
  output_id: z.uuid().optional(),
  kind: z.enum(["opinion", "action", "outcome", "spontaneous"]),
  useful: z.boolean().optional().describe("Only an explicit user rating, for opinion feedback."),
  question: z.string().max(500).optional().describe("The exact question actually asked; omit for unsolicited feedback."),
  answer: z.string().min(1).max(2000).refine(v => v.trim().length > 0).describe("The user's exact words approved for sharing. Never replace with a summary."),
  shared_context: z.string().max(500).optional().describe("Optional short excerpt or description the user explicitly agrees to share. No customer names, emails or transcripts."),
  category: z.enum(["missing_context", "unrealistic_advice", "wording", "error", "technical", "other"]).optional(),
}).superRefine((v, ctx) => {
  if (v.kind !== "spontaneous" && !v.output_id) ctx.addIssue({ code: "custom", path: ["output_id"], message: "A result is required for this feedback." });
  if (v.kind !== "opinion" && v.useful !== undefined) ctx.addIssue({ code: "custom", path: ["useful"], message: "A rating belongs only to an opinion." });
});

export function feedbackInvitation(tool: string) {
  const question = tool === "objection_map"
    ? "Could you say this to your buyer, or does it not sound like you?"
    : tool === "plan_horizon"
      ? "Does this plan fit your priorities? What is missing?"
      : tool === "pipe_review"
        ? "Are these next steps feasible for your team? What is missing?"
        : "Is this next step feasible in your deal? What is missing?";
  return {
    tool: "share_feedback",
    ask_now: true,
    question,
    instruction: "After delivering the complete help, ask ONE short optional question in the user's language. Do not interrupt urgent work. No reminder if ignored. This is an invitation, not proof the question was shown. Before saving, show the exact text to be shared and explain it is sent to 3xrep for up to 180 days. Explicit 'send this to 3xrep' authorizes that text; otherwise ask whether to share. Never infer usefulness from silence or from the generated result.",
  };
}

export async function prepareFeedbackOutput(orgId: string, outputId: string, tool: string) {
  const db = admin();
  if (!db) throw new Error("Feedback database unavailable");
  const { data, error } = await db.rpc("prepare_feedback_output", {
    p_org: orgId, p_output: outputId, p_tool: tool, p_version: FEEDBACK_ENGINE_VERSION,
  });
  if (error) throw new Error("Feedback invitation unavailable");
  return data === true ? feedbackInvitation(tool) : { tool: "share_feedback", ask_now: false };
}

export async function saveFeedback(input: z.infer<typeof feedbackSchema>, orgId: string | undefined) {
  if (!orgId || orgId === "dev") return jsonTool({ refus: "A workspace key is required." });
  const db = admin();
  if (!db) throw new Error("Feedback unavailable");
  if (input.output_id) {
    const { data: event, error } = await db.from("beta_events").select("id,tool,created_at")
      .eq("id", input.output_id).eq("org_id", orgId).eq("kind", "meaningful_output").maybeSingle();
    if (error) throw new Error("Feedback result lookup unavailable");
    if (!event) return jsonTool({ refus: "This result does not belong to your workspace." });
    // Legacy results remain eligible, but their engine version must not be invented.
    const { error: registryError } = await db.from("feedback_outputs").upsert({
      output_id: event.id, org_id: orgId, tool: event.tool, engine_version: "legacy-unknown", created_at: event.created_at,
    }, { onConflict: "output_id", ignoreDuplicates: true });
    if (registryError) throw new Error("Feedback context unavailable");
  }
  const row = {
    org_id: orgId, output_id: input.output_id ?? null, kind: input.kind,
    useful: input.useful ?? null, question: input.question ?? null, answer: input.answer,
    shared_context: input.shared_context ?? null, category: input.category ?? null,
    updated_at: new Date().toISOString(), status: "new",
  };
  // One current response per result and kind; a later outcome cannot overwrite the opinion.
  const query = input.output_id
    ? db.from("user_feedback").upsert(row, { onConflict: "org_id,output_id,kind" })
    : db.from("user_feedback").insert(row);
  const { data, error } = await query.select("id,expires_at").single();
  if (error) throw new Error("Feedback could not be saved");
  return jsonTool({ ok: true, feedback_id: data.id, expires_at: data.expires_at, message: "Your feedback was sent to 3xrep. Thank you." });
}
