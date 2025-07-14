import express from "express";
import { listTorcedores } from "../controllers/torcedorController";
import { authenticateToken } from "../middlewares/auth";

const router = express.Router();

router.use(authenticateToken);

router.get("/", listTorcedores);

export default router;
