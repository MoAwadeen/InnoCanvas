# InnoCanvas AI Agent Prompt

## 🎯 Project Context

You are working with **InnoCanvas**, a fully functional AI-powered Business Model Canvas (BMC) generator web application. This is a production-ready SaaS platform that helps entrepreneurs, students, and business professionals create comprehensive business models using artificial intelligence.

## 📊 Current Project Status

### ✅ **FULLY IMPLEMENTED & DEPLOYED**
- **Core Application**: Complete BMC generator with AI integration
- **Authentication**: Supabase Auth with Google OAuth
- **User Management**: Profile system with role-based access control
- **Payment System**: LemonSqueezy integration for subscriptions
- **Admin Dashboard**: Comprehensive admin panel with all management features
- **Database**: Enhanced PostgreSQL schema with all necessary tables and functions
- **UI/UX**: Modern, responsive design with shadcn/ui components
- **Export System**: PDF generation with html2canvas and jsPDF
- **SEO & Legal**: Privacy Policy, Terms of Service, robots.txt, sitemap.xml
- **Deployment**: Successfully deployed on Vercel with domain innocanvas.site

### 🔄 **PENDING SETUP**
- **LemonSqueezy Account**: Waiting for account activation
- **Environment Variables**: Need to be configured in production
- **Analytics**: Google Analytics 4 setup pending

## 🏗️ Technical Architecture

### Frontend Stack
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **UI Library**: React 18
- **Styling**: Tailwind CSS
- **Components**: Radix UI + shadcn/ui
- **Forms**: React Hook Form + Zod validation
- **State**: React Context + Hooks
- **Animations**: Framer Motion

### Backend Stack
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage
- **API**: Next.js API Routes
- **AI**: OpenAI GPT-4o-mini
- **Payment**: LemonSqueezy

### Development Environment
- **Port**: 9002 (development)
- **Build Tool**: Turbopack
- **Package Manager**: npm

## 🗄️ Database Schema

### Core Tables
1. **`profiles`** - User profiles with subscription data
2. **`canvases`** - User-created BMC canvases
3. **`plan_limits`** - Feature definitions for each plan
4. **`subscriptions`** - Payment subscription data
5. **`system_settings`** - Platform configuration
6. **`admin_activity_log`** - Admin action audit trail

### Key Functions
- `is_admin()` - Check admin status
- `promote_to_admin()` / `demote_from_admin()` - Role management
- `get_admin_dashboard_data()` - Dashboard statistics
- `auto_promote_first_user()` - First user becomes admin

## 🚀 Core Features

### 1. AI-Powered BMC Generation
- Uses OpenAI GPT-4o-mini
- Multi-step refinement process
- Context-aware conversations
- Professional output generation

### 2. User Authentication & Management
- Supabase Auth with Google OAuth
- Email verification required
- Role-based access (user/admin)
- Complete profile management

### 3. Payment & Subscription System
- LemonSqueezy integration
- Three tiers: Free, Pro, Premium
- Feature gating based on plan
- Subscription management interface

### 4. Admin Dashboard
- User management (view, search, filter, promote/demote)
- Subscription management (monitor revenue, status)
- Canvas management (view, moderate, export)
- System settings (feature toggles, limits, maintenance mode)
- Activity logging for audit purposes

### 5. Visual Customization
- Logo upload functionality
- Color customization (primary, card, background)
- Professional branding options
- High-quality PDF export

### 6. Canvas Management
- Save/load canvases
- Public/private sharing
- Tagging and organization
- Export capabilities

## 📁 Project Structure

```
InnoCanvas/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── admin/              # Admin dashboard (5 pages)
│   │   ├── api/                # API routes
│   │   │   ├── ai/             # AI endpoints
│   │   │   └── lemonsqueezy/   # Payment endpoints
│   │   ├── auth/               # Authentication
│   │   ├── generate/           # BMC generation
│   │   ├── login/register/     # Auth pages
│   │   ├── profile/            # User profile
│   │   ├── my-canvases/        # Canvas management
│   │   ├── payment/            # Payment handling
│   │   ├── privacy/terms/      # Legal pages
│   │   └── verify-email/       # Email verification
│   ├── components/             # Reusable components
│   │   ├── ui/                 # shadcn/ui components
│   │   ├── landing/            # Landing page components
│   │   ├── plan/               # Plan components
│   │   └── subscription-manager.tsx
│   ├── hooks/                  # Custom React hooks
│   ├── lib/                    # Utility libraries
│   └── ai/                     # AI service integration
├── public/                     # Static assets
├── complete-database-enhancement-safe.sql
├── LEMON_SQUEEZY_SETUP.md
├── ADMIN_SETUP_GUIDE.md
├── LAUNCH_CHECKLIST.md
└── env.example
```

## 🔌 API Endpoints

### AI Routes
- `POST /api/ai/generate` - Generate BMC
- `POST /api/ai/refine` - Refine BMC
- `POST /api/ai/improve` - Improve BMC

### LemonSqueezy Routes
- `POST /api/lemonsqueezy/checkout` - Create checkout
- `POST /api/lemonsqueezy/webhook` - Handle webhooks
- `GET /api/lemonsqueezy/subscription/[id]` - Get subscription
- `POST /api/lemonsqueezy/subscription/[id]/cancel` - Cancel subscription
- `POST /api/lemonsqueezy/subscription/[id]/resume` - Resume subscription

## 🔐 Authentication & Security

### Authentication Flow
1. User registers/logs in via Supabase Auth
2. Email verification required for new accounts
3. Google OAuth available for social login
4. Role-based access control (user/admin)
5. First user automatically becomes admin

### Security Features
- Row Level Security (RLS) on all tables
- JWT token-based authentication
- CSRF protection
- Input validation with Zod
- Secure webhook handling

