const { Model, DataTypes } = require("sequelize");

class Avaliacao extends Model {
  static init(sequelize) {
    super.init({
      data: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      },
      descricao: DataTypes.STRING,
      cid: DataTypes.STRING,
      pontuacao: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      observacoes: DataTypes.TEXT,
      // ESTES CAMPOS SÃO OBRIGATÓRIOS AQUI PARA O CREATE FUNCIONAR:
      paciente_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      psicologo_id: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      consulta_id: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      risco: {
        type: DataTypes.STRING,
        allowNull: true
      }
    }, { 
      sequelize,
      tableName: 'avaliacoes',
      underscored: true 
    });
  }

  static associate(models) {
    this.belongsTo(models.Paciente, { foreignKey: 'paciente_id', as: 'paciente' });
    this.belongsTo(models.Psicologo, { foreignKey: 'psicologo_id', as: 'psicologo' });
    this.belongsTo(models.Consulta, { foreignKey: 'consulta_id', as: 'consulta' });
  }
}

module.exports = Avaliacao;

