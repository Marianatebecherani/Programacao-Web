import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import type multer from "../services/multer";
import { sendInitialPassword } from "../services/emailService";
import { gerarSenhaCriptografada } from "../utils/password";

const prisma = new PrismaClient();

interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

// Criar atleta com imagem de perfil
export const createAtleta = async (req: MulterRequest, res: Response): Promise<void> => {
  const { nome, numero, posicao, email } = req.body;
  const imagem = req.file;

  try {
    // Verifica duplicidade de e-mail
    const existing = await prisma.atleta.findFirst({ where: { usuarioId: email } });
    if (existing) {
      res.status(400).json({ error: "Atleta com este e-mail já existe" });
      return;
    }

    const {senhaOriginal: senhaProvisoria, senhaCriptografada} = await gerarSenhaCriptografada();

    // Cria o usuário primeiro
    const novoUsuario = await prisma.usuario.create({
      data: {
        nome,
        email,
        username: email, // assuming username is the email
        tipo: "ATLETA", // or another appropriate value for tipo
        password: senhaCriptografada,
        status: "A"
      }
    });

    // Cria o atleta referenciando o usuário criado
    const novoAtleta = await prisma.atleta.create({
      data: {
        numero: Number(numero),
        posicao,
        imagemUrl: imagem?.filename,
        usuarioId: novoUsuario.username
      }
    });

    // Envia e-mail com senha provisória
    await sendInitialPassword(email, senhaProvisoria);

    res.status(201).json({
      message: "Atleta criado com sucesso",
      senhaProvisoria,
      atleta: novoAtleta
    });
  } catch (error) {
    console.error("Erro ao criar atleta:", error);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
};

export const listAtletas = async (req: Request, res: Response): Promise<void> => {
  const page = Number(req.query.page) || 1;
  const limit = 10;
  const offset = (page - 1) * limit;
  const totalAtletas = await prisma.atleta.count();

  try {
    const atletas = await prisma.atleta.findMany({
      skip: offset,
      take: limit,
      include: {
        usuario: {
          select: {
            nome: true,
            email: true,
            status: true,
            atleta: {
              select: {
                id: true,
                numero: true,
                posicao: true,
                imagemUrl: true
              }
            }
          }
        }
      },
      orderBy: { id: "asc" }
    });

    const atletasFormatados = atletas.map(a => ({
      id: a.id,
      numero: a.numero,
      posicao: a.posicao,
      imagemUrl: a.imagemUrl,
      email: a.usuario?.email, // pega o email do usuário relacionado
      nome: a.usuario?.nome, // pega o nome do usuário relacionado
      status: a.usuario?.status // pega o status do usuário relacionado
    }));

    res.json(atletasFormatados);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao listar atletas" });
  }
};

// Obter atleta por ID
export const getAtleta = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  try {
    const atleta = await prisma.atleta.findUnique({ where: { id: Number(id) } });
    if (!atleta) {
      res.status(404).json({ error: "Atleta não encontrado" });
    } else {
      res.json(atleta);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao obter atleta" });
  }
};

export const updateAtleta = async (req: MulterRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  const { numero, posicao, status } = req.body;
  const imagemUrl = req.file ? `/uploads/${req.file.filename}` : undefined;

  try {
    const atletaAtualizado = await prisma.atleta.update({
      where: { id: Number(id) },
      data: {
        numero: Number(numero),
        posicao,
        ...(imagemUrl && { imagemUrl })
      },
      include: { usuario: true }
    });

    // Atualizar status do usuário
    await prisma.usuario.update({
      where: { username: atletaAtualizado.usuarioId },
      data: { status }
    });

    res.json({ message: "Atleta atualizado com sucesso" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar atleta" });
  }
};

export const deleteAtleta = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const atleta = await prisma.atleta.delete({
      where: { id: Number(id) }
    });

    await prisma.usuario.delete({
      where: { username: atleta.usuarioId }
    });

    res.json({ message: "Atleta removido com sucesso" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao remover atleta" });
  }
};