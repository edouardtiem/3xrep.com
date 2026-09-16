import { z } from "zod";

export const salesContextSchema = z.object({
  cycle: z.enum(["court", "moyen", "long"]).optional(),
  interlocuteurs: z.number().int().nonnegative().optional(),
  comite: z.boolean().optional(), papier: z.boolean().optional(), concurrence: z.boolean().optional(),
  probleme_reconnu: z.boolean().optional(),
  moment: z.enum(["qualification", "decouverte", "demo", "objection", "negociation", "signature"]).optional(),
  entreprise: z.string().max(1000).optional(),
}).describe("Declared context, not evidence. Deal values override the organisation's usual cycle. Omit unknown values.");

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
      "echeance", "criteres-achat", "process-decision", "process-papier",
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
  question: z.string().optional().describe("Exact question asked, present in the source before the answer. Required to hold a piece; a boolean alone is insufficient."),
  source_id: z.string().optional().describe("ID of the source document supplied in sources. Type must match."),
  reponse: z
    .string()
    .optional()
    .describe("The buyer's answer to that closing question, exact words."),
});

export const dealSchema = z.object({
  contexte: salesContextSchema.optional(),
  sources: z.array(z.object({ id: z.string().min(1), type: z.enum(["transcript", "meeting", "mail", "note", "crm"]), texte: z.string(), date: z.string().optional() })).max(100).optional()
    .describe("Original source passages with speaker attribution, including the question and answer. No source means no verified proof."),
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
      "Extracted exhibits together with original source passages. Never send unsupported exhibits. One exhibit per line that matters: who spoke, where, when, exact quote, piece, affirme/nie, whether the closing question was asked.",
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
  quand: z.iso
    .datetime({ offset: true })
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
  maintenant: z.iso
    .datetime({ offset: true })
    .describe("User's local now, ISO with offset. Example: 2026-09-16T08:00:00+02:00."),
  sources_lues: z.object({
    crm: z.enum(["disponible", "absent", "interdit", "erreur"]).optional(),
    gmail: z.enum(["disponible", "absent", "interdit", "erreur"]).optional(),
    calendar: z.enum(["disponible", "absent", "interdit", "erreur"]).optional(),
  }).optional().describe("Actual connector access. Available with zero results is still disponible."),
  fuseau: z.string().optional().describe("IANA time zone, e.g. Europe/Paris, for daylight-saving changes."),
  items: z
    .array(horizonItemSchema)
    .max(80)
    .describe("What the assistant already read in Gmail, Calendar, and the CRM. 3xrep does not fetch."),
});

export function jsonTool(data: unknown) {
  return {
    content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }],
  };
}
