-- Check User Account Status
-- Run this in your Supabase SQL Editor to troubleshoot login issues

-- Check all users in auth.users table
SELECT 
    id,
    email,
    email_confirmed_at,
    created_at,
    last_sign_in_at,
    raw_user_meta_data
FROM auth.users 
ORDER BY created_at DESC;

-- Check profiles table for user data
SELECT 
    id,
    email,
    full_name,
    plan,
    created_at
FROM profiles 
ORDER BY created_at DESC;

-- Check for specific email (replace 'user@example.com' with the actual email)
-- SELECT 
--     u.id,
--     u.email,
--     u.email_confirmed_at,
--     p.full_name,
--     p.plan
-- FROM auth.users u
-- LEFT JOIN profiles p ON u.id = p.id
-- WHERE u.email = 'user@example.com';
