require("dotenv").config();
const express = require("express");
const cors = require('cors');

// Importamos a 'connection' de dentro do objeto exportado pelo index dos models
const { connection } = require("./models");

const userRoutes = require("./routes/userRoutes");
const privateRoutes = require("./routes/privateRoutes");
const resourceRoutes = require("./routes/resourceRoutes");
const consultasRoutes = require("./routes/consultasRoutes");

const app = express();
const port = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Rotas
app.use("/api", userRoutes);
app.use("/api", privateRoutes);
app.use("/api", resourceRoutes);
app.use("/api", consultasRoutes);

// Inicialização do Banco e Servidor
// Removi o sync() por ser perigoso em produção, mas mantive a autenticação
connection.authenticate()
  .then(() => {
    console.log('✅ Conexão com o banco de dados estabelecida com sucesso.');
    app.listen(port, () => {
      console.log(`🚀 Servidor rodando em http://localhost:${port}`);
    });
  })
  .catch(err => {
    console.error('❌ Erro ao conectar com o banco de dados:', err);
  });