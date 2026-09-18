import type { SalesContext } from "@/lib/brain/types";
import { updateOrgProfile, type OrgRow } from "@/lib/orgs";

const MISSIONS = ["commercial", "manager", "directeur commercial", "autre"] as const;
export type Mission = (typeof MISSIONS)[number];

export function parseMission(raw: string): Mission {
  const s = raw.trim().toLowerCase();
  if (s === "rep" || s === "ae" || s === "seller" || s === "commercial") return "commercial";
  if (s === "manager" || s === "head of sales") return "manager";
  if (s.includes("directeur") || s.includes("vp") || s.includes("vice")) return "directeur commercial";
  if ((MISSIONS as readonly string[]).includes(s)) return s as Mission;
  return "autre";
}

export function safeCompanyUrl(raw: string): URL | null {
  try {
    const u = new URL(raw.trim().startsWith("http") ? raw.trim() : `https://${raw.trim()}`);
    if (u.protocol !== "http:" && u.protocol !== "https:") return null;
    const host = u.hostname.toLowerCase();
    if (host === "localhost" || host.endsWith(".local") || host === "0.0.0.0") return null;
    if (/^(10\.|127\.|169\.254\.|192\.168\.|172\.(1[6-9]|2\d|3[0-1])\.)/.test(host)) return null;
    return u;
  } catch {
    return null;
  }
}

function stripTags(html: string): string {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

export async function blurbFromUrl(url: URL): Promise<string | null> {
  try {
    const res = await fetch(url, {
      signal: AbortSignal.timeout(5000),
      headers: { accept: "text/html", "user-agent": "3xrep-profile/1" },
      redirect: "follow",
    });
    if (!res.ok) return null;
    const html = (await res.text()).slice(0, 80_000);
    const title = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1];
    const desc =
      html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)/i)?.[1] ||
      html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+name=["']description["']/i)?.[1];
    const bits = [title ? stripTags(title) : "", desc ? stripTags(desc) : ""].filter(Boolean);
    return bits.join(" - ").slice(0, 500) || null;
  } catch {
    return null;
  }
}

export async function setProfile(
  org: OrgRow,
  input: { title: string; mission: string; company_url: string; contexte?: SalesContext; company_blurb?: string },
): Promise<{ title: string; mission: Mission; company_url: string; company_blurb: string | null }> {
  const url = safeCompanyUrl(input.company_url);
  if (!url) throw new Error("company_url invalide");
  const blurb = await blurbFromUrl(url);
  const profile = {
    title: input.title.trim().slice(0, 80),
    mission: parseMission(input.mission),
    company_url: url.toString(),
    company_blurb: input.company_blurb?.trim().slice(0, 500) || blurb,
    ...(input.contexte ? { sales_context: input.contexte } : {}),
  };
  if (org.id !== "dev") await updateOrgProfile(org.id, profile);
  return profile;
}
