# 🎮 Projeto ESO

Este repositório contém o **Frontend** e o **Backend** do **Projeto ESO**, incluindo a configuração de um banco de dados **PostgreSQL containerizado com Docker**.  
O projeto também possui **testes automatizados** que validam as principais funcionalidades do sistema.

---

## 📦 Pré-requisitos

Antes de rodar o projeto, certifique-se de ter instalado:

- [Node.js](https://nodejs.org/) (versão mais recente recomendada)
- [Docker Desktop](https://www.docker.com/products/docker-desktop)

---

## 📂 Clonando o projeto

Abra o terminal e execute:

```bash
git clone https://github.com/Gabriel-6/Projeto_ESO.git
```

---

## 🖥️ Frontend

O frontend é um aplicativo **React**, localizado na pasta `Frontend`.

### ▶️ Executando o Frontend

1. Acesse a pasta:

   ```bash
   cd caminho-da-pasta/Frontend
   ```

2. Instale as dependências:

   ```bash
   npm install
   ```

3. Inicie o projeto:

   ```bash
   npm start
   ```

---

## ⚙️ Backend

O backend utiliza **Node.js**, **Prisma ORM** e **PostgreSQL**, sendo o banco de dados executado via **Docker**.

### ▶️ Executando o Backend

1. Acesse a pasta do backend:

   ```bash
   cd caminho-da-pasta/Backend
   ```

2. Instale as dependências:

   ```bash
   npm install
   ```

3. Suba o container do banco de dados:

   ```bash
   docker compose up --build -d
   ```

> Isso criará automaticamente um container com o banco **PostgreSQL**.

4. Rode as migrações do banco:

   ```bash
   npx prisma migrate dev --name eso-db
   ```

5. Inicie o servidor backend:

   ```bash
   npm start
   ```

O backend agora estará rodando normalmente.

---

## 🧪 Testes automatizados

O backend possui testes automatizados que validam o funcionamento das rotas e principais funcionalidades do sistema.

### ▶️ Rodando os testes

1. Acesse novamente a pasta do backend:

   ```bash
   cd caminho-da-pasta/Backend
   ```

2. Execute os testes:

   ```bash
   npm test
   ```

Os testes verificam automaticamente o comportamento das rotas, como **registro**, **login**, **compra** e **venda de itens/pacotes**.

Após a execução, é possível visualizar no **frontend** o item comprado (sempre o mesmo item padrão para teste) acessando:

```
Aba de Usuários → Clique no usuário com email randomizado → Visualize o Histórico do Usuário
```

Lá é possível ver as compras e vendas realizadas nos testes.

---

## 🧰 Tecnologias utilizadas

### Frontend
- React
- Tailwind CSS
- Axios

### Backend
- Node.js
- Express
- Prisma ORM
- PostgreSQL (via Docker)
- Poku / Supertest (para testes automatizados)

---

## 🐳 Docker

O banco de dados é executado em um container Docker configurado via `docker-compose.yml`.

### Comandos úteis

- **Subir os containers:**
  ```bash
  docker compose up --build -d
  ```

- **Derrubar os containers:**
  ```bash
  docker compose down
  ```

---

## 📘 Observações

- Certifique-se de que o **Docker** esteja ativo antes de iniciar o backend.
- Sempre rode as migrações (`npx prisma migrate dev`) antes do primeiro `npm start`.
- O projeto foi desenvolvido com foco em **boas práticas, testes automatizados e containerização.**

---

## 📐 Decisões Técnicas Relevantes

- **Uso do Docker para o banco de dados:**  
  O PostgreSQL foi containerizado utilizando Docker Compose, permitindo padronizar o ambiente e facilitar a configuração em diferentes máquinas.

- **Prisma ORM:**  
  O Prisma foi adotado para simplificar a manipulação de dados e as migrações de banco, reduzindo a complexidade de consultas SQL manuais.

- **Testes automatizados com Poku:**  
  Foi implementado um conjunto de testes automatizados utilizando a biblioteca **Poku**, garantindo o funcionamento correto das principais rotas da aplicação.

- **Frontend com React e Tailwind CSS:**  
  O frontend foi desenvolvido com **React** pela sua componentização e performance, enquanto o **Tailwind CSS** proporcionou agilidade e consistência visual no design.

- **Integração entre frontend e backend:**  
  A comunicação entre o frontend e o backend é feita via **Axios**, garantindo uma integração eficiente e simplificada.

- **Uso de variáveis de ambiente (.env):**  
  Informações sensíveis, como credenciais do banco e chaves de autenticação, são gerenciadas por variáveis de ambiente para aumentar a segurança e a flexibilidade.

- **Autenticação com JWT:**  
  O uso de **JSON Web Tokens** garante que apenas usuários autenticados possam realizar requisições protegidas, aumentando a segurança da aplicação.

