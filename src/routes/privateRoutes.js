const { Router } = require('express');
const authMiddleware = require('../middlewares/auth');

// Aqui estava o erro: faltava declarar o router
const routes = new Router();

// Certifique-se de usar o nome da variável que você criou (routes)
routes.get("/dashboard", authMiddleware, async (req, res) => {
  try {
    // Aqui vai a lógica do seu dashboard
    return res.json({ 
      message: `Bem-vindo ao dashboard, ${req.userRole}`,
      userId: req.userId 
    });
  } catch (error) {
    return res.status(500).json({ error: "Erro ao carregar dashboard" });
  }
});

module.exports = routes;