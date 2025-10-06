# Guia de Teste - Fluxo do Usuário Necessitado

## Como Testar o Fluxo Completo

### 1. Página Inicial
- Acesse `http://localhost:5173/`
- Clique no botão **"Preciso de Ajuda"** no cabeçalho ou na seção hero

### 2. Página Decisor (/preciso-de-ajuda)
- A página verificará se você está logado
- Se não estiver logado, será redirecionado para a página de login/cadastro

### 3. Página de Login/Cadastro (/login-cadastro)
- **Para LOGIN**: Use as credenciais existentes:
  - Email: `joao@email.com`
  - Senha: `123456`
- **Para CADASTRO**: Preencha os campos:
  - Nome completo
  - Email (qualquer email válido)
  - Telefone
  - Senha (mínimo 6 caracteres)
  - Confirmar senha
- Clique em "Entrar" ou "Criar conta"
- Após autenticação, será redirecionado para a página de validação

### 4. Página de Espera/Validação (/espera-validacao)
- A tela exibe: “Sua conta está em análise”
- A validação agora é manual, feita por um administrador
- Após aprovado, você será redirecionado para a página de pedido

### 5. Página de Pedido de Doação (/pedir-doacao)
- **Endereço**: Clique em "Usar Localização Atual" ou preencha manualmente
- **Itens Necessários**: 
  - Clique em "Adicionar Item"
  - Preencha nome, categoria, quantidade e urgência
  - Adicione pelo menos 1 item
- **Termos**: Aceite os termos de uso
- **Enviar**: Clique em "Enviar Pedido" para finalizar

## Recursos Implementados

### 🔐 Sistema de Autenticação
- Login com email e senha
- Cadastro de novos usuários
- Validação de formulários
- Persistência de sessão no localStorage

### 📋 Usuário de Teste Pré-cadastrado
- **Email**: `joao@email.com`
- **Senha**: `123456`

### 🔄 Fluxo de Redirecionamento Inteligente
- Usuário não logado → Login/Cadastro
- Usuário logado com status `pending` → Tela de espera/validação
- Usuário logado com status `approved` → Formulário de pedido

### 📍 Localização
- Integração com Geolocation API
- Preenchimento automático de coordenadas
- Validação de endereço

### 📝 Formulário Avançado
- Validação completa de campos
- Sistema de rascunhos (localStorage)
- Gerenciamento dinâmico de itens
- Estados de urgência configuráveis

### ♿ Acessibilidade
- WCAG AA compliance
- Navegação por teclado
- Labels e ARIA adequados
- Contraste de cores apropriado

### 📱 Responsividade
- Mobile-first design
- Breakpoints otimizados
- Interface adaptativa

## Usuário de Teste

- Email `joao@email.com`, Senha `123456`
- Para simular aprovação manual, ajuste o status via console:
  `AuthService.setVerificationStatus('approved')`

## Navegação

### Rotas Disponíveis:
- `/` - Página inicial
- `/preciso-de-ajuda` - Decisor (gateway de verificação)
- `/login-cadastro` - Autenticação
- `/espera-validacao` - Tela de espera por validação manual
- `/pedir-doacao` - Formulário de pedido

### Estados do Usuário:
- **Não autenticado**: Redireciona para login/cadastro
- **Autenticado (pending)**: Permanece na validação
- **Autenticado (approved)**: Acesso ao formulário de pedido

## Persistência

### localStorage Keys:
- `adra_user` - Dados do usuário autenticado
- `adra_donation_draft` - Rascunho do pedido
- `adra_verification_attempts` - (descontinuado)

## Cenários de Teste

### Cenário 1: Novo Usuário
1. Clique "Preciso de Ajuda"
2. Será redirecionado para `/login-cadastro`
3. Clique "Criar nova conta"
4. Preencha todos os campos obrigatórios
5. Após cadastro, será redirecionado para página de espera
6. Aguarde a aprovação (ou simule via console)
7. Preencha o formulário de pedido

### Cenário 2: Usuário Existente
1. Clique "Preciso de Ajuda"
2. Será redirecionado para `/login-cadastro`
3. Use email `joao@email.com` e senha `123456`
4. Após login, será redirecionado para página de espera
5. Aguarde a aprovação (ou simule via console)
6. Preencha o formulário de pedido

### Cenário 3: Usuário Já Logado
1. Complete o Cenário 1 ou 2
2. Clique "Preciso de Ajuda" novamente
3. Será redirecionado diretamente para a etapa apropriada (validação ou pedido)

## Próximos Passos

1. **Backend Integration**: Substituir AuthService por APIs reais
2. **Validação manual/admin**: Integrar com backend para aprovar/reprovar
3. **Upload de Imagens**: Implementar anexos para itens
4. **Notificações**: Sistema de push/email
5. **Chat**: Comunicação com doadores
6. **Histórico**: Acompanhamento de pedidos

---

**Status**: ✅ Fluxo completo implementado com autenticação
**Última atualização**: $(Get-Date -Format "dd/MM/yyyy HH:mm")
