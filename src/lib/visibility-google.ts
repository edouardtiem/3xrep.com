import { readFileSync } from "node:fs";
import { createSign } from "node:crypto";

export const GSC_SITE_DEFAULT = "https://3xrep.com/";

const TOKEN_URL = "https://oauth2.googleapis.com/token";
const SCOPES = [
  "https://www.googleapis.com/auth/webmasters.readonly",
  "https://www.googleapis.com/auth/analytics.readonly",
].join(" ");

export type ServiceAccount = {
  client_email: string;
  private_key: string;
};

export type DateWindow = { start: string; end: string };

export type GscRow = {
  query: string;
  page: string;
  impressions: number;
  clicks: number;
  ctr: number;
  position: number;
};

export type Ga4Row = {
  landingPage: string;
  sessions: number;
  engagedSessions: number;
};

export type GoogleVisibilityConfig = {
  serviceAccount: ServiceAccount;
  gscSiteUrl: string;
  ga4PropertyId: string | null;
};

export type GoogleVisibilityPull = {
  window: { current: DateWindow; previous: DateWindow };
  gsc: { current: GscRow[]; previous: GscRow[]; error: string | null };
  ga4: { current: Ga4Row[]; previous: Ga4Row[]; error: string | null };
};

type FetchFn = typeof fetch;

export function serviceAccountFromEnv(
  env: NodeJS.ProcessEnv = process.env,
): ServiceAccount | null {
  const raw = env.GOOGLE_SERVICE_ACCOUNT_JSON?.trim();
  if (raw) return parseServiceAccountJson(raw);
  const path = env.GOOGLE_APPLICATION_CREDENTIALS?.trim();
  if (!path) return null;
  try {
    return parseServiceAccountJson(readFileSync(path, "utf8"));
  } catch {
    return null;
  }
}

export function parseServiceAccountJson(raw: string): ServiceAccount | null {
  try {
    const json = JSON.parse(raw) as {
      client_email?: unknown;
      private_key?: unknown;
    };
    if (
      typeof json.client_email !== "string" ||
      typeof json.private_key !== "string"
    ) {
      return null;
    }
    return {
      client_email: json.client_email,
      private_key: json.private_key.replace(/\\n/g, "\n"),
    };
  } catch {
    return null;
  }
}

export function readGoogleVisibilityConfig(
  env: NodeJS.ProcessEnv = process.env,
):
  | { ok: true; config: GoogleVisibilityConfig }
  | { ok: false; missing: string[] } {
  const missing: string[] = [];
  const serviceAccount = serviceAccountFromEnv(env);
  if (!serviceAccount) missing.push("GOOGLE_SERVICE_ACCOUNT_JSON");

  const gscSiteUrl = (env.GSC_SITE_URL?.trim() || GSC_SITE_DEFAULT).replace(
    /\/?$/,
    "/",
  );
  const ga4PropertyId = env.GA4_PROPERTY_ID?.trim() || null;
  if (!ga4PropertyId) missing.push("GA4_PROPERTY_ID");

  if (missing.length || !serviceAccount) {
    return { ok: false, missing };
  }
  return { ok: true, config: { serviceAccount, gscSiteUrl, ga4PropertyId } };
}

export function utcYmd(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export function window28(now = new Date()): {
  current: DateWindow;
  previous: DateWindow;
} {
  const end = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - 1),
  );
  const start = new Date(end);
  start.setUTCDate(start.getUTCDate() - 27);
  const prevEnd = new Date(start);
  prevEnd.setUTCDate(prevEnd.getUTCDate() - 1);
  const prevStart = new Date(prevEnd);
  prevStart.setUTCDate(prevStart.getUTCDate() - 27);
  return {
    current: { start: utcYmd(start), end: utcYmd(end) },
    previous: { start: utcYmd(prevStart), end: utcYmd(prevEnd) },
  };
}

function b64urlJson(value: unknown): string {
  return Buffer.from(JSON.stringify(value)).toString("base64url");
}

export function signServiceAccountJwt(
  account: ServiceAccount,
  nowSec = Math.floor(Date.now() / 1000),
): string {
  const header = b64urlJson({ alg: "RS256", typ: "JWT" });
  const claim = b64urlJson({
    iss: account.client_email,
    scope: SCOPES,
    aud: TOKEN_URL,
    iat: nowSec,
    exp: nowSec + 3600,
  });
  const unsigned = `${header}.${claim}`;
  const sign = createSign("RSA-SHA256");
  sign.update(unsigned);
  return `${unsigned}.${sign.sign(account.private_key, "base64url")}`;
}

async function googleAccessToken(
  account: ServiceAccount,
  fetchFn: FetchFn,
): Promise<string> {
  const res = await fetchFn(TOKEN_URL, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: signServiceAccountJwt(account),
    }),
  });
  const body = (await res.json()) as { access_token?: string; error?: string };
  if (!res.ok || !body.access_token) {
    throw new Error(body.error || `token ${res.status}`);
  }
  return body.access_token;
}

function num(v: unknown): number {
  const n = typeof v === "number" ? v : Number(v);
  return Number.isFinite(n) ? n : 0;
}

function parseGscRows(body: unknown): GscRow[] {
  const rows = (body as { rows?: unknown[] })?.rows;
  if (!Array.isArray(rows)) return [];
  return rows.map((row) => {
    const r = row as {
      keys?: unknown[];
      impressions?: unknown;
      clicks?: unknown;
      ctr?: unknown;
      position?: unknown;
    };
    return {
      query: String(r.keys?.[0] ?? ""),
      page: String(r.keys?.[1] ?? ""),
      impressions: num(r.impressions),
      clicks: num(r.clicks),
      ctr: num(r.ctr),
      position: num(r.position),
    };
  });
}

