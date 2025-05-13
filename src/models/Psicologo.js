const { Model, DataTypes } = require("sequelize");

class Psicologo extends Model {
  static init(sequelize) {
    super.init({
      nome: DataTypes.STRING,  // Adicionando o nome do psicólogo
      crp: DataTypes.STRING
    }, { sequelize });
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: "user_id", as: "user" });
    this.hasMany(models.Avaliacao, { foreignKey: "psicologo_id", as: "avaliacoes" });
    this.hasMany(models.Consulta, { foreignKey: 'psicologo_id', as: 'consultas' });

  }
}

module.exports = Psicologo;
