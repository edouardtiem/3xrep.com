-- Keep the Gojiberry rows and make outbound contacts portable across senders.
alter table public.outbound_prospects
  add column source_contact_id text,
  add column company_domain text,
  add column email_verification_status text;

update public.outbound_prospects
set source_contact_id = gojiberry_contact_id::text
where source = 'gojiberry' and gojiberry_contact_id is not null;

update public.outbound_prospects
set company_domain = lower(split_part(email, '@', 2))
where company_domain is null and email like '%@%';

alter table public.outbound_prospects alter column source set default 'manual';

create unique index outbound_prospects_source_contact_id
  on public.outbound_prospects (source, source_contact_id)
  where source_contact_id is not null;

create index outbound_prospects_company_domain
  on public.outbound_prospects (company_domain);

-- A contact can appear in several campaigns. Its campaign status belongs here,
-- rather than in the legacy outbound_prospects.status field.
create table public.outbound_campaign_leads (
  id uuid primary key default gen_random_uuid(),
  prospect_id uuid not null references public.outbound_prospects(id) on delete cascade,
  provider text not null,
  provider_campaign_id text not null,
  provider_lead_id text,
  provider_campaign_lead_map_id text,
  status text not null,
  lead_category_id text,
  first_sent_at timestamptz,
  last_synced_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  unique (provider, provider_campaign_id, prospect_id)
);

create unique index outbound_campaign_leads_provider_map
  on public.outbound_campaign_leads (provider, provider_campaign_id, provider_campaign_lead_map_id)
  where provider_campaign_lead_map_id is not null;

create index outbound_campaign_leads_prospect
  on public.outbound_campaign_leads (prospect_id);

-- One row per sent message gives a portable denominator for the beta goal.
-- Message content and reply text stay outside this table.
create table public.outbound_send_events (
  id uuid primary key default gen_random_uuid(),
  campaign_lead_id uuid not null references public.outbound_campaign_leads(id) on delete cascade,
  provider_message_id text not null,
  sequence_step integer,
  sent_at timestamptz not null,
  created_at timestamptz not null default now(),
  unique (campaign_lead_id, provider_message_id)
);

create index outbound_send_events_sent_at
  on public.outbound_send_events (sent_at);

alter table public.outbound_campaign_leads enable row level security;
revoke all on public.outbound_campaign_leads from anon, authenticated;
grant all on public.outbound_campaign_leads to service_role;

alter table public.outbound_send_events enable row level security;
revoke all on public.outbound_send_events from anon, authenticated;
grant all on public.outbound_send_events to service_role;
