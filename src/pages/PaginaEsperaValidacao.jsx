import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthService } from '../services/AuthService';
import { VerificationService } from '../services/VerificationService';
import Button from '../components/Button';
import InfoBanner from '../components/necessitado/InfoBanner';

const PaginaEsperaValidacao = () => {
  const navigate = useNavigate();
  const [code, setCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isResending, setIsResending] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Verifica se usuário está logado e com status correto
    const checkUserAccess = () => {
      const isLoggedIn = AuthService.isLoggedIn();
      
      if (!isLoggedIn) {
        navigate('/preciso-de-ajuda', { replace: true });
        return;
      }
      
      const currentUser = AuthService.getUser();
      setUser(currentUser);
      
      // Se já verificado, redireciona para página de pedido
      if (currentUser.verificationStatus === 'verified') {
        navigate('/pedir-doacao', { replace: true });
      }
    };

    checkUserAccess();
  }, [navigate]);

  const handleCodeChange = (value) => {
    // Remove caracteres não numéricos e limita a 6 dígitos
    const cleanValue = value.replace(/\D/g, '').substring(0, 6);
    setCode(cleanValue);
    setError('');
  };

  const handleVerifyCode = async () => {
    if (!code) {
      setError('Digite o código de 6 dígitos');
      return;
    }

    if (code.length !== 6) {
      setError('O código deve ter exatamente 6 dígitos');
      return;
    }

    setIsVerifying(true);
    setError('');

    try {
      console.log('[PaginaEsperaValidacao] Verificando código:', code);
      
      const result = await VerificationService.validateCode(code);
      
      if (result.ok) {
        // Atualiza status para verificado
        AuthService.setVerificationStatus('verified');
        setSuccess('Código verificado com sucesso! Redirecionando...');
        
        // Redireciona após 2 segundos
        setTimeout(() => {
          navigate('/pedir-doacao', { replace: true });
        }, 2000);
      } else {
        setError(result.error || 'Código inválido');
        setCode(''); // Limpa o código em caso de erro
      }
    } catch (error) {
      console.error('[PaginaEsperaValidacao] Erro ao verificar código:', error);
      setError('Erro ao verificar código. Tente novamente.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendCode = async () => {
    if (!VerificationService.canResendCode()) {
      setError('Aguarde 1 minuto antes de solicitar um novo código');
      return;
    }

    setIsResending(true);
    setError('');

    try {
      console.log('[PaginaEsperaValidacao] Reenviando código...');
      
      const result = await VerificationService.resendCode('email');
      
      if (result.ok) {
        setSuccess('Código reenviado com sucesso!');
        VerificationService._markCodeSent();
        
        // Limpa mensagem de sucesso após 3 segundos
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError('Erro ao reenviar código. Tente novamente.');
      }
    } catch (error) {
      console.error('[PaginaEsperaValidacao] Erro ao reenviar código:', error);
      setError('Erro ao reenviar código. Tente novamente.');
    } finally {
      setIsResending(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && code.length === 6 && !isVerifying) {
      handleVerifyCode();
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-adra-bg flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-adra-green border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-adra-text-secondary">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-adra-bg">
      {/* Header espaçamento */}
      <div className="pt-20 pb-16 px-4">
        <div className="container mx-auto max-w-2xl">
          
          {/* Hero Section */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            
            <h1 className="text-3xl lg:text-4xl font-bold text-adra-text mb-4">
              Estamos validando sua conta
            </h1>
            
            <p className="text-lg text-adra-text-secondary leading-relaxed">
              Olá, <strong>{user.fullName}</strong>! Para sua segurança e para evitar fraudes, 
              enviamos um código de verificação para seu e-mail.
            </p>
          </div>

          {/* User Info */}
          <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
            <h2 className="text-lg font-semibold text-adra-text mb-4">
              Informações da Conta
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-adra-text-secondary">E-mail:</span>
                <p className="font-medium text-adra-text">{user.email}</p>
              </div>
              <div>
                <span className="text-adra-text-secondary">Telefone:</span>
                <p className="font-medium text-adra-text">{user.phone}</p>
              </div>
            </div>
          </div>

          {/* Security Info */}
          <InfoBanner 
            type="info" 
            title="Para sua segurança"
            className="mb-8"
          >
            <p className="text-sm">
              Para sua segurança e para evitar fraudes, só liberamos pedidos após a verificação. 
              Este processo garante que apenas pessoas reais façam solicitações.
            </p>
          </InfoBanner>

          {/* Verification Form */}
          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <h2 className="text-xl font-semibold text-adra-text mb-4 text-center">
              Código de Verificação
            </h2>
            
            <p className="text-center text-adra-text-secondary mb-6">
              Insira o código de 6 dígitos enviado para seu e-mail:
            </p>

            {/* Code Input */}
            <div className="mb-6">
              <div className="flex justify-center mb-4">
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={code}
                  onChange={(e) => handleCodeChange(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="000000"
                  maxLength="6"
                  className={`
                    text-center text-2xl font-mono tracking-widest w-48 px-4 py-3 
                    border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-adra-green
                    ${error ? 'border-red-500' : 'border-gray-300'}
                    ${success ? 'border-green-500 bg-green-50' : ''}
                  `}
                  disabled={isVerifying || success}
                  aria-label="Código de verificação de 6 dígitos"
                  aria-describedby={error ? "code-error" : success ? "code-success" : "code-help"}
                />
              </div>
              
              <p id="code-help" className="text-xs text-center text-gray-500 mb-2">
                Digite apenas os números, sem espaços ou traços
              </p>

              {/* Error Message */}
              {error && (
                <div 
                  id="code-error"
                  className="text-sm text-red-600 text-center bg-red-50 border border-red-200 rounded-lg p-3"
                  role="alert"
                  aria-live="polite"
                >
                  {error}
                </div>
              )}

              {/* Success Message */}
              {success && (
                <div 
                  id="code-success"
                  className="text-sm text-green-600 text-center bg-green-50 border border-green-200 rounded-lg p-3"
                  role="alert"
                  aria-live="polite"
                >
                  {success}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <Button
                variant="primary"
                size="lg"
                onClick={handleVerifyCode}
                disabled={code.length !== 6 || isVerifying || success}
                className="w-full"
              >
                {isVerifying ? (
                  <>
                    <svg className="w-5 h-5 animate-spin mr-2" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Verificando...
                  </>
                ) : (
                  'Enviar Código'
                )}
              </Button>

              <div className="text-center">
                <button
                  onClick={handleResendCode}
                  disabled={isResending || success || !VerificationService.canResendCode()}
                  className="text-sm text-adra-green hover:text-adra-green-light underline disabled:text-gray-400 disabled:no-underline focus:outline-none focus:ring-2 focus:ring-adra-green rounded"
                >
                  {isResending ? 'Reenviando...' : 'Reenviar código'}
                </button>
              </div>
            </div>
          </div>

          {/* Help Section */}
          <div className="mt-8 text-center space-y-4">
            <InfoBanner type="neutral" className="text-left">
              <div className="space-y-2 text-sm">
                <p><strong>Não recebeu o código?</strong></p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Verifique sua caixa de spam/lixo eletrônico</li>
                  <li>Aguarde alguns minutos, os e-mails podem demorar</li>
                  <li>Clique em "Reenviar código" se necessário</li>
                </ul>
              </div>
            </InfoBanner>

            <div className="text-sm text-adra-text-secondary">
              <p className="mb-2">Precisa de ajuda?</p>
              <div className="space-y-1">
                <p>📞 WhatsApp: (11) 9999-9999</p>
                <p>✉️ E-mail: suporte@adra.org.br</p>
              </div>
            </div>

            <p className="text-xs text-gray-400">
              * Para teste: use o código <code className="bg-gray-100 px-1 rounded">123456</code>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaginaEsperaValidacao;
