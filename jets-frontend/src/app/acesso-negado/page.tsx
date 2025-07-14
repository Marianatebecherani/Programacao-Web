'use client';

import Link from 'next/link';

export default function AcessoNegado() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f9f9fb]">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-red-600 mb-4">Acesso Negado</h1>
        <p className="text-gray-700 mb-6">Você não tem permissão para acessar esta página.</p>
        <Link href="/" className="text-blue-600 underline">Voltar para a Home</Link>
      </div>
    </div>
  );
}
