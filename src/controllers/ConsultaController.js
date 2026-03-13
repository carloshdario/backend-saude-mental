const ConsultaService = require("../services/ConsultaService");

module.exports = {
  async index(req, res) {
    try {
      // Criamos um objeto de filtros combinando Query Params e Path Params
      const filtros = { ...req.query };

      // Se a rota for /pacientes/:id/consultas, o Express preenche req.params.id
      // Verificamos a URL para saber onde atribuir esse ID
      if (req.params.id) {
        if (req.baseUrl.includes('pacientes')) {
          filtros.paciente_id = req.params.id;
        } else if (req.baseUrl.includes('psicologos')) {
          filtros.psicologo_id = req.params.id;
        }
      }

      const consultas = await ConsultaService.listar(filtros);
      return res.status(200).json(consultas);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro ao buscar consultas." });
    }
  },

  async store(req, res) {
    try {
      const consulta = await ConsultaService.agendar(req.userId, req.body);
      return res.status(201).json(consulta);
    } catch (error) {
      const status = error.message === "PACIENTE_NAO_ENCONTRADO" ? 404 : 403;
      return res.status(status).json({ error: error.message });
    }
  },

  async show(req, res) {
    try {
      const consulta = await ConsultaService.buscarPorId(req.params.id);
      return res.status(200).json(consulta);
    } catch (error) {
      return res.status(404).json({ error: error.message });
    }
  },

  async update(req, res) {
    try {
      const consulta = await ConsultaService.atualizar(req.params.id, req.userId, req.body);
      return res.status(200).json(consulta);
    } catch (error) {
      const status = error.message === "SEM_PERMISSAO" ? 403 : 404;
      return res.status(status).json({ error: error.message });
    }
  },

  async delete(req, res) {
    try {
      await ConsultaService.cancelar(req.params.id, req.userId);
      return res.status(204).send();
    } catch (error) {
      const status = error.message === "SEM_PERMISSAO" ? 403 : 404;
      return res.status(status).json({ error: error.message });
    }
  }
};