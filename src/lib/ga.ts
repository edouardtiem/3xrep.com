/** Public GA4 web-stream ID (also in page source; not a secret). */
export const DEFAULT_GA_MEASUREMENT_ID = "G-YWQX4MDHZP";

/** Override with `NEXT_PUBLIC_GA_MEASUREMENT_ID`. Invalid non-empty values disable the tag. */
export function getGaMeasurementId(): string | null {
  const raw = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  if (raw === undefined) return DEFAULT_GA_MEASUREMENT_ID;
  const id = raw.trim();
  if (!id) return DEFAULT_GA_MEASUREMENT_ID;
  if (!/^G-[A-Z0-9]+$/i.test(id)) return null;
  return id;
}
