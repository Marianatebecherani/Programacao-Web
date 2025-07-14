import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendInitialPassword } from "../services/emailService";
import crypto from "crypto";
import { gerarSenhaCriptografada } from "../utils/password";

const prisma = new PrismaClient();

// LOGIN
export const login = async (req: Request, res: Response): Promise<void> => {
  const { username, password } = req.body;

  const user = await prisma.usuario.findUnique({ where: { username } });
  if (!user) {
    res.status(404).json({ error: "Usuário não encontrado" });
    return;
  }

  if (user.status !== 'A') {
    res.status(403).json({ error: `Usuário com status: ${user.status}` });
    return;
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    await prisma.usuario.update({
      where: { username },
      data: {
        tentativas: { increment: 1 },
        status: user.tentativas + 1 >= 2 ? 'B' : user.status,
      }
    });
    res.status(401).json({ error: "Senha incorreta" });
    return;
  }

  await prisma.usuario.update({
    where: { username },
    data: {
      tentativas: 0,
      quantAcesso: { increment: 1 }
    }
  });

  const token = jwt.sign(
    { username: user.username, tipo: user.tipo },
    process.env.JWT_SECRET!,
    { expiresIn: "2h" }
  );

  res.json({ token, tipo: user.tipo });
};

// CADASTRO
export const register = async (req: Request, res: Response): Promise<void> => {
  const { username, nome, email, tipo, perfil } = req.body;

  try {
    const existingUser = await prisma.usuario.findFirst({
      where: { OR: [{ username }, { email }] }
    });

    if (existingUser) {
      res.status(400).json({ error: "Usuário ou e-mail já cadastrado." });
      return;
    }

    if (tipo === 'ADMIN') {
      res.status(403).json({ error: "Cadastro de administrador não permitido publicamente." });
      return;
    }

    const {senhaOriginal, senhaCriptografada} = await gerarSenhaCriptografada();

    const newUser = await prisma.usuario.create({
      data: {
        username,
        password: senhaCriptografada,
        nome,
        email,
        tipo,
        status: 'A',
        quantAcesso: 0,
        tentativas: 0
      }
    });

    // Cria perfil vinculado ao tipo
    if (tipo === 'ATLETA') {
      await prisma.atleta.create({
        data: {
          usuarioId: username,
          numero: perfil.numero,
          posicao: perfil.posicao,
          imagemUrl: perfil.imagemUrl || null
        }
      });
    } else if (tipo === 'TORCEDOR') {
      await prisma.torcedor.create({
        data: {
          usuarioId: username,
          plano: perfil.plano,
          imagemUrl: perfil.imagemUrl || null
        }
      });
    } else if (tipo === 'FUNCIONARIO') {
      await prisma.funcionario.create({
        data: {
          usuarioId: username,
          cargo: perfil.cargo,
          imagemUrl: perfil.imagemUrl || null
        }
      });
    }

    // Envia e-mail com senha provisória
    await sendInitialPassword(email, senhaOriginal);

    res.status(201).json({ message: "Cadastro realizado com sucesso.", user: newUser.username });

  } catch (error) {
    console.error("Erro no cadastro:", error);
    res.status(500).json({ error: "Erro interno no servidor." });
  }
};

const resetTokens = new Map<string, string>(); // você pode salvar no banco depois

// Recuperar senha
export const recuperarSenha = async (req: Request, res: Response): Promise<void> => {
  const { email } = req.body;

  const user = await prisma.usuario.findUnique({ where: { email } });
  if (!user) {
    res.status(404).json({ error: "Usuário não encontrado." });
    return;
  }
  const token = crypto.randomBytes(32).toString("hex");
  resetTokens.set(token, user.username); // salvar temporariamente

  const resetLink = `${process.env.FRONTEND_URL}/resetar-senha?token=${token}`;

  res.json({ message: "E-mail de recuperação enviado com sucesso." });
};

// Resetar senha
export const resetarSenha = async (req: Request, res: Response): Promise<void> => {
  const { token, novaSenha } = req.body;
  const username = resetTokens.get(token);
  if (!username) {
    res.status(400).json({ error: "Token inválido ou expirado." });
    return;
  }

  const hashed = await bcrypt.hash(novaSenha, 10);
  await prisma.usuario.update({
    where: { username },
    data: { password: hashed, tentativas: 0 }
  });

  resetTokens.delete(token);
  res.json({ message: "Senha redefinida com sucesso." });
};

// Obter usuário logado
// (geralmente usado após autenticação)
export const getUsuarioLogado = async (req: Request, res: Response): Promise<void> => {
  try {
    const usuarioId = req.user?.id; // deve vir do middleware de autenticação
    if (!usuarioId) res.status(401).json({ error: 'Não autenticado' });
      return;

    const usuario = await prisma.usuario.findUnique({
      where: { username: usuarioId },
      include: {
        atleta: true,
        funcionario: true,
        torcedor: true
      }
    });

    if (!usuario) res.status(404).json({ error: 'Usuário não encontrado' });
      return;

    res.json(usuario);
  } catch {
    res.status(500).json({ error: 'Erro ao buscar usuário' });
  }
};
