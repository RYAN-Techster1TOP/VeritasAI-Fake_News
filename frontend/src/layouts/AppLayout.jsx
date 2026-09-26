import { Link, NavLink, Outlet } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

const linkClass = ({ isActive }) =>
  `text-sm transition ${isActive ? 'text-white' : 'text-ink-300 hover:text-white'}`;

export default function AppLayout() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-20 border-b border-white/10 bg-[#101925]/80 backdrop-blur-lg">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <Link to="/" className="flex items-center gap-2 font-display text-xl font-semibold tracking-tight">
            <ShieldCheck className="h-6 w-6 text-ink-300" />
            VeritasAI
          </Link>
          <nav className="flex items-center gap-5">
            {user ? (
              <>
                <NavLink to="/dashboard" className={linkClass}>
                  Dashboard
                </NavLink>
                <NavLink to="/analyze" className={linkClass}>
                  Analyze
                </NavLink>
                <NavLink to="/history" className={linkClass}>
                  History
                </NavLink>
                <button
                  type="button"
                  onClick={logout}
                  className="rounded-lg border border-white/15 px-3 py-1.5 text-sm text-ink-200 hover:bg-white/5"
                >
                  Log out
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login" className={linkClass}>
                  Login
                </NavLink>
                <Link to="/register" className="btn-primary text-sm">
                  Get started
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
