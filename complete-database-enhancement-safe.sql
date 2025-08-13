-- Complete Database Enhancement Script for InnoCanvas (Safe Version)
-- This script enhances the entire database with all missing columns and admin functionality
-- Run this in your Supabase SQL editor

-- ============================================================================
-- 1. ENHANCE PROFILES TABLE WITH ALL MISSING COLUMNS
-- ============================================================================

-- Add created_at column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'profiles' AND column_name = 'created_at'
    ) THEN
        ALTER TABLE profiles ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;
END $$;

-- Add updated_at column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'profiles' AND column_name = 'updated_at'
    ) THEN
        ALTER TABLE profiles ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;
END $$;

-- Add role column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'profiles' AND column_name = 'role'
    ) THEN
        ALTER TABLE profiles ADD COLUMN role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin'));
    END IF;
END $$;

-- Add subscription_status column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'profiles' AND column_name = 'subscription_status'
    ) THEN
        ALTER TABLE profiles ADD COLUMN subscription_status TEXT DEFAULT 'inactive' CHECK (subscription_status IN ('active', 'inactive', 'cancelled', 'paused'));
    END IF;
END $$;

-- Add subscription_plan column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'profiles' AND column_name = 'subscription_plan'
    ) THEN
        ALTER TABLE profiles ADD COLUMN subscription_plan TEXT DEFAULT 'free' CHECK (subscription_plan IN ('free', 'pro', 'premium'));
    END IF;
END $$;

-- Add subscription_id column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'profiles' AND column_name = 'subscription_id'
    ) THEN
        ALTER TABLE profiles ADD COLUMN subscription_id TEXT;
    END IF;
END $$;

-- Add subscription_end_date column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'profiles' AND column_name = 'subscription_end_date'
    ) THEN
        ALTER TABLE profiles ADD COLUMN subscription_end_date TIMESTAMP WITH TIME ZONE;
    END IF;
END $$;

-- Add subscription_start_date column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'profiles' AND column_name = 'subscription_start_date'
    ) THEN
        ALTER TABLE profiles ADD COLUMN subscription_start_date TIMESTAMP WITH TIME ZONE;
    END IF;
END $$;

-- Add email column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'profiles' AND column_name = 'email'
    ) THEN
        ALTER TABLE profiles ADD COLUMN email TEXT;
    END IF;
END $$;

-- Add phone column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'profiles' AND column_name = 'phone'
    ) THEN
        ALTER TABLE profiles ADD COLUMN phone TEXT;
    END IF;
END $$;

-- Add company column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'profiles' AND column_name = 'company'
    ) THEN
        ALTER TABLE profiles ADD COLUMN company TEXT;
    END IF;
END $$;

-- Add job_title column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'profiles' AND column_name = 'job_title'
    ) THEN
        ALTER TABLE profiles ADD COLUMN job_title TEXT;
    END IF;
END $$;

-- Add industry column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'profiles' AND column_name = 'industry'
    ) THEN
        ALTER TABLE profiles ADD COLUMN industry TEXT;
    END IF;
END $$;

-- Add experience_level column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'profiles' AND column_name = 'experience_level'
    ) THEN
        ALTER TABLE profiles ADD COLUMN experience_level TEXT;
    END IF;
END $$;

-- Add plan column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'profiles' AND column_name = 'plan'
    ) THEN
        ALTER TABLE profiles ADD COLUMN plan TEXT DEFAULT 'free';
    END IF;
END $$;

-- Add plan_expiry column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'profiles' AND column_name = 'plan_expiry'
    ) THEN
        ALTER TABLE profiles ADD COLUMN plan_expiry TIMESTAMP WITH TIME ZONE;
    END IF;
END $$;

-- Add payment_provider column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'profiles' AND column_name = 'payment_provider'
    ) THEN
        ALTER TABLE profiles ADD COLUMN payment_provider TEXT DEFAULT 'lemonsqueezy';
    END IF;
END $$;

-- Add preferences column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'profiles' AND column_name = 'preferences'
    ) THEN
        ALTER TABLE profiles ADD COLUMN preferences JSONB DEFAULT '{"theme": "dark", "notifications": true, "newsletter": true, "language": "en"}';
    END IF;
END $$;

-- Add statistics column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'profiles' AND column_name = 'statistics'
    ) THEN
        ALTER TABLE profiles ADD COLUMN statistics JSONB DEFAULT '{"canvases_created": 0, "last_login": null, "total_exports": 0, "favorite_colors": []}';
    END IF;
END $$;

-- ============================================================================
-- 2. UPDATE EXISTING PROFILES WITH DEFAULT VALUES
-- ============================================================================

