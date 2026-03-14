/**
 * @swagger
 * tags:
 *   - name: Avaliações
 *     description: Gestão de avaliações psicológicas e progresso do paciente
 */

const { Router } = require('express');
const AvaliacaoController = require('../controllers/AvaliacaoController');
const authMiddleware = require('../middlewares/auth');

const routes = new Router();

routes.use(authMiddleware);

/**
 * @swagger
 * /avaliacoes/paciente:
 *   get:
 *     summary: Lista avaliações do paciente logado
 *     tags: [Avaliações]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de avaliações do paciente
 */

/**
 * @swagger
 * /avaliacoes/paciente/{pacienteId}:
 *   get:
 *     summary: Lista avaliações de um paciente específico (psicólogo)
 *     tags: [Avaliações]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: pacienteId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de avaliações do paciente
 */

// Histórico de avaliações
routes.get('/avaliacoes/paciente', AvaliacaoController.index);
routes.get('/avaliacoes/paciente/:pacienteId', AvaliacaoController.index);

/**
 * @swagger
 * /avaliacoes/progresso/{pacienteId}:
 *   get:
 *     summary: Retorna o progresso das avaliações de um paciente
 *     tags: [Avaliações]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: pacienteId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Dados de progresso das avaliações
 */

// Progresso do paciente
routes.get('/avaliacoes/progresso/:pacienteId', AvaliacaoController.getProgresso);

/**
 * @swagger
 * /avaliacoes:
 *   post:
 *     summary: Cria uma nova avaliação psicológica
 *     tags: [Avaliações]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - pontuacao
 *               - paciente_id
 *             properties:
 *               descricao:
 *                 type: string
 *               cid:
 *                 type: string
 *               pontuacao:
 *                 type: integer
 *               observacoes:
 *                 type: string
 *               paciente_id:
 *                 type: integer
 *               psicologo_id:
 *                 type: integer
 *               consulta_id:
 *                 type: integer
 *               risco:
 *                 type: string
 *     responses:
 *       201:
 *         description: Avaliação criada com sucesso
 */

// Criar avaliação
routes.post('/avaliacoes', AvaliacaoController.store);

/**
 * @swagger
 * /pacientes:
 *   get:
 *     summary: Lista pacientes disponíveis para avaliação
 *     tags: [Avaliações]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de pacientes
 */

// Lista pacientes
routes.get('/pacientes', AvaliacaoController.listarPacientes);

module.exports = routes;