const AvaliacaoService = require('../services/AvaliacaoService');
const { Paciente, Psicologo, Avaliacao } = require('../models');
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
      let filtro = {};
      const { pacienteId } = req.params;

      if (req.userRole === 'paciente') {
        const p = await Paciente.findOne({ where: { user_id: req.userId } });
        if (!p) return res.status(404).json({ error: "Perfil de paciente não encontrado." });
        filtro = { paciente_id: p.id };
      } 
      else if (req.userRole === 'psicologo') {
        const psi = await Psicologo.findOne({ where: { user_id: req.userId } });
        if (!psi) return res.status(404).json({ error: "Perfil de psicólogo não encontrado." });

        if (pacienteId && pacienteId !== 'me') {
          filtro = { paciente_id: pacienteId, psicologo_id: psi.id };
        } else {
          filtro = { psicologo_id: psi.id };
        }
      }

      // Buscamos as avaliações incluindo o nome do paciente
      const lista = await Avaliacao.findAll({
        where: filtro,
        order: [['data', 'DESC']],
        include: [
          {
            model: Paciente,
            as: 'paciente',
            attributes: ['nome'] // Trazemos apenas o nome para otimizar
          }
        ]
      });

      return res.json(lista);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao listar histórico clínico.' });
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
    let { pacienteId } = req.params;

    // Se o ID for 'me', buscamos quem é o paciente dono desse Token
    if (pacienteId === 'me') {
      const p = await Paciente.findOne({ where: { user_id: req.userId } });
      if (!p) return res.status(404).json({ error: "Paciente não encontrado." });
      pacienteId = p.id;
    }

    const dados = await AvaliacaoService.buscarProgressoPaciente(pacienteId);
    return res.json(dados);
  } catch (error) {
    console.error('Erro no gráfico:', error);
    return res.status(500).json({ error: 'Erro ao gerar dados do gráfico' });
  }
}

  async show(req, res) {
    try {
      const { id } = req.params;
      const avaliacao = await Avaliacao.findByPk(id);
      
      if (!avaliacao) {
        return res.status(404).json({ error: 'Avaliação não encontrada' });
      }
      return res.json(avaliacao);
    } catch (err) {
      return res.status(500).json({ error: 'Erro ao buscar avaliação' });
    }
  }

  async destroy(req, res) {
    try {
      const { id } = req.params;
      const avaliacao = await Avaliacao.findByPk(id);
      
      if (!avaliacao) {
        return res.status(404).json({ error: 'Avaliação não encontrada' });
      }

      await avaliacao.destroy();
      return res.json({ message: 'Avaliação removida com sucesso' });
    } catch (err) {
      return res.status(500).json({ error: 'Erro ao remover avaliação' });
    }
  }
}

module.exports = new AvaliacaoController();