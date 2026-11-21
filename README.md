# Web2 Loja — CRUD com MySQL e Node.js

Projeto desenvolvido para a atividade prática da disciplina **Desenvolvimento Web 2**, com integração entre banco de dados MySQL, servidor Node.js e interface web.

A aplicação permite consultar produtos, pesquisar por nome, excluir produtos e cadastrar categorias.

## Tecnologias utilizadas

- HTML5
- CSS3
- JavaScript
- Node.js
- Express
- MySQL
- mysql2
- dotenv

## Funcionalidades

- Listagem de produtos armazenados no MySQL.
- Busca de produtos pelo nome.
- Consulta de categorias cadastradas.
- Cadastro de novas categorias.
- Exclusão de produtos.
- Exibição dos preços no formato monetário brasileiro.
- Interface responsiva para diferentes tamanhos de tela.
- Consultas SQL utilizando placeholders para maior segurança.

## Estrutura do projeto

```text
web2-loja/
├── public/
│   ├── index.html
│   ├── style.css
│   └── app.js
├── src/
│   ├── db.js
│   └── server.js
├── .env
├── .gitignore
├── package.json
├── package-lock.json
└── README.md
```

## Pré-requisitos

Antes de executar o projeto, é necessário ter instalado:

- [Node.js](https://nodejs.org/)
- [MySQL Server](https://dev.mysql.com/downloads/mysql/)
- [MySQL Workbench](https://dev.mysql.com/downloads/workbench/)

## Configuração do banco de dados

1. Abra o MySQL Workbench.
2. Conecte-se ao servidor MySQL.
3. Execute o script `web2_loja.sql` para criar o banco de dados, as tabelas e o usuário da aplicação.
4. Confira se o banco `web2_loja` foi criado corretamente.

O banco utiliza as tabelas:

- `produto`: armazena nome, preço, estoque e categoria do produto.
- `categoria`: armazena os nomes das categorias.

## Configuração da aplicação

Clone o repositório:

```bash
git clone https://github.com/Matheus-Venceslau/projetoLojaWebComCRUD.git
```

Entre na pasta do projeto:

```bash
cd projetoLojaWebComCRUD
```

Instale as dependências:

```bash
npm install
```

Crie um arquivo `.env` na raiz do projeto com as configurações do banco de dados:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=app_web2
DB_PASSWORD=sua_senha
DB_NAME=web2_loja
PORT=3000
```

Substitua `sua_senha` pela senha configurada para o usuário MySQL `app_web2`.

## Executando o projeto

Inicie o servidor:

```bash
npm start
```

A aplicação estará disponível em:

[http://localhost:3000](http://localhost:3000)

## Endpoints da API

| Método | Endpoint | Descrição |
|---|---|---|
| GET | `/produtos` | Lista todos os produtos |
| GET | `/produtos?busca=tec` | Busca produtos pelo nome |
| GET | `/categorias` | Lista todas as categorias |
| POST | `/categorias` | Cadastra uma categoria |
| DELETE | `/produtos/:id` | Exclui um produto pelo ID |

### Exemplo de busca

```http
GET /produtos?busca=tec
```

A busca utiliza `LIKE` com placeholder (`?`) e parâmetros preparados, evitando a concatenação direta da entrada do usuário na consulta SQL.

### Exemplo de cadastro de categoria

Requisição:

```http
POST /categorias
Content-Type: application/json
```

Corpo:

```json
{
  "nome": "Acessórios"
}
```

## Segurança

- As credenciais do banco de dados são armazenadas no arquivo `.env`.
- O arquivo `.env` é ignorado pelo Git através do `.gitignore`.
- As consultas SQL utilizam placeholders para evitar SQL Injection.
- A aplicação utiliza um usuário MySQL específico, com permissões limitadas ao banco da atividade.

## Objetivo acadêmico

O projeto tem como objetivo praticar a integração entre front-end, back-end e banco de dados, utilizando rotas HTTP, consultas SQL, operações CRUD e consumo de API com JavaScript.

---

Desenvolvido por **Matheus Venceslau**.