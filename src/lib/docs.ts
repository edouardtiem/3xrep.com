import type { Metadata } from "next";
import { LIST_PRICE_USD } from "@/lib/stripe-checkout-session";
import { siteUrl } from "@/lib/site";

export const DOC_NAV = [
  { href: "/docs", label: "Overview" },
  { href: "/docs/how-it-works", label: "How it works" },
  { href: "/docs/use-cases", label: "Use cases" },
  { href: "/docs/methods", label: "Methods" },
] as const;

export const TOOLS = [
  [
    "pipe_review",
    "Several deals. Monday page: written totals, at risk = not market practice, one move per deal.",
  ],
  [
    "audit_deal",
    "One call. The /10, the miss quoted, three locks, a plan on their calendar, one objective.",
  ],
  ["next_question", "The question, why, who must be in the room — not send-the-contract."],
  ["objection_map", "Their sentence → the hole. Dig in the next meeting, don't reply by email."],
  ["methode_lookup", "MEDDIC, BANT, BEBEDC… a notion, not a deal."],
  ["rattacher", "One sentence from a call → which method, which part."],
  ["set_org_profile", "Once: title, mission, their company URL."],
] as const;

export type CrmDocLink = { label: string; href: string };

export type CrmConnector = {
  name: string;
  job: string;
  docs: CrmDocLink[];
};

/** Official vendor docs only. We don't build these connectors. */
export const CRM_CONNECTORS: readonly CrmConnector[] = [
  {
    name: "HubSpot",
    job: "Remote MCP for any client, plus a one-click connector inside Claude.",
    docs: [
      {
        label: "Remote MCP server",
        href: "https://developers.hubspot.com/docs/apps/developer-platform/build-apps/integrate-with-the-remote-hubspot-mcp-server",
      },
      {
        label: "Claude connector",
        href: "https://knowledge.hubspot.com/integrations/set-up-and-use-the-hubspot-connector-for-claude",
      },
    ],
  },
  {
    name: "Salesforce",
    job: "Hosted MCP servers in Setup. Claude, Cursor, and ChatGPT connect with an External Client App.",
    docs: [
      {
        label: "Hosted MCP servers",
        href: "https://developer.salesforce.com/docs/platform/hosted-mcp-servers",
      },
    ],
  },
  {
    name: "Pipedrive",
    job: "Native MCP on every plan. Marketplace connector in Claude, custom app in ChatGPT.",
    docs: [
      {
        label: "MCP overview",
        href: "https://support.pipedrive.com/en/article/mcp",
      },
      {
        label: "Claude",
        href: "https://support.pipedrive.com/en/article/mcp-claude",
      },
      {
        label: "ChatGPT",
        href: "https://support.pipedrive.com/en/article/mcp-chatgpt",
      },
    ],
  },
  {
    name: "Attio",
    job: "Hosted MCP with OAuth. Add the URL, sign in as yourself.",
    docs: [
      {
        label: "Attio MCP",
        href: "https://docs.attio.com/mcp/overview",
      },
    ],
  },
  {
    name: "Notion",
    job: "When Notion is the file. Hosted MCP, OAuth, read and write the workspace.",
    docs: [
      {
        label: "Get started",
        href: "https://developers.notion.com/guides/mcp/get-started-with-mcp",
      },
      {
        label: "Help center",
        href: "https://www.notion.com/help/notion-mcp",
      },
    ],
  },
  {
    name: "Close",
    job: "Remote MCP for leads, opportunities, and activities. OAuth or API key.",
    docs: [
      {
        label: "Close MCP server",
        href: "https://help.close.com/docs/mcp-server",
      },
    ],
  },
];

export type MethodEntry = {
  name: string;
  parts: string;
  forces: string;
};

