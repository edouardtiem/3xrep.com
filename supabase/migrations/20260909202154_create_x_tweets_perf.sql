-- X growth: tweets + latest perf for @Edd08x / 3xrep
create table if not exists public.x_tweets (
  id uuid primary key default gen_random_uuid(),
  tweet_id text not null unique,
  url text not null,
  handle text not null default 'Edd08x',
  body text not null,
  mode text not null default 'other'
    check (mode in ('A', 'B', 'other')),
  status text not null default 'live'
    check (status in ('live', 'deleted', 'draft')),
  posted_at timestamptz,
  likes integer not null default 0,
  replies integer not null default 0,
  reposts integer not null default 0,
  quotes integer not null default 0,
  bookmarks integer not null default 0,
  impressions integer,
  notes text,
  metrics_synced_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists x_tweets_posted_at_idx on public.x_tweets (posted_at desc);
create index if not exists x_tweets_mode_status_idx on public.x_tweets (mode, status);

alter table public.x_tweets enable row level security;

-- No anon/authenticated policies: writes via service/MCP only (dashboard).
comment on table public.x_tweets is '3xrep X posts (@Edd08x) + latest engagement; Mode A claim / Mode B Claude+CRM layer';
