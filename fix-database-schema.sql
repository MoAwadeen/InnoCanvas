-- Fix Database Schema - Add Missing Columns
-- Run this SQL in your Supabase SQL editor

-- 1. Add missing columns to canvases table
DO $$ 
BEGIN
    -- Add tags column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'canvases' AND column_name = 'tags') THEN
        ALTER TABLE canvases ADD COLUMN tags TEXT[];
        RAISE NOTICE 'Added tags column to canvases table';
    END IF;

    -- Add title column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'canvases' AND column_name = 'title') THEN
        ALTER TABLE canvases ADD COLUMN title TEXT;
        RAISE NOTICE 'Added title column to canvases table';
    END IF;

    -- Add is_public column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'canvases' AND column_name = 'is_public') THEN
        ALTER TABLE canvases ADD COLUMN is_public BOOLEAN DEFAULT FALSE;
        RAISE NOTICE 'Added is_public column to canvases table';
    END IF;

    -- Add view_count column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'canvases' AND column_name = 'view_count') THEN
        ALTER TABLE canvases ADD COLUMN view_count INTEGER DEFAULT 0;
        RAISE NOTICE 'Added view_count column to canvases table';
    END IF;

    -- Add export_count column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'canvases' AND column_name = 'export_count') THEN
        ALTER TABLE canvases ADD COLUMN export_count INTEGER DEFAULT 0;
        RAISE NOTICE 'Added export_count column to canvases table';
    END IF;
END $$;

-- 2. Add missing columns to profiles table
DO $$ 
BEGIN
    -- Add email column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'profiles' AND column_name = 'email') THEN
        ALTER TABLE profiles ADD COLUMN email TEXT;
        RAISE NOTICE 'Added email column to profiles table';
    END IF;

    -- Add phone column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'profiles' AND column_name = 'phone') THEN
        ALTER TABLE profiles ADD COLUMN phone TEXT;
        RAISE NOTICE 'Added phone column to profiles table';
    END IF;

    -- Add company column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'profiles' AND column_name = 'company') THEN
        ALTER TABLE profiles ADD COLUMN company TEXT;
        RAISE NOTICE 'Added company column to profiles table';
    END IF;

    -- Add job_title column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'profiles' AND column_name = 'job_title') THEN
        ALTER TABLE profiles ADD COLUMN job_title TEXT;
        RAISE NOTICE 'Added job_title column to profiles table';
    END IF;

    -- Add industry column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'profiles' AND column_name = 'industry') THEN
        ALTER TABLE profiles ADD COLUMN industry TEXT;
        RAISE NOTICE 'Added industry column to profiles table';
    END IF;

    -- Add experience_level column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'profiles' AND column_name = 'experience_level') THEN
        ALTER TABLE profiles ADD COLUMN experience_level TEXT;
        RAISE NOTICE 'Added experience_level column to profiles table';
    END IF;

    -- Add plan column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'profiles' AND column_name = 'plan') THEN
        ALTER TABLE profiles ADD COLUMN plan TEXT DEFAULT 'free';
        RAISE NOTICE 'Added plan column to profiles table';
    END IF;

    -- Add plan_expiry column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'profiles' AND column_name = 'plan_expiry') THEN
        ALTER TABLE profiles ADD COLUMN plan_expiry TIMESTAMP WITH TIME ZONE;
        RAISE NOTICE 'Added plan_expiry column to profiles table';
    END IF;

    -- Add subscription_id column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'profiles' AND column_name = 'subscription_id') THEN
        ALTER TABLE profiles ADD COLUMN subscription_id TEXT;
        RAISE NOTICE 'Added subscription_id column to profiles table';
    END IF;

    -- Add payment_provider column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'profiles' AND column_name = 'payment_provider') THEN
        ALTER TABLE profiles ADD COLUMN payment_provider TEXT DEFAULT 'lemonsqueezy';
        RAISE NOTICE 'Added payment_provider column to profiles table';
    END IF;

    -- Add preferences column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'profiles' AND column_name = 'preferences') THEN
        ALTER TABLE profiles ADD COLUMN preferences JSONB DEFAULT '{"theme": "dark", "notifications": true, "newsletter": true, "language": "en"}';
        RAISE NOTICE 'Added preferences column to profiles table';
    END IF;

    -- Add statistics column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'profiles' AND column_name = 'statistics') THEN
        ALTER TABLE profiles ADD COLUMN statistics JSONB DEFAULT '{"canvases_created": 0, "last_login": null, "total_exports": 0, "favorite_colors": []}';
        RAISE NOTICE 'Added statistics column to profiles table';
    END IF;
END $$;

-- 3. Create missing indexes
CREATE INDEX IF NOT EXISTS idx_canvases_tags ON canvases USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_canvases_public ON canvases(is_public) WHERE is_public = true;
CREATE INDEX IF NOT EXISTS idx_profiles_plan ON profiles(plan);
CREATE INDEX IF NOT EXISTS idx_profiles_plan_expiry ON profiles(plan_expiry);

-- 4. Ensure RLS policies are up to date
DROP POLICY IF EXISTS "Users can view public canvases" ON canvases;
CREATE POLICY "Users can view public canvases" ON canvases
  FOR SELECT USING (is_public = true);

-- 5. Make sure plan_limits table exists and has data
CREATE TABLE IF NOT EXISTS plan_limits (
  plan TEXT PRIMARY KEY,
  max_canvases INTEGER NOT NULL,
  pdf_download BOOLEAN DEFAULT FALSE,
  color_customization BOOLEAN DEFAULT FALSE,
  ai_consultant BOOLEAN DEFAULT FALSE,
  templates_access BOOLEAN DEFAULT FALSE,
  remove_watermark BOOLEAN DEFAULT FALSE,
  priority_support BOOLEAN DEFAULT FALSE,
  api_access BOOLEAN DEFAULT FALSE,
  team_collaboration BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default plan limits if they don't exist
INSERT INTO plan_limits (plan, max_canvases, pdf_download, color_customization, ai_consultant, templates_access, remove_watermark, priority_support, api_access, team_collaboration) VALUES
  ('free', 1, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE),
  ('pro', 10, TRUE, TRUE, TRUE, TRUE, FALSE, FALSE, FALSE, FALSE),
  ('premium', -1, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE)
ON CONFLICT (plan) DO UPDATE SET
  max_canvases = EXCLUDED.max_canvases,
  pdf_download = EXCLUDED.pdf_download,
  color_customization = EXCLUDED.color_customization,
  ai_consultant = EXCLUDED.ai_consultant,
  templates_access = EXCLUDED.templates_access,
  remove_watermark = EXCLUDED.remove_watermark,
  priority_support = EXCLUDED.priority_support,
  api_access = EXCLUDED.api_access,
  team_collaboration = EXCLUDED.team_collaboration,
  updated_at = NOW();

-- 6. Ensure subscriptions table exists
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  subscription_id TEXT UNIQUE NOT NULL,
  plan TEXT NOT NULL REFERENCES plan_limits(plan),
  status TEXT NOT NULL DEFAULT 'active',
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  payment_provider TEXT DEFAULT 'lemonsqueezy',
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for subscriptions if they don't exist
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);

-- 7. Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE canvases ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE plan_limits ENABLE ROW LEVEL SECURITY;

RAISE NOTICE 'Database schema fix completed successfully!';
