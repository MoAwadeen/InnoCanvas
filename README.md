# InnoCanvas - AI-Powered Business Model Canvas Generator

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green?style=for-the-badge&logo=supabase)](https://supabase.com/)
[![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4o--mini-purple?style=for-the-badge&logo=openai)](https://openai.com/)
[![LemonSqueezy](https://img.shields.io/badge/LemonSqueezy-Payment-orange?style=for-the-badge)](https://lemonsqueezy.com/)

**InnoCanvas** is a modern, AI-powered Business Model Canvas (BMC) generator that helps entrepreneurs, students, and business professionals create comprehensive business models using artificial intelligence.

🌐 **Live Demo**: [innocanvas.site](https://innocanvas.site)

## ✨ Features

### 🤖 AI-Powered Generation
- **OpenAI GPT-4o-mini** integration for intelligent BMC generation
- Multi-step refinement process with guided questions
- Context-aware conversations throughout generation
- Professional, business-ready output

### 👤 User Management
- **Supabase Auth** with Google OAuth integration
- Complete user profile system
- Role-based access control (user/admin)
- Email verification and secure authentication

### 💳 Subscription System
- **LemonSqueezy** payment processing
- Three-tier system: Free, Pro, Premium
- Feature gating based on subscription plan
- Subscription management interface

### 👨‍💼 Admin Dashboard
- Comprehensive admin panel with full management capabilities
- User management (view, search, filter, promote/demote)
- Subscription monitoring and revenue tracking
- Canvas moderation and system settings
- Activity logging for audit purposes

### 🎨 Visual Customization
- Logo upload functionality
- Color customization (primary, card, background)
- Professional branding options
- High-quality PDF export with custom branding

### 📊 Canvas Management
- Save and load canvases
- Public/private sharing options
- Tagging and organization
- Export capabilities

## 🚀 Quick Start

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

The application will be available at `http://localhost:9002`

### Environment Variables

Create a `.env.local` file with the following variables:

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

### Database Setup

1. Create a Supabase project
2. Run the database setup script:
   ```sql
   -- Copy and paste the content of complete-database-enhancement-safe.sql
   -- into your Supabase SQL Editor and run it
   ```
3. Configure authentication settings in Supabase
4. Set up storage buckets for file uploads

## 🏗️ Tech Stack

### Frontend
- **Next.js 15** (App Router)
- **TypeScript**
- **React 18**
- **Tailwind CSS**
- **shadcn/ui** + **Radix UI**
- **Framer Motion**
- **React Hook Form** + **Zod**

### Backend
- **Supabase** (PostgreSQL)
- **Supabase Auth**
- **Supabase Storage**
- **Next.js API Routes**
- **OpenAI GPT-4o-mini**
- **LemonSqueezy**

### Development
- **Turbopack** (build tool)
- **ESLint**
- **TypeScript**
- **npm**

## 📁 Project Structure

```
InnoCanvas/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── admin/              # Admin dashboard
│   │   ├── api/                # API routes
│   │   ├── auth/               # Authentication
│   │   ├── generate/           # BMC generation
│   │   ├── login/register/     # Auth pages
│   │   ├── profile/            # User profile
│   │   ├── my-canvases/        # Canvas management
│   │   ├── payment/            # Payment handling
│   │   └── privacy/terms/      # Legal pages
│   ├── components/             # Reusable components
│   ├── hooks/                  # Custom React hooks
│   ├── lib/                    # Utility libraries
│   └── ai/                     # AI service integration
├── public/                     # Static assets
├── complete-database-enhancement-safe.sql
├── LEMON_SQUEEZY_SETUP.md
├── ADMIN_SETUP_GUIDE.md
└── LAUNCH_CHECKLIST.md
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

## 🗄️ Database Schema

### Core Tables
- **`profiles`** - User profiles with subscription data
- **`canvases`** - User-created BMC canvases
- **`plan_limits`** - Feature definitions for each plan
- **`subscriptions`** - Payment subscription data
- **`system_settings`** - Platform configuration
- **`admin_activity_log`** - Admin action audit trail

## 🚀 Deployment

### Vercel Deployment
1. Connect your repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Domain Configuration
- **Domain**: innocanvas.site (registered for 1 year)
- **SSL**: Automatic SSL certificate
- **DNS**: Configure with Vercel

## 📚 Documentation

- **[Complete Project Documentation](PROJECT_DOCUMENTATION.md)** - Comprehensive project overview
- **[LemonSqueezy Setup Guide](LEMON_SQUEEZY_SETUP.md)** - Payment system configuration
- **[Admin Dashboard Guide](ADMIN_SETUP_GUIDE.md)** - Admin panel setup
- **[Launch Checklist](LAUNCH_CHECKLIST.md)** - Pre-launch preparation
- **[AI Agent Prompt](AI_AGENT_PROMPT.md)** - For AI assistants working on the project

## 🎯 Current Status

### ✅ **Production Ready**
- Complete BMC generator with AI integration
- Full authentication system
- Payment processing with LemonSqueezy
- Comprehensive admin dashboard
- Modern, responsive UI/UX
- Database with all necessary tables and functions
- SEO optimization and legal pages

### 🔄 **Pending Setup**
- LemonSqueezy account activation
- Production environment variables configuration
- Google Analytics 4 integration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Check the [documentation](PROJECT_DOCUMENTATION.md) first
- Create an issue for bugs
- Submit feature requests

---

**InnoCanvas** - Turn your ideas into business models with AI-powered precision.

*Built with ❤️ using Next.js, Supabase, OpenAI, and LemonSqueezy*
