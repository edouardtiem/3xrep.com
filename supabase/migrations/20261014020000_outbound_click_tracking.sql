-- Keep click evidence alongside opens/replies; no URLs or message bodies.
alter table public.outbound_send_events add column clicked_at timestamptz;

create or replace view public.outbound_sequence_results with (security_invoker=true) as
select s.id,s.cohort,s.variant,s.version,s.provider_campaign_id,s.acquisition_campaign,
  (select count(*) from public.outbound_sequence_assignments a where a.sequence_id=s.id) as assigned_contacts,
  m.contacts,m.contacted,m.bounced_contacts,m.detected_replies,m.positive_replies,m.unsubscribed_contacts,
  e.sent_messages,e.observed_opened_messages,
  o.signups,o.activated_organizations,o.organizations_with_useful_output,e.observed_clicked_messages
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
  select count(*) as sent_messages,count(*) filter(where e.opened_at is not null) as observed_opened_messages,
    count(*) filter(where e.clicked_at is not null) as observed_clicked_messages
  from public.outbound_send_events e join public.outbound_campaign_leads l on l.id=e.campaign_lead_id where l.sequence_id=s.id
) e
cross join lateral (
  select count(*) as signups,count(*) filter(where o.activated_at is not null) as activated_organizations,
    count(*) filter(where exists(select 1 from public.beta_events b where b.org_id=o.id and b.kind='meaningful_output')) as organizations_with_useful_output
  from public.orgs o where o.acquisition_source='smartlead' and o.acquisition_campaign=s.acquisition_campaign and not o.is_internal
) o;

create or replace view public.outbound_sequence_steps with (security_invoker=true) as
select l.sequence_id,e.sequence_step,count(*) as sent_messages,
  count(*) filter(where e.opened_at is not null) as observed_opened_messages,
  count(*) filter(where e.replied_at is not null) as detected_replies,
  count(*) filter(where e.is_bounced) as bounced_messages,
  count(*) filter(where e.clicked_at is not null) as observed_clicked_messages
from public.outbound_send_events e join public.outbound_campaign_leads l on l.id=e.campaign_lead_id
where l.sequence_id is not null group by l.sequence_id,e.sequence_step;
