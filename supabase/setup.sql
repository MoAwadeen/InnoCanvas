-- ============================================================
-- InnoCanvas - Full Supabase Setup
-- Run this in the Supabase SQL Editor (Dashboard > SQL Editor)
-- ============================================================

-- ============================================================
-- 1. PROFILES TABLE
-- ============================================================
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text not null default '',
  email text not null default '',
  age integer,
  gender text not null default 'prefer-not-to-say',
  country text not null default 'Unknown',
  use_case text not null default 'other',
  avatar_url text,
  phone text,
  company text,
  job_title text,
  industry text,
  experience_level text,
  plan text not null default 'free' check (plan in ('free', 'pro', 'premium')),
  plan_expiry timestamptz,
  subscription_id text,
  subscription_status text not null default 'free' check (subscription_status in ('free', 'active', 'cancelled', 'past_due', 'trialing')),
  subscription_plan text,
  current_period_start timestamptz,
  current_period_end timestamptz,
  payment_provider text not null default 'none',
  role text not null default 'user' check (role in ('user', 'admin')),
  is_verified boolean not null default false,
  last_sign_in_at timestamptz,
  preferences jsonb not null default '{"theme": "dark", "notifications": true, "newsletter": true, "language": "en"}'::jsonb,
  statistics jsonb not null default '{"canvases_created": 0, "last_login": null, "total_exports": 0, "favorite_colors": []}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Index for common queries
create index if not exists idx_profiles_plan on public.profiles (plan);
create index if not exists idx_profiles_role on public.profiles (role);
create index if not exists idx_profiles_subscription_status on public.profiles (subscription_status);

-- ============================================================
-- 2. CANVASES TABLE
-- ============================================================
create table if not exists public.canvases (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null default 'Untitled Canvas',
  description text,
  business_description text,
  content jsonb,
  canvas_data jsonb,
  form_data jsonb,
  logo_url text,
  colors jsonb default '{"primary": "#a855f7", "card": "#1a1a2e", "background": "#0d0d1a", "foreground": "#ffffff"}'::jsonb,
  remove_watermark boolean not null default false,
  is_public boolean not null default false,
  view_count integer not null default 0,
  export_count integer not null default 0,
  tags text[] default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Indexes
create index if not exists idx_canvases_user_id on public.canvases (user_id);
create index if not exists idx_canvases_created_at on public.canvases (created_at desc);
create index if not exists idx_canvases_is_public on public.canvases (is_public);

-- ============================================================
-- 3. PLAN LIMITS TABLE
-- ============================================================
create table if not exists public.plan_limits (
  plan text primary key check (plan in ('free', 'pro', 'premium')),
  max_canvases integer not null default 1,
  pdf_download boolean not null default false,
  color_customization boolean not null default false,
  ai_consultant boolean not null default false,
  templates_access boolean not null default false,
  remove_watermark boolean not null default false,
  priority_support boolean not null default false,
  api_access boolean not null default false,
  team_collaboration boolean not null default false
);

-- Seed plan limits
insert into public.plan_limits (plan, max_canvases, pdf_download, color_customization, ai_consultant, templates_access, remove_watermark, priority_support, api_access, team_collaboration)
values
  ('free',    1,  false, false, true,  false, false, false, false, false),
  ('pro',     10, true,  true,  true,  false, true,  true,  false, false),
  ('premium', -1, true,  true,  true,  true,  true,  true,  true,  true)
on conflict (plan) do update set
  max_canvases = excluded.max_canvases,
  pdf_download = excluded.pdf_download,
  color_customization = excluded.color_customization,
  ai_consultant = excluded.ai_consultant,
  templates_access = excluded.templates_access,
  remove_watermark = excluded.remove_watermark,
  priority_support = excluded.priority_support,
  api_access = excluded.api_access,
  team_collaboration = excluded.team_collaboration;

-- ============================================================
-- 4. AUTO-UPDATE updated_at TRIGGER
-- ============================================================
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Apply to profiles
drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
  before update on public.profiles
  for each row execute function public.handle_updated_at();

-- Apply to canvases
drop trigger if exists set_canvases_updated_at on public.canvases;
create trigger set_canvases_updated_at
  before update on public.canvases
  for each row execute function public.handle_updated_at();

-- ============================================================
-- 5. AUTO-CREATE PROFILE ON SIGNUP TRIGGER
-- ============================================================
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, email, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name', split_part(new.email, '@', 1)),
    coalesce(new.email, ''),
    coalesce(new.raw_user_meta_data ->> 'avatar_url', new.raw_user_meta_data ->> 'picture')
  )
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
-- 6. ROW LEVEL SECURITY (RLS)
-- ============================================================

