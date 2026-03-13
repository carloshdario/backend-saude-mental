// No topo do arquivo src/config/database.js
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') }); // Garante o caminho correto

module.exports = {
  dialect: "mysql",
  host: process.env.DB_HOST,
  username: process.env.DB_USER, // Verifique se o nome da variável no .env é DB_USER
  password: process.env.DB_PASS, // Verifique se o nome da variável no .env é DB_PASS
  database: process.env.DB_NAME,
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true
  },
};