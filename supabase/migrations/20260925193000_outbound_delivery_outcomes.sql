-- Preserve deliverability outcomes when Smartlead is no longer the sender.
alter table public.outbound_campaign_leads
  add column is_bounced boolean not null default false,
  add column is_unsubscribed boolean not null default false,
  add column last_reply_at timestamptz;
