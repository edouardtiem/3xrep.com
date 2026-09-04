import { z } from "zod";

export const dealSchema = z.object({
  etape: z.string().optional(),
  montant: z.number().optional(),
  notes: z.string().optional(),
  mails: z.string().optional(),
  meetings: z.string().optional(),
  transcript: z.string().optional(),
  nextStep: z.string().optional(),
  geste: z.enum(["debrief-apres-call", "passe-trous", "pipe-review"]).optional(),
  evidence: z.enum(["transcript", "notes", "emails", "chat_paste"]).optional(),
});

/** What the CRM claims about a deal, plus its artefacts. */
export const pipeDealSchema = dealSchema.extend({
  nom: z.string().optional().describe("Deal name as in the CRM."),
  closeDate: z.string().optional().describe("CRM close date, as written."),
  derniereModif: z.string().optional().describe("Last modified date in the CRM (ISO)."),
});

export const pipeSchema = z.object({
  deals: z.array(pipeDealSchema).min(1).max(40),
});

export function jsonTool(data: unknown) {
  return {
    content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }],
  };
}
