const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth")
const AvaliacaoController = require("../controllers/AvaliacaoController");

router.get("/avaliacoes", AvaliacaoController.index);
router.post("/avaliacoes", authMiddleware, AvaliacaoController.store);
router.get("/avaliacoes/:id", AvaliacaoController.show);
router.put("/avaliacoes/:id", authMiddleware, AvaliacaoController.update);
router.delete("/avaliacoes/:id", authMiddleware, AvaliacaoController.delete);
router.get("/pacientes/:id/avaliacoes", AvaliacaoController.avaliacoesPorPaciente);
router.get("/psicologos/:id/avaliacoes", AvaliacaoController.avaliacoesPorPsicologo);

module.exports = router;
