'use client';

import TopBar from '@/components/topBar';
import Card from '@/components/card';
import { useUsuarioAutenticado } from '@/hooks/useUsuarioAutenticado';

export default function FuncionarioDashboard() {
  const { usuario, carregando } = useUsuarioAutenticado('FUNCIONARIO');

  if (carregando || !usuario) return <p>Carregando...</p>;

  return (
    <div className="min-h-screen bg-[#f9f9fb]">
      <TopBar titulo={`Bem-vindo, ${usuario.nome}`} />
      <main className="max-w-5xl mx-auto p-6 mt-10 grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Card titulo="Tarefas" descricao="Gerencie eventos, atletas e recursos." />
        <Card titulo="Calendário" descricao="Controle datas importantes do time." />
        <Card titulo="Finanças" descricao="Acompanhe o fluxo financeiro do clube." />
        <Card titulo="Loja" descricao="Atualize o catálogo de produtos." />
      </main>
    </div>
  );
}

