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

export const PAID_TOOLS = ["audit_deal", "next_question", "objection_map"] as const;

export function jsonTool(data: unknown) {
  return {
    content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }],
  };
}

export async function paidToolName(req: Request): Promise<string | null> {
  if (req.method !== "POST") return null;
  const body: unknown = await req.clone().json().catch(() => null);
  if (!body || typeof body !== "object") return null;
  const rec = body as { method?: unknown; params?: { name?: unknown } };
  if (rec.method !== "tools/call") return null;
  const name = rec.params?.name;
  if (typeof name !== "string") return null;
  return (PAID_TOOLS as readonly string[]).includes(name) ? name : null;
}
