const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth");
const ConsultaController = require("../controllers/ConsultaController");

router.use(authMiddleware); // Aplica auth em todas as rotas abaixo

router.get("/consultas", ConsultaController.index);
router.post("/consultas", ConsultaController.store);
router.get("/consultas/paciente/:pacienteId", ConsultaController.listarPorPaciente); // CORRIGIDO


router.get("/consultas/:id", authMiddleware, ConsultaController.show);
router.put("/consultas/:id", authMiddleware, ConsultaController.update);
router.delete("/consultas/:id", authMiddleware, ConsultaController.delete);

// Rotas de conveniência que usam a mesma lógica de listagem
router.get("/pacientes/:id/consultas", authMiddleware, ConsultaController.index);
router.get("/psicologos/:id/consultas", authMiddleware, ConsultaController.index);
router.get('/consultas/paciente/:pacienteId', authMiddleware, (req, res) => ConsultaController.listarPorPaciente(req, res));
module.exports = router;