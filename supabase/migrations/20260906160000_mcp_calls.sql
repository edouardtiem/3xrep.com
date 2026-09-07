-- mcp_calls: tool input + verdict, 14 days. Service role only.
create table if not exists public.mcp_calls (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  tool text not null,
  ok boolean not null,
  duration_ms integer,
  client text,
  org_id uuid references public.orgs (id) on delete set null,
  evidence_kind text,
  geste text,
  input jsonb,
  output jsonb
);

create index if not exists mcp_calls_created_at_idx on public.mcp_calls (created_at);

alter table public.mcp_calls enable row level security;
