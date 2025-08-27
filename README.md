# ADRA - Agência de Desenvolvimento e Recursos Assistenciais

Uma aplicação web institucional moderna para a ADRA, construída com React, Vite e Tailwind CSS. Inclui fluxo completo para usuários necessitados com autenticação, verificação e sistema de pedidos.

## 🚀 Tecnologias

- **React 18** - Biblioteca de interface do usuário
- **Vite** - Build tool e servidor de desenvolvimento
- **Tailwind CSS v3.4** - Framework CSS utilitário
- **React Router DOM** - Roteamento para SPA

## 🎨 Design System

### Cores
- **Verde Primário**: `#0A6159` (adra-green)
- **Verde Claro**: `#2AB3A3` (adra-green-light)  
- **Amarelo Destaque**: `#F5B700` (adra-yellow)
- **Texto**: `#1F2937` (adra-text)

### Componentes
- `Button` - Botões com variantes (primary, secondary, accent)
- `Modal` - Modais acessíveis com backdrop
- `Header` - Cabeçalho fixo com navegação e redirecionamento
- `Footer` - Rodapé com informações institucionais
- `FeatureCard` - Cards para áreas de atuação
- `StepCard` - Cards para processo

## 📱 Recursos

### ✅ Homepage Completa
- [x] Página inicial responsiva e acessível
- [x] Navegação suave entre seções
- [x] Design mobile-first
- [x] Acessibilidade WCAG AA
- [x] Modal para fluxos de doação
- [x] Menu hamburger mobile

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
- [ ] Sistema de upload de imagens
- [ ] Notificações push/email
- [ ] Chat entre usuários e doadores
- [ ] Histórico de pedidos

## 🛠️ Desenvolvimento

### Pré-requisitos
- Node.js 18+
- npm ou yarn

### Instalação
```bash
# Clone o repositório
git clone [repo-url]

# Instale as dependências
npm install

# Execute o servidor de desenvolvimento
npm run dev
```

### Scripts Disponíveis
```bash
npm run dev          # Servidor de desenvolvimento
npm run build        # Build para produção
npm run lint         # Verificação de código
npm run preview      # Preview do build
```

## 🧪 Como Testar

### Fluxo Completo do Usuário Necessitado:
1. **Acesse**: `http://localhost:5173/`
2. **Clique**: "Preciso de Ajuda" no cabeçalho
3. **Aguarde**: Redirecionamento automático (2s)
4. **Digite**: Código de verificação `123456`
5. **Preencha**: Endereço e itens necessários
6. **Envie**: Pedido completo

Veja `GUIA_TESTE_FLUXO.md` para instruções detalhadas.

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── Button.jsx
│   ├── Modal.jsx
│   ├── Header.jsx
│   ├── Footer.jsx
│   ├── FeatureCard.jsx
│   ├── StepCard.jsx
│   └── necessitado/     # Componentes do fluxo específico
├── pages/              # Páginas da aplicação
│   ├── Home.jsx
│   ├── EmBreve.jsx
│   ├── DecisorNecessitado.jsx
│   ├── PaginaEsperaValidacao.jsx
│   └── PaginaPedidoDoacao.jsx
├── services/           # Serviços mock
│   ├── AuthService.js
│   ├── VerificationService.js
│   └── LocationService.js
├── assets/             # Recursos estáticos
├── App.jsx             # Componente principal com rotas
├── main.jsx           # Entry point
└── index.css          # Estilos globais
```

## 🎯 Rotas Disponíveis

- `/` - Página inicial
- `/preciso-de-ajuda` - Gateway de autenticação
- `/espera-validacao` - Verificação de código
- `/pedir-doacao` - Formulário de pedido
- `/em-breve` - Páginas em desenvolvimento

## 💾 Persistência (localStorage)

- `adra_user` - Dados do usuário autenticado
- `adra_donation_draft` - Rascunho do pedido
- `adra_verification_attempts` - Controle de tentativas

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

**Status**: ✅ Homepage + Fluxo Usuário Necessitado implementados
**Última atualização**: Dezembro 2024
