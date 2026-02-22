-- WARNING: This schema is for reference/context only.
-- It reflects the actual live Supabase database as of Feb 2026.
-- Do NOT run this file blindly — it may conflict with existing data.

-- =====================================================
-- 1. Profiles Table
-- =====================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL DEFAULT '',
  email text NOT NULL DEFAULT '',
  age integer,
  gender text NOT NULL DEFAULT 'prefer-not-to-say',
  country text NOT NULL DEFAULT 'Unknown',
  use_case text NOT NULL DEFAULT 'other',
  avatar_url text,
  phone text,
  company text,
  job_title text,
  industry text,
  experience_level text,
  plan text NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'pro', 'premium')),
  plan_expiry timestamp with time zone,
  subscription_id text,
  subscription_status text NOT NULL DEFAULT 'free' CHECK (subscription_status IN ('free', 'active', 'cancelled', 'past_due', 'trialing')),
  subscription_plan text,
  current_period_start timestamp with time zone,
  current_period_end timestamp with time zone,
  payment_provider text NOT NULL DEFAULT 'none',
  role text NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  is_verified boolean NOT NULL DEFAULT false,
  last_sign_in_at timestamp with time zone,
  preferences jsonb NOT NULL DEFAULT '{"theme": "dark", "language": "en", "newsletter": true, "notifications": true}',
  statistics jsonb NOT NULL DEFAULT '{"last_login": null, "total_exports": 0, "favorite_colors": [], "canvases_created": 0}',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT profiles_pkey PRIMARY KEY (id)
);

-- =====================================================
-- 2. Canvases Table
-- =====================================================
CREATE TABLE IF NOT EXISTS public.canvases (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title text NOT NULL DEFAULT 'Untitled Canvas',
  description text,
  business_description text,
  content jsonb,
  canvas_data jsonb,
  form_data jsonb,
  logo_url text,
  colors jsonb DEFAULT '{"card": "#1a1a2e", "primary": "#a855f7", "background": "#0d0d1a", "foreground": "#ffffff"}',
  remove_watermark boolean NOT NULL DEFAULT false,
  is_public boolean NOT NULL DEFAULT false,
  view_count integer NOT NULL DEFAULT 0,
  export_count integer NOT NULL DEFAULT 0,
  tags text[] DEFAULT '{}',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT canvases_pkey PRIMARY KEY (id)
);

-- =====================================================
-- 3. Plan Limits Table
-- =====================================================
CREATE TABLE IF NOT EXISTS public.plan_limits (
  plan text NOT NULL CHECK (plan IN ('free', 'pro', 'premium')),
  max_canvases integer NOT NULL DEFAULT 1,
  pdf_download boolean NOT NULL DEFAULT false,
  color_customization boolean NOT NULL DEFAULT false,
  ai_consultant boolean NOT NULL DEFAULT false,
  templates_access boolean NOT NULL DEFAULT false,
  remove_watermark boolean NOT NULL DEFAULT false,
  priority_support boolean NOT NULL DEFAULT false,
  api_access boolean NOT NULL DEFAULT false,
  team_collaboration boolean NOT NULL DEFAULT false,
  CONSTRAINT plan_limits_pkey PRIMARY KEY (plan)
);

INSERT INTO public.plan_limits (plan, max_canvases, pdf_download, color_customization, ai_consultant, templates_access, remove_watermark, priority_support, api_access, team_collaboration) VALUES
  ('free', 1, false, false, false, false, false, false, false, false),
  ('pro', 10, true, true, true, true, false, false, false, false),
  ('premium', -1, true, true, true, true, true, true, true, true)
ON CONFLICT (plan) DO NOTHING;

-- =====================================================
-- 4. RLS Policies
-- =====================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.canvases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plan_limits ENABLE ROW LEVEL SECURITY;

-- Profiles: users can read/write their own profile
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Admin: admins can read all profiles
CREATE POLICY "Admins can view all profiles" ON public.profiles FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Canvases: users can CRUD their own canvases
CREATE POLICY "Users can view own canvases" ON public.canvases FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own canvases" ON public.canvases FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own canvases" ON public.canvases FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own canvases" ON public.canvases FOR DELETE USING (auth.uid() = user_id);

-- Canvases: anyone can view public canvases (for sharing)
CREATE POLICY "Anyone can view public canvases" ON public.canvases FOR SELECT USING (is_public = true);

-- Plan limits: anyone can read (needed for plan checks)
CREATE POLICY "Anyone can read plan limits" ON public.plan_limits FOR SELECT USING (true);

-- =====================================================
-- 5. Functions & Triggers
-- =====================================================

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', NEW.raw_user_meta_data->>'picture')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Auto-promote first user to admin
CREATE OR REPLACE FUNCTION public.auto_promote_first_user()
RETURNS trigger AS $$
BEGIN
    IF (SELECT count(*) FROM public.profiles) = 1 THEN
        NEW.role = 'admin';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_auto_promote_first_user ON public.profiles;
CREATE TRIGGER trigger_auto_promote_first_user
    BEFORE INSERT ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.auto_promote_first_user();
