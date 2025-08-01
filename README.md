# InnoCanvas - AI-Powered Business Model Canvas Generator

A modern web application that generates comprehensive Business Model Canvases using AI integration with Google's Gemini model. Built with Next.js, Supabase, and TypeScript.

## 🚀 Features

- **AI-Powered BMC Generation**: Uses Google Gemini AI to create detailed Business Model Canvases
- **Interactive Canvas Editor**: Edit and refine your BMC sections in real-time
- **Custom Branding**: Upload logos and customize colors
- **Export Functionality**: Download your canvas as PDF
- **AI Improvement Suggestions**: Get AI-powered feedback to improve your BMC
- **User Authentication**: Secure login with email/password and Google OAuth
- **Canvas Management**: Save, load, and manage multiple canvases
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS, Framer Motion
- **UI Components**: Radix UI, shadcn/ui
- **Backend**: Supabase (Database, Auth, Storage)
- **AI Integration**: Google Gemini AI via Genkit
- **Authentication**: Supabase Auth with Google OAuth
- **File Export**: jsPDF, html2canvas

## 📋 Prerequisites

Before you begin, ensure you have the following:

- Node.js 18+ installed
- A Supabase account and project
- A Google AI (Gemini) API key
- Git installed

## 🔧 Setup Instructions

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd InnoCanvas
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `.env.local` file in the root directory:

```bash
cp env.example .env.local
```

Fill in your environment variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Google AI (Gemini) Configuration
GOOGLE_AI_API_KEY=your_gemini_api_key_here

# Next.js Configuration
NEXTAUTH_SECRET=your_nextauth_secret_here
NEXTAUTH_URL=http://localhost:9002
```

### 4. Supabase Setup

#### Create a New Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Note down your project URL and anon key

#### Database Schema

Run the following SQL in your Supabase SQL editor:

```sql
-- Create profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  age INTEGER,
  gender TEXT,
  country TEXT,
  use_case TEXT,
  avatar_url TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create canvases table
CREATE TABLE canvases (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  business_description TEXT NOT NULL,
  canvas_data JSONB NOT NULL,
  form_data JSONB NOT NULL,
  logo_url TEXT,
  remove_watermark BOOLEAN DEFAULT FALSE,
  colors JSONB DEFAULT '{"primary": "#30A2FF", "card": "#1c2333", "background": "#0a0f1c", "foreground": "#ffffff"}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_canvases_user_id ON canvases(user_id);
CREATE INDEX idx_canvases_created_at ON canvases(created_at);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE canvases ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can view own canvases" ON canvases
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own canvases" ON canvases
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own canvases" ON canvases
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own canvases" ON canvases
  FOR DELETE USING (auth.uid() = user_id);

-- Create function to handle user creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, full_name, avatar_url)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'avatar_url');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
```

#### Storage Setup

1. Go to Storage in your Supabase dashboard
2. Create a new bucket called `logos`
3. Set the bucket to public
4. Create the following storage policy:

```sql
CREATE POLICY "Users can upload logos" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'logos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view logos" ON storage.objects
  FOR SELECT USING (bucket_id = 'logos');
```

### 5. Google AI Setup

1. Go to [Google AI Studio](https://aistudio.google.com/)
2. Create a new API key
3. Add the API key to your `.env.local` file

### 6. Run the Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:9002`

## 🎯 Usage

### Creating Your First BMC

1. **Register/Login**: Create an account or sign in
2. **Describe Your Business**: Enter your business idea and description
3. **Refine Your Vision**: Answer specific questions about your business model
4. **Generate Canvas**: Let AI create your Business Model Canvas
5. **Customize**: Edit sections, upload logo, and customize colors
6. **Save & Export**: Save your work and export as PDF

### Key Features

- **AI Generation**: The AI analyzes your business description and creates a comprehensive BMC
- **Real-time Editing**: Click "Edit" to modify any section of your canvas
- **Logo Upload**: Upload your company logo (max 2MB)
- **Color Customization**: Customize the primary, card, background, and foreground colors
- **AI Suggestions**: Get improvement suggestions from AI
- **Export**: Download your canvas as a high-quality PDF

## 🔒 Security Features

- Row Level Security (RLS) on all database tables
- Secure authentication with Supabase Auth
- Environment variable protection
- Input validation and sanitization
- Error handling with user-friendly messages

## 🐛 Troubleshooting

### Common Issues

1. **Environment Variables Not Loading**
   - Ensure `.env.local` is in the root directory
   - Restart the development server after adding environment variables

2. **Supabase Connection Issues**
   - Verify your Supabase URL and anon key
   - Check if your Supabase project is active

3. **AI Generation Fails**
   - Verify your Google AI API key is correct
   - Check your API quota and billing status

4. **File Upload Issues**
   - Ensure the `logos` bucket exists in Supabase Storage
   - Check file size (max 2MB)
   - Verify storage policies are set correctly

### Error Messages

- **"Missing Supabase environment variables"**: Add your Supabase credentials to `.env.local`
- **"Missing GOOGLE_AI_API_KEY"**: Add your Gemini API key to `.env.local`
- **"Table does not exist"**: Run the database schema SQL in Supabase
- **"Invalid API key"**: Check your Google AI API key

## 📁 Project Structure

```
src/
├── ai/                    # AI integration files
│   ├── flows/            # AI flow definitions
│   ├── genkit.ts         # Genkit configuration
│   └── dev.ts            # Development AI server
├── app/                   # Next.js app directory
│   ├── auth/             # Authentication pages
│   ├── generate/         # BMC generation page
│   ├── my-canvases/      # Canvas management
│   ├── login/            # Login page
│   ├── register/         # Registration page
│   └── profile/          # User profile
├── components/           # React components
│   ├── ui/              # shadcn/ui components
│   ├── landing/         # Landing page components
│   └── logo.tsx         # Logo component
├── hooks/               # Custom React hooks
├── lib/                 # Utility libraries
└── styles/              # Global styles
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the troubleshooting section above
2. Review the Supabase and Google AI documentation
3. Create an issue in the repository

## 🔄 Updates

Stay updated with the latest features and improvements by:

1. Following the repository
2. Checking the releases page
3. Reading the changelog

---

Built with ❤️ using Next.js, Supabase, and Google AI
