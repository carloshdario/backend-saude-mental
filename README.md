# 🧠 Projeto Express com Sequelize - API RESTful

Este projeto é uma API RESTful construída com **Node.js**, **Express**, **Sequelize** e **MySQL**, seguindo boas práticas de organização e padrões de projeto como MVC e uso de variáveis de ambiente com dotenv.

O projeto está configurado para funcionar juntamente com o projeto [frontend em Angular](https://github.com/guilherme-henrique-silva/projeto-integrador-1).

## 🚀 Tecnologias Utilizadas

- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [Sequelize](https://sequelize.org/)
- [MySQL](https://www.mysql.com/)
- [dotenv](https://www.npmjs.com/package/dotenv)
- [Nodemon](https://nodemon.io/) (para desenvolvimento)

## 📁 Estrutura de Pastas

    src/
    ├── config/ # Configurações (ex: Sequelize, dotenv)
    ├── controllers/ # Lógica de negócio (camada Controller)
    ├── middlewares/ # Autenticação (Token JWT)
    ├── models/ # Models Sequelize (camada Model)
    ├── routes/ # Definição de rotas Express (camada Route)
    ├── services/ # Regras de negócio (opcional)
    ├── database/ # Arquivos de inicialização e criação de DB
    └── server.js # App Express

## ⚙️ Configuração do Ambiente

### 1. Clonar o repositório

```bash
git clone hhttps://github.com/carloshdario/backend-saude-mental.git
cd backend-saude-mental
```

### 2. Instalar as dependências

```bash
npm install
```

### 3. Criar o arquivo ```.env```

    DB_HOST=localhost
    DB_USER=root
    DB_PASSWORD=sua_senha
    DB_NAME=mentalhealth
    PORT=3000
    JWT_SECRET=sua_chave_secreta

## 🧱 Inicialização do Banco de Dados

Antes de iniciar a aplicação, o banco de dados será criado automaticamente se não existir.

O Sequelize se conecta após isso e sincroniza os modelos.

## ▶️ Executando o Projeto

```bash
node .\src\server.js
```

## 📌 Rotas de Exemplo

Lista todos os usuários:

```http
GET /users
```

Cria um novo usuário:

```http
POST /users
```

Retorna um usuário específico:

```http
GET /users/:id
```

## 🧪 Testes

(Opcional) – Você pode usar jest, supertest ou outra ferramenta de testes.

## 🧼 Boas Práticas Implementadas

    ✅ Organização MVC
    ✅ Separação clara entre rotas, controllers e models
    ✅ Uso de variáveis de ambiente (.env)
    ✅ Estrutura modular para escalar o projeto
    ✅ Criação automática do banco de dados com fallback
    ✅ Scripts NPM para dev/prod

## 📄 Licença

Este projeto está licenciado sob a licença MIT. Veja o arquivo LICENSE para mais informações.

## 👤 Autor

Desenvolvido por Carlos Henrique Batista Dario, Guilherme Henrique da Silva e Vitor Hugo Souza Silva para a disciplina de Projeto Integrador I do Eixo de Computação da UNIVESP - Polo Assis (1/2025).

Membros do grupo:

- CARLOS HENRIQUE BATISTA DARIO
- FERNANDA KILL DA SILVA
- GABRIELA HERNANDES DE TOLEDO IUDESNEIDER
- GUILHERME HENRIQUE DA SILVA
- LARISSA STECCA DA SILVA 
- PEDRO HENRIQUE DE OLIVEIRA E OLIVEIRA LIMA
- RAFAEL PRAXEDES ZORZO
- VITOR HUGO SOUZA SILVA
