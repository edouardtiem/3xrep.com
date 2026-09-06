import { z } from "zod";

export const exhibitSchema = z.object({
  source: z
    .enum(["transcript", "meeting", "mail", "note", "crm"])
    .describe(
      "Where the line comes from. transcript / meeting / mail = a real source. note = AE note (never held). crm = a CRM field.",
    ),
  auteur: z
    .enum(["prospect", "rep", "crm", "inconnu"])
    .describe(
      "Who said it. prospect = the buyer. rep = the AE. Never tag an AE note as prospect unless the line is a quote attributed to the buyer.",
    ),
  nom: z.string().optional().describe("Speaker name if known."),
  titre: z
    .string()
    .optional()
    .describe("Speaker title if known (CFO, manager…). A title is never proof."),
  date: z.string().optional().describe("When it was said, if known."),
  citation: z
    .string()
    .describe(
      "Exact quote in the original language. If you also pass transcript / notes / mails, this string must appear literally there.",
    ),
  piece: z
    .enum([
      "qui-tranche",
      "champion-vs-coach",
      "enjeu-chiffre",
      "besoin",
      "budget",
      "process-papier",
      "concurrents",
    ])
    .optional()
    .describe("Which hole this line speaks to."),
  sens: z
    .enum(["affirme", "nie"])
    .optional()
    .describe(
      "affirme = they claim this piece is held. nie = they deny it (e.g. 'the CFO doesn't sign').",
    ),
  test_pose: z
    .boolean()
    .optional()
    .describe("Did the AE ask the closing question for this piece?"),
  reponse: z
    .string()
    .optional()
    .describe("The buyer's answer to that closing question, exact words."),
});

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
  exhibits: z
    .array(exhibitSchema)
    .optional()
    .describe(
      "Extracted exhibits. Prefer this over dumping raw text. One exhibit per line that matters: who spoke, where, when, exact quote, piece, affirme/nie, whether the closing question was asked.",
    ),
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
