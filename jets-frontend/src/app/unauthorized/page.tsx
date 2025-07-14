'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import TopBar from '@/components/topBar';

export default function Unauthorized() {
  const router = useRouter();
  useEffect(() => {
    const timer = setTimeout(() => router.push('/login'), 3000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-[#f9f9fb]">
      <TopBar titulo="Acesso Negado" />
      <div className="text-center mt-20">
        <p className="text-2xl text-[#B78628] font-semibold">Você não tem permissão para acessar essa página.</p>
        <p className="text-gray-600 mt-2">Redirecionando para o login...</p>
      </div>
    </div>
  );
}
