import Link from 'next/link';
import { useAuth } from '../context/AuthContext';

export function Navbar({ user }) {
  return (
    <header className="bg-gray-900 text-white p-4 flex justify-between items-center">
      <h1 className="text-2xl">PRD Guru</h1>
      {user ? <ProfileMenu user={user} /> : <LoginButton />}
    </header>
  );
}

function LoginButton() {
  return (
    <Link href="/login" className="btn btn-primary">
      Login
    </Link>
  );
}

function ProfileMenu({ user }) {
  const { logout } = useAuth();
  const avatarSrc = user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || user.email)}&background=random`;

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  return (
    <div className="dropdown">
      <button className="dropdown-trigger">
        <img src={avatarSrc} alt={user.displayName} className="avatar" />
      </button>
      <div className="dropdown-content">
        <div className="p-4">
          <p>{user.displayName}</p>
          <p>{user.email}</p>
          <button onClick={handleLogout} className="btn btn-secondary mt-4">
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
