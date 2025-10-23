# 🚀 Deploy - ADRA Sistema

Este projeto pode ser deployado em **Vercel** (recomendado) ou **AlwaysData**. Escolha uma das opções abaixo:

---

## 🔥 Opção 1: Deploy para Vercel (Recomendado)

### Pré-requisitos
- Conta no [Vercel](https://vercel.com)
- CLI do Vercel: `npm i -g vercel`

### 1. Configurar Variáveis de Ambiente no Vercel

No painel do Vercel, adicione:

```bash
# Senha do administrador
ADMIN_PASSWORD=kahoot

# JWT Secret - gere uma nova chave para produção
ADMIN_SESSION_SECRET=prod-secret-adra-2024

# URLs da aplicação (Vercel define automaticamente)
FRONTEND_URL=https://seu-projeto.vercel.app
BACKEND_URL=https://seu-projeto.vercel.app/api
ADMIN_DASHBOARD_URL=https://seu-projeto.vercel.app/admin

# Email (opcional)
EMAIL_MODE=production
ADMIN_EMAILS=admin@adra.org.br
```

### 2. Deploy

```bash
# Build e deploy
npm run build
vercel --prod
```

### 3. Testar Sistema Admin

1. Acesse: `https://seu-projeto.vercel.app`
2. Clique em "Admin" no footer  
3. Use senha: `kahoot` (ou a configurada)

---

## 🏢 Opção 2: Deploy para AlwaysData

### 1. Configuração do Banco MySQL

1. Painel AlwaysData > **Databases > MySQL**
2. Banco: `emanuelprado_banco_de_dados_tcc`
3. Credenciais:
   - Host: `mysql-emanuelprado.alwaysdata.net`
   - User: `emanuelprado` 
   - Password: [sua senha]

### 2. Variáveis de Ambiente AlwaysData

Painel > **Web > Environment variables**:

```bash
NODE_ENV=production
DB_HOST=mysql-emanuelprado.alwaysdata.net
DB_USER=emanuelprado
DB_PASSWORD=[SUA_SENHA_MYSQL]
DB_NAME=emanuelprado_banco_de_dados_tcc
JWT_SECRET=[CHAVE_SEGURA_32_CHARS]
ADMIN_PASSWORD=kahoot
```

### 3. Deploy AlwaysData

```bash
npm install
npm run deploy
```

---

## 🔧 Arquivos de Configuração

### `vercel.json` (para Vercel)
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### `api/` (Funções Serverless Vercel)
- `api/test.js` - Teste da API
- `api/admin/login.js` - Login admin
- `api/admin/logout.js` - Logout admin

---

## ✅ Verificação Pós-Deploy

### Endpoints que devem funcionar:
- `GET /` - Homepage
- `GET /api/test` - Teste API (Vercel)
- `POST /api/admin/login` - Login admin
- `/admin` - Dashboard administrativo

### Teste local:
```bash
npm run build
npm run preview
# Testar em http://localhost:4173
```

---

## 🚨 Solução de Problemas

### Vercel - Erro 404 nas rotas
- Verificar `vercel.json` 
- Confirmar build: `npm run build`

### Admin não funciona
- Verificar `ADMIN_PASSWORD` nas env vars
- Confirmar funções API em `/api/admin/`

### AlwaysData - Prisma não conecta
- Verificar credenciais MySQL
- Executar: `npx prisma db push`

---

**🎯 Recomendação:** Use **Vercel** para deploy rápido e simples. Use **AlwaysData** se precisar de banco MySQL persistente.