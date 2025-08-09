-- Complete InnoCanvas Supabase Database Setup
-- Run this SQL in your Supabase SQL editor to create all tables and configurations

-- ============================================================================
-- 1. CREATE TABLES
-- ============================================================================

-- Create plan_limits table to define plan features and limits
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

-- Create profiles table with enhanced fields including plan management
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  age INTEGER,
  gender TEXT,
  country TEXT,
  use_case TEXT,
  avatar_url TEXT,
  email TEXT,
  phone TEXT,
  company TEXT,
  job_title TEXT,
  industry TEXT,
  experience_level TEXT,
  plan TEXT DEFAULT 'free' REFERENCES plan_limits(plan),
  plan_expiry TIMESTAMP WITH TIME ZONE,
  subscription_id TEXT,
  payment_provider TEXT DEFAULT 'lemonsqueezy',
  preferences JSONB DEFAULT '{"theme": "dark", "notifications": true, "newsletter": true, "language": "en"}',
  statistics JSONB DEFAULT '{"canvases_created": 0, "last_login": null, "total_exports": 0, "favorite_colors": []}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create canvases table with enhanced fields
CREATE TABLE IF NOT EXISTS canvases (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  business_description TEXT NOT NULL,
  canvas_data JSONB NOT NULL,
  form_data JSONB NOT NULL,
  logo_url TEXT,
  remove_watermark BOOLEAN DEFAULT FALSE,
  colors JSONB DEFAULT '{"primary": "#30A2FF", "card": "#1c2333", "background": "#0a0f1c", "foreground": "#ffffff"}',
  title TEXT,
  tags TEXT[],
  is_public BOOLEAN DEFAULT FALSE,
  view_count INTEGER DEFAULT 0,
  export_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create subscriptions table for tracking payment subscriptions
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

-- ============================================================================
-- 2. INSERT DEFAULT DATA
-- ============================================================================

-- Insert default plan limits
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

-- ============================================================================
-- 3. CREATE INDEXES
-- ============================================================================

-- Indexes for canvases table
CREATE INDEX IF NOT EXISTS idx_canvases_user_id ON canvases(user_id);
CREATE INDEX IF NOT EXISTS idx_canvases_created_at ON canvases(created_at);
CREATE INDEX IF NOT EXISTS idx_canvases_tags ON canvases USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_canvases_public ON canvases(is_public) WHERE is_public = true;

-- Indexes for profiles table
CREATE INDEX IF NOT EXISTS idx_profiles_plan ON profiles(plan);
CREATE INDEX IF NOT EXISTS idx_profiles_plan_expiry ON profiles(plan_expiry);

-- Indexes for subscriptions table
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);

-- ============================================================================
-- 4. ENABLE ROW LEVEL SECURITY
-- ============================================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE canvases ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE plan_limits ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- 5. CREATE RLS POLICIES
-- ============================================================================

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Users can view own canvases" ON canvases;
DROP POLICY IF EXISTS "Users can insert own canvases" ON canvases;
DROP POLICY IF EXISTS "Users can update own canvases" ON canvases;
DROP POLICY IF EXISTS "Users can delete own canvases" ON canvases;
DROP POLICY IF EXISTS "Users can view public canvases" ON canvases;
DROP POLICY IF EXISTS "Users can view own subscriptions" ON subscriptions;
DROP POLICY IF EXISTS "Users can view plan limits" ON plan_limits;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Canvases policies
CREATE POLICY "Users can view own canvases" ON canvases
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own canvases" ON canvases
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own canvases" ON canvases
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own canvases" ON canvases
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view public canvases" ON canvases
  FOR SELECT USING (is_public = true);

-- Subscriptions policies
CREATE POLICY "Users can view own subscriptions" ON subscriptions
  FOR SELECT USING (auth.uid() = user_id);

-- Plan limits policies
CREATE POLICY "Users can view plan limits" ON plan_limits
  FOR SELECT USING (true);

