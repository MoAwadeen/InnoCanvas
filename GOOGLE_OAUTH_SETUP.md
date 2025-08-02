# Google OAuth Setup Guide for InnoCanvas

This guide will help you set up Google OAuth authentication with Supabase for your InnoCanvas application.

## Prerequisites

1. A Supabase project
2. A Google Cloud Console project
3. Your application running locally

## Step 1: Configure Supabase

### 1.1 Get Your Supabase Credentials

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **Settings** → **API**
4. Copy your **Project URL** and **anon public** key

### 1.2 Update Environment Variables

Update your `.env.local` file with your actual Supabase credentials:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_actual_supabase_anon_key_here

# Google AI (Gemini) Configuration
GOOGLE_AI_API_KEY=your_gemini_api_key_here

# Next.js Configuration
NEXTAUTH_SECRET=your_nextauth_secret_here
NEXTAUTH_URL=http://localhost:3000

# Optional: Debug Mode
NEXT_PUBLIC_DEBUG=false
```

## Step 2: Configure Google OAuth

### 2.1 Create Google Cloud Console Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **Google+ API** (if not already enabled)

### 2.2 Create OAuth 2.0 Credentials

1. Go to **APIs & Services** → **Credentials**
2. Click **Create Credentials** → **OAuth 2.0 Client IDs**
3. Choose **Web application** as the application type
4. Add the following authorized redirect URIs:
   - `http://localhost:3000/auth/callback` (for development)
   - `https://your-domain.com/auth/callback` (for production)
5. Copy the **Client ID** and **Client Secret**

### 2.3 Configure Supabase Auth Settings

1. In your Supabase Dashboard, go to **Authentication** → **Providers**
2. Find **Google** and click **Edit**
3. Enable Google provider
4. Enter your Google OAuth credentials:
   - **Client ID**: Your Google OAuth Client ID
   - **Client Secret**: Your Google OAuth Client Secret
5. Save the configuration

### 2.4 Add Authorized Domains

In your Google Cloud Console OAuth settings, add these authorized domains:
- `localhost` (for development)
- Your production domain (when deployed)

## Step 3: Test the Setup

### 3.1 Start Your Development Server

```bash
npm run dev
```

### 3.2 Test Google Login

1. Go to `http://localhost:3000/login`
2. Click the "Continue with Google" button
3. You should be redirected to Google's OAuth consent screen
4. After authorization, you should be redirected back to your app

### 3.3 Check Console for Debug Information

The updated code includes console logging to help debug issues. Check your browser's developer console for:
- "Starting Google OAuth login..."
- "Redirect URL: ..."
- "Google OAuth initiated successfully: ..."

## Troubleshooting

### Common Issues

1. **"Supabase is not properly configured"**
   - Make sure your `.env.local` file has the correct Supabase URL and anon key
   - Restart your development server after updating environment variables

2. **"Invalid redirect URI"**
   - Check that your redirect URI in Google Cloud Console matches exactly
   - For development: `http://localhost:3000/auth/callback`
   - For production: `https://your-domain.com/auth/callback`

3. **"OAuth consent screen not configured"**
   - Go to Google Cloud Console → **APIs & Services** → **OAuth consent screen**
   - Configure the consent screen with your app name and domain

4. **"Client ID not found"**
   - Verify that your Google OAuth Client ID is correctly entered in Supabase
   - Make sure you're using the correct project in Google Cloud Console

### Debug Steps

1. Check browser console for error messages
2. Verify environment variables are loaded correctly
3. Test Supabase connection in browser console:
   ```javascript
   console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
   console.log('Supabase Key:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
   ```

## Production Deployment

When deploying to production:

1. Update your Google OAuth redirect URIs to include your production domain
2. Update your Supabase Auth settings with the production redirect URI
3. Set the correct environment variables in your hosting platform
4. Update the `NEXTAUTH_URL` to your production domain

## Security Notes

- Never commit your `.env.local` file to version control
- Use environment variables in production hosting platforms
- Regularly rotate your OAuth client secrets
- Monitor your OAuth usage in Google Cloud Console

## Support

If you're still having issues:

1. Check the browser console for detailed error messages
2. Verify all configuration steps were completed
3. Test with a fresh browser session (clear cookies/cache)
4. Check Supabase logs in the dashboard for authentication errors 