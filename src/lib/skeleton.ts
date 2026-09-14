import { createHash } from "node:crypto";
import { admin } from "@/lib/supabase-admin";
import type { Etat } from "@/lib/brain/etat";
import type { PieceVerdict } from "@/lib/brain/types";

export type SkeletonEtat = "su" | "suppose" | "trou";

export type Souvenir = {
  piece: string;
  etat: SkeletonEtat;
  depuis: string | null;
  fois: number;
};

export type SkeletonRow = {
  piece: string;
  etat: SkeletonEtat;
  trou_since: string | null;
  times_trou: number;
  reflex_id: string | null;
  denouement?: "gagne" | "perdu" | "ouvert" | null;
};

export function mapEtat(etat: Etat): SkeletonEtat {
  if (etat === "su") return "su";
  if (etat === "suppose") return "suppose";
  return "trou";
}

export function amountBucket(montant: number | undefined): string | null {
  if (montant == null || !Number.isFinite(montant) || montant < 0) return null;
  if (montant < 10_000) return "0-10k";
  if (montant < 50_000) return "10-50k";
  if (montant < 250_000) return "50-250k";
  return "250k+";
}

export function dealHash(orgId: string, crmId?: string | null, nom?: string | null): string {
  const raw = (crmId?.trim() || nom?.trim().toLowerCase().replace(/\s+/g, " ") || "unknown").slice(0, 200);
  return createHash("sha256").update(`${orgId}:${raw}`).digest("hex");
}

export function souvenirFromRows(rows: SkeletonRow[]): Souvenir[] {
  return rows
    .filter((r) => r.etat === "trou" && r.times_trou > 0)
    .map((r) => ({
      piece: r.piece,
      etat: r.etat,
      depuis: r.trou_since ? r.trou_since.slice(0, 10) : null,
      fois: r.times_trou,
    }));
}

type PieceIn = Pick<PieceVerdict, "id" | "etat"> & { reflexe?: string | null };

export async function recordPieces(input: {
  orgId: string;
  dealHash: string;
  pieces: PieceIn[];
  amountBucket: string | null;
  claimedStage: string | null;
  denouement?: "gagne" | "perdu" | "ouvert" | null;
  now?: Date;
}): Promise<Souvenir[]> {
  const db = admin();
  if (!db || input.orgId === "dev") return [];
  const now = input.now ?? new Date();
  const iso = now.toISOString();

  const { data: existing } = await db
    .from("judgment_skeleton")
    .select("piece, etat, trou_since, times_trou, reflex_id, denouement")
    .eq("org_id", input.orgId)
    .eq("deal_hash", input.dealHash);

  const prev = new Map(
    ((existing ?? []) as SkeletonRow[]).map((r) => [r.piece, r]),
  );

  for (const p of input.pieces) {
    const etat = mapEtat(p.etat);
    const was = prev.get(p.id);
    const isTrou = etat === "trou";
    const times = isTrou ? (was?.times_trou ?? 0) + 1 : 0;
    const trouSince = isTrou ? (was?.trou_since ?? iso) : null;
    const row = {
      org_id: input.orgId,
      deal_hash: input.dealHash,
      piece: p.id,
      etat,
      reflex_id: p.reflexe ?? was?.reflex_id ?? null,
      judged_at: iso,
      trou_since: trouSince,
      times_trou: times,
      amount_bucket: input.amountBucket,
      claimed_stage: input.claimedStage,
      denouement: input.denouement ?? was?.denouement ?? null,
    };
    const { error } = await db.from("judgment_skeleton").upsert(row, {
      onConflict: "org_id,deal_hash,piece",
    });
    if (error) console.error("judgment_skeleton", error.message);
    prev.set(p.id, {
      piece: p.id,
      etat,
      trou_since: trouSince,
      times_trou: times,
      reflex_id: row.reflex_id,
      denouement: row.denouement as SkeletonRow["denouement"],
    });
  }

  return souvenirFromRows([...prev.values()]);
}
