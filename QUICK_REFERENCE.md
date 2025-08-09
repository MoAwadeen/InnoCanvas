# InnoCanvas - Quick Reference Guide

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm
- Supabase account
- OpenAI API key

### Setup Commands
```bash
# Clone and install
git clone <repo-url>
cd InnoCanvas
npm install

# Environment setup
cp env.example .env.local
# Edit .env.local with your credentials

# Start development
npm run dev
# http://localhost:9002
```

---

## 📁 Key Files & Directories

### Core Application Files
```
src/app/
├── layout.tsx              # Root layout with providers
├── page.tsx               # Landing page
├── generate/page.tsx      # BMC generation (main feature)
├── login/page.tsx         # Authentication
├── register/page.tsx      # User registration
├── my-canvases/page.tsx   # Canvas management
└── api/ai/route.ts       # AI service endpoints
```

### Key Components
```
src/components/
├── ui/                    # shadcn/ui components
├── landing/              # Landing page components
├── greeting.tsx          # User greeting component
└── logo.tsx             # Application logo
```

### Core Libraries
```
src/lib/
├── supabase.ts          # Supabase client & config
├── openai.ts            # OpenAI integration
├── utils.ts             # Utility functions
└── plan-service.ts      # Plan management
```

### Hooks & State
```
src/hooks/
├── useAuth.tsx          # Authentication context
└── use-toast.ts         # Toast notifications
```

---

## 🔐 Authentication Flow

### Login Process
1. User enters email/password or clicks Google OAuth
2. Supabase handles authentication
3. User redirected to `/auth/callback` or `/auth/hash-callback`
4. Profile created/updated automatically
5. User redirected to `/my-canvases`

### Key Authentication Files
- `src/app/login/page.tsx` - Login interface
- `src/app/register/page.tsx` - Registration interface
- `src/app/auth/callback/route.ts` - OAuth callback handling
- `src/hooks/useAuth.tsx` - Authentication context

---

## 🤖 AI Integration

### AI Service Usage
```typescript
// Generate BMC
import { AIService } from '@/ai/services/ai-service';

const bmcData = await AIService.generateBusinessModelCanvas(
  businessDescription,
  mcqAnswers
);

// API endpoint
POST /api/ai
{
  "action": "generateBusinessModelCanvas",
  "businessIdea": "Your business description",
  "mcqAnswers": { ... }
}
```

### AI Configuration
- **Model**: GPT-4o-mini (default)
- **Temperature**: 0.7
- **Max Tokens**: 1000
- **Environment Variable**: `OPENAI_API_KEY`

---

## 🗄️ Database Schema

### Core Tables
1. **`profiles`** - User profiles and preferences
2. **`canvases`** - BMC data and metadata
3. **`plan_limits`** - Feature limits by plan
4. **`subscriptions`** - User subscriptions

### Key Relationships
- `profiles.id` → `auth.users.id`
- `canvases.user_id` → `auth.users.id`
- `profiles.plan` → `plan_limits.plan`

### Database Setup
```bash
# Run in Supabase SQL Editor
# 1. database-schema.sql (complete schema)
# 2. step-by-step-fix.sql (fix missing columns)
# 3. storage-policies.sql (storage permissions)
```

---

## 🎨 UI Components

