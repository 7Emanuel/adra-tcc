# Relatório Completo do Projeto ADRA

Data: 22/10/2025
Repositório: `ADRA-sonnet` (branch: main)
Autor: danielzukowskipaixao

Este documento apresenta uma visão 360° do sistema de doações da ADRA (web + API), cobrindo objetivos, arquitetura, módulos, fluxos de uso, endpoints, dados/persistência, segurança, execução, notificações, painel administrativo, lacunas e um roteiro de demonstração.

## 1) Visão Geral

- Propósito: Plataforma moderna para facilitar doações financeiras e de itens, e para organizar pedidos de ajuda de beneficiários, com validação administrativa.
- Público-alvo: Doadores, Beneficiários (necessitados), Equipe administrativa da ADRA.
- Status (out/2025):
  - Frontend SPA (React + Vite + Tailwind) completo para doações e fluxo do necessitado.
  - Backend Node/Express funcional para: autenticação básica (JWT), ingestão/consulta de beneficiários, painel admin (validação, export CSV), agendamento de coletas.
  - Persistência: arquivos JSON (demo) + suporte opcional a Prisma (SQLite) se `DATABASE_URL` for configurado.
  - Notificações por e-mail: implementadas e opcionais (ativadas via SMTP em `.env`).

Principais tecnologias
- React 18, Vite 7, Tailwind CSS 3
- React Router DOM 7, React Hook Form + Zod (validação)
- Node.js 18+, Express 4, JWT
- Nodemailer (e-mail), CORS, cookie-parser
- Prisma (opcional), SQLite (datasource default no schema)

## 2) Arquitetura e Módulos

Frontend (SPA)
- Local: `src/`
- Roteamento: React Router (`src/App.jsx`)
- Contexto de autenticação: `src/contexts/AuthContext.jsx` (consome `src/services/userApi.js`)
- Serviços HTTP: `src/services/apiClient.js` (usa token em localStorage)
- Estilo: Tailwind (`tailwind.config.js`, `src/index.css`)
- Páginas principais (`src/pages/`):
  - Doações: `DonorHub.jsx`, `DoarTransferencia.jsx`, `DoarItens.jsx`, `MapaUnidades.jsx`, `ComoFunciona.jsx`
  - Fluxo Necessitado: `DecisorNecessitado.jsx`, `LoginCadastro.jsx`, `PaginaEsperaValidacao.jsx`, `ContaValidada.jsx`, `PaginaPedidoDoacao.jsx`
  - Admin: `AdminDashboard.jsx` (completo), `AdminDashboardSimple.jsx` (demo)
- Componentes relevantes:
  - Gerais: `Header.jsx`, `Footer.jsx`, `Button.jsx`, `Modal.jsx`, `ErrorBoundary.jsx`
  - Doar: `components/doar/SchedulePickupModal.jsx`
  - Necessitado: `components/necessitado/*` (endereço, itens, termos, etc.)

Backend (API)
- Local: `server/`
- Entrada: `server/index.js` (carrega env, inicializa Express, middlewares e rotas)
- Módulos:
  - Autenticação de usuário: `server/auth.js` (bcrypt, JWT, Prisma opcional)
  - Painel Admin: `server/admin.js` (rotas protegidas por sessão via cookie)
  - E-mail: `server/services/emailService.js` (Nodemailer; modo simulado opcional)
  - DB/Prisma: `server/db.js` (conexão condicional a depender de `DATABASE_URL`)
  - Dados em arquivo (demo): `server/data/*.json` (beneficiários, doações, agendamentos)

Dados/Persistência
- Arquivos JSON (demo):
  - Beneficiários: `server/data/beneficiaries.json`
  - Doações: `server/data/donations.json`
  - Agendamentos de coleta: `server/data/schedules.json` (criado sob demanda)
- Prisma (opcional): `prisma/schema.prisma` (datasource sqlite). Observação: ver seção “Lacunas” sobre inconsistência de campos.

Infra de dev/execução
- Dev server (SPA): porta 5173
- API: porta 3000 (configurável via `PORT`)
- Proxy Vite: `/api` → `http://localhost:3000` (config em `vite.config.js`)

## 3) Fluxos de Uso (End-to-end)

Doação por Transferência/PIX
- Páginas: `/doar` → `/doar/transferencia`
- Recursos: exibe dados bancários/PIX, permite anexar comprovante (UI), e mostra recibo/agradecimento.
- Observação: anexos e confirmação são simulados no frontend (sem upload real nesta versão).

Doação de Itens (entrega ou coleta)
- Páginas: `/doar` → `/doar/itens` → `/doar/itens/unidades`
- Funcionalidades:
  - Lista de “Itens Aceitos”/“Não Aceitos” (UI)
  - Localização aproximada via Geolocation API ou endereço manual (geocoding via Nominatim)
  - Ordenação de unidades por distância ou nome, com rota no Google Maps
  - Agendamento de coleta via modal (`SchedulePickupModal`) que envia POST para a API

