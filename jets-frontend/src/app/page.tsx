'use client';

import Link from 'next/link';
import Image from 'next/image';
import Logo from 'public/logo.png';
import TimeImage from 'public/tackle.png';

export default function HomePage() {
  return (
    <div className="bg-[#f9f9f9] font-sans min-h-screen">
      {/* Cabeçalho */}
      <header className="bg-[#000073] flex flex-col sm:flex-row justify-between items-center px-6 py-4 gap-4 sm:gap-0">
        <div className="flex justify-center sm:justify-start">
          <Image
            src={Logo}
            alt="Logo São José Jets"
            width={90}
            height={90}
            className="w-20 sm:w-24 h-auto"
          />
        </div>

        <nav className="flex flex-col sm:flex-row items-center gap-3">
          <Link
            href="/login"
            className="bg-white/10 text-white font-semibold px-4 py-2 rounded-md border border-white/30 hover:bg-white/20 hover:scale-[1.03] transition w-full sm:w-auto text-center"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="bg-[#B78628] text-white font-bold px-4 py-2 rounded-md hover:bg-[#C69320] transition w-full sm:w-auto text-center"
          >
            Seja um Torcedor
          </Link>
        </nav>
      </header>

      {/* Conteúdo principal */}
      <main className="text-center px-6 py-12">
        <div className="flex justify-center mb-8">
          <Image
            src={TimeImage}
            alt="Time São José Jets"
            width={400}
            height={150}
            className="w-full max-w-[400px] h-auto"
          />
        </div>

        <h4 className="text-2xl sm:text-3xl font-bold text-[#000073] mb-4">
          Bem-vindo ao time!
        </h4>
        <p className="text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
          Somos o São José Jets, equipe de futebol americano com paixão pela vitória e pelo esporte.
          Aqui você pode acompanhar nossos atletas, resultados e se tornar um sócio torcedor.
        </p>
      </main>
    </div>
  );
}