-- Update existing profiles to have proper default values
UPDATE profiles 
SET 
    created_at = COALESCE(created_at, NOW()),
    updated_at = COALESCE(updated_at, NOW()),
    role = COALESCE(role, 'user'),
    subscription_status = COALESCE(subscription_status, 'inactive'),
    subscription_plan = COALESCE(subscription_plan, 'free'),
    plan = COALESCE(plan, 'free'),
    payment_provider = COALESCE(payment_provider, 'lemonsqueezy'),
    preferences = COALESCE(preferences, '{"theme": "dark", "notifications": true, "newsletter": true, "language": "en"}'),
    statistics = COALESCE(statistics, '{"canvases_created": 0, "last_login": null, "total_exports": 0, "favorite_colors": []}')
WHERE created_at IS NULL OR updated_at IS NULL OR role IS NULL OR subscription_status IS NULL OR subscription_plan IS NULL OR plan IS NULL OR payment_provider IS NULL OR preferences IS NULL OR statistics IS NULL;

-- ============================================================================
-- 3. ENHANCE CANVASES TABLE WITH MISSING COLUMNS
-- ============================================================================

-- Add title column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'canvases' AND column_name = 'title'
    ) THEN
        ALTER TABLE canvases ADD COLUMN title TEXT;
    END IF;
END $$;

-- Add tags column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'canvases' AND column_name = 'tags'
    ) THEN
        ALTER TABLE canvases ADD COLUMN tags TEXT[];
    END IF;
END $$;

-- Add is_public column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'canvases' AND column_name = 'is_public'
    ) THEN
        ALTER TABLE canvases ADD COLUMN is_public BOOLEAN DEFAULT FALSE;
    END IF;
END $$;

-- Add view_count column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'canvases' AND column_name = 'view_count'
    ) THEN
        ALTER TABLE canvases ADD COLUMN view_count INTEGER DEFAULT 0;
    END IF;
END $$;

-- Add export_count column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'canvases' AND column_name = 'export_count'
    ) THEN
        ALTER TABLE canvases ADD COLUMN export_count INTEGER DEFAULT 0;
    END IF;
END $$;

-- ============================================================================
-- 4. CREATE PLAN_LIMITS TABLE IF IT DOESN'T EXIST
-- ============================================================================

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
-- 5. CREATE SUBSCRIPTIONS TABLE IF IT DOESN'T EXIST
-- ============================================================================

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
-- 6. CREATE SYSTEM SETTINGS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS system_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    key TEXT UNIQUE NOT NULL,
    value JSONB NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default system settings
INSERT INTO system_settings (key, value, description) VALUES
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
ON CONFLICT (key) DO UPDATE SET
    value = EXCLUDED.value,
    description = EXCLUDED.description,
    updated_at = NOW();