-- ============================================================================
-- 6. CREATE FUNCTIONS
-- ============================================================================

-- Function to handle user creation with enhanced fields
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (
    id, 
    full_name, 
    age,
    gender,
    country,
    use_case,
    avatar_url,
    email,
    plan,
    preferences,
    statistics
  )
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Unknown'), 
    CASE 
      WHEN NEW.raw_user_meta_data->>'age' IS NOT NULL 
      THEN (NEW.raw_user_meta_data->>'age')::INTEGER 
      ELSE NULL 
    END,
    COALESCE(NEW.raw_user_meta_data->>'gender', 'prefer-not-to-say'),
    COALESCE(NEW.raw_user_meta_data->>'country', 'Unknown'),
    COALESCE(NEW.raw_user_meta_data->>'use_case', 'other'),
    NEW.raw_user_meta_data->>'avatar_url',
    NEW.email,
    'free',
    '{"theme": "dark", "notifications": true, "newsletter": true, "language": "en"}',
    '{"canvases_created": 0, "last_login": null, "total_exports": 0, "favorite_colors": []}'
  );
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log the error but don't fail the user creation
    RAISE LOG 'Error in handle_new_user trigger: %', SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update user statistics
CREATE OR REPLACE FUNCTION update_user_statistics()
RETURNS TRIGGER AS $$
BEGIN
  -- Update canvas count and last login
  UPDATE profiles 
  SET 
    statistics = jsonb_set(
      jsonb_set(
        COALESCE(statistics, '{}'::jsonb),
        '{canvases_created}',
        to_jsonb(COALESCE((statistics->>'canvases_created')::int, 0) + 1)
      ),
      '{last_login}',
      to_jsonb(NOW())
    ),
    updated_at = NOW()
  WHERE id = NEW.user_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check plan limits
