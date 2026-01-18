import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="border-b h-16 flex items-center px-6 justify-between">
        <div className="logo">
          <span className="logo-bold">PRD</span>Guru
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
      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        <h1 className="text-5xl font-semibold tracking-tight mb-4">
          Create PRDs with AI
        </h1>
        <p className="text-xl text-muted max-w-xl mb-8">
          Transform your product ideas into professional requirement documents through conversation.
          Version control included.
        </p>
        <div className="flex gap-4">
          <Link href="/signup" className="btn btn-primary h-12 px-8 text-base">
            Start Free
          </Link>
          <Link href="/login" className="btn btn-secondary h-12 px-8 text-base">
            Sign In
          </Link>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 max-w-4xl">
          <div className="text-left">
            <div className="w-10 h-10 rounded-lg bg-[var(--muted)] flex items-center justify-center mb-4">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
            </div>
            <h3 className="font-semibold mb-2">Chat-Based Creation</h3>
            <p className="text-sm text-muted">
              Describe your product idea and let AI guide you through creating comprehensive PRDs.
            </p>
          </div>
          <div className="text-left">
            <div className="w-10 h-10 rounded-lg bg-[var(--muted)] flex items-center justify-center mb-4">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
              </svg>
            </div>
            <h3 className="font-semibold mb-2">Live PDF Preview</h3>
            <p className="text-sm text-muted">
              See your PRD rendered as a professional PDF document in real-time as you build it.
            </p>
          </div>
          <div className="text-left">
            <div className="w-10 h-10 rounded-lg bg-[var(--muted)] flex items-center justify-center mb-4">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="3"/>
                <path d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
              </svg>
            </div>
            <h3 className="font-semibold mb-2">Version History</h3>
            <p className="text-sm text-muted">
              Every change is automatically versioned. Browse and restore previous versions anytime.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t py-6 px-6 text-center text-sm text-muted">
        Built with Next.js and Claude AI
      </footer>
    </div>
  );
}
