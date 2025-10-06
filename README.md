# ADRA - Agência de Desenvolvimento e Recursos Assistenciais

🌐 **Live Demo**: https://github.com/danielzukowskipaixao/ADRA-sonnet

Uma aplicação web institucional moderna para a ADRA, construída com React, Vite e Tailwind CSS. Plataforma completa de doações com autenticação, sistema de pedidos e mapa interativo.

## 🚀 Tecnologias

- **React 18** - Biblioteca de interface do usuário
- **Vite** - Build tool e servidor de desenvolvimento
- **Tailwind CSS v3.4** - Framework CSS utilitário
- **React Router DOM** - Roteamento para SPA
- **React Leaflet** - Mapas interativos
- **QRCode.react** - Geração de QR codes para PIX
- **Lucide React** - Ícones modernos

## 🎨 Design System

### Cores ADRA
- **Verde Primário**: `#10B981` (green-500)
- **Verde Escuro**: `#065F46` (green-800)  
- **Verde Claro**: `#D1FAE5` (green-100)
- **Azul Accent**: `#3B82F6` (blue-500)
- **Texto**: `#1F2937` (gray-800)

### Componentes Disponíveis
- `Button` - Botões com variantes (primary, secondary, accent)
- `Modal` - Modais acessíveis com backdrop e escape
- `Header` - Cabeçalho fixo com navegação responsiva
- `Footer` - Rodapé institucional
- `FeatureCard` - Cards para áreas de atuação
- `StepCard` - Cards para processos
- `ErrorBoundary` - Captura de erros em componentes

## 📱 Funcionalidades Implementadas

### ✅ Homepage Completa
- [x] Design responsivo e acessível (WCAG AA)
- [x] Navegação suave entre seções
- [x] Mobile-first approach
- [x] Menu hamburger para dispositivos móveis
- [x] Modais informativos
- [x] Call-to-actions otimizados

### ✅ Sistema de Doações (/doar)
- [x] **Transferência/PIX**: Dados bancários reais com QR codes
- [x] **Lista de Itens**: Sistema de carrinho de compras
- [x] **Mapa Interativo**: Unidades ADRA com geolocalização
- [x] Dados mock realistas (6 unidades São Paulo)
- [x] Exportação de listas (PDF/TXT)
- [x] Integração Google Maps e Waze
- [x] Consentimento LGPD para geolocalização

### ✅ Fluxo do Usuário Necessitado
- [x] Sistema de autenticação mock
- [x] Verificação por código (123456)
- [x] Formulário de pedido de doações
- [x] Captura de localização (GPS)
- [x] Gerenciamento de itens necessários
- [x] Persistência de rascunhos
- [x] Validação completa de formulários

### 🔄 Próximas Funcionalidades
- [ ] Integração com backend real
- [ ] Sistema de pagamento online
- [ ] Notificações push/email
- [ ] Dashboard administrativo
- [ ] Chat entre usuários e doadores
- [ ] Histórico de doações

## 🛠️ Desenvolvimento

### Pré-requisitos
- Node.js 18+
- npm ou yarn

### Instalação e Execução
```bash
# Clone o repositório
git clone https://github.com/danielzukowskipaixao/ADRA-sonnet.git
cd ADRA-sonnet

# Instale as dependências
npm install

# Execute o servidor de desenvolvimento
npm run dev

# Acesse: http://localhost:5173
```

### Scripts Disponíveis
```bash
npm run dev          # Servidor de desenvolvimento
npm run dev:server   # API Node/Express (porta 3000 por padrão)
npm run build        # Build para produção
npm run lint         # Verificação de código
npm run preview      # Preview do build
```

## 🧪 Como Testar

### Página de Doações (/doar):
1. **Acesse**: `http://localhost:5173/doar`
2. **Teste PIX**: Copie dados bancários e QR code
3. **Lista de Itens**: Adicione itens ao carrinho, exporte lista
4. **Mapa**: Permita geolocalização e veja unidades próximas

### Fluxo do Usuário Necessitado:
1. **Acesse**: `http://localhost:5173/`
2. **Clique**: "Preciso de Ajuda" no cabeçalho
3. **Aguarde**: Redirecionamento automático para a página “Sua conta está em análise”
4. **Validação manual**: Um administrador da ADRA aprovará seu cadastro
5. Após aprovado, você terá acesso ao formulário de pedido
6. Preencha endereço e itens necessários e envie o pedido

Veja `GUIA_TESTE_FLUXO.md` para instruções detalhadas.

## 📁 Estrutura do Projeto

