export type Etat = "su" | "suppose" | "vide" | "contredit";

/** Tenue seulement si un fait complet. Une déclaration sans test = supposé. Une négation = contredit. */
export function etatDe(opts: {
  fait: boolean;
  declaration: boolean;
  nie: boolean;
  vertSansPreuve?: boolean;
}): Etat {
  if (opts.nie) return "contredit";
  if (opts.vertSansPreuve && !opts.fait) return "vide";
  if (opts.fait) return "su";
  if (opts.declaration) return "suppose";
  return "vide";
}
