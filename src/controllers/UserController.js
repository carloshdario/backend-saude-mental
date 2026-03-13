const UserService = require("../services/UserService");
const User = require("../models/User");
const Psicologo = require("../models/Psicologo");

module.exports = {
  async register(req, res) {
    try {
      const user = await UserService.register(req.body);
      return res.status(201).json(user);
    } catch (err) {
      const errors = {
        "USUARIO_EXISTE": 400,
        "CRP_EXISTE": 400,
        "TIPO_INVALIDO": 400,
        "CRP_OBRIGATORIO": 400
      };
      return res.status(errors[err.message] || 500).json({ error: err.message });
    }
  },

  async login(req, res) {
    try {
      const result = await UserService.login(req.body.username, req.body.password);
      return res.json(result);
    } catch (err) {
      return res.status(401).json({ error: "Usuário ou senha inválidos." });
    }
  },

  async update(req, res) {
    try {
      const user = await UserService.update(req.params.id, req.userId, req.body);
      return res.json(user);
    } catch (err) {
      if (err.message === "NAO_AUTORIZADO") return res.status(403).json({ error: err.message });
      return res.status(500).json({ error: err.message });
    }
  },

  async get(req, res) {
    const { id } = req.params;
    if (parseInt(id) !== req.userId) return res.status(403).json({ error: "Acesso negado." });

    try {
      const user = await User.findByPk(id, {
        attributes: { exclude: ['password'] }
      });
      if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });

      let crp = null;
      if (user.role === 'psicologo') {
        const psiq = await Psicologo.findOne({ where: { user_id: user.id } });
        crp = psiq?.crp;
      }

      return res.json({ ...user.toJSON(), crp });
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao buscar' });
    }
  },

  async delete(req, res) {
    try {
      await UserService.delete(req.params.id);
      return res.json({ message: "Usuário deletado." });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }
};