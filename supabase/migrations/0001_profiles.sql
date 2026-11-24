-- One row per learner. Run this once in the Supabase SQL editor (or with `supabase db push`).

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  variant text check (variant in ('central', 'huasteca')),
  -- Reserved for the paid plan. Learners cannot change it themselves (see trigger below).
  plan text not null default 'free',
  progress jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Learners read their own profile"
  on public.profiles for select to authenticated
  using ((select auth.uid()) = id);

create policy "Learners create their own profile"
  on public.profiles for insert to authenticated
  with check ((select auth.uid()) = id and plan = 'free');

create policy "Learners update their own profile"
  on public.profiles for update to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

-- Only the server (service role) may change `plan`; keep `updated_at` current.
create or replace function public.profiles_guard()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  if new.plan is distinct from old.plan and coalesce(auth.role(), '') <> 'service_role' then
    new.plan := old.plan;
  end if;
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists profiles_guard on public.profiles;
create trigger profiles_guard
  before update on public.profiles
  for each row execute function public.profiles_guard();
