# InnoCanvas - Complete Project Documentation

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture & Tech Stack](#architecture--tech-stack)
3. [Project Structure](#project-structure)
4. [Core Features](#core-features)
5. [Database Schema](#database-schema)
6. [Authentication System](#authentication-system)
7. [AI Integration](#ai-integration)
8. [API Routes](#api-routes)
9. [User Interface](#user-interface)
10. [Development Setup](#development-setup)
11. [Deployment](#deployment)
12. [Troubleshooting](#troubleshooting)
13. [Contributing](#contributing)

---

## 🎯 Project Overview

**InnoCanvas** is a modern, AI-powered Business Model Canvas (BMC) generator that helps entrepreneurs, students, and business professionals create comprehensive business models using artificial intelligence. The application leverages OpenAI's GPT models to generate detailed, professional Business Model Canvases based on user input and refinement questions.

### Key Value Propositions
- **AI-Powered Generation**: Instant, professional BMC creation using OpenAI
- **Interactive Refinement**: Multi-step process with guided questions
- **Visual Customization**: Branding, colors, and logo upload
- **Export & Sharing**: PDF export and sharing capabilities
- **User Management**: Secure authentication with profile management
- **Plan System**: Free, Pro, and Premium tiers with feature gating

---

## 🏗️ Architecture & Tech Stack

### Frontend
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **UI Library**: React 18
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **UI Components**: Radix UI + shadcn/ui
- **Forms**: React Hook Form + Zod validation
- **State Management**: React Context + Hooks

### Backend
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage
- **API**: Next.js API Routes
- **AI Integration**: OpenAI GPT-4o-mini

### Development Tools
- **Package Manager**: npm
- **Type Checking**: TypeScript
- **Linting**: ESLint
- **Build Tool**: Turbopack
- **Development Server**: Next.js (Port 9002)

---

## 📁 Project Structure

```
InnoCanvas/
├── 📁 src/
│   ├── 📁 app/                    # Next.js App Router
│   │   ├── 📁 api/                # API routes
│   │   │   └── 📁 ai/             # AI service endpoints
│   │   ├── 📁 auth/               # Authentication pages
│   │   │   ├── 📁 callback/       # OAuth callback handling
│   │   │   └── 📁 hash-callback/  # Hash-based OAuth handling
│   │   ├── 📁 generate/           # BMC generation page
│   │   ├── 📁 login/              # Login page
│   │   ├── 📁 register/           # Registration page
│   │   ├── 📁 profile/            # User profile management
│   │   ├── 📁 my-canvases/        # Canvas management
│   │   ├── 📁 payment/            # Payment handling
│   │   └── 📁 verify-email/       # Email verification
│   ├── 📁 components/             # Reusable components
│   │   ├── 📁 ui/                 # shadcn/ui components
│   │   ├── 📁 landing/            # Landing page components
│   │   └── 📁 plan/               # Plan-related components
│   ├── 📁 hooks/                  # Custom React hooks
│   ├── 📁 lib/                    # Utility libraries
│   ├── 📁 ai/                     # AI service integration
│   │   ├── 📁 services/           # AI service classes
│   │   └── 📁 flows/              # AI workflow definitions
│   └── 📁 types/                  # TypeScript type definitions
├── 📁 public/                     # Static assets
├── 📁 docs/                       # Documentation
└── 📁 database/                   # SQL scripts and migrations
```

---

## 🚀 Core Features

### 1. AI-Powered BMC Generation
- **Intelligent Prompting**: Advanced prompts for professional BMC creation
- **Refinement Questions**: Guided questions to improve BMC quality
- **Strategic Consistency**: Ensures logical connections between BMC sections
- **Multiple AI Models**: Support for different OpenAI models

### 2. Interactive Canvas Editor
- **Real-time Editing**: Live editing of BMC sections
- **Visual Feedback**: Immediate updates and previews
- **Undo/Redo**: Full editing history support
- **Auto-save**: Automatic saving of work progress

### 3. User Management System
- **Authentication**: Email/password + Google OAuth
- **Profile Management**: Comprehensive user profiles
- **Plan System**: Free, Pro, Premium tiers
- **Usage Tracking**: Canvas creation and export statistics

### 4. Customization & Branding
- **Logo Upload**: Custom logo integration
- **Color Schemes**: Customizable color palettes
- **Watermark Options**: Plan-based watermark removal
- **Visual Themes**: Dark/light mode support

### 5. Export & Sharing
- **PDF Export**: High-quality PDF generation
- **Sharing Links**: Public canvas sharing
- **Multiple Formats**: Various export options
- **Branded Exports**: Custom branding in exports

---

## 🗄️ Database Schema

### Core Tables

#### 1. `profiles` Table
```sql
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  full_name TEXT,
  age INTEGER,
  gender TEXT,
  country TEXT,
  use_case TEXT,
  avatar_url TEXT,
  email TEXT,
  phone TEXT,
  company TEXT,
  job_title TEXT,
  industry TEXT,
  experience_level TEXT,
  plan TEXT DEFAULT 'free' REFERENCES plan_limits(plan),
  plan_expiry TIMESTAMP WITH TIME ZONE,
  subscription_id TEXT,
  payment_provider TEXT DEFAULT 'lemonsqueezy',
  preferences JSONB DEFAULT '{"theme": "dark", "notifications": true, "newsletter": true, "language": "en"}',
  statistics JSONB DEFAULT '{"canvases_created": 0, "last_login": null, "total_exports": 0, "favorite_colors": []}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### 2. `canvases` Table
```sql
CREATE TABLE canvases (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  business_description TEXT NOT NULL,
  canvas_data JSONB NOT NULL,
  form_data JSONB NOT NULL,
  logo_url TEXT,
  remove_watermark BOOLEAN DEFAULT FALSE,
  colors JSONB DEFAULT '{"primary": "#30A2FF", "card": "#1c2333", "background": "#0a0f1c", "foreground": "#ffffff"}',
  title TEXT,
  tags TEXT[],
  is_public BOOLEAN DEFAULT FALSE,
  view_count INTEGER DEFAULT 0,
  export_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### 3. `plan_limits` Table
```sql
CREATE TABLE plan_limits (
  plan TEXT PRIMARY KEY,
  max_canvases INTEGER NOT NULL,
  pdf_download BOOLEAN DEFAULT FALSE,
  color_customization BOOLEAN DEFAULT FALSE,
  ai_consultant BOOLEAN DEFAULT FALSE,
  templates_access BOOLEAN DEFAULT FALSE,
  remove_watermark BOOLEAN DEFAULT FALSE,
  priority_support BOOLEAN DEFAULT FALSE,
  api_access BOOLEAN DEFAULT FALSE,
  team_collaboration BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### 4. `subscriptions` Table
```sql
CREATE TABLE subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  subscription_id TEXT UNIQUE NOT NULL,
  plan TEXT NOT NULL REFERENCES plan_limits(plan),
  status TEXT NOT NULL DEFAULT 'active',
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  payment_provider TEXT DEFAULT 'lemonsqueezy',
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Key Indexes
- `idx_canvases_user_id`: User canvas lookup
- `idx_canvases_created_at`: Time-based sorting
- `idx_canvases_tags`: Tag-based search
- `idx_profiles_plan`: Plan-based queries

---

## 🔐 Authentication System

### Authentication Flow

#### 1. Email/Password Authentication
```typescript
// Registration
const { data, error } = await supabase.auth.signUp({
  email: userEmail,
  password: userPassword,
  options: {
    data: {
      full_name: userName,
      age: userAge,
      gender: userGender,
      country: userCountry,
      use_case: userUseCase,
    },
  },
});

// Login
const { data, error } = await supabase.auth.signInWithPassword({
  email: userEmail,
  password: userPassword,
});
```

#### 2. Google OAuth
```typescript
// OAuth Sign-in
const { data, error } = await supabase.auth.signInWithOAuth({
  provider: 'google',
  options: {
    redirectTo: `${window.location.origin}/auth/callback`,
    queryParams: {
      access_type: 'offline',
      prompt: 'consent',
    }
  }
});
```

#### 3. Session Management
- **Automatic Session Refresh**: Supabase handles token refresh
- **Persistent Sessions**: Sessions persist across browser sessions
- **Profile Creation**: Automatic profile creation on first login
- **Error Handling**: Comprehensive error handling for auth failures

### User Profile System

#### Profile Data Structure
```typescript
interface UserProfile {
  id: string;
  full_name: string;
  age: number | null;
  gender: string;
  country: string;
  use_case: string;
  avatar_url: string | null;
  email: string;
  phone: string | null;
  company: string | null;
  job_title: string | null;
  industry: string | null;
  experience_level: string | null;
  plan: 'free' | 'pro' | 'premium';
  plan_expiry: string | null;
  subscription_id: string | null;
  payment_provider: string;
  preferences: {
    theme: string;
    notifications: boolean;
    newsletter: boolean;
    language: string;
  };
  statistics: {
    canvases_created: number;
    last_login: string;
    total_exports: number;
    favorite_colors: string[];
  };
}
```

---

## 🤖 AI Integration

### AI Service Architecture

#### 1. OpenAI Integration
```typescript
// OpenAI Client Setup
import OpenAI from "openai";

function getOpenAI(): OpenAI {
  if (!openai) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error("OpenAI API key not configured");
    }
    
    openai = new OpenAI({ apiKey });
  }
  return openai;
}
```

#### 2. AI Service Class
```typescript
export class AIService {
  // Generate Business Model Canvas
  static async generateBusinessModelCanvas(
    businessIdea: string, 
    mcqAnswers?: any
  ): Promise<any> {
    // Enhanced prompt with user answers
    const enhancedPrompt = `You are an award-winning startup strategist...`;
    
    try {
      if (isClientSide()) {
        return await makeAPICall('generateBusinessModelCanvas', { 
          businessIdea, 
          mcqAnswers 
        });
      } else {
        return await generateText(enhancedPrompt);
      }
    } catch (error) {
      console.error("Error generating BMC:", error);
      throw error;
    }
  }
}
```

#### 3. Prompt Engineering
- **Structured Prompts**: Well-defined prompts for consistent output
- **Context Awareness**: User answers influence BMC generation
- **Quality Control**: Multiple validation layers
- **Error Handling**: Graceful fallbacks for AI failures

### AI Features

#### 1. BMC Generation
- **9-Section Structure**: Complete BMC with all required sections
- **Strategic Consistency**: Logical connections between sections
- **Professional Quality**: Business-appropriate language and content

#### 2. Content Improvement
- **AI Suggestions**: Intelligent suggestions for BMC improvements
- **Refinement Support**: Guided refinement process
- **Quality Enhancement**: Automatic content enhancement

#### 3. Intelligent Insights
- **Business Analysis**: AI-powered business insights
- **Market Research**: Industry-specific recommendations
- **Competitive Analysis**: Competitive landscape insights

---

## 🔌 API Routes

### Core API Endpoints

#### 1. AI Service Route (`/api/ai`)
```typescript
// POST /api/ai
export async function POST(request: NextRequest) {
  const { action, ...params } = await request.json();
  
  switch (action) {
    case 'generateBusinessModelCanvas':
      return await handleBMCGeneration(params);
    case 'generateHaiku':
      return await handleHaikuGeneration(params);
    default:
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  }
}
```

#### 2. Authentication Callback (`/auth/callback`)
```typescript
// GET /auth/callback
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  
  if (code) {
    // Exchange code for session
    const { error, data } = await supabase.auth.exchangeCodeForSession(code);
    
    // Handle profile creation
    if (data.user) {
      await handleProfileCreation(data.user);
    }
    
    return NextResponse.redirect(`${origin}/my-canvases`);
  }
}
```

### API Features
- **RESTful Design**: Standard REST API patterns
- **Error Handling**: Comprehensive error responses
- **Rate Limiting**: Built-in rate limiting support
- **Authentication**: Secure API authentication
- **Validation**: Request/response validation

---

## 🎨 User Interface

### Design System

#### 1. Color Palette
```css
/* Primary Colors */
--primary: #30A2FF;        /* Deep sky blue */
--primary-foreground: #ffffff;

/* Background Colors */
--background: #0a0f1c;     /* Dark background */
--card: #1c2333;          /* Card background */
--popover: #1c2333;       /* Popover background */

/* Text Colors */
--foreground: #ffffff;     /* Primary text */
--muted-foreground: #94a3b8; /* Muted text */
```

#### 2. Typography
- **Font Family**: Inter (Google Fonts)
- **Font Weights**: 400, 500, 600, 700, 800
- **Responsive Design**: Mobile-first approach

#### 3. Component Library
- **Base Components**: shadcn/ui components
- **Custom Components**: Domain-specific components
- **Animation**: Framer Motion integration
- **Accessibility**: WCAG 2.1 compliant

### Key UI Components

#### 1. BMC Canvas
```typescript
const StyledBmcBlock = ({ 
  title, 
  content, 
  icon, 
  isEditing, 
  onChange, 
  colors 
}) => {
  return (
    <motion.div
      className="relative group bg-card border border-border rounded-lg p-4"
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      {/* BMC Block Content */}
    </motion.div>
  );
};
```

#### 2. Interactive Forms
- **Multi-step Forms**: Guided user experience
- **Real-time Validation**: Instant feedback
- **Progress Indicators**: Visual progress tracking
- **Error Handling**: User-friendly error messages

#### 3. Dashboard Interface
- **Canvas Management**: Grid/list view options
- **Search & Filter**: Advanced filtering capabilities
- **Bulk Actions**: Multiple canvas operations
- **Analytics**: Usage statistics and insights

---

## 🛠️ Development Setup

### Prerequisites
1. **Node.js 18+**: Required for Next.js 15
2. **npm**: Package manager
3. **Git**: Version control
4. **Supabase Account**: Database and authentication
5. **OpenAI API Key**: AI integration

### Installation Steps

#### 1. Clone Repository
```bash
git clone <repository-url>
cd InnoCanvas
```

#### 2. Install Dependencies
```bash
npm install
```

#### 3. Environment Configuration
```bash
# Copy environment template
cp env.example .env.local

# Configure environment variables
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
OPENAI_API_KEY=your_openai_api_key
NEXTAUTH_URL=http://localhost:9002
```

#### 4. Database Setup
```bash
# Run database schema
# Copy contents of database-schema.sql to Supabase SQL Editor
```

#### 5. Development Server
```bash
npm run dev
# Server starts on http://localhost:9002
```

### Development Scripts
```json
{
  "scripts": {
    "dev": "next dev --turbopack -p 9002",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "typecheck": "tsc --noEmit"
  }
}
```

---

## 🚀 Deployment

### Production Deployment

#### 1. Environment Variables
- Configure production environment variables
- Set up production Supabase project
- Configure OpenAI API keys

#### 2. Build Process
```bash
# Build production version
npm run build

# Start production server
npm start
```

#### 3. Platform Deployment
- **Vercel**: Recommended for Next.js applications
- **Netlify**: Alternative deployment option
- **Docker**: Containerized deployment

### CI/CD Pipeline
- **GitHub Actions**: Automated testing and deployment
- **Environment Management**: Separate staging/production environments
- **Database Migrations**: Automated schema updates

---

## 🔧 Troubleshooting

### Common Issues

#### 1. Authentication Issues
- **OAuth Redirect Problems**: Check redirect URLs in Supabase
- **Session Management**: Verify session persistence
- **Profile Creation**: Check database triggers and permissions

#### 2. AI Integration Issues
- **API Key Configuration**: Verify OpenAI API key
- **Rate Limiting**: Check API usage limits
- **Response Parsing**: Validate AI response format

#### 3. Database Issues
- **Connection Problems**: Verify Supabase credentials
- **Schema Mismatches**: Run database migrations
- **Permission Errors**: Check RLS policies

### Debug Tools
- **Browser DevTools**: Client-side debugging
- **Supabase Dashboard**: Database and auth monitoring
- **OpenAI Playground**: AI model testing
- **Vercel Analytics**: Performance monitoring

---

## 🤝 Contributing

### Development Guidelines

#### 1. Code Standards
- **TypeScript**: Strict type checking
- **ESLint**: Code linting and formatting
- **Prettier**: Code formatting
- **Conventional Commits**: Standard commit messages

#### 2. Pull Request Process
1. Fork the repository
2. Create feature branch
3. Make changes with tests
4. Submit pull request
5. Code review process
6. Merge to main branch

#### 3. Testing Strategy
- **Unit Tests**: Component and utility testing
- **Integration Tests**: API and database testing
- **E2E Tests**: User workflow testing
- **Performance Tests**: Load and stress testing

### Documentation
- **Code Documentation**: JSDoc comments
- **API Documentation**: OpenAPI/Swagger specs
- **User Documentation**: User guides and tutorials
- **Developer Documentation**: Setup and contribution guides

---

## 📊 Performance & Optimization

### Performance Metrics
- **Core Web Vitals**: LCP, FID, CLS optimization
- **Bundle Size**: Code splitting and tree shaking
- **Database Performance**: Query optimization
- **AI Response Time**: Caching and optimization

### Optimization Strategies
- **Image Optimization**: Next.js image optimization
- **Code Splitting**: Dynamic imports and lazy loading
- **Caching**: Redis and CDN caching
- **Database Indexing**: Optimized query performance

---

## 🔒 Security

### Security Measures
- **Authentication**: Secure OAuth and session management
- **Data Protection**: Encryption at rest and in transit
- **API Security**: Rate limiting and validation
- **Content Security**: XSS and CSRF protection

### Compliance
- **GDPR Compliance**: Data privacy and protection
- **Accessibility**: WCAG 2.1 compliance
- **Security Audits**: Regular security assessments
- **Backup Strategy**: Data backup and recovery

---

## 📈 Future Roadmap

### Planned Features
1. **Advanced AI Models**: GPT-4 and custom models
2. **Collaboration Tools**: Team-based canvas editing
3. **Template Library**: Pre-built BMC templates
4. **Analytics Dashboard**: Advanced usage analytics
5. **Mobile App**: Native mobile application
6. **API Access**: Public API for integrations
7. **Enterprise Features**: Advanced enterprise capabilities

### Technical Improvements
1. **Performance**: Advanced caching and optimization
2. **Scalability**: Microservices architecture
3. **AI Enhancement**: Advanced AI capabilities
4. **User Experience**: Enhanced UI/UX design
5. **Integration**: Third-party integrations

---

## 📞 Support & Resources

### Support Channels
- **Documentation**: Comprehensive project documentation
- **Issues**: GitHub issues for bug reports
- **Discussions**: GitHub discussions for questions
- **Email Support**: Direct email support for premium users

### Resources
- **API Documentation**: Complete API reference
- **User Guides**: Step-by-step user tutorials
- **Developer Resources**: Development setup and guides
- **Community**: User community and forums

---

*This documentation is maintained by the InnoCanvas development team. For questions or contributions, please refer to the project repository.*
