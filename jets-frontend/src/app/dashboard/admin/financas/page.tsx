'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Logo from "public/logo.png";
import { api } from "@/utils/api";

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";

interface TransacaoFinanceira {
  id: number;
  tipo: "RECEITA" | "DESPESA";
  valor: number;
  descricao: string;
  categoria: string;
  data: string;
}

export default function FinancasPage() {
  const router = useRouter();

  const [transacoes, setTransacoes] = useState<TransacaoFinanceira[]>([]);
  const [filtroTipo, setFiltroTipo] = useState<string>("TODOS");
  const [filtroDataInicio, setFiltroDataInicio] = useState<string>("");
  const [filtroDataFim, setFiltroDataFim] = useState<string>("");

  const [graficoDados, setGraficoDados] = useState<{ name: string; receita: number; despesa: number }[]>([]);

  const fetchTransacoes = async () => {
    try {
      const res = await api.get("/financas");
      setTransacoes(res.data);
    } catch {
      alert("Erro ao carregar transações financeiras");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return router.push("/login");
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    fetchTransacoes();
  }, []);

  // Filtrar transações conforme filtros selecionados
  const transacoesFiltradas = transacoes.filter((t) => {
    const data = new Date(t.data);
    const inicio = filtroDataInicio ? new Date(filtroDataInicio) : null;
    const fim = filtroDataFim ? new Date(filtroDataFim) : null;

    if (filtroTipo !== "TODOS" && t.tipo !== filtroTipo) return false;
    if (inicio && data < inicio) return false;
    if (fim && data > fim) return false;

    return true;
  });

  // Atualiza dados para gráfico sempre que filtra
  useEffect(() => {
    // Agrupar por mês/ano e somar receitas e despesas
    const agrupado: Record<string, { receita: number; despesa: number }> = {};

    transacoesFiltradas.forEach(({ tipo, valor, data }) => {
      const d = new Date(data);
      const key = d.toLocaleString("pt-BR", { month: "short", year: "numeric" });

      if (!agrupado[key]) agrupado[key] = { receita: 0, despesa: 0 };
      if (tipo === "RECEITA") agrupado[key].receita += valor;
      else agrupado[key].despesa += valor;
    });

    const dadosGrafico = Object.entries(agrupado).map(([name, vals]) => ({
      name,
      receita: vals.receita,
      despesa: vals.despesa,
    }));

    setGraficoDados(dadosGrafico);
  }, [transacoesFiltradas]);

  // Cálculo resumo
  const totalReceitas = transacoesFiltradas
    .filter((t) => t.tipo === "RECEITA")
    .reduce((acc, cur) => acc + cur.valor, 0);
  const totalDespesas = transacoesFiltradas
    .filter((t) => t.tipo === "DESPESA")
    .reduce((acc, cur) => acc + cur.valor, 0);
  const saldo = totalReceitas - totalDespesas;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Faixa azul com logo */}
      <header className="bg-[#000073] flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <Image src={Logo} alt="Logo" width={60} height={60} />
          <h1 className="text-white font-bold text-xl sm:text-2xl">Admin - Finanças</h1>
        </div>
      </header>

      {/* Conteúdo principal */}
      <main className="max-w-6xl mx-auto mt-8 p-6 bg-white border-2 border-[#000073] rounded shadow">
        <h2 className="text-2xl font-bold text-[#000073] mb-6">💰 Controle Financeiro</h2>

        {/* Filtros */}
        <section className="mb-6 flex flex-wrap gap-4">
          <select
            className="p-2 border border-gray-300 rounded"
            value={filtroTipo}
            onChange={(e) => setFiltroTipo(e.target.value)}
          >
            <option value="TODOS">Todos</option>
            <option value="RECEITA">Receitas</option>
            <option value="DESPESA">Despesas</option>
          </select>
          <input
            type="date"
            className="p-2 border border-gray-300 rounded"
            value={filtroDataInicio}
            onChange={(e) => setFiltroDataInicio(e.target.value)}
            placeholder="Data Início"
          />
          <input
            type="date"
            className="p-2 border border-gray-300 rounded"
            value={filtroDataFim}
            onChange={(e) => setFiltroDataFim(e.target.value)}
            placeholder="Data Fim"
          />
          <button
            onClick={() => {
              setFiltroTipo("TODOS");
              setFiltroDataInicio("");
              setFiltroDataFim("");
            }}
            className="bg-gray-400 hover:bg-gray-500 text-white px-4 rounded"
          >
            Limpar Filtros
          </button>
        </section>

        {/* Resumo financeiro */}
        <section className="mb-8 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <div className="bg-green-100 p-4 rounded shadow">
            <h3 className="text-green-700 font-semibold text-lg">Total Receitas</h3>
            <p className="text-green-900 text-xl font-bold">R$ {totalReceitas.toFixed(2)}</p>
          </div>
          <div className="bg-red-100 p-4 rounded shadow">
            <h3 className="text-red-700 font-semibold text-lg">Total Despesas</h3>
            <p className="text-red-900 text-xl font-bold">R$ {totalDespesas.toFixed(2)}</p>
          </div>
          <div className={`p-4 rounded shadow ${saldo >= 0 ? "bg-blue-100" : "bg-red-200"}`}>
            <h3 className="font-semibold text-lg">{saldo >= 0 ? "Saldo Positivo" : "Saldo Negativo"}</h3>
            <p className="text-xl font-bold">R$ {saldo.toFixed(2)}</p>
          </div>
        </section>

        {/* Gráfico */}
        <section className="mb-8" style={{ height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={graficoDados}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="receita" fill="#82ca9d" name="Receitas" />
              <Bar dataKey="despesa" fill="#8884d8" name="Despesas" />
            </BarChart>
          </ResponsiveContainer>
        </section>

        {/* Listagem de transações */}
        <section>
          <h3 className="text-xl font-semibold mb-4">Transações</h3>
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-[#000073] text-white">
                <th className="p-2 border border-gray-300">Tipo</th>
                <th className="p-2 border border-gray-300">Valor (R$)</th>
                <th className="p-2 border border-gray-300">Categoria</th>
                <th className="p-2 border border-gray-300">Descrição</th>
                <th className="p-2 border border-gray-300">Data</th>
              </tr>
            </thead>
            <tbody>
              {transacoesFiltradas.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center p-4">
                    Nenhuma transação encontrada.
                  </td>
                </tr>
              ) : (
                transacoesFiltradas.map((t) => (
                  <tr key={t.id} className="odd:bg-gray-50 even:bg-gray-100">
                    <td className={`p-2 border border-gray-300 font-semibold ${t.tipo === "RECEITA" ? "text-green-700" : "text-red-700"}`}>
                      {t.tipo}
                    </td>
                    <td className="p-2 border border-gray-300">R$ {t.valor.toFixed(2)}</td>
                    <td className="p-2 border border-gray-300">{t.categoria}</td>
                    <td className="p-2 border border-gray-300">{t.descricao}</td>
                    <td className="p-2 border border-gray-300">{new Date(t.data).toLocaleDateString("pt-BR")}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
}