export const METHOD_FAMILIES: readonly {
  title: string;
  lead: string;
  methods: readonly MethodEntry[];
}[] = [
  {
    title: "Qualification — the file",
    lead: "The boxes. A box ticked without proof is empty.",
    methods: [
      {
        name: "BANT",
        parts: "Budget, Authority, Need, Timeline",
        forces:
          "Short cycle. Authority is who signs, not who took the call.",
      },
      {
        name: "MEDDIC",
        parts:
          "Metrics, Economic Buyer, Decision criteria, Decision process, Identify pain, Champion",
        forces:
          "Committee deals. A missing letter — or a letter checked without a quote — is a deal that stalls.",
      },
      {
        name: "MEDDPICC",
        parts: "MEDDIC + Paper process + Competition",
        forces:
          "Legal, procurement, and the real alternative — including doing nothing.",
      },
      {
        name: "BEBEDC",
        parts: "Besoin, Enjeu, Budget, Échéance, Décideurs, Concurrents",
        forces:
          "French discovery grid. Décideurs is not the ops on the call. Enjeu is not Besoin.",
      },
      {
        name: "SPICED",
        parts: "Situation, Pain, Impact, Critical event, Decision",
        forces: "Why now. A date without a critical event is a hope.",
      },
      {
        name: "CHAMP",
        parts: "Challenges, Authority, Money, Prioritization",
        forces: "Start from their challenge, not from your budget field.",
      },
      {
        name: "GPCT",
        parts: "Goals, Plans, Challenges, Timeline",
        forces: "What they already planned. A goal without a plan is a wish.",
      },
      {
        name: "ANUM",
        parts: "Authority, Need, Urgency, Money",
        forces: "Authority first. Don't demo for someone who can't sign.",
      },
      {
        name: "NEAT",
        parts: "Need, Economic impact, Access to authority, Timeline",
        forces: "Access is a piece. 'We'll bring the CFO later' is not access.",
      },
      {
        name: "Strategic Selling",
        parts: "Buying influences — economic, user, technical, coach",
        forces:
          "Map the room. One friendly user is not a buying committee.",
      },
    ],
  },
  {
    title: "Motivation — this person",
    lead: "The ops and the CFO don't move on the same lever. A persona is not a person.",
    methods: [
      {
        name: "SONCAS",
        parts: "Sécurité, Orgueil, Nouveauté, Confort, Argent, Sympathie",
        forces:
          "What moves this person. Talking money to pride, or pride to a CFO, is a hole.",
      },
      {
        name: "SONCASE",
        parts: "SONCAS + Environnement",
        forces: "Same grid, plus the sustainability lever when they named it.",
      },
    ],
  },
  {
    title: "The number",
    lead: "A slide is not a metric. The buyer has to say the number.",
    methods: [
      {
        name: "Cost of inaction",
        parts: "Time, risk, downtime, missed revenue — in a number they own",
        forces:
          "MEDDIC Metrics and BEBEDC Enjeu in figures. If they say 'too expensive' and you have no number, you have nothing to put on the table.",
      },
    ],
  },
  {
    title: "Questioning",
    lead: "Situation questions fill a CRM. They don't hold a piece.",
    methods: [
      {
        name: "SPIN",
        parts: "Situation, Problem, Implication, Need-payoff",
        forces:
          "Don't stay in situation. Implication is where pain becomes a reason to move.",
      },
      {
        name: "Gap Selling",
        parts: "Current state vs future state",
        forces:
          "The gap has to be theirs, measured. Your future-state slide is a claim.",
      },
    ],
  },
  {
    title: "Argument — advancing",
    lead: "An objection is usually a piece that isn't held. Don't punch a line.",
    methods: [
      {
        name: "CAB",
        parts: "Characteristic → Advantage → Benefit",
        forces: "Start from the offer. Benefit is the last step, not the first.",
      },
      {
        name: "BAC",
        parts: "Benefit → Advantage → Characteristic",
        forces: "Start from them. The feature is only the proof.",
      },
      {
        name: "CRAC",
        parts: "Creuser, Reformuler, Argumenter, Contrôler",
        forces:
          "Treat the objection before you reply. Dig first. The no is the empty box.",
      },
      {
        name: "Points brûlés",
        parts: "A locked agreement you don't reopen",
        forces: "Advance by small yeses. Reopening a burned point is a hole.",
      },
      {
        name: "SNAP",
        parts: "Simple, iNvaluable, Aligned, Priority",
        forces: "They are overwhelmed. Complexity is not rigor.",
      },
    ],
  },
  {
    title: "Negotiation",
    lead: "Giving without a return is a hole. Discount, delay, scope, access: each concession costs.",
    methods: [
      {
        name: "Contreparties",
        parts: "Nothing for nothing",
        forces:
          "A discount that doesn't buy the economic buyer, a date, or a process is a gift.",
      },
      {
        name: "4C",
        parts: "Contexte, Critères, Compromis, Contrôle",
        forces: "Name the trade before you move a number.",
      },
    ],
  },
  {
    title: "Cycle and posture",
    lead: "A stage name is not a state. A nice relationship is not a champion.",
    methods: [
      {
        name: "SPANCO",
        parts: "Suspect, Prospect, Approach, Negotiation, Closing, Order",
        forces:
          "The cycle as they name it. Jumping a stage in the CRM without the piece is illegal.",
      },
      {
        name: "Challenger",
        parts: "Teach, Tailor, Take control",
        forces:
          "The account is often in the status quo. Being liked is not teaching.",
      },
      {
        name: "Sandler",
        parts: "Pain, budget, decision — equal business stature",
        forces:
          "Don't chase. A student who won't let you test pain is not a deal.",
      },
    ],
  },
];