CREATE OR REPLACE FUNCTION check_plan_limits(user_uuid UUID, action TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  user_plan TEXT;
  plan_limit RECORD;
  canvas_count INTEGER;
BEGIN
  -- Get user's plan
  SELECT plan INTO user_plan FROM profiles WHERE id = user_uuid;
  IF NOT FOUND THEN
    RETURN FALSE;
  END IF;
  
  -- Get plan limits
  SELECT * INTO plan_limit FROM plan_limits WHERE plan = user_plan;
  IF NOT FOUND THEN
    RETURN FALSE;
  END IF;
  
  -- Check if plan is expired
  IF EXISTS (SELECT 1 FROM profiles WHERE id = user_uuid AND plan_expiry < NOW() AND plan != 'free') THEN
    -- Downgrade to free plan
    UPDATE profiles SET plan = 'free', plan_expiry = NULL WHERE id = user_uuid;
    user_plan := 'free';
    SELECT * INTO plan_limit FROM plan_limits WHERE plan = 'free';
  END IF;
  
  -- Handle different actions
  CASE action
    WHEN 'create_canvas' THEN
      -- Check canvas limit
      IF plan_limit.max_canvases = -1 THEN
        RETURN TRUE; -- Unlimited
      END IF;
      
      SELECT COUNT(*) INTO canvas_count FROM canvases WHERE user_id = user_uuid;
      RETURN canvas_count < plan_limit.max_canvases;
      
    WHEN 'pdf_download' THEN
      RETURN plan_limit.pdf_download;
      
    WHEN 'color_customization' THEN
      RETURN plan_limit.color_customization;
      
    WHEN 'ai_consultant' THEN
      RETURN plan_limit.ai_consultant;
      
    WHEN 'templates_access' THEN
      RETURN plan_limit.templates_access;
      
    WHEN 'remove_watermark' THEN
      RETURN plan_limit.remove_watermark;
      
    WHEN 'priority_support' THEN
      RETURN plan_limit.priority_support;
      
    WHEN 'api_access' THEN
      RETURN plan_limit.api_access;
      
    WHEN 'team_collaboration' THEN
      RETURN plan_limit.team_collaboration;
      
    ELSE
      RETURN FALSE;
  END CASE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to auto-downgrade expired subscriptions
CREATE OR REPLACE FUNCTION auto_downgrade_expired_subscriptions()
RETURNS void AS $$
BEGIN
  UPDATE profiles 
  SET 
    plan = 'free',
    plan_expiry = NULL,
    updated_at = NOW()
  WHERE 
    plan_expiry < NOW() 
    AND plan != 'free';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- 7. CREATE TRIGGERS
-- ============================================================================

-- Drop existing triggers if they exist
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS on_canvas_created ON canvases;

-- Create trigger for new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Create trigger to update user statistics when canvas is created
CREATE TRIGGER on_canvas_created
  AFTER INSERT ON canvases
  FOR EACH ROW EXECUTE FUNCTION update_user_statistics();

-- ============================================================================
-- 8. STORAGE POLICIES (COMMENTED - CREATE BUCKETS FIRST)
-- ============================================================================

-- IMPORTANT: Before running these policies, you need to create the storage buckets first:
-- 1. Go to Supabase Dashboard > Storage
-- 2. Create a bucket called 'logos' (set to public)
-- 3. Create a bucket called 'avatars' (set to public)
-- 4. Then uncomment and run these policies:

/*
-- Storage policies for logos bucket
CREATE POLICY "Users can upload logos" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'logos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view logos" ON storage.objects
  FOR SELECT USING (bucket_id = 'logos');

-- Storage policies for avatars bucket
CREATE POLICY "Users can upload avatars" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view avatars" ON storage.objects
  FOR SELECT USING (bucket_id = 'avatars');
*/

-- ============================================================================
-- 9. GRANT PERMISSIONS
-- ============================================================================

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON profiles TO authenticated;
GRANT ALL ON canvases TO authenticated;
GRANT ALL ON subscriptions TO authenticated;
GRANT ALL ON plan_limits TO authenticated;

-- ============================================================================
-- 10. FINAL SETUP
-- ============================================================================

-- Create a function to check if setup is complete
CREATE OR REPLACE FUNCTION check_setup_complete()
RETURNS TABLE(component TEXT, status TEXT) AS $$
BEGIN
  RETURN QUERY SELECT 'plan_limits table'::TEXT, 
    CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'plan_limits') 
    THEN 'OK'::TEXT ELSE 'MISSING'::TEXT END;
  
  RETURN QUERY SELECT 'profiles table'::TEXT, 
    CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'profiles') 
    THEN 'OK'::TEXT ELSE 'MISSING'::TEXT END;
  
  RETURN QUERY SELECT 'canvases table'::TEXT, 
    CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'canvases') 
    THEN 'OK'::TEXT ELSE 'MISSING'::TEXT END;
  
  RETURN QUERY SELECT 'subscriptions table'::TEXT, 
    CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'subscriptions') 
    THEN 'OK'::TEXT ELSE 'MISSING'::TEXT END;
  
  RETURN QUERY SELECT 'RLS policies'::TEXT, 
    CASE WHEN EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'profiles') 
    THEN 'OK'::TEXT ELSE 'MISSING'::TEXT END;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- COMPLETION MESSAGE
-- ============================================================================

DO $$
BEGIN
  RAISE NOTICE '=========================================';
  RAISE NOTICE 'InnoCanvas Database Setup Complete!';
  RAISE NOTICE '=========================================';
  RAISE NOTICE '';
  RAISE NOTICE 'Next steps:';
  RAISE NOTICE '1. Go to Storage and create "logos" bucket (public)';
  RAISE NOTICE '2. Go to Storage and create "avatars" bucket (public)';
  RAISE NOTICE '3. Run the storage policies (commented at the bottom)';
  RAISE NOTICE '4. Test the setup by running: SELECT * FROM check_setup_complete();';
  RAISE NOTICE '';
  RAISE NOTICE 'Setup completed successfully!';
END $$;
