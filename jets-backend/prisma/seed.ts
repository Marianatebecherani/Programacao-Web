import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
dotenv.config();

const prisma = new PrismaClient();

const ADMIN_USERNAME = process.env.ADMIN_USERNAME!;
const ADMIN_NOME = process.env.ADMIN_NOME!;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL!;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD!;

async function main() {
  try {
    await prisma.$executeRawUnsafe(`CREATE EXTENSION IF NOT EXISTS "pgcrypto"`);
    console.log('Extensão "pgcrypto" verificada/criada com sucesso.');
  } catch (error) {
    console.warn('Não foi possível criar a extensão pgcrypto. Verifique permissões ou crie manualmente.');
  }

  const senhaCriptografada = await bcrypt.hash(ADMIN_PASSWORD, 10);

  const admin = await prisma.usuario.upsert({
    where: { username: ADMIN_USERNAME },
    update: {},
    create: {
      username: ADMIN_USERNAME,
      nome: ADMIN_NOME,
      email: ADMIN_EMAIL,
      password: senhaCriptografada,
      tipo: "ADMIN",
      status: 'A',
      quantAcesso: 0,
      tentativas: 0
    },
  });

  console.log('Usuário admin criado (ou já existia):', admin);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
