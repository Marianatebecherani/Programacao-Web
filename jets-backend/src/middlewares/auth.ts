import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Extende a interface Request para incluir a propriedade 'user'
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export function authenticateToken(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1];

  if (!token) {
    res.status(401).json({ error: "Token não fornecido" });
    return;
  }

  jwt.verify(token, process.env.JWT_SECRET!, (err, user) => {
    if (err) {
      res.status(403).json({ error: "Token inválido" });
      return;
    }
    req.user = user;
    next();
  });
}
export function checkAdmin(req: Request, res: Response, next: NextFunction): void {
  const user = req.user;

  if (!user || user.tipo !== 'ADMIN') {
    res.status(403).json({ error: "Acesso negado. Apenas administradores podem acessar esta rota." });
    return;
  }

  next();
}

export function checkTorcedor(req: Request, res: Response, next: NextFunction): void {
  const user = req.user;
  if (!user || user.tipo !== 'TORCEDOR') {
    res.status(403).json({ error: "Acesso negado. Apenas torcedores podem acessar esta rota." });
    return;
  }
  next();
}

export function checkAtleta(req: Request, res: Response, next: NextFunction): void {
  const user = req.user;
  if (!user || user.tipo !== 'ATLETA') {
    res.status(403).json({ error: "Acesso negado. Apenas atletas podem acessar esta rota." });
    return;
  }
  next();
}
export function checkFuncionario(req: Request, res: Response, next: NextFunction): void {
  const user = req.user;
  if (!user || user.tipo !== 'FUNCIONARIO') {
    res.status(403).json({ error: "Acesso negado. Apenas funcionários podem acessar esta rota." });
    return;
  }
  next();
}
