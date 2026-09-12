-- Test CRM fixture. Not the product. Not a customer file.
-- Lives in schema `test` so public.orgs / mcp_calls / x_tweets stay untouched.
-- A second Supabase project was blocked (free-plan limit).
-- Columns on test.deal_input match DealInput / pipeDealSchema (src/lib/mcp-schema.ts).

create schema if not exists test;

comment on schema test is
  '3xrep brain test fixture. Fake B2B deals. Not production CRM. Not customer data.';

create table if not exists test.commerciaux (
  id uuid primary key,
  nom text not null,
  titre text not null
);

comment on table test.commerciaux is 'Fake sales reps for brain tests. Not real people.';

create table if not exists test.opportunites (
  id uuid primary key,
  commercial_id uuid not null references test.commerciaux (id),
  nom text not null,
  societe text not null,
  etape text not null,
  montant numeric,
  close_date text,
  derniere_modif timestamptz,
  next_step text,
  exhibits jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  constraint test_opportunites_etape_ouverte check (
    etape not in ('Gagné', 'Perdu', 'Closed Won', 'Closed Lost')
  )
);

create index if not exists test_opportunites_commercial_id_idx
  on test.opportunites (commercial_id);

comment on table test.opportunites is
  'Ten open fake opportunities. Nordik = evidence. Dune = amount, no call.';

create table if not exists test.appels (
  id uuid primary key,
  opportunite_id uuid not null references test.opportunites (id) on delete cascade,
  occurred_at timestamptz not null,
  titre text not null,
  transcript text not null
);

create index if not exists test_appels_opportunite_id_idx
  on test.appels (opportunite_id);

comment on table test.appels is 'Fake call transcripts (text only). 3xrep does not join calls.';

create table if not exists test.courriels (
  id uuid primary key,
  opportunite_id uuid not null references test.opportunites (id) on delete cascade,
  occurred_at timestamptz not null,
  sujet text not null,
  corps text not null
);

create index if not exists test_courriels_opportunite_id_idx
  on test.courriels (opportunite_id);

comment on table test.courriels is 'Fake email threads for brain tests.';

create table if not exists test.notes (
  id uuid primary key,
  opportunite_id uuid not null references test.opportunites (id) on delete cascade,
  occurred_at timestamptz not null,
  corps text not null
);

create index if not exists test_notes_opportunite_id_idx
  on test.notes (opportunite_id);

comment on table test.notes is 'Fake AE notes (grade B claims, never held as proof).';

create or replace view test.deal_input
  with (security_invoker = true) as
select
  o.id,
  o.nom,
  o.societe,
  c.nom as commercial,
  o.etape,
  o.montant,
  o.close_date,
  o.derniere_modif,
  (
    select string_agg(n.corps, E'\n\n---\n\n' order by n.occurred_at)
    from test.notes n
    where n.opportunite_id = o.id
  ) as notes,
  (
    select string_agg(
      format('Sujet: %s\n%s', e.sujet, e.corps),
      E'\n\n---\n\n'
      order by e.occurred_at
    )
    from test.courriels e
    where e.opportunite_id = o.id
  ) as mails,
  (
    select string_agg(
      format('%s — %s', to_char(a.occurred_at at time zone 'utc', 'YYYY-MM-DD'), a.titre),
      E'\n'
      order by a.occurred_at
    )
    from test.appels a
    where a.opportunite_id = o.id
  ) as meetings,
  (
    select string_agg(a.transcript, E'\n\n---\n\n' order by a.occurred_at)
    from test.appels a
    where a.opportunite_id = o.id
  ) as transcript,
  o.next_step,
  case
    when exists (select 1 from test.appels a where a.opportunite_id = o.id) then 'transcript'
    when exists (select 1 from test.courriels e where e.opportunite_id = o.id) then 'emails'
    when exists (select 1 from test.notes n where n.opportunite_id = o.id) then 'notes'
    else null
  end as evidence,
  o.exhibits,
  o.created_at
from test.opportunites o
join test.commerciaux c on c.id = o.commercial_id;

comment on view test.deal_input is
  'Maps the test CRM to DealInput / pipeDealSchema. Feed pipe_review / audit_deal.';

alter table test.commerciaux enable row level security;
alter table test.opportunites enable row level security;
alter table test.appels enable row level security;
alter table test.courriels enable row level security;
alter table test.notes enable row level security;

revoke all on schema test from public, anon, authenticated;
grant usage on schema test to postgres, service_role;
grant all on all tables in schema test to postgres, service_role;
grant all on all sequences in schema test to postgres, service_role;

alter default privileges in schema test
  grant all on tables to postgres, service_role;
alter default privileges in schema test
  grant all on sequences to postgres, service_role;

-- Public mirror (already existed as a 2-row dogfood table). Same DealInput columns.
-- Lets service-role supabase-js read the fixture without exposing schema test on the Data API.
create table if not exists public.test_crm_opportunities (
  id uuid primary key default gen_random_uuid(),
  nom text not null,
  etape text,
  montant numeric,
  close_date text,
  derniere_modif timestamptz,
  notes text,
  mails text,
  meetings text,
  transcript text,
  next_step text,
  evidence text,
  exhibits jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  societe text,
  commercial text
);

alter table public.test_crm_opportunities enable row level security;

comment on table public.test_crm_opportunities is
  'Denormalized mirror of test.deal_input. Fake CRM for brain tests. Not the product. Not customer data.';
