# Configuração de API - Backend e Frontend

## 🔧 Variáveis de Ambiente Configuradas

### `.env.production` (para produção)
```bash
VITE_API_URL=https://emanuelprado.alwaysdata.net
```

### `.env` (para desenvolvimento)
```bash
# Escolha uma das opções:
# VITE_API_URL="http://localhost:3000"     # Para API local
# VITE_API_URL="https://emanuelprado.alwaysdata.net"  # Para API remota
```

## 🎯 Como usar na Vercel

Na Vercel, configure as variáveis de ambiente:

1. Acesse o painel da Vercel
2. Vá em Settings > Environment Variables
3. Adicione:
   - `VITE_API_URL` = `https://seu-backend.render.com` (ou outro serviço)

## 📦 Serviços de Backend Recomendados

### Para hospedar o backend Express:

1. **Render.com** (gratuito)
   - Conecte seu repositório
   - Configure as variáveis: `DATABASE_URL`, `JWT_SECRET`, `PORT`
   - Deploy automático

2. **Railway.app** (gratuito com limites)
   - Similar ao Render
   - Boa integração com bancos PostgreSQL

3. **AlwaysData** (atual configuração)
   - Já configurado
   - MySQL incluído

## 🔄 Fluxo Atual

1. **Frontend (Vercel)**: `https://seu-projeto.vercel.app`
2. **Backend**: Configurável via `VITE_API_URL`
3. **Banco**: Configurável via `DATABASE_URL` no backend

## ✅ Arquivos Atualizados

- ✅ `src/services/apiClient.js` - Usa `VITE_API_URL` como prioridade
- ✅ `src/services/adminApi.js` - Usa `VITE_API_URL` como prioridade  
- ✅ `src/services/AuthService.js` - Corrigida chamada hardcoded
- ✅ `src/pages/PaginaPedidoDoacao.jsx` - Usa nova utility `getApiUrl`
- ✅ `src/utils/apiUrl.js` - Nova utility criada
- ✅ `.env.production` - Adicionada `VITE_API_URL`
- ✅ `.env` - Documentação das opções
- ✅ `.env.example` - Atualizado com exemplos

## 🚀 Próximos Passos

1. Configure `VITE_API_URL` na Vercel apontando para seu backend
2. Faça deploy do backend em Render/Railway/etc
3. Configure `DATABASE_URL` no backend para o banco remoto
4. Teste as integrações