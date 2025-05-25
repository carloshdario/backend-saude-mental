const User = require("../models/User");
const Paciente = require("../models/Paciente");
const Psicologo = require("../models/Psicologo");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { password } = require("../config/database");
const { Op } = require("sequelize");

module.exports = {
  async register(req, res) {
    const { username, password, role, crp, nome, telefone, endereco } = req.body;

    // Verificar se o tipo de usuário é válido
    if (!['paciente', 'psicologo'].includes(role)) {
      return res.status(400).json({ error: "Tipo de usuário inválido." });
    }

    // Verificar se o CRP é fornecido para psicólogos
    if (role === 'psicologo' && !crp) {
      return res.status(400).json({ error: "CRP é obrigatório para psicólogos." });
    }

    // Verificar se o CRP já existe para psicólogos
    if (role === 'psicologo') {
      const crpExists = await Psicologo.findOne({ where: { crp } });
      if (crpExists) return res.status(400).json({ error: "CRP já cadastrado." });
    }

    // Verificar se o nome de usuário já existe
    const userExists = await User.findOne({ where: { username } });
    if (userExists) return res.status(400).json({ error: "Usuário já existe." });

    // Criptografar a senha
    const hashedPassword = await bcrypt.hash(password, 8);

    // Criar o usuário
    const user = await User.create({
      username,
      password: hashedPassword,
      role,
      nome,
      telefone,
      endereco
    });

    // Criar o paciente ou psicólogo associado ao usuário
    if (role === 'psicologo') {
      await Psicologo.create({
        nome,  
        crp,
        user_id: user.id
      });
    } else if (role === 'paciente') {
      await Paciente.create({
        nome,  
        user_id: user.id
      });
    }

    // Retornar a resposta com os dados do usuário
    return res.status(201).json({ id: user.id, username: user.username, role: user.role, nome: user.nome, telefone: user.telefone, endereco: user.endereco });
  },

  async login(req, res) {
    const { username, password } = req.body;
    
    // Buscar o usuário no banco
    const user = await User.findOne({ where: { username } });

    // Verificar se o usuário existe e se a senha está correta
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Usuário ou senha inválidos." });
    }

    // Gerar o token JWT
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '1d'
    });

    // Retornar o token
    return res.json({ token, role: user.role, id: user.id, nome: user.nome });
  },
  async update(req, res) {
    const { id } = req.params; // O ID do usuário que será atualizado
    const { username, password, role, crp, nome, telefone, endereco } = req.body; // Campos que o usuário pode alterar

    // Verificar se o id do usuário logado é o mesmo que o id que ele está tentando editar
    if (parseInt(id) !== req.userId) {
      return res.status(403).json({ error: "Você não pode editar outro usuário." });
    }

    // Verificar se o tipo de usuário é válido
    if (!['paciente', 'psicologo'].includes(role)) {
      return res.status(400).json({ error: "Tipo de usuário inválido." });
    }

    // Verificar se o CRP é fornecido para psicólogos
    if (role === 'psicologo' && !crp) {
      return res.status(400).json({ error: "CRP é obrigatório para psicólogos." });
    }

    // Buscar o usuário no banco
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado." });
    }

    // Criptografar a senha
    const hashedPassword = await bcrypt.hash(password, 8);

    try {
      // Atualizar os campos do usuário
      await user.update(
        {
          username,
          password: hashedPassword,
          role,
          nome,
          telefone,
          endereco
        },
        {
          where: { id: user.id }
        });

      // Atualiza os campos de psicologo ou paciente
      if (role === 'psicologo') {
        const crpExists = await Psicologo.findOne({
          where: {
            crp: user.crp,
            user_id: { [Op.ne]: user.id }
          }
        });

        // Caso ja exista outro usuario com o mesmo CRP
        if(crpExists) {
          return res.status(404).json({ error: "CRP já cadastrado em outra conta." });
        }

        await Psicologo.update(
          {
            nome: user.nome,  
            crp: user.crp
          },
          {
            where: { id: user.id }
          });

        return res.status(200).json({ 
          id: user.id, 
          username: user.username, 
          role: user.role,
          crp: user.crp,
          nome: user.nome, 
          telefone: user.telefone, 
          endereco: user.endereco 
        });

      } else if (role === 'paciente') {
        await Paciente.update(
          {
            nome: user.nome,  
            user_id: user.id
          },
          {
            where: { id: user.id }
          }
        );

        return res.status(200).json({ 
          id: user.id, 
          username: user.username, 
          role: user.role,
          nome: user.nome, 
          telefone: user.telefone, 
          endereco: user.endereco 
        });
      }

    } catch (error) {
      return res.status(500).json({ error: `Erro ao atualizar o usuário: ${error.message}.` });
    }
  },

  async get(req, res) {
    const { id } = req.params;

    // Verificar se o id do usuário logado é o mesmo que o id que ele está tentando editar
    if (parseInt(id) !== req.userId) {
      return res.status(403).json({ error: "Você não pode editar outro usuário." });
    }

    try {
      const user = await User.findByPk(id, {
        attributes: ['id', 'username', 'password', 'role', 'nome', 'telefone', 'endereco']
      });

      if (!user) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }

      // Se for psicólogo, buscar o CRP
      if (user.role === 'psicologo') {
        const psicologo = await Psicologo.findOne({ where: { user_id: user.id } });
        return res.json({ ...user.toJSON(), password:'', crp: psicologo?.crp });
      }

      // Se for paciente, pode retornar sem o CRP
      return res.json({ ...user.toJSON(), password:'', crp: null });

    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao buscar o usuário' });
    }
  },

  async delete(req, res) {
    const { id } = req.params;

    // Busca o usuário
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado." });
    }

    // Verifica se o usuário está tentando deletar a si mesmo
    // if (parseInt(id) !== req.userId) {
    //   return res.status(403).json({ error: "Você não tem permissão para deletar este usuário." });
    // }

    try {
      // Deleta os registros relacionados, se existirem
      if (user.role === 'psicologo') {
        await Psicologo.destroy({ where: { user_id: user.id } });
      } else if (user.role === 'paciente') {
        await Paciente.destroy({ where: { user_id: user.id } });
      }

      // Deleta o usuário
      await user.destroy();

      return res.status(200).json({ message: "Usuário deletado com sucesso." });

    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro ao deletar o usuário." });
    }
  }

};
