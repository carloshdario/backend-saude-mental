const Avaliacao = require('../models/Avaliacao');

class AvaliacaoService {
  /**
   * Busca o histórico completo para a tabela do Angular
   */
  async listarPorPaciente(pacienteId) {
    try {
      return await Avaliacao.findAll({
        where: { paciente_id: pacienteId },
        order: [['data', 'DESC']], // Mais recentes primeiro
        attributes: ['id', 'data', 'descricao', 'cid', 'pontuacao', 'risco', 'observacoes']
      });
    } catch (error) {
      console.error("Erro ao listar avaliações:", error.message);
      throw new Error("Erro ao buscar dados no banco.");
    }
  }

  /**
   * Registra uma nova avaliação clínica ou autoavaliação
   */
  async registrarAvaliacao(dados) {
    // 1. Prioriza o risco que vem do Frontend (Select do Psicólogo)
    // 2. Se não vier (Autoavaliação do paciente), aplica a lógica automática
    let riscoFinal = dados.risco;

    if (!riscoFinal) {
      if (dados.pontuacao >= 8) riscoFinal = 'Leve';
      else if (dados.pontuacao <= 4) riscoFinal = 'Grave';
      else riscoFinal = 'Moderado';
    }

    try {
      return await Avaliacao.create({
        data: dados.data || new Date(),
        descricao: dados.descricao || 'Evolução Clínica',
        cid: dados.cid || null,
        pontuacao: Number(dados.pontuacao),         
        paciente_id: Number(dados.paciente_id),
        psicologo_id: dados.psicologo_id ? Number(dados.psicologo_id) : null,
        consulta_id: dados.consulta_id ? Number(dados.consulta_id) : null,
        risco: riscoFinal,
        observacoes: dados.observacoes || ''
      });
    } catch (error) {
      console.error("Erro Sequelize ao criar avaliação:", error.message);
      throw new Error("Não foi possível salvar o registro clínico.");
    }
  }

  /**
   * Formata dados para o gráfico de evolução do Google Charts/Chart.js
   */
  async buscarProgressoPaciente(pacienteId) {
    try {
      const avaliacoes = await Avaliacao.findAll({
        where: { paciente_id: pacienteId },
        order: [['data', 'ASC']],
        attributes: ['data', 'pontuacao']
      });

      return avaliacoes.map(av => [
        new Date(av.data).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
        av.pontuacao
      ]);
    } catch (error) {
      console.error("Erro ao processar progresso:", error.message);
      throw new Error("Erro ao gerar dados do gráfico.");
    }
  }
}

module.exports = new AvaliacaoService();