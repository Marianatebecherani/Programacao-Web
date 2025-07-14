import express from "express";
import {
  listUsers,
  getUser,
  updateUser,
  deleteUser,
  getMe,
} from "../controllers/userController";
import { authenticateToken } from "../middlewares/auth";

const router = express.Router();

router.use(authenticateToken); // Protege todas as rotas

router.get("/me", getMe);
router.get("/", listUsers);
router.get("/:username", getUser);
router.put("/:username", updateUser);
router.delete("/:username", deleteUser);

export default router;
// Este arquivo define as rotas relacionadas aos usuários, protegidas por autenticação.
