# Fix Redirect URI Mismatch Error

## 🚨 **Error: redirect_uri_mismatch**

You're getting this error because Google OAuth is receiving a redirect URI that doesn't match what's configured in Google Cloud Console.

## 🔍 **What's Happening**

Supabase is using its own callback URL: `https://ewetzmzfbwnqsdoikykz.supabase.co/auth/v1/callback`

But your Google Cloud Console only has: `http://localhost:3000/auth/callback`

## ✅ **Solution**

### Step 1: Update Google Cloud Console Redirect URIs

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **APIs & Services** → **Credentials**
3. Find your OAuth 2.0 Client ID and click **Edit**
4. In the **Authorized redirect URIs** section, **REMOVE** the localhost URL and keep only:
   ```
   https://ewetzmzfbwnqsdoikykz.supabase.co/auth/v1/callback
   ```
5. Click **Save**

### Step 2: Verify Supabase Google OAuth Configuration

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Navigate to **Authentication** → **Providers**
3. Find **Google** and click **Edit**
4. Make sure Google provider is **Enabled**
5. Verify your Google OAuth credentials are entered correctly:
   - **Client ID**: Your Google OAuth Client ID
   - **Client Secret**: Your Google OAuth Client Secret
6. Click **Save**

### Step 3: Test the Fix

1. Restart your development server:
   ```bash
   npm run dev
   ```

2. Go to `http://localhost:3000/login`
3. Click "Continue with Google"
4. You should now be redirected to Google's OAuth consent screen

## 🔧 **What Changed**

The code has been updated to:
- **Remove** the `redirectTo` option from Google OAuth calls
- Let Supabase use its **default callback URL**
- Use only the Supabase callback URL in Google Cloud Console

## 🧪 **Test Your Configuration**

Visit `http://localhost:3000/test-auth` to run the configuration test and verify everything is working.

## 📋 **Complete Google Cloud Console Setup**

Make sure your Google Cloud Console OAuth configuration includes:

### Authorized JavaScript origins:
```
http://localhost:3000
https://ewetzmzfbwnqsdoikykz.supabase.co
```

### Authorized redirect URIs (ONLY this one):
```
https://ewetzmzfbwnqsdoikykz.supabase.co/auth/v1/callback
```

## 🔍 **Debug Steps**

1. **Check Browser Console**: Look for any error messages
2. **Verify Environment Variables**: Make sure your `.env.local` has correct Supabase credentials
3. **Test Supabase Connection**: Use the test page to verify configuration
4. **Clear Browser Cache**: Try in an incognito/private window

## 🚀 **Production Deployment**

When deploying to production, you'll need to:

1. Add your production domain to Google Cloud Console **Authorized JavaScript origins**
2. Keep the same Supabase callback URL in **Authorized redirect URIs**
3. Set the correct environment variables in your hosting platform

## 📞 **Still Having Issues?**

If you're still getting the redirect URI mismatch error:

1. Make sure you've **REMOVED** the localhost callback URL from Google Cloud Console
2. Verify only the Supabase callback URL is in the redirect URIs
3. Wait a few minutes for Google's changes to propagate
4. Try clearing your browser cache and cookies
5. Test in an incognito/private browser window 