const { Model, DataTypes } = require("sequelize");

class Paciente extends Model {
  static init(sequelize) {
    super.init({
      nome: DataTypes.STRING,
    }, { sequelize, tableName: 'pacientes', underscored: true });
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: "user_id", as: "user" });
    // Importante: a FK aqui deve ser IGUAL a do model Avaliacao
    this.hasMany(models.Avaliacao, { foreignKey: "paciente_id", as: "avaliacoes" });
    this.hasMany(models.Consulta, { foreignKey: 'paciente_id', as: 'consultas' });
  }
}

module.exports = Paciente;