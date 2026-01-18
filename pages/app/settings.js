import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import AuthGate from '../../components/auth/AuthGate';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../supabase';

export default function SettingsPage() {
  return (
    <AuthGate>
      <SettingsContent />
    </AuthGate>
  );
}

function SettingsContent() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [apiKey, setApiKey] = useState('');
  const [hasApiKey, setHasApiKey] = useState(false);
  const [maskedKey, setMaskedKey] = useState('');
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchSettings();

    // Check for success/cancel from Stripe
    if (router.query.success) {
      setMessage('Subscription activated successfully!');
      fetchSettings();
    } else if (router.query.canceled) {
      setMessage('Checkout was canceled.');
    }
  }, [router.query]);

  const fetchSettings = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const headers = { 'Authorization': `Bearer ${session.access_token}` };

      // Fetch API key status
      const settingsRes = await fetch('/api/user/settings', { headers });
      const settingsData = await settingsRes.json();
      setHasApiKey(settingsData.hasApiKey);
      setMaskedKey(settingsData.maskedKey);

      // Fetch subscription status
      const subRes = await fetch('/api/user/subscription', { headers });
      const subData = await subRes.json();
      setSubscription(subData);

    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveApiKey = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      const { data: { session } } = await supabase.auth.getSession();

      const response = await fetch('/api/user/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({ apiKey })
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('API key saved successfully!');
        setApiKey('');
        fetchSettings();
      } else {
        setMessage(data.error || 'Failed to save API key');
      }
    } catch (error) {
      setMessage('Failed to save API key');
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveApiKey = async () => {
    if (!confirm('Are you sure you want to remove your API key?')) return;

    setSaving(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();

      const response = await fetch('/api/user/settings', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      });

      if (response.ok) {
        setMessage('API key removed');
        fetchSettings();
      }
    } catch (error) {
      setMessage('Failed to remove API key');
    } finally {
      setSaving(false);
    }
  };

  const handleSubscribe = async () => {
    setSaving(true);
    setMessage('');

    try {
      const { data: { session } } = await supabase.auth.getSession();

      const response = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        setMessage(data.error || 'Failed to start checkout');
        setSaving(false);
      }
    } catch (error) {
      setMessage('Failed to start checkout');
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const avatarSrc = user?.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.displayName || user?.email || 'U')}&background=0a0a0a&color=fff`;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="border-b h-14 flex items-center px-4 justify-between shrink-0">
        <Link href="/app" className="logo text-lg">
          <span className="logo-bold">PRD</span>Guru
        </Link>
        <div className="dropdown">
          <button className="flex items-center gap-2">
            <img src={avatarSrc} alt={user?.displayName || 'User'} className="avatar w-8 h-8" />
          </button>
          <div className="dropdown-content">
            <div className="p-4">
              <p className="font-medium text-sm">{user?.displayName}</p>
              <p className="text-sm text-muted truncate">{user?.email}</p>
              <button onClick={handleLogout} className="btn btn-secondary w-full mt-3 h-9">
                Sign out
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="flex-1 p-8 max-w-2xl mx-auto w-full">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/app" className="btn btn-ghost h-9 px-3">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
          </Link>
          <h1 className="text-2xl font-semibold">Settings</h1>
        </div>

        {message && (
          <div className={`p-4 rounded-[var(--radius)] mb-6 text-sm ${
            message.includes('success') || message.includes('saved') || message.includes('activated')
              ? 'bg-green-50 text-green-800'
              : 'bg-amber-50 text-amber-800'
          }`}>
            {message}
          </div>
        )}

        {loading ? (
          <div className="text-muted">Loading...</div>
        ) : (
          <div className="space-y-8">
            {/* Subscription Status */}
            <div className="card">
              <div className="card-header">
                <h2 className="text-lg font-semibold">Subscription</h2>
              </div>
              <div className="card-content">
                {subscription?.isSubscribed ? (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-2 h-2 rounded-full bg-green-500"></span>
                      <span className="font-medium">Pro Plan Active</span>
                    </div>
                    <p className="text-sm text-muted">
                      Your subscription renews on {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
                    </p>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm text-muted mb-4">
                      Get unlimited AI-powered PRD creation for <strong>$9/month</strong>
                    </p>
                    <ul className="text-sm space-y-2 mb-4">
                      <li className="flex items-center gap-2">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-green-600">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                        Unlimited AI conversations
                      </li>
                      <li className="flex items-center gap-2">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-green-600">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                        Powered by Claude AI
                      </li>
                      <li className="flex items-center gap-2">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-green-600">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                        Cancel anytime
                      </li>
                    </ul>
                    <button
                      onClick={handleSubscribe}
                      disabled={saving}
                      className="btn btn-primary"
                    >
                      {saving ? 'Loading...' : 'Subscribe for $9/month'}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* API Key Section */}
            <div className="card">
              <div className="card-header">
                <h2 className="text-lg font-semibold">Bring Your Own API Key</h2>
                <p className="text-sm text-muted mt-1">
                  Use your own Anthropic API key instead of subscribing
                </p>
              </div>
              <div className="card-content">
                {hasApiKey ? (
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <span className="w-2 h-2 rounded-full bg-green-500"></span>
                      <span className="text-sm">API key configured: <code className="bg-[var(--muted)] px-2 py-1 rounded">{maskedKey}</code></span>
                    </div>
                    <button
                      onClick={handleRemoveApiKey}
                      disabled={saving}
                      className="btn btn-secondary text-red-600"
                    >
                      Remove API Key
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSaveApiKey}>
                    <p className="text-sm text-muted mb-4">
                      Get your API key from{' '}
                      <a href="https://console.anthropic.com" target="_blank" rel="noopener noreferrer" className="underline">
                        console.anthropic.com
                      </a>
                    </p>
                    <div className="flex gap-2">
                      <input
                        type="password"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        placeholder="sk-ant-..."
                        className="input flex-1"
                        required
                      />
                      <button
                        type="submit"
                        disabled={saving || !apiKey}
                        className="btn btn-primary"
                      >
                        {saving ? 'Saving...' : 'Save'}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>

            {/* Account Info */}
            <div className="card">
              <div className="card-header">
                <h2 className="text-lg font-semibold">Account</h2>
              </div>
              <div className="card-content">
                <div className="space-y-2 text-sm">
                  <p><span className="text-muted">Email:</span> {user?.email}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
