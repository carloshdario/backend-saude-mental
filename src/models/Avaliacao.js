const { Model, DataTypes } = require("sequelize");

class Avaliacao extends Model {
  static init(sequelize) {
    super.init({
      data: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      },
      pontuacao: {
        type: DataTypes.INTEGER, // Essencial para o gráfico (0-10)
        allowNull: false
      },
      risco: DataTypes.STRING,      // Ex: "Grave", "Moderado"
      observacoes: DataTypes.TEXT
    }, { 
      sequelize,
      tableName: 'avaliacoes' 
    });
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'pacienteId', as: 'paciente' });
    this.belongsTo(models.User, { foreignKey: 'psicologoId', as: 'psicologo' });
  }
}

module.exports = Avaliacao;