export const DOC_FAQ = [
  {
    q: "What is 3xrep?",
    a:
      "He lives in Claude or ChatGPT, next to HubSpot. He reads the calls behind the fields and names what's missing, and the stage that isn't true. 14 days free, then $" +
      LIST_PRICE_USD +
      " a month for the whole company.",
  },
  {
    q: "How is 3xrep different from Claude or ChatGPT?",
    a: "Claude and ChatGPT can recite MEDDIC. They stay polite. They believe the green box. 3xrep asks what the buyer said. If the quote is missing, the piece is empty. A file of instructions can be ignored. The verdict cannot.",
  },
  {
    q: "Do you record calls or write to the CRM?",
    a: "We don't join your calls. We don't write to your CRM. Call text is kept 14 days, then deleted. We remember what's missing, not the call. Your assistant reads the file through HubSpot or Salesforce. If you want a note on the record, your assistant writes it — after you confirm.",
  },
  {
    q: "Is 3xrep an alternative to Gong that doesn't record calls?",
    a:
      "Gong records your calls — about $1,250 a month for a team of ten. 3xrep does not join your calls. He lives in Claude or ChatGPT, next to HubSpot. $" +
      LIST_PRICE_USD +
      " a month for the whole company.",
  },
  {
    q: "How much does 3xrep cost?",
    a:
      "$" +
      LIST_PRICE_USD +
      " a month for the whole company. Not per person who sells. 14 days free. We don't join your calls.",
  },
  {
    q: "Which CRMs work with 3xrep?",
    a: "HubSpot, Salesforce, Pipedrive, Attio, Notion, Close — any file that ships an official connector your assistant can add. Nothing to install inside HubSpot. No 3xrep tab.",
  },
] as const;

export function pageMeta({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  const branded = /3xrep/i.test(title) ? title : `${title} — 3xrep`;
  const url = `${siteUrl()}${path}`;
  return {
    title: branded,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: branded,
      description,
      url,
      type: "website",
      siteName: "3xrep",
    },
    twitter: {
      card: "summary",
      title: branded,
      description,
    },
  };
}

export function breadcrumbJsonLd(
  items: readonly { name: string; path: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${siteUrl()}${item.path}`,
    })),
  };
}

export function faqJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: DOC_FAQ.map((row) => ({
      "@type": "Question",
      name: row.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: row.a,
      },
    })),
  };
}

export function softwareJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "3xrep",
    url: siteUrl(),
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    description:
      "Lives in Claude or ChatGPT, next to HubSpot. Judges deals from what the buyer said. Does not join calls. Does not write to the CRM.",
    offers: {
      "@type": "Offer",
      price: String(LIST_PRICE_USD),
      priceCurrency: "USD",
    },
  };
}
