-- Additive, disabled by default. Use a separate database for preview/test.
create table public.founding_program (
  id boolean primary key default true check (id),
  environment text not null default 'test' check (environment in ('test','production')),
  enabled boolean not null default false,
  ends_at timestamptz,
  transition_days integer not null default 14 check (transition_days between 7 and 60),
  min_sessions integer not null default 3 check (min_sessions between 2 and 100),
  min_active_days integer not null default 3 check (min_active_days between 2 and 60),
  min_outputs integer not null default 3 check (min_outputs between 1 and 1000),
  early_promotion_code text,
  check (not enabled or ends_at is not null)
);
insert into public.founding_program(id) values (true);
alter table public.founding_program enable row level security;

alter table public.orgs
  add column beta_enrolled_at timestamptz,
  add column beta_access_until timestamptz,
  add column founding_state text not null default 'none' check (founding_state in ('none','candidate','qualified','pending','founding','revoked','ineligible')),
  add column founding_granted_at timestamptz,
  add column activated_at timestamptz,
  add column activation_rules jsonb,
  add column comped boolean not null default false,
  add column is_internal boolean not null default false,
  add column acquisition_source text,
  add column acquisition_campaign text,
  add column acquisition_medium text,
  add column admin_note text,
  add column base_billing_blocked boolean not null default false,
  add column checkout_operation uuid,
  add column checkout_started_at timestamptz,
  add column checkout_params jsonb;

-- Permanent ledger: revoked slots are never recycled; org deletion is restricted.
create table public.founding_slots (
  slot integer primary key check (slot between 1 and 20),
  org_id uuid not null unique references public.orgs(id) on delete restrict,
  company_key text not null unique,
  reserved_at timestamptz not null default now(),
  granted_at timestamptz,
  revoked_at timestamptz,
  reason text not null
);
alter table public.founding_slots enable row level security;
create table public.beta_events (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.orgs(id) on delete cascade,
  kind text not null,
  tool text,
  horizon integer check (horizon in (1,7,30)),
  session_id uuid,
  created_at timestamptz not null default now()
);
create index beta_events_org_time on public.beta_events(org_id, created_at);
alter table public.beta_events enable row level security;
create table public.beta_feedback (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.orgs(id) on delete cascade,
  output_id uuid not null references public.beta_events(id) on delete cascade,
  useful boolean not null,
  comment text check (length(comment) <= 1000),
  created_at timestamptz not null default now(),
  unique(org_id, output_id)
);
alter table public.beta_feedback enable row level security;
create table public.founding_audit (
  id bigint generated always as identity primary key,
  org_id uuid references public.orgs(id) on delete restrict,
  action text not null,
  note text not null,
  created_at timestamptz not null default now()
);
alter table public.founding_audit enable row level security;
create table public.base_checkout_sessions (
  session_id text primary key,
  org_id uuid not null references public.orgs(id) on delete restrict,
  created_at timestamptz not null default now()
);
alter table public.base_checkout_sessions enable row level security;

-- Admission is decided in the same transaction as signup, not by a public flag.
create function public.founding_admit() returns trigger language plpgsql set search_path = public as $$
declare p public.founding_program;
begin
  select * into p from public.founding_program where id for share;
  if new.status = 'trial' and new.stripe_subscription_id is null and p.enabled and p.ends_at > now() then
    new.beta_enrolled_at := now();
    new.beta_access_until := p.ends_at + make_interval(days => p.transition_days);
    new.founding_state := 'candidate';
  end if;
  return new;
end $$;
create trigger founding_admit before insert on public.orgs for each row execute function public.founding_admit();
create function public.founding_signup_event() returns trigger language plpgsql set search_path = public as $$
begin
  insert into public.beta_events(org_id,kind) values(new.id,'organization_created');
  if new.founding_state = 'candidate' then
    insert into public.beta_events(org_id,kind) values(new.id,'founding_candidate');
  end if;
  return new;
end $$;
create trigger founding_signup_event after insert on public.orgs for each row execute function public.founding_signup_event();

