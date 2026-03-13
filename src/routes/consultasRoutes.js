const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth");
const ConsultaController = require("../controllers/ConsultaController");

// Rotas padrão
router.get("/consultas", ConsultaController.index);
router.post("/consultas", authMiddleware, ConsultaController.store);
router.get("/consultas/:id", ConsultaController.show);
router.put("/consultas/:id", authMiddleware, ConsultaController.update);
router.delete("/consultas/:id", authMiddleware, ConsultaController.delete);

// Ajuste: O Controller refatorado usa o 'index' para filtrar por query params
// Se você quiser manter essas URLs específicas, elas devem apontar para o index
router.get("/pacientes/:id/consultas", ConsultaController.index);
router.get("/psicologos/:id/consultas", ConsultaController.index);

module.exports = router;