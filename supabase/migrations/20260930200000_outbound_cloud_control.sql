-- Operational acquisition state; never readable through a browser session.
create table public.outbound_mailboxes (
  id bigint primary key,
  email text not null unique,
  domain text not null,
  approved boolean not null default false,
  state jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);
create table public.outbound_control_runs (
  id uuid primary key,
  started_at timestamptz not null default now(),
  finished_at timestamptz,
  status text not null check (status in ('running', 'success', 'failed')),
  result jsonb,
  error_code text
);
create table public.outbound_control_actions (
  id uuid primary key default gen_random_uuid(),
  run_id uuid not null references public.outbound_control_runs(id),
  mailbox_id bigint references public.outbound_mailboxes(id),
  action text not null,
  decision jsonb not null,
  status text not null check (status in ('pending', 'confirmed', 'failed')),
  created_at timestamptz not null default now()
);
create table public.outbound_control_lease (
  id integer primary key check (id = 1),
  owner uuid,
  expires_at timestamptz not null default '-infinity'
);
insert into public.outbound_control_lease (id) values (1);

create function public.claim_outbound_control(run_id uuid) returns boolean
language plpgsql security definer set search_path = public as $$
begin
  update public.outbound_control_lease
    set owner = run_id, expires_at = now() + interval '5 minutes'
    where id = 1 and expires_at < now();
  return found;
end;
$$;
create function public.release_outbound_control(run_id uuid) returns void
language sql security definer set search_path = public as $$
  update public.outbound_control_lease set owner = null, expires_at = '-infinity'
    where id = 1 and owner = run_id;
$$;
revoke all on function public.claim_outbound_control(uuid), public.release_outbound_control(uuid) from public, anon, authenticated;
grant execute on function public.claim_outbound_control(uuid), public.release_outbound_control(uuid) to service_role;

alter table public.outbound_mailboxes enable row level security;
alter table public.outbound_control_runs enable row level security;
alter table public.outbound_control_actions enable row level security;
alter table public.outbound_control_lease enable row level security;
revoke all on public.outbound_mailboxes, public.outbound_control_runs, public.outbound_control_actions, public.outbound_control_lease from anon, authenticated;
grant all on public.outbound_mailboxes, public.outbound_control_runs, public.outbound_control_actions, public.outbound_control_lease to service_role;

-- Install the job only after its function and secret have been tested.
-- The subsequent schedule file uses Vault rather than embedding credentials.
