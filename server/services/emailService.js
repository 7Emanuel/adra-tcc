import nodemailer from 'nodemailer';

class EmailService {
  constructor() {
    this.transporter = null;
    this.isEnabled = false;
    this.init();
  }

  async init() {
    try {
      // Configuração de email baseada em variáveis de ambiente
      if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
        console.warn('⚠️ Configurações SMTP não encontradas. Notificações por email desabilitadas.');
        return;
      }

      this.transporter = nodemailer.createTransporter({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT || 587,
        secure: process.env.SMTP_SECURE === 'true', // true para 465, false para outros
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        }
      });

      // Testar conexão
      await this.transporter.verify();
      this.isEnabled = true;
      console.log('✅ Serviço de email configurado com sucesso');
      
    } catch (error) {
      console.warn('⚠️ Falha ao configurar serviço de email:', error.message);
      this.isEnabled = false;
    }
  }

  async sendNewBeneficiaryNotification(beneficiaryData) {
    if (!this.isEnabled) {
      console.log('📧 Email não enviado - serviço desabilitado');
      return false;
    }

    try {
      const adminEmails = process.env.ADMIN_EMAILS?.split(',') || ['admin@adra.org.br'];
      
      const emailOptions = {
        from: `"ADRA Sistema" <${process.env.SMTP_USER}>`,
        to: adminEmails.join(', '),
        subject: '🔔 Novo Cadastro Pendente - ADRA',
        html: this.generateBeneficiaryNotificationEmail(beneficiaryData)
      };

      const result = await this.transporter.sendMail(emailOptions);
      console.log('✅ Email de notificação enviado:', result.messageId);
      return true;

    } catch (error) {
      console.error('❌ Erro ao enviar email de notificação:', error.message);
      return false;
    }
  }

  generateBeneficiaryNotificationEmail(data) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #16a34a, #22c55e); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; }
          .footer { background: #374151; color: white; padding: 15px; border-radius: 0 0 8px 8px; text-align: center; }
          .info-box { background: white; padding: 15px; margin: 10px 0; border-radius: 6px; border-left: 4px solid #16a34a; }
          .button { display: inline-block; background: #16a34a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 5px; }
          .status { background: #fef3c7; color: #92400e; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0;">🔔 Novo Cadastro Pendente</h1>
            <p style="margin: 5px 0 0 0; opacity: 0.9;">Sistema ADRA - Notificação Administrativa</p>
          </div>
          
          <div class="content">
            <p><strong>Uma nova pessoa se cadastrou no sistema e precisa de validação:</strong></p>
            
            <div class="info-box">
              <h3 style="margin-top: 0; color: #16a34a;">📋 Dados do Beneficiário</h3>
              <p><strong>Nome:</strong> ${data.name}</p>
              <p><strong>Email:</strong> ${data.email}</p>
              <p><strong>Telefone:</strong> ${data.phone || 'Não informado'}</p>
              <p><strong>Cidade:</strong> ${data.address?.city || 'Não informada'}</p>
              <p><strong>Estado:</strong> ${data.address?.state || 'Não informado'}</p>
              <p><strong>Status:</strong> <span class="status">PENDENTE</span></p>
              <p><strong>Data do cadastro:</strong> ${new Date(data.createdAt).toLocaleString('pt-BR')}</p>
            </div>

            <div style="text-align: center; margin: 30px 0;">
              <p><strong>Ações necessárias:</strong></p>
              <a href="${process.env.ADMIN_DASHBOARD_URL || 'http://localhost:5173/admin'}" class="button">
                🔍 Acessar Painel Admin
              </a>
            </div>

            <div style="background: #f3f4f6; padding: 15px; border-radius: 6px; margin: 20px 0;">
              <p style="margin: 0; font-size: 14px; color: #6b7280;">
                <strong>Próximos passos:</strong><br>
                1. Acesse o painel administrativo<br>
                2. Revise os dados do cadastro<br>
                3. Aprove ou rejeite a solicitação<br>
                4. O usuário será notificado automaticamente
              </p>
            </div>
          </div>
          
          <div class="footer">
            <p style="margin: 0;">ADRA - Agência de Desenvolvimento e Recursos Assistenciais</p>
            <p style="margin: 5px 0 0 0; font-size: 12px; opacity: 0.8;">
              Esta é uma notificação automática do sistema
            </p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  async sendBeneficiaryStatusUpdate(beneficiaryEmail, isApproved, reason = '') {
    if (!this.isEnabled) {
      console.log('📧 Email não enviado - serviço desabilitado');
      return false;
    }

    try {
      const subject = isApproved ? '✅ Sua conta foi aprovada - ADRA' : '❌ Atualização da sua solicitação - ADRA';
      
      const emailOptions = {
        from: `"ADRA Sistema" <${process.env.SMTP_USER}>`,
        to: beneficiaryEmail,
        subject,
        html: this.generateStatusUpdateEmail(isApproved, reason)
      };

      const result = await this.transporter.sendMail(emailOptions);
      console.log('✅ Email de atualização enviado:', result.messageId);
      return true;

    } catch (error) {
      console.error('❌ Erro ao enviar email de atualização:', error.message);
      return false;
    }
  }

  generateStatusUpdateEmail(isApproved, reason) {
    if (isApproved) {
      return `
        <!DOCTYPE html>
        <html>
        <head><meta charset="UTF-8"><style>body{font-family:Arial,sans-serif;line-height:1.6;color:#333}.container{max-width:600px;margin:0 auto;padding:20px}.header{background:linear-gradient(135deg,#16a34a,#22c55e);color:white;padding:20px;border-radius:8px 8px 0 0}.content{background:#f9fafb;padding:20px;border:1px solid #e5e7eb}.footer{background:#374151;color:white;padding:15px;border-radius:0 0 8px 8px;text-align:center}.button{display:inline-block;background:#16a34a;color:white;padding:12px 24px;text-decoration:none;border-radius:6px;margin:10px 5px}</style></head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin:0">✅ Conta Aprovada!</h1>
            </div>
            <div class="content">
              <p><strong>Boa notícia!</strong> Sua conta foi aprovada e você já pode solicitar ajuda através do nosso sistema.</p>
              <div style="text-align:center;margin:30px 0">
                <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/pedir-doacao" class="button">Acessar Sistema</a>
              </div>
            </div>
            <div class="footer">
              <p style="margin:0">ADRA - Agência de Desenvolvimento e Recursos Assistenciais</p>
            </div>
          </div>
        </body>
        </html>
      `;
    } else {
      return `
        <!DOCTYPE html>
        <html>
        <head><meta charset="UTF-8"><style>body{font-family:Arial,sans-serif;line-height:1.6;color:#333}.container{max-width:600px;margin:0 auto;padding:20px}.header{background:#ef4444;color:white;padding:20px;border-radius:8px 8px 0 0}.content{background:#f9fafb;padding:20px;border:1px solid #e5e7eb}.footer{background:#374151;color:white;padding:15px;border-radius:0 0 8px 8px;text-align:center}</style></head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin:0">Atualização da sua solicitação</h1>
            </div>
            <div class="content">
              <p>Infelizmente, não foi possível aprovar sua solicitação neste momento.</p>
              ${reason ? `<p><strong>Motivo:</strong> ${reason}</p>` : ''}
              <p>Você pode revisar seus dados e tentar novamente. Nossa equipe está sempre disponível para ajudar.</p>
            </div>
            <div class="footer">
              <p style="margin:0">ADRA - Agência de Desenvolvimento e Recursos Assistenciais</p>
            </div>
          </div>
        </body>
        </html>
      `;
    }
  }
}

export default new EmailService();