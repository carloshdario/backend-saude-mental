const Avaliacao = require("../models/Avaliacao");
const Paciente = require("../models/Paciente");
const Psicologo = require("../models/Psicologo");

module.exports = {
  // 1. Listar todas as avaliacoes com filtros opcionais
  async index(req, res) {
    const { paciente_id, psicologo_id, data, risco } = req.query;
    const where = {};

    if (paciente_id) where.paciente_id = paciente_id;
    if (psicologo_id) where.psicologo_id = psicologo_id;
    if (data) where.data = data;
    if (risco) where.risco = risco;

    try {
      const avaliacoes = await Avaliacao.findAll({
        where,
        include: [
          { model: Paciente, as: 'paciente', attributes: ['id', 'nome'] },
          { model: Psicologo, as: 'psicologo', attributes: ['id', 'nome'] }
        ],
        attributes: ['id', 'data', 'risco', 'observacoes']
      });

      return res.status(200).json(avaliacoes);
    } catch (error) {
      console.error("Erro ao buscar avaliacoes:", error);
      return res.status(500).json({ error: "Erro ao buscar avaliacoes." });
    }
  },

  // 2. Criar nova avaliacao (psicólogo autenticado)
  async store(req, res) {
    const { data, paciente_id, risco, observacoes } = req.body;
    const userId = req.userId;

    try {
      const paciente = await Paciente.findByPk(paciente_id);
      if (!paciente) return res.status(404).json({ error: "Paciente não encontrado." });

      const psicologo = await Psicologo.findOne({ where: { user_id: userId } });
      if (!psicologo) return res.status(403).json({ error: "Apenas psicólogos podem criar consultas." });

      const avaliacao = await Avaliacao.create({
        data,
        paciente_id,
        psicologo_id: psicologo.id,
        observacoes,
        risco
      });

      return res.status(201).json(avaliacao);
    } catch (error) {
      console.error("Erro ao criar avaliacao:", error);
      return res.status(500).json({ error: "Erro ao criar avaliacao." });
    }
  },

  // 3. Ver detalhes de uma avaliacao
  async show(req, res) {
    const { id } = req.params;

    try {
      const avaliacao = await Avaliacao.findByPk(id, {
        include: [
          { model: Paciente, as: 'paciente', attributes: ['id', 'nome'] },
          { model: Psicologo, as: 'psicologo', attributes: ['id', 'nome'] }
        ]
      });

      if (!avaliacao) return res.status(404).json({ error: "Avaliacao não encontrada." });

      return res.status(200).json(avaliacao);
    } catch (error) {
      console.error("Erro ao buscar avaliacao:", error);
      return res.status(500).json({ error: "Erro ao buscar avaliacao." });
    }
  },

  // 4. Atualizar uma avaliacao
  async update(req, res) {
    const { id } = req.params;
    const { data, observacoes, risco } = req.body;
    const userId = req.userId;

    try {
      const avaliacao = await Avaliacao.findByPk(id);
      if (!avaliacao) return res.status(404).json({ error: "Avaliacao não encontrada." });

      const psicologo = await Psicologo.findOne({ where: { user_id: userId } });
      if (!psicologo || avaliacao.psicologo_id !== psicologo.id) {
        return res.status(403).json({ error: "Você não tem permissão para editar esta avaliacao." });
      }

      await avaliacao.update({ data, observacoes, risco });
      return res.status(200).json(avaliacao);
    } catch (error) {
      console.error("Erro ao atualizar avaliacao:", error);
      return res.status(500).json({ error: "Erro ao atualizar avaliacao." });
    }
  },

  // 5. Deletar uma avaliacao
  async delete(req, res) {
    const { id } = req.params;
    const userId = req.userId;

    try {
      const avaliacao = await Avaliacao.findByPk(id);
      if (!avaliacao) return res.status(404).json({ error: "Avaliacao não encontrada." });

      const psicologo = await Psicologo.findOne({ where: { user_id: userId } });
      if (!psicologo || avaliacao.psicologo_id !== psicologo.id) {
        return res.status(403).json({ error: "Você não tem permissão para excluir esta avaliacao." });
      }

      await consulta.destroy();
      return res.status(204).send();
    } catch (error) {
      console.error("Erro ao excluir consulta:", error);
      return res.status(500).json({ error: "Erro ao excluir consulta." });
    }
  },

  // 6. Listar avaliacoes de um paciente específico
  async avaliacoesPorPaciente(req, res) {
    const { id } = req.params;

    try {
      const avaliacoes = await Avaliacao.findAll({
        where: { paciente_id: id },
        include: [
          { model: Psicologo, as: 'psicologo', attributes: ['id', 'nome'] }
        ],
        attributes: ['id', 'data', 'risco', 'observacoes']
      });

      return res.status(200).json(avaliacoes);
    } catch (error) {
      console.error("Erro ao buscar avaliacoes do paciente:", error);
      return res.status(500).json({ error: "Erro ao buscar avaliacoes do paciente." });
    }
  },

  // 7. Listar avaliacoes de um psicólogo específico
  async avaliacoesPorPsicologo(req, res) {
    const { id } = req.params;

    try {
      const avaliacoes = await Avaliacao.findAll({
        where: { psicologo_id: id },
        include: [
          { model: Paciente, as: 'paciente', attributes: ['id', 'nome'] }
        ],
        attributes: ['id', 'data', 'risco', 'observacoes']
      });

      return res.status(200).json(avaliacoes);
    } catch (error) {
      console.error("Erro ao buscar avaliacoes do psicólogo:", error);
      return res.status(500).json({ error: "Erro ao buscar avaliacoes do psicólogo." });
    }
  }
};
