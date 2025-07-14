
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();


export const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_FROM,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export const sendInitialPassword = async (to: string, senha: string) => {
  await transporter.sendMail({
    from: `"São José Jets" <${process.env.EMAIL_FROM}>`,
    to,
    subject: "Acesso ao Sistema - São José Jets",
    html: `
      <p>Olá,</p>
      <p>Você foi cadastrado no sistema do São José Jets.</p>
      <p>Sua senha provisória é: <strong>${senha}</strong></p>
      <p>Use-a para acessar e altere sua senha assim que possível.</p>
    `
  });
  console.log(`E-mail enviado para ${to} com a senha provisória.`);
};
export const sendPasswordReset = async (to: string, resetLink: string) => {
  await transporter.sendMail({
    from: `"São José Jets" <${process.env.EMAIL_FROM}>`,
    to,
    subject: "Redefinição de Senha - São José Jets",
    html: `
      <p>Olá,</p>
      <p>Você solicitou a redefinição de senha.</p>
      <p>Clique no link abaixo para redefinir sua senha:</p>
      <a href="${resetLink}">Redefinir Senha</a>
    `
  });
};