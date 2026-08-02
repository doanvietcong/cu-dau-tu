-- ============================================
-- Cú Đầu Tư — Supabase Schema
-- ============================================
-- Chạy script này trong Supabase Dashboard → SQL Editor
-- để tạo các bảng + RLS policies.

-- 1. EXTENSIONS
create extension if not exists "uuid-ossp";

-- 2. PROFILES (extends auth.users)
create table public.profiles (
  id uuid primary key references auth.users on delete cascade,
  display_name text not null,
  email text not null,
  avatar_emoji text default '🦉',
  created_at timestamptz default now(),

  -- Stats
  total_xp int default 0,
  level int default 1,
  coins int default 50,
  streak int default 0,
  longest_streak int default 0,
  last_active_date date,

  -- Hearts
  hearts int default 5,
  max_hearts int default 5,

  -- Daily goal
  daily_goal_xp int default 20,
  today_xp int default 0,
  today_date date,

  -- League
  league text default 'bronze',
  weekly_xp int default 0,
  weekly_rank int,

  -- Onboarding
  has_onboarded boolean default false,
  financial_goal text,

  -- Settings
  sound_enabled boolean default true,
  music_enabled boolean default false,

  -- Achievements
  achievement_ids text[] default '{}',

  -- Progress
  completed_lesson_ids text[] default '{}',
  weak_question_ids text[] default '{}'
);

-- RLS
alter table public.profiles enable row level security;

create policy "Users can read own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)),
    new.email
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 3. LEADERBOARD (weekly)
create table public.weekly_leaderboard (
  user_id uuid references public.profiles on delete cascade,
  week_start date not null,
  weekly_xp int default 0,
  league text default 'bronze',
  rank int,
  primary key (user_id, week_start)
);

alter table public.weekly_leaderboard enable row level security;

create policy "Anyone can read leaderboard"
  on public.weekly_leaderboard for select
  using (true);

create policy "Users can insert/update own row"
  on public.weekly_leaderboard for all
  using (auth.uid() = user_id);

-- 4. LESSON ATTEMPTS (history)
create table public.lesson_attempts (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles on delete cascade,
  lesson_id text not null,
  started_at timestamptz not null,
  completed_at timestamptz,
  xp_earned int default 0,
  coins_earned int default 0,
  correct_count int default 0,
  total_count int default 0,
  mistakes jsonb default '[]'::jsonb
);

alter table public.lesson_attempts enable row level security;

create policy "Users can read own attempts"
  on public.lesson_attempts for select
  using (auth.uid() = user_id);

create policy "Users can insert own attempts"
  on public.lesson_attempts for insert
  with check (auth.uid() = user_id);

-- 5. INDEXES for performance
create index idx_profiles_league on public.profiles(league, weekly_xp desc);
create index idx_attempts_user on public.lesson_attempts(user_id, completed_at desc);
create index idx_leaderboard_week on public.weekly_leaderboard(week_start, weekly_xp desc);

-- 6. REALTIME (for live leaderboard)
alter publication supabase_realtime add table public.weekly_leaderboard;
alter publication supabase_realtime add table public.profiles;
