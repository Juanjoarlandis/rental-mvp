// src/pages/Login.tsx
import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { login as apiLogin } from '../features/auth/login';

import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa';
import SocialButton from '../components/ui/SocialButton';
import Container from '../components/shared/Container';
import toast from 'react-hot-toast';  

export default function Login() {
  const [user, setUser] = useState('');
  const [pwd, setPwd] = useState('');
  const [error, setError] = useState<string | null>(null);

  const { login: saveToken } = useAuth();
  const nav = useNavigate();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    try {
  const token = await apiLogin(user, pwd);
  saveToken(token);
  nav('/dashboard');
  toast.success('¡Bienvenido de nuevo!');            // 🆕
} catch {
  toast.error('Usuario o contraseña incorrectos');   // 🆕
}
  }

  return (
    <Container>
      <main className="flex min-h-[70vh] items-center justify-center">
        <div className="w-full max-w-md space-y-6 rounded-xl bg-white p-8 shadow-card">
          {/* Título */}
          <h1 className="text-center text-2xl font-bold">Iniciar sesión</h1>

          {/* Social login */}
          <div className="space-y-3">
            <SocialButton
              provider="google"
              icon={FcGoogle}
              label="Entrar con Google"
            />
            <SocialButton
              provider="github"
              icon={FaGithub}
              label="Entrar con GitHub"
            />
          </div>

          <div className="relative">
            <hr />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 bg-white px-2 text-xs text-gray-400">
              o continúa con tu cuenta
            </span>
          </div>

          {/* Form tradicional */}
          {error && <p className="text-center text-sm text-red-600">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              className="form-input w-full"
              placeholder="Usuario"
              value={user}
              onChange={e => setUser(e.target.value)}
              required
            />
            <input
              className="form-input w-full"
              type="password"
              placeholder="Contraseña"
              value={pwd}
              onChange={e => setPwd(e.target.value)}
              required
            />
            <button className="btn w-full">Entrar</button>
          </form>

          <p className="text-center text-xs text-gray-500">
            ¿No tienes cuenta?{' '}
            <a href="/register" className="font-medium text-brand hover:underline">
              Regístrate
            </a>
          </p>
        </div>
      </main>
    </Container>
  );
}
