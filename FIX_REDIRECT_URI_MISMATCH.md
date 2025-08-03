# Fix for OAuth Redirect URI Mismatch Issue

## Problem Description

You're experiencing an issue where Google OAuth authentication redirects to:
```
http://localhost:3000/#access_token=...&expires_at=...&provider_refresh_token=...
```

This happens when there's a mismatch between the redirect URIs configured in your Google OAuth settings and your Supabase authentication configuration.

## Root Cause

The OAuth flow is returning tokens in the URL hash fragment instead of properly redirecting to your callback route. This typically occurs when:

1. **Google OAuth redirect URI mismatch**: The redirect URI in Google Cloud Console doesn't match your Supabase callback URL
2. **Supabase OAuth configuration issue**: The OAuth provider settings in Supabase are not properly configured
3. **Missing or incorrect callback URL**: The callback URL is not properly set in the OAuth flow

## Solution Steps

### Step 1: Verify Google OAuth Configuration

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **APIs & Services** → **Credentials**
3. Find your OAuth 2.0 Client ID and click **Edit**
4. Under **Authorized redirect URIs**, ensure you have:
   ```
   https://ewetzmzfbwnqsdoikykz.supabase.co/auth/v1/callback
   ```
5. **Remove any localhost redirect URIs** that might be conflicting
6. Save the changes

### Step 2: Verify Supabase OAuth Settings

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Navigate to **Authentication** → **Providers**
3. Find **Google** and click **Edit**
4. Ensure the following settings are correct:
   - **Enabled**: ✅
   - **Client ID**: Your Google OAuth Client ID
   - **Client Secret**: Your Google OAuth Client Secret
   - **Redirect URL**: `https://ewetzmzfbwnqsdoikykz.supabase.co/auth/v1/callback`
5. Save the configuration

### Step 3: Clear Browser Cache and Cookies

1. Open your browser's developer tools (F12)
2. Right-click the refresh button and select "Empty Cache and Hard Reload"
3. Or manually clear all cookies and cache for localhost:3000

### Step 4: Test the Updated Flow

The updated code now handles both scenarios:

1. **Normal OAuth flow** (with `code` parameter) → Handled by `/auth/callback`
2. **Hash fragment flow** (with `access_token` in hash) → Handled by `/auth/hash-callback`

### Step 5: Environment Variables Check

Ensure your `.env.local` file has the correct Supabase configuration:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_actual_supabase_anon_key_here
```

## Code Changes Made

### 1. Updated Auth Callback Route (`/src/app/auth/callback/route.ts`)
- Added hash fragment detection
- Improved error handling
- Better redirect logic

### 2. Created Hash Callback Handler (`/src/app/auth/hash-callback/page.tsx`)
- Handles OAuth redirects with hash fragments
- Processes access tokens from URL hash
- Creates user profiles automatically

### 3. Updated Login Page (`/src/app/login/page.tsx`)
- Added explicit redirectTo parameter
- Enhanced error handling for auth failures
- Better user feedback

## Testing the Fix

1. **Start your development server**:
   ```bash
   npm run dev
   ```

2. **Test Google OAuth**:
   - Go to `http://localhost:3000/login`
   - Click "Continue with Google"
   - Complete the OAuth flow
   - You should now be redirected to `/my-canvases` instead of getting a hash fragment

3. **Check the console** for debug messages:
   - "Starting Google OAuth login..."
   - "Google OAuth initiated successfully: ..."
   - "Processing hash callback with tokens..." (if using hash callback)

## Common Issues and Solutions

### Issue: Still getting hash fragment redirects
**Solution**: Double-check your Google OAuth redirect URIs. Make sure you're using the Supabase callback URL: `https://ewetzmzfbwnqsdoikykz.supabase.co/auth/v1/callback`

### Issue: "Invalid redirect URI" error
**Solution**: 
1. Check that your Google OAuth Client ID in Supabase matches your Google Cloud Console
2. Ensure the redirect URI in Google Cloud Console exactly matches: `https://ewetzmzfbwnqsdoikykz.supabase.co/auth/v1/callback`

### Issue: Authentication fails after OAuth
**Solution**: 
1. Check browser console for error messages
2. Verify your Supabase environment variables are correct
3. Ensure your Supabase project has Google OAuth properly configured

### Issue: Profile not created after OAuth
**Solution**: 
1. Check that your `profiles` table exists in Supabase
2. Verify the table schema matches the expected structure
3. Check Supabase logs for any database errors

## Production Deployment

When deploying to production:

1. **Keep the same Supabase callback URL** in Google OAuth:
   ```
   https://ewetzmzfbwnqsdoikykz.supabase.co/auth/v1/callback
   ```

2. **Add your production domain** to Google OAuth **Authorized JavaScript origins**:
   ```
   https://your-domain.com
   ```

3. **Set environment variables** in your hosting platform

4. **Test the OAuth flow** in production environment

## Debug Information

The updated code includes comprehensive logging. Check your browser console for:

- OAuth initiation messages
- Redirect URL information
- Token processing status
- Profile creation/update logs
- Error messages with detailed information

## Support

If you're still experiencing issues:

1. Check the browser console for error messages
2. Verify all configuration steps were completed
3. Test with a fresh browser session (clear cookies/cache)
4. Check Supabase logs in the dashboard for authentication errors
5. Ensure your Google OAuth consent screen is properly configured 