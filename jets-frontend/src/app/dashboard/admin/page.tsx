'use client';

import { useUsuarioAutenticado } from '@/hooks/useUsuarioAutenticado';
import TopBar from '@/components/topBar';
import Sidebar from '@/components/sideBar';
import Calendario from '@/components/calendario';
import Card from '@/components/card';
import { useState, useEffect } from 'react';
import { api } from '@/utils/api';

export default function AdminDashboard() {
  const { usuario, carregando } = useUsuarioAutenticado('ADMIN');
  const [eventos, setEventos] = useState([]);

  useEffect(() => {
    api.get('/eventos')
      .then(res => setEventos(res.data))
      .catch(() => alert('Erro ao carregar eventos'));
  }, []);

  if (carregando || !usuario) return <p>Carregando...</p>;

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 p-6 bg-[#f9f9fb]">
        <TopBar titulo={`Painel do Administrador - ${usuario.nome}`} />

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card titulo="Gerenciar Atletas" descricao="Adicione, edite ou remova jogadores do elenco." link="/admin/atletas" />
          <Card titulo="Funcionários" descricao="Controle a equipe de apoio e administração." link="/admin/funcionarios" />
          <Card titulo="Torcedores" descricao="Visualize ou gerencie os sócio-torcedores." link="/admin/torcedores" />
          <Card titulo="Calendário" descricao="Adicione ou edite treinos, jogos e reuniões." link="/admin/eventos" />
          <Card titulo="Loja do Time" descricao="Gerencie os produtos disponíveis para venda." link="/admin/produtos" />
          <Card titulo="Transparência" descricao="Acompanhe entradas e saídas financeiras." link="/admin/financas" />
        </div>

        <h2 className="text-xl font-semibold mt-10 mb-4 text-[#000073]">Calendário Geral</h2>
        <Calendario eventos={eventos} />
      </div>
    </div>
  );
}
