-- Add missing columns to canvases table
-- Run this SQL in your Supabase SQL editor

-- Add tags column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'canvases' AND column_name = 'tags') THEN
        ALTER TABLE canvases ADD COLUMN tags TEXT[];
    END IF;
END $$;

-- Add title column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'canvases' AND column_name = 'title') THEN
        ALTER TABLE canvases ADD COLUMN title TEXT;
    END IF;
END $$;

-- Add is_public column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'canvases' AND column_name = 'is_public') THEN
        ALTER TABLE canvases ADD COLUMN is_public BOOLEAN DEFAULT FALSE;
    END IF;
END $$;

-- Add view_count column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'canvases' AND column_name = 'view_count') THEN
        ALTER TABLE canvases ADD COLUMN view_count INTEGER DEFAULT 0;
    END IF;
END $$;

-- Add export_count column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'canvases' AND column_name = 'export_count') THEN
        ALTER TABLE canvases ADD COLUMN export_count INTEGER DEFAULT 0;
    END IF;
END $$;

-- Create indexes for the new columns
CREATE INDEX IF NOT EXISTS idx_canvases_tags ON canvases USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_canvases_public ON canvases(is_public) WHERE is_public = true;

-- Update RLS policies to include the new columns
DROP POLICY IF EXISTS "Users can view public canvases" ON canvases;
CREATE POLICY "Users can view public canvases" ON canvases
  FOR SELECT USING (is_public = true);
