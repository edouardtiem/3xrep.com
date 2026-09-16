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
    const contextual = withOrgContext(tool, args, org);
    const result = await run(contextual, org);
    if (!org || !isJudgingTool(tool)) return result;
    try { return (await enrichTool(tool, contextual, result, org)) as R; }
    catch (err) {
      console.error("3xrep memory unavailable", err instanceof Error ? err.message : "error");
      const data = parseJsonTool(result);
      return (data ? jsonTool({ ...data, ...trialExtras(org), memoire: { etat: "indisponible", raison: "Le jugement est disponible, mais le souvenir n’a pas été enregistré. Ne pas prétendre s’en souvenir." } }) : result) as R;
    }
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

export function withOrgContext<Args extends Record<string, unknown>>(tool: string, args: Args, org: OrgRow | null): Args {
  if (!org || !isJudgingTool(tool)) return args;
  const contextual = (d: DealInput) => ({ ...d, contexte_entreprise: { ...org.sales_context, entreprise: org.company_blurb ?? undefined } });
  if (tool === "pipe_review" && Array.isArray(args.deals)) return { ...args, deals: args.deals.map(d => contextual(d as DealInput)) };
  if (tool === "plan_horizon" && Array.isArray(args.items)) return { ...args, items: args.items.map(i => ({ ...i, deal: contextual(i.deal) })) };
  return { ...args, contexte_entreprise: { ...org.sales_context, entreprise: org.company_blurb ?? undefined } };
}

type Recorder = typeof recordPieces;

export async function enrichTool(
  tool: string,
  args: Record<string, unknown>,
  result: unknown,
  org: OrgRow,
  record: Recorder = recordPieces,
): Promise<unknown> {
  const data = parseJsonTool(result);
  if (!data) return result;
  const extra = trialExtras(org);
  let souvenir: Souvenir[] = [];
  const remember = async (deal: DealInput, pieces: Parameters<Recorder>[0]["pieces"]): Promise<Souvenir[]> => {
    if (!deal.crm_id?.trim()) return [];
    const rows = await record({ orgId: org.id, dealHash: dealHash(org.id, deal.crm_id), pieces,
      amountBucket: amountBucket(deal.montant), claimedStage: deal.etape?.trim() ?? null,
      denouement: deal.denouement ?? null });
    return rows.map(row => ({ ...row, crm_id: deal.crm_id!.trim(), affaire: deal.nom }));
  };

  if (tool === "pipe_review" && Array.isArray(args.deals)) {
    const deals = args.deals as PipeDeal[];
    const review = data as unknown as PipeReview;
    const seen = new Set<string>();
    const conflicts: string[] = [];
    for (let i = 0; i < deals.length; i++) {
      const d = deals[i];
      const verdict = review.deals[i];
      if (!verdict || verdict.refus) continue;
      if (d.crm_id) {
        if (seen.has(d.crm_id)) continue;
        seen.add(d.crm_id);
        const same = deals.map((deal, index) => ({ deal, verdict: review.deals[index] })).filter(x => x.deal.crm_id === d.crm_id);
        if (same.some(x => JSON.stringify(x.verdict?.etats) !== JSON.stringify(verdict.etats) || x.deal.denouement !== d.denouement)) {
          conflicts.push(d.crm_id); continue;
        }
      }
      souvenir = souvenir.concat(await remember(d, verdict.etats));
    }
    if (conflicts.length) data.memoire = { etat: "conflit", affaires: conflicts, raison: "Rassembler les sources contradictoires avant de mémoriser." };
    return jsonTool({ ...data, souvenir, ...extra });
  }

  if (tool === "plan_horizon") {
    const plan = data as unknown as HorizonPlan;
    // A meeting + a task on the same deal is one observation. Conflicting snapshots
    // must not silently overwrite each other: ask the host to reconcile first.
    const groups = new Map<string, HorizonSlot[]>();
    for (const slot of plan.agenda ?? []) {
      if (!slot.crm_id || slot.refus) continue;
      const group = groups.get(slot.crm_id) ?? [];
      group.push(slot); groups.set(slot.crm_id, group);
    }
    const conflits: string[] = [];
    for (const [id, slots] of groups) {
      const fingerprint = (s: HorizonSlot) => JSON.stringify({ etats: [...s.etats].sort((a,b) => a.id.localeCompare(b.id)), denouement: s.denouement });
      if (slots.some(s => fingerprint(s) !== fingerprint(slots[0]))) { conflits.push(id); continue; }
      const slot = slots[0];
      souvenir = souvenir.concat(await remember({ crm_id: id, nom: slot.nom, etape: slot.etape ?? undefined, montant: slot.montant, denouement: slot.denouement }, slot.etats));
    }
    if (conflits.length) data.memoire = { etat: "conflit", affaires: conflits, raison: "Plusieurs états différents reçus pour la même affaire. Rassembler les sources avant de mémoriser." };
    return jsonTool({ ...data, souvenir, ...extra });
  }

  const deal = args as DealInput;
  let pieces = (data as unknown as Audit).pieces;
  if (!pieces?.length) {
    pieces = scoreDeal(deal).pieces;
  }
  const remontees = (data as unknown as Audit).remontees ?? [];
  if (!data.refus) souvenir = await remember(deal, pieces.map(p => ({
    id: p.id, etat: p.etat, reflexe: remontees.find(r => r.piece === p.id)?.reflexe ?? null,
  })));
  return jsonTool({ ...data, souvenir, ...extra });
}
