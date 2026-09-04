import { z } from "zod";

export const dealSchema = z.object({
  etape: z.string().optional(),
  montant: z.number().optional(),
  notes: z.string().optional(),
  mails: z.string().optional(),
  meetings: z.string().optional(),
  transcript: z.string().optional(),
  nextStep: z.string().optional(),
  geste: z.enum(["debrief-apres-call", "passe-trous"]).optional(),
  evidence: z.enum(["transcript", "notes", "emails", "chat_paste"]).optional(),
});

export function jsonTool(data: unknown) {
  return {
    content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }],
  };
}
