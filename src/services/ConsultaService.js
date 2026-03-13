const { Consulta, Paciente, Psicologo } = require("../models");

class ConsultaService {
  async listar(filtros) {
    const { paciente_id, psicologo_id, data } = filtros;
    const where = {};

    if (paciente_id) where.paciente_id = paciente_id;
    if (psicologo_id) where.psicologo_id = psicologo_id;
    if (data) where.data = data;

    return await Consulta.findAll({
      where,
      include: [
        { model: Paciente, as: 'paciente', attributes: ['id', 'nome'] },
        { model: Psicologo, as: 'psicologo', attributes: ['id', 'nome'] }
      ],
      attributes: ['id', 'data', 'status', 'observacoes']
    });
  }

  async agendar(userId, { data, paciente_id, observacoes }) {
    const paciente = await Paciente.findByPk(paciente_id);
    if (!paciente) throw new Error("PACIENTE_NAO_ENCONTRADO");

    const psicologo = await Psicologo.findOne({ where: { user_id: userId } });
    if (!psicologo) throw new Error("APENAS_PSICOLOGOS_AGENDAM");

    return await Consulta.create({
      data,
      paciente_id,
      psicologo_id: psicologo.id,
      observacoes,
      status: "agendada"
    });
  }

  async buscarPorId(id) {
    const consulta = await Consulta.findByPk(id, {
      include: [
        { model: Paciente, as: 'paciente', attributes: ['id', 'nome'] },
        { model: Psicologo, as: 'psicologo', attributes: ['id', 'nome'] }
      ]
    });
    if (!consulta) throw new Error("CONSULTA_NAO_ENCONTRADA");
    return consulta;
  }

  async atualizar(id, userId, dados) {
    const consulta = await Consulta.findByPk(id);
    if (!consulta) throw new Error("CONSULTA_NAO_ENCONTRADA");

    const psicologo = await Psicologo.findOne({ where: { user_id: userId } });
    if (!psicologo || consulta.psicologo_id !== psicologo.id) {
      throw new Error("SEM_PERMISSAO");
    }

    return await consulta.update(dados);
  }

  async cancelar(id, userId) {
    const consulta = await Consulta.findByPk(id);
    if (!consulta) throw new Error("CONSULTA_NAO_ENCONTRADA");

    const psicologo = await Psicologo.findOne({ where: { user_id: userId } });
    if (!psicologo || consulta.psicologo_id !== psicologo.id) {
      throw new Error("SEM_PERMISSAO");
    }

    return await consulta.destroy();
  }
}

module.exports = new ConsultaService();