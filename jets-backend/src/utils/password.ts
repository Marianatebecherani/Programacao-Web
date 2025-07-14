import bcrypt from "bcrypt";
import crypto from "crypto";

// Função para gerar senha aleatória com letras, números e símbolos
export function gerarSenhaAleatoria(tamanho = 10): string {
  const caracteres = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
  let senha = "";
  for (let i = 0; i < tamanho; i++) {
    const indice = Math.floor(Math.random() * caracteres.length);
    senha += caracteres.charAt(indice);
  }
  return senha;
}

// Função para gerar e criptografar a senha
export async function gerarSenhaCriptografada(): Promise<{ senhaOriginal: string; senhaCriptografada: string }> {
  const senhaOriginal = gerarSenhaAleatoria(10); // ou 12, 16 etc.
  const senhaCriptografada = await bcrypt.hash(senhaOriginal, 10);

  return { senhaOriginal, senhaCriptografada };
}