### Design System
- **Colors**: Deep sky blue (#30A2FF), dark theme
- **Font**: Inter (Google Fonts)
- **Components**: shadcn/ui + Radix UI
- **Animations**: Framer Motion

### Key Components
```typescript
// BMC Block Component
<StyledBmcBlock
  title="Customer Segments"
  content={bmcData.customerSegments}
  icon={<Users />}
  isEditing={isEditing}
  onChange={handleChange}
  colors={colors}
/>

// Form Components
<Form>
  <FormField name="businessDescription">
    <FormControl>
      <Textarea placeholder="Describe your business..." />
    </FormControl>
  </FormField>
</Form>
```

---

## 🔌 API Endpoints

### Core Endpoints
```
POST /api/ai
├── generateBusinessModelCanvas
├── generateHaiku
└── generateCreativeContent

GET /auth/callback
GET /auth/hash-callback
```

### API Response Format
```typescript
// Success Response
{
  "result": "Generated content",
  "status": "success"
}

// Error Response
{
  "error": "Error message",
  "status": "error"
}
```

---

## 🎯 Key Features

### BMC Generation
1. **Step 1**: Business description input
2. **Step 2**: Refinement questions (MCQ)
3. **Step 3**: AI-generated BMC
4. **Step 4**: Edit and customize
5. **Step 5**: Export/Share

### User Management
- **Authentication**: Email/password + Google OAuth
- **Profiles**: Comprehensive user profiles
- **Plans**: Free, Pro, Premium tiers
- **Usage Tracking**: Canvas creation and exports

### Customization
- **Logo Upload**: Custom branding
- **Color Schemes**: Customizable themes
- **Watermark**: Plan-based removal
- **Export Options**: PDF, sharing links

---

## 🛠️ Development Workflow

### Code Structure
```typescript
// Page Component Structure
export default function PageName() {
  // 1. State management
  const [state, setState] = useState();
  
  // 2. Hooks
  const { user, loading } = useAuth();
  const { toast } = useToast();
  
  // 3. Event handlers
  const handleAction = async () => {
    try {
      // Action logic
    } catch (error) {
      toast({ title: "Error", description: error.message });
    }
  };
  
  // 4. Render
  return (
    <div>
      {/* Component JSX */}
    </div>
  );
}
```

### Styling Patterns
```css
/* Component styling */
.component-name {
  @apply bg-card border border-border rounded-lg p-4;
}

/* Animation patterns */
.motion-component {
  @apply transition-all duration-200 hover:scale-105;
}
```

---

## 🔧 Common Tasks

### Adding New Features
1. **Create component** in `src/components/`
2. **Add page** in `src/app/` (if needed)
3. **Update types** in `src/types/`
4. **Add API route** in `src/app/api/`
5. **Update database** (if needed)
6. **Test thoroughly**

### Debugging Tips
```bash
# Check environment variables
echo $NEXT_PUBLIC_SUPABASE_URL

# View database logs
# Supabase Dashboard → Logs

# Debug AI responses
# Check OpenAI Playground

# Check authentication
# Browser DevTools → Application → Storage
```

### Performance Optimization
- **Code Splitting**: Use dynamic imports
- **Image Optimization**: Next.js Image component
- **Caching**: Implement proper caching strategies
- **Database**: Optimize queries and indexes

---

## 🚨 Troubleshooting

### Common Issues

#### Authentication Issues
- **Problem**: OAuth redirect fails
- **Solution**: Check redirect URLs in Supabase dashboard

#### AI Generation Issues
- **Problem**: AI responses fail
- **Solution**: Verify OpenAI API key and quota

#### Database Issues
- **Problem**: Missing columns or tables
- **Solution**: Run `step-by-step-fix.sql`

#### Build Issues
- **Problem**: TypeScript errors
- **Solution**: Run `npm run typecheck`

### Error Messages
```typescript
// Common error patterns
if (error?.code === 'PGRST116') {
  // Record not found
}

if (error?.message?.includes('API key')) {
  // OpenAI configuration issue
}
```

---

## 📚 Resources

### Documentation
- [Full Documentation](./FULL_PROJECT_DOCUMENTATION.md)
- [Authentication Fixes](./AUTHENTICATION_FIXES.md)
- [Database Schema](./database-schema.sql)

### External Resources
- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [OpenAI API Documentation](https://platform.openai.com/docs)
- [shadcn/ui Components](https://ui.shadcn.com/)

### Development Tools
- **Supabase Dashboard**: Database management
- **OpenAI Playground**: AI testing
- **Vercel Analytics**: Performance monitoring
- **Browser DevTools**: Frontend debugging

---

## 🎯 Quick Commands

### Development
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run typecheck    # Run TypeScript check
```

### Database
```bash
# Run in Supabase SQL Editor
# Complete setup
\i database-schema.sql

# Fix issues
\i step-by-step-fix.sql

# Storage policies
\i storage-policies.sql
```

### Environment Variables
```bash
# Required variables
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
OPENAI_API_KEY=
NEXTAUTH_URL=http://localhost:9002
```

---

*This quick reference guide is designed for developers working on the InnoCanvas project. For detailed information, refer to the full documentation.*
