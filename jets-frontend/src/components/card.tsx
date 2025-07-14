'use client';

import Link from 'next/link';

type CardProps = {
  titulo: string;
  descricao: string;
  link?: string; // <-- Adicionado
};

export default function Card({ titulo, descricao, link }: CardProps) {
  const content = (
    <div className="p-4 bg-white border-2 border-[#B78628] rounded-2xl shadow-md hover:shadow-lg transition cursor-pointer">
      <h3 className="text-lg font-bold text-[#000073] mb-2">{titulo}</h3>
      <p className="text-sm text-gray-700">{descricao}</p>
    </div>
  );

  return link ? <Link href={link}>{content}</Link> : content;
}