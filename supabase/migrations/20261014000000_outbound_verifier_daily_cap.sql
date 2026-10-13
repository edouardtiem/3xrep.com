-- Decision: at most 200 Kitt checks/day at USD 0.0015/check (USD 0.30/day).
-- The dedicated Treg agent has the same 200-call ceiling. Stock needs still
-- determine the actual lot size; this is a ceiling, never a daily target.
alter table public.outbound_sourcing_config
  drop constraint outbound_sourcing_config_max_daily_contacts_check,
  alter column max_daily_contacts set default 200,
  add constraint outbound_sourcing_config_max_daily_contacts_check
    check(max_daily_contacts between 1 and 200);
update public.outbound_sourcing_config set max_daily_contacts=200 where id=1;
