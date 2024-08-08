import { useAuth } from "../context/AuthContext";
import Sidebar from "./Sidebar";
import Link from "next/link";

export default function Layout({ children }) {
  const { user, login, logout } = useAuth();

  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 p-4">
        <header className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">PRD Maker</h1>
          <div>
            {user ? (
              <>
                <button onClick={logout} className="px-4 py-2">Logout</button>
              </>
            ) : (
              <button onClick={login} className="px-4 py-2">Login with Google</button>
            )}
          </div>
        </header>
        {children}
      </main>
    </div>
  );
}