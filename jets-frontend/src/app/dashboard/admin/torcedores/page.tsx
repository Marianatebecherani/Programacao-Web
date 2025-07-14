"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Logo from "public/logo.png";
import { api } from "@/utils/api";

interface Torcedor {
  id: number;
  nome: string;
  email: string;
  plano: string;
  status: string;
  imagemUrl: string;
}

export default function TorcedoresPage() {
  const router = useRouter();
  const [torcedores, setTorcedores] = useState<Torcedor[]>([]);
  const [form, setForm] = useState({
    nome: "",
    email: "",
    plano: "",
    imagem: null as File | null,
  });
  const [statusFilter, setStatusFilter] = useState<string>("TODOS");
  const [editandoId, setEditandoId] = useState<number | null>(null);

  const fetchTorcedores = async () => {
    try {
      const res = await api.get("/torcedores", {
        params: statusFilter !== "TODOS" ? { status: statusFilter } : {},
      });
      setTorcedores(res.data);
    } catch {
      alert("Erro ao carregar torcedores");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return router.push("/login");
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    fetchTorcedores();
  }, [statusFilter]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("nome", form.nome);
    formData.append("email", form.email);
    formData.append("plano", form.plano);
    if (form.imagem) formData.append("imagem", form.imagem);

    try {
      if (editandoId) {
        await api.put(`/torcedores/${editandoId}`, formData);
      } else {
        await api.post("/torcedores", formData);
      }
      setForm({ nome: "", email: "", plano: "", imagem: null });
      setEditandoId(null);
      fetchTorcedores();
    } catch {
      alert("Erro ao salvar torcedor");
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Deseja excluir este torcedor?")) {
      try {
        await api.delete(`/torcedores/${id}`);
        fetchTorcedores();
      } catch {
        alert("Erro ao excluir torcedor");
      }
    }
  };

  const handleEdit = (t: Torcedor) => {
    setForm({ nome: t.nome, email: t.email, plano: t.plano, imagem: null });
    setEditandoId(t.id);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-[#000073] flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <Image src={Logo} alt="Logo" width={60} height={60} />
          <h1 className="text-white font-bold text-xl sm:text-2xl">Admin - Torcedores</h1>
        </div>
      </header>

      <div className="max-w-5xl mx-auto mt-10 bg-white p-6 sm:p-8 rounded-lg border-2 border-[#000073] shadow">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <h2 className="text-2xl font-bold text-[#000073]">🎉 Gerenciar Torcedores</h2>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="mt-2 sm:mt-0 border border-gray-300 p-2 rounded"
          >
            <option value="TODOS">Todos</option>
            <option value="A">Ativos</option>
            <option value="I">Inativos</option>
            <option value="B">Bloqueados</option>
          </select>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mb-6" encType="multipart/form-data">
          <input
            type="text"
            placeholder="Nome"
            value={form.nome}
            onChange={(e) => setForm({ ...form, nome: e.target.value })}
            className="p-2 border border-gray-300 rounded"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="p-2 border border-gray-300 rounded"
            required
          />
          <input
            type="text"
            placeholder="Plano"
            value={form.plano}
            onChange={(e) => setForm({ ...form, plano: e.target.value })}
            className="p-2 border border-gray-300 rounded"
            required
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setForm({ ...form, imagem: e.target.files?.[0] || null })}
            className="p-2 border border-gray-300 rounded"
          />
          <button type="submit" className="bg-[#B78628] hover:bg-[#C69320] text-white font-bold py-2 px-4 rounded">
            {editandoId ? "Salvar Alterações" : "Adicionar Torcedor"}
          </button>
        </form>

        <ul className="divide-y divide-gray-200">
          {torcedores.map((t) => (
            <li key={t.id} className="py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center">
              <div className="flex items-center gap-4">
                <img
                  src={t.imagemUrl}
                  alt={t.nome}
                  className="w-16 h-16 object-cover rounded border"
                />
                <div>
                  <p className="font-semibold">{t.nome}</p>
                  <p className="text-sm text-gray-600">{t.plano} | {t.email}</p>
                  <p className="text-xs text-gray-500">Status: {t.status}</p>
                </div>
              </div>
              <div className="flex gap-2 mt-2 sm:mt-0">
                <button
                  onClick={() => handleEdit(t)}
                  className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(t.id)}
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