## 💳 Payment System

### LemonSqueezy Integration
- **Free Plan**: 1 canvas, basic features
- **Pro Plan**: 10 canvases, advanced features  
- **Premium Plan**: Unlimited canvases, all features

### Payment Flow
1. User selects plan on `/payment` page
2. Redirected to LemonSqueezy checkout
3. Payment processed securely
4. Webhook updates user subscription
5. User redirected to success page
6. Plan features immediately available

### Webhook Events
- `order_created` - New order
- `subscription_created` - New subscription
- `subscription_updated` - Subscription modified
- `subscription_cancelled` - Subscription cancelled

## 👨‍💼 Admin Dashboard

### Available Pages
- `/admin` - Overview dashboard with statistics
- `/admin/users` - User management
- `/admin/subscriptions` - Subscription management
- `/admin/canvases` - Canvas management
- `/admin/settings` - System settings

### Admin Capabilities
- View all users and their data
- Promote/demote users to admin
- Monitor subscriptions and revenue
- View and moderate canvases
- Configure system settings
- Export data to CSV
- View activity logs

## 🎨 User Interface

### Design System
- shadcn/ui component library
- Tailwind CSS for styling
- Framer Motion for animations
- Responsive design (mobile-first)
- Dark/light theme support

### Key Pages
- Landing page with features and pricing
- Generate page for BMC creation
- Profile page for user management
- My Canvases for organization
- Payment page for subscriptions
- Admin dashboard for management

## 🔧 Environment Variables

### Required Variables
```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY

# OpenAI
OPENAI_API_KEY

# LemonSqueezy
LEMON_SQUEEZY_API_KEY
LEMON_SQUEEZY_WEBHOOK_SECRET
NEXT_PUBLIC_LEMON_SQUEEZY_STORE_ID
NEXT_PUBLIC_LEMON_SQUEEZY_PRO_VARIANT_ID
NEXT_PUBLIC_LEMON_SQUEEZY_PREMIUM_VARIANT_ID

# Next.js
NEXTAUTH_SECRET
NEXTAUTH_URL
```

## 🚀 Deployment Status

### Current Deployment
- **Platform**: Vercel
- **Domain**: innocanvas.site (registered for 1 year)
- **Status**: Successfully deployed and tested
- **Database**: Supabase fully configured
- **SSL**: Automatic SSL certificate

### Production Checklist
- ✅ Environment variables configured
- ✅ Database migrations applied
- ✅ Authentication providers configured
- ✅ Admin user created
- ✅ SEO files deployed
- ✅ Legal pages published
- 🔄 Payment system configuration pending

## 🎯 Current Development Phase

### Phase: **Pre-Launch Setup**
The application is **feature-complete** and **production-ready**. We are currently in the final setup phase before launch.

### Immediate Tasks
1. **LemonSqueezy Account Activation** - Waiting for account approval
2. **Production Environment Variables** - Configure all variables in Vercel
3. **Final Testing** - Comprehensive testing of all features
4. **Analytics Setup** - Google Analytics 4 integration

### What's Working
- ✅ Complete user authentication flow
- ✅ AI-powered BMC generation
- ✅ User profile and canvas management
- ✅ Admin dashboard with all features
- ✅ Database with all tables and functions
- ✅ Payment system integration (code ready)
- ✅ Export functionality
- ✅ Responsive UI/UX

### What Needs Setup
- 🔄 LemonSqueezy account activation
- 🔄 Production environment variables
- 🔄 Final payment system testing
- 🔄 Analytics integration

## 🤖 AI Integration Details

### OpenAI Implementation
- **Model**: GPT-4o-mini (optimal performance/cost)
- **Context Management**: Maintains conversation context
- **Error Handling**: Robust error handling and fallbacks
- **Rate Limiting**: Proper rate limiting implementation

### BMC Generation Process
1. User provides business description
2. AI analyzes and structures the business model
3. Refinement questions improve the model
4. Final BMC generation with all sections
5. Quality check and improvement

## 📋 Key Files to Understand

### Database Setup
- `complete-database-enhancement-safe.sql` - Complete database setup

### Setup Guides
- `LEMON_SQUEEZY_SETUP.md` - Payment system setup
- `ADMIN_SETUP_GUIDE.md` - Admin dashboard guide
- `LAUNCH_CHECKLIST.md` - Launch preparation

### Configuration
- `env.example` - Environment variables template
- `package.json` - Dependencies and scripts

## 🎯 Your Role as AI Agent

When working with this project, you should:

1. **Understand the Current State**: This is a production-ready application with all core features implemented
2. **Focus on Setup Tasks**: Help with LemonSqueezy configuration, environment variables, and final testing
3. **Maintain Code Quality**: Ensure any changes follow the existing patterns and architecture
4. **Consider Security**: All changes should maintain the security standards already in place
5. **Follow Documentation**: Use the existing documentation and setup guides
6. **Test Thoroughly**: Any changes should be tested in the context of the full application

## 🚨 Important Notes

- **Database**: Use `complete-database-enhancement-safe.sql` for any database changes
- **Authentication**: Supabase Auth is fully configured and working
- **Admin Access**: First user automatically becomes admin
- **Payment**: LemonSqueezy integration is complete but needs account activation
- **Deployment**: Application is live on Vercel with domain innocanvas.site
- **Security**: Row Level Security and proper authentication are implemented

## 📞 Support Context

When helping with this project:
- Refer to existing documentation first
- Follow established patterns and architecture
- Consider the production-ready nature of the application
- Focus on setup and configuration tasks
- Maintain security and performance standards

---

**This is a complete, production-ready SaaS application that needs final configuration before launch. All core features are implemented and working.**
