const AvaliacaoService = require('../services/AvaliacaoService');
const { Paciente, Psicologo } = require('../models');

class AvaliacaoController {
  store = async (req, res) => {
    try {
      let paciente_id = req.body.pacienteId || req.body.paciente_id;
      let psicologo_id = null;

      if (req.userRole === 'psicologo') {
        const psicologo = await Psicologo.findOne({ where: { user_id: req.userId } });
        psicologo_id = psicologo?.id;
      } else {
        const paciente = await Paciente.findOne({ where: { user_id: req.userId } });
        paciente_id = paciente?.id;
      }

      const nova = await AvaliacaoService.registrarAvaliacao({
        ...req.body,
        paciente_id: Number(paciente_id),
        psicologo_id: psicologo_id,
        consulta_id: req.body.consultaId ? Number(req.body.consultaId) : null
      });
      return res.status(201).json(nova);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  index = async (req, res) => {
    try {
      let pacienteId = req.params.pacienteId;

      // Se for paciente logado, ignora o ID da URL e usa o dele
      if (req.userRole === 'paciente') {
        const p = await Paciente.findOne({ where: { user_id: req.userId } });
        pacienteId = p?.id;
      }

      if (!pacienteId) return res.status(400).json({ error: "Paciente não identificado." });

      const lista = await AvaliacaoService.listarPorPaciente(pacienteId);
      return res.json(lista);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao listar histórico' });
    }
  }

  listarPacientes = async (req, res) => {
    try {
      const pacientes = await Paciente.findAll({ attributes: ['id', 'nome'], order: [['nome', 'ASC']] });
      return res.json(pacientes);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao buscar pacientes' });
    }
  }

  getProgresso = async (req, res) => {
    try {
      const { pacienteId } = req.params;
      const dados = await AvaliacaoService.buscarProgressoPaciente(pacienteId);
      return res.json(dados);
    } catch (error) {
      return res.status(500).json({ error: 'Erro no gráfico' });
    }
  }
}

module.exports = new AvaliacaoController();