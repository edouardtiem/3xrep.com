-- Item 6: trial orgs, hole log, referral credits. mcp_calls (14 days) unchanged.
alter table public.orgs
  add column if not exists email text,
  add column if not exists trial_days integer not null default 14,
  add column if not exists trial_started_at timestamptz,
  add column if not exists trial_ends_at timestamptz,
  add column if not exists card_deadline_at timestamptz,
  add column if not exists stripe_subscription_id text,
  add column if not exists referral_code text,
  add column if not exists referred_by_org_id uuid references public.orgs (id) on delete set null,
  add column if not exists title text,
  add column if not exists mission text,
  add column if not exists company_url text,
  add column if not exists company_blurb text,
  add column if not exists card_fingerprint text,
  add column if not exists start_token text;

update public.orgs
set referral_code = substr(md5(id::text), 1, 8)
where referral_code is null;

alter table public.orgs alter column referral_code set not null;

create unique index if not exists orgs_referral_code_idx on public.orgs (referral_code);
create unique index if not exists orgs_email_lower_idx on public.orgs (lower(email)) where email is not null;
create unique index if not exists orgs_start_token_idx on public.orgs (start_token) where start_token is not null;

create table if not exists public.judgment_skeleton (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.orgs (id) on delete cascade,
  deal_hash text not null,
  piece text not null,
  etat text not null,
  reflex_id text,
  judged_at timestamptz not null default now(),
  trou_since timestamptz,
  times_trou integer not null default 0,
  amount_bucket text,
  claimed_stage text,
  denouement text,
  unique (org_id, deal_hash, piece)
);

create index if not exists judgment_skeleton_org_idx on public.judgment_skeleton (org_id);

alter table public.judgment_skeleton enable row level security;

create table if not exists public.referral_credits (
  id uuid primary key default gen_random_uuid(),
  parrain_id uuid not null references public.orgs (id) on delete cascade,
  filleul_id uuid not null references public.orgs (id) on delete cascade,
  amount_cents integer not null default 12900,
  status text not null default 'queued',
  stripe_balance_txn text,
  created_at timestamptz not null default now(),
  unique (parrain_id, filleul_id)
);

alter table public.referral_credits enable row level security;
