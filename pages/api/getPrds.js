import { useAuth } from '../context/AuthContext';
import Sidebar from './Sidebar';
import { Navbar } from './Navbar';
import { Fragment } from 'react';

export default function Layout({ children }) {
  const { user } = useAuth();

  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 flex flex-col">
        <Navbar user={user} />
        <div className="p-6 flex-1 overflow-auto">
          {children}
        </div>
      </main>
    </div>
  );
}