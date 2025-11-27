-- Unified Supabase Schema for InnoCanvas
-- Run this script in your Supabase Dashboard > SQL Editor

-- 1. Profiles Table & Extensions
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text,
  full_name text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  role text default 'user' check (role in ('user', 'admin')),
  subscription_status text default 'inactive' check (subscription_status in ('active', 'inactive', 'cancelled', 'paused')),
  subscription_plan text default 'free' check (subscription_plan in ('free', 'pro', 'premium')),
  subscription_id text,
  subscription_end_date timestamp with time zone,
  subscription_start_date timestamp with time zone,
  phone text,
  company text,
  job_title text,
  industry text,
  experience_level text,
  plan text default 'free',
  plan_expiry timestamp with time zone,
  payment_provider text default 'lemonsqueezy',
  preferences jsonb default '{"theme": "dark", "notifications": true, "newsletter": true, "language": "en"}',
  statistics jsonb default '{"canvases_created": 0, "last_login": null, "total_exports": 0, "favorite_colors": []}'
);

-- 2. Canvases Table
create table if not exists public.canvases (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  title text,
  data jsonb default '{}'::jsonb,
  is_public boolean default false,
  tags text[],
  view_count integer default 0,
  export_count integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Plan Limits Table
create table if not exists public.plan_limits (
  plan text primary key,
  max_canvases integer not null,
  pdf_download boolean default false,
  color_customization boolean default false,
  ai_consultant boolean default false,
  templates_access boolean default false,
  remove_watermark boolean default false,
  priority_support boolean default false,
  api_access boolean default false,
  team_collaboration boolean default false,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

insert into public.plan_limits (plan, max_canvases, pdf_download, color_customization, ai_consultant, templates_access, remove_watermark, priority_support, api_access, team_collaboration) values
  ('free', 1, false, false, false, false, false, false, false, false),
  ('pro', 10, true, true, true, true, false, false, false, false),
  ('premium', -1, true, true, true, true, true, true, true, true)
on conflict (plan) do nothing;

-- 4. Subscriptions Table
create table if not exists public.subscriptions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  subscription_id text unique not null,
  plan text not null references public.plan_limits(plan),
  status text not null default 'active',
  current_period_start timestamp with time zone,
  current_period_end timestamp with time zone,
  cancel_at_period_end boolean default false,
  payment_provider text default 'lemonsqueezy',
  metadata jsonb,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- 5. System Settings Table
create table if not exists public.system_settings (
    id uuid default gen_random_uuid() primary key,
    key text unique not null,
    value jsonb not null,
    description text,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

insert into public.system_settings (key, value, description) values
    ('maintenance_mode', 'false', 'Enable/disable maintenance mode'),
    ('registration_enabled', 'true', 'Enable/disable user registration'),
    ('max_canvases_free', '1', 'Maximum canvases for free users'),
    ('max_canvases_pro', '10', 'Maximum canvases for pro users'),
    ('max_canvases_premium', '-1', 'Maximum canvases for premium users (unlimited)'),
    ('ai_generation_enabled', 'true', 'Enable/disable AI canvas generation'),
    ('pdf_export_enabled', 'true', 'Enable/disable PDF export'),
    ('logo_upload_enabled', 'true', 'Enable/disable logo upload'),
    ('color_customization_enabled', 'true', 'Enable/disable color customization'),
    ('public_canvases_enabled', 'true', 'Enable/disable public canvas sharing')
on conflict (key) do nothing;

-- 6. Admin Activity Log Table
create table if not exists public.admin_activity_log (
    id uuid default gen_random_uuid() primary key,
    admin_user_id uuid references auth.users(id) on delete cascade not null,
    action text not null,
    target_type text not null,
    target_id uuid,
    details jsonb,
    created_at timestamp with time zone default now()
);

-- 7. RLS Policies
alter table public.profiles enable row level security;
alter table public.canvases enable row level security;
alter table public.subscriptions enable row level security;
alter table public.plan_limits enable row level security;
alter table public.system_settings enable row level security;
alter table public.admin_activity_log enable row level security;

-- Profiles Policies
create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);
create policy "Users can insert own profile" on public.profiles for insert with check (auth.uid() = id);

-- Canvases Policies
create policy "Users can view own canvases" on public.canvases for select using (auth.uid() = user_id);
create policy "Users can insert own canvases" on public.canvases for insert with check (auth.uid() = user_id);
create policy "Users can update own canvases" on public.canvases for update using (auth.uid() = user_id);
create policy "Users can delete own canvases" on public.canvases for delete using (auth.uid() = user_id);
create policy "Public can view public canvases" on public.canvases for select using (is_public = true);

-- 8. Functions & Triggers

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Auto-promote first user to admin
create or replace function public.auto_promote_first_user()
returns trigger as $$
begin
    if (select count(*) from public.profiles) = 1 then
        new.role = 'admin';
    end if;
    return new;
end;
$$ language plpgsql;

drop trigger if exists trigger_auto_promote_first_user on public.profiles;
create trigger trigger_auto_promote_first_user
    before insert on public.profiles
    for each row
    execute function public.auto_promote_first_user();
