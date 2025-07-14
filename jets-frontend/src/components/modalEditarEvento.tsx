'use client';

import React from 'react';

interface ModalEditarEventoProps {
  isOpen: boolean;
  onClose: () => void;
  onSalvar: () => void;
  onExcluir: () => void;
  formData: {
    titulo: string;
    data: string;
    tipo: string;
    hora: string;
    local: string;
    descricao: string;
  };
  setFormData: React.Dispatch<React.SetStateAction<{
    titulo: string;
    data: string;
    tipo: string;
    hora: string;
    local: string;
    descricao: string;
  }>>;
}

export const ModalEditarEvento: React.FC<ModalEditarEventoProps> = ({
  isOpen,
  onClose,
  onSalvar,
  onExcluir,
  formData,
  setFormData
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-lg">
        <h2 className="text-xl font-bold mb-4 text-[#000073]">Editar Evento</h2>

        <label className="block mb-2 font-semibold">Título</label>
        <input
          type="text"
          className="w-full mb-4 p-2 border rounded"
          value={formData.titulo}
          onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
        />

        <label className="block mb-2 font-semibold">Data</label>
        <input
          type="date"
          className="w-full mb-4 p-2 border rounded"
          value={formData.data}
          onChange={(e) => setFormData({ ...formData, data: e.target.value })}
        />

        <label className="block mb-2 font-semibold">Hora</label>
        <input
          type="time"
          className="w-full mb-4 p-2 border rounded"
          value={formData.hora}
          onChange={(e) => setFormData({ ...formData, hora: e.target.value })}
        />

        <label className="block mb-2 font-semibold">Tipo</label>
        <input
          type="text"
          className="w-full mb-4 p-2 border rounded"
          value={formData.tipo}
          onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
        />

        <label className="block mb-2 font-semibold">Local</label>
        <input
          type="text"
          className="w-full mb-4 p-2 border rounded"
          value={formData.local}
          onChange={(e) => setFormData({ ...formData, local: e.target.value })}
        />

        <label className="block mb-2 font-semibold">Descrição</label>
        <textarea
          className="w-full mb-6 p-2 border rounded"
          rows={3}
          value={formData.descricao}
          onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
        />

        <div className="flex justify-end gap-4">
          <button
            onClick={onExcluir}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Excluir
          </button>
          <button
            onClick={onSalvar}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Salvar
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};
