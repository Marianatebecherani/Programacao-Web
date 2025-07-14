import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const listTorcedores = async (req: Request, res: Response): Promise<void> => {
  try {
    const torcedores = await prisma.torcedor.findMany({
      include: {
        usuario: {
          select: { nome: true, email: true, status: true }
        }
      },
      orderBy: { id: "asc" }
    });

    res.json(torcedores.map(t => ({
      id: t.id,
      plano: t.plano,
      imagemUrl: t.imagemUrl,
      nome: t.usuario.nome,
      email: t.usuario.email,
      status: t.usuario.status
    })));
  } catch (err) {
    res.status(500).json({ error: "Erro ao listar torcedores" });
  }
};
