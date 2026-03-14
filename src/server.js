require("dotenv").config();
const express = require("express");
const cors = require('cors');
const { connection } = require("./models");

const userRoutes = require("./routes/userRoutes");
const privateRoutes = require("./routes/privateRoutes");
const resourceRoutes = require("./routes/resourceRoutes");
const consultasRoutes = require("./routes/consultasRoutes");
const avaliacaoRoutes = require("./routes/avaliacaoRoutes");

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Prefixo /api para todas as rotas
app.use("/api", userRoutes);
app.use("/api", privateRoutes);
app.use("/api", consultasRoutes);
app.use("/api", avaliacaoRoutes);
app.use("/api", resourceRoutes);

// --- ADICIONE ESTE BLOCO AQUI ---
// Middleware para tratar erros globais e evitar que a API caia
app.use((err, req, res, next) => {
  console.error('⚠️ Erro interno detectado:', err.stack);
  res.status(500).json({ error: 'Erro interno no servidor do Mentalize.' });
});
// --------------------------------

connection.sync({ alter: true })
  .then(() => {
    console.log('✅ Banco de dados sincronizado.');
    app.listen(port, () => {
      console.log(`🚀 API Mentalize rodando em http://localhost:${port}/api`);
    });
  })
  .catch(err => {
    console.error('❌ Erro crítico na sincronização:', err);
  });