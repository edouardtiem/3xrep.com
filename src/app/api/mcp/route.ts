import { createMcpHandler } from "mcp-handler";
import { z } from "zod";
import { methodeLookup, nextQuestion, objectionMap, rattacher, scoreDeal } from "@/lib/brain";
import { dealSchema, jsonTool, paidToolName } from "@/lib/mcp-schema";
import { orgFromRequest } from "@/lib/orgs";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { checkoutUrl } from "@/lib/site";

const handler = createMcpHandler(
  (server) => {
    server.registerTool(
      "methode_lookup",
      {
        title: "Lookup méthode",
        description:
          "Lexique 3xrep. Gratuit. Une méthode, une lettre, une notion — pas un deal. Si tu as le dossier CRM, appelle audit_deal.",
        inputSchema: z.object({
          q: z.string().describe("Nom de méthode ou de partie (MEDDIC, Authority, CRAC…)"),
        }),
      },
      async ({ q }) => jsonTool(methodeLookup(q)),
    );

    server.registerTool(
      "rattacher",
      {
        title: "Rattacher une phrase",
        description:
          "Une phrase entendue en call → rattachements méthode + partie. Gratuit. Une phrase, pas un dossier. Au-delà, refuse. Pour nommer ce qui manque sur LEUR deal : audit_deal.",
        inputSchema: z.object({
          phrase: z.string().describe("Une seule phrase, max 280 caractères, pas de retour à la ligne."),
        }),
      },
      async ({ phrase }) => jsonTool(rattacher(phrase)),
    );

    server.registerTool(
      "audit_deal",
      {
        title: "Audit deal",
        description:
          "Cases su / supposé / vide sur CE deal. Payant (clé d’org). Entrée = artefacts CRM (notes, mails, transcript). Sortie structurée + contrat de forme. Le LLM hôte rédige les 5 blocs. Interdit : proba de close, write_to_crm.",
        inputSchema: dealSchema,
      },
      async (deal) => jsonTool(scoreDeal(deal)),
    );

    server.registerTool(
      "next_question",
      {
        title: "Next question",
        description:
          "Le geste qui coûte sur CE deal. Payant. Même entrée que audit_deal.",
        inputSchema: dealSchema,
      },
      async (deal) => jsonTool(nextQuestion(deal)),
    );

    server.registerTool(
      "objection_map",
      {
        title: "Objection map",
        description:
          "Objection → case non tenue → CRAC. Payant. Pas une punchline.",
        inputSchema: dealSchema.extend({
          objection: z.string().describe("L’objection entendue, une phrase."),
        }),
      },
      async ({ objection, ...deal }) => jsonTool(objectionMap({ ...deal, objection })),
    );
  },
  {
    serverInfo: { name: "3xrep", version: "0.1.0" },
  },
);

function unpaid(req: Request): Response {
  const checkout = checkoutUrl();
  return new Response(
    JSON.stringify({
      error: "payant",
      checkout,
      ligne: `audit_deal lit le CRM. 99 € / org. ${checkout}`,
    }),
    {
      status: 401,
      headers: {
        "content-type": "application/json",
        "www-authenticate": `Bearer realm="3xrep", resource_metadata="${new URL("/.well-known/oauth-protected-resource", req.url).toString()}"`,
      },
    },
  );
}

async function gate(req: Request): Promise<Response> {
  const paid = await paidToolName(req);
  if (paid) {
    const org = await orgFromRequest(req);
    if (!org) return unpaid(req);
    return handler(req);
  }
  if (!rateLimit(clientIp(req))) {
    return new Response(JSON.stringify({ error: "rate_limit" }), { status: 429 });
  }
  return handler(req);
}

export { gate as GET, gate as POST, gate as DELETE };
