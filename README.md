# InnoCanvas

AI-powered Business Model Canvas generator for entrepreneurs, students, and business professionals.

**Live**: [innocanvas.site](https://innocanvas.site)

## Tech Stack

- **Framework**: Next.js 15.3.6 (App Router, Turbopack)
- **Language**: TypeScript 5
- **Database**: Supabase (PostgreSQL + Auth + Storage)
- **AI**: OpenAI GPT-4o-mini
- **Payments**: LemonSqueezy (international) + Paymob (Egypt)
- **UI**: Tailwind CSS, shadcn/ui, Radix UI, Framer Motion
- **Forms**: React Hook Form + Zod

## Features

### BMC Generator (`/generate`)
- Multi-step questionnaire (value proposition, customer segments, channels, revenue, key resources, business model type)
- GPT-4o-mini generates all 9 BMC sections
- Canvas preview with live editing
- Export to PDF/PNG
- Save to database

### Authentication
- Email/password registration with email verification
- Google OAuth
- Password reset flow
- Profile management (name, company, job title, industry, avatar upload)

### Subscription Plans
| Plan | Price | Canvases | Features |
|------|-------|----------|----------|
| Free | $0 | 3 | Basic export |
| Pro | $8/mo | 10 | PDF download, color customization, AI consultant, priority support |
| Premium | $15/mo | Unlimited | All Pro + custom branding, no watermarks, team collaboration, API access |

### Admin Dashboard (`/admin/*`)
- **Overview**: User count, canvases, revenue, active subscriptions
- **Users**: List, search, change plans, ban/unban
- **Canvases**: View/moderate/delete any canvas
- **Subscriptions**: Revenue analytics, churn analysis
- **Settings**: Maintenance mode, registration toggle, AI model selection, plan limits

## Project Structure

```
src/
├── app/
│   ├── (auth)
│   │   ├── login/
│   │   ├── register/
│   │   ├── reset-password/
│   │   └── verify-email/
│   ├── admin/
│   │   ├── page.tsx          # Dashboard overview
│   │   ├── users/
│   │   ├── canvases/
│   │   ├── subscriptions/
│   │   └── settings/
│   ├── api/
│   │   ├── ai/               # AI generation endpoint
│   │   ├── lemonsqueezy/     # Checkout + webhooks
│   │   └── paymob/           # Checkout + webhooks
│   ├── generate/             # BMC generator
│   ├── my-canvases/          # User's saved canvases
│   ├── payment/              # Plan selection + success
│   ├── profile/              # User settings
│   ├── privacy/
│   ├── terms/
│   └── page.tsx              # Landing page
├── components/
│   ├── ui/                   # shadcn/ui components
│   ├── greeting.tsx
│   └── subscription-manager.tsx
├── hooks/
│   ├── useAuth.tsx           # Auth state + plan limits
│   └── useAI.ts              # AI service wrapper
├── lib/
│   ├── supabase.ts           # Supabase client
│   ├── openai.ts             # OpenAI wrapper
│   ├── lemonsqueezy.ts       # Payment service
│   ├── paymob.ts             # Payment service (Egypt)
│   └── plan-service.ts       # Plan limit enforcement
└── ai/
    └── services/ai-service.ts
```

## API Routes

| Route | Method | Purpose |
|-------|--------|---------|
| `/api/ai` | POST | AI actions: `generateBusinessModelCanvas`, `chatWithContext`, `improveContent`, `generateInsights` |
| `/api/lemonsqueezy/checkout` | POST | Create checkout session |
| `/api/lemonsqueezy/webhook` | POST | Handle subscription lifecycle |
| `/api/paymob/checkout` | POST | Create Paymob subscription |
| `/api/paymob/webhook` | POST | Handle Paymob events |

## Database Tables

- **profiles**: User data, plan, subscription info, preferences
- **canvases**: Saved BMC data per user
- **plan_limits**: Feature flags per plan

## Environment Variables

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

# OpenAI
OPENAI_API_KEY=

# LemonSqueezy
LEMON_SQUEEZY_API_KEY=
LEMON_SQUEEZY_WEBHOOK_SECRET=
NEXT_PUBLIC_LEMON_SQUEEZY_STORE_ID=
NEXT_PUBLIC_LEMON_SQUEEZY_PRO_VARIANT_ID=
NEXT_PUBLIC_LEMON_SQUEEZY_PREMIUM_VARIANT_ID=

# Paymob (optional)
PAYMOB_API_KEY=
PAYMOB_PUBLIC_KEY=
PAYMOB_SECRET_KEY=
PAYMOB_INTEGRATION_ID=
```

## Development

```bash
npm install
npm run dev     # http://localhost:9002
npm run build   # Production build
```

## Deployment

Hosted on Vercel. Push to `main` triggers automatic deployment.

## Design System

- **Background**: `#000000` (pure black)
- **Accent**: `#77ff00` (chartreuse green)
- **Text**: zinc-100 > zinc-400 > zinc-500
- **Borders**: zinc-800
- **Font**: Inter

---

Built with Next.js, Supabase, OpenAI, and LemonSqueezy.
