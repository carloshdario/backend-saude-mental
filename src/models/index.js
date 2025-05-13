const { Sequelize } = require('sequelize');
const dbConfig = require('../config/database');

// Importando os modelos
const User = require('./User');
const Paciente = require('./Paciente');
const Psicologo = require('./Psicologo');
const Avaliacao = require('./Avaliacao');
const Consulta = require('./Consulta');

// Criando a conexão com o banco
const connection = new Sequelize(dbConfig);

// Inicializando os modelos
User.init(connection);
Paciente.init(connection);
Psicologo.init(connection);
Avaliacao.init(connection);
Consulta.init(connection);

// Associando os modelos
User.associate({ Paciente, Psicologo });
Paciente.associate({ User, Avaliacao, Consulta });
Psicologo.associate({ User, Avaliacao, Consulta });
Avaliacao.associate({ Paciente, Psicologo });
Consulta.associate({ Paciente, Psicologo });

// Sincronizando as tabelas com o banco de dados
connection.sync()
  .then(() => console.log('Tabelas sincronizadas'))
  .catch((err) => console.error('Erro ao sincronizar as tabelas:', err));

module.exports = connection;
