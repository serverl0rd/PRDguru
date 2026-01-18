import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      router.push('/app');
    } catch (err) {
      setError(err.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="border-b h-16 flex items-center px-6">
        <Link href="/" className="logo">
          <span className="logo-bold">PRD</span>Guru
        </Link>
      </nav>

      {/* Login Form */}
      <main className="flex-1 flex items-center justify-center px-6">
        <div className="card w-full max-w-md">
          <div className="card-header">
            <h1 className="text-2xl font-semibold text-center">
              Welcome back
            </h1>
            <p className="text-muted text-center text-sm mt-1">
              Sign in to continue to PRD Guru
            </p>
          </div>

          <div className="card-content">
            {error && (
              <div className="bg-[#fee2e2] text-[#dc2626] p-3 rounded-[var(--radius)] mb-4 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input"
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input"
                  placeholder="Enter your password"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary w-full"
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </form>
          </div>

          <div className="card-footer">
            <p className="text-muted text-center text-sm">
              Don&apos;t have an account?{' '}
              <Link href="/signup" className="text-[var(--foreground)] font-medium hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
