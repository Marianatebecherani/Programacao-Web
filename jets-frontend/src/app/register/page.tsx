'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '../../utils/api';
import Image from 'next/image';
import Logo from 'public/logo.png';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    nome: '',
    email: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await api.post('/auth/register', {
        ...formData,
        tipo: '1', // tipo 1 = torcedor
      });
      alert('Cadastro realizado com sucesso!');
      router.push('/register/sucesso');
    } catch (err) {
      console.error(err);
      alert('Erro ao cadastrar. Verifique os dados.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Faixa azul com logo */}
      <header className="bg-[#000073] flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <Image src={Logo} alt="Logo São José Jets" width={60} height={60} />
          <h1 className="text-white font-bold text-xl sm:text-2xl">Cadastro de Torcedor</h1>
        </div>
      </header>

      {/* Conteúdo */}
      <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded-lg shadow-lg border-2 border-[#000073]">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            name="username"
            placeholder="Usuário"
            onChange={handleChange}
            required
            className="p-3 border border-gray-300 rounded"
          />
          <input
            type="text"
            name="nome"
            placeholder="Nome completo"
            onChange={handleChange}
            required
            className="p-3 border border-gray-300 rounded"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            required
            className="p-3 border border-gray-300 rounded"
          />
          <input
            type="password"
            name="password"
            placeholder="Senha"
            onChange={handleChange}
            required
            className="p-3 border border-gray-300 rounded"
          />
          <button
            type="submit"
            className="bg-[#B78628] hover:bg-[#C69320] text-white font-bold py-3 rounded"
          >
            Cadastrar
          </button>
        </form>
      </div>
    </div>
  );
}
