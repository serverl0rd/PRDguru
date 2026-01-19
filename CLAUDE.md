# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

PRDguru is an AI-powered Next.js 15 web application for creating Product Requirements Documents (PRDs) through conversation. Features a three-panel layout with PRD sidebar, WYSIWYG editor preview, and AI chat interface. Supports multiple AI providers (OpenAI, Anthropic, Google Gemini).

**Live:** https://prdguru.vercel.app

## Commands

```bash
npm run dev      # Start development server (localhost:3000)
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

**Note:** Run `npm install` first if dependencies are not installed.

## Architecture

### Tech Stack
- **Frontend:** Next.js 15, React 18, Tailwind CSS v4
- **Backend:** Next.js API routes (`/pages/api/`)
- **Database:** Supabase PostgreSQL
- **Auth:** Supabase email/password
- **AI:** OpenAI (GPT-4o), Anthropic (Claude), Google (Gemini) - multi-provider support
- **Payments:** Razorpay (subscriptions)
- **Hosting:** Vercel

### App Structure

```
┌─────────────────────────────────────────────────────────────┐
│  Navbar (Logo + User Menu)                                  │
├────────────┬─────────────────────────┬──────────────────────┤
│  Sidebar   │   WYSIWYG Editor        │   Chat Interface     │
│  (250px)   │   (flex: 1)             │   (350px)            │
│            │                         │                      │
│  PRD List  │   Click-to-edit PRD     │   AI Assistant       │
│  + New PRD │   with live preview     │   for creating       │
│            │                         │   PRDs via chat      │
├────────────┴─────────────────────────┴──────────────────────┤
│  Footer (ServerLord / Atharva Kulkarni branding)            │
└─────────────────────────────────────────────────────────────┘
```

### Key Files

| File | Purpose |
|------|---------|
| `/pages/index.js` | Landing page (unauthenticated) / redirect to /app |
| `/pages/app/index.js` | Main app with three-panel layout |
| `/pages/app/settings.js` | User settings (API key with provider selection, subscription) |
| `/pages/login.js` | Login page |
| `/pages/signup.js` | Signup page |
| `/components/landing/LandingPage.js` | Landing page component |
| `/components/app/ThreePanelLayout.js` | Main app layout with footer |
| `/components/app/PRDSidebar.js` | PRD list sidebar |
| `/components/app/PDFPreview.js` | WYSIWYG editor with contentEditable fields |
| `/components/chat/ChatInterface.js` | AI chat interface |
| `/components/auth/AuthGate.js` | Protected route wrapper |
| `/context/AuthContext.js` | Supabase auth logic |
| `/context/PRDContext.js` | PRD state management |
| `/pages/api/chat.js` | AI chat endpoint (supports OpenAI, Anthropic, Gemini) |
| `/pages/api/saveprd.js` | Save PRD endpoint |
| `/pages/api/getPrds.js` | Get PRDs endpoint |
| `/pages/api/user/settings.js` | User API key and provider management |
| `/pages/api/user/subscription.js` | Subscription status |
| `/pages/api/razorpay/create-subscription.js` | Razorpay subscription |
| `/pages/api/razorpay/verify-payment.js` | Payment verification |
| `/pages/api/razorpay/webhook.js` | Razorpay webhooks |
| `/supabase.js` | Supabase client |

### Data Flow
1. User lands on `/` → sees landing page or redirects to `/app` if logged in
2. User authenticates via email/password (Supabase)
3. In `/app`, user chats with AI to create PRD
4. AI responses update PRD fields in real-time via `PRDContext`
5. WYSIWYG editor allows direct inline editing of PRD fields
6. PRDs saved to Supabase via `/api/saveprd`

### State Management
- `AuthContext` - User auth state
- `PRDContext` - Current PRD, messages, loading state, updateField function
- Local component state via `useState`

## Monetization

Two options for AI access:
1. **BYOK (Bring Your Own Key)** - User adds their API key from OpenAI, Anthropic, or Google in Settings
2. **Pro Subscription (₹99/month)** - Razorpay subscription, uses app's master Anthropic API key

Chat API checks:
1. User's own API key and provider (from `user_settings` table)
2. Active subscription (from `subscriptions` table)
3. If neither, returns paywall message

## Environment Variables

See `.env.example` for full list:

```
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Anthropic (for subscribers)
ANTHROPIC_API_KEY=

# Razorpay
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
RAZORPAY_PLAN_ID=
RAZORPAY_WEBHOOK_SECRET=

# App
NEXT_PUBLIC_APP_URL=https://prdguru.vercel.app
```

## Database Schema

### prds table
```sql
CREATE TABLE prds (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT,
  objective TEXT,
  description TEXT,
  functional_requirements TEXT,
  non_functional_requirements TEXT,
  dependencies TEXT,
  acceptance_criteria TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### user_settings table
```sql
CREATE TABLE user_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  api_key TEXT,
  ai_provider TEXT DEFAULT 'anthropic',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### subscriptions table
```sql
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  razorpay_subscription_id TEXT,
  razorpay_payment_id TEXT,
  status TEXT NOT NULL DEFAULT 'inactive',
  current_period_end TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

Row Level Security (RLS) is enabled on all tables.

## Design System

Black & white minimalistic design:
- Background: `#ffffff`
- Foreground: `#0a0a0a`
- Muted: `#fafafa`
- Border: `#e5e5e5`

CSS classes defined in `/styles/globals.css`:
- `.btn`, `.btn-primary`, `.btn-secondary`, `.btn-ghost`
- `.input`, `.textarea`
- `.card`, `.card-header`, `.card-content`
- `.logo`, `.logo-bold`
- `.message`, `.message-user`, `.message-assistant`
- `[contenteditable]` - WYSIWYG editor styling with placeholder support

## Testing

Test functionality using Puppeteer before confirming fixes or completed tasks.

```bash
node test-new-ui.js        # UI tests
node test-subscription.js  # Subscription feature tests
node test-full-flow.js     # Full E2E flow
```

## Branding

Footer displays: "Built by ServerLord (Atharva Kulkarni)"
- ServerLord: https://serverlord.in
- Atharva Kulkarni: https://atharvakulkarni.link
