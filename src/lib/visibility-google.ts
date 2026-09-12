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
  const raw = (
    env.GOOGLE_SERVICE_ACCOUNT_JSON || env.GA4_SERVICE_ACCOUNT_JSON
  )?.trim();
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
  if (!serviceAccount) {
    missing.push("GOOGLE_SERVICE_ACCOUNT_JSON");
  }

  const gscSiteUrl = (env.GSC_SITE_URL?.trim() || GSC_SITE_DEFAULT).replace(
    /\/?$/,
    "/",
  );
  const ga4PropertyId = env.GA4_PROPERTY_ID?.trim() || null;

  if (!serviceAccount) {
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

function pickGa4PropertyId(body: unknown): string | null {
  const summaries = (body as {
    accountSummaries?: {
      displayName?: string;
      propertySummaries?: { property?: string; displayName?: string }[];
    }[];
  }).accountSummaries;
  if (!Array.isArray(summaries)) return null;
  const props = summaries.flatMap((a) =>
    (a.propertySummaries ?? []).map((p) => ({
      id: (p.property ?? "").replace(/^properties\//, ""),
      name: `${a.displayName ?? ""} ${p.displayName ?? ""}`.toLowerCase(),
    })),
  );
  const numbered = props.filter((p) => /^\d+$/.test(p.id));
  const named = numbered.find((p) => p.name.includes("3xrep"));
  return named?.id ?? null;
}

function pickGscSiteUrl(body: unknown, preferred: string): string | null {
  const entries = (body as { siteEntry?: { siteUrl?: string }[] }).siteEntry;
  if (!Array.isArray(entries) || entries.length === 0) return null;
  const urls = entries.map((e) => e.siteUrl ?? "").filter(Boolean);
  const want = [
    preferred,
    preferred.replace(/\/$/, ""),
    "https://www.3xrep.com/",
    "https://3xrep.com/",
    "sc-domain:3xrep.com",
  ];
  for (const w of want) {
    const hit = urls.find((u) => u === w || u === `${w}/`);
    if (hit) return hit.endsWith("/") || hit.startsWith("sc-domain:") ? hit : `${hit}/`;
  }
  const three = urls.find((u) => /3xrep\.com/i.test(u));
  if (!three) return null;
  return three.endsWith("/") || three.startsWith("sc-domain:") ? three : `${three}/`;
}

export async function discoverGoogleSites(
  token: string,
  preferredGsc: string,
  fetchFn: FetchFn,
): Promise<{ gscSiteUrl: string | null; ga4PropertyId: string | null; error: string | null }> {
  let gscSiteUrl: string | null = null;
  let ga4PropertyId: string | null = null;
  let error: string | null = null;
  try {
    const gscRes = await fetchFn(
      "https://searchconsole.googleapis.com/webmasters/v3/sites",
      { headers: { authorization: `Bearer ${token}` } },
    );
    const gscBody: unknown = await gscRes.json();
    if (!gscRes.ok) {
      const err = gscBody as { error?: { message?: string } };
      error = err.error?.message || `search console sites ${gscRes.status}`;
    } else {
      gscSiteUrl = pickGscSiteUrl(gscBody, preferredGsc);
    }
  } catch (e) {
    error = e instanceof Error ? e.message : "search console sites";
  }
  try {
    const gaRes = await fetchFn(
      "https://analyticsadmin.googleapis.com/v1beta/accountSummaries",
      { headers: { authorization: `Bearer ${token}` } },
    );
    const gaBody: unknown = await gaRes.json();
    if (!gaRes.ok) {
      const err = gaBody as { error?: { message?: string } };
      const msg = err.error?.message || `analytics admin ${gaRes.status}`;
      error = error ? `${error} · ${msg}` : msg;
    } else {
      ga4PropertyId = pickGa4PropertyId(gaBody);
    }
  } catch (e) {
    const msg = e instanceof Error ? e.message : "analytics admin";
    error = error ? `${error} · ${msg}` : msg;
  }
  return { gscSiteUrl, ga4PropertyId, error };
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

  const found = await discoverGoogleSites(token, config.gscSiteUrl, fetchFn);
  const gscSiteUrl = found.gscSiteUrl;
  const ga4PropertyId = config.ga4PropertyId ?? found.ga4PropertyId;

  if (!gscSiteUrl) {
    gsc.error =
      found.error ??
      "aucune propriété 3xrep.com sur ce compte Google — autre site, chiffres ignorés";
  } else {
    try {
      gsc.current = await gscQuery(token, gscSiteUrl, window.current, fetchFn);
      gsc.previous = await gscQuery(token, gscSiteUrl, window.previous, fetchFn);
    } catch (e) {
      gsc.error = e instanceof Error ? e.message : "search console";
    }
  }

  if (!ga4PropertyId) {
    ga4.error = found.error
      ? `propriété Analytics introuvable (${found.error})`
      : "propriété Analytics introuvable — pose GA4_PROPERTY_ID";
  } else {
    try {
      ga4.current = await ga4Report(
        token,
        ga4PropertyId,
        window.current,
        fetchFn,
      );
      ga4.previous = await ga4Report(
        token,
        ga4PropertyId,
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
