import express from "express";
import { createEvento, listEventos, updateEvento, deleteEvento } from "../controllers/eventoController";
import { authenticateToken } from "../middlewares/auth";

const router = express.Router();

router.use(authenticateToken);

router.post("/", createEvento);       // criar evento
router.get("/", listEventos);         // listar eventos
router.put("/:id", updateEvento);     // editar evento
router.delete("/:id", deleteEvento);  // excluir evento

export default router;