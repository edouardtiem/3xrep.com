import assert from "node:assert/strict";
import { afterEach, test } from "node:test";
import sitemap from "../app/sitemap";
import { pageMeta } from "./docs";

const KEYS = ["NEXT_PUBLIC_SITE_URL", "VERCEL_PROJECT_PRODUCTION_URL"] as const;
const saved = Object.fromEntries(KEYS.map((k) => [k, process.env[k]]));

afterEach(() => {
  for (const k of KEYS) {
    if (saved[k] === undefined) delete process.env[k];
    else process.env[k] = saved[k];
  }
});

test("pageMeta og:url uses the host that 200s, not the apex paste origin", () => {
  delete process.env.NEXT_PUBLIC_SITE_URL;
  process.env.VERCEL_PROJECT_PRODUCTION_URL = "www.3xrep.com";
  const meta = pageMeta({
    title: "What is 3xrep",
    description: "x",
    path: "/docs",
  });
  assert.equal(meta.title, "What is 3xrep");
  assert.equal(meta.openGraph?.url, "https://www.3xrep.com/docs");
});

test("sitemap lists the pipeline-review URL", () => {
  delete process.env.NEXT_PUBLIC_SITE_URL;
  process.env.VERCEL_PROJECT_PRODUCTION_URL = "www.3xrep.com";
  const urls = sitemap().map((entry) => entry.url);
  assert.ok(urls.includes("https://www.3xrep.com/docs/pipeline-review"));
});
