  require("dotenv").config();
  const express = require("express");
  const cors = require('cors');

  // --- IMPORTAÇÕES DO SWAGGER ---
  const swaggerUi = require('swagger-ui-express');
  const swaggerSpec = require('./config/swagger'); // Certifique-se que o caminho está correto
  // ------------------------------

  const { connection } = require("./models");

  const userRoutes = require("./routes/userRoutes");
  const privateRoutes = require("./routes/privateRoutes");
  const consultasRoutes = require("./routes/consultasRoutes");
  const avaliacaoRoutes = require("./routes/avaliacaoRoutes");

  const app = express();
  const port = process.env.PORT || 3000;

  app.use(cors());
  app.use(express.static("public"));
  app.use(express.json());

  // --- ROTA DA DOCUMENTAÇÃO SWAGGER ---
  // Acessível em: http://localhost:3000/api-docs
app.get("/swagger.json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

  // Prefixo /api para todas as rotas
  app.use("/api", userRoutes);
  app.use("/api", privateRoutes);
  app.use("/api", consultasRoutes);
  app.use("/api", avaliacaoRoutes);
  

  // Middleware para tratar erros globais
  app.use((err, req, res, next) => {
    console.error('⚠️ Erro interno detectado:', err.stack);
    res.status(500).json({ error: 'Erro interno no servidor do Mentalize.' });
  });

  connection.sync({ alter: true })
    .then(() => {
      console.log('✅ Banco de dados sincronizado.');
      app.listen(port, () => {
        console.log(`🚀 API Mentalize rodando em http://localhost:${port}/api`);
        console.log(`📄 Swagger UI disponível em http://localhost:${port}/api-docs`);
      });
    })
    .catch(err => {
      console.error('❌ Erro crítico na sincronização:', err);
    });