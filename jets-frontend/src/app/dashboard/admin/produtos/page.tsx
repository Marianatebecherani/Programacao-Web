"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Logo from "public/logo.png";
import { api } from "@/utils/api";

interface Produto {
  id: number;
  nome: string;
  descricao: string;
  preco: number;
  estoque: number;
  imagemUrl: string;
}

export default function ProdutosPage() {
  const router = useRouter();
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [form, setForm] = useState({
    nome: "",
    descricao: "",
    preco: 0,
    estoque: 0,
    imagem: null as File | null,
  });
  const [editandoId, setEditandoId] = useState<number | null>(null);

  const fetchProdutos = async () => {
    try {
      const res = await api.get("/produtos");
      setProdutos(res.data);
    } catch {
      alert("Erro ao carregar produtos");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return router.push("/login");
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    fetchProdutos();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("nome", form.nome);
    formData.append("descricao", form.descricao);
    formData.append("preco", String(form.preco));
    formData.append("estoque", String(form.estoque));
    if (form.imagem) formData.append("imagem", form.imagem);

    try {
      if (editandoId) {
        await api.put(`/produtos/${editandoId}`, formData);
      } else {
        await api.post("/produtos", formData);
      }
      setForm({ nome: "", descricao: "", preco: 0, estoque: 0, imagem: null });
      setEditandoId(null);
      fetchProdutos();
    } catch {
      alert("Erro ao salvar produto");
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Deseja excluir este produto?")) {
      try {
        await api.delete(`/produtos/${id}`);
        fetchProdutos();
      } catch {
        alert("Erro ao excluir produto");
      }
    }
  };

  const handleEdit = (p: Produto) => {
    setForm({ nome: p.nome, descricao: p.descricao, preco: p.preco, estoque: p.estoque, imagem: null });
    setEditandoId(p.id);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-[#000073] flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <Image src={Logo} alt="Logo" width={60} height={60} />
          <h1 className="text-white font-bold text-xl sm:text-2xl">Admin - Produtos</h1>
        </div>
      </header>

      <div className="max-w-4xl mx-auto mt-10 bg-white p-6 sm:p-8 rounded-lg border-2 border-[#000073] shadow">
        <h2 className="text-2xl font-bold text-[#000073] text-center mb-6">🛒 Gerenciar Produtos</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mb-6" encType="multipart/form-data">
          <input
            type="text"
            placeholder="Nome"
            value={form.nome}
            onChange={(e) => setForm({ ...form, nome: e.target.value })}
            className="p-2 border border-gray-300 rounded"
            required
          />
          <textarea
            placeholder="Descrição"
            value={form.descricao}
            onChange={(e) => setForm({ ...form, descricao: e.target.value })}
            className="p-2 border border-gray-300 rounded"
            required
          />
          <input
            type="number"
            placeholder="Preço"
            value={form.preco}
            onChange={(e) => setForm({ ...form, preco: parseFloat(e.target.value) })}
            className="p-2 border border-gray-300 rounded"
            required
          />
          <input
            type="number"
            placeholder="Estoque"
            value={form.estoque}
            onChange={(e) => setForm({ ...form, estoque: parseInt(e.target.value) })}
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
            {editandoId ? "Salvar Alterações" : "Adicionar Produto"}
          </button>
        </form>

        <ul className="divide-y divide-gray-200">
          {produtos.map((p) => (
            <li key={p.id} className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between">
              <div className="flex items-center gap-4">
                <img src={p.imagemUrl} alt={p.nome} className="w-16 h-16 object-cover rounded border" />
                <div>
                  <p className="font-semibold">{p.nome}</p>
                  <p className="text-sm text-gray-600">R$ {p.preco.toFixed(2)} | Estoque: {p.estoque}</p>
                </div>
              </div>
              <div className="flex gap-2 mt-2 sm:mt-0">
                <button
                  onClick={() => handleEdit(p)}
                  className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(p.id)}
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
