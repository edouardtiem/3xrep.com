-- Preserve discovery even when no address is found. No fabricated email rows.
create table public.outbound_sourcing_candidates (
  id uuid primary key default gen_random_uuid(),
  source_contact_id text not null unique,
  filter_id bigint not null,
  profile jsonb not null,
  company_domain text not null,
  qualified boolean not null,
  qualification_reason text not null,
  email text,
  discovery_state text not null default 'new' check(discovery_state in ('new','requested','pending','complete','no_email')),
  email_verification_status text not null default 'unverified' check(email_verification_status in ('unverified','valid','invalid','accept_all','unknown','error','no_email')),
  verifier_status text,
  verification_checked_at timestamptz,
  verification_call_id text,
  verification_request_id uuid,
  verification_cost_micro integer check(verification_cost_micro=0),
  prospect_id uuid references public.outbound_prospects(id),
  sequence_id text references public.outbound_sequences(id),
  import_state text not null default 'pending' check(import_state in ('pending','imported','excluded')),
  exclusion_reason text,
  requested_at timestamptz,
  imported_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index outbound_sourcing_pending on public.outbound_sourcing_candidates(discovery_state,import_state);
create table public.outbound_sourcing_runs (
  id uuid primary key,
  mode text not null check(mode in ('test','daily')),
  sending_date date not null,
  started_at timestamptz not null default now(),
  finished_at timestamptz,
  status text not null check(status in ('running','success','failed')),
  result jsonb,
  error_code text
);
create table public.outbound_sourcing_config (
  id integer primary key check(id=1),
  enabled boolean not null default false,
  validated_run_id uuid references public.outbound_sourcing_runs(id),
  max_daily_contacts integer not null default 50 check(max_daily_contacts between 1 and 50),
  buffer_days integer not null default 2 check(buffer_days between 1 and 3),
  lease_owner uuid,
  lease_expires_at timestamptz not null default '-infinity',
  last_completed_date date
);
insert into public.outbound_sourcing_config(id) values(1);
create function public.claim_outbound_sourcing(run_id uuid) returns boolean
language plpgsql security definer set search_path=public as $$
begin
 update public.outbound_sourcing_config set lease_owner=run_id,lease_expires_at=now()+interval '5 minutes'
 where id=1 and lease_expires_at<now();
 return found;
end;$$;
create function public.release_outbound_sourcing(run_id uuid) returns void
language sql security definer set search_path=public as $$
 update public.outbound_sourcing_config set lease_owner=null,lease_expires_at='-infinity' where id=1 and lease_owner=run_id;
$$;
revoke all on function public.claim_outbound_sourcing(uuid),public.release_outbound_sourcing(uuid) from public,anon,authenticated;
grant execute on function public.claim_outbound_sourcing(uuid),public.release_outbound_sourcing(uuid) to service_role;
alter table public.outbound_sourcing_candidates enable row level security;
alter table public.outbound_sourcing_runs enable row level security;
alter table public.outbound_sourcing_config enable row level security;
revoke all on public.outbound_sourcing_candidates,public.outbound_sourcing_runs,public.outbound_sourcing_config from anon,authenticated;
grant all on public.outbound_sourcing_candidates,public.outbound_sourcing_runs,public.outbound_sourcing_config to service_role;
