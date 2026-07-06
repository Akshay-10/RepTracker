-- RepForge Supabase schema
-- Run in a new Supabase project's SQL editor.

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null default '',
  email text,
  age smallint check (age between 13 and 100),
  height_cm numeric(5, 1) check (height_cm > 0),
  current_weight_kg numeric(5, 2) check (current_weight_kg > 0),
  target_weight_kg numeric(5, 2) check (target_weight_kg > 0),
  goal text not null default 'muscle_gain'
    check (goal in ('muscle_gain', 'strength', 'fat_loss', 'recomposition')),
  experience_level text not null default 'beginner'
    check (experience_level in ('beginner', 'intermediate', 'advanced')),
  training_days smallint not null default 4 check (training_days between 1 and 7),
  workout_duration_minutes smallint not null default 75
    check (workout_duration_minutes between 30 and 180),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.user_preferences (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  units text not null default 'kg' check (units in ('kg', 'lb')),
  theme text not null default 'dark' check (theme in ('dark', 'light', 'system')),
  variation_mode text not null default 'moderate'
    check (variation_mode in ('stable', 'moderate', 'high')),
  ai_usage_mode text not null default 'balanced'
    check (ai_usage_mode in ('minimal', 'balanced', 'full')),
  include_pushup_pullup_warmup boolean not null default true,
  auto_start_rest_timer boolean not null default true,
  rest_timer_sound boolean not null default true,
  preferred_equipment text[] not null default '{}',
  exercises_to_avoid text[] not null default '{}',
  favorite_exercises text[] not null default '{}',
  injuries_or_pain text[] not null default '{}',
  weak_muscles text[] not null default '{}',
  updated_at timestamptz not null default now()
);

create table if not exists public.exercise_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  muscle_group text not null,
  movement_pattern text not null,
  angle_focus text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.exercises (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  category_id uuid references public.exercise_categories(id) on delete set null,
  muscle_group text not null,
  target_muscle text not null,
  secondary_muscles text[] not null default '{}',
  equipment text not null,
  movement_pattern text not null,
  angle_focus text,
  difficulty text not null default 'intermediate'
    check (difficulty in ('beginner', 'intermediate', 'advanced')),
  joint_stress_level text not null default 'moderate'
    check (joint_stress_level in ('low', 'moderate', 'high')),
  fatigue_level text not null default 'moderate'
    check (fatigue_level in ('low', 'moderate', 'high')),
  strength_score smallint not null default 5 check (strength_score between 0 and 10),
  hypertrophy_score smallint not null default 5 check (hypertrophy_score between 0 and 10),
  default_sets smallint not null default 3 check (default_sets between 1 and 10),
  default_reps_min smallint not null default 8 check (default_reps_min > 0),
  default_reps_max smallint not null default 12 check (default_reps_max >= default_reps_min),
  default_rest_seconds smallint not null default 90 check (default_rest_seconds between 15 and 600),
  form_tips text,
  common_mistakes text,
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.exercise_variants (
  id uuid primary key default gen_random_uuid(),
  exercise_id uuid not null references public.exercises(id) on delete cascade,
  variant_exercise_id uuid references public.exercises(id) on delete cascade,
  variation_name text not null,
  angle_focus text not null,
  equipment text not null,
  difficulty text not null default 'intermediate'
    check (difficulty in ('beginner', 'intermediate', 'advanced')),
  joint_stress_level text not null default 'moderate'
    check (joint_stress_level in ('low', 'moderate', 'high')),
  fatigue_level text not null default 'moderate'
    check (fatigue_level in ('low', 'moderate', 'high')),
  strength_score smallint not null default 5 check (strength_score between 0 and 10),
  hypertrophy_score smallint not null default 5 check (hypertrophy_score between 0 and 10),
  notes text,
  created_at timestamptz not null default now(),
  unique (exercise_id, variation_name)
);

create table if not exists public.workout_days (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  day_of_week smallint not null check (day_of_week between 0 and 6),
  title text not null,
  muscle_groups text[] not null default '{}',
  estimated_duration smallint not null default 75,
  sort_order smallint not null,
  block_type text not null default 'hypertrophy'
    check (block_type in ('strength', 'hypertrophy', 'deload', 'weak_point')),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, day_of_week, active)
);

create table if not exists public.planned_exercise_slots (
  id uuid primary key default gen_random_uuid(),
  workout_day_id uuid not null references public.workout_days(id) on delete cascade,
  slot_name text not null,
  muscle_group text not null,
  movement_pattern text not null,
  angle_focus text not null,
  priority text not null default 'accessory'
    check (priority in ('main', 'accessory', 'isolation')),
  sets smallint not null check (sets between 1 and 10),
  reps_min smallint not null check (reps_min > 0),
  reps_max smallint not null check (reps_max >= reps_min),
  rest_seconds smallint not null check (rest_seconds between 15 and 600),
  sort_order smallint not null,
  created_at timestamptz not null default now()
);

