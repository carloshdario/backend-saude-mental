require("dotenv").config();
const express = require("express");
const cors = require('cors');
const app = express();
const port = 3000;

const connection = require("./models"); // Vai sincronizar os modelos
require("./models");
const consultasRoutes = require("./routes/consultasRoutes")
const userRoutes = require("./routes/userRoutes");
const privateRoutes = require("./routes/privateRoutes");
const resourceRoutes = require("./routes/resourceRoutes");

app.use(cors());
app.use(express.json());

app.use("/api", userRoutes);
app.use("/api", privateRoutes);
app.use("/api", resourceRoutes);
app.use("/api", consultasRoutes);

connection.sync().then(() => {
  app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
  });
});
