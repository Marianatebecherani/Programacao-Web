'use client';

import { useEffect, useState } from 'react';
import { api } from '@/utils/api';
import Calendario, { Evento } from '@/components/calendario';
import TopBar from '@/components/topBar';
import Sidebar from '@/components/sideBar';
import Card from '@/components/card';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

export default function EventosPage() {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [form, setForm] = useState({ titulo: '', tipo: '', data: '', hora: '', local: '', descricao: '' });
  const [tipoFiltro, setTipoFiltro] = useState('');
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');

  const fetchEventos = async () => {
    const res = await api.get('/eventos');
    setEventos(res.data);
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchEventos();
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/eventos', form);
      setForm({ titulo: '', tipo: '', data: '', hora: '', local: '', descricao: '' });
      fetchEventos();
    } catch {
      alert('Erro ao criar evento');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/eventos/${id}`);
      fetchEventos();
    } catch {
      alert('Erro ao excluir evento');
    }
  };

  const eventosFiltrados = eventos.filter((evento) => {
    const dataEvento = new Date(evento.data);
    const dentroDoTipo = tipoFiltro ? evento.tipo === tipoFiltro : true;
    const depoisInicio = dataInicio ? dataEvento >= new Date(dataInicio) : true;
    const antesFim = dataFim ? dataEvento <= new Date(dataFim) : true;
    return dentroDoTipo && depoisInicio && antesFim;
  });

  const exportarParaPDF = () => {
    const doc = new jsPDF();
    const data = eventosFiltrados.map((e) => [e.titulo, e.tipo, e.data, e.hora, e.local]);
    autoTable(doc, {
      head: [['Título', 'Tipo', 'Data', 'Hora', 'Local']],
      body: data,
    });
    doc.save('eventos.pdf');
  };

  const exportarParaExcel = () => {
    const data = eventosFiltrados.map((e) => ({
      Título: e.titulo,
      Tipo: e.tipo,
      Data: e.data,
      Hora: e.hora,
      Local: e.local,
    }));
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Eventos');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const file = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(file, 'eventos.xlsx');
  };

  const eventosParaCalendario: Evento[] = eventosFiltrados.map((e) => ({
    id: e.id,
    data: e.data,
    titulo: `${e.tipo}: ${e.titulo}`,
  }));

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <div className="flex-1">
        <TopBar titulo="Eventos" />

        <div className="max-w-6xl mx-auto mt-8 bg-white p-6 sm:p-8 rounded-lg border-2 border-[#000073] shadow">
          <h2 className="text-2xl font-bold text-[#000073] text-center mb-6">📅 Criar Novo Evento</h2>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
            <select value={tipoFiltro} onChange={(e) => setTipoFiltro(e.target.value)} className="p-2 border border-gray-300 rounded">
              <option value="">Todos os Tipos</option>
              <option value="JOGO">Jogo</option>
              <option value="TREINO">Treino</option>
              <option value="REUNIAO">Reunião</option>
            </select>
            <input type="date" value={dataInicio} onChange={(e) => setDataInicio(e.target.value)} className="p-2 border border-gray-300 rounded" />
            <input type="date" value={dataFim} onChange={(e) => setDataFim(e.target.value)} className="p-2 border border-gray-300 rounded" />
            <div className="flex gap-2">
              <button onClick={exportarParaPDF} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-3 rounded text-sm">Exportar PDF</button>
              <button onClick={exportarParaExcel} className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-3 rounded text-sm">Exportar Excel</button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
            <input type="text" placeholder="Título" value={form.titulo} onChange={(e) => setForm({ ...form, titulo: e.target.value })} required className="p-2 border border-gray-300 rounded" />
            <select value={form.tipo} onChange={(e) => setForm({ ...form, tipo: e.target.value })} required className="p-2 border border-gray-300 rounded">
              <option value="">Tipo</option>
              <option value="JOGO">Jogo</option>
              <option value="TREINO">Treino</option>
              <option value="REUNIAO">Reunião</option>
            </select>
            <input type="date" value={form.data} onChange={(e) => setForm({ ...form, data: e.target.value })} required className="p-2 border border-gray-300 rounded" />
            <input type="time" value={form.hora} onChange={(e) => setForm({ ...form, hora: e.target.value })} required className="p-2 border border-gray-300 rounded" />
            <input type="text" placeholder="Local" value={form.local} onChange={(e) => setForm({ ...form, local: e.target.value })} required className="p-2 border border-gray-300 rounded" />
            <input type="text" placeholder="Descrição" value={form.descricao} onChange={(e) => setForm({ ...form, descricao: e.target.value })} className="p-2 border border-gray-300 rounded col-span-1 sm:col-span-2" />
            <button type="submit" className="bg-[#B78628] hover:bg-[#C69320] text-white font-bold py-2 px-4 rounded col-span-1 sm:col-span-2">Salvar Evento</button>
          </form>

          <Calendario eventos={eventosParaCalendario} />

          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-4">
            {eventosFiltrados.map((evento) => (
              <Card key={evento.id} titulo={evento.titulo} subtitulo={`${evento.tipo} - ${evento.data} às ${evento.hora}`}>
                <p className="text-sm text-gray-600 mb-2">{evento.descricao}</p>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-medium text-gray-500">Local: {evento.local}</span>
                  <button onClick={() => handleDelete(evento.id)} className="text-red-600 hover:underline text-sm">Excluir</button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