```
src/
├── components/              # Componentes reutilizáveis
│   ├── Button.jsx
│   ├── Modal.jsx
│   ├── Header.jsx
│   ├── Footer.jsx
│   ├── ErrorBoundary.jsx
│   ├── FeatureCard.jsx
│   ├── StepCard.jsx
│   ├── doar/               # Componentes da página de doação
│   │   ├── TransferSection.jsx
│   │   ├── ItemsSection.jsx
│   │   ├── MapSection.jsx
│   │   ├── CopyableField.jsx
│   │   ├── PixCard.jsx
│   │   ├── ItemRow.jsx
│   │   ├── ShoppingListPanel.jsx
│   │   ├── UnitCard.jsx
│   │   ├── LazyMap.jsx
│   │   └── LazyMapComponent.jsx
│   └── necessitado/        # Componentes do fluxo específico
│       ├── AddressCapture.jsx
│       ├── InfoBanner.jsx
│       ├── RequestItemRow.jsx
│       └── TermsCheckbox.jsx
├── pages/                  # Páginas da aplicação
│   ├── Home.jsx
│   ├── Doar.jsx           # Página principal de doações
│   ├── EmBreve.jsx
│   ├── DecisorNecessitado.jsx
│   ├── LoginCadastro.jsx
│   ├── PaginaEsperaValidacao.jsx
│   └── PaginaPedidoDoacao.jsx
├── services/              # Serviços e APIs mock
│   ├── AuthService.js
│   ├── DonationsService.js
│   ├── ItemsService.js
│   ├── UnitsService.js
│   ├── GeoService.js
│   ├── (removido) VerificationService.js
│   └── LocationService.js
├── data/                  # Dados mock JSON
│   ├── donations.json     # PIX e dados bancários
│   ├── requested_items.json # Itens para doação
│   └── adra_units.json    # Unidades ADRA
├── assets/                # Recursos estáticos
├── App.jsx               # Componente principal com rotas
├── main.jsx             # Entry point
└── index.css            # Estilos globais com Tailwind
```

## 🎯 Rotas Disponíveis

- `/` - Página inicial
- `/doar` - **Página principal de doações** (PIX, itens, mapa)
- `/preciso-de-ajuda` - Gateway de autenticação
- `/login-cadastro` - Login e cadastro de usuários
- `/espera-validacao` - Página “Sua conta está em análise” (validação manual)
- `/pedir-doacao` - Formulário de pedido
- `/em-breve` - Páginas em desenvolvimento

## 🗂️ Dados Mock

### Transferências/PIX
- Banco do Brasil (dados realistas)
- Chave PIX: `doacoes@adra.org.br`
- QR codes funcionais para teste

### Itens para Doação (24 itens)
- **6 categorias**: Alimentos, Limpeza, Higiene, Vestuário, Medicamentos, Material Escolar
- **Níveis de urgência**: Alta, Média, Baixa
- **Agregação automática**: Soma quantidades de famílias diferentes

### Unidades ADRA (6 locais em São Paulo)
- Endereços reais em São Paulo
- Coordenadas GPS precisas
- Horários de funcionamento
- Contatos telefônicos e emails

## 💾 Persistência (localStorage)

- `adra_user` - Dados do usuário autenticado
- `adra_donation_draft` - Rascunho do pedido
- `adra_verification_attempts` - (descontinuado) Controle de tentativas

## 🌐 Deploy

O projeto está configurado para deploy fácil em:
- **Vercel** (recomendado)
- **Netlify**
- **GitHub Pages**

```bash
# Build para produção
npm run build

# A pasta dist/ contém os arquivos para deploy
```

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

## 🤝 Contribuição

1. Faça o fork do projeto
2. Crie sua feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

---

**ADRA** - Transformando vidas através da solidariedade 💚

**Status**: ✅ Homepage + Fluxo Completo de Doações + Sistema para Necessitados  
**Última atualização**: Agosto 2025  
**Repositório**: https://github.com/danielzukowskipaixao/ADRA-sonnet

## 🔐 Admin (novo)

Para acessar o painel administrativo:

1) Execute o backend:

```powershell
$env:ADMIN_PASSWORD="daniel"; $env:ADMIN_SESSION_SECRET="dev-secret"; npm run dev:server
```

2) Rode o frontend em outro terminal:

```powershell
npm run dev
```

3) Entre na Home e clique em “Entrar como administrador” no final da página. Informe a senha solicitada. Em caso de sucesso, você será redirecionado para `/admin`.

Notas:
- Em desenvolvimento, o frontend usa proxy do Vite para `/api` → `http://localhost:3000`.
- Se a porta 3000 estiver ocupada, inicie o backend com `PORT=3001` e ajuste o proxy no `vite.config.js` temporariamente.
- A senha padrão agora é `daniel` e pode ser alterada com a variável `ADMIN_PASSWORD`.
