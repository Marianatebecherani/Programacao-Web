import express from "express";
import { listFuncionarios } from "../controllers/funcionarioController";
import { authenticateToken, checkAdmin } from "../middlewares/auth";

const router = express.Router();

router.use(authenticateToken);

router.get("/", listFuncionarios);

export default router;
