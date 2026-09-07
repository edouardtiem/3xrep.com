/** Public product origin. What users paste. Not the preview / local origin. */
export const PUBLIC_SITE = "https://3xrep.com";

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