create function public.record_beta_usage(p_org uuid, p_tool text, p_horizon integer, p_meaningful boolean)
returns uuid language plpgsql security definer set search_path = public as $$
declare o public.orgs; p public.founding_program; last_at timestamptz; sid uuid; eid uuid; n_sessions integer; n_days integer; n_outputs integer;
begin
  select * into strict o from public.orgs where id=p_org for update;
  if o.is_internal then return null; end if;
  if not exists(select 1 from public.beta_events where org_id=p_org and kind='connector_used') then
    insert into public.beta_events(org_id,kind) values(p_org,'connector_used');
  end if;
  if not p_meaningful then return null; end if;
  if p_tool not in ('audit_deal','pipe_review','next_question','objection_map','plan_horizon') then raise exception 'invalid tool'; end if;
  select created_at,session_id into last_at,sid from public.beta_events
    where org_id=p_org and kind='meaningful_output' order by created_at desc limit 1;
  if last_at is null or now()-last_at >= interval '30 minutes' then sid := gen_random_uuid(); end if;
  insert into public.beta_events(org_id,kind,tool,horizon,session_id)
    values(p_org,'meaningful_output',p_tool,p_horizon,sid) returning id into eid;
  select count(distinct session_id),count(distinct (created_at at time zone 'UTC')::date),count(*)
    into n_sessions,n_days,n_outputs from public.beta_events where org_id=p_org and kind='meaningful_output';
  select * into p from public.founding_program where id;
  if n_sessions >= p.min_sessions and n_days >= p.min_active_days and n_outputs >= p.min_outputs then
    if o.activated_at is null then
      update public.orgs set activated_at=now(),activation_rules=jsonb_build_object('min_sessions',p.min_sessions,'min_active_days',p.min_active_days,'min_outputs',p.min_outputs,'sessions',n_sessions,'active_days',n_days,'outputs',n_outputs) where id=p_org;
      insert into public.beta_events(org_id,kind) values(p_org,'activation_achieved');
    end if;
    if o.founding_state='candidate' then
      update public.orgs set founding_state='qualified' where id=p_org;
      insert into public.beta_events(org_id,kind) values(p_org,'founding_qualified');
    end if;
  end if;
  return eid;
end $$;

-- An unfinished checkout operation is deliberately not expired automatically.
-- Retry that same operation (Stripe idempotency) before granting a slot.
create function public.begin_base_checkout(p_org uuid,p_params jsonb default '{}'::jsonb) returns uuid
language plpgsql security definer set search_path = public as $$
declare o public.orgs; operation uuid;
begin
  select * into strict o from public.orgs where id=p_org for update;
  if o.base_billing_blocked or o.comped or o.founding_state in ('pending','founding') or o.beta_access_until > now() then raise exception 'base plan is included'; end if;
  if o.status='active' or (o.status='trial' and o.stripe_subscription_id is not null) then raise exception 'already paying'; end if;
  if o.checkout_operation is not null then
    if o.checkout_started_at < now()-interval '20 hours' then raise exception 'stale checkout needs manual reconciliation'; end if;
    return o.checkout_operation;
  end if;
  operation := gen_random_uuid();
  update public.orgs set checkout_operation=operation,checkout_started_at=now(),checkout_params=p_params where id=p_org;
  return operation;
end $$;
create function public.finish_base_checkout(p_org uuid,p_operation uuid,p_session text) returns void
language plpgsql security definer set search_path = public as $$
begin
  perform 1 from public.orgs where id=p_org and checkout_operation=p_operation for update;
  if not found then
    if exists(select 1 from public.base_checkout_sessions where session_id=p_session and org_id=p_org) then return; end if;
    raise exception 'checkout operation mismatch';
  end if;
  insert into public.base_checkout_sessions(session_id,org_id) values(p_session,p_org) on conflict do nothing;
  update public.orgs set checkout_operation=null,checkout_started_at=null,checkout_params=null where id=p_org;
end $$;

