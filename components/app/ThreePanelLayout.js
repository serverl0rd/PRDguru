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
              <button onClick={handleLogout} className="btn btn-secondary w-full mt-3 h-9">
                Sign out
              </button>
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
    </div>
  );
}
