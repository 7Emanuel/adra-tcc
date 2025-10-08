# 📧 Sistema de Notificações por Email - ADRA

## 🔧 Configuração

O sistema de notificações foi implementado para alertar administradores sobre novos cadastros e notificar beneficiários sobre aprovações/rejeições.

### 1. Configurar Variáveis de Ambiente

Copie o arquivo `.env.example` para `.env` e configure as variáveis SMTP:

```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações:

```env
# Configurações de Email (SMTP)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_SECURE="false"
SMTP_USER="seu-email@gmail.com"
SMTP_PASS="sua-app-password"

# Emails que receberão notificações (separados por vírgula)
ADMIN_EMAILS="admin@adra.org.br,gestor@adra.org.br"
```

### 2. Configurações por Provedor

#### Gmail
1. Ative a verificação em 2 etapas na sua conta Google
2. Gere uma "Senha de App" em: https://myaccount.google.com/apppasswords
3. Use a senha gerada no `SMTP_PASS`

#### Outlook/Hotmail
```env
SMTP_HOST="smtp-mail.outlook.com"
SMTP_PORT="587"
SMTP_USER="seu-email@outlook.com"
SMTP_PASS="sua-senha"
```

#### Outros Provedores
Consulte a documentação do seu provedor de email.

## 🚀 Funcionalidades Implementadas

### ✅ Notificação para Administradores
- **Quando**: Novo beneficiário se cadastra
- **Para**: Emails configurados em `ADMIN_EMAILS`
- **Conteúdo**: Dados do beneficiário e link para painel admin

### ✅ Notificação para Beneficiários
- **Quando**: Admin aprova ou rejeita cadastro
- **Para**: Email do beneficiário
- **Conteúdo**: Status da aprovação e próximos passos

## 🔄 Fluxo de Notificações

1. **Usuário se cadastra** → Email enviado para administradores
2. **Admin acessa painel** → Revisa dados do beneficiário
3. **Admin aprova/rejeita** → Email enviado para o beneficiário

## 🛠️ Status do Sistema

O sistema funciona com ou sem configurações de email:

- **✅ Com SMTP configurado**: Emails são enviados automaticamente
- **⚠️ Sem SMTP**: Sistema funciona normalmente, mas sem notificações

Você verá uma mensagem no console:
```
⚠️ Configurações SMTP não encontradas. Notificações por email desabilitadas.
```

## 🧪 Testando o Sistema

### 1. Testar Novo Cadastro
1. Acesse `/preciso-de-ajuda`
2. Crie uma nova conta
3. Verifique se o email foi enviado para os administradores

### 2. Testar Aprovação/Rejeição
1. Acesse `/admin` (senha: daniel)
2. Encontre o beneficiário pendente
3. Aprove ou rejeite
4. Verifique se o email foi enviado para o beneficiário

## 📧 Templates de Email

### Para Administradores
- Design profissional com logo ADRA
- Dados completos do beneficiário
- Link direto para painel administrativo
- Status visual (pendente)

### Para Beneficiários
- **Aprovação**: Boas-vindas e link para sistema
- **Rejeição**: Explicação e orientação para novo cadastro

## 🔒 Segurança

- Senhas SMTP armazenadas como variáveis de ambiente
- Emails enviados de forma assíncrona (não bloqueia cadastro)
- Logs de erros sem exposição de credenciais

## 📱 Próximas Melhorias

- [ ] Notificações via WhatsApp (integração com WhatsApp Business API)
- [ ] Dashboard de estatísticas de emails
- [ ] Templates personalizáveis
- [ ] Agendamento de lembretes

---

**✨ Sistema implementado e funcionando!** 

Para ativar as notificações, basta configurar as variáveis SMTP no arquivo `.env`.