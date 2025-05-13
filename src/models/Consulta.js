const { Model, DataTypes } = require("sequelize");

class Consulta extends Model {
  static init(sequelize) {
    super.init({
      data: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          isDate: true, // Valida se o valor é uma data
        }
      },
      status: {
        type: DataTypes.STRING, // Ex: 'agendada', 'realizada', 'cancelada'
        defaultValue: 'agendada',
        allowNull: false
      },
      observacoes: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      paciente_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'pacientes', // Certifique-se de que o nome da tabela no banco é "pacientes"
          key: 'id'
        }
      },
      psicologo_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'psicologos', // Certifique-se de que o nome da tabela no banco é "psicologos"
          key: 'id'
        }
      }
    }, { sequelize, modelName: 'Consulta' });
  }

  static associate(models) {
    this.belongsTo(models.Paciente, { foreignKey: 'paciente_id', as: 'paciente' });
    this.belongsTo(models.Psicologo, { foreignKey: 'psicologo_id', as: 'psicologo' });
  }
}

module.exports = Consulta;