create table if not exists public.workout_day_exercises (
  id uuid primary key default gen_random_uuid(),
  workout_day_id uuid not null references public.workout_days(id) on delete cascade,
  slot_id uuid references public.planned_exercise_slots(id) on delete set null,
  exercise_id uuid not null references public.exercises(id),
  sort_order smallint not null,
  sets smallint not null check (sets between 1 and 10),
  reps_min smallint not null check (reps_min > 0),
  reps_max smallint not null check (reps_max >= reps_min),
  rest_seconds smallint not null check (rest_seconds between 15 and 600),
  notes text,
  created_at timestamptz not null default now(),
  unique (workout_day_id, sort_order)
);

create table if not exists public.selected_workout_variations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  workout_day_id uuid not null references public.workout_days(id) on delete cascade,
  slot_id uuid not null references public.planned_exercise_slots(id) on delete cascade,
  exercise_variant_id uuid not null references public.exercise_variants(id),
  week_start_date date not null,
  reason text not null,
  source text not null default 'rule_engine'
    check (source in ('default', 'rule_engine', 'ai_suggested', 'user_selected')),
  created_at timestamptz not null default now(),
  unique (user_id, slot_id, week_start_date)
);

create table if not exists public.workout_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  workout_day_id uuid references public.workout_days(id) on delete set null,
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  duration_minutes smallint check (duration_minutes between 0 and 360),
  status text not null default 'active'
    check (status in ('planned', 'active', 'completed', 'abandoned')),
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.workout_sets (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.workout_sessions(id) on delete cascade,
  exercise_id uuid not null references public.exercises(id),
  set_number smallint not null check (set_number > 0),
  weight numeric(7, 2) not null default 0 check (weight >= 0),
  reps smallint not null default 0 check (reps >= 0),
  rpe numeric(3, 1) check (rpe between 1 and 10),
  completed boolean not null default false,
  rest_seconds smallint check (rest_seconds between 0 and 900),
  notes text,
  created_at timestamptz not null default now(),
  unique (session_id, exercise_id, set_number)
);

create table if not exists public.body_metrics (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  measured_on date not null default current_date,
  weight_kg numeric(5, 2) not null check (weight_kg > 0),
  chest_cm numeric(5, 1),
  waist_cm numeric(5, 1),
  arm_cm numeric(5, 1),
  thigh_cm numeric(5, 1),
  shoulder_cm numeric(5, 1),
  notes text,
  created_at timestamptz not null default now(),
  unique (user_id, measured_on)
);

create table if not exists public.personal_records (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  exercise_id uuid not null references public.exercises(id),
  workout_set_id uuid references public.workout_sets(id) on delete set null,
  record_type text not null
    check (record_type in ('weight', 'reps', 'estimated_1rm', 'volume')),
  weight numeric(7, 2),
  reps smallint,
  estimated_1rm numeric(7, 2),
  achieved_at timestamptz not null default now()
);

create table if not exists public.exercise_feedback (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  exercise_id uuid not null references public.exercises(id) on delete cascade,
  feedback_type text not null
    check (feedback_type in ('liked', 'disliked', 'too_easy', 'too_hard', 'pain', 'avoid', 'favorite', 'keep_next_week')),
  feedback_text text,
  created_at timestamptz not null default now()
);

create table if not exists public.training_summaries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  period_type text not null check (period_type in ('weekly', 'monthly')),
  period_start date not null,
  period_end date not null,
  summary_json jsonb not null,
  data_version text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, period_type, period_start)
);

create table if not exists public.ai_recommendations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  task_type text not null,
  input_hash text not null,
  output_json jsonb not null,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null,
  unique (user_id, task_type, input_hash)
);

create table if not exists public.ai_usage_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  task_type text not null,
  model text not null,
  input_tokens integer not null default 0 check (input_tokens >= 0),
  output_tokens integer not null default 0 check (output_tokens >= 0),
  total_tokens integer generated always as (input_tokens + output_tokens) stored,
  cache_hit boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists workout_sessions_user_started_idx
  on public.workout_sessions (user_id, started_at desc);
create index if not exists workout_sets_session_idx
  on public.workout_sets (session_id);
create index if not exists body_metrics_user_date_idx
  on public.body_metrics (user_id, measured_on desc);
