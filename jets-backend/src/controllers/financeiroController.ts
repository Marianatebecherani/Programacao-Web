import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import type multer from "../services/multer";

const prisma = new PrismaClient();

export const listTransacoes = async (req: Request, res: Response): Promise<void> => {
  try {
    const transacoes = await prisma.transacaoFinanceira.findMany({
      orderBy: { data: "desc" }
    });
    res.json(transacoes);
  } catch (err) {
    res.status(500).json({ error: "Erro ao listar transações" });
  }
};

export const createTransacao = async (req: Request, res: Response): Promise<void> => {
  const { tipo, valor, descricao, categoria, data } = req.body;
  try {
    const nova = await prisma.transacaoFinanceira.create({
      data: {
        tipo,
        valor: Number(valor),
        descricao,
        categoria,
        data: new Date(data)
      }
    });
    res.json(nova);
  } catch (err) {
    res.status(500).json({ error: "Erro ao criar transação" });
  }
};
