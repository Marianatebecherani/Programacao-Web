'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Logo from 'public/logo.png';
import { jwtDecode } from 'jwt-decode';



type Payload = {
  tipo: 'ADMIN' | 'ATLETA' | 'FUNCIONARIO' | 'TORCEDOR';
};

export default function DashboardHub() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.replace('/login');
      return;
    }

    try {
      const decodificar = jwtDecode(token);
      const tipo = (decodificar as Payload).tipo;

      const destino = {
        ADMIN: '/dashboard/admin',
        ATLETA: '/dashboard/atleta',
        FUNCIONARIO: '/dashboard/funcionario',
        TORCEDOR: '/dashboard/torcedor',
      }[tipo];
      
      router.replace(destino ?? '/login');
    } catch (error) {
      console.error('Erro ao decodificar token:', error);
      router.replace('/login');
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#f9f9fb] flex flex-col items-center justify-center">
      {/* Cabeçalho com faixa azul e logo */}
      <header className="fixed top-0 left-0 w-full bg-[#000073] flex items-center justify-between px-6 py-4 shadow z-10">
        <div className="flex items-center gap-4">
          <Image src={Logo} alt="Logo São José Jets" width={50} height={50} />
          <h1 className="text-white font-bold text-xl sm:text-2xl">
            São José Jets
          </h1>
        </div>
      </header>

      {/* Conteúdo central */}
      <main className="mt-32 text-center">
        <div className="inline-block border-4 border-[#B78628] px-6 py-8 rounded-2xl shadow-md bg-white">
          <p className="text-[#000073] text-xl font-semibold mb-4">
            Redirecionando para seu painel personalizado...
          </p>
          <div className="h-1 w-48 mx-auto bg-[#B78628] rounded-full animate-pulse" />
        </div>
      </main>
    </div>
  );
}
