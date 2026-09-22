import type { Metadata } from "next";
import { LIST_PRICE_USD } from "@/lib/pricing";
import { siteUrl } from "@/lib/site";

export const DOC_NAV = [
  { href: "/docs", label: "Start here" },
  { href: "/docs/how-it-works", label: "How it works" },
  { href: "/docs/use-cases", label: "Questions to try" },
  { href: "/docs/pipeline-review", label: "Your pipeline" },
  { href: "/docs/methods", label: "Sales methods" },
  { href: "/docs/gong-alternative", label: "Context & privacy" },
  { href: "/docs/pricing", label: "Beta & pricing" },
] as const;

export const TOOLS = [
  ["plan_horizon", "Prioritize today’s deal strategies, prepare the week and anticipate approvals over the next 30 days."],
  ["pipe_review", "Review several deals, identify open questions and suggest a next move for each."],
  ["audit_deal", "Build a strategy from verified deal evidence: the approach, wording, possible replies and next move."],
  ["next_question", "Prepare a conversation: objective, questions and reasons, conditional branches and a useful next step."],
  ["objection_map", "Work from the buyer’s actual objection to identify what to explore next."],
  ["methode_lookup", "Explain a sales method or one of its concepts."],
  ["rattacher", "Connect a short statement to the relevant sales-method concepts."],
  ["set_org_profile", "Save your role and company context to make the advice more relevant."],
  ["workspace_status", "Check your workspace’s access, beta or Founding status."],
  ["beta_feedback", "Save feedback on a result when you choose to share it."],
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
    title: "Understanding the deal",
    lead: "Who is involved, what matters to them and how they will decide.",
    methods: [
      {
        name: "BANT",
        parts: "Budget, Authority, Need, Timeline",
        forces:
          "Clarify the need, budget, timing and who can approve the purchase.",
      },
      {
        name: "MEDDIC",
        parts:
          "Metrics, Economic Buyer, Decision criteria, Decision process, Identify pain, Champion",
        forces:
          "Explore measurable value, the decision process and the people involved in a more complex deal.",
      },
      {
        name: "MEDDPICC",
        parts: "MEDDIC + Paper process + Competition",
        forces:
          "Bring procurement, legal steps and competing options into the conversation.",
      },
      {
        name: "BEBEDC",
        parts: "Need, Stakes, Budget, Timeline, Decision-makers, Competition",
        forces:
          "Separate the business need from what is at stake, then clarify budget, timing, decision-makers and alternatives.",
      },
      {
        name: "SPICED",
        parts: "Situation, Pain, Impact, Critical event, Decision",
        forces: "Connect the problem and its impact to an event that makes timing matter.",
      },
      {
        name: "CHAMP",
        parts: "Challenges, Authority, Money, Prioritization",
        forces: "Start with the customer’s challenge, then explore authority, budget and priority.",
      },
      {
        name: "GPCT",
        parts: "Goals, Plans, Challenges, Timeline",
        forces: "Understand what the buyer wants to achieve, what they have planned and what stands in the way.",
      },
      {
        name: "ANUM",
        parts: "Authority, Need, Urgency, Money",
        forces: "Clarify decision authority alongside the need, urgency and funding.",
      },
      {
        name: "NEAT",
        parts: "Need, Economic impact, Access to authority, Timeline",
        forces: "Explore the economic impact and how to reach the people involved in the decision.",
      },
      {
        name: "Strategic Selling",
        parts: "Buying influences - economic, user, technical, coach",
        forces:
          "Map the different people who influence a purchase and the role each plays.",
      },
    ],
  },
  {
    title: "Understanding the person",
    lead: "Look for the priorities expressed by this buyer.",
    methods: [
      {
        name: "SONCAS",
        parts: "Sécurité, Orgueil, Nouveauté, Confort, Argent, Sympathie",
        forces:
          "Explore what matters to this person using what they say, rather than assumptions about their job title.",
      },
      {
        name: "SONCASE",
        parts: "SONCAS + Environnement",
        forces: "Include environmental concerns when the buyer identifies them as a priority.",
      },
    ],
  },
  {
    title: "Making value concrete",
    lead: "Connect the problem to an impact the buyer can recognize.",
    methods: [
      {
        name: "Cost of inaction",
        parts: "Time, risk, downtime, missed revenue - in a number they own",
        forces:
          "Work with the buyer to quantify the time, cost or risk of leaving the problem unresolved.",
      },
    ],
  },
  {
    title: "Asking useful questions",
    lead: "Help the buyer explore the problem and the outcome they want.",
    methods: [
      {
        name: "SPIN",
        parts: "Situation, Problem, Implication, Need-payoff",
        forces:
          "Move from understanding the situation to exploring the problem, its consequences and the value of solving it.",
      },
      {
        name: "Gap Selling",
        parts: "Current state vs future state",
        forces:
          "Clarify the distance between the current situation and the outcome the buyer wants.",
      },
    ],
  },
  {
    title: "Explaining and responding",
    lead: "Make the value clear and work through concerns with the buyer.",
    methods: [
      {
        name: "CAB",
        parts: "Characteristic → Advantage → Benefit",
        forces: "Connect a feature to an advantage and a benefit that is relevant to the buyer.",
      },
      {
        name: "BAC",
        parts: "Benefit → Advantage → Characteristic",
        forces: "Start with the buyer’s benefit, then explain the advantage and the feature behind it.",
      },
      {
        name: "CRAC",
        parts: "Creuser, Reformuler, Argumenter, Contrôler",
        forces:
          "Explore the objection, check your understanding, respond and verify whether the concern is resolved.",
      },
      {
        name: "Points brûlés",
        parts: "A locked agreement you don't reopen",
        forces: "Build on agreements already reached while staying open to genuinely new information.",
      },
      {
        name: "SNAP",
        parts: "Simple, iNvaluable, Aligned, Priority",
        forces: "Keep the next step simple, useful, aligned with the buyer’s needs and worth their attention.",
      },
    ],
  },
  {
    title: "Negotiating the next step",
    lead: "Make the terms and the exchange clear to both sides.",
    methods: [
      {
        name: "Contreparties",
        parts: "Nothing for nothing",
        forces:
          "Make the exchange behind a concession explicit, whether it concerns price, scope or timing.",
      },
      {
        name: "4C",
        parts: "Contexte, Critères, Compromis, Contrôle",
        forces: "Clarify the context and criteria before agreeing on a compromise and checking the outcome.",
      },
    ],
  },
  {
    title: "Guiding the conversation",
    lead: "Match the approach to the stage and the people involved.",
    methods: [
      {
        name: "SPANCO",
        parts: "Suspect, Prospect, Approach, Negotiation, Closing, Order",
        forces:
          "Use the sales stage as a starting point, then check whether the deal’s evidence supports it.",
      },
      {
        name: "Challenger",
        parts: "Teach, Tailor, Take control",
        forces:
          "Offer a relevant perspective, adapt it to the buyer and help the conversation move toward a decision.",
      },
      {
        name: "Sandler",
        parts: "Pain, budget, decision - equal business stature",
        forces:
          "Discuss the problem, budget and decision process openly, with a balanced working relationship.",
      },
    ],
  },
];