-- ============================================================================
-- 7. CREATE ADMIN ACTIVITY LOG TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS admin_activity_log (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    admin_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    action TEXT NOT NULL,
    target_type TEXT NOT NULL,
    target_id UUID,
    details JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- 8. CREATE ADMIN FUNCTIONS
-- ============================================================================

-- Function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = user_id AND role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to promote user to admin
CREATE OR REPLACE FUNCTION promote_to_admin(target_user_id UUID, admin_user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    -- Check if the requesting user is an admin
    IF NOT is_admin(admin_user_id) THEN
        RAISE EXCEPTION 'Only admins can promote users';
    END IF;
    
    -- Update the target user's role
    UPDATE profiles SET role = 'admin' WHERE id = target_user_id;
    
    -- Log the activity
    PERFORM log_admin_activity(admin_user_id, 'promote_to_admin', 'user', target_user_id, '{"previous_role": "user", "new_role": "admin"}');
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to demote admin to user
CREATE OR REPLACE FUNCTION demote_from_admin(target_user_id UUID, admin_user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    -- Check if the requesting user is an admin
    IF NOT is_admin(admin_user_id) THEN
        RAISE EXCEPTION 'Only admins can demote users';
    END IF;
    
    -- Prevent demoting the last admin
    IF (SELECT COUNT(*) FROM profiles WHERE role = 'admin') <= 1 THEN
        RAISE EXCEPTION 'Cannot demote the last admin';
    END IF;
    
    -- Update the target user's role
    UPDATE profiles SET role = 'user' WHERE id = target_user_id;
    
    -- Log the activity
    PERFORM log_admin_activity(admin_user_id, 'demote_from_admin', 'user', target_user_id, '{"previous_role": "admin", "new_role": "user"}');
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get system setting
CREATE OR REPLACE FUNCTION get_system_setting(setting_key TEXT)
RETURNS JSONB AS $$
DECLARE
    setting_value JSONB;
BEGIN
    SELECT value INTO setting_value
    FROM system_settings
    WHERE key = setting_key;
    
    RETURN setting_value;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update system setting
CREATE OR REPLACE FUNCTION update_system_setting(setting_key TEXT, setting_value JSONB, admin_user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    -- Check if the requesting user is an admin
    IF NOT is_admin(admin_user_id) THEN
        RAISE EXCEPTION 'Only admins can update system settings';
    END IF;
    
    -- Update the setting
    UPDATE system_settings 
    SET value = setting_value, updated_at = NOW()
    WHERE key = setting_key;
    
    -- Log the activity
    PERFORM log_admin_activity(admin_user_id, 'update_system_setting', 'system_setting', NULL, jsonb_build_object('key', setting_key, 'value', setting_value));
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to log admin activity
CREATE OR REPLACE FUNCTION log_admin_activity(admin_user_id UUID, action TEXT, target_type TEXT, target_id UUID, details_json JSONB)
RETURNS UUID AS $$
DECLARE
    log_id UUID;
BEGIN
    INSERT INTO admin_activity_log (
        admin_user_id,
        action,
        target_type,
        target_id,
        details
    ) VALUES (
        admin_user_id,
        action,
        target_type,
        target_id,
        details_json
    ) RETURNING id INTO log_id;
    
    RETURN log_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- 9. CREATE ADMIN DASHBOARD VIEW
-- ============================================================================

-- Drop existing view if it exists
DROP VIEW IF EXISTS admin_dashboard_stats;

-- Create admin dashboard statistics view
CREATE OR REPLACE VIEW admin_dashboard_stats AS
SELECT 
    (SELECT COUNT(*) FROM profiles) as total_users,
    (SELECT COUNT(*) FROM profiles WHERE subscription_status = 'active') as active_subscriptions,
    (SELECT COUNT(*) FROM canvases) as total_canvases,
    (SELECT COUNT(*) FROM profiles WHERE created_at >= date_trunc('month', NOW())) as new_users_this_month,
    (SELECT COUNT(*) FROM canvases WHERE created_at >= date_trunc('month', NOW())) as new_canvases_this_month,
    (SELECT COUNT(*) FROM profiles WHERE role = 'admin') as total_admins;

-- Function to get admin dashboard data
CREATE OR REPLACE FUNCTION get_admin_dashboard_data()
RETURNS JSONB AS $$
DECLARE
    result JSONB;
BEGIN
    SELECT jsonb_build_object(
        'stats', (SELECT row_to_json(s) FROM admin_dashboard_stats s),
        'recent_users', (
            SELECT jsonb_agg(row_to_json(u))
            FROM (
                SELECT id, email, full_name, created_at, subscription_status, subscription_plan, role
                FROM profiles
                ORDER BY created_at DESC
                LIMIT 10
            ) u
        ),
        'recent_canvases', (
            SELECT jsonb_agg(row_to_json(c))
            FROM (
                SELECT c.id, c.title, c.created_at, p.email as user_email, p.full_name as user_name
                FROM canvases c
                JOIN profiles p ON c.user_id = p.id
                ORDER BY c.created_at DESC
                LIMIT 10
            ) c
        )
    ) INTO result;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- 10. CREATE INDEXES FOR PERFORMANCE
-- ============================================================================

-- Profiles indexes
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_subscription_status ON profiles(subscription_status);
CREATE INDEX IF NOT EXISTS idx_profiles_subscription_plan ON profiles(subscription_plan);
CREATE INDEX IF NOT EXISTS idx_profiles_created_at ON profiles(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_profiles_updated_at ON profiles(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);

-- Canvases indexes
CREATE INDEX IF NOT EXISTS idx_canvases_user_id ON canvases(user_id);
CREATE INDEX IF NOT EXISTS idx_canvases_created_at ON canvases(created_at);
CREATE INDEX IF NOT EXISTS idx_canvases_tags ON canvases USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_canvases_public ON canvases(is_public) WHERE is_public = true;
CREATE INDEX IF NOT EXISTS idx_canvases_title ON canvases(title);

-- Subscriptions indexes
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_subscription_id ON subscriptions(subscription_id);

-- Admin activity log indexes
CREATE INDEX IF NOT EXISTS idx_admin_activity_log_admin_user_id ON admin_activity_log(admin_user_id);
CREATE INDEX IF NOT EXISTS idx_admin_activity_log_created_at ON admin_activity_log(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_admin_activity_log_action ON admin_activity_log(action);

-- System settings indexes
CREATE INDEX IF NOT EXISTS idx_system_settings_key ON system_settings(key);

-- ============================================================================
-- 11. SET UP ROW LEVEL SECURITY (RLS) - SAFE VERSION
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE canvases ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE plan_limits ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_activity_log ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles (only if they don't exist)
DO $$
BEGIN
    -- Profiles policies
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Users can view own profile') THEN
        CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Users can update own profile') THEN
        CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Users can insert own profile') THEN
        CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Admins can view all profiles') THEN
        CREATE POLICY "Admins can view all profiles" ON profiles FOR SELECT USING (is_admin(auth.uid()));
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Admins can update all profiles') THEN
        CREATE POLICY "Admins can update all profiles" ON profiles FOR UPDATE USING (is_admin(auth.uid()));
    END IF;
    
    -- Canvases policies
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'canvases' AND policyname = 'Users can view own canvases') THEN
        CREATE POLICY "Users can view own canvases" ON canvases FOR SELECT USING (auth.uid() = user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'canvases' AND policyname = 'Users can insert own canvases') THEN
        CREATE POLICY "Users can insert own canvases" ON canvases FOR INSERT WITH CHECK (auth.uid() = user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'canvases' AND policyname = 'Users can update own canvases') THEN
        CREATE POLICY "Users can update own canvases" ON canvases FOR UPDATE USING (auth.uid() = user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'canvases' AND policyname = 'Users can delete own canvases') THEN
        CREATE POLICY "Users can delete own canvases" ON canvases FOR DELETE USING (auth.uid() = user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'canvases' AND policyname = 'Admins can view all canvases') THEN
        CREATE POLICY "Admins can view all canvases" ON canvases FOR SELECT USING (is_admin(auth.uid()));
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'canvases' AND policyname = 'Admins can update all canvases') THEN
        CREATE POLICY "Admins can update all canvases" ON canvases FOR UPDATE USING (is_admin(auth.uid()));
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'canvases' AND policyname = 'Admins can delete all canvases') THEN
        CREATE POLICY "Admins can delete all canvases" ON canvases FOR DELETE USING (is_admin(auth.uid()));
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'canvases' AND policyname = 'Public can view public canvases') THEN
        CREATE POLICY "Public can view public canvases" ON canvases FOR SELECT USING (is_public = true);
    END IF;
    
    -- Subscriptions policies
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'subscriptions' AND policyname = 'Users can view own subscriptions') THEN
        CREATE POLICY "Users can view own subscriptions" ON subscriptions FOR SELECT USING (auth.uid() = user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'subscriptions' AND policyname = 'Admins can view all subscriptions') THEN
        CREATE POLICY "Admins can view all subscriptions" ON subscriptions FOR SELECT USING (is_admin(auth.uid()));
    END IF;
    
    -- System settings policies
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'system_settings' AND policyname = 'Admins can view system settings') THEN
        CREATE POLICY "Admins can view system settings" ON system_settings FOR SELECT USING (is_admin(auth.uid()));
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'system_settings' AND policyname = 'Admins can update system settings') THEN
        CREATE POLICY "Admins can update system settings" ON system_settings FOR UPDATE USING (is_admin(auth.uid()));
    END IF;
    
    -- Admin activity log policies
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'admin_activity_log' AND policyname = 'Admins can view admin activity log') THEN
        CREATE POLICY "Admins can view admin activity log" ON admin_activity_log FOR SELECT USING (is_admin(auth.uid()));
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'admin_activity_log' AND policyname = 'Admins can insert admin activity log') THEN
        CREATE POLICY "Admins can insert admin activity log" ON admin_activity_log FOR INSERT WITH CHECK (is_admin(auth.uid()));
    END IF;
