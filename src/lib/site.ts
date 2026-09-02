export function siteUrl(): string {
  const raw =
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : null) ??
    "http://localhost:3000";
  return raw.replace(/\/$/, "");
}

export function checkoutUrl(): string {
  return `${siteUrl()}/api/stripe/checkout`;
}

export function mcpUrl(): string {
  return `${siteUrl()}/api/mcp`;
}
