/**
 * @swagger
 * tags:
 *   - name: Usuários
 *     description: Autenticação e perfis (Psicólogos e Pacientes)
 */

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Autentica o usuário e retorna o token JWT
 *     tags: [Usuários]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                 user:
 *                   $ref: '#/components/schemas/User'
 */

/**
 * @swagger
 * /users/psicologos:
 *   get:
 *     summary: Lista todos os psicólogos disponíveis no sistema
 *     tags: [Usuários]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de profissionais
 */
    const express = require("express");
    const router = express.Router();
    const UserController = require("../controllers/UserController");
    const authMiddleware = require("../middlewares/auth")

    router.post("/register", UserController.register);
    router.post("/login", UserController.login);

    router.get("/users/psicologos", authMiddleware, UserController.listPsicologos);

    router.put("/users/:id", authMiddleware, UserController.update);
    router.get("/users/:id", authMiddleware, UserController.get);
    router.delete("/users/:id", authMiddleware, UserController.delete);

    module.exports = router;