/**
 * MOCK VERIFICATION SERVICE - PLACEHOLDER PARA DESENVOLVIMENTO
 * 
 * Este serviço simula envio e validação de códigos de verificação.
 * No backend real, implementar:
 * - Tokens de uso único com expiração
 * - Rate limiting (ex: máx 3 tentativas por hora)
 * - Integração com provedores SMS/Email
 * - Logs de auditoria
 * - Criptografia dos códigos
 */

export const VerificationService = {
  /**
   * MOCK: Simula envio de código de verificação
   * Backend real: POST /api/verification/send-code
   */
  sendCode: async (channel = 'email') => {
    // PLACEHOLDER: simula delay da API
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // PLACEHOLDER: sempre retorna sucesso
    console.log(`[MOCK] Código enviado via ${channel}: 123456`);
    
    return { 
      ok: true, 
      channel,
      message: `Código enviado para seu ${channel === 'email' ? 'e-mail' : 'telefone'}`,
      // Backend real: não retornar o código na resposta
      _mockCode: '123456' // APENAS PARA DESENVOLVIMENTO
    };
  },

  /**
   * MOCK: Simula validação de código
   * Backend real: POST /api/verification/validate-code
   */
  validateCode: async (code) => {
    // PLACEHOLDER: simula delay da API
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Validação básica de formato
    if (!code || typeof code !== 'string') {
      return { 
        ok: false, 
        error: 'Código é obrigatório' 
      };
    }
    
    // Verifica se tem 6 dígitos
    if (!/^\d{6}$/.test(code)) {
      return { 
        ok: false, 
        error: 'Código deve ter exatamente 6 dígitos' 
      };
    }
    
    // PLACEHOLDER: aceita apenas "123456" como código válido
    const isValid = code === '123456';
    
    if (isValid) {
      console.log('[MOCK] Código validado com sucesso');
      return { 
        ok: true,
        message: 'Código verificado com sucesso!'
      };
    } else {
      console.log('[MOCK] Código inválido:', code);
      return { 
        ok: false, 
        error: 'Código inválido. Tente novamente.' 
      };
    }
  },

  /**
   * MOCK: Simula reenvio de código
   * Backend real: POST /api/verification/resend-code
   */
  resendCode: async (channel = 'email') => {
    // PLACEHOLDER: simula delay da API
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // PLACEHOLDER: sempre retorna sucesso
    console.log(`[MOCK] Código reenviado via ${channel}: 123456`);
    
    return { 
      ok: true, 
      channel,
      message: `Código reenviado para seu ${channel === 'email' ? 'e-mail' : 'telefone'}`,
      // Backend real: não retornar o código na resposta
      _mockCode: '123456' // APENAS PARA DESENVOLVIMENTO
    };
  },

  /**
   * MOCK: Verifica se pode reenviar código (rate limiting)
   * Backend real: verificar timestamp do último envio
   */
  canResendCode: () => {
    const lastSent = localStorage.getItem('lastCodeSent');
    if (!lastSent) return true;
    
    const now = Date.now();
    const lastSentTime = parseInt(lastSent);
    const cooldownMs = 60 * 1000; // 1 minuto de cooldown
    
    return (now - lastSentTime) > cooldownMs;
  },

  /**
   * MOCK: Registra timestamp do último envio
   */
  _markCodeSent: () => {
    localStorage.setItem('lastCodeSent', Date.now().toString());
  }
};

// Helper para debug - REMOVER EM PRODUÇÃO
if (typeof window !== 'undefined') {
  window.VerificationService = VerificationService;
}
