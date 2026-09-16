import type { HorizonPlan, HorizonSlot } from "@/lib/brain/horizon";
import type { Audit, DealInput } from "@/lib/brain/types";
import type { PipeDeal, PipeReview } from "@/lib/brain/pipe";
import { scoreDeal } from "@/lib/brain/audit";
import { cutoffPhrase, isBlocked, maybeStartTrial, resolveAccess, trialExtras } from "@/lib/access";
import { jsonTool } from "@/lib/mcp-schema";
import { currentMcpRequest, withMcpLog } from "@/lib/mcp-log";
import type { OrgRow } from "@/lib/orgs";
import { amountBucket, dealHash, recordPieces, type Souvenir } from "@/lib/skeleton";
import { isJudgingTool } from "@/lib/trial";

export function withGate<Args extends Record<string, unknown>, R>(
  tool: string,
  run: (args: Args, org: OrgRow | null) => R | Promise<R>,
): (args: Args) => Promise<R> {
  return withMcpLog(tool, async (args) => {
    const access = await resolveAccess(currentMcpRequest());
    if (isBlocked(access)) {
      return jsonTool({
        refus: cutoffPhrase(access.kind, "checkoutUrl" in access ? access.checkoutUrl : null),
        checkout: "checkoutUrl" in access ? access.checkoutUrl : null,
      }) as R;
    }
    let org = access.kind === "full" ? access.org : null;
    if (org) org = await maybeStartTrial(org, tool);
    const result = await run(args, org);
    if (!org || !isJudgingTool(tool)) return result;
    return (await enrichTool(tool, args, result, org)) as R;
  });
}

function parseJsonTool(result: unknown): Record<string, unknown> | null {
  if (!result || typeof result !== "object") return null;
  const text = (result as { content?: { text?: unknown }[] }).content?.[0]?.text;
  if (typeof text !== "string") return null;
  try {
    const v = JSON.parse(text) as unknown;
    return v && typeof v === "object" ? (v as Record<string, unknown>) : null;
  } catch {
    return null;
  }
}

async function souvenirSlot(org: OrgRow, slot: HorizonSlot): Promise<Souvenir[]> {
  if (!slot.crm_id || slot.refus) return [];
  return recordPieces({
    orgId: org.id,
    dealHash: dealHash(org.id, slot.crm_id, slot.nom),
    pieces: (slot.etats ?? []).map((e) => ({ id: e.id, etat: e.etat })),
    amountBucket: amountBucket(slot.montant),
    claimedStage: slot.etape,
    denouement: null,
  });
}

async function enrichTool(
  tool: string,
  args: Record<string, unknown>,
  result: unknown,
  org: OrgRow,
): Promise<unknown> {
  const data = parseJsonTool(result);
  if (!data) return result;
  const extra = trialExtras(org);
  let souvenir: Souvenir[] = [];

  if (tool === "pipe_review" && Array.isArray(args.deals)) {
    const deals = args.deals as PipeDeal[];
    const review = data as unknown as PipeReview;
    for (let i = 0; i < deals.length; i++) {
      const d = deals[i];
      const verdict = review.deals[i];
      if (!verdict || verdict.refus) continue;
      souvenir = souvenir.concat(
        await recordPieces({
          orgId: org.id,
          dealHash: dealHash(org.id, d.crm_id, d.nom),
          pieces: (verdict.etats ?? []).map((e) => ({ id: e.id, etat: e.etat })),
          amountBucket: amountBucket(d.montant),
          claimedStage: d.etape?.trim() ?? null,
          denouement: d.denouement ?? null,
        }),
      );
    }
    return jsonTool({ ...data, souvenir, ...extra });
  }

  if (tool === "plan_horizon") {
    const plan = data as unknown as HorizonPlan;
    for (const slot of plan.agenda ?? []) {
      souvenir = souvenir.concat(await souvenirSlot(org, slot));
    }
    return jsonTool({ ...data, souvenir, ...extra });
  }

  const deal = args as DealInput;
  let pieces = (data as unknown as Audit).pieces;
  if (!pieces?.length) {
    pieces = scoreDeal(deal).pieces;
  }
  const remontees = (data as unknown as Audit).remontees ?? [];
  souvenir = await recordPieces({
    orgId: org.id,
    dealHash: dealHash(org.id, deal.crm_id, deal.nom),
    pieces: pieces.map((p) => ({
      id: p.id,
      etat: p.etat,
      reflexe: remontees.find((r) => r.piece === p.id)?.reflexe ?? null,
    })),
    amountBucket: amountBucket(deal.montant),
    claimedStage: deal.etape?.trim() ?? null,
    denouement: deal.denouement ?? null,
  });
  return jsonTool({ ...data, souvenir, ...extra });
}