Fluxo do Necessitado (pedido de ajuda)
- Início: `/preciso-de-ajuda`
- Passos:
  1) Seleção de itens (reserva local) → redireciona para autenticação
  2) Autenticação em `/login-cadastro` (mock local no frontend) e ingestão do beneficiário no backend via `/api/beneficiaries`
  3) Tela de espera em `/espera-validacao`: consulta periódica `GET /api/beneficiaries/status?email=...`
  4) Após aprovação no Admin, redireciona para `/conta-validada` e, então, `/pedir-doacao`
  5) Em `/pedir-doacao`: formulário avançado (endereço manual ou coordenadas, itens, urgência, termos) com rascunho em localStorage

Painel Administrativo
- Rota: `/admin`
- Autenticação: senha única via modal; cria cookie `admin_session` (httpOnly)
- Funcionalidades:
  - Beneficiários: listar (filtro por status pendente), ver detalhes, aprovar/rejeitar (com motivo), exportar CSV
  - Doações: listar (em `server/data/donations.json`), agendar, exportar CSV
  - Rate limit simples no login (5 tentativas a cada 5 min por IP)

## 4) Endpoints da API (resumo)

Públicos/Usuário
- POST `/auth/register` → cria usuário (requer Prisma ativo); payload: `{ name, email, senha, telefone, endereco, cidade, estado }`
- POST `/auth/login` → retorna `{ token, user }`
- GET  `/auth/me` → retorna usuário atual (via Authorization: Bearer)

Beneficiários (arquivo)
- POST `/api/beneficiaries` → cria/atualiza registro pendente; envia e-mail aos admins (se SMTP ativo)
- GET  `/api/beneficiaries/status?email=...` → `{ exists, status, reason }`

Agendamentos de Coleta
- POST `/coletas/agendar` → cria registro em `server/data/schedules.json`

Admin (via cookie de sessão e proxy `/api/admin` do Vite)
- POST `/api/admin/login` → cria cookie `admin_session`
- POST `/api/admin/logout`
- GET  `/api/admin/beneficiaries` → paginação, filtro e busca
- GET  `/api/admin/beneficiaries/:id`
- PATCH `/api/admin/beneficiaries/:id/validate` → `{ approved: boolean, reason? }` e e-mail ao beneficiário
- GET  `/api/admin/donations` | `/:id` | `export.csv`
- PATCH `/api/admin/donations/:id`

Observações
- Healthcheck: GET `/health` → `{ ok: true }`
- Em desenvolvimento, se `DATABASE_URL` não estiver definido, o backend opera sem Prisma e a autenticação de usuário por DB fica limitada/inativa.

## 5) Dados e Persistência

- Beneficiários (arquivo): estrutura com `id`, `name`, `email`, `phone`, `address`, `status` (`pending|validated|rejected`), `history[]`, `notes`.
- Doações (arquivo): lista de registros com `donor`, `type`, `status`, `items[]`, `timeline[]`.
- Agendamentos (arquivo): dados do solicitante, endereço, disponibilidade, itens e status `novo`.
- Frontend (localStorage):
  - `adra_user` (sessão mock do necessitado)
  - `adra_origin` (origem: gps/manual)
  - `adra_pickup_prefill` (prefill do agendamento)
  - `pedido_rascunho` (draft do pedido de doação)

Prisma (opcional)
- `prisma/schema.prisma` define `User` com `email`, `password`, `telefone`, `endereço`, `cidade`, `estado`. Ver “Lacunas” para alinhar com o código (`senha`, `endereco` sem acento).

## 6) Notificações por E-mail

- Serviço: `server/services/emailService.js` (Nodemailer)
- Disparo automático:
  - Novo beneficiário cadastrado → e-mail aos administradores
  - Admin valida/rejeita → e-mail ao beneficiário
- Modos:
  - Desenvolvimento (simulado): `EMAIL_MODE=development` (log no console, sem envio real)
  - Produção: requer `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS` (+ `SMTP_PORT`, `SMTP_SECURE`)
- Guia de configuração: `GUIA_NOTIFICACOES.md`

Importante: há um ajuste necessário no código — trocar `nodemailer.createTransporter(...)` por `nodemailer.createTransport(...)`.

## 7) Segurança e Autenticação

Usuário (JWT)
- Login retorna `token` (JWT assinado via `JWT_SECRET`, expiração 1 dia). O frontend inclui `Authorization: Bearer` automaticamente.
- `GET /auth/me` exige token válido; middleware popula `req.user`.

Admin (cookie de sessão)
- Login no painel gera `admin_session` (httpOnly, `sameSite=lax`, `secure` em prod) assinado com `ADMIN_SESSION_SECRET`.
- Rate limit para `/api/admin/login` (5 tentativas/5min por IP).

CORS e Proxy
- CORS liberado para `*` em dev (recomenda-se restringir em produção).
- Frontend usa proxy do Vite para `/api`.

