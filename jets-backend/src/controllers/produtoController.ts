import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";  
import multer from "../services/multer";
import { authenticateToken, checkAdmin } from "../middlewares/auth";

interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

const prisma = new PrismaClient();

export const listProdutos = async (req: Request, res: Response): Promise<void> => {
  try {
    const produtos = await prisma.produto.findMany({
      orderBy: { nome: "asc" }
    });
    res.json(produtos);
  } catch (err) {
    res.status(500).json({ error: "Erro ao listar produtos" });
  }
};

export const createProduto = async (req: MulterRequest, res: Response): Promise<void> => {
  const { nome, descricao, preco, estoque } = req.body;
  const imagemUrl = req.file ? `/uploads/${req.file.filename}` : "";

  try {
    const produto = await prisma.produto.create({
      data: { nome, descricao, preco: Number(preco), estoque: Number(estoque), imagemUrl }
    });
    res.json(produto);
  } catch (err) {
    res.status(500).json({ error: "Erro ao criar produto" });
  }
};

