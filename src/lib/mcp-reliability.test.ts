import assert from "node:assert/strict";
import { test } from "node:test";
import { enrichTool, withOrgContext } from "./mcp-gate";
import { devOrg } from "./orgs";
import { jsonTool } from "./mcp-schema";
import { planHorizon } from "./brain/horizon";
import { pipeReview } from "./brain/pipe";
import { dealHash, type recordPieces } from "./skeleton";
import { sommePortesCassees } from "./corrections";

const unpack = (v: unknown) => JSON.parse((v as ReturnType<typeof jsonTool>).content[0].text);
const org = devOrg();

test("memory has no shared anonymous identity and does not truncate CRM identifiers", () => {
  assert.equal(dealHash("org", ""), null);
  assert.notEqual(dealHash("org", "a".repeat(210) + "1"), dealHash("org", "a".repeat(210) + "2"));
});

test("one deal in two calendar slots creates one memory observation", async () => {
  const calls: Parameters<typeof recordPieces>[0][] = [];
  const record: typeof recordPieces = async input => { calls.push(input); return []; };
  const deal = { crm_id: "a", nom: "Acme", notes: "Premier échange", denouement: "ouvert" as const };
  const args = { fenetre: 1 as const, maintenant: "2026-09-16T08:00:00+02:00", items: [
    { kind: "rdv" as const, deal }, { kind: "tache" as const, deal },
  ] };
  await enrichTool("plan_horizon", args, jsonTool(planHorizon(args)), org, record);
  assert.equal(calls.length, 1);
  assert.equal(calls[0].denouement, "ouvert");
});

test("conflicting snapshots are not silently persisted", async () => {
  let calls = 0;
  const deals = [{ crm_id: "a", notes: "Premier échange" }, { crm_id: "a", notes: "Le DAF ne signe pas." }];
  const result = unpack(await enrichTool("pipe_review", { deals }, jsonTool(pipeReview(deals)), org, async () => { calls++; return []; }));
  assert.equal(calls, 0);
  assert.equal(result.memoire.etat, "conflit");
});

test("organisation context reaches every nested deal", () => {
  const profile = { ...org, sales_context: { cycle: "long" as const }, company_blurb: "Équipement industriel" };
  const args = withOrgContext("pipe_review", { deals: [{ nom: "A" }] }, profile);
  assert.equal((args.deals[0] as { contexte_entreprise?: { cycle?: string } }).contexte_entreprise?.cycle, "long");
});

test("same-name opportunities keep separate correction amounts", () => {
  assert.equal(sommePortesCassees([{ crm_id: "a", nom: "Acme", montant: 10 }, { crm_id: "b", nom: "Acme", montant: 20 }], [{ type: "etape_illegale", crm_id: "a", deal: "Acme" }]), 10);
});
