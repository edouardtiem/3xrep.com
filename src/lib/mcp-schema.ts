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
  crm_id: z.string().optional().describe("CRM opportunity id. Stable. Prefer this over the name."),
  nom: z.string().optional(),
  denouement: z
    .enum(["gagne", "perdu", "ouvert"])
    .optional()
    .describe("Won / lost / still open — only if they know. Never invent."),
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

export const horizonItemSchema = z.object({
  kind: z
    .enum(["rdv", "tache", "mail", "affaire"])
    .describe("Calendar hold, CRM task, mail, or a deal with no slot."),
  quand: z
    .string()
    .optional()
    .describe("Start of the meeting or due date. ISO with the user's offset."),
  titre: z.string().optional().describe("Event or mail subject."),
  deal: pipeDealSchema,
  mail: z
    .object({
      sens: z.enum(["entrant", "sortant"]).describe("entrant = they wrote. sortant = we wrote."),
      extrait: z.string().optional().describe("Short excerpt. Not a dump."),
      destinataire: z.string().optional(),
    })
    .optional(),
});

export const horizonSchema = z.object({
  fenetre: z
    .union([z.literal(1), z.literal(7), z.literal(30)])
    .describe("1 = today. 7 = this week. 30 = this month. Same brain."),
  maintenant: z
    .string()
    .describe("User's local now, ISO with offset. Example: 2026-09-16T08:00:00+02:00."),
  items: z
    .array(horizonItemSchema)
    .min(1)
    .max(80)
    .describe("What Claude already read in Gmail, Calendar, and the CRM. 3xrep does not fetch."),
});

export function jsonTool(data: unknown) {
  return {
    content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }],
  };
}
