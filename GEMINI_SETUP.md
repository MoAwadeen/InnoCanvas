# Google Gemini AI Setup Guide

## Step 1: Get Your Google AI API Key

1. **Go to Google AI Studio**
   - Visit: https://makersuite.google.com/app/apikey
   - Sign in with your Google account

2. **Create API Key**
   - Click "Create API Key"
   - Choose "Create API Key in new project" or select existing project
   - Copy the generated API key (it starts with `AIza...`)

3. **Enable Gemini API**
   - Go to: https://console.cloud.google.com/apis/library/generativelanguage.googleapis.com
   - Click "Enable" if not already enabled

## Step 2: Add API Key to Environment Variables

1. **Create `.env.local` file** in your project root:
   ```bash
   # Copy from env.example
   cp env.example .env.local
   ```

2. **Add your Gemini API key**:
   ```bash
   GOOGLE_AI_API_KEY=AIzaSyYourActualAPIKeyHere
   ```

## Step 3: Verify Setup

1. **Test the API key** by running:
   ```bash
   npm run dev
   ```

2. **Try creating a BMC** - the AI generation should work

## Step 4: API Key Security

- ✅ **Never commit** your `.env.local` file to git
- ✅ **Keep your API key** private and secure
- ✅ **Monitor usage** in Google AI Studio dashboard
- ✅ **Set up billing** if you exceed free tier

## Step 5: Usage Limits

**Free Tier (Default)**:
- 15 requests per minute
- 1500 requests per day
- Perfect for development and small projects

**Paid Tier**:
- Higher limits available
- Pay per request after free tier
- Set up billing in Google Cloud Console

## Troubleshooting

### Error: "Invalid API Key"
- Check if the API key is correct
- Ensure no extra spaces or characters
- Verify the key starts with `AIza`

### Error: "Quota Exceeded"
- You've hit the free tier limits
- Wait for the next day or upgrade to paid tier
- Check usage in Google AI Studio

### Error: "API Not Enabled"
- Enable the Gemini API in Google Cloud Console
- Wait a few minutes for activation

## Advanced Configuration

### Custom Model Selection
You can modify the model in `src/ai/genkit.ts`:
```typescript
export const ai = genkit({
  plugins: [googleAI({ apiKey: googleAIKey })],
  model: 'googleai/gemini-2.0-flash', // or 'googleai/gemini-1.5-pro'
  enableTracingAndMetrics: true,
});
```

### Environment-Specific Keys
For production, use different API keys:
```bash
# Development
GOOGLE_AI_API_KEY=dev_key_here

# Production  
GOOGLE_AI_API_KEY=prod_key_here
```

## Support

If you encounter issues:
1. Check the Google AI Studio documentation
2. Verify your API key in the dashboard
3. Check the application logs for detailed error messages
4. Ensure your Google account has access to Gemini API 