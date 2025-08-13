-- Fix OTP Expiry Setting for Better Security
-- Run this in your Supabase SQL Editor

-- Update OTP expiry to 30 minutes (1800 seconds) for better security
UPDATE auth.config 
SET email_otp_expiry = 1800 
WHERE id = 1;

-- Alternative: Set to 1 hour (3600 seconds) if you prefer
-- UPDATE auth.config 
-- SET email_otp_expiry = 3600 
-- WHERE id = 1;

-- Verify the change
SELECT email_otp_expiry FROM auth.config WHERE id = 1;
