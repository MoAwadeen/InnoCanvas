# InnoCanvas User Flow

Complete user journey documentation for the InnoCanvas platform.

---

## 1. Landing Page (`/`)

**Entry Point**: User visits innocanvas.site

### What Users See
- Hero section with value proposition
- Animated particle background
- BMC preview mockup
- How it works (3 steps)
- AI Consultant chat demo
- Pricing table (Free / Pro / Premium)
- Call-to-action buttons

### Actions Available
| Action | Destination |
|--------|-------------|
| "Get Started" | `/register` |
| "Sign In" | `/login` |
| "View Pricing" | Scroll to pricing section |
| Plan CTA buttons | `/register` |

---

## 2. Registration Flow

### 2.1 Register (`/register`)

**Fields Required:**
- Full Name
- Email
- Password (min 8 chars, 1 uppercase, 1 number, 1 special)
- Age
- Gender
- Country
- Use Case (Student, Entrepreneur, Accelerator/Incubator, Consultant)
- Terms acceptance checkbox

**Validation:**
- Real-time password strength indicator
- Email format validation
- All fields required

**On Submit:**
1. Creates Supabase auth user
2. Creates profile in `profiles` table
3. Sends verification email
4. Redirects to `/register/success`

### 2.2 Registration Success (`/register/success`)

**What Users See:**
- Success confirmation
- "Check your email" instructions
- Resend verification link option
- Link to login page

### 2.3 Email Verification (`/verify-email`)

**Triggered by:** Clicking link in verification email

**Process:**
1. Extracts token from URL
2. Verifies with Supabase
3. Shows success/error message
4. Redirects to `/login`

---

## 3. Authentication Flow

### 3.1 Login (`/login`)

**Options:**
- Email + Password
- Google OAuth button

**On Success:**
1. Creates session
2. Fetches user profile
3. Redirects to `/my-canvases`

**On Failure:**
- Shows error toast
- Stays on login page

### 3.2 Password Reset (`/reset-password`)

**Process:**
1. User enters email
2. Clicks "Send Reset Link"
3. Receives email with reset link
4. Clicks link → redirected to password update form
5. Sets new password
6. Redirects to `/login`

---

## 4. Main Application Flow

### 4.1 My Canvases Dashboard (`/my-canvases`)

**Requires:** Authenticated user

**What Users See:**
- Personalized greeting (time-based)
- "Welcome back, {name}" header
- Grid of saved canvases (or empty state)
- Each canvas card shows: title, preview, date

**Actions:**
| Action | Result |
|--------|--------|
| "Create New Canvas" | `/generate` |
| "Open" canvas | `/generate?canvasId={id}` |
| "Delete" canvas | Confirmation dialog → deletes from DB |
| "Profile" button | `/profile` |
| "Logout" button | Signs out → `/login` |

**Empty State:**
- "No Canvases Yet" message
- Large "+" button to create first canvas

### 4.2 BMC Generator (`/generate`)

**Requires:** Authenticated user

**Multi-Step Process:**

#### Step 1: Business Idea Input
- Text input: "Describe your business idea"
- "Generate Canvas" button

#### Step 2: Refinement Questions (MCQ)
AI asks 6 multiple-choice questions:
1. Value Proposition focus
2. Target Customer Segments
3. Preferred Channels
4. Revenue Model
5. Key Resources needed
6. Business Model type

Each question has 4-5 options. User selects one per question.

#### Step 3: Canvas Generation
- Loading state with progress indicator
- AI generates all 9 BMC sections:
  - Key Partners
  - Key Activities
  - Key Resources
  - Value Propositions
  - Customer Relationships
  - Channels
  - Customer Segments
  - Cost Structure
  - Revenue Streams

#### Step 4: Canvas Preview & Editing
- Visual BMC grid layout
- Each section is editable
- Customization panel:
  - Logo upload
  - Color picker (primary, card, background)
- Action buttons:
  - "Save Canvas"
  - "Export PDF"
  - "Export PNG"
  - "Back to My Canvases"

**Plan Limits Enforced:**
- Free: 3 canvases max
- Pro: 10 canvases max
- Premium: Unlimited

---

## 5. Profile Management (`/profile`)

**Requires:** Authenticated user

### Sections:

#### Personal Information
- Full Name
- Email (read-only)
- Phone
- Avatar upload

#### Professional Information
- Company
- Job Title
- Industry (dropdown)
- Experience Level (dropdown)

#### Preferences
- Theme (Light/Dark)
- Email Notifications toggle
- Newsletter subscription toggle
- Language selection

#### Statistics (read-only)
- Total canvases created
- Last login date
- Account created date

#### Subscription Info
- Current plan badge
- Upgrade button (if not Premium)
- Manage subscription link

#### Danger Zone
- Delete Account button (with confirmation)

---

## 6. Payment Flow

### 6.1 Plan Selection (`/payment`)

**Requires:** Authenticated user

