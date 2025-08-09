-- Quick Fix for Missing Tags Column
-- Run this in your Supabase SQL editor

-- Add tags column to canvases table
ALTER TABLE IF EXISTS canvases ADD COLUMN IF NOT EXISTS tags TEXT[];

-- Add other missing columns
ALTER TABLE IF EXISTS canvases ADD COLUMN IF NOT EXISTS title TEXT;
ALTER TABLE IF EXISTS canvases ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT FALSE;
ALTER TABLE IF EXISTS canvases ADD COLUMN IF NOT EXISTS view_count INTEGER DEFAULT 0;
ALTER TABLE IF EXISTS canvases ADD COLUMN IF NOT EXISTS export_count INTEGER DEFAULT 0;

-- Create index for tags if it doesn't exist
CREATE INDEX IF NOT EXISTS idx_canvases_tags ON canvases USING GIN(tags);

-- Create index for public canvases if it doesn't exist
CREATE INDEX IF NOT EXISTS idx_canvases_public ON canvases(is_public) WHERE is_public = true;

RAISE NOTICE 'Tags column and other missing columns have been added successfully!';
