-- A failed scheduled control gets up to three further chances. Never overlap
-- a running control or repeat a successful real control from this Paris day.
select cron.schedule('3xrep-outbound-control-retry', '15,30,45 23,0 * * *', $job$
  select net.http_post(
    url := 'https://lulnuqhgyqfkhjnuvpsd.supabase.co/functions/v1/outbound-control',
    headers := jsonb_build_object('Content-Type','application/json','x-outbound-secret',
      (select decrypted_secret from vault.decrypted_secrets where name='3xrep_outbound_cron_secret')),
    body := '{"dryRun":false}'::jsonb, timeout_milliseconds := 135000)
  where extract(hour from now() at time zone 'Europe/Paris')=1
    and exists (select 1 from public.outbound_control_runs where status='failed'
      and started_at >= date_trunc('day',now() at time zone 'Europe/Paris') at time zone 'Europe/Paris')
    and not exists (select 1 from public.outbound_control_runs where started_at >= date_trunc('day',now() at time zone 'Europe/Paris') at time zone 'Europe/Paris'
      and (status='running' or (status='success' and result->>'dryRun'='false')));
$job$);
