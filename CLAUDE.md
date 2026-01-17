# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

PRDguru is a Next.js 14 web application for creating, managing, and exporting Product Requirements Documents (PRDs). It uses Supabase for authentication (email/password) and PostgreSQL database.

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
- **Frontend:** Next.js 14, React 18, Tailwind CSS, shadcn/ui
- **Backend:** Next.js API routes (`/pages/api/`)
- **Database:** Supabase PostgreSQL
- **Auth:** Supabase email/password
- **PDF Export:** jsPDF

### Key Files

| File | Purpose |
|------|---------|
| `/pages/_app.js` | App wrapper with AuthProvider |
| `/context/AuthContext.js` | Supabase auth logic, exports `useAuth()` hook |
| `/components/PRDForm.js` | Main PRD creation form with PDF export |
| `/components/Layout.js` | Main layout with sidebar and navbar |
| `/pages/api/saveprd.js` | POST endpoint - saves PRD to Supabase |
| `/pages/api/getPrds.js` | GET endpoint - fetches PRDs from Supabase |
| `/pages/login.js` | Login page |
| `/pages/signup.js` | Signup page |
| `/supabase.js` | Supabase client initialization |

### Data Flow
1. User authenticates via email/password (AuthContext)
2. PRD form data submitted to `/api/saveprd` with auth token → saved to Supabase
3. PRDs fetched from `/api/getPrds` with auth token on component mount
4. PDF export handled client-side with jsPDF

### State Management
- React Context API for auth state (`AuthContext`)
- Local component state via `useState` hooks
- No external state library

## Environment Variables

Requires `.env.local` with Supabase configuration (see `.env.example`):
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## Database Schema

The `prds` table in Supabase:
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

Row Level Security (RLS) is enabled - users can only access their own PRDs.

## Testing

Test functionality using Puppeteer before confirming fixes or completed tasks.
