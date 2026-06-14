-- ============================================================
-- نحوك — Beta backend schema (Supabase / Postgres)
-- Run once in the Supabase dashboard → SQL Editor.
-- Safe to re-run (idempotent).
-- ============================================================

-- ---------- profiles ----------
create table if not exists public.profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  name       text,
  email      text,
  role       text not null default 'student',
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Helper: is the current request made by an admin?
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

drop policy if exists profiles_select_own on public.profiles;
create policy profiles_select_own on public.profiles
  for select using (auth.uid() = id or public.is_admin());

drop policy if exists profiles_update_own on public.profiles;
create policy profiles_update_own on public.profiles
  for update using (auth.uid() = id);

-- Auto-create a profile row whenever a new auth user signs up.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, name, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.email
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------- progress ----------
create table if not exists public.progress (
  user_id      uuid not null references auth.users(id) on delete cascade,
  lesson_key   text not null,           -- e.g. "0-1" or "arabic-grammar-2:1-3"
  completed_at timestamptz not null default now(),
  primary key (user_id, lesson_key)
);

alter table public.progress enable row level security;

drop policy if exists progress_all_own on public.progress;
create policy progress_all_own on public.progress
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ---------- feedback ----------
create table if not exists public.feedback (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid references auth.users(id) on delete set null,
  kind       text not null default 'idea',   -- 'bug' | 'idea' | 'lesson'
  lesson_key text,
  message    text not null,
  rating     int,
  user_agent text,
  created_at timestamptz not null default now()
);

alter table public.feedback enable row level security;

-- Any authenticated user may submit their own feedback…
drop policy if exists feedback_insert_auth on public.feedback;
create policy feedback_insert_auth on public.feedback
  for insert with check (auth.uid() = user_id);

-- …but only admins may read it.
drop policy if exists feedback_select_admin on public.feedback;
create policy feedback_select_admin on public.feedback
  for select using (public.is_admin());

-- ============================================================
-- After you sign up with your own email, promote yourself:
--   update public.profiles set role = 'admin' where email = 'you@example.com';
-- ============================================================
