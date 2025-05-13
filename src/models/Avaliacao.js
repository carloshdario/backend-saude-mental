const { Model, DataTypes } = require("sequelize");

class Avaliacao extends Model {
  static init(sequelize) {
    super.init({
      data: DataTypes.DATE,
      risco: DataTypes.STRING,
      observacoes: DataTypes.TEXT
    }, { sequelize });
  }
  static associate(models) {
    this.belongsTo(models.Paciente, { foreignKey: 'pacienteId' });
    this.belongsTo(models.Psicologo, { foreignKey: 'psicologoId' });
  }
}

module.exports = Avaliacao;