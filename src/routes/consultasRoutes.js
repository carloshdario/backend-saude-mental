const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth")
const ConsultaController = require("../controllers/ConsultaController")

router.get("/consultas", ConsultaController.index);
router.post("/consultas", authMiddleware, ConsultaController.store);
router.get("/consultas/:id", ConsultaController.show);
router.put("/consultas/:id", authMiddleware, ConsultaController.update);
router.delete("/consultas/:id", authMiddleware, ConsultaController.delete);
router.get("/pacientes/:id/consultas", ConsultaController.consultasPorPaciente);
router.get("/psicologos/:id/consultas", ConsultaController.consultasPorPsicologo);

module.exports = router;
