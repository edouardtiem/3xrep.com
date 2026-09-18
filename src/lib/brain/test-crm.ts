import type { HorizonItem } from "./horizon";
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
    crm_id: nonempty(row.id),
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

/** Frozen clock for plan_horizon tests. Same day as test.agenda / test.taches. */
export const HORIZON_NOW = "2026-09-16T08:00:00+02:00";

export type TestAgendaRow = {
  id: string;
  opportunite_id: string;
  starts_at: string;
  titre: string;
};

export type TestTacheRow = {
  id: string;
  opportunite_id: string;
  due_at: string;
  titre: string;
};

export type TestCourrielRow = {
  id: string;
  opportunite_id: string;
  occurred_at: string;
  sujet: string;
  corps: string;
  sens: "entrant" | "sortant";
};

function destFrom(corps: string): string | undefined {
  const line = corps.split("\n").find((l) => /^À:\s+/u.test(l));
  const t = line?.replace(/^À:\s+/u, "").trim();
  return t || undefined;
}

function extraire(corps: string): string {
  return corps.replace(/\s+/g, " ").trim().slice(0, 280);
}

function withMail(deal: PipeDeal, row: TestCourrielRow): PipeDeal {
  const mails = [deal.mails, row.corps].filter(Boolean).join("\n\n---\n\n");
  const exhibits = [...(deal.exhibits ?? [])];
  if (row.sens === "entrant") {
    exhibits.push({
      source: "mail",
      auteur: "prospect",
      citation: extraire(row.corps),
      date: row.occurred_at.slice(0, 10),
    });
  }
  return {
    ...deal,
    mails,
    evidence: deal.evidence ?? "emails",
    exhibits: exhibits.length ? exhibits : undefined,
  };
}

/** Build plan_horizon items from test.agenda / test.taches / test.courriels + deal_input. */
export function toHorizonItems(input: {
  deals: TestCrmDealRow[];
  agenda: TestAgendaRow[];
  taches: TestTacheRow[];
  courriels: TestCourrielRow[];
}): HorizonItem[] {
  const byId = new Map(input.deals.map((row) => [row.id, toPipeDeal(row)]));
  const items: HorizonItem[] = [];
  for (const row of input.agenda) {
    const deal = byId.get(row.opportunite_id);
    if (!deal) continue;
    items.push({ kind: "rdv", quand: row.starts_at, titre: row.titre, deal });
  }
  for (const row of input.taches) {
    const deal = byId.get(row.opportunite_id);
    if (!deal) continue;
    items.push({ kind: "tache", quand: row.due_at, titre: row.titre, deal });
  }
  for (const row of input.courriels) {
    const deal = byId.get(row.opportunite_id);
    if (!deal) continue;
    items.push({
      kind: "mail",
      quand: row.occurred_at,
      titre: row.sujet,
      deal: withMail(deal, row),
      mail: {
        sens: row.sens,
        extrait: extraire(row.corps),
        destinataire: destFrom(row.corps),
      },
    });
  }
  return items;
}

