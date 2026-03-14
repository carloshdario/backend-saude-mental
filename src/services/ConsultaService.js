const { Consulta, Paciente, Psicologo } = require("../models");

class ConsultaService {
  async agendar(dados) {
    // O log abaixo ajuda a ver o que está chegando no seu terminal Ubuntu
    console.log("Service recebendo dados para agendamento:", dados);

    return await Consulta.create({
      data: dados.data,
      paciente_id: dados.paciente_id,
      psicologo_id: dados.psicologo_id,
      observacoes: dados.observacoes,
      status: "agendada"
    });
  }

  async listar(filtros) {
    const where = {};
    if (filtros.paciente_id) where.paciente_id = filtros.paciente_id;
    if (filtros.psicologo_id) where.psicologo_id = filtros.psicologo_id;

    return await Consulta.findAll({
      where,
      include: [
        { model: Paciente, as: 'paciente', attributes: ['id', 'nome'] },
        { model: Psicologo, as: 'psicologo', attributes: ['id', 'nome'] }
      ],
      order: [['data', 'ASC']]
    });
  }

  async buscarPorId(id) {
    return await Consulta.findByPk(id, {
      include: [
        { model: Paciente, as: 'paciente', attributes: ['id', 'nome'] },
        { model: Psicologo, as: 'psicologo', attributes: ['id', 'nome'] }
      ]
    });
  }

  async cancelar(id) {
    const consulta = await Consulta.findByPk(id);
    if (!consulta) throw new Error("CONSULTA_NAO_ENCONTRADA");
    return await consulta.destroy();
  }
}

module.exports = new ConsultaService();