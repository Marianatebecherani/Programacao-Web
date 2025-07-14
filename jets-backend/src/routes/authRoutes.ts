import express from "express";
import { login, register, recuperarSenha, resetarSenha } from "../controllers/authController";
import { userInfo, changePassword } from "../controllers/userController";
import { authenticateToken } from "../middlewares/auth";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";    

const router = express.Router();

router.post("/login", login); // rota de login
router.post("/register", register); // somente para admin
const prisma = new PrismaClient();
router.post("/change-password", authenticateToken, changePassword);
router.get("/me", authenticateToken, userInfo);
router.post('/recuperar-senha', recuperarSenha);
router.post('/resetar-senha', resetarSenha);


export default router;