-- sales-buddy: company context, atomic memory observations, traffic-independent retention.
-- Apply to a test project before production. Does not store source passages in the skeleton.
alter table public.orgs add column if not exists sales_context jsonb;

create or replace function public.record_judgment_piece(
  p_org uuid, p_hash text, p_piece text, p_etat text, p_reflex text,
  p_amount text, p_stage text, p_outcome text
) returns setof public.judgment_skeleton
language sql security invoker set search_path = public
as $$
  insert into public.judgment_skeleton as old
    (org_id, deal_hash, piece, etat, reflex_id, judged_at, trou_since, times_trou, amount_bucket, claimed_stage, denouement)
  values (p_org, p_hash, p_piece, p_etat, p_reflex, now(),
    case when p_etat = 'trou' then now() end,
    case when p_etat = 'trou' then 1 else 0 end,
    p_amount, p_stage, p_outcome)
  on conflict (org_id, deal_hash, piece) do update set
    etat = excluded.etat,
    reflex_id = coalesce(excluded.reflex_id, old.reflex_id),
    judged_at = now(),
    trou_since = case when excluded.etat = 'trou' then coalesce(old.trou_since, now()) end,
    times_trou = case when excluded.etat <> 'trou' then 0
      when old.etat <> 'trou' then 1
      when (old.judged_at at time zone 'UTC')::date = (now() at time zone 'UTC')::date then old.times_trou
      else old.times_trou + 1 end,
    amount_bucket = coalesce(excluded.amount_bucket, old.amount_bucket),
    claimed_stage = coalesce(excluded.claimed_stage, old.claimed_stage),
    denouement = coalesce(excluded.denouement, old.denouement)
  returning *;
$$;
revoke all on function public.record_judgment_piece(uuid,text,text,text,text,text,text,text) from public, anon, authenticated;
grant execute on function public.record_judgment_piece(uuid,text,text,text,text,text,text,text) to service_role;

-- pg_cron belongs to Supabase. The retention task does not depend on MCP traffic.
create extension if not exists pg_cron;
select cron.schedule('3xrep-delete-expired-mcp-calls', '*/15 * * * *',
  $$delete from public.mcp_calls where created_at < now() - interval '14 days'$$);
