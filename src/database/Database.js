const mysql = require('mysql2/promise');
require('dotenv').config();

async function createDatabaseIfNotExists() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
  });

  await connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\`;`);
  console.log(`Banco de dados '${process.env.DB_NAME}' verificado/criado.`);

  await connection.end();
}

module.exports = createDatabaseIfNotExists;
