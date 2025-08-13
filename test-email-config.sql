-- Test Email Configuration
-- Run this in your Supabase SQL Editor to check email settings

-- Check current auth configuration
SELECT 
    id,
    email_otp_expiry,
    enable_signup,
    enable_email_confirmations,
    enable_email_change_confirmations,
    enable_phone_confirmations
FROM auth.config 
WHERE id = 1;

-- Check if there are any pending email confirmations
SELECT 
    id,
    email,
    email_confirmed_at,
    created_at,
    raw_user_meta_data
FROM auth.users 
WHERE email_confirmed_at IS NULL
ORDER BY created_at DESC;

-- Check recent signup attempts
SELECT 
    id,
    email,
    created_at,
    email_confirmed_at,
    CASE 
        WHEN email_confirmed_at IS NULL THEN 'Pending Confirmation'
        ELSE 'Confirmed'
    END as status
FROM auth.users 
WHERE created_at >= NOW() - INTERVAL '24 hours'
ORDER BY created_at DESC;
