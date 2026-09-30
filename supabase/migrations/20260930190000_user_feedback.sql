-- Product feedback works for beta and paid organizations. No commercial output is copied.
create table public.feedback_outputs (
  output_id uuid primary key references public.beta_events(id) on delete cascade,
  org_id uuid not null references public.orgs(id) on delete cascade,
  tool text not null,
  engine_version text not null,
  created_at timestamptz not null default now(),
  unique(org_id, output_id)
);
create table public.feedback_prompt_state (
  org_id uuid primary key references public.orgs(id) on delete cascade,
  last_offered_at timestamptz not null
);
create table public.user_feedback (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.orgs(id) on delete cascade,
  output_id uuid,
  kind text not null check(kind in ('opinion','action','outcome','spontaneous')),
  useful boolean,
  question text check(length(question) <= 500),
  answer text not null check(length(btrim(answer)) between 1 and 2000),
  shared_context text check(length(shared_context) <= 500),
  category text check(category in ('missing_context','unrealistic_advice','wording','error','technical','other')),
  status text not null default 'new' check(status in ('new','reviewing','fixed','needs_details')),
  admin_note text check(length(admin_note) <= 1000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  expires_at timestamptz not null default now() + interval '180 days',
  foreign key(org_id,output_id) references public.feedback_outputs(org_id,output_id),
  unique(org_id,output_id,kind),
  check(kind = 'spontaneous' or output_id is not null),
  check(kind = 'opinion' or useful is null)
);
create index user_feedback_review on public.user_feedback(status,created_at desc);
alter table public.feedback_outputs enable row level security;
alter table public.feedback_prompt_state enable row level security;
alter table public.user_feedback enable row level security;
revoke all on public.feedback_outputs,public.feedback_prompt_state,public.user_feedback from public,anon,authenticated;
grant all on public.feedback_outputs,public.feedback_prompt_state,public.user_feedback to service_role;

-- Serialize concurrent outputs for the same workspace: at most one invitation per 7 days.
-- This records an invitation offered to the host, not a question actually shown or read.
create function public.prepare_feedback_output(p_org uuid,p_output uuid,p_tool text,p_version text)
returns boolean language plpgsql set search_path=public as $$
declare last_offer timestamptz;
begin
  perform 1 from orgs where id=p_org for update;
  if not exists(select 1 from beta_events where id=p_output and org_id=p_org and kind='meaningful_output' and tool=p_tool) then
    raise exception 'Unknown workspace result';
  end if;
  insert into feedback_outputs(output_id,org_id,tool,engine_version)
    values(p_output,p_org,p_tool,p_version) on conflict(output_id) do nothing;
  select last_offered_at into last_offer from feedback_prompt_state where org_id=p_org;
  if last_offer is not null and last_offer > now()-interval '7 days' then return false; end if;
  insert into feedback_prompt_state(org_id,last_offered_at) values(p_org,now())
    on conflict(org_id) do update set last_offered_at=excluded.last_offered_at;
  return true;
end $$;
revoke all on function public.prepare_feedback_output(uuid,uuid,text,text) from public,anon,authenticated;
grant execute on function public.prepare_feedback_output(uuid,uuid,text,text) to service_role;

create function public.purge_user_feedback() returns void language sql set search_path=public as $$
  delete from user_feedback where expires_at < now();
  delete from beta_feedback where created_at < now()-interval '180 days';
  delete from feedback_outputs o where o.created_at < now()-interval '180 days'
    and not exists(select 1 from user_feedback f where f.output_id=o.output_id);
$$;
revoke all on function public.purge_user_feedback() from public,anon,authenticated;
grant execute on function public.purge_user_feedback() to service_role;
