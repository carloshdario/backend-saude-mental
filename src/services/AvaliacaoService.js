const { Avaliacao } = require('../models'); // Importe usando destructuring para garantir consistência

class AvaliacaoService {
  /**
   * Busca o histórico. Agora aceita um objeto de filtro para ser flexível.
   */
 async listarComFiltro(filtro) {
    try {
      return await Avaliacao.findAll({
        where: filtro, // <--- Isso permite filtrar por paciente_id OU psicologo_id
        order: [['data', 'DESC']],
        attributes: ['id', 'data', 'descricao', 'cid', 'pontuacao', 'risco', 'observacoes']
      });
    } catch (error) {
      throw new Error("Erro ao buscar dados no banco.");
    }
  }

  /**
   * Registro de avaliação (Lógica de risco mantida, apenas limpeza de tipos)
   */
  async registrarAvaliacao(dados) {
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
   * Dados para o gráfico (Mantido, mas com proteção de dados vazios)
   */
  async buscarProgressoPaciente(pacienteId) {
    try {
      const avaliacoes = await Avaliacao.findAll({
        where: { paciente_id: pacienteId },
        order: [['data', 'ASC']],
        attributes: ['data', 'pontuacao']
      });

      // Retorna array formatado para Google Charts: [['Data', 'Nota'], ...]
      const formatados = avaliacoes.map(av => [
        new Date(av.data).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
        av.pontuacao
      ]);

      return formatados;
    } catch (error) {
      console.error("Erro ao processar progresso:", error.message);
      throw new Error("Erro ao gerar dados do gráfico.");
    }
  }
}

module.exports = new AvaliacaoService();