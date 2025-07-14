'use client';

import Link from 'next/link';
import Image from 'next/image';
import Logo from 'public/logo.png';

export default function CadastroSucesso() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Faixa azul com logo */}
      <header className="bg-[#000073] flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <Image src={Logo} alt="Logo São José Jets" width={60} height={60} />
          <h1 className="text-white font-bold text-xl sm:text-2xl">Cadastro Realizado</h1>
        </div>
      </header>

      {/* Conteúdo */}
      <div className="max-w-md mx-auto mt-20 bg-white p-6 rounded-lg shadow-lg border-2 border-[#000073] text-center">
        <h2 className="text-2xl font-bold text-[#000073] mb-4">🎉 Cadastro realizado com sucesso!</h2>
        <p className="text-lg mb-6">
          Agora você já pode acessar sua conta como torcedor do São José Jets.
        </p>
        <Link
          href="/login"
          className="inline-block bg-[#B78628] hover:bg-[#C69320] text-white font-bold py-2 px-6 rounded transition"
        >
          Fazer Login
        </Link>
      </div>
    </div>
  );
}
