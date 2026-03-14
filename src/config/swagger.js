const swaggerJSDoc = require("swagger-jsdoc");
const path = require("path");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Mentalize API",
      version: "1.0.0",
      description: `
API REST do sistema **Mentalize**.

Funcionalidades principais:
• Autenticação JWT  
• Gestão de psicólogos e pacientes  
• Agendamento de consultas  
• Avaliações clínicas  
• Monitoramento de progresso psicológico
      `,
      contact: {
        name: "Equipe Mentalize",
        email: "suporte@mentalize.com"
      }
    },
    // 4. Adição de múltiplos ambientes
    servers: [
      {
        url: "http://localhost:3000/api",
        description: "Servidor Local (Desenvolvimento)"
      },
      {
        url: "https://api.mentalize.com/v1",
        description: "Servidor de Produção"
      }
    ],
    // 2. Tags pré-definidas para organizar a UI igual à sua sidebar
    tags: [
      { name: "Autenticação", description: "Rotas de login e registro" },
      { name: "Usuários", description: "Gestão de pacientes e psicólogos" },
      { name: "Consultas", description: "Agendamentos e calendário" },
      { name: "Avaliações", description: "Testes e métricas de acompanhamento" }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Insira o token JWT no formato: Bearer {seu_token}"
        }
      },
      // 5. Schemas reutilizáveis (Exemplo de Erro Padrão)
      schemas: {
        ErroPadrao: {
          type: "object",
          properties: {
            erro: {
              type: "boolean",
              example: true
            },
            mensagem: {
              type: "string",
              example: "Mensagem detalhada do erro."
            }
          }
        }
      }
    }
    // 1. security: [{ bearerAuth: [] }] foi removido daqui para evitar bloquear o /login
  },
  // 3. Caminhos absolutos garantem que o Swagger sempre encontre os arquivos
  apis: [
    path.join(__dirname, "../routes/*.js"), // Ajuste este caminho conforme a estrutura da sua pasta
    path.join(__dirname, "../controllers/*.js") // Você também pode ler os docs dos controllers, se preferir
  ]
};

module.exports = swaggerJSDoc(options);