create function public.prepare_founding_grant(p_org uuid,p_company text,p_reason text) returns integer
language plpgsql security definer set search_path = public as $$
declare o public.orgs; s integer;
begin
  -- Lock singleton BEFORE organization: concurrent slot 20 grants serialize.
  perform 1 from public.founding_program where id for update;
  select * into strict o from public.orgs where id=p_org for update;
  select slot into s from public.founding_slots where org_id=p_org;
  if o.founding_state='founding' then return s; end if;
  if o.is_internal or o.comped then raise exception 'internal workspace'; end if;
  if o.founding_state not in ('qualified','pending','revoked') then raise exception 'workspace is not qualified'; end if;
  if o.checkout_operation is not null then raise exception 'checkout in progress; resolve it before granting'; end if;
  if length(trim(p_reason)) < 5 or length(trim(p_company)) < 3 then raise exception 'company and reason required'; end if;
  if s is null then
    select n into s from generate_series(1,20) n where not exists(select 1 from public.founding_slots where slot=n) order by n limit 1;
    if s is null then raise exception 'all 20 places are allocated'; end if;
    insert into public.founding_slots(slot,org_id,company_key,reason) values(s,p_org,lower(trim(p_company)),p_reason);
  elsif (select company_key from public.founding_slots where org_id=p_org) <> lower(trim(p_company)) then
    raise exception 'company identity cannot change';
  end if;
  update public.orgs set founding_state='pending',base_billing_blocked=true where id=p_org;
  insert into public.founding_audit(org_id,action,note) values(p_org,'grant_prepared',p_reason);
  return s;
end $$;
create function public.finish_founding_grant(p_org uuid) returns void
language plpgsql security definer set search_path = public as $$
declare o public.orgs;
begin
  select * into strict o from public.orgs where id=p_org for update;
  if o.founding_state='founding' then return; end if;
  if o.founding_state <> 'pending' then raise exception 'no grant pending'; end if;
  update public.orgs set founding_state='founding',founding_granted_at=coalesce(founding_granted_at,now()) where id=p_org;
  update public.founding_slots set granted_at=coalesce(granted_at,now()),revoked_at=null where org_id=p_org;
  insert into public.beta_events(org_id,kind) values(p_org,'founding_granted');
  insert into public.founding_audit(org_id,action,note) values(p_org,'granted','Base billing reconciled');
end $$;
create function public.manage_founding(p_org uuid,p_action text,p_note text) returns void
language plpgsql security definer set search_path = public as $$
declare o public.orgs;
begin
  select * into strict o from public.orgs where id=p_org for update;
  if length(trim(p_note)) < 3 then raise exception 'reason required'; end if;
  if p_action='revoke' then
    if o.founding_state <> 'founding' then raise exception 'not founding'; end if;
    update public.orgs set founding_state='revoked',base_billing_blocked=false,status=case when status='active' then 'lapsed' else status end where id=p_org;
    update public.founding_slots set revoked_at=now() where org_id=p_org;
  elsif p_action='exclude' then
    if o.founding_state in ('founding','pending') then raise exception 'revoke or resolve grant first'; end if;
    update public.orgs set founding_state='ineligible' where id=p_org;
  elsif p_action <> 'note' then raise exception 'invalid action'; end if;
  update public.orgs set admin_note=p_note where id=p_org;
  insert into public.founding_audit(org_id,action,note) values(p_org,p_action,p_note);
end $$;

create function public.end_public_beta() returns void
language plpgsql security definer set search_path = public as $$
declare p public.founding_program;
begin
  select * into p from public.founding_program where id for update;
  if not p.enabled then return; end if;
  update public.founding_program set enabled=false,ends_at=least(ends_at,now()) where id;
  update public.orgs set beta_access_until=least(beta_access_until,now()+make_interval(days=>p.transition_days))
    where beta_enrolled_at is not null;
  insert into public.founding_audit(action,note) values('beta_ended','New signups use normal trial. Existing beta retains transition grace.');
end $$;

