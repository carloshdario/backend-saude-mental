// src/routes/avaliacaoRoutes.js
const { Router } = require('express');
const AvaliacaoController = require('../controllers/AvaliacaoController');
const authMiddleware = require('../middlewares/auth');

const routes = new Router();

// Rota para salvar uma nova avaliação (usada pelo psicólogo)
routes.post('/avaliacoes', authMiddleware, AvaliacaoController.store);

// Rota para buscar os dados do gráfico (usada pelo dashboard)
routes.get('/avaliacoes/progresso/:pacienteId', authMiddleware, AvaliacaoController.getProgresso);

module.exports = routes;