-- Add Missing Profile Columns
-- Run this SQL in your Supabase SQL editor

-- Add missing columns to profiles table
DO $$ 
BEGIN
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
END $$;

-- Create indexes for the new columns
CREATE INDEX IF NOT EXISTS idx_profiles_plan ON profiles(plan);
CREATE INDEX IF NOT EXISTS idx_profiles_plan_expiry ON profiles(plan_expiry);

-- Add foreign key constraint for plan column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'profiles_plan_fkey' 
        AND table_name = 'profiles'
    ) THEN
        -- First, make sure plan_limits table exists
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'plan_limits') THEN
            ALTER TABLE profiles ADD CONSTRAINT profiles_plan_fkey 
            FOREIGN KEY (plan) REFERENCES plan_limits(plan);
            RAISE NOTICE 'Added foreign key constraint for plan column';
        ELSE
            RAISE NOTICE 'plan_limits table does not exist, skipping foreign key constraint';
        END IF;
    END IF;
END $$;

RAISE NOTICE 'Profile columns have been added successfully!';
