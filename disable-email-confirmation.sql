-- Temporarily Disable Email Confirmation for Testing
-- WARNING: This is for development/testing only. Re-enable for production!

-- Disable email confirmation requirement
UPDATE auth.config 
SET enable_email_confirmations = false 
WHERE id = 1;

-- Verify the change
SELECT 
    enable_email_confirmations,
    enable_signup
FROM auth.config 
WHERE id = 1;

-- To re-enable later, run:
-- UPDATE auth.config SET enable_email_confirmations = true WHERE id = 1;
