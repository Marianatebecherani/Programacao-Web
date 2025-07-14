'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/utils/api';
import Image from 'next/image';
import Logo from 'public/logo.png';
import Link from 'next/link';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.post('/auth/login', { username, password });
      const { token, tipo } = response.data;

      localStorage.setItem('token', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      if (tipo === '0') {
        router.push('/dashboard/admin');
      } else if (tipo === '1') {
        router.push('/dashboard/torcedor');
      } else {
        router.push('/dashboard');
      }
    } catch {
      alert('Usuário ou senha inválidos.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Faixa azul com logo */}
      <header className="bg-[#000073] flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <Image src={Logo} alt="Logo São José Jets" width={60} height={60} />
          <h1 className="text-white font-bold text-xl sm:text-2xl">Login</h1>
        </div>
      </header>

      <div className="max-w-sm mx-auto mt-12 bg-white p-6 rounded-lg shadow-md border-2 border-[#000073]">
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Usuário"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="p-3 border border-gray-300 rounded"
          />
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="p-3 border border-gray-300 rounded"
          />
          <p className="text-sm text-right text-blue-700 hover:underline">
            <Link href="/recuperar-senha">Esqueceu sua senha?</Link>
          </p>

          <button
            type="submit"
            className="bg-[#B78628] hover:bg-[#C69320] text-white font-bold py-3 rounded"
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}

