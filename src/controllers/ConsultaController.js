// controllers/ConsultaController.js
const Consulta = require("../models/Consulta");
const Paciente = require("../models/Paciente");
const Psicologo = require("../models/Psicologo");

module.exports = {
  // 1. Listar todas as consultas com filtros opcionais
  async index(req, res) {
    const { paciente_id, psicologo_id, data } = req.query;
    const where = {};

    if (paciente_id) where.paciente_id = paciente_id;
    if (psicologo_id) where.psicologo_id = psicologo_id;
    if (data) where.data = data;

    try {
      const consultas = await Consulta.findAll({
        where,
        include: [
          { model: Paciente, as: 'paciente', attributes: ['id', 'nome'] },
          { model: Psicologo, as: 'psicologo', attributes: ['id', 'nome'] }
        ],
        attributes: ['id', 'data', 'status', 'observacoes']
      });

      return res.status(200).json(consultas);
    } catch (error) {
      console.error("Erro ao buscar consultas:", error);
      return res.status(500).json({ error: "Erro ao buscar consultas." });
    }
  },

  // 2. Criar nova consulta (psicólogo autenticado)
  async store(req, res) {
    const { data, paciente_id, observacoes } = req.body;
    const userId = req.userId;

    try {
      const paciente = await Paciente.findByPk(paciente_id);
      if (!paciente) return res.status(404).json({ error: "Paciente não encontrado." });

      const psicologo = await Psicologo.findOne({ where: { user_id: userId } });
      if (!psicologo) return res.status(403).json({ error: "Apenas psicólogos podem criar consultas." });

      const consulta = await Consulta.create({
        data,
        paciente_id,
        psicologo_id: psicologo.id,
        observacoes,
        status: "agendada"
      });

      return res.status(201).json(consulta);
    } catch (error) {
      console.error("Erro ao criar consulta:", error);
      return res.status(500).json({ error: "Erro ao criar consulta." });
    }
  },

  // 3. Ver detalhes de uma consulta
  async show(req, res) {
    const { id } = req.params;

    try {
      const consulta = await Consulta.findByPk(id, {
        include: [
          { model: Paciente, as: 'paciente', attributes: ['id', 'nome'] },
          { model: Psicologo, as: 'psicologo', attributes: ['id', 'nome'] }
        ]
      });

      if (!consulta) return res.status(404).json({ error: "Consulta não encontrada." });

      return res.status(200).json(consulta);
    } catch (error) {
      console.error("Erro ao buscar consulta:", error);
      return res.status(500).json({ error: "Erro ao buscar consulta." });
    }
  },

  // 4. Atualizar uma consulta
  async update(req, res) {
    const { id } = req.params;
    const { data, observacoes } = req.body;
    const userId = req.userId;

    try {
      const consulta = await Consulta.findByPk(id);
      if (!consulta) return res.status(404).json({ error: "Consulta não encontrada." });

      const psicologo = await Psicologo.findOne({ where: { user_id: userId } });
      if (!psicologo || consulta.psicologo_id !== psicologo.id) {
        return res.status(403).json({ error: "Você não tem permissão para editar esta consulta." });
      }

      await consulta.update({ data, observacoes });
      return res.status(200).json(consulta);
    } catch (error) {
      console.error("Erro ao atualizar consulta:", error);
      return res.status(500).json({ error: "Erro ao atualizar consulta." });
    }
  },

  // 5. Deletar uma consulta
  async delete(req, res) {
    const { id } = req.params;
    const userId = req.userId;

    try {
      const consulta = await Consulta.findByPk(id);
      if (!consulta) return res.status(404).json({ error: "Consulta não encontrada." });

      const psicologo = await Psicologo.findOne({ where: { user_id: userId } });
      if (!psicologo || consulta.psicologo_id !== psicologo.id) {
        return res.status(403).json({ error: "Você não tem permissão para excluir esta consulta." });
      }

      await consulta.destroy();
      return res.status(204).send();
    } catch (error) {
      console.error("Erro ao excluir consulta:", error);
      return res.status(500).json({ error: "Erro ao excluir consulta." });
    }
  },

  // 6. Listar consultas de um paciente específico
  async consultasPorPaciente(req, res) {
    const { id } = req.params;

    try {
      const consultas = await Consulta.findAll({
        where: { paciente_id: id },
        include: [
          { model: Psicologo, as: 'psicologo', attributes: ['id', 'nome'] }
        ],
        attributes: ['id', 'data', 'status', 'observacoes']
      });

      return res.status(200).json(consultas);
    } catch (error) {
      console.error("Erro ao buscar consultas do paciente:", error);
      return res.status(500).json({ error: "Erro ao buscar consultas do paciente." });
    }
  },

  // 7. Listar consultas de um psicólogo específico
  async consultasPorPsicologo(req, res) {
    const { id } = req.params;

    try {
      const consultas = await Consulta.findAll({
        where: { psicologo_id: id },
        include: [
          { model: Paciente, as: 'paciente', attributes: ['id', 'nome'] }
        ],
        attributes: ['id', 'data', 'status', 'observacoes']
      });

      return res.status(200).json(consultas);
    } catch (error) {
      console.error("Erro ao buscar consultas do psicólogo:", error);
      return res.status(500).json({ error: "Erro ao buscar consultas do psicólogo." });
    }
  }
};
