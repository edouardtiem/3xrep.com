import { createHash } from "node:crypto";
import { admin } from "@/lib/supabase-admin";
import type { Etat } from "@/lib/brain/etat";
import type { PieceVerdict } from "@/lib/brain/types";

export type SkeletonEtat = "su" | "suppose" | "trou";

export type Souvenir = {
  crm_id?: string;
  affaire?: string;
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

export function dealHash(orgId: string, crmId?: string | null, nom?: string | null): string | null {
  const raw = crmId?.trim() || nom?.trim().toLowerCase().replace(/\s+/g, " ");
  if (!raw) return null;
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
  dealHash: string | null;
  pieces: PieceIn[];
  amountBucket: string | null;
  claimedStage: string | null;
  denouement?: "gagne" | "perdu" | "ouvert" | null;
  now?: Date;
}): Promise<Souvenir[]> {
  const db = admin();
  if (!db || !input.dealHash || input.orgId === "dev") return [];
  const rows: SkeletonRow[] = [];
  for (const p of input.pieces) {
    const { data, error } = await db.rpc("record_judgment_piece", {
      p_org: input.orgId, p_hash: input.dealHash, p_piece: p.id, p_etat: mapEtat(p.etat),
      p_reflex: p.reflexe ?? null, p_amount: input.amountBucket,
      p_stage: input.claimedStage, p_outcome: input.denouement ?? null,
    });
    if (error) throw new Error(`judgment_skeleton: ${error.message}`);
    rows.push(...((data ?? []) as SkeletonRow[]));
  }
  return souvenirFromRows(rows);
}
