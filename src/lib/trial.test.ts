import assert from "node:assert/strict";
import { test } from "node:test";
import {
  CARD_GRACE_DAYS,
  TRIAL_DAYS_DIRECT,
  TRIAL_DAYS_REFERRAL,
  addDays,
  effectiveAccess,
  isJudgingTool,
  openTools,
  statusAfterCheckout,
  stripeTrialEndUnix,
  trialDaysFor,
  trialWindow,
} from "./trial";
import { amountBucket, dealHash, mapEtat, souvenirFromRows } from "./skeleton";
import { CUTOFF_NO_PAYMENT } from "./copy";
import { cutoffPhrase } from "./access";
import { parseMission, safeCompanyUrl } from "./profile";
import { verifyOrgSig } from "./checkout-token";
import { referralBlocked } from "./referrals";

test("trial days: direct 14, referred 28", () => {
  assert.equal(trialDaysFor(false), TRIAL_DAYS_DIRECT);
  assert.equal(trialDaysFor(true), TRIAL_DAYS_REFERRAL);
  assert.equal(CARD_GRACE_DAYS, 7);
});

test("effectiveAccess: no clock → full", () => {
  assert.equal(
    effectiveAccess({
      status: "trial",
      trial_started_at: null,
      trial_ends_at: null,
      card_deadline_at: null,
      stripe_subscription_id: null,
    }),
    "full",
  );
});

test("effectiveAccess: within 7 days without card → full", () => {
  const now = new Date("2026-09-14T12:00:00Z");
  const w = trialWindow(now, 14);
  assert.equal(
    effectiveAccess(
      {
        status: "trial",
        trial_started_at: w.started.toISOString(),
        trial_ends_at: w.ends.toISOString(),
        card_deadline_at: w.cardDeadline.toISOString(),
        stripe_subscription_id: null,
      },
      addDays(now, 3),
    ),
    "full",
  );
});

test("effectiveAccess: after day 7 without card → needs_card", () => {
  const now = new Date("2026-09-14T12:00:00Z");
  const w = trialWindow(now, 14);
  assert.equal(
    effectiveAccess(
      {
        status: "trial",
        trial_started_at: w.started.toISOString(),
        trial_ends_at: w.ends.toISOString(),
        card_deadline_at: w.cardDeadline.toISOString(),
        stripe_subscription_id: null,
      },
      addDays(now, 8),
    ),
    "needs_card",
  );
});

test("effectiveAccess: card on file after day 7 → full until trial end", () => {
  const now = new Date("2026-09-14T12:00:00Z");
  const w = trialWindow(now, 14);
  assert.equal(
    effectiveAccess(
      {
        status: "trial",
        trial_started_at: w.started.toISOString(),
        trial_ends_at: w.ends.toISOString(),
        card_deadline_at: w.cardDeadline.toISOString(),
        stripe_subscription_id: "sub_x",
      },
      addDays(now, 8),
    ),
    "full",
  );
});

test("effectiveAccess: trial ended → lapsed", () => {
  const now = new Date("2026-09-14T12:00:00Z");
  const w = trialWindow(now, 14);
  assert.equal(
    effectiveAccess(
      {
        status: "trial",
        trial_started_at: w.started.toISOString(),
        trial_ends_at: w.ends.toISOString(),
        card_deadline_at: w.cardDeadline.toISOString(),
        stripe_subscription_id: "sub_x",
      },
      addDays(now, 15),
    ),
    "lapsed",
  );
});

test("effectiveAccess: active / canceled", () => {
  const row = {
    trial_started_at: null,
    trial_ends_at: null,
    card_deadline_at: null,
    stripe_subscription_id: null,
  };
  assert.equal(effectiveAccess({ ...row, status: "active" }), "full");
  assert.equal(effectiveAccess({ ...row, status: "canceled" }), "canceled");
});

test("judging tools vs lexicon", () => {
  assert.equal(isJudgingTool("audit_deal"), true);
  assert.equal(isJudgingTool("pipe_review"), true);
  assert.equal(isJudgingTool("next_question"), true);
  assert.equal(isJudgingTool("objection_map"), true);
  assert.equal(isJudgingTool("methode_lookup"), false);
  assert.equal(isJudgingTool("rattacher"), false);
  assert.equal(isJudgingTool("set_org_profile"), false);
});

