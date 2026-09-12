import assert from "node:assert/strict";
import { generateKeyPairSync } from "node:crypto";
import { afterEach, test } from "node:test";
import {
  formatGoogleVisibilityMarkdown,
  GSC_SITE_DEFAULT,
  notConnectedMessage,
  parseServiceAccountJson,
  pullGoogleVisibility,
  readGoogleVisibilityConfig,
  utcYmd,
  window28,
} from "./visibility-google";

const { privateKey } = generateKeyPairSync("rsa", { modulusLength: 2048 });
const pem = privateKey.export({ type: "pkcs8", format: "pem" }).toString();
const accountJson = JSON.stringify({
  client_email: "loop@3xrep.iam.gserviceaccount.com",
  private_key: pem,
});

const KEYS = [
  "GOOGLE_SERVICE_ACCOUNT_JSON",
  "GA4_SERVICE_ACCOUNT_JSON",
  "GOOGLE_APPLICATION_CREDENTIALS",
  "GSC_SITE_URL",
  "GA4_PROPERTY_ID",
] as const;
const saved = Object.fromEntries(KEYS.map((k) => [k, process.env[k]]));

afterEach(() => {
  for (const k of KEYS) {
    if (saved[k] === undefined) delete process.env[k];
    else process.env[k] = saved[k];
  }
});

test("config : sans clé, liste ce qui manque", () => {
  for (const k of KEYS) delete process.env[k];
  const got = readGoogleVisibilityConfig();
  assert.equal(got.ok, false);
  if (!got.ok) {
    assert.deepEqual(got.missing, ["GOOGLE_SERVICE_ACCOUNT_JSON"]);
  }
});

test("config : clé + propriété Analytics, site Search Console par défaut", () => {
  process.env.GOOGLE_SERVICE_ACCOUNT_JSON = accountJson;
  process.env.GA4_PROPERTY_ID = "123456789";
  delete process.env.GSC_SITE_URL;
  const got = readGoogleVisibilityConfig();
  assert.equal(got.ok, true);
  if (got.ok) {
    assert.equal(got.config.gscSiteUrl, GSC_SITE_DEFAULT);
    assert.equal(got.config.ga4PropertyId, "123456789");
    assert.equal(
      got.config.serviceAccount.client_email,
      "loop@3xrep.iam.gserviceaccount.com",
    );
  }
});

test("config : GA4_SERVICE_ACCOUNT_JSON suffit, propriété découvrable plus tard", () => {
  delete process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  process.env.GA4_SERVICE_ACCOUNT_JSON = accountJson;
  delete process.env.GA4_PROPERTY_ID;
  const got = readGoogleVisibilityConfig();
  assert.equal(got.ok, true);
  if (got.ok) {
    assert.equal(got.config.ga4PropertyId, null);
    assert.equal(
      got.config.serviceAccount.client_email,
      "loop@3xrep.iam.gserviceaccount.com",
    );
  }
});

test("parseServiceAccountJson refuse un JSON sans email", () => {
  assert.equal(parseServiceAccountJson("{}"), null);
  assert.equal(parseServiceAccountJson("pas json"), null);
});

test("window28 : 28 jours jusqu’à hier, puis 28 jours d’avant", () => {
  const w = window28(new Date("2026-09-08T12:00:00Z"));
  assert.deepEqual(w.current, { start: "2026-08-11", end: "2026-09-07" });
  assert.deepEqual(w.previous, { start: "2026-07-14", end: "2026-08-10" });
  assert.equal(utcYmd(new Date("2026-09-08T23:00:00Z")), "2026-09-08");
});

test("notConnectedMessage ne promet pas des chiffres", () => {
  const text = notConnectedMessage(["GOOGLE_SERVICE_ACCOUNT_JSON"]);
  assert.match(text, /pas branché/);
  assert.match(text, /G-YWQX4MDHZP/);
});

