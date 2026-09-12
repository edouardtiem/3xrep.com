import type { PipeDeal } from "./pipe";
import type { Evidence, Exhibit } from "./types";

export type TestCrmDealRow = {
  id: string;
  nom: string;
  societe?: string | null;
  commercial?: string | null;
  etape: string | null;
  montant: number | string | null;
  close_date: string | null;
  derniere_modif: string | null;
  notes: string | null;
  mails: string | null;
  meetings: string | null;
  transcript: string | null;
  next_step: string | null;
  evidence: string | null;
  exhibits: Exhibit[] | null;
};

/** Source of truth: schema `test`. Public mirror for supabase-js. */
export const TEST_CRM_DEAL_INPUT_SQL = "select * from test.deal_input order by nom";
export const TEST_CRM_PUBLIC_TABLE = "test_crm_opportunities";

const EVIDENCE = new Set<Evidence>(["transcript", "notes", "emails", "chat_paste"]);

function nonempty(s: string | null | undefined): string | undefined {
  const t = s?.trim();
  return t ? t : undefined;
}

function montantOf(value: TestCrmDealRow["montant"]): number | undefined {
  if (value == null || value === "") return undefined;
  const n = typeof value === "number" ? value : Number(value);
  return Number.isFinite(n) ? n : undefined;
}

function evidenceOf(value: string | null | undefined): Evidence | undefined {
  if (!value || !EVIDENCE.has(value as Evidence)) return undefined;
  return value as Evidence;
}

/** Map a test CRM row (view or public mirror) to what pipe_review / audit_deal already eat. */
export function toPipeDeal(row: TestCrmDealRow): PipeDeal {
  const exhibits = Array.isArray(row.exhibits) && row.exhibits.length > 0 ? row.exhibits : undefined;
  return {
    nom: row.nom,
    etape: nonempty(row.etape),
    montant: montantOf(row.montant),
    closeDate: nonempty(row.close_date),
    derniereModif: nonempty(row.derniere_modif),
    notes: nonempty(row.notes),
    mails: nonempty(row.mails),
    meetings: nonempty(row.meetings),
    transcript: nonempty(row.transcript),
    nextStep: nonempty(row.next_step),
    evidence: evidenceOf(row.evidence),
    exhibits,
  };
}
