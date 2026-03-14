const { Model, DataTypes } = require("sequelize");

class Consulta extends Model {
  static init(sequelize) {
    super.init({
      data: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING,
        defaultValue: 'agendada',
      },
      observacoes: DataTypes.TEXT,
      paciente_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'pacientes', key: 'id' }
      },
      psicologo_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'psicologos', key: 'id' }
      }
    }, { 
      sequelize, 
      modelName: 'Consulta',
      underscored: true // Importante para bater com paciente_id
    });
  }

  static associate(models) {
    this.belongsTo(models.Paciente, { foreignKey: 'paciente_id', as: 'paciente' });
    this.belongsTo(models.Psicologo, { foreignKey: 'psicologo_id', as: 'psicologo' });
  }
}

module.exports = Consulta;