test("format : tables Search Console et Analytics", () => {
  const md = formatGoogleVisibilityMarkdown({
    window: {
      current: { start: "2026-08-11", end: "2026-09-07" },
      previous: { start: "2026-07-14", end: "2026-08-10" },
    },
    gsc: {
      current: [
        {
          query: "vp sales agent",
          page: "https://3xrep.com/",
          impressions: 40,
          clicks: 2,
          ctr: 0.05,
          position: 12.3,
        },
      ],
      previous: [],
      error: null,
    },
    ga4: {
      current: [{ landingPage: "/", sessions: 7, engagedSessions: 4 }],
      previous: [],
      error: null,
    },
  });
  assert.match(md, /vp sales agent/);
  assert.match(md, /40/);
  assert.match(md, /\|\s*\/\s*\|\s*7\s*\|\s*4\s*\|/);
});

test("pull : un compte sans 3xrep.com n’exporte pas l’autre site", async () => {
  const fetchFn: typeof fetch = async (input) => {
    const url = String(input);
    if (url.includes("oauth2.googleapis.com/token")) {
      return Response.json({ access_token: "tok" });
    }
    if (url.includes("/webmasters/v3/sites") && !url.includes("searchAnalytics")) {
      return Response.json({
        siteEntry: [{ siteUrl: "https://www.example-other.com/" }],
      });
    }
    if (url.includes("analyticsadmin.googleapis.com")) {
      return Response.json({
        accountSummaries: [
          {
            displayName: "autre",
            propertySummaries: [
              { property: "properties/111", displayName: "autre web" },
            ],
          },
        ],
      });
    }
    return Response.json({ error: "should not query foreign property" }, { status: 500 });
  };

  const pull = await pullGoogleVisibility(
    {
      serviceAccount: {
        client_email: "loop@3xrep.iam.gserviceaccount.com",
        private_key: pem,
      },
      gscSiteUrl: GSC_SITE_DEFAULT,
      ga4PropertyId: null,
    },
    fetchFn,
    new Date("2026-09-08T12:00:00Z"),
  );

  assert.equal(pull.gsc.current.length, 0);
  assert.equal(pull.ga4.current.length, 0);
  assert.match(pull.gsc.error ?? "", /3xrep\.com/);
  assert.match(pull.ga4.error ?? "", /introuvable/);
});

test("pull : appelle Search Console et Analytics, pas d’invention si une API casse", async () => {
  const calls: string[] = [];
  const fetchFn: typeof fetch = async (input, init) => {
    const url = String(input);
    calls.push(`${init?.method ?? "GET"} ${url}`);
    if (url.includes("oauth2.googleapis.com/token")) {
      return Response.json({ access_token: "tok" });
    }
    if (url.includes("/webmasters/v3/sites") && !url.includes("searchAnalytics")) {
      return Response.json({
        siteEntry: [{ siteUrl: "https://3xrep.com/" }],
      });
    }
    if (url.includes("analyticsadmin.googleapis.com")) {
      return Response.json({
        accountSummaries: [
          {
            displayName: "3xrep",
            propertySummaries: [
              { property: "properties/999", displayName: "3xrep web" },
            ],
          },
        ],
      });
    }
    if (url.includes("searchAnalytics/query")) {
      return Response.json({
        rows: [
          {
            keys: ["best vp sales agent", "https://3xrep.com/"],
            impressions: 12,
            clicks: 1,
            ctr: 0.08,
            position: 8,
          },
        ],
      });
    }
    if (url.includes("analyticsdata.googleapis.com")) {
      return Response.json({
        error: { message: "property not found" },
      }, { status: 403 });
    }
    return Response.json({ error: "unexpected" }, { status: 500 });
  };

  const pull = await pullGoogleVisibility(
    {
      serviceAccount: {
        client_email: "loop@3xrep.iam.gserviceaccount.com",
        private_key: pem,
      },
      gscSiteUrl: GSC_SITE_DEFAULT,
      ga4PropertyId: "999",
    },
    fetchFn,
    new Date("2026-09-08T12:00:00Z"),
  );

  assert.equal(pull.gsc.current[0]?.query, "best vp sales agent");
  assert.equal(pull.gsc.current[0]?.impressions, 12);
  assert.equal(pull.ga4.error, "property not found");
  assert.equal(pull.ga4.current.length, 0);
  assert.ok(calls.some((c) => c.includes("searchAnalytics/query")));
  assert.ok(calls.some((c) => c.includes("analyticsdata.googleapis.com")));
});
