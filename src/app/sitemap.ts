import type { MetadataRoute } from "next";
import { DOC_NAV } from "@/lib/docs";
import { siteUrl } from "@/lib/site";

const EXTRA = [
  "/install",
  "/spec",
  "/docs/gong-alternative",
  "/docs/pipeline-review",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();
  const docs = DOC_NAV.map((item) => ({
    url: `${base}${item.href}`,
    changeFrequency: "weekly" as const,
    priority: item.href === "/docs" ? 0.8 : 0.7,
  }));

  return [
    {
      url: base,
      changeFrequency: "weekly",
      priority: 1,
    },
    ...docs,
    ...EXTRA.map((path) => ({
      url: `${base}${path}`,
      changeFrequency: "monthly" as const,
      priority: path === "/install" ? 0.8 : 0.5,
    })),
  ];
}
