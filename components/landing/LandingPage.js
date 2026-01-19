import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="border-b h-16 flex items-center px-6 justify-between sticky top-0 bg-white z-50">
        <div className="logo">
          <span className="logo-bold">PRD</span>Guru
        </div>
        <div className="hidden md:flex items-center gap-6">
          <a href="#features" className="text-sm text-muted hover:text-[var(--foreground)]">Features</a>
          <a href="#how-it-works" className="text-sm text-muted hover:text-[var(--foreground)]">How it works</a>
          <a href="#pricing" className="text-sm text-muted hover:text-[var(--foreground)]">Pricing</a>
        </div>
        <div className="flex gap-3">
          <Link href="/login" className="btn btn-ghost">
            Login
          </Link>
          <Link href="/signup" className="btn btn-primary">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 md:py-32 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--muted)] text-sm mb-6">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            Powered by Claude AI
          </div>
          <h1 className="text-4xl md:text-6xl font-semibold tracking-tight mb-6 leading-tight">
            Turn product ideas into<br />
            <span className="text-muted">professional PRDs</span>
          </h1>
          <p className="text-lg md:text-xl text-muted max-w-2xl mx-auto mb-10">
            Stop staring at blank documents. Chat with AI to create comprehensive
            Product Requirements Documents in minutes, not hours.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup" className="btn btn-primary h-12 px-8 text-base">
              Start Creating PRDs
            </Link>
            <a href="#how-it-works" className="btn btn-secondary h-12 px-8 text-base">
              See How It Works
            </a>
          </div>
        </div>
      </section>

      {/* App Preview */}
      <section className="px-6 pb-20">
        <div className="max-w-5xl mx-auto">
          <div className="border rounded-xl overflow-hidden shadow-2xl bg-white">
            <div className="h-8 bg-[var(--muted)] flex items-center px-4 gap-2">
              <div className="w-3 h-3 rounded-full bg-[#ff5f57]"></div>
              <div className="w-3 h-3 rounded-full bg-[#febc2e]"></div>
              <div className="w-3 h-3 rounded-full bg-[#28c840]"></div>
            </div>
            <div className="flex h-[400px]">
              {/* Sidebar Preview */}
              <div className="w-48 border-r p-4 hidden md:block">
                <div className="h-8 bg-[var(--foreground)] rounded mb-4"></div>
                <div className="space-y-2">
                  <div className="h-12 bg-[var(--muted)] rounded"></div>
                  <div className="h-12 bg-[var(--muted)] rounded"></div>
                </div>
              </div>
              {/* PDF Preview */}
              <div className="flex-1 bg-[var(--muted)] p-6">
                <div className="bg-white rounded shadow-lg h-full p-6">
                  <div className="h-6 w-48 bg-[var(--foreground)] rounded mb-2"></div>
                  <div className="h-3 w-32 bg-[var(--muted)] rounded mb-6"></div>
                  <div className="space-y-4">
                    <div className="h-4 w-24 bg-[var(--foreground)] rounded"></div>
                    <div className="h-3 w-full bg-[var(--muted)] rounded"></div>
                    <div className="h-3 w-full bg-[var(--muted)] rounded"></div>
                    <div className="h-3 w-3/4 bg-[var(--muted)] rounded"></div>
                  </div>
                </div>
              </div>
              {/* Chat Preview */}
              <div className="w-64 border-l p-4 hidden md:block">
                <div className="h-4 w-24 bg-[var(--foreground)] rounded mb-1"></div>
                <div className="h-3 w-32 bg-[var(--muted)] rounded mb-4"></div>
                <div className="space-y-3">
                  <div className="h-16 bg-[var(--muted)] rounded-lg"></div>
                  <div className="h-12 bg-[var(--foreground)] rounded-lg ml-auto w-3/4"></div>
                  <div className="h-20 bg-[var(--muted)] rounded-lg"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-6 bg-[var(--muted)]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-semibold mb-4">
              Everything you need to create PRDs
            </h2>
            <p className="text-muted max-w-xl mx-auto">
              A complete toolkit for product managers to document requirements efficiently.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl">
              <div className="w-12 h-12 rounded-xl bg-[var(--muted)] flex items-center justify-center mb-4">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
              </div>
              <h3 className="font-semibold text-lg mb-2">AI-Powered Chat</h3>
              <p className="text-sm text-muted">
                Describe your product idea in plain English. Claude AI asks the right questions and structures your PRD.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl">
              <div className="w-12 h-12 rounded-xl bg-[var(--muted)] flex items-center justify-center mb-4">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                </svg>
              </div>
              <h3 className="font-semibold text-lg mb-2">Live PDF Preview</h3>
              <p className="text-sm text-muted">
                Watch your PRD take shape in real-time. See exactly how it will look when exported.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl">
              <div className="w-12 h-12 rounded-xl bg-[var(--muted)] flex items-center justify-center mb-4">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 20h9"/>
                  <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
                </svg>
              </div>
              <h3 className="font-semibold text-lg mb-2">Smart Editing</h3>
              <p className="text-sm text-muted">
                AI understands context. Ask it to expand sections, add details, or restructure content.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl">
              <div className="w-12 h-12 rounded-xl bg-[var(--muted)] flex items-center justify-center mb-4">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                  <line x1="9" y1="3" x2="9" y2="21"/>
                </svg>
              </div>
              <h3 className="font-semibold text-lg mb-2">Organized Sidebar</h3>
              <p className="text-sm text-muted">
                All your PRDs in one place. Quick access, search, and manage your document library.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl">
              <div className="w-12 h-12 rounded-xl bg-[var(--muted)] flex items-center justify-center mb-4">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
                </svg>
              </div>
              <h3 className="font-semibold text-lg mb-2">Standard Format</h3>
              <p className="text-sm text-muted">
                PRDs follow industry-standard structure: objective, requirements, dependencies, acceptance criteria.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl">
              <div className="w-12 h-12 rounded-xl bg-[var(--muted)] flex items-center justify-center mb-4">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
              </div>
              <h3 className="font-semibold text-lg mb-2">Secure & Private</h3>
              <p className="text-sm text-muted">
                Your data stays yours. Bring your own API key or subscribe. Enterprise-grade security.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-semibold mb-4">
              Create a PRD in 3 steps
            </h2>
            <p className="text-muted">
              From idea to document in minutes.
            </p>
          </div>

          <div className="space-y-12">
            <div className="flex gap-6 items-start">
              <div className="w-12 h-12 rounded-full bg-[var(--foreground)] text-white flex items-center justify-center font-semibold shrink-0">
                1
              </div>
              <div>
                <h3 className="font-semibold text-xl mb-2">Describe your product</h3>
                <p className="text-muted">
                  Start a conversation with the AI. Explain your product idea in plain language -
                  what problem it solves, who it's for, and what it should do.
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="w-12 h-12 rounded-full bg-[var(--foreground)] text-white flex items-center justify-center font-semibold shrink-0">
                2
              </div>
              <div>
                <h3 className="font-semibold text-xl mb-2">Answer clarifying questions</h3>
                <p className="text-muted">
                  The AI guides you through essential details: functional requirements,
                  non-functional requirements, dependencies, and acceptance criteria.
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="w-12 h-12 rounded-full bg-[var(--foreground)] text-white flex items-center justify-center font-semibold shrink-0">
                3
              </div>
              <div>
                <h3 className="font-semibold text-xl mb-2">Export and share</h3>
                <p className="text-muted">
                  Your PRD is automatically formatted and ready to share.
                  Export as PDF or share directly with your team.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-6 bg-[var(--muted)]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-semibold mb-4">
              Simple, transparent pricing
            </h2>
            <p className="text-muted">
              Choose what works best for you.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {/* BYOK */}
            <div className="bg-white p-8 rounded-xl border">
              <h3 className="font-semibold text-xl mb-2">Bring Your Own Key</h3>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-4xl font-bold">Free</span>
              </div>
              <p className="text-sm text-muted mb-6">
                Use your own API key from OpenAI, Anthropic, or Google Gemini. You pay for usage directly.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3 text-sm">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-green-600 shrink-0">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  All features included
                </li>
                <li className="flex items-center gap-3 text-sm">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-green-600 shrink-0">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  Unlimited PRDs
                </li>
                <li className="flex items-center gap-3 text-sm">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-green-600 shrink-0">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  Pay-as-you-go AI usage
                </li>
                <li className="flex items-center gap-3 text-sm">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-green-600 shrink-0">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  Full control over costs
                </li>
              </ul>
              <Link href="/signup" className="btn btn-secondary w-full h-11">
                Get Started Free
              </Link>
            </div>

            {/* Pro */}
            <div className="bg-[var(--foreground)] text-white p-8 rounded-xl relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white text-[var(--foreground)] text-xs font-semibold px-3 py-1 rounded-full">
                MOST POPULAR
              </div>
              <h3 className="font-semibold text-xl mb-2">Pro</h3>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-4xl font-bold">₹99</span>
                <span className="text-white/60">/month</span>
              </div>
              <p className="text-sm text-white/70 mb-6">
                Unlimited AI access. No API key needed. Just create.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3 text-sm">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-green-400 shrink-0">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  Everything in Free
                </li>
                <li className="flex items-center gap-3 text-sm">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-green-400 shrink-0">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  Unlimited AI conversations
                </li>
                <li className="flex items-center gap-3 text-sm">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-green-400 shrink-0">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  No API key required
                </li>
                <li className="flex items-center gap-3 text-sm">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-green-400 shrink-0">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  Cancel anytime
                </li>
              </ul>
              <Link href="/signup" className="btn bg-white text-[var(--foreground)] hover:bg-gray-100 w-full h-11">
                Start
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-semibold mb-4">
            Ready to create better PRDs?
          </h2>
          <p className="text-muted mb-8">
            Join product managers who are shipping faster with AI-powered documentation.
          </p>
          <Link href="/signup" className="btn btn-primary h-12 px-8 text-base">
            Get Started for Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="logo text-lg">
              <span className="logo-bold">PRD</span>Guru
            </div>
            <div className="flex gap-6 text-sm text-muted">
              <a href="#features" className="hover:text-[var(--foreground)]">Features</a>
              <a href="#pricing" className="hover:text-[var(--foreground)]">Pricing</a>
              <a href="https://github.com/serverl0rd/PRDguru" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--foreground)]">GitHub</a>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t text-center text-sm text-muted">
            Built by{' '}
            <a href="https://serverlord.in" target="_blank" rel="noopener noreferrer" className="underline hover:text-[var(--foreground)]">
              ServerLord
            </a>
            {' '}(
            <a href="https://atharvakulkarni.link" target="_blank" rel="noopener noreferrer" className="underline hover:text-[var(--foreground)]">
              Atharva Kulkarni
            </a>
            )
          </div>
        </div>
      </footer>
    </div>
  );
}
