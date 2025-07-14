import express from "express";
import { createProduto, listProdutos } from "../controllers/produtoController";
import { authenticateToken, checkAdmin } from "../middlewares/auth";
import multer from "../services/multer";
import { upload } from "../middlewares/upload";

const router = express.Router();

router.use(authenticateToken,);

router.get("/", listProdutos);
router.post("/", upload.single("imagem"), createProduto);

export default router;
