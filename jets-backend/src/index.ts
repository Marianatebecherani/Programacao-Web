import express from "express";
import dotenv from "dotenv";
import atletaRoutes from "./routes/atletaRoutes";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import torcedorRoutes from "./routes/torcedorRoutes";
import funcionarioRoutes from "./routes/funcionarioRoutes";
import produtoRoutes from "./routes/produtoRoutes";
import eventoRoutes from "./routes/eventoRoutes";
import financeiroRoutes from "./routes/financeiroRoutes";
import cors from "cors";
import path from "path";
import { PrismaClient } from '@prisma/client';



dotenv.config();
const app = express();

app.use(cors({
  origin: 'http://localhost:3001', // frontend Next.js
  credentials: true
}));

app.use(express.json());

app.use("/auth", authRoutes);
app.use("/usuarios", userRoutes);
app.use("/atletas", atletaRoutes);
app.use("/torcedores", torcedorRoutes);
app.use("/funcionarios", funcionarioRoutes);
app.use("/produtos", produtoRoutes);
app.use("/eventos", eventoRoutes);
app.use("/financeiro", financeiroRoutes);
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
export default app;
