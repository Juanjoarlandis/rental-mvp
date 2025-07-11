// src/components/layout/Header.tsx
import { Link, NavLink } from 'react-router-dom';
import logo from '../../assets/logo.png';
import { useAuth } from '../../hooks/useAuth';

export default function Header() {
  const { token, logout } = useAuth();

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur shadow-sm">
      {/* ↑ duplica el padding vertical para más “aire” */}
      <div className="container flex items-center gap-8 py-4 lg:py-6">
        {/* Logo */}
        <Link to="/" aria-label="Inicio" className="flex items-center">
          {/* será ≈96 px en desktop */}
          <img
            src={logo}
            alt="Logo Rental-MVP"
            className="h-14 md:h-20 lg:h-24 w-auto select-none"
            decoding="async"
          />
        </Link>

        {/* Navegación */}
        <nav className="ml-auto flex gap-8 text-base font-semibold text-gray-600">
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
