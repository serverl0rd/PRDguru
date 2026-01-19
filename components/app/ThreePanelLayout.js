import { useAuth } from '../../context/AuthContext';
import PRDSidebar from './PRDSidebar';
import PDFPreview from './PDFPreview';
import ChatInterface from '../chat/ChatInterface';
import Link from 'next/link';

export default function ThreePanelLayout() {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  const avatarSrc = user?.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.displayName || user?.email || 'U')}&background=0a0a0a&color=fff`;

  return (
    <div className="h-screen flex flex-col">
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
              <div className="mt-3 space-y-2">
                <Link href="/app/settings" className="btn btn-ghost w-full h-9 justify-start">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-2">
                    <circle cx="12" cy="12" r="3"/>
                    <path d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
                  </svg>
                  Settings
                </Link>
                <button onClick={handleLogout} className="btn btn-secondary w-full h-9">
                  Sign out
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Three Panels */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - PRD List */}
        <div className="w-[250px] panel shrink-0">
          <PRDSidebar />
        </div>

        {/* Center - PDF Preview */}
        <div className="flex-1 panel overflow-hidden">
          <PDFPreview />
        </div>

        {/* Right - Chat Interface */}
        <div className="w-[350px] shrink-0">
          <ChatInterface />
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t h-10 flex items-center justify-center px-4 shrink-0 text-xs text-muted">
        <span>
          Built by{' '}
          <a href="https://serverlord.in" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground">
            ServerLord
          </a>
          {' '}(
          <a href="https://atharvakulkarni.link" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground">
            Atharva Kulkarni
          </a>
          )
        </span>
      </footer>
    </div>
  );
}
