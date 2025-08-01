# Quick Setup Guide

## 🚀 Get Started in 5 Minutes

### 1. Environment Setup

Copy the environment template and fill in your keys:

```bash
cp env.example .env.local
```

Edit `.env.local` with your actual API keys:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
GOOGLE_AI_API_KEY=your_gemini_api_key_here
NEXTAUTH_SECRET=your_random_secret_here
NEXTAUTH_URL=http://localhost:9002
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to SQL Editor
3. Copy and paste the contents of `database-schema.sql`
4. Go to Storage and create a bucket called `logos` (set to public)

### 4. Get Google AI Key

1. Visit [Google AI Studio](https://aistudio.google.com/)
2. Create a new API key
3. Add it to your `.env.local`

### 5. Run the App

```bash
npm run dev
```

Visit `http://localhost:9002` and start creating your Business Model Canvas!

## 🔧 Troubleshooting

### Common Issues:

- **"Missing environment variables"**: Check your `.env.local` file
- **"Table does not exist"**: Run the database schema SQL in Supabase
- **"Invalid API key"**: Verify your Google AI API key
- **"Upload failed"**: Create the `logos` bucket in Supabase Storage

### Need Help?

1. Check the full [README.md](README.md) for detailed instructions
2. Verify all environment variables are set correctly
3. Ensure Supabase project is active and database schema is created
4. Check Google AI API quota and billing status

## 🎯 Next Steps

1. Create your first Business Model Canvas
2. Customize colors and upload your logo
3. Export your canvas as PDF
4. Get AI-powered improvement suggestions

Happy creating! 🎨 