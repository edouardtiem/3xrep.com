create extension if not exists pg_cron;
select cron.schedule('3xrep-delete-expired-feedback', '17 * * * *', $$select public.purge_user_feedback()$$);
