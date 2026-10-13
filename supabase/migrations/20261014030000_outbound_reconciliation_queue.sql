-- One scheduled search at 01:00 Paris, with at most four continuations when
-- a completed lot made progress but the hosted time budget stopped it.
alter table public.outbound_sourcing_config
  add column last_continuation_date date,
  add column continuations_today integer not null default 0 check(continuations_today between 0 and 4);

create function public.queue_outbound_reconciliation(source_run_id uuid) returns boolean
language plpgsql security definer set search_path=public as $$
declare r public.outbound_sourcing_runs; c public.outbound_sourcing_config;
  used integer; attempts integer; trigger_secret text;
begin
  select * into c from public.outbound_sourcing_config where id=1 for update;
  select * into r from public.outbound_sourcing_runs where id=source_run_id for update;
  if r.id is null or not c.enabled or c.validated_run_id is null or r.mode<>'daily' or r.status<>'success'
    or r.sending_date<>((now()+interval '12 hours') at time zone 'America/New_York')::date
    or coalesce(r.result->>'stopReason','')<>'time_budget'
    or coalesce((r.result->>'shortfall')::integer,0)<=0
    or coalesce((r.result->>'verified')::integer,0)+coalesce((r.result->>'imported')::integer,0)<=0
    or r.result ? 'continuation_queued' then return false; end if;
  select coalesce(sum(coalesce((result->>'verified')::integer,0)),0) into used
    from public.outbound_sourcing_runs where mode='daily' and sending_date=r.sending_date;
  attempts:=case when c.last_continuation_date=r.sending_date then c.continuations_today else 0 end;
  if attempts>=4 or used>=c.max_daily_contacts then return false; end if;
  select decrypted_secret into trigger_secret from vault.decrypted_secrets where name='3xrep_outbound_cron_secret';
  if trigger_secret is null then raise exception 'OUTBOUND_TRIGGER_SECRET_MISSING'; end if;
  update public.outbound_sourcing_config set last_continuation_date=r.sending_date,continuations_today=attempts+1 where id=1;
  update public.outbound_sourcing_runs set result=result||jsonb_build_object('continuation_queued',true) where id=r.id;
  perform net.http_post(
    url:='https://lulnuqhgyqfkhjnuvpsd.supabase.co/functions/v1/outbound-control',
    headers:=jsonb_build_object('Content-Type','application/json','x-outbound-secret',trigger_secret),
    body:='{"dryRun":false}'::jsonb,timeout_milliseconds:=135000);
  return true;
end;$$;
revoke all on function public.queue_outbound_reconciliation(uuid) from public,anon,authenticated;
grant execute on function public.queue_outbound_reconciliation(uuid) to service_role;
