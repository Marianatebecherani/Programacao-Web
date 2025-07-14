import express from "express";
import {
  createAtleta,
  listAtletas,
  getAtleta,
  updateAtleta,
  deleteAtleta
} from "../controllers/atletaController";
import { authenticateToken, checkAdmin } from "../middlewares/auth";
import multer from "../services/multer";
import { upload } from "../middlewares/upload";
import path from "path";

const router = express.Router();

router.use(authenticateToken, checkAdmin); // apenas admins podem usar

router.post("/", upload.single("imagem"), createAtleta);
router.get("/", listAtletas);
router.get("/:id", getAtleta);
router.put("/:id", updateAtleta);
router.delete("/:id", deleteAtleta);

export default router;