**What Users See:**
- Two plan cards: Pro ($8/mo) and Premium ($15/mo)
- Feature comparison list
- Current plan highlighted (if any)
- "Complete Your Purchase" summary panel

**Process:**
1. User selects plan (Pro or Premium)
2. Clicks "Continue to Payment"
3. Redirects to LemonSqueezy checkout
4. Completes payment on LemonSqueezy
5. Webhook updates user's plan in database
6. Redirects to `/payment/success`

### 6.2 Payment Success (`/payment/success`)

**What Users See:**
- Success confirmation
- New plan details
- "Create Your First Canvas" CTA
- "Go to Profile" link

---

## 7. Admin Flow (`/admin/*`)

**Requires:** User with `role: 'admin'` in profile

### 7.1 Admin Dashboard (`/admin`)

**Metrics Displayed:**
- Total users count
- Total canvases count
- Active subscriptions count
- Revenue summary

**Quick Actions:**
- View all users
- View all canvases
- System settings

### 7.2 User Management (`/admin/users`)

**Features:**
- Searchable user list
- Filter by plan/status
- View user details modal
- Change user plan (Free/Pro/Premium)
- Ban/Unban user
- View user's canvases

### 7.3 Canvas Management (`/admin/canvases`)

**Features:**
- All canvases across all users
- Search by title or user
- View canvas details
- Delete inappropriate content
- Export analytics

### 7.4 Subscription Management (`/admin/subscriptions`)

**Features:**
- Active subscriptions list
- Filter by plan type
- Revenue analytics
- Churn tracking
- Manual plan adjustments

### 7.5 System Settings (`/admin/settings`)

**Tabs:**

| Tab | Settings |
|-----|----------|
| General | Maintenance mode, Registration toggle, Email verification required |
| Features | AI model selection, Default language |
| Limits | Max canvases per plan |
| Integrations | API health status (Supabase, OpenAI, Payment) |
| Monitoring | Active users, System alerts |

---

## 8. Static Pages

### Privacy Policy (`/privacy`)
- Data collection info
- Cookie policy
- User rights
- Contact information

### Terms of Service (`/terms`)
- Usage terms
- Prohibited activities
- Liability limitations
- Dispute resolution

### 404 Not Found (`/not-found`)
- Friendly error message
- "Go Home" button
- "Go Back" button
- Links to common pages

---

## 9. Session & Auth States

### Unauthenticated User
**Can Access:**
- `/` (landing)
- `/login`
- `/register`
- `/reset-password`
- `/verify-email`
- `/privacy`
- `/terms`

**Cannot Access:**
- `/generate` → redirects to `/login`
- `/my-canvases` → redirects to `/login`
- `/profile` → redirects to `/login`
- `/payment` → redirects to `/login`
- `/admin/*` → redirects to `/login`

### Authenticated User (Non-Admin)
**Can Access:**
- All public pages
- `/generate`
- `/my-canvases`
- `/profile`
- `/payment`

**Cannot Access:**
- `/admin/*` → shows unauthorized or redirects

### Authenticated Admin
**Can Access:**
- All pages including `/admin/*`

---

## 10. Error States

| Scenario | Behavior |
|----------|----------|
| Invalid login credentials | Toast: "Invalid email or password" |
| Email not verified | Toast: "Please verify your email" |
| Canvas limit reached | Toast: "Upgrade to create more canvases" + upgrade button |
| Payment failed | Stays on LemonSqueezy with error |
| AI generation failed | Toast: "Generation failed" + retry button |
| Network error | Toast: "Connection error" |
| 404 page | Custom not-found page |
| Server error | Generic error message |

---

## 11. Data Flow Summary

```
User Registration
    │
    ▼
Email Verification
    │
    ▼
Login ──────────────────────────────────┐
    │                                   │
    ▼                                   ▼
My Canvases ◄───────────────────► Profile
    │                                   │
    ▼                                   ▼
Generate BMC                      Payment/Upgrade
    │                                   │
    ├── Step 1: Idea Input              ▼
    ├── Step 2: MCQ Refinement    LemonSqueezy
    ├── Step 3: AI Generation           │
    ├── Step 4: Preview/Edit            ▼
    │                             Plan Updated
    ▼
Save to Database
    │
    ▼
Export (PDF/PNG)
```

---

## 12. Plan Feature Matrix

| Feature | Free | Pro | Premium |
|---------|------|-----|---------|
| Max Canvases | 3 | 10 | Unlimited |
| Basic Export | Yes | Yes | Yes |
| PDF Download | No | Yes | Yes |
| PNG Download | No | Yes | Yes |
| Color Customization | No | Yes | Yes |
| Logo Upload | No | Yes | Yes |
| AI Consultant | No | Yes | Yes |
| Remove Watermark | No | No | Yes |
| Custom Branding | No | No | Yes |
| Team Collaboration | No | No | Yes |
| API Access | No | No | Yes |
| Priority Support | No | Yes | Yes |

---

*Last updated: March 2026*
