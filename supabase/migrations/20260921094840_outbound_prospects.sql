-- Notre chasse. Pas le produit. Service role only.
create table public.outbound_prospects (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  first_name text,
  last_name text,
  full_name text,
  job_title text,
  company text,
  location text,
  linkedin_url text,
  intent_type text,
  intent_keyword text,
  intent_label text,
  source text not null default 'gojiberry',
  gojiberry_contact_id bigint,
  status text not null check (status in ('to_contact','sent','replied','bounced','unsubscribed','skipped')),
  first_sent_at timestamptz,
  campaign_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (gojiberry_contact_id)
);

create unique index outbound_prospects_email_lower on public.outbound_prospects (lower(email));
create index outbound_prospects_status on public.outbound_prospects (status);

alter table public.outbound_prospects enable row level security;
revoke all on public.outbound_prospects from anon, authenticated;
grant all on public.outbound_prospects to service_role;
