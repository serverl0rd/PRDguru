import { Avatar, Dropdown, Button } from '@shadcn/ui';
import Link from 'next/link';

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
    <Link href="/api/login">
      <a className="btn btn-primary">Login</a>
    </Link>
  );
}

export function ProfileMenu({ user }) {
  return (
    <Dropdown>
      <Dropdown.Trigger>
        <Avatar src={user.photoURL} />
      </Dropdown.Trigger>
      <Dropdown.Content>
        <div className="p-4">
          <p>{user.displayName}</p>
          <p>{user.email}</p>
          <Link href="/api/logout">
            <a className="btn btn-secondary mt-4">Logout</a>
          </Link>
        </div>
      </Dropdown.Content>
    </Dropdown>
  );
}