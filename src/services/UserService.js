const { User, Paciente, Psicologo, connection } = require("../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");

class UserService {
  async register(data) {
    const { username, password, role, crp, nome, telefone, endereco } = data;

    if (!['paciente', 'psicologo'].includes(role)) throw new Error("TIPO_INVALIDO");
    if (role === 'psicologo' && !crp) throw new Error("CRP_OBRIGATORIO");

    const userExists = await User.findOne({ where: { username } });
    if (userExists) throw new Error("USUARIO_EXISTE");

    if (role === 'psicologo') {
      const crpExists = await Psicologo.findOne({ where: { crp } });
      if (crpExists) throw new Error("CRP_EXISTE");
    }

    // Usando a conexão centralizada para a transação
    const t = await connection.transaction();

    try {
      const hashedPassword = await bcrypt.hash(password, 8);

      const user = await User.create({
        username, password: hashedPassword, role, nome, telefone, endereco
      }, { transaction: t });

      if (role === 'psicologo') {
        await Psicologo.create({ nome, crp, user_id: user.id }, { transaction: t });
      } else {
        await Paciente.create({ nome, user_id: user.id }, { transaction: t });
      }

      await t.commit();
      
      const userRes = user.toJSON();
      delete userRes.password;
      return userRes;
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }

  async login(username, password) {
    const user = await User.findOne({ where: { username } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new Error("CREDENCIAIS_INVALIDAS");
    }

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '1d'
    });

    return { token, role: user.role, id: user.id, nome: user.nome };
  }

  async update(id, loggedUserId, updateData) {
    if (parseInt(id) !== loggedUserId) throw new Error("NAO_AUTORIZADO");

    const user = await User.findByPk(id);
    if (!user) throw new Error("NAO_ENCONTRADO");

    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 8);
    }

    const t = await connection.transaction();

    try {
      await user.update(updateData, { transaction: t });

      if (user.role === 'psicologo') {
        const crpExists = await Psicologo.findOne({
          where: { 
            crp: updateData.crp || user.crp, 
            user_id: { [Op.ne]: user.id } 
          }
        });
        if (crpExists) throw new Error("CRP_DUPLICADO");

        await Psicologo.update(
          { nome: updateData.nome, crp: updateData.crp }, 
          { where: { user_id: user.id }, transaction: t }
        );
      } else if (user.role === 'paciente') {
        await Paciente.update(
          { nome: updateData.nome }, 
          { where: { user_id: user.id }, transaction: t }
        );
      }

      await t.commit();
      return user;
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }

  async delete(id) {
    const user = await User.findByPk(id);
    if (!user) throw new Error("NAO_ENCONTRADO");

    const t = await connection.transaction();
    try {
      if (user.role === 'psicologo') {
        await Psicologo.destroy({ where: { user_id: user.id }, transaction: t });
      } else {
        await Paciente.destroy({ where: { user_id: user.id }, transaction: t });
      }
      await user.destroy({ transaction: t });
      await t.commit();
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }
}

module.exports = new UserService();