# Google OAuth Setup Guide

## Step 1: Create Google OAuth Credentials

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/
   - Sign in with your Google account

2. **Create a New Project**
   - Click on the project dropdown at the top
   - Click "New Project"
   - Name it something like "InnoCanvas"
   - Click "Create"

3. **Enable Google+ API**
   - Go to "APIs & Services" > "Library"
   - Search for "Google+ API" or "Google Identity"
   - Click "Enable"

4. **Create OAuth 2.0 Credentials**
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth 2.0 Client IDs"
   - Choose "Web application"
   - Name: "InnoCanvas Web Client"
   - Authorized JavaScript origins:
     - `http://localhost:9002`
     - `http://localhost:3000`
     - `https://your-domain.com` (for production)
   - Authorized redirect URIs:
     - `http://localhost:9002/auth/callback`
     - `http://localhost:3000/auth/callback`
     - `https://your-domain.com/auth/callback` (for production)
   - Click "Create"

5. **Copy Credentials**
   - Copy the Client ID and Client Secret
   - You'll need these for Supabase configuration

## Step 2: Configure Supabase

1. **Go to Supabase Dashboard**
   - Visit: https://supabase.com/dashboard
   - Select your project

2. **Configure Authentication**
   - Go to "Authentication" > "Providers"
   - Find "Google" and click "Enable"
   - Enter your Google OAuth credentials:
     - Client ID: `your_google_client_id`
     - Client Secret: `your_google_client_secret`
   - Save the configuration

3. **Set Redirect URLs**
   - In Supabase Auth settings, add these redirect URLs:
     - `http://localhost:9002/auth/callback`
     - `http://localhost:3000/auth/callback`
     - `https://your-domain.com/auth/callback` (for production)

## Step 3: Environment Variables

Add these to your `.env.local`:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here

# Next.js Configuration
NEXTAUTH_SECRET=your_random_secret_here
NEXTAUTH_URL=http://localhost:9002
```

## Step 4: Test the Setup

1. **Start the development server**
   ```bash
   npm run dev
   ```

2. **Test Google Sign-In**
   - Go to `http://localhost:9002`
   - Click "Sign in with Google"
   - You should be redirected to Google's OAuth consent screen
   - After authorization, you should be redirected back to the app

## Troubleshooting

### Common Issues

1. **"Invalid redirect URI"**
   - Check that your redirect URIs match exactly in both Google Cloud Console and Supabase
   - Make sure there are no trailing slashes

2. **"OAuth client not found"**
   - Verify your Client ID and Client Secret are correct
   - Make sure you're using the right project in Google Cloud Console

3. **"Redirect URI mismatch"**
   - Double-check the authorized redirect URIs in Google Cloud Console
   - Ensure the URIs in Supabase match exactly

4. **"API not enabled"**
   - Make sure you've enabled the Google+ API or Google Identity API
   - Check that your project is active

## Production Setup

For production deployment:

1. **Update Google OAuth Credentials**
   - Add your production domain to authorized origins
   - Add your production callback URL to authorized redirect URIs

2. **Update Supabase Configuration**
   - Add your production callback URL to Supabase Auth settings

3. **Environment Variables**
   - Set `NEXTAUTH_URL` to your production URL
   - Ensure all environment variables are set in your hosting platform

## Security Best Practices

- ✅ **Never commit** your `.env.local` file to git
- ✅ **Keep your OAuth credentials** private and secure
- ✅ **Use environment variables** for all sensitive data
- ✅ **Regularly rotate** your OAuth credentials
- ✅ **Monitor usage** in Google Cloud Console 