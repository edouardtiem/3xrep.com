-- Only the four already admitted mailboxes. Preserve all sending/recovery evidence.
do $$
begin
  if (select count(*) from public.outbound_mailboxes
      where id in (23568551,24049951,24049938,24049619) and approved
        and state->'daily_plan'->>'version'='2'
        and state->'daily_plan'->>'target' in ('43','46')) <> 4 then
    raise exception 'EXPECTED_FOUR_APPROVED_DAILY_MAILBOXES';
  end if;
end $$;

update public.outbound_mailboxes
set state=jsonb_set(jsonb_set(state,'{daily_plan,target}','46'::jsonb),
                    '{daily_plan,policy}','"accelerated-2026-10-17"'::jsonb),
    updated_at=now()
where id in (23568551,24049951,24049938,24049619) and approved;
