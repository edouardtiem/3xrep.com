import { METHODES } from "./lexique";

export function methodeLookup(q: string) {
  const n = q.trim().toLowerCase();
  if (!n) {
    return {
      methodes: METHODES.map((m) => ({ slug: m.slug, nom: m.nom, famille: m.famille })),
    };
  }
  const hits = METHODES.filter(
    (m) =>
      m.slug.includes(n) ||
      m.nom.toLowerCase().includes(n) ||
      m.parties.some((p) => p.slug.includes(n) || p.nom.toLowerCase().includes(n)),
  );
  return {
    hits: hits.map((m) => ({
      slug: m.slug,
      nom: m.nom,
      famille: m.famille,
      parties: m.parties,
    })),
  };
}
