'use client';

import { useState } from 'react';
import { api } from '@/utils/api';
import { format, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ModalEditarEvento } from './modalEditarEvento';

export type Evento = {
  id: number;
  titulo: string;
  data: string;
  tipo?: string;
  hora?: string;
  local?: string;
  descricao?: string;
};

type CalendarioProps = {
  eventos?: Evento[];
};

export default function Calendario({ eventos = [] }: CalendarioProps) {
  const [eventosState, setEventosState] = useState<Evento[]>(eventos);
  const [dataAtual] = useState(new Date());
  const [dataSelecionada, setDataSelecionada] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [eventoSelecionado, setEventoSelecionado] = useState<Evento | null>(null);

  const [formData, setFormData] = useState({
    titulo: '',
    data: '',
    tipo: '',
    hora: '',
    local: '',
    descricao: ''
  });

  const dias = eachDayOfInterval({
    start: startOfMonth(dataAtual),
    end: endOfMonth(dataAtual),
  });

  const diasComEvento = new Map(
    eventosState.map((e) => [e.data, e])
  );

  const nomesDias = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  const abrirDetalhes = (dataStr: string) => {
    const evento = diasComEvento.get(dataStr);
    if (evento) {
      setEventoSelecionado(evento);
      setFormData({
        titulo: evento.titulo,
        data: evento.data,
        tipo: evento.tipo || '',
        hora: evento.hora || '',
        local: evento.local || '',
        descricao: evento.descricao || ''
      });
      setShowModal(true);
    }
  };

  const salvarEdicao = async () => {
    if (!eventoSelecionado) return;
    try {
      const response = await api.put(`/eventos/${eventoSelecionado.id}`, formData);
      const atualizado = response.data;
      setEventosState((prev) =>
        prev.map((ev) => (ev.id === atualizado.id ? atualizado : ev))
      );
      setShowModal(false);
    } catch {
      alert('Erro ao atualizar evento');
    }
  };

  const excluirEvento = async () => {
    if (!eventoSelecionado) return;
    const confirmar = confirm('Deseja realmente excluir este evento?');
    if (!confirmar) return;

    try {
      await api.delete(`/eventos/${eventoSelecionado.id}`);
      setEventosState((prev) => prev.filter((ev) => ev.id !== eventoSelecionado.id));
      setShowModal(false);
    } catch {
      alert('Erro ao excluir evento');
    }
  };

  return (
    <div className="bg-white border-2 border-[#B78628] rounded-lg p-4 shadow">
      <h3 className="text-[#000073] font-bold text-lg mb-4">
        Calendário de {format(dataAtual, 'MMMM yyyy', { locale: ptBR })}
      </h3>

      <div className="grid grid-cols-7 gap-2 mb-2 text-center font-medium text-[#000073]">
        {nomesDias.map((dia, index) => (
          <div key={index}>{dia}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {dias.map((dia) => {
          const diaStr = format(dia, 'yyyy-MM-dd');
          const evento = diasComEvento.get(diaStr);
          const isSelecionado = dataSelecionada === diaStr;

          return (
            <div
              key={diaStr}
              onClick={() => abrirDetalhes(diaStr)}
              className={`cursor-pointer text-center p-2 rounded border transition-all duration-200
                ${evento ? 'bg-[#FCC201] text-white font-bold border-[#B78628]' : 'border-gray-200'}
                ${isSelecionado ? 'ring-2 ring-[#000073]' : ''}`}
            >
              {format(dia, 'd')}
            </div>
          );
        })}
      </div>

      <ModalEditarEvento
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSalvar={salvarEdicao}
        onExcluir={excluirEvento}
        formData={formData}
        setFormData={setFormData}
      />
    </div>
  );
}

