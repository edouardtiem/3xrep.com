-- Versioned acquisition experiments, private attribution and daily mailbox history.
create table public.outbound_sequences (
  id text primary key,
  cohort text not null,
  variant text not null check (variant in ('A','B')),
  version integer not null check (version > 0),
  provider_campaign_id text unique,
  acquisition_campaign text not null unique,
  content_hash text not null,
  steps jsonb not null check (jsonb_typeof(steps) = 'array'),
  controlled boolean not null default false,
  created_at timestamptz not null default now(),
  unique(cohort,variant,version)
);
alter table public.outbound_prospects add column qualified_for_senior_beta boolean not null default false;
alter table public.outbound_campaign_leads
  add column sequence_id text references public.outbound_sequences(id),
  add column reply_category text check (reply_category in ('positive','neutral','negative','unsubscribe','automatic'));
alter table public.outbound_send_events
  add column mailbox_id bigint references public.outbound_mailboxes(id),
  add column provider_stats_id text,
  add column opened_at timestamptz,
  add column replied_at timestamptz,
  add column is_bounced boolean not null default false;

create table public.outbound_sequence_assignments (
  prospect_id uuid not null references public.outbound_prospects(id),
  sequence_id text not null references public.outbound_sequences(id),
  cohort text not null,
  company_key text not null,
  assigned_at timestamptz not null default now(),
  primary key (prospect_id,cohort),
  unique(cohort,company_key)
);

-- Reserve before import. Retries keep the same variant and competing imports
-- cannot enroll two people from one company or skew the allocation.
create function public.assign_senior_beta_sequence(prospect_uuid uuid) returns text
language plpgsql security definer set search_path = public as $$
declare p public.outbound_prospects; selected text; existing text; cohort_key text := 'senior-beta-2026-10-13';
begin
  perform pg_advisory_xact_lock(hashtext(cohort_key));
  select sequence_id into existing from public.outbound_sequence_assignments
    where prospect_id=prospect_uuid and cohort=cohort_key;
  if existing is not null then return existing; end if;
  select * into p from public.outbound_prospects where id=prospect_uuid;
  if not found or not p.qualified_for_senior_beta or lower(coalesce(p.email_verification_status,'')) not in ('valid','verified')
    or nullif(p.company_domain,'') is null then raise exception 'CONTACT_NOT_QUALIFIED_AND_VERIFIED'; end if;
  if exists(select 1 from public.outbound_campaign_leads where prospect_id=prospect_uuid and
    (first_sent_at is not null or is_bounced or is_unsubscribed or last_reply_at is not null)) then
    raise exception 'CONTACT_ALREADY_APPROACHED_OR_SUPPRESSED';
  end if;
  select s.id into selected from public.outbound_sequences s
    left join public.outbound_sequence_assignments a on a.sequence_id=s.id
    where s.cohort=cohort_key and s.version=1 and s.provider_campaign_id is not null
    group by s.id,s.variant order by count(a.prospect_id),s.variant limit 1;
  if selected is null then raise exception 'SEQUENCES_NOT_READY'; end if;
  insert into public.outbound_sequence_assignments(prospect_id,sequence_id,cohort,company_key)
    values (p.id,selected,cohort_key,lower(p.company_domain));
  return selected;
end;
$$;
revoke all on function public.assign_senior_beta_sequence(uuid) from public,anon,authenticated;
grant execute on function public.assign_senior_beta_sequence(uuid) to service_role;

create table public.outbound_mailbox_daily (
  mailbox_id bigint not null references public.outbound_mailboxes(id),
  sending_date date not null,
  run_id uuid not null references public.outbound_control_runs(id),
  observed_cap integer not null,
  planned_cap integer not null,
  baseline integer,
  decision text not null,
  metrics jsonb not null,
  warmup jsonb not null,
  primary key(mailbox_id,sending_date)
);

create view public.outbound_sequence_results with (security_invoker=true) as
select s.id,s.cohort,s.variant,s.version,s.provider_campaign_id,s.acquisition_campaign,
  (select count(*) from public.outbound_sequence_assignments a where a.sequence_id=s.id) as assigned_contacts,
  m.contacts,m.contacted,m.bounced_contacts,m.detected_replies,m.positive_replies,m.unsubscribed_contacts,
  e.sent_messages,e.observed_opened_messages,
  o.signups,o.activated_organizations,o.organizations_with_useful_output
from public.outbound_sequences s
cross join lateral (
  select count(*) as contacts,count(*) filter(where first_sent_at is not null) as contacted,
    count(*) filter(where is_bounced) as bounced_contacts,
    count(*) filter(where last_reply_at is not null) as detected_replies,
    count(*) filter(where reply_category='positive') as positive_replies,
    count(*) filter(where is_unsubscribed) as unsubscribed_contacts
  from public.outbound_campaign_leads where sequence_id=s.id
) m
cross join lateral (
  select count(*) as sent_messages,count(*) filter(where e.opened_at is not null) as observed_opened_messages
  from public.outbound_send_events e join public.outbound_campaign_leads l on l.id=e.campaign_lead_id where l.sequence_id=s.id
) e
cross join lateral (
  select count(*) as signups,count(*) filter(where o.activated_at is not null) as activated_organizations,
    count(*) filter(where exists(select 1 from public.beta_events b where b.org_id=o.id and b.kind='meaningful_output')) as organizations_with_useful_output
  from public.orgs o where o.acquisition_source='smartlead' and o.acquisition_campaign=s.acquisition_campaign and not o.is_internal
) o;

create view public.outbound_sequence_steps with (security_invoker=true) as
select l.sequence_id,e.sequence_step,count(*) as sent_messages,
  count(*) filter(where e.opened_at is not null) as observed_opened_messages,
  count(*) filter(where e.replied_at is not null) as detected_replies,
  count(*) filter(where e.is_bounced) as bounced_messages
from public.outbound_send_events e join public.outbound_campaign_leads l on l.id=e.campaign_lead_id
where l.sequence_id is not null group by l.sequence_id,e.sequence_step;

alter table public.outbound_sequences enable row level security;
alter table public.outbound_sequence_assignments enable row level security;
alter table public.outbound_mailbox_daily enable row level security;
revoke all on public.outbound_sequences,public.outbound_sequence_assignments,public.outbound_mailbox_daily,
  public.outbound_sequence_results,public.outbound_sequence_steps from anon,authenticated;
grant all on public.outbound_sequences,public.outbound_sequence_assignments,public.outbound_mailbox_daily to service_role;
grant select on public.outbound_sequence_results,public.outbound_sequence_steps to service_role;