create view public.founding_dashboard with (security_invoker=true) as
select o.id,o.email,o.created_at,o.company_url,o.acquisition_source,o.acquisition_campaign,o.acquisition_medium,
  o.status,o.beta_enrolled_at,o.beta_access_until,o.founding_state,o.founding_granted_at,o.activated_at,o.activation_rules,o.admin_note,o.is_internal,
  s.slot,s.reason,s.company_key,
  count(e.id) filter(where e.kind='meaningful_output') as outputs,
  count(distinct e.session_id) as sessions,
  count(distinct (e.created_at at time zone 'UTC')::date) filter(where e.kind='meaningful_output') as active_days,
  count(distinct (e.created_at at time zone 'UTC')::date) filter(where e.kind='meaningful_output' and e.created_at > now()-interval '7 days') as active_days_last_7,
  min(e.created_at) filter(where e.kind='meaningful_output') as first_value_at,
  max(e.created_at) filter(where e.kind='meaningful_output') as last_active_at,
  min(e.created_at) filter(where e.kind='connector_used') as connector_used_at,
  count(e.id) filter(where e.horizon=1) as daily_outputs,
  count(e.id) filter(where e.horizon=7) as seven_day_outputs,
  count(e.id) filter(where e.horizon=30) as thirty_day_outputs,
  min(e.created_at) filter(where e.horizon=1) as first_daily_at,
  min(e.created_at) filter(where e.horizon=7) as first_seven_days_at,
  min(e.created_at) filter(where e.horizon=30) as first_thirty_days_at,
  (select count(*) from public.beta_feedback f where f.org_id=o.id) as feedback_count
from public.orgs o left join public.founding_slots s on s.org_id=o.id
left join public.beta_events e on e.org_id=o.id group by o.id,s.slot,s.reason,s.company_key;

-- Retention from first useful output, exact UTC calendar days. NULL = immature cohort.
create view public.beta_retention with (security_invoker=true) as
select d.id,d.first_value_at,r.day,
  case when (now() at time zone 'UTC')::date < (d.first_value_at at time zone 'UTC')::date+r.day then null
  else exists(select 1 from public.beta_events e where e.org_id=d.id and e.kind='meaningful_output'
    and (e.created_at at time zone 'UTC')::date=(d.first_value_at at time zone 'UTC')::date+r.day) end as retained
from public.founding_dashboard d cross join (values(1),(7),(30)) r(day) where d.first_value_at is not null and not d.is_internal;

-- All data and RPCs are server-only. No browser token can administer the program.
revoke all on public.founding_program,public.founding_slots,public.beta_events,public.beta_feedback,public.founding_audit,public.base_checkout_sessions,public.founding_dashboard,public.beta_retention from anon,authenticated;
grant all on public.founding_program,public.founding_slots,public.beta_events,public.beta_feedback,public.founding_audit,public.base_checkout_sessions to service_role;
grant select on public.founding_dashboard,public.beta_retention to service_role;
grant usage,select on sequence public.founding_audit_id_seq to service_role;
revoke execute on function public.record_beta_usage(uuid,text,integer,boolean),public.begin_base_checkout(uuid,jsonb),public.finish_base_checkout(uuid,uuid,text),public.prepare_founding_grant(uuid,text,text),public.finish_founding_grant(uuid),public.manage_founding(uuid,text,text),public.end_public_beta() from public,anon,authenticated;
grant execute on function public.record_beta_usage(uuid,text,integer,boolean),public.begin_base_checkout(uuid,jsonb),public.finish_base_checkout(uuid,uuid,text),public.prepare_founding_grant(uuid,text,text),public.finish_founding_grant(uuid),public.manage_founding(uuid,text,text),public.end_public_beta() to service_role;

-- Read-only behavior segments. There is no mail provider or automatic sender.
create view public.beta_lifecycle with (security_invoker=true) as
select d.id,d.email,
  case
    when d.founding_state='founding' then 'founding_granted'
    when d.beta_access_until between now() and now()+interval '7 days' then 'beta_ending'
    when d.last_active_at < now()-interval '7 days' then 'inactive'
    when d.founding_state='qualified' then 'qualified'
    when d.activated_at is not null then 'activated'
    when d.created_at < now()-interval '2 days' then 'not_activated'
  end as segment,
  d.beta_access_until,d.last_active_at,d.founding_state,d.slot
from public.founding_dashboard d where d.beta_enrolled_at is not null and not d.is_internal;
revoke all on public.beta_lifecycle from anon,authenticated;
grant select on public.beta_lifecycle to service_role;
