-- Test Email Configuration
-- Run this in your Supabase SQL editor to check email settings

-- Check if email confirmations are enabled
SELECT 
  'Email confirmations enabled: ' || 
  CASE 
    WHEN (SELECT value FROM auth.config WHERE key = 'enable_signup') = 'true' THEN 'YES'
    ELSE 'NO'
  END as email_status;

-- Check current auth settings
SELECT 
  key,
  value,
  updated_at
FROM auth.config 
WHERE key IN ('enable_signup', 'enable_confirmations', 'mailer_autoconfirm');

-- Check recent auth events (if any)
SELECT 
  event_type,
  created_at,
  ip_address
FROM auth.audit_log_entries 
WHERE event_type = 'signup'
ORDER BY created_at DESC 
LIMIT 5; 