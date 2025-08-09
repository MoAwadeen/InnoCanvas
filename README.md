# InnoCanvas - AI-Powered Business Model Canvas Generator

A modern web application that generates comprehensive Business Model Canvases using AI integration with OpenAI. Built with Next.js, Supabase, and TypeScript.

## 🚀 Features

- **AI-Powered BMC Generation**: Uses OpenAI to create detailed Business Model Canvases
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
- **AI Integration**: OpenAI
- **Authentication**: Supabase Auth with Google OAuth
- **File Export**: jsPDF, html2canvas

## 📋 Prerequisites

Before you begin, ensure you have the following:

- Node.js 18+ installed
- A Supabase account and project
- An OpenAI API key
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

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here

# Next.js Configuration
NEXTAUTH_SECRET=your_nextauth_secret_here
NEXTAUTH_URL=http://localhost:9002
```

### 4. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to SQL Editor
3. Copy and paste the contents of `database-schema.sql`
4. Go to Storage and create a bucket called `logos` (set to public)

### 5. OpenAI Setup

1. Go to [OpenAI Platform](https://platform.openai.com/)
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
   - Verify your OpenAI API key is correct
   - Check your API quota and billing status

4. **File Upload Issues**
   - Ensure the `logos` bucket exists in Supabase Storage
   - Check file size (max 2MB)
   - Verify storage policies are set correctly

### Error Messages

- **"Missing Supabase environment variables"**: Add your Supabase credentials to `.env.local`
- **"Missing OPENAI_API_KEY"**: Add your OpenAI API key to `.env.local`
- **"Table does not exist"**: Run the database schema SQL in Supabase
- **"Invalid API key"**: Check your OpenAI API key

## 📁 Project Structure

```
src/
├── ai/                    # AI integration files
│   ├── flows/            # AI flow definitions
│   └── services/         # AI service implementations
├── app/                  # Next.js app directory
│   ├── api/             # API routes
│   ├── auth/            # Authentication pages
│   ├── generate/        # BMC generation page
│   └── my-canvases/     # Canvas management
├── components/          # Reusable components
├── hooks/              # Custom React hooks
├── lib/                # Utility libraries
└── types/              # TypeScript type definitions
```

## 🎨 Customization

### Colors and Styling

The application uses a modern design system with:
- Primary color: Deep sky blue (#30A2FF)
- Background: Dark theme with glassmorphism effects
- Typography: Inter font family
- Animations: Framer Motion for smooth transitions

### AI Models

The application uses OpenAI's GPT-4o-mini model by default. You can modify the model in `src/lib/openai.ts`:

```typescript
export async function generateText(prompt: string, model: string = "gpt-4o-mini") {
  // Change the default model here
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues:

1. Check the [Troubleshooting Guide](TROUBLESHOOTING.md)
2. Verify all environment variables are set correctly
3. Ensure your OpenAI API key is valid and has sufficient credits
4. Check the browser console for error messages

## 🎉 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- AI powered by [OpenAI](https://openai.com/)
- Database by [Supabase](https://supabase.com/)
