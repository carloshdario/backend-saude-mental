/**
 * @swagger
 * tags:
 *   - name: Consultas
 *     description: Agendamentos e controle de sessões
 */

const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth");
const ConsultaController = require("../controllers/ConsultaController");

router.use(authMiddleware);

/**
 * @swagger
 * /consultas:
 *   get:
 *     summary: Lista todas as consultas do usuário logado
 *     tags: [Consultas]
 *     responses:
 *       200:
 *         description: Lista de consultas
 *   post:
 *     summary: Agenda uma nova consulta
 *     tags: [Consultas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Consulta'
 *     responses:
 *       201:
 *         description: Consulta agendada
 */
router.get("/consultas", ConsultaController.index);
router.post("/consultas", ConsultaController.store);

/**
 * @swagger
 * /consultas/paciente/{pacienteId}:
 *   get:
 *     summary: Lista consultas de um paciente
 *     tags: [Consultas]
 *     parameters:
 *       - in: path
 *         name: pacienteId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de consultas do paciente
 */
router.get("/consultas/paciente/:pacienteId", ConsultaController.listarPorPaciente);

/**
 * @swagger
 * /consultas/{id}:
 *   get:
 *     summary: Busca uma consulta específica
 *     tags: [Consultas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Consulta encontrada
 */
router.get("/consultas/:id", ConsultaController.show);

/**
 * @swagger
 * /consultas/{id}:
 *   put:
 *     summary: Atualiza uma consulta
 *     tags: [Consultas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Consulta atualizada
 */
router.put("/consultas/:id", ConsultaController.update);

/**
 * @swagger
 * /consultas/{id}:
 *   delete:
 *     summary: Cancela uma consulta
 *     tags: [Consultas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Consulta cancelada
 */
router.delete("/consultas/:id", ConsultaController.delete);
// Adicione junto com as outras rotas de consulta
router.put('/consultas/:id/status', authMiddleware, ConsultaController.updateStatus);

/**
 * Rotas auxiliares
 */
router.get("/pacientes/:id/consultas", ConsultaController.index);
router.get("/psicologos/:id/consultas", ConsultaController.index);

module.exports = router;