'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/utils/api';
import Image from 'next/image';
import Logo from 'public/logo.png';

interface Atleta {
  id: string;
  nome: string;
  numero: number;
  posicao: string;
  email: string;
  status: string;
  imagemUrl?: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [atletas, setAtletas] = useState<Atleta[]>([]);
  const [form, setForm] = useState({
    nome: '',
    numero: 0,
    posicao: '',
    email: '',
    imagem: null as File | null,
  });
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [status, setStatus] = useState('A');

  const fetchAtletas = async () => {
    try {
      const res = await api.get('/atletas');
      setAtletas(res.data);
    } catch {
      alert('Erro ao carregar atletas');
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return router.push('/login');
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    fetchAtletas();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData();
    data.append('nome', form.nome);
    data.append('numero', String(form.numero));
    data.append('posicao', form.posicao);
    data.append('email', form.email);
    if (form.imagem) data.append('imagem', form.imagem);
    if (editandoId) data.append('status', status); // somente em edição

    try {
      if (editandoId) {
        await api.put(`/atletas/${editandoId}`, {
          nome: form.nome,
          numero: form.numero,
          posicao: form.posicao,
          email: form.email,
          status,
        });
      } else {
        await api.post('/atletas', data);
      }

      setForm({ nome: '', numero: 0, posicao: '', email: '', imagem: null });
      setEditandoId(null);
      setStatus('A');
      fetchAtletas();
    } catch {
      alert('Erro ao salvar atleta');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Deseja excluir este atleta?')) {
      try {
        await api.delete(`/atletas/${id}`);
        fetchAtletas();
      } catch {
        alert('Erro ao excluir atleta');
      }
    }
  };

  const handleEdit = (a: Atleta) => {
    setForm({
      nome: a.nome,
      numero: a.numero,
      posicao: a.posicao,
      email: a.email,
      imagem: null,
    });
    setStatus(a.status);
    setEditandoId(a.id);
  };

  const cancelarEdicao = () => {
    setEditandoId(null);
    setStatus('A');
    setForm({ nome: '', numero: 0, posicao: '', email: '', imagem: null });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-[#000073] flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <Image src={Logo} alt="Logo São José Jets" width={60} height={60} />
          <h1 className="text-white font-bold text-xl sm:text-2xl">Cadastro de Atletas</h1>
        </div>
      </header>

      <div className="max-w-3xl mx-auto mt-10 bg-white p-6 sm:p-8 rounded-lg border-2 border-[#000073] shadow">
        <h2 className="text-2xl font-bold text-[#000073] text-center mb-6">🏈 Gerenciar Atletas</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mb-6" encType="multipart/form-data">
          <input
            type="text"
            placeholder="Nome"
            value={form.nome}
            onChange={(e) => setForm({ ...form, nome: e.target.value })}
            required
            className="p-2 border border-gray-300 rounded"
          />
          <input
            type="number"
            placeholder="Número"
            value={form.numero}
            onChange={(e) => setForm({ ...form, numero: Number(e.target.value) })}
            required
            className="p-2 border border-gray-300 rounded"
          />
          <input
            type="text"
            placeholder="Posição"
            value={form.posicao}
            onChange={(e) => setForm({ ...form, posicao: e.target.value })}
            required
            className="p-2 border border-gray-300 rounded"
          />
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
            className="p-2 border border-gray-300 rounded"
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0] || null;
              setForm({ ...form, imagem: file });
            }}
            className="p-2 border border-gray-300 rounded"
          />

          {editandoId && (
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="p-2 border border-gray-300 rounded"
            >
              <option value="A">Ativo</option>
              <option value="I">Inativo</option>
              <option value="B">Bloqueado</option>
            </select>
          )}

          <div className="flex flex-wrap gap-4">
            <button
              type="submit"
              className="bg-[#B78628] hover:bg-[#C69320] text-white font-bold py-2 px-4 rounded"
            >
              {editandoId ? 'Salvar Alterações' : 'Adicionar Atleta'}
            </button>
            {editandoId && (
              <button
                type="button"
                onClick={cancelarEdicao}
                className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded"
              >
                Cancelar
              </button>
            )}
          </div>
        </form>

        <ul className="divide-y divide-gray-200">
          {atletas.map((a) => (
            <li key={a.id} className="py-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <div className="flex items-center gap-3">
                {a.imagemUrl ? (
                  <img
                    src={`/uploads/${a.imagemUrl}`}
                    alt={a.nome}
                    className="w-10 h-10 rounded-full object-cover border"
                  />
                ) : (
                  <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-xs">
                    ?
                  </div>
                )}
                <span className="text-sm sm:text-base font-medium">
                  #{a.numero} - {a.nome} ({a.posicao})
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(a)}
                  className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(a.id)}
                  className="bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded"
                >
                  Excluir
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
