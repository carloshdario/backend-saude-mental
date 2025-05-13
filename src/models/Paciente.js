const { Model, DataTypes } = require("sequelize");

class Paciente extends Model {
  static init(sequelize) {
    super.init({
      nome: DataTypes.STRING,  // Adicionando o nome do paciente
    }, { sequelize });
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: "user_id", as: "user" });
    this.hasMany(models.Avaliacao, { foreignKey: "paciente_id", as: "avaliacoes" });
    this.hasMany(models.Consulta, { foreignKey: 'paciente_id', as: 'consultas' });

  }
}

module.exports = Paciente;
 