/** Rows that match supabase/migrations/20260916180000_test_horizon_day.sql */
export function horizonDayRows(): {
  deals: TestCrmDealRow[];
  agenda: TestAgendaRow[];
  taches: TestTacheRow[];
  courriels: TestCourrielRow[];
} {
  const deals: TestCrmDealRow[] = [
    {
      id: "2c11a1f1-b343-4cd0-92f1-4fc0b21c88df",
      nom: "Nordik",
      etape: "Négociation",
      montant: "90000",
      close_date: "2026-09-30",
      derniere_modif: "2026-09-08T10:00:00.000Z",
      notes: "Economic Buyer: ok. Champion: Julien. Stage = Negotiation.",
      mails: "Julien, merci pour ce matin.",
      meetings: "2026-09-08 - Découverte ops - Julien Rault",
      transcript:
        "Julien: « de toute façon c'est moi qui fais tourner l'outil au quotidien ». Deux jours perdus par mois. On a l'habitude de signer en décembre.",
      next_step: "Send contract Friday",
      evidence: "transcript",
      exhibits: [
        {
          nom: "Julien",
          date: "2026-09-08",
          sens: "affirme",
          piece: "qui-tranche",
          titre: "ops",
          auteur: "prospect",
          source: "transcript",
          citation: "c'est moi qui fais tourner l'outil au quotidien",
          test_pose: false,
        },
        {
          nom: "AE",
          sens: "affirme",
          piece: "qui-tranche",
          auteur: "rep",
          source: "note",
          citation: "Economic Buyer: ok",
          test_pose: false,
        },
      ],
    },
    {
      id: "38caa5a3-0348-434b-9185-0035d635b021",
      nom: "Dune",
      etape: "Négociation",
      montant: 45000,
      close_date: "2026-09-15",
      derniere_modif: "2026-07-01T10:00:00.000Z",
      notes: null,
      mails: null,
      meetings: null,
      transcript: null,
      next_step: null,
      evidence: null,
      exhibits: [],
    },
    {
      id: "a1000000-0000-4000-8000-000000000003",
      nom: "Helios",
      etape: "Proposition",
      montant: 180000,
      close_date: "2026-10-15",
      derniere_modif: "2026-09-10T14:30:00.000Z",
      notes: null,
      mails: "Marc, Léo, voici le fil du comité du 22.",
      meetings: "2026-09-10 - Découverte usine - Marc Duhamel",
      transcript: "on perd trois heures par équipe à recoller les ordres de fabrication",
      next_step: "Relancer Marc pour le comité du 22",
      evidence: "transcript",
      exhibits: [
        {
          nom: "Marc Duhamel",
          date: "2026-09-10",
          sens: "affirme",
          piece: "besoin",
          titre: "directeur d'usine",
          auteur: "prospect",
          source: "transcript",
          citation: "on perd trois heures par équipe à recoller les ordres de fabrication",
          test_pose: false,
        },
      ],
    },
    {
      id: "a1000000-0000-4000-8000-000000000004",
      nom: "Brume",
      etape: "Découverte",
      montant: 62000,
      close_date: "2026-11-30",
      derniere_modif: "2026-09-09T09:15:00.000Z",
      notes: null,
      mails: null,
      meetings: "2026-09-09 - Entrepôt - Inès Calvet",
      transcript: "on rate encore des quais parce que le planning est dans trois tableurs",
      next_step: "Call avec Inès la semaine prochaine",
      evidence: "transcript",
      exhibits: [
        {
          nom: "Inès Calvet",
          date: "2026-09-09",
          sens: "affirme",
          piece: "besoin",
          titre: "responsable entrepôt",
          auteur: "prospect",
          source: "transcript",
          citation: "on rate encore des quais parce que le planning est dans trois tableurs",
          test_pose: false,
        },
      ],
    },
    {
      id: "a1000000-0000-4000-8000-000000000005",
      nom: "Cèdre",
      etape: "Qualification",
      montant: 38000,
      close_date: "2026-10-31",
      derniere_modif: "2026-09-07T16:00:00.000Z",
      notes: null,
      mails: "On cherche à remplacer nos tableaux de suivi des polices entreprises.",
      meetings: null,
      transcript: null,
      next_step: "Répondre au mail de Thomas",
      evidence: "emails",
      exhibits: [],
    },
    {
      id: "a1000000-0000-4000-8000-000000000007",
      nom: "Nacre",
      etape: "Découverte",
      montant: 28000,
      close_date: "2026-12-15",
      derniere_modif: "2026-09-05T13:40:00.000Z",
      notes: null,
      mails: null,
      meetings: "2026-09-05 - RH - Sophie Lang",
      transcript: "on perd quatre jours par mois rien que sur le planning des équipes",
      next_step: "Envoyer un résumé des quatre jours perdus",
      evidence: "transcript",
      exhibits: [
        {
          nom: "Sophie Lang",
          date: "2026-09-05",
          sens: "affirme",
          piece: "enjeu-chiffre",
          titre: "responsable RH",
          auteur: "prospect",
          source: "transcript",
          citation: "on perd quatre jours par mois rien que sur le planning des équipes",
          test_pose: false,
        },
      ],
    },
  ];

  return {
    deals,
    agenda: [
      {
        id: "e1000000-0000-4000-8000-000000000401",
        opportunite_id: "2c11a1f1-b343-4cd0-92f1-4fc0b21c88df",
        starts_at: "2026-09-16T14:00:00+02:00",
        titre: "Découverte - Julien Rault",
      },
      {
        id: "e1000000-0000-4000-8000-000000000402",
        opportunite_id: "38caa5a3-0348-434b-9185-0035d635b021",
        starts_at: "2026-09-16T16:00:00+02:00",
        titre: "Proposition commerciale - Dune",
      },
      {
        id: "e1000000-0000-4000-8000-000000000403",
        opportunite_id: "a1000000-0000-4000-8000-000000000003",
        starts_at: "2026-09-22T14:00:00+02:00",
        titre: "Comité - Helios",
      },
      {
        id: "e1000000-0000-4000-8000-000000000404",
        opportunite_id: "a1000000-0000-4000-8000-000000000007",
        starts_at: "2026-10-06T10:00:00+02:00",
        titre: "Revue compte - Nacre",
      },
    ],
    taches: [
      {
        id: "f1000000-0000-4000-8000-000000000501",
        opportunite_id: "a1000000-0000-4000-8000-000000000005",
        due_at: "2026-09-16T10:00:00+02:00",
        titre: "Relancer Thomas",
      },
      {
        id: "f1000000-0000-4000-8000-000000000502",
        opportunite_id: "a1000000-0000-4000-8000-000000000004",
        due_at: "2026-09-10T18:00:00+02:00",
        titre: "Call avec Inès - en retard",
      },
    ],
    courriels: [
      {
        id: "c1000000-0000-4000-8000-000000000206",
        opportunite_id: "a1000000-0000-4000-8000-000000000005",
        occurred_at: "2026-09-16T07:30:00+02:00",
        sujet: "Re: Besoin planning - Cèdre Courtage",
        corps: `De: Thomas Keller
À: Léa Morel

Léa,

Envoyez-nous votre plaquette, on verra après. Pas le temps d'un appel cette semaine.

Thomas Keller
Responsable développement - Cèdre Courtage`,
        sens: "entrant",
      },
    ],
  };
}
