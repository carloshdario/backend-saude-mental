const AvaliacaoService = require('../services/AvaliacaoService');

class AvaliacaoController {
  // POST /avaliacoes
  async store(req, res) {
    try {
      const novaAvaliacao = await AvaliacaoService.registrarAvaliacao(req.body);
      return res.status(201).json(novaAvaliacao);
    } catch (error) {
      return res.status(400).json({ error: 'Erro ao registrar avaliação' });
    }
  }

  // GET /avaliacoes/progresso/:pacienteId
  async getProgresso(req, res) {
    try {
      const { pacienteId } = req.params;
      const dadosGrafico = await AvaliacaoService.buscarProgressoPaciente(pacienteId);
      return res.json(dadosGrafico);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao processar dados do gráfico' });
    }
  }
}

module.exports = new AvaliacaoController();