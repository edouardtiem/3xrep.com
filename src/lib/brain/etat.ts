export type Etat = "su" | "suppose" | "vide";

/** Case verte sans preuve = vide. Signal sans preuve = supposé. */
export function etatDe(opts: {
  signal: boolean;
  preuve: boolean;
  vertSansPreuve?: boolean;
}): Etat {
  if (opts.vertSansPreuve && !opts.preuve) return "vide";
  if (!opts.signal) return "vide";
  if (!opts.preuve) return "suppose";
  return "su";
}
