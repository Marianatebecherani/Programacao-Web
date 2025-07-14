import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import type multer from "../services/multer";

const prisma = new PrismaClient();

export const listFuncionarios = async (req: Request, res: Response): Promise<void> => {
  try {
    const funcionarios = await prisma.funcionario.findMany({
      include: {
        usuario: {
          select: { nome: true, email: true, status: true }
        }
      },
      orderBy: { id: "asc" }
    });

    res.json(funcionarios.map(f => ({
      id: f.id,
      cargo: f.cargo,
      imagemUrl: f.imagemUrl,
      nome: f.usuario.nome,
      email: f.usuario.email,
      status: f.usuario.status
    })));
  } catch (err) {
    res.status(500).json({ error: "Erro ao listar funcionários" });
  }
};
