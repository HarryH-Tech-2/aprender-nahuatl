-- Billing columns and plan hardening. Run after 0001_profiles.sql.
-- Idempotent: safe to run more than once (if not exists / create or replace / drop ... if exists).

alter table public.profiles add column if not exists stripe_customer_id text unique;
alter table public.profiles add column if not exists stripe_subscription_id text;
alter table public.profiles add column if not exists lifetime_payment_intent text;

update public.profiles set plan = 'free' where plan not in ('free', 'monthly', 'lifetime');

alter table public.profiles drop constraint if exists profiles_plan_check;
alter table public.profiles
  add constraint profiles_plan_check check (plan in ('free', 'monthly', 'lifetime'));

-- Learners cannot change plan or billing columns; the server (service role) and the dashboard can.
create or replace function public.profiles_guard()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  if coalesce(auth.role(), '') in ('authenticated', 'anon') then
    new.plan := old.plan;
    new.stripe_customer_id := old.stripe_customer_id;
    new.stripe_subscription_id := old.stripe_subscription_id;
    new.lifetime_payment_intent := old.lifetime_payment_intent;
  end if;
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists profiles_guard on public.profiles;
create trigger profiles_guard
  before update on public.profiles
  for each row execute function public.profiles_guard();

drop policy if exists "Learners create their own profile" on public.profiles;
create policy "Learners create their own profile"
  on public.profiles for insert to authenticated
  with check (
    (select auth.uid()) = id
    and plan = 'free'
    and stripe_customer_id is null
    and stripe_subscription_id is null
    and lifetime_payment_intent is null
  );

-- Disputes arrive with only a payment intent, so look the lifetime purchase up by it.
create unique index if not exists profiles_lifetime_payment_intent_key
  on public.profiles (lifetime_payment_intent);
