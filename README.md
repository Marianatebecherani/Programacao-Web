# Projeto: Sistema de Gestão - São José Jets

Este projeto é uma aplicação web com autenticação e controle de usuários para uma associação esportiva de Futebol Americano — São José Jets. Desenvolvido em TypeScript com Node.js, Express, PostgreSQL e Prisma ORM.

---

## 🔧 Tecnologias Utilizadas

- **TypeScript**
- **Node.js + Express**
- **PostgreSQL**
- **Prisma ORM**
- **JWT (JSON Web Token)**
- **Bcrypt (criptografia de senhas)**

---

## 📦 Instalação do Backend

1. Clone o repositório:

```bash
git clone https://github.com/Marianatebecherani/Programacao-Web.git
cd Programacao-Web/jets-backend
```

2. Instale as dependências:

```bash
npm install
```

3. Crie o arquivo `.env` com o conteúdo:

```
DATABASE_URL="postgresql://usuario:senha@localhost:5432/jets?schema=public"
JWT_SECRET="jetssecret"

ADMIN_USERNAME="usuarioadmin"
ADMIN_NOME="nomeadmin"
ADMIN_EMAIL="email@admin"
ADMIN_PASSWORD="senhaadmin"

SEND_EMAILS="true"
EMAIL_FROM="email@admin"
EMAIL_PASSWORD="passwordadmin"
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT="587"
EMAIL_SECURE="false"
```

4. Configure o banco de dados:

```bash
npm run prisma:migrate
```

5. Execute o seed para criar o usuario administrador:

```bash
npm run seed
```

6. Inicie o servidor:

```bash
npm run dev
```

---

## 👨‍💻 Testes

Para testar as rotas, você pode usar:

- [Postman](https://www.postman.com/)
- [Insomnia](https://insomnia.rest/)

---

---

## 📦 Instalação do Frontend

1. Clone o repositório:

```bash
git clone https://github.com/Marianatebecherani/Programacao-Web.git
cd ProgramacaoWeb/jets-frontend
```

2. Instale as dependências:

```bash
npm install
```

3. Crie o arquivo `.env.local` com o conteúdo:

```
NEXT_PUBLIC_API_URL=http://localhost:3000
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRATION=2h
```

4.  Inicie o servidor:

```bash
npm run dev
```

## 📚 Licença

Este projeto é apenas para fins educacionais. Todos os direitos reservados à desenvolvedora Mariana Rebelo Tebecherani. 🏈
