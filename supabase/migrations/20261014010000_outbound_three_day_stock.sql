-- Keep three BUSINESS days of verified contacts at full mailbox capacity.
-- Replacement lots share the existing 200/day and USD 0.0015/check ceilings.
alter table public.outbound_sourcing_config alter column buffer_days set default 3;
update public.outbound_sourcing_config set buffer_days=3 where id=1;
