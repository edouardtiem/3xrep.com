-- Test CRM: one typical day (16 Sept 2026, Paris). Not the product. Not customer data.
-- Clock for brain tests: 2026-09-16T08:00:00+02:00
-- Nordik discovery 14:00. Dune proposal 16:00 (no call — must refuse, not prep).
-- Helios 22 Sept (fenetre 7). Nacre 6 Oct (fenetre 30).
-- Tasks: Cèdre due today, Brume overdue. Inbound hunt reply on Cèdre: do not send a deck.

create table if not exists test.agenda (
  id uuid primary key,
  opportunite_id uuid not null references test.opportunites (id) on delete cascade,
  starts_at timestamptz not null,
  titre text not null
);

create index if not exists test_agenda_opportunite_id_idx
  on test.agenda (opportunite_id);

create index if not exists test_agenda_starts_at_idx
  on test.agenda (starts_at);

comment on table test.agenda is
  'Fake calendar holds for horizon tests. Claude would read these from their Calendar MCP.';

create table if not exists test.taches (
  id uuid primary key,
  opportunite_id uuid not null references test.opportunites (id) on delete cascade,
  due_at timestamptz not null,
  titre text not null
);

create index if not exists test_taches_opportunite_id_idx
  on test.taches (opportunite_id);

create index if not exists test_taches_due_at_idx
  on test.taches (due_at);

comment on table test.taches is
  'Fake CRM / inbox tasks for horizon tests. One due today, one overdue.';

alter table test.courriels
  add column if not exists sens text not null default 'sortant';

alter table test.courriels
  drop constraint if exists test_courriels_sens_check;

alter table test.courriels
  add constraint test_courriels_sens_check check (sens in ('entrant', 'sortant'));

comment on column test.courriels.sens is
  'entrant = they wrote. sortant = we wrote. Claude would pass this from Gmail.';

insert into test.agenda (id, opportunite_id, starts_at, titre) values
(
  'e1000000-0000-4000-8000-000000000401',
  '2c11a1f1-b343-4cd0-92f1-4fc0b21c88df',
  '2026-09-16 14:00:00+02',
  'Découverte — Julien Rault'
),
(
  'e1000000-0000-4000-8000-000000000402',
  '38caa5a3-0348-434b-9185-0035d635b021',
  '2026-09-16 16:00:00+02',
  'Proposition commerciale — Dune'
),
(
  'e1000000-0000-4000-8000-000000000403',
  'a1000000-0000-4000-8000-000000000003',
  '2026-09-22 14:00:00+02',
  'Comité — Helios'
),
(
  'e1000000-0000-4000-8000-000000000404',
  'a1000000-0000-4000-8000-000000000007',
  '2026-10-06 10:00:00+02',
  'Revue compte — Nacre'
)
on conflict (id) do update set
  opportunite_id = excluded.opportunite_id,
  starts_at = excluded.starts_at,
  titre = excluded.titre;

insert into test.taches (id, opportunite_id, due_at, titre) values
(
  'f1000000-0000-4000-8000-000000000501',
  'a1000000-0000-4000-8000-000000000005',
  '2026-09-16 10:00:00+02',
  'Relancer Thomas'
),
(
  'f1000000-0000-4000-8000-000000000502',
  'a1000000-0000-4000-8000-000000000004',
  '2026-09-10 18:00:00+02',
  'Call avec Inès — en retard'
)
on conflict (id) do update set
  opportunite_id = excluded.opportunite_id,
  due_at = excluded.due_at,
  titre = excluded.titre;

insert into test.courriels (id, opportunite_id, occurred_at, sujet, corps, sens) values
(
  'c1000000-0000-4000-8000-000000000206',
  'a1000000-0000-4000-8000-000000000005',
  '2026-09-16 07:30:00+02',
  'Re: Besoin planning — Cèdre Courtage',
  $t$De: Thomas Keller
À: Léa Morel

Léa,

Envoyez-nous votre plaquette, on verra après. Pas le temps d'un appel cette semaine.

Thomas Keller
Responsable développement — Cèdre Courtage$t$,
  'entrant'
)
on conflict (id) do update set
  opportunite_id = excluded.opportunite_id,
  occurred_at = excluded.occurred_at,
  sujet = excluded.sujet,
  corps = excluded.corps,
  sens = excluded.sens;

alter table test.agenda enable row level security;
alter table test.taches enable row level security;

revoke all on table test.agenda from public, anon, authenticated;
revoke all on table test.taches from public, anon, authenticated;
grant all on table test.agenda to postgres, service_role;
grant all on table test.taches to postgres, service_role;

-- Mirror mails/evidence after the inbound hunt reply.
insert into public.test_crm_opportunities (
  id, nom, societe, commercial, etape, montant, close_date, derniere_modif,
  notes, mails, meetings, transcript, next_step, evidence, exhibits
)
select
  id, nom, societe, commercial, etape, montant, close_date, derniere_modif,
  notes, mails, meetings, transcript, next_step, evidence, exhibits
from test.deal_input
on conflict (id) do update set
  nom = excluded.nom,
  societe = excluded.societe,
  commercial = excluded.commercial,
  etape = excluded.etape,
  montant = excluded.montant,
  close_date = excluded.close_date,
  derniere_modif = excluded.derniere_modif,
  notes = excluded.notes,
  mails = excluded.mails,
  meetings = excluded.meetings,
  transcript = excluded.transcript,
  next_step = excluded.next_step,
  evidence = excluded.evidence,
  exhibits = excluded.exhibits;
