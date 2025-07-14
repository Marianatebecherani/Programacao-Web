"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Logo from "public/logo.png";
import { api } from "@/utils/api";

interface Funcionario {
  id: number;
  nome: string;
  email: string;
  cargo: string;
  status: string;
  imagemUrl: string;
}

export default function FuncionariosPage() {
  const router = useRouter();
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [form, setForm] = useState({
    nome: "",
    email: "",
    cargo: "",
    imagem: null as File | null,
  });
  const [statusFilter, setStatusFilter] = useState<string>("TODOS");
  const [editandoId, setEditandoId] = useState<number | null>(null);

  const fetchFuncionarios = async () => {
    try {
      const res = await api.get("/funcionarios", {
        params: statusFilter !== "TODOS" ? { status: statusFilter } : {},
      });
      setFuncionarios(res.data);
    } catch {
      alert("Erro ao carregar funcionários");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return router.push("/login");
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    fetchFuncionarios();
  }, [statusFilter]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("nome", form.nome);
    formData.append("email", form.email);
    formData.append("cargo", form.cargo);
    if (form.imagem) formData.append("imagem", form.imagem);

    try {
      if (editandoId) {
        await api.put(`/funcionarios/${editandoId}`, formData);
      } else {
        await api.post("/funcionarios", formData);
      }
      setForm({ nome: "", email: "", cargo: "", imagem: null });
      setEditandoId(null);
      fetchFuncionarios();
    } catch {
      alert("Erro ao salvar funcionário");
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Deseja excluir este funcionário?")) {
      try {
        await api.delete(`/funcionarios/${id}`);
        fetchFuncionarios();
      } catch {
        alert("Erro ao excluir funcionário");
      }
    }
  };

  const handleEdit = (f: Funcionario) => {
    setForm({ nome: f.nome, email: f.email, cargo: f.cargo, imagem: null });
    setEditandoId(f.id);
  };

  const exportarJSON = () => {
    const blob = new Blob([JSON.stringify(funcionarios, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "funcionarios.json";
    a.click();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-[#000073] flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <Image src={Logo} alt="Logo" width={60} height={60} />
          <h1 className="text-white font-bold text-xl sm:text-2xl">Admin - Funcionários</h1>
        </div>
        <button
          onClick={exportarJSON}
          className="bg-[#FCC201] text-black px-4 py-2 rounded font-semibold"
        >
          📁 Exportar JSON
        </button>
      </header>

      <div className="max-w-5xl mx-auto mt-10 bg-white p-6 sm:p-8 rounded-lg border-2 border-[#000073] shadow">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <h2 className="text-2xl font-bold text-[#000073]">👥 Gerenciar Funcionários</h2>
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
            placeholder="Cargo"
            value={form.cargo}
            onChange={(e) => setForm({ ...form, cargo: e.target.value })}
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
            {editandoId ? "Salvar Alterações" : "Adicionar Funcionário"}
          </button>
        </form>

        <ul className="divide-y divide-gray-200">
          {funcionarios.map((f) => (
            <li key={f.id} className="py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center">
              <div className="flex items-center gap-4">
                <img
                  src={f.imagemUrl}
                  alt={f.nome}
                  className="w-16 h-16 object-cover rounded border"
                />
                <div>
                  <p className="font-semibold">{f.nome}</p>
                  <p className="text-sm text-gray-600">{f.cargo} | {f.email}</p>
                  <p className="text-xs text-gray-500">Status: {f.status}</p>
                </div>
              </div>
              <div className="flex gap-2 mt-2 sm:mt-0">
                <button
                  onClick={() => handleEdit(f)}
                  className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(f.id)}
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
