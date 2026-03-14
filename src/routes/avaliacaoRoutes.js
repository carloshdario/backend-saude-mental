const { Router } = require('express');
const AvaliacaoController = require('../controllers/AvaliacaoController');
const authMiddleware = require('../middlewares/auth');

const routes = new Router();

// Aplica o middleware de autenticação em todas as rotas deste arquivo
routes.use(authMiddleware);

/**
 * ROTAS DE AVALIAÇÃO
 */

// Histórico: Criamos duas rotas separadas em vez de usar o "?"
// 1. Para o Paciente (sem ID na URL, busca pelo token)
routes.get('/avaliacoes/paciente', (req, res) => AvaliacaoController.index(req, res));
// 2. Para o Psicólogo (passando o ID do paciente na URL)
routes.get('/avaliacoes/paciente/:pacienteId', (req, res) => AvaliacaoController.index(req, res));

// Gráfico de Progresso
routes.get('/avaliacoes/progresso/:pacienteId', (req, res) => AvaliacaoController.getProgresso(req, res));

// Cadastro de nova avaliação
routes.post('/avaliacoes', (req, res) => AvaliacaoController.store(req, res));

/**
 * ROTAS AUXILIARES
 */

// Lista de pacientes para o Select do Psicólogo
routes.get('/pacientes', (req, res) => AvaliacaoController.listarPacientes(req, res));

// Lista de consultas de um paciente específico (usado no formulário)
// Certifique-se que o método listarConsultasPorPaciente existe no AvaliacaoController
routes.get('/consultas/paciente/:pacienteId', (req, res) => AvaliacaoController.listarConsultasPorPaciente(req, res));

module.exports = routes;