function parseGa4Rows(body: unknown): Ga4Row[] {
  const rows = (body as { rows?: unknown[] })?.rows;
  if (!Array.isArray(rows)) return [];
  return rows.map((row) => {
    const r = row as {
      dimensionValues?: { value?: string }[];
      metricValues?: { value?: string }[];
    };
    return {
      landingPage: r.dimensionValues?.[0]?.value ?? "",
      sessions: num(r.metricValues?.[0]?.value),
      engagedSessions: num(r.metricValues?.[1]?.value),
    };
  });
}

async function gscQuery(
  token: string,
  siteUrl: string,
  window: DateWindow,
  fetchFn: FetchFn,
): Promise<GscRow[]> {
  const encoded = encodeURIComponent(siteUrl);
  const res = await fetchFn(
    `https://searchconsole.googleapis.com/webmasters/v3/sites/${encoded}/searchAnalytics/query`,
    {
      method: "POST",
      headers: {
        authorization: `Bearer ${token}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        startDate: window.start,
        endDate: window.end,
        dimensions: ["query", "page"],
        rowLimit: 50,
        dataState: "final",
      }),
    },
  );
  const body: unknown = await res.json();
  if (!res.ok) {
    const err = body as { error?: { message?: string } };
    throw new Error(err.error?.message || `search console ${res.status}`);
  }
  return parseGscRows(body);
}

async function ga4Report(
  token: string,
  propertyId: string,
  window: DateWindow,
  fetchFn: FetchFn,
): Promise<Ga4Row[]> {
  const res = await fetchFn(
    `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`,
    {
      method: "POST",
      headers: {
        authorization: `Bearer ${token}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        dateRanges: [{ startDate: window.start, endDate: window.end }],
        dimensions: [{ name: "landingPagePlusQueryString" }],
        metrics: [{ name: "sessions" }, { name: "engagedSessions" }],
        dimensionFilter: {
          filter: {
            fieldName: "sessionDefaultChannelGroup",
            stringFilter: { value: "Organic Search" },
          },
        },
        limit: 50,
      }),
    },
  );
  const body: unknown = await res.json();
  if (!res.ok) {
    const err = body as { error?: { message?: string } };
    throw new Error(err.error?.message || `analytics ${res.status}`);
  }
  return parseGa4Rows(body);
}

export async function pullGoogleVisibility(
  config: GoogleVisibilityConfig,
  fetchFn: FetchFn = fetch,
  now = new Date(),
): Promise<GoogleVisibilityPull> {
  const window = window28(now);
  const token = await googleAccessToken(config.serviceAccount, fetchFn);
  const gsc = { current: [] as GscRow[], previous: [] as GscRow[], error: null as string | null };
  const ga4 = { current: [] as Ga4Row[], previous: [] as Ga4Row[], error: null as string | null };

  try {
    gsc.current = await gscQuery(token, config.gscSiteUrl, window.current, fetchFn);
    gsc.previous = await gscQuery(token, config.gscSiteUrl, window.previous, fetchFn);
  } catch (e) {
    gsc.error = e instanceof Error ? e.message : "search console";
  }

  if (!config.ga4PropertyId) {
    ga4.error = "GA4_PROPERTY_ID manquant";
  } else {
    try {
      ga4.current = await ga4Report(
        token,
        config.ga4PropertyId,
        window.current,
        fetchFn,
      );
      ga4.previous = await ga4Report(
        token,
        config.ga4PropertyId,
        window.previous,
        fetchFn,
      );
    } catch (e) {
      ga4.error = e instanceof Error ? e.message : "analytics";
    }
  }

  return { window, gsc, ga4 };
}

function mdCell(v: string | number): string {
  return String(v).replace(/\|/g, "/");
}

export function formatGoogleVisibilityMarkdown(
  pull: GoogleVisibilityPull,
): string {
  const { current, previous } = pull.window;
  const lines = [
    `# Search Console + Analytics — ${current.start} → ${current.end}`,
    "",
    `Fenêtre précédente : ${previous.start} → ${previous.end}.`,
    "",
    "## Search Console",
    "",
  ];
  if (pull.gsc.error) {
    lines.push(`Erreur : ${pull.gsc.error}`, "");
  } else if (pull.gsc.current.length === 0) {
    lines.push("Aucune ligne (site trop jeune, ou pas encore d’impressions).", "");
  } else {
    lines.push("| requête | page | impressions | clics | position |", "| --- | --- | --- | --- | --- |");
    for (const row of pull.gsc.current) {
      lines.push(
        `| ${mdCell(row.query)} | ${mdCell(row.page)} | ${row.impressions} | ${row.clicks} | ${row.position.toFixed(1)} |`,
      );
    }
    lines.push("");
  }

  lines.push("## Analytics — recherche organique", "");
  if (pull.ga4.error) {
    lines.push(`Erreur : ${pull.ga4.error}`, "");
  } else if (pull.ga4.current.length === 0) {
    lines.push("Aucune session organique sur la fenêtre.", "");
  } else {
    lines.push("| page | sessions | engagées |", "| --- | --- | --- |");
    for (const row of pull.ga4.current) {
      lines.push(
        `| ${mdCell(row.landingPage)} | ${row.sessions} | ${row.engagedSessions} |`,
      );
    }
    lines.push("");
  }

  return lines.join("\n");
}

export function notConnectedMessage(missing: string[]): string {
  return [
    "pas branché",
    `Manque : ${missing.join(" · ")}`,
    "Le tag public G-YWQX4MDHZP n’est pas un accès lecture.",
    "Voir docs/visibility/seo-geo.md — Toi.",
  ].join("\n");
}
