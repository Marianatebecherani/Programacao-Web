import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

// Listar usuários com seus perfis (paginado)
export const listUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const users = await prisma.usuario.findMany({
      skip,
      take: Number(limit),
      orderBy: { username: "asc" },
      include: {
        atleta: true,
        funcionario: true,
        torcedor: true
      }
    });

    res.json(users);
  } catch (error) {
    next(error);
  }
};

// Buscar usuário por username (com perfil)
export const getUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { username } = req.params;

    const user = await prisma.usuario.findUnique({
      where: { username },
      include: {
        atleta: true,
        funcionario: true,
        torcedor: true
      }
    });

    if (!user) {
      res.status(404).json({ error: "Usuário não encontrado" });
      return;
    }

    res.json(user);
  } catch (error) {
    next(error);
  }
};

// Atualizar dados básicos do usuário (nome, tipo, status)
export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { username } = req.params;
    const { nome, tipo, status } = req.body;

    const updated = await prisma.usuario.update({
      where: { username },
      data: { nome, tipo, status }
    });

    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: "Erro ao atualizar usuário" });
  }
};

// Remover usuário (e perfil)
export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { username } = req.params;

    await prisma.usuario.delete({
      where: { username }
    });

    res.json({ message: "Usuário removido com sucesso" });
  } catch (error) {
    res.status(400).json({ error: "Erro ao remover usuário" });
  }
};

// Buscar dados do usuário logado
export const getMe = async (req: Request, res: Response): Promise<void> => {
  const { username } = req.user;

  try {
    const usuario = await prisma.usuario.findUnique({
      where: { username },
      include: {
        atleta: true,
        funcionario: true,
        torcedor: true
      }
    });

    if (!usuario) {
      res.status(404).json({ error: "Usuário não encontrado." });
      return;
    }

    res.json(usuario);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar dados do usuário." });
  }
};

// Trocar senha
export const changePassword = async (req: Request, res: Response): Promise<void> => {
  const { oldPassword, newPassword } = req.body;
  const { username } = req.user;

  try {
    const user = await prisma.usuario.findUnique({ where: { username } });

    if (!user) {
      res.status(404).json({ error: "Usuário não encontrado" });
      return;
    }

    const valid = await bcrypt.compare(oldPassword, user.password);
    if (!valid) {
      res.status(401).json({ error: "Senha antiga incorreta" });
      return;
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    await prisma.usuario.update({
      where: { username },
      data: { password: hashed }
    });

    res.json({ message: "Senha alterada com sucesso" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao trocar a senha" });
  }
};

// Retorna info pública/básica do usuário logado
export const userInfo = async (req: Request, res: Response): Promise<void> => {
  const { username } = req.user;

  try {
    const user = await prisma.usuario.findUnique({
      where: { username },
      select: {
        username: true,
        nome: true,
        email: true,
        tipo: true,
        status: true
      }
    });

    if (!user) {
      res.status(404).json({ error: "Usuário não encontrado" });
      return;
    }

    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar informações do usuário" });
  }
};
