const { Sequelize } = require('sequelize');
const dbConfig = require('../config/database');
const fs = require('fs');
const path = require('path');

const connection = new Sequelize(dbConfig);

const models = {};

// Lê todos os arquivos da pasta Models e inicializa
fs.readdirSync(__dirname)
  .filter(file => (file.indexOf('.') !== 0) && (file !== 'index.js') && (file.slice(-3) === '.js'))
  .forEach(file => {
    const model = require(path.join(__dirname, file));
    if (model.init) {
      model.init(connection);
      models[model.name] = model;
    }
  });

// Executa as associações automaticamente
Object.values(models).forEach(model => {
  if (model.associate) {
    model.associate(connection.models);
  }
});

// Exporta a conexão e os modelos prontos para uso
module.exports = {
  connection,
  ...models
};