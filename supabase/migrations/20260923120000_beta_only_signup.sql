-- While recruiting the first 20 teams, a new trial workspace must enter Beta.
-- Keep existing paid and trial workspaces unchanged.
create or replace function public.founding_admit() returns trigger language plpgsql set search_path = public as $$
declare p public.founding_program;
begin
  if new.status = 'trial' and new.stripe_subscription_id is null then
    select * into p from public.founding_program where id for share;
    if p.enabled is distinct from true or p.ends_at is null or p.ends_at <= now()
       or (select count(*) from public.founding_slots) >= 20 then
      raise exception 'beta enrollment closed' using errcode = 'P0001';
    end if;
    new.beta_enrolled_at := now();
    new.beta_access_until := p.ends_at + make_interval(days => p.transition_days);
    new.founding_state := 'candidate';
  end if;
  return new;
end $$;