test("stripeTrialEndUnix: under 48h → null (charge now)", () => {
  const now = new Date("2026-09-14T12:00:00Z");
  assert.equal(stripeTrialEndUnix(addDays(now, 1).toISOString(), now), null);
  const unix = stripeTrialEndUnix(addDays(now, 10).toISOString(), now);
  assert.ok(unix && unix > now.getTime() / 1000);
});

test("cutoff phrases", () => {
  assert.match(cutoffPhrase("no_key"), /no key/);
  assert.equal(cutoffPhrase("lapsed"), CUTOFF_NO_PAYMENT);
  assert.doesNotMatch(CUTOFF_NO_PAYMENT, /has has/);
});

test("skeleton hash / bucket / etat / souvenir", () => {
  const a = dealHash("org", "hs_1", "Acme");
  const b = dealHash("org", "hs_1", "Other");
  assert.equal(a, b);
  assert.notEqual(dealHash("org", null, "Acme"), dealHash("org", null, "Bolt"));
  assert.equal(amountBucket(5000), "0-10k");
  assert.equal(amountBucket(40_000), "10-50k");
  assert.equal(amountBucket(80_000), "50-250k");
  assert.equal(amountBucket(300_000), "250k+");
  assert.equal(mapEtat("vide"), "trou");
  assert.equal(mapEtat("contredit"), "trou");
  assert.equal(mapEtat("su"), "su");
  const s = souvenirFromRows([
    { piece: "qui-tranche", etat: "trou", trou_since: "2026-09-01T00:00:00Z", times_trou: 4, reflex_id: null },
  ]);
  assert.equal(s[0]?.depuis, "2026-09-01");
  assert.equal(s[0]?.fois, 4);
  assert.equal("citation" in (s[0] ?? {}), false);
});

test("profile mission + url", () => {
  assert.equal(parseMission("VP Sales"), "directeur commercial");
  assert.equal(parseMission("rep"), "commercial");
  assert.equal(safeCompanyUrl("https://example.com")?.hostname, "example.com");
  assert.equal(safeCompanyUrl("http://localhost"), null);
  assert.equal(verifyOrgSig("not-a-uuid", "deadbeef"), false);
});

test("openTools reads MCP_OPEN_TOOLS", () => {
  const prev = process.env.MCP_OPEN_TOOLS;
  delete process.env.MCP_OPEN_TOOLS;
  assert.equal(openTools(), false);
  process.env.MCP_OPEN_TOOLS = "1";
  assert.equal(openTools(), true);
  if (prev === undefined) delete process.env.MCP_OPEN_TOOLS;
  else process.env.MCP_OPEN_TOOLS = prev;
});

test("statusAfterCheckout: trial stays trial; lapsed pays → active", () => {
  const trial = { status: "trial", trial_ends_at: "2026-09-28T00:00:00Z" };
  assert.equal(statusAfterCheckout(trial, false), "trial");
  assert.equal(statusAfterCheckout(trial, true), "trial");
  assert.equal(statusAfterCheckout({ status: "lapsed", trial_ends_at: trial.trial_ends_at }, true), "active");
  assert.equal(statusAfterCheckout({ status: "lapsed", trial_ends_at: trial.trial_ends_at }, false), "lapsed");
  assert.equal(statusAfterCheckout({ status: "trial", trial_ends_at: null }, true), "active");
});

test("referralBlocked: same email / customer / card", () => {
  const base = {
    parrainId: "a",
    filleulId: "b",
    parrainEmail: "p@x.com",
    filleulEmail: "f@x.com",
    parrainCustomer: "cus_p",
    filleulCustomer: "cus_f",
    parrainFingerprint: "fp_p",
    filleulFingerprint: "fp_f",
  };
  assert.equal(referralBlocked(base), false);
  assert.equal(referralBlocked({ ...base, filleulEmail: "p@x.com" }), true);
  assert.equal(referralBlocked({ ...base, filleulCustomer: "cus_p" }), true);
  assert.equal(referralBlocked({ ...base, filleulFingerprint: "fp_p" }), true);
  assert.equal(referralBlocked({ ...base, filleulId: "a" }), true);
});
