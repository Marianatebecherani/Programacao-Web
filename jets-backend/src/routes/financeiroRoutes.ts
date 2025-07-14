import express from "express";
import { listTransacoes, createTransacao } from "../controllers/financeiroController";
import { authenticateToken } from "../middlewares/auth";

const router = express.Router();

router.use(authenticateToken);

router.get("/", listTransacoes);
router.post("/", createTransacao);

export default router;
