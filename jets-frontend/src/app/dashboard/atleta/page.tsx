'use client';

import TopBar from '@/components/topBar';
import Card from '@/components/card';
import { useUsuarioAutenticado } from '@/hooks/useUsuarioAutenticado';

export default function AtletaDashboard() {
  const { usuario, carregando } = useUsuarioAutenticado('ATLETA');

  if (carregando || !usuario) return <p>Carregando...</p>;

  return (
    <div className="min-h-screen bg-[#f9f9fb]">
      <TopBar titulo={`Bem-vindo, ${usuario.nome}`} />
      <main className="max-w-5xl mx-auto p-6 mt-10 grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Card titulo="Treinos" descricao="Visualize seus treinos e compromissos." />
        <Card titulo="Jogos" descricao="Confira a agenda de partidas." />
        <Card titulo="Loja" descricao="Acesse produtos exclusivos do time." />
        <Card titulo="Finanças" descricao="Veja o histórico financeiro." />
      </main>
    </div>
  );
}

