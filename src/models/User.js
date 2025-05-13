const { Model, DataTypes } = require("sequelize");

class User extends Model {
  static init(sequelize) {
    super.init(
      {
        nome: DataTypes.STRING,      // Nome do usuário
        username: DataTypes.STRING,  // Nome de usuário único
        password: DataTypes.STRING,  // Senha do usuário
        role: DataTypes.STRING,      // Tipo de usuário (paciente, psicologo, etc.)
        telefone: DataTypes.STRING,  // Número de telefone
        endereco: DataTypes.STRING,  // Endereço do usuário
      },
      {
        sequelize,
        modelName: "User",  // Definindo explicitamente o nome do modelo
      }
    );
  }

  static associate(models) {
    // Associações entre User e Paciente/Psicologo
    this.hasOne(models.Paciente, { foreignKey: "user_id", as: "paciente" });
    this.hasOne(models.Psicologo, { foreignKey: "user_id", as: "psicologo" });
  }
}

module.exports = User;
