import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/da/", "/merci", "/api/", "/monitoring"],
    },
    sitemap: `${siteUrl()}/sitemap.xml`,
  };
}
