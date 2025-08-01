# Troubleshooting Guide

## Registration Issues

### Problem: "Registration failed in web but user appears in Supabase dashboard"

This is a common issue that occurs when the user is created in Supabase Auth but the profile creation fails or the email verification flow isn't handled properly.

#### Solution Steps:

1. **Update the Database Trigger** (Most Important)
   - Go to your Supabase Dashboard → SQL Editor
   - Run the `update-trigger.sql` script to fix the trigger function
   - This ensures all profile fields are properly saved

2. **Check Email Verification**
   - Users must verify their email before they can sign in
   - Check spam folder for verification emails
   - The app now redirects to a success page explaining this

3. **Verify Environment Variables**
   ```bash
   # Check your .env.local file has:
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   GOOGLE_AI_API_KEY=your_gemini_api_key
   ```

4. **Check Supabase Settings**
   - Go to Authentication → Settings
   - Ensure "Enable email confirmations" is ON
   - Set "Redirect URLs" to include: `http://localhost:3000/auth/callback`

5. **For Existing Users Without Profiles**
   - Run this SQL in Supabase SQL Editor:
   ```sql
   INSERT INTO profiles (id, full_name, age, gender, country, use_case, avatar_url)
   SELECT 
     id,
     raw_user_meta_data->>'full_name',
     (raw_user_meta_data->>'age')::INTEGER,
     raw_user_meta_data->>'gender',
     raw_user_meta_data->>'country',
     raw_user_meta_data->>'use_case',
     raw_user_meta_data->>'avatar_url'
   FROM auth.users
   WHERE id NOT IN (SELECT id FROM profiles);
   ```

## Common Issues

### Node.js/npm not found
```bash
# Install Node.js from: https://nodejs.org/
# Then run:
npm install
npm run dev
```

### Supabase Connection Issues
- Check your Supabase URL and anon key
- Ensure your Supabase project is active
- Check if you've hit any rate limits

### AI Generation Fails
- Verify your Google AI API key is valid
- Check if you've exceeded API quotas
- Ensure the API key has access to Gemini models

### Storage Issues
- Create a 'logos' bucket in Supabase Storage
- Set up storage policies (see database-schema.sql)

### Build Errors
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

## Debug Mode

To enable debug logging, add to your `.env.local`:
```
NEXT_PUBLIC_DEBUG=true
```

## Getting Help

1. Check the browser console for errors
2. Check the terminal where you're running `npm run dev`
3. Check Supabase logs in the dashboard
4. Verify all environment variables are set correctly 