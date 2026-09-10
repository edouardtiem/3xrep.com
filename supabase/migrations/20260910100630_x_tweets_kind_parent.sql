-- x_tweets: post vs reply, parent status id, whether 3xrep / I built is named.
alter table public.x_tweets add column if not exists kind text not null default 'post';
alter table public.x_tweets add column if not exists parent_tweet_id text;
alter table public.x_tweets add column if not exists named_3xrep boolean not null default false;

update public.x_tweets set kind = 'post' where kind is null or kind = '';

do $$ begin
  if not exists (
    select 1 from pg_constraint where conname = 'x_tweets_kind_check'
  ) then
    alter table public.x_tweets add constraint x_tweets_kind_check check (kind in ('post','reply'));
  end if;
end $$;

create index if not exists x_tweets_parent_tweet_id_idx on public.x_tweets (parent_tweet_id);
create index if not exists x_tweets_kind_idx on public.x_tweets (kind);
