import { createHash, createHmac, randomBytes, timingSafeEqual } from "node:crypto";

export const MONITORING_COOKIE = "3xrep-monitoring";
export const SESSION_SECONDS = 7 * 24 * 60 * 60;

function password(): string | null {
  const value = process.env.MONITORING_PASSWORD;
  return value && value.length >= 24 ? value : null;
}
export function monitoringConfigured(): boolean { return password() !== null; }
export function validMonitoringPassword(candidate: string): boolean {
  const expected = password();
  if (!expected || candidate.length > 256) return false;
  const digest = (value: string) => createHash("sha256").update(value).digest();
  return timingSafeEqual(digest(expected), digest(candidate));
}
function signature(payload: string, secret: string): string {
  return createHmac("sha256", secret).update("3xrep-monitoring-session:" + payload).digest("base64url");
}
export function createMonitoringSession(now = Date.now()): string {
  const secret = password();
  if (!secret) throw new Error("Monitoring access is not configured");
  const payload = Buffer.from(JSON.stringify({ expires: Math.floor(now / 1000) + SESSION_SECONDS, nonce: randomBytes(16).toString("hex") })).toString("base64url");
  return payload + "." + signature(payload, secret);
}
export function validMonitoringSession(token: string | undefined, now = Date.now()): boolean {
  const secret = password();
  if (!secret || !token || token.length > 512) return false;
  const parts = token.split(".");
  if (parts.length !== 2) return false;
  const [payload, signed] = parts;
  const expected = Buffer.from(signature(payload, secret));
  const actual = Buffer.from(signed);
  if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) return false;
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString());
    const seconds = Math.floor(now / 1000);
    return Number.isSafeInteger(data.expires) && data.expires > seconds && data.expires <= seconds + SESSION_SECONDS && typeof data.nonce === "string";
  } catch { return false; }
}
