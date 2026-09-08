/** Public product origin. What users paste (MCP). Not the preview / local origin. */
export const PUBLIC_SITE = "https://3xrep.com";

/** Host that returns 200. Apex 308s to www — canonicals must match the sitemap. */
export function siteUrl(): string {
  const raw =
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : null) ??
    PUBLIC_SITE;
  return raw.replace(/\/$/, "");
}

export function checkoutUrl(): string {
  return `${siteUrl()}/api/stripe/checkout`;
}

export function mcpUrl(): string {
  return `${PUBLIC_SITE}/api/mcp`;
}