-- Enable RLS on all tables
alter table public.profiles enable row level security;
alter table public.canvases enable row level security;
alter table public.plan_limits enable row level security;

-- ---- PROFILES ----

-- Users can read their own profile
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

-- Users can update their own profile
create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Users can insert their own profile (for signup)
create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Admins can read all profiles
create policy "Admins can view all profiles"
  on public.profiles for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- Admins can update all profiles (role changes, etc.)
create policy "Admins can update all profiles"
  on public.profiles for update
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- Admins can delete profiles
create policy "Admins can delete profiles"
  on public.profiles for delete
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- ---- CANVASES ----

-- Users can read their own canvases
create policy "Users can view own canvases"
  on public.canvases for select
  using (auth.uid() = user_id);

-- Anyone can view public canvases
create policy "Anyone can view public canvases"
  on public.canvases for select
  using (is_public = true);

-- Users can create canvases
create policy "Users can create canvases"
  on public.canvases for insert
  with check (auth.uid() = user_id);

-- Users can update their own canvases
create policy "Users can update own canvases"
  on public.canvases for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Users can delete their own canvases
create policy "Users can delete own canvases"
  on public.canvases for delete
  using (auth.uid() = user_id);

-- Admins can read all canvases
create policy "Admins can view all canvases"
  on public.canvases for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- Admins can delete any canvas
create policy "Admins can delete any canvas"
  on public.canvases for delete
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- ---- PLAN LIMITS ----

-- Anyone authenticated can read plan limits
create policy "Authenticated users can view plan limits"
  on public.plan_limits for select
  using (auth.role() = 'authenticated');

-- ============================================================
-- 7. STORAGE BUCKETS
-- ============================================================

-- Create avatars bucket (public)
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

-- Create logos bucket (public)
insert into storage.buckets (id, name, public)
values ('logos', 'logos', true)
on conflict (id) do nothing;

-- Storage policies: avatars
create policy "Users can upload their own avatar"
  on storage.objects for insert
  with check (
    bucket_id = 'avatars'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Users can update their own avatar"
  on storage.objects for update
  using (
    bucket_id = 'avatars'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Anyone can view avatars"
  on storage.objects for select
  using (bucket_id = 'avatars');

-- Storage policies: logos
create policy "Users can upload logos"
  on storage.objects for insert
  with check (
    bucket_id = 'logos'
    and auth.role() = 'authenticated'
  );

create policy "Users can update their logos"
  on storage.objects for update
  using (
    bucket_id = 'logos'
    and auth.role() = 'authenticated'
  );

create policy "Anyone can view logos"
  on storage.objects for select
  using (bucket_id = 'logos');

-- ============================================================
-- 8. ENABLE REALTIME FOR CANVASES
-- ============================================================
alter publication supabase_realtime add table public.canvases;

-- ============================================================
-- DONE. Your Supabase is fully configured for InnoCanvas.
--
-- Next steps:
--   1. Enable Google OAuth in Supabase Dashboard > Authentication > Providers
--   2. Set your Site URL in Authentication > URL Configuration
--   3. Add redirect URLs: http://localhost:3000/auth/callback
-- ============================================================
