# PRDGuru

AI-powered Product Requirements Document (PRD) creation tool. Chat with Claude AI to create comprehensive PRDs in minutes.

**Live Demo:** [prdguru.vercel.app](https://prdguru.vercel.app)

![PRDGuru Screenshot](https://via.placeholder.com/800x400?text=PRDGuru+Screenshot)

## Features

- **AI-Powered Chat** - Describe your product idea and let Claude AI guide you through creating a comprehensive PRD
- **Live PDF Preview** - See your PRD rendered in real-time as you build it
- **Three-Panel Layout** - Sidebar for PRD management, center for preview, right for chat
- **BYOK Support** - Bring your own Anthropic API key
- **Pro Subscription** - $9/month for unlimited AI access
- **Secure Auth** - Email/password authentication via Supabase

## Tech Stack

- **Frontend:** Next.js 14, React 18, Tailwind CSS v4
- **Backend:** Next.js API routes
- **Database:** Supabase (PostgreSQL)
- **Auth:** Supabase Auth
- **AI:** Anthropic Claude API
- **Payments:** Stripe
- **Hosting:** Vercel

## Getting Started

### Prerequisites

- Node.js 18+
- Supabase account
- Anthropic API key (for AI features)
- Stripe account (for payments)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/serverl0rd/PRDguru.git
cd PRDguru
```

2. Install dependencies:
```bash
npm install
```

3. Copy environment variables:
```bash
cp .env.example .env.local
```

4. Configure `.env.local` with your credentials:
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Anthropic (for Pro subscribers)
ANTHROPIC_API_KEY=sk-ant-...

# Stripe
STRIPE_SECRET_KEY=sk_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_ID=price_...

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

5. Set up Supabase database:
   - Create a new Supabase project
   - Run the SQL from `supabase-schema-update.sql` in the SQL Editor

6. Start the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Database Setup

Run this SQL in your Supabase SQL Editor:

```sql
-- PRDs table
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

-- User settings (for BYOK API keys)
CREATE TABLE user_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  anthropic_api_key TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Subscriptions (for Stripe)
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  status TEXT NOT NULL DEFAULT 'inactive',
  current_period_end TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE prds ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can manage own PRDs" ON prds FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own settings" ON user_settings FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view own subscription" ON subscriptions FOR SELECT USING (auth.uid() = user_id);
```

## Stripe Setup

1. Create a product in Stripe Dashboard:
   - Name: "PRD Guru Pro"
   - Price: $9.00 USD, recurring monthly

2. Set up webhook endpoint:
   - URL: `https://your-domain.com/api/stripe/webhook`
   - Events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_failed`

3. Add the Price ID and Webhook Secret to your environment variables

## Project Structure

```
├── components/
│   ├── app/           # Main app components
│   ├── auth/          # Auth components
│   ├── chat/          # Chat interface
│   └── landing/       # Landing page
├── context/
│   ├── AuthContext.js # Auth state
│   └── PRDContext.js  # PRD state
├── pages/
│   ├── api/           # API routes
│   ├── app/           # App pages (protected)
│   ├── index.js       # Landing page
│   ├── login.js       # Login
│   └── signup.js      # Signup
├── public/            # Static assets
├── styles/            # Global styles
└── supabase.js        # Supabase client
```

## Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Environment Variables for Production

Add all variables from `.env.example` to your Vercel project settings.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

MIT

---

Built with Next.js and Claude AI
