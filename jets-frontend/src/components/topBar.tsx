'use client';

import Image from 'next/image';
import Logo from 'public/logo.png';

export default function TopBar({ titulo }: { titulo: string }) {
  return (
    <header className="bg-[#000073] flex items-center justify-between px-4 py-3 shadow-md">
      <div className="flex items-center gap-3">
        <Image src={Logo} alt="Logo São José Jets" width={50} height={50} />
        <h1 className="text-white font-bold text-xl sm:text-2xl">{titulo}</h1>
      </div>
    </header>
  );
}