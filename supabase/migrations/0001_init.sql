-- Nontonin initial schema.
-- Source of truth: PROJECT_PLAN.md section 3.3.
-- Run once against a fresh Supabase Free project.

create table profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null check (char_length(name) between 1 and 20),
  avatar_key text not null,
  is_kids boolean not null default false,
  created_at timestamptz not null default now()
);
create unique index profiles_user_name_uq on profiles (user_id, lower(name));

create table my_list (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references profiles(id) on delete cascade,
  tmdb_id integer not null,
  media_type text not null check (media_type in ('movie', 'tv')),
  title text not null,
  poster_path text,
  added_at timestamptz not null default now(),
  unique (profile_id, media_type, tmdb_id)
);
create index my_list_recent on my_list (profile_id, added_at desc);

create table watch_history (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references profiles(id) on delete cascade,
  tmdb_id integer not null,
  media_type text not null check (media_type in ('movie', 'tv')),
  title text not null,
  poster_path text,
  last_viewed_at timestamptz not null default now(),
  unique (profile_id, media_type, tmdb_id)
);
create index watch_history_recent on watch_history (profile_id, last_viewed_at desc);

create table reactions (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references profiles(id) on delete cascade,
  tmdb_id integer not null,
  media_type text not null check (media_type in ('movie', 'tv')),
  value smallint not null check (value in (1, -1)),
  unique (profile_id, media_type, tmdb_id)
);

-- Max 5 profiles per account (SRS G04).
create function enforce_profile_limit() returns trigger language plpgsql as $$
begin
  if (select count(*) from profiles where user_id = new.user_id) >= 5 then
    raise exception 'profile_limit_reached';
  end if;
  return new;
end $$;
create trigger profiles_limit before insert on profiles
  for each row execute function enforce_profile_limit();

-- RLS: only the owning account may touch its own rows (SDD 3.5).
alter table profiles enable row level security;
create policy own_profiles on profiles for all
  using (user_id = auth.uid()) with check (user_id = auth.uid());

alter table my_list enable row level security;
alter table watch_history enable row level security;
alter table reactions enable row level security;

create policy own_my_list on my_list for all
  using (exists (select 1 from profiles p where p.id = profile_id and p.user_id = auth.uid()))
  with check (exists (select 1 from profiles p where p.id = profile_id and p.user_id = auth.uid()));

create policy own_watch_history on watch_history for all
  using (exists (select 1 from profiles p where p.id = profile_id and p.user_id = auth.uid()))
  with check (exists (select 1 from profiles p where p.id = profile_id and p.user_id = auth.uid()));

create policy own_reactions on reactions for all
  using (exists (select 1 from profiles p where p.id = profile_id and p.user_id = auth.uid()))
  with check (exists (select 1 from profiles p where p.id = profile_id and p.user_id = auth.uid()));

-- Called by the keep-alive endpoint so the free-tier database is never
-- fully idle for 7 days (PROJECT_PLAN.md 3.6).
create function ping() returns timestamptz language sql security definer as $$ select now() $$;
grant execute on function ping() to anon;
