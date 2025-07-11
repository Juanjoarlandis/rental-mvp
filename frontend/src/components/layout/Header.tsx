// src/components/layout/Header.tsx
import { Link, NavLink } from 'react-router-dom';
import { Disclosure } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import logo from '../../assets/logo.png';
import { useAuth } from '../../hooks/useAuth';

export default function Header() {
  const { token, logout } = useAuth();

  const links = token
    ? [
        { to: '/dashboard', label: 'Dashboard' },
        { label: 'Salir', action: logout }
      ]
    : [{ to: '/login', label: 'Login' }];

  return (
    <Disclosure
      as="header"
      className="
        sticky top-0 z-40 w-full border-b bg-white/80
        backdrop-blur shadow-sm supports-backdrop-blur:bg-white/60
      "
    >
      {({ open }) => (
        <>
          {/* ----------------------- Barra principal ----------------------- */}
          <div className="container mx-auto flex items-center justify-between py-4 md:py-5">
            {/* ---------- Logo (aún más grande) ---------- */}
            <Link to="/" aria-label="Inicio" className="flex items-center gap-2">
              <img
                src={logo}
                alt="Logo Rental-MVP"
                className="h-16 w-auto select-none md:h-20 lg:h-26" /* antes: 12-16-20 */
                decoding="async"
              />
              <span className="sr-only">Rental-MVP</span>
            </Link>

            {/* ---------- Navegación desktop ---------- */}
            <nav className="hidden gap-10 text-base font-semibold text-gray-700 md:flex">
              {links.map(({ to, label, action }) =>
                action ? (
                  <button
                    key={label}
                    onClick={action}
                    className="transition-colors hover:text-brand"
                  >
                    {label}
                  </button>
                ) : (
                  <NavLink
                    key={label}
                    to={to!}
                    className={({ isActive }) =>
                      `transition-colors hover:text-brand ${
                        isActive ? 'text-brand' : ''
                      }`
                    }
                  >
                    {label}
                  </NavLink>
                )
              )}
            </nav>

            {/* ---------- Botón hamburguesa (más grande) ---------- */}
            <Disclosure.Button
              className="rounded-md p-2 text-gray-700 hover:bg-gray-100 focus:outline-none md:hidden"
              aria-label="Abrir menú"
            >
              {open ? (
                <XMarkIcon className="h-10 w-10" />   
              ) : (
                <Bars3Icon className="h-10 w-10" />  
              )}
            </Disclosure.Button>
          </div>

          {/* ----------------------- Panel móvil ------------------------- */}
          <Disclosure.Panel className="border-t bg-white/95 backdrop-blur md:hidden">
            <nav className="container mx-auto flex flex-col gap-5 py-5 text-base font-medium text-gray-700">
              {links.map(({ to, label, action }) =>
                action ? (
                  <button
                    key={label}
                    onClick={action}
                    className="text-left transition-colors hover:text-brand"
                  >
                    {label}
                  </button>
                ) : (
                  <NavLink
                    key={label}
                    to={to!}
                    className={({ isActive }) =>
                      `transition-colors hover:text-brand ${
                        isActive ? 'text-brand' : ''
                      }`
                    }
                  >
                    {label}
                  </NavLink>
                )
              )}
            </nav>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