Variáveis sensíveis
- `ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET`, `JWT_SECRET`, `SMTP_*`, `DATABASE_URL` — não commitar; usar `.env`.

## 8) Como Executar (Windows PowerShell)

Pré-requisitos
- Node.js 18+

Instalar dependências
```powershell
npm install
```

Iniciar backend (porta 3000)
```powershell
$env:ADMIN_PASSWORD="daniel"; $env:ADMIN_SESSION_SECRET="dev-secret"; $env:JWT_SECRET="dev-jwt"; npm run dev:server
```

Iniciar frontend (em outro terminal)
```powershell
npm run dev
```

Acessos
- SPA: http://localhost:5173
- Admin: abra a Home e clique “Entrar como administrador” (senha padrão: `daniel`) para acessar `/admin`

SMTP (opcional)
```powershell
$env:SMTP_HOST="smtp.gmail.com"; $env:SMTP_PORT="587"; $env:SMTP_SECURE="false"; $env:SMTP_USER="seu-email"; $env:SMTP_PASS="sua-senha"
```

Prisma (opcional)
```powershell
# Exemplo SQLite
$env:DATABASE_URL="file:./dev.db"; npx prisma migrate dev --name init
```

## 9) Roteiro de Demonstração (5–10 min)

1) Doações
- Acesse `/doar` → mostre as duas opções
- Em “Transferência”: exiba dados/PIX e simule comprovante
- Em “Itens”: veja lista de aceitos/não aceitos; vá a “Unidades”; permita localização ou informe endereço manual; abrir rota no Google Maps; agendar coleta (abre modal e envia para `/coletas/agendar`)

2) Necessitado
- Vá para “Preciso de Ajuda” → selecione itens → redirecione para login/cadastro
- Cadastre novo e-mail; será criado registro pendente em `/api/beneficiaries`
- Tela “Espera Validação” consulta status periodicamente

3) Admin
- Abra `/admin`; faça login (senha padrão `daniel`)
- Liste pendentes, veja detalhes, aprove/rejeite (preencher motivo para rejeição)
- Observe e-mail (se SMTP ativo); exporte CSV
- Ao aprovar, volte à SPA e mostre o redirecionamento automático para `/conta-validada` → `/pedir-doacao`

## 10) Lacunas, Alertas e Melhorias

Inconsistências/bugs atuais
- Prisma x Código: `server/auth.js` usa campos `senha` e `endereco`, mas o schema define `password` e `endereço` (com acento). Ajustar: alinhar nomes em ambos (sugerido: `password`, `endereco`).
- Nodemailer: usar `createTransport` (não `createTransporter`). Sem isso, e-mails reais não funcionam.
- DB opcional: se `DATABASE_URL` não setado, rotas que dependem de Prisma ficam limitadas/indisponíveis (ex.: listar usuários em `/users`). O fluxo do necessitado funciona porque usa arquivo JSON.
- Geocoding Nominatim: uso direto do endpoint público (rate limit). Para produção, considerar chave/serviço dedicado.
- CORS aberto a `*` em dev: restringir origens confiáveis em produção.

Roadmap sugerido (alto impacto → fácil)
- Corrigir schema Prisma e sincronizar com o backend; migrar autenticação do necessitado para API real
- Corrigir EmailService (createTransport) e adicionar logs estruturados
- Persistir agendamentos e doações no DB (substituir arquivos JSON)
- Implementar upload de comprovantes e anexos (S3/Cloud Storage)
- Mapas com Leaflet real (markers, clustering) e caches de geocoding
- Segurança: CSRF para rotas admin, CORS restrito, melhores políticas de cookies
- Observabilidade: logs, métricas, tracing; health-checks avançados

## 11) Métricas e Transparência

- Métricas previstas (README/docs): conversão por tipo de doação, tempo por etapa, abandono, preferências por unidade
- Instrumentação futura: GA4, eventos customizados, funis, heatmaps

## 12) Anexos e Referências

- README do projeto: `README.md` (com visão geral, scripts, rotas)
- Guia de Teste do Fluxo: `GUIA_TESTE_FLUXO.md`
- Notificações por e-mail: `GUIA_NOTIFICACOES.md`
- Implementação Doações: `docs/IMPLEMENTACAO_DOACOES.md`
- Proxy e dev server: `vite.config.js`
- Painel Admin (frontend): `src/pages/AdminDashboard.jsx` e `src/components/AdminLoginModal.jsx`
- API Admin (backend): `server/admin.js`
- Autenticação (backend): `server/auth.js`
- Persistência/DB: `server/db.js`, `prisma/schema.prisma`

---

Resumo final
- O sistema entrega uma experiência completa para doadores e um fluxo robusto para beneficiários com aprovação administrativa. A API está pronta para produção com ajustes pontuais (e-mail e Prisma). O painel admin já permite operar validações e exportar dados. Os próximos passos priorizam consolidar o banco relacional (Prisma), corrigir o serviço de e-mail e reforçar segurança e observabilidade.
