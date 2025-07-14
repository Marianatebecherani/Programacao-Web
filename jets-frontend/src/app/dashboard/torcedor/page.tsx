'use client';

import TopBar from '@/components/topBar';
import Card from '@/components/card';
import { useUsuarioAutenticado } from '@/hooks/useUsuarioAutenticado';

export default function TorcedorDashboard() {
  const { usuario, carregando } = useUsuarioAutenticado('TORCEDOR');

  if (carregando || !usuario) return <p>Carregando...</p>;

  return (
    <div className="min-h-screen bg-[#f9f9fb]">
      <TopBar titulo={`Bem-vindo, ${usuario.nome}`} />
      <main className="max-w-5xl mx-auto p-6 mt-10 grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Card titulo="Ingressos" descricao="Compre entradas para os jogos." />
        <Card titulo="Loja Oficial" descricao="Produtos exclusivos para fãs." />
        <Card titulo="Eventos" descricao="Participe das ações do time." />
        <Card titulo="Transparência" descricao="Acompanhe as finanças do clube." />
      </main>
    </div>
  );
}