create index if not exists personal_records_user_exercise_idx
  on public.personal_records (user_id, exercise_id, achieved_at desc);
create index if not exists exercise_feedback_user_exercise_idx
  on public.exercise_feedback (user_id, exercise_id, created_at desc);
create index if not exists selected_variations_week_idx
  on public.selected_workout_variations (user_id, week_start_date desc);
create index if not exists ai_recommendations_lookup_idx
  on public.ai_recommendations (user_id, task_type, input_hash, expires_at);
create index if not exists ai_usage_logs_month_idx
  on public.ai_usage_logs (user_id, created_at desc);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, name, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'name', ''),
    new.email
  );
  insert into public.user_preferences (user_id) values (new.id);
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.user_preferences enable row level security;
alter table public.exercise_categories enable row level security;
alter table public.exercises enable row level security;
alter table public.exercise_variants enable row level security;
alter table public.workout_days enable row level security;
alter table public.planned_exercise_slots enable row level security;
alter table public.workout_day_exercises enable row level security;
alter table public.selected_workout_variations enable row level security;
alter table public.workout_sessions enable row level security;
alter table public.workout_sets enable row level security;
alter table public.body_metrics enable row level security;
alter table public.personal_records enable row level security;
alter table public.exercise_feedback enable row level security;
alter table public.training_summaries enable row level security;
alter table public.ai_recommendations enable row level security;
alter table public.ai_usage_logs enable row level security;

drop policy if exists "Profiles are self managed" on public.profiles;
create policy "Profiles are self managed" on public.profiles
  for all using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists "Preferences are self managed" on public.user_preferences;
create policy "Preferences are self managed" on public.user_preferences
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "Exercise categories are readable" on public.exercise_categories;
create policy "Exercise categories are readable" on public.exercise_categories
  for select using (auth.role() = 'authenticated');

drop policy if exists "Exercises are readable" on public.exercises;
create policy "Exercises are readable" on public.exercises
  for select using (auth.role() = 'authenticated');

drop policy if exists "Exercise variants are readable" on public.exercise_variants;
create policy "Exercise variants are readable" on public.exercise_variants
  for select using (auth.role() = 'authenticated');

drop policy if exists "Workout days are self managed" on public.workout_days;
create policy "Workout days are self managed" on public.workout_days
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "Slots follow workout ownership" on public.planned_exercise_slots;
create policy "Slots follow workout ownership" on public.planned_exercise_slots
  for all
  using (exists (
    select 1 from public.workout_days d
    where d.id = workout_day_id and d.user_id = auth.uid()
  ))
  with check (exists (
    select 1 from public.workout_days d
    where d.id = workout_day_id and d.user_id = auth.uid()
  ));

drop policy if exists "Day exercises follow workout ownership" on public.workout_day_exercises;
create policy "Day exercises follow workout ownership" on public.workout_day_exercises
  for all
  using (exists (
    select 1 from public.workout_days d
    where d.id = workout_day_id and d.user_id = auth.uid()
  ))
  with check (exists (
    select 1 from public.workout_days d
    where d.id = workout_day_id and d.user_id = auth.uid()
  ));

drop policy if exists "Variations are self managed" on public.selected_workout_variations;
create policy "Variations are self managed" on public.selected_workout_variations
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "Sessions are self managed" on public.workout_sessions;
create policy "Sessions are self managed" on public.workout_sessions
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "Sets follow session ownership" on public.workout_sets;
create policy "Sets follow session ownership" on public.workout_sets
  for all
  using (exists (
    select 1 from public.workout_sessions s
    where s.id = session_id and s.user_id = auth.uid()
  ))
  with check (exists (
    select 1 from public.workout_sessions s
    where s.id = session_id and s.user_id = auth.uid()
  ));

drop policy if exists "Body metrics are self managed" on public.body_metrics;
create policy "Body metrics are self managed" on public.body_metrics
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "Records are self managed" on public.personal_records;
create policy "Records are self managed" on public.personal_records
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "Feedback is self managed" on public.exercise_feedback;
create policy "Feedback is self managed" on public.exercise_feedback
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "Summaries are self readable" on public.training_summaries;
create policy "Summaries are self readable" on public.training_summaries
  for select using (auth.uid() = user_id);

drop policy if exists "Recommendations are self readable" on public.ai_recommendations;
create policy "Recommendations are self readable" on public.ai_recommendations
  for select using (auth.uid() = user_id);

drop policy if exists "Usage logs are self readable" on public.ai_usage_logs;
create policy "Usage logs are self readable" on public.ai_usage_logs
  for select using (auth.uid() = user_id);
