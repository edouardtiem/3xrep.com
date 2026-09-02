-- orgs: une clé = un workspace = 99 € / mois. Service role only.
create table if not exists public.orgs (
  id uuid primary key default gen_random_uuid(),
  key_hash text not null unique,
  key_plain text,
  stripe_customer_id text,
  stripe_session_id text unique,
  status text not null default 'active',
  created_at timestamptz not null default now()
);

alter table public.orgs enable row level security;
