# InnoCanvas - Complete Project Documentation

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Current Status](#current-status)
3. [Architecture & Tech Stack](#architecture--tech-stack)
4. [Project Structure](#project-structure)
5. [Core Features](#core-features)
6. [Database Schema](#database-schema)
7. [Authentication System](#authentication-system)
8. [Payment System (LemonSqueezy)](#payment-system-lemonsqueezy)
9. [Admin Dashboard](#admin-dashboard)
10. [AI Integration](#ai-integration)
11. [API Routes](#api-routes)
12. [User Interface](#user-interface)
13. [Development Setup](#development-setup)
14. [Deployment](#deployment)
15. [Environment Variables](#environment-variables)
16. [File Structure](#file-structure)

---

## 🎯 Project Overview

**InnoCanvas** is a modern, AI-powered Business Model Canvas (BMC) generator that helps entrepreneurs, students, and business professionals create comprehensive business models using artificial intelligence. The application leverages OpenAI's GPT models to generate detailed, professional Business Model Canvases based on user input and refinement questions.

### Key Value Propositions
- **AI-Powered Generation**: Instant, professional BMC creation using OpenAI
- **Interactive Refinement**: Multi-step process with guided questions
- **Visual Customization**: Branding, colors, and logo upload
- **Export & Sharing**: PDF export and sharing capabilities
- **User Management**: Secure authentication with profile management
- **Subscription System**: Free, Pro, and Premium tiers with LemonSqueezy
- **Admin Dashboard**: Comprehensive admin panel for platform management

---

## ✅ Current Status

### 🟢 **Completed Features**
- ✅ **Core Application**: Fully functional BMC generator with AI integration
- ✅ **Authentication**: Complete Supabase Auth with Google OAuth
- ✅ **User Management**: Profile system with role-based access
- ✅ **Payment System**: LemonSqueezy integration for subscriptions
- ✅ **Admin Dashboard**: Complete admin panel with all management features
- ✅ **Database**: Enhanced schema with all necessary tables and functions
- ✅ **UI/UX**: Modern, responsive design with shadcn/ui components
- ✅ **Export System**: PDF generation with html2canvas and jsPDF
- ✅ **SEO & Legal**: Privacy Policy, Terms of Service, robots.txt, sitemap.xml

### 🟡 **Pending Setup**
- 🔄 **LemonSqueezy Account**: Waiting for account activation
- 🔄 **Environment Variables**: Need to be configured in production
- 🔄 **Domain Configuration**: innocanvas.site needs final setup
- 🔄 **Analytics**: Google Analytics 4 setup pending

### 🟢 **Deployment Status**
- ✅ **Vercel**: Successfully deployed and tested
- ✅ **Database**: Supabase fully configured
- ✅ **Domain**: innocanvas.site registered for 1 year

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
- **Payment**: LemonSqueezy

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
│   │   ├── 📁 admin/              # Admin dashboard
│   │   │   ├── page.tsx           # Main admin dashboard
│   │   │   ├── 📁 users/          # User management
│   │   │   ├── 📁 subscriptions/  # Subscription management
│   │   │   ├── 📁 canvases/       # Canvas management
│   │   │   └── 📁 settings/       # System settings
│   │   ├── 📁 api/                # API routes
│   │   │   ├── 📁 ai/             # AI service endpoints
│   │   │   └── 📁 lemonsqueezy/   # Payment endpoints
│   │   │       ├── 📁 checkout/   # Checkout creation
│   │   │       ├── 📁 webhook/    # Payment webhooks
│   │   │       └── 📁 subscription/ # Subscription management
│   │   ├── 📁 auth/               # Authentication pages
│   │   ├── 📁 generate/           # BMC generation page
│   │   ├── 📁 login/              # Login page
│   │   ├── 📁 register/           # Registration page
│   │   ├── 📁 profile/            # User profile management
│   │   ├── 📁 my-canvases/        # Canvas management
│   │   ├── 📁 payment/            # Payment handling
│   │   ├── 📁 privacy/            # Privacy policy
│   │   ├── 📁 terms/              # Terms of service
│   │   └── 📁 verify-email/       # Email verification
│   ├── 📁 components/             # Reusable components
│   │   ├── 📁 ui/                 # shadcn/ui components
│   │   ├── 📁 landing/            # Landing page components
│   │   ├── 📁 plan/               # Plan-related components
│   │   ├── subscription-manager.tsx # Subscription management
│   │   ├── ai-demo.tsx            # AI demo component
│   │   ├── auth-test.tsx          # Auth testing component
│   │   ├── greeting.tsx           # Greeting component
│   │   ├── logo.tsx               # Logo component
│   │   └── theme-provider.tsx     # Theme provider
│   ├── 📁 hooks/                  # Custom React hooks
│   │   ├── useAuth.tsx            # Authentication hook
│   │   ├── useAI.ts               # AI integration hook
│   │   ├── useToast.ts            # Toast notifications
│   │   └── use-mobile.tsx         # Mobile detection
│   ├── 📁 lib/                    # Utility libraries
│   │   ├── supabase.ts            # Supabase client
│   │   ├── openai.ts              # OpenAI client
│   │   ├── lemonsqueezy.ts        # LemonSqueezy service
│   │   ├── plan-service.ts        # Plan management
│   │   ├── utils.ts               # Utility functions
│   │   └── countries.ts           # Country data
│   └── 📁 ai/                     # AI service integration
│       ├── 📁 services/           # AI service classes
│       └── 📁 flows/              # AI workflow definitions
├── 📁 public/                     # Static assets
│   ├── 📁 images/                 # Images and icons
│   ├── robots.txt                 # SEO robots file
│   └── sitemap.xml                # SEO sitemap
├── 📁 docs/                       # Documentation
├── complete-database-enhancement-safe.sql # Database setup
├── LEMON_SQUEEZY_SETUP.md         # Payment setup guide
├── ADMIN_SETUP_GUIDE.md           # Admin dashboard guide
├── LAUNCH_CHECKLIST.md            # Launch preparation
├── env.example                    # Environment variables template
└── package.json                   # Dependencies and scripts
```

---

## 🚀 Core Features

### 1. AI-Powered BMC Generation
- **OpenAI Integration**: Uses GPT-4o-mini for intelligent BMC generation
- **Multi-Step Process**: Guided refinement with targeted questions
- **Context-Aware**: Maintains conversation context throughout generation
- **Professional Output**: Generates comprehensive, business-ready canvases

### 2. User Authentication & Management
- **Supabase Auth**: Secure authentication with email/password
- **Google OAuth**: Social login integration
- **Profile Management**: Complete user profile system
- **Role-Based Access**: User and admin roles with proper permissions

### 3. Payment & Subscription System
- **LemonSqueezy Integration**: Professional payment processing
- **Three-Tier System**: Free, Pro, and Premium plans
- **Feature Gating**: Plan-based feature access
- **Subscription Management**: User can manage their subscriptions

### 4. Admin Dashboard
- **User Management**: View, search, filter, and manage users
- **Subscription Management**: Monitor subscriptions and revenue
- **Canvas Management**: View and moderate user-created canvases
- **System Settings**: Configure platform features and limits
- **Activity Logging**: Track admin actions for audit purposes

### 5. Visual Customization
- **Logo Upload**: User can upload company logos
- **Color Customization**: Customize primary, card, background colors
- **Branding**: Professional branding options
- **Export Options**: High-quality PDF export

### 6. Canvas Management
- **Save & Load**: Users can save and load their canvases
- **Sharing**: Public/private canvas options
- **Organization**: Tag and categorize canvases
- **Export**: PDF export with custom branding

---

## 🗄️ Database Schema

### Core Tables

#### `profiles` Table
```sql
- id (UUID, Primary Key)
- full_name (TEXT)
- email (TEXT)
- age (INTEGER)
- gender (TEXT)
- country (TEXT)
- use_case (TEXT)
- avatar_url (TEXT)
- phone (TEXT)
- company (TEXT)
- job_title (TEXT)
- industry (TEXT)
- experience_level (TEXT)
- role (TEXT) - 'user' or 'admin'
- plan (TEXT) - 'free', 'pro', 'premium'
- plan_expiry (TIMESTAMP)
- subscription_status (TEXT) - 'active', 'inactive', 'cancelled', 'paused'
- subscription_plan (TEXT) - 'free', 'pro', 'premium'
- subscription_id (TEXT)
- subscription_start_date (TIMESTAMP)
- subscription_end_date (TIMESTAMP)
- payment_provider (TEXT) - 'lemonsqueezy'
- preferences (JSONB)
- statistics (JSONB)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

#### `canvases` Table
```sql
- id (UUID, Primary Key)
- user_id (UUID, Foreign Key)
- business_description (TEXT)
- canvas_data (JSONB)
- form_data (JSONB)
- logo_url (TEXT)
- title (TEXT)
- tags (TEXT[])
- is_public (BOOLEAN)
- view_count (INTEGER)
- export_count (INTEGER)
- remove_watermark (BOOLEAN)
- colors (JSONB)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

#### `plan_limits` Table
```sql
- plan (TEXT, Primary Key)
- max_canvases (INTEGER)
- pdf_download (BOOLEAN)
- color_customization (BOOLEAN)
- ai_consultant (BOOLEAN)
- templates_access (BOOLEAN)
- remove_watermark (BOOLEAN)
- priority_support (BOOLEAN)
- api_access (BOOLEAN)
- team_collaboration (BOOLEAN)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

#### `subscriptions` Table
```sql
- id (UUID, Primary Key)
- user_id (UUID, Foreign Key)
- subscription_id (TEXT, Unique)
- plan (TEXT, Foreign Key)
- status (TEXT)
- current_period_start (TIMESTAMP)
- current_period_end (TIMESTAMP)
- cancel_at_period_end (BOOLEAN)
- payment_provider (TEXT)
- metadata (JSONB)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

#### `system_settings` Table
```sql
- id (UUID, Primary Key)
- key (TEXT, Unique)
- value (JSONB)
- description (TEXT)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

#### `admin_activity_log` Table
```sql
- id (UUID, Primary Key)
- admin_user_id (UUID, Foreign Key)
- action (TEXT)
- target_type (TEXT)
- target_id (UUID)
- details (JSONB)
- created_at (TIMESTAMP)
```

### Database Functions
- `is_admin(user_id UUID)` - Check if user is admin
- `promote_to_admin(target_user_id UUID, admin_user_id UUID)` - Promote user to admin
- `demote_from_admin(target_user_id UUID, admin_user_id UUID)` - Demote admin to user
- `get_system_setting(setting_key TEXT)` - Get system setting
- `update_system_setting(setting_key TEXT, setting_value JSONB, admin_user_id UUID)` - Update system setting
- `log_admin_activity(admin_user_id UUID, action TEXT, target_type TEXT, target_id UUID, details_json JSONB)` - Log admin activity
- `get_admin_dashboard_data()` - Get comprehensive dashboard data
- `auto_promote_first_user()` - Auto-promote first user to admin

### Views
- `admin_dashboard_stats` - Dashboard statistics view

---

## 🔐 Authentication System

### Supabase Auth Integration
- **Email/Password**: Traditional authentication
- **Google OAuth**: Social login integration
- **Email Verification**: Required for new accounts
- **Password Reset**: Secure password reset flow
- **Session Management**: Automatic session handling

### Role-Based Access Control
- **User Role**: Standard user with limited permissions
- **Admin Role**: Full access to admin dashboard and system settings
- **Auto-Promotion**: First user automatically becomes admin
- **Permission Checks**: All admin functions verify admin status

### Security Features
- **Row Level Security (RLS)**: Database-level security policies
- **JWT Tokens**: Secure token-based authentication
- **CSRF Protection**: Built-in CSRF protection
- **Input Validation**: Comprehensive input validation with Zod

---

## 💳 Payment System (LemonSqueezy)

### Integration Overview
- **LemonSqueezy SDK**: Official JavaScript SDK integration
- **Webhook Handling**: Secure webhook processing for payment events
- **Subscription Management**: Complete subscription lifecycle management
- **Plan Synchronization**: Automatic plan updates based on payment status

### Supported Plans
- **Free Plan**: 1 canvas, basic features
- **Pro Plan**: 10 canvases, advanced features
- **Premium Plan**: Unlimited canvases, all features

### Payment Flow
1. User selects plan on `/payment` page
2. Redirected to LemonSqueezy checkout
3. Payment processed securely
4. Webhook updates user subscription status
5. User redirected to success page
6. Plan features immediately available

### Webhook Events Handled
- `order_created` - New order placed
- `subscription_created` - New subscription started
- `subscription_updated` - Subscription modified
- `subscription_cancelled` - Subscription cancelled

---

## 👨‍💼 Admin Dashboard

### Overview Dashboard (`/admin`)
- **Statistics Cards**: Total users, active subscriptions, total canvases, new users this month, new canvases this month, total admins
- **Recent Activity**: Latest users and canvases
- **Quick Actions**: Links to management sections
- **System Status**: Integration status and health checks

### User Management (`/admin/users`)
- **User List**: Searchable and filterable user table
- **User Details**: Comprehensive user information
- **Role Management**: Promote/demote users to admin
- **User Actions**: View, edit, delete users
- **Export**: Export user data to CSV

### Subscription Management (`/admin/subscriptions`)
- **Subscription List**: All user subscriptions
- **Revenue Tracking**: Monthly and total revenue
- **Status Monitoring**: Active, cancelled, paused subscriptions
- **Subscription Details**: Full subscription information
- **Export**: Export subscription data

### Canvas Management (`/admin/canvases`)
- **Canvas List**: All user-created canvases
- **Moderation**: View and manage canvas content
- **Statistics**: Canvas creation trends
- **Canvas Details**: Full canvas information
- **Export**: Export canvas data

### System Settings (`/admin/settings`)
- **Feature Toggles**: Enable/disable platform features
- **Usage Limits**: Configure plan limits
- **Integration Settings**: API keys and configuration
- **Maintenance Mode**: Enable maintenance mode
- **System Monitoring**: Health checks and status

---

## 🤖 AI Integration

### OpenAI Integration
- **Model**: GPT-4o-mini for optimal performance and cost
- **Context Management**: Maintains conversation context
- **Error Handling**: Robust error handling and fallbacks
- **Rate Limiting**: Proper rate limiting implementation

### AI Service Architecture
- **Service Layer**: Centralized AI service management
- **Flow Management**: Structured AI conversation flows
- **Response Processing**: Intelligent response parsing
- **Quality Assurance**: Response validation and improvement

### BMC Generation Process
1. **Initial Input**: User provides business description
2. **AI Analysis**: AI analyzes and structures the business model
3. **Refinement Questions**: Targeted questions to improve the model
4. **Canvas Generation**: Final BMC generation with all sections
5. **Quality Check**: AI reviews and improves the output

---

## 🔌 API Routes

### AI Routes
- `POST /api/ai/generate` - Generate BMC with AI
- `POST /api/ai/refine` - Refine BMC with additional questions
- `POST /api/ai/improve` - Improve existing BMC

### LemonSqueezy Routes
- `POST /api/lemonsqueezy/checkout` - Create checkout session
- `POST /api/lemonsqueezy/webhook` - Handle payment webhooks
- `GET /api/lemonsqueezy/subscription/[id]` - Get subscription details
- `POST /api/lemonsqueezy/subscription/[id]/cancel` - Cancel subscription
- `POST /api/lemonsqueezy/subscription/[id]/resume` - Resume subscription

### Authentication Routes
- `GET /auth/callback` - OAuth callback handling
- `GET /auth/hash-callback` - Hash-based OAuth handling

---

## 🎨 User Interface

### Design System
- **shadcn/ui**: Modern, accessible component library
- **Tailwind CSS**: Utility-first CSS framework
- **Framer Motion**: Smooth animations and transitions
- **Responsive Design**: Mobile-first responsive design
- **Dark/Light Mode**: Theme switching capability

### Key Pages
- **Landing Page**: Marketing page with features and pricing
- **Generate Page**: Main BMC generation interface
- **Profile Page**: User profile and subscription management
- **My Canvases**: Canvas management and organization
- **Payment Page**: Plan selection and payment flow
- **Admin Dashboard**: Comprehensive admin interface

### Component Architecture
- **Reusable Components**: Modular, reusable UI components
- **Form Components**: Consistent form handling
- **Layout Components**: Responsive layout system
- **Interactive Components**: Rich interactive elements

---

## 🛠️ Development Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account
- OpenAI API key
- LemonSqueezy account (for payment features)

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd InnoCanvas

# Install dependencies
npm install

# Set up environment variables
cp env.example .env.local
# Edit .env.local with your configuration

# Run the development server
npm run dev
```

### Environment Variables
See [Environment Variables](#environment-variables) section for complete list.

### Database Setup
1. Create Supabase project
2. Run `complete-database-enhancement-safe.sql` in Supabase SQL Editor
3. Configure authentication settings
4. Set up storage buckets

---

## 🚀 Deployment

### Vercel Deployment
- **Framework**: Next.js
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Environment Variables**: Configure in Vercel dashboard

### Domain Configuration
- **Domain**: innocanvas.site (registered for 1 year)
- **DNS**: Configure with Vercel
- **SSL**: Automatic SSL certificate

### Production Checklist
- ✅ Environment variables configured
- ✅ Database migrations applied
- ✅ Authentication providers configured
- ✅ Payment system configured
- ✅ Admin user created
- ✅ SEO files deployed
- ✅ Legal pages published

---

## 🔧 Environment Variables

### Required Variables
```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here

# LemonSqueezy Configuration
LEMON_SQUEEZY_API_KEY=your_lemonsqueezy_api_key_here
LEMON_SQUEEZY_WEBHOOK_SECRET=your_lemonsqueezy_webhook_secret_here
NEXT_PUBLIC_LEMON_SQUEEZY_STORE_ID=your_store_id_here
NEXT_PUBLIC_LEMON_SQUEEZY_PRO_VARIANT_ID=your_pro_variant_id_here
NEXT_PUBLIC_LEMON_SQUEEZY_PREMIUM_VARIANT_ID=your_premium_variant_id_here

# Next.js Configuration
NEXTAUTH_SECRET=your_nextauth_secret_here
NEXTAUTH_URL=http://localhost:9002
```

### Optional Variables
```bash
# Debug Mode
NEXT_PUBLIC_DEBUG=false

# Analytics (Future)
# NEXT_PUBLIC_GA_ID=your_google_analytics_id
# NEXT_PUBLIC_POSTHOG_KEY=your_posthog_key
```

---

## 📁 File Structure

### Key Files
- `complete-database-enhancement-safe.sql` - Complete database setup script
- `LEMON_SQUEEZY_SETUP.md` - Payment system setup guide
- `ADMIN_SETUP_GUIDE.md` - Admin dashboard setup guide
- `LAUNCH_CHECKLIST.md` - Launch preparation checklist
- `env.example` - Environment variables template

### Documentation
- `PROJECT_DOCUMENTATION.md` - This comprehensive documentation
- `README.md` - Quick start guide
- `docs/` - Additional documentation

### Configuration Files
- `package.json` - Dependencies and scripts
- `tsconfig.json` - TypeScript configuration
- `tailwind.config.ts` - Tailwind CSS configuration
- `next.config.ts` - Next.js configuration
- `components.json` - shadcn/ui configuration

---

## 🎯 Next Steps

### Immediate Actions
1. **LemonSqueezy Setup**: Complete account activation and configuration
2. **Environment Variables**: Configure all production environment variables
3. **Admin User**: Ensure admin user is properly set up
4. **Testing**: Comprehensive testing of all features

### Future Enhancements
1. **Analytics**: Google Analytics 4 integration
2. **Email Marketing**: Newsletter and email automation
3. **Advanced AI**: More sophisticated AI features
4. **Mobile App**: React Native mobile application
5. **API Access**: Public API for developers
6. **Team Features**: Collaborative canvas editing

---

## 📞 Support

For technical support or questions:
- **Documentation**: Check this documentation first
- **Setup Guides**: Refer to specific setup guides
- **Issues**: Create GitHub issues for bugs
- **Features**: Submit feature requests

---

*Last Updated: December 2024*
*Version: 2.0.0*
