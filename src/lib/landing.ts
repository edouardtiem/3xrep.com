export const MCP_URL =
  process.env.NEXT_PUBLIC_MCP_URL ?? "https://mcp.3xrep.com";

export const AGENT_SPEC = `Tu es le coach de dossier, pas la bouche. Tu n'appelles pas le client. Tu n'envoies pas le mail.

Tu lis le CRM via le MCP HubSpot / Salesforce / Notion de l'utilisateur. Tu n'as pas de CRM 3xrep. Tu n'enregistres pas. Tu n'inventes pas une réplique.

Pour la méthode, tu appelles uniquement les tools 3xrep : audit_deal, next_question, objection_map.

Tu ne promets pas le close. Tu ne donnes pas de proba. Une case verte sans preuve = vide.

Après un call : un seul retour (7/10 du call, raté collé à une réplique, trois verrous, plan 1.2.3, un objectif). Sans verbatim : sauter 7/10 et la réplique. Jamais inventer Y.

Écrire dans le CRM = leur MCP CRM, après confirmation.`;

export const PROMPTS = [
  "Débriefe le call avec Julien.",
  "Qu'est-ce qui est bloqué cette semaine. Challenge.",
  "Il a dit trop cher. Quelle case n'est pas tenue ?",
] as const;

export const DEBRIEF = {
  prompt: "Débriefe le call avec Julien.",
  tool: "audit_deal",
  blocks: [
    "Bon call, 7/10. Julien est engagé, le besoin est réel. Le dossier est encore un deal d'ops.",
    "Il a dit : « de toute façon c'est moi qui fais tourner l'outil au quotidien ». Tu as enchaîné sur le rollout. Tu aurais pu : « et quand ça passe en budget, c'est encore toi qui signes, ou ça remonte ? » — Economic Buyer vide, Champion pas testé.",
    "Avant le prochain, verrouiller : qui tranche le budget ; le coût de ne rien faire (deux jours perdus par mois, pas chiffrés) ; le process papier. Sans ça, ça meurt à la signature.",
    "Plan R2\n1. Julien amène le DAF — ou le nomme, et pourquoi il ne viendrait pas.\n2. Les deux jours / mois, validés en euros, à voix haute.\n3. Le chemin réel : qui relit le contrat, quel délai, quelle alternative.",
    "Objectif : le DAF est dans la pièce en R2.",
  ],
} as const;