export const DOC_FAQ = [
  { q: "Where do I use 3xrep?", a: "In your AI chat. Start with Claude and your connected CRM, then add your inbox and calendar when available. The connection guide covers setup requirements. ChatGPT Work validation is still in progress." },
  { q: "What does 3xrep add to my assistant?", a: "Sales judgment grounded in the context of your deal: what needs attention, what is still uncertain, and a useful next move with a reason behind it. Sales methods guide the advice; the situation determines how they apply." },
  { q: "Do I need a transcript?", a: "A transcript can help, but you can also work from notes and messages. Bring what you have into your chat. 3xrep should make uncertainty clear instead of inventing something the buyer never said." },
  { q: "Does 3xrep record calls or change my CRM?", a: "3xrep does not join calls or write to your CRM. Tool inputs and results, including any call text sent to 3xrep, are kept for 14 days and then deleted. A compact record of deal gaps remains without transcripts. Usage metadata and voluntary feedback are stored separately." },
  { q: "Is my workspace free forever when I sign up?", a: "No. During an open beta, you can try 3xrep without a credit card. Founding status is awarded manually after meaningful use, within a limit of 20 organizations. Only an awarded Founding workspace keeps its base plan free forever. See Beta & pricing for the current offer." },
  { q: "Can my whole team use it?", a: "Access belongs to the organization. Your workspace administrator may need to allow the connector, and each person’s access to the CRM still depends on the permissions in your own tools. The standard plan is priced per company, not per seat." },
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
  const branded = /3xrep/i.test(title) ? title : `${title} - 3xrep`;
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
      "A sales buddy in your AI chat. Helps prioritize your day, prepare conversations and choose the next move using the context you bring.",
    offers: {
      "@type": "Offer",
      name: "Standard monthly plan per organization",
      url: `${siteUrl()}/docs/pricing`,
      price: String(LIST_PRICE_USD),
      priceCurrency: "USD",
    },
  };
}
