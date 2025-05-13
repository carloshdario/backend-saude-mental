const express = require("express");
const auth = require("../middlewares/auth");
const { Paciente, Psicologo, Avaliacao } = require("../models");
const router = express.Router();

// Paciente
router.post("/pacientes", auth, async (req, res) => {
  const paciente = await Paciente.create(req.body);
  res.json(paciente);
});

router.get("/pacientes", auth, async (req, res) => {
  const pacientes = await Paciente.findAll();
  res.json(pacientes);
});

// Psicologo
router.post("/psicologos", auth, async (req, res) => {
  const psicologo = await Psicologo.create(req.body);
  res.json(psicologo);
});

router.get("/psicologos", auth, async (req, res) => {
  const psicologos = await Psicologo.findAll();
  res.json(psicologos);
});

// Avaliação
router.post("/avaliacoes", auth, async (req, res) => {
  const avaliacao = await Avaliacao.create(req.body);
  res.json(avaliacao);
});

router.get("/avaliacoes", auth, async (req, res) => {
  const avaliacoes = await Avaliacao.findAll();
  res.json(avaliacoes);
});

module.exports = router;
