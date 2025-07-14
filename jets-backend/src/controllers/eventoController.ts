import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Criar evento
export const createEvento = async (req: Request, res: Response) => {
  const { titulo, tipo, data, hora, local, descricao } = req.body;
  try {
    const novo = await prisma.evento.create({ data: { titulo, tipo, data: new Date(data), hora, local, descricao } });
    res.status(201).json(novo);
  } catch {
    res.status(500).json({ error: 'Erro ao criar evento' });
  }
};

// Listar todos os eventos
export const listEventos = async (req: Request, res: Response) => {
  try {
    const eventos = await prisma.evento.findMany({ orderBy: { data: 'asc' } });
    res.json(eventos);
  } catch {
    res.status(500).json({ error: 'Erro ao listar eventos' });
  }
};

// Atualizar evento
export const updateEvento = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { titulo, tipo, data, hora, local, descricao } = req.body;
  try {
    const atualizado = await prisma.evento.update({
      where: { id: Number(id) },
      data: { titulo, tipo, data: new Date(data), hora, local, descricao },
    });
    res.json(atualizado);
  } catch {
    res.status(500).json({ error: 'Erro ao atualizar evento' });
  }
};

// Deletar evento
export const deleteEvento = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.evento.delete({ where: { id: Number(id) } });
    res.json({ message: 'Evento excluído com sucesso' });
  } catch {
    res.status(500).json({ error: 'Erro ao excluir evento' });
  }
};
