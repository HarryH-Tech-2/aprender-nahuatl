-- Course waitlist (demand test). Written only by the server (service role) through /api/waitlist;
-- RLS is on with no policies, so the public anon key can neither read nor write these tables.

create table if not exists public.waitlist (
  email text primary key,
  name text,
  variant text check (variant in ('central', 'huasteca')),
  source text not null default 'web',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.waitlist enable row level security;

-- One row each time a signed-up learner tries to start a lesson that is not open yet.
create table if not exists public.lesson_interest (
  id bigint generated always as identity primary key,
  email text not null,
  lesson int not null check (lesson between 1 and 20),
  variant text,
  created_at timestamptz not null default now()
);
alter table public.lesson_interest enable row level security;
create index if not exists lesson_interest_lesson_idx on public.lesson_interest (lesson);

-- Handy queries (run in the SQL editor):
--   Sign-ups per week:
--     select date_trunc('week', created_at) as semana, count(*) from waitlist group by 1 order by 1;
--   People who wanted each locked lesson:
--     select lesson, count(distinct email) as personas from lesson_interest group by 1 order by 1;
--   Sign-ups by variant and source:
--     select variant, source, count(*) from waitlist group by 1, 2 order by 3 desc;
