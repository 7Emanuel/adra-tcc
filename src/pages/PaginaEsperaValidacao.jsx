import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthService } from '../services/AuthService';
import Button from '../components/Button';
import InfoBanner from '../components/necessitado/InfoBanner';
import { api } from '../services/apiClient';

const PaginaEsperaValidacao = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);
  const [rejectionReason, setRejectionReason] = useState('');

  useEffect(() => {
    // Verifica se usuário está logado e com status correto
    const checkUserAccess = async () => {
      const isLoggedIn = AuthService.isLoggedIn();
      
      if (!isLoggedIn) {
        navigate('/preciso-de-ajuda', { replace: true });
        return;
      }
      
      const currentUser = AuthService.getUser();
      setUser(currentUser);
      try {
        // Consulta status do beneficiário no backend (file-based)
        const res = await api(`/api/beneficiaries/status?email=${encodeURIComponent(currentUser.email || '')}`);
        if (res.exists) {
          if (res.status === 'validated' || res.status === 'approved') {
            navigate('/conta-validada', { replace: true });
            return;
          }
          if (res.status === 'rejected') {
            setRejectionReason(res.reason || '');
          }
        } else {
          // Mantém em análise caso não exista ainda
        }
      } catch (e) {
        // Em caso de falha, mantém fluxo atual
        console.warn('Falha ao consultar status do beneficiário', e);
      }
      setChecking(false);
    };

    checkUserAccess();
  }, [navigate]);

  if (!user || checking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
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
            
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Sua conta está em análise 🕒
            </h1>
            
            <div className="text-lg text-gray-600 leading-relaxed space-y-3">
              <p>
                Agradecemos por se cadastrar!
                Nossa equipe da <strong>ADRA</strong> está analisando suas informações para confirmar sua solicitação de ajuda.
                Assim que sua conta for validada, você poderá acessar normalmente o sistema.
              </p>
              <p>
                Enquanto isso, fique tranquilo — entraremos em contato assim que a validação for concluída.
              </p>
              <p className="text-sm text-gray-500">(Esta verificação agora é feita diretamente pelo administrador do sistema.)</p>
            </div>
          </div>

          {/* User Info */}
          <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Informações da Conta
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">E-mail:</span>
                <p className="font-medium text-gray-900">{user.email}</p>
              </div>
              <div>
                <span className="text-gray-600">Telefone:</span>
                <p className="font-medium text-gray-900">{user.telefone}</p>
              </div>
              <div>
                <span className="text-gray-600">Status:</span>
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  Pendente de validação
                </span>
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
              Após a aprovação, liberaremos o acesso às funcionalidades para solicitar doações.
            </p>
          </InfoBanner>

          {/* Status Block / Rejection Reason */}
          {rejectionReason ? (
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <h2 className="text-lg font-semibold text-red-700 mb-2">Sua conta foi rejeitada</h2>
              <p className="text-sm text-gray-700 mb-4">
                Motivo: {rejectionReason}
              </p>
              <div className="text-sm text-gray-600 mb-6">
                Por favor, revise suas informações e tente novamente.
              </div>
              <div className="flex gap-3">
                <Button variant="secondary" onClick={() => navigate('/preciso-de-ajuda')}>Voltar</Button>
                <Button variant="primary" onClick={() => navigate('/preciso-de-ajuda')}>Atualizar cadastro</Button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-8 shadow-sm text-center">
              <div className="flex items-center justify-center mb-4">
                <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin" aria-hidden="true"></div>
              </div>
              <p className="text-gray-700 mb-4">
                Aguardando validação da equipe da ADRA...
              </p>
              <Button variant="primary" size="lg" disabled className="w-full opacity-70 cursor-not-allowed">
                Aguardando validação da equipe da ADRA...
              </Button>
            </div>
          )}

          {/* Help Section */}
          <div className="mt-8 text-center space-y-4">
            <InfoBanner type="neutral" className="text-left">
              <div className="space-y-2 text-sm">
                <p><strong>Como funciona?</strong></p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Um(a) administrador(a) irá conferir seus dados</li>
                  <li>Você poderá ser contatado(a) para confirmação</li>
                  <li>Após aprovação, o acesso é liberado automaticamente</li>
                </ul>
              </div>
            </InfoBanner>

            <div className="text-sm text-gray-600">
              <p className="mb-2">Precisa de ajuda?</p>
              <div className="space-y-1">
                <p>📞 WhatsApp: (11) 9999-9999</p>
                <p>✉️ E-mail: suporte@adra.org.br</p>
              </div>
            </div>
            <p className="text-xs text-gray-400">“A esperança é o primeiro passo para a mudança. 💛”</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaginaEsperaValidacao;