END $$;

-- ============================================================================
-- 12. GRANT PERMISSIONS
-- ============================================================================

GRANT EXECUTE ON FUNCTION is_admin(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION promote_to_admin(UUID, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION demote_from_admin(UUID, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_system_setting(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION update_system_setting(TEXT, JSONB, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION log_admin_activity(UUID, TEXT, TEXT, UUID, JSONB) TO authenticated;
GRANT EXECUTE ON FUNCTION get_admin_dashboard_data() TO authenticated;
GRANT SELECT ON admin_dashboard_stats TO authenticated;

-- ============================================================================
-- 13. CREATE AUTO-PROMOTE TRIGGER
-- ============================================================================

-- Create trigger to automatically promote the first user to admin
CREATE OR REPLACE FUNCTION auto_promote_first_user()
RETURNS TRIGGER AS $$
BEGIN
    -- If this is the first user, make them an admin
    IF (SELECT COUNT(*) FROM profiles) = 1 THEN
        NEW.role = 'admin';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_auto_promote_first_user ON profiles;
CREATE TRIGGER trigger_auto_promote_first_user
    BEFORE INSERT ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION auto_promote_first_user();

-- ============================================================================
-- 14. VERIFICATION AND TESTING
-- ============================================================================

-- Verify all columns exist in profiles table
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns 
WHERE table_name = 'profiles' 
ORDER BY column_name;

-- Test the admin dashboard view
SELECT * FROM admin_dashboard_stats;

-- Test admin functions
SELECT 'Database enhancement completed successfully!' as status;
