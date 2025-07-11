import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Bars3Icon } from '@heroicons/react/24/outline';

export default function Header() {
  const { token, logout } = useAuth();
  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur shadow-sm">
      <div className="container flex h-14 items-center gap-6">
        <Link to="/" className="flex items-center gap-1 text-lg font-bold text-brand">
          <Bars3Icon className="h-6 w-6" />
          Rental‑MVP
        </Link>

        <nav className="ml-auto flex gap-6 text-sm font-semibold text-gray-600">
          {token ? (
            <>
              <NavLink to="/dashboard" className="hover:text-gray-900">
                Dashboard
              </NavLink>
              <button onClick={logout} className="hover:text-gray-900">
                Salir
              </button>
            </>
          ) : (
            <NavLink to="/login" className="hover:text-gray-900">
              Login
            </NavLink>
          )}
        </nav>
      </div>
    </header>
  );
}
