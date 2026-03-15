const ConsultaService = require("../services/ConsultaService");
const { Paciente, Psicologo } = require("../models");
const { Consulta } = require('../models');

class ConsultaController {
  
  // Método chamado pelo Select dinâmico do Angular
  async listarPorPaciente(req, res) {
    try {
      const { pacienteId } = req.params;
      // Reutiliza a lógica de listagem passando o filtro do paciente
      const consultas = await ConsultaService.listar({ paciente_id: pacienteId });
      return res.json(consultas);
    } catch (error) {
      console.error("Erro ao listar consultas por paciente:", error);
      return res.status(500).json({ error: "Erro interno ao buscar consultas do paciente." });
    }
  }

  async store(req, res) {
    try {
      let paciente_id = req.body.paciente_id || req.body.pacienteId; // Aceita os dois formatos
      let psicologo_id = req.body.psicologo_id || req.body.psicologoId;

      if (req.userRole === 'paciente') {
        const paciente = await Paciente.findOne({ where: { user_id: req.userId } });
        if (!paciente) return res.status(404).json({ error: "Perfil não encontrado." });
        paciente_id = paciente.id;
      } else if (req.userRole === 'psicologo') {
        const psicologo = await Psicologo.findOne({ where: { user_id: req.userId } });
        if (!psicologo) return res.status(404).json({ error: "Perfil não encontrado." });
        psicologo_id = psicologo.id;
      }

      const consulta = await ConsultaService.agendar({
        data: req.body.data,
        paciente_id: Number(paciente_id),
        psicologo_id: Number(psicologo_id),
        observacoes: req.body.observacoes
      });
      return res.status(201).json(consulta);
    } catch (error) {
      return res.status(500).json({ error: "Erro ao agendar consulta." });
    }
  }

  async index(req, res) {
    try {
      const filtros = {};
      if (req.userRole === 'paciente') {
        const p = await Paciente.findOne({ where: { user_id: req.userId } });
        filtros.paciente_id = p?.id;
      } else if (req.userRole === 'psicologo') {
        const ps = await Psicologo.findOne({ where: { user_id: req.userId } });
        filtros.psicologo_id = ps?.id;
      }
      const consultas = await ConsultaService.listar(filtros);
      return res.json(consultas);
    } catch (error) {
      return res.status(500).json({ error: "Erro ao buscar consultas." });
    }
  }
  

  /**
   * Busca uma consulta específica por ID
   */
  async show(req, res) {
    try {
      const consulta = await ConsultaService.buscarPorId(req.params.id);
      if (!consulta) return res.status(404).json({ error: "Consulta não encontrada." });
      return res.json(consulta);
    } catch (error) {
      return res.status(500).json({ error: "Erro ao buscar detalhes da consulta." });
    }
  }

  /**
   * Atualiza uma consulta
   */
  async update(req, res) {
    try {
      // Passa req.userId para o service validar se quem edita é o dono da consulta
      const consulta = await ConsultaService.atualizar(req.params.id, req.userId, req.body);
      return res.json(consulta);
    } catch (error) {
      console.error("--- ERRO NO BACKEND (ConsultaController.update) ---");
      return res.status(400).json({ error: error.message });
    }
  }

  /**
   * Deleta/Cancela uma consulta
   */
  async delete(req, res) {
    try {
      await ConsultaService.cancelar(req.params.id);
      return res.status(204).send();
    } catch (error) {
      console.error("--- ERRO NO BACKEND (ConsultaController.delete) ---");
      return res.status(400).json({ error: error.message });
    }
  }

  async updateStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body; 

      const consulta = await Consulta.findByPk(id);
      
      if (!consulta) {
        return res.status(404).json({ error: 'Consulta não encontrada' });
      }

      consulta.status = status;
      await consulta.save();

      return res.json({ message: 'Status atualizado com sucesso', consulta });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Erro ao atualizar status da consulta' });
    }
  }
}

// IMPORTANTE: Exporta a instância para ser usada nas rotas
module.exports = new ConsultaController();