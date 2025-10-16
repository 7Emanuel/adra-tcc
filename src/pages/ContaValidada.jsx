import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ContaValidada = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redireciona para a página de pedidos após 3 segundos
    const timer = setTimeout(() => {
      navigate('/pedir-doacao', { replace: true });
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-adra-blue-50 to-adra-green-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          {/* Ícone de sucesso */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>

          {/* Título principal */}
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Conta Validada!
          </h1>

          {/* Mensagem principal */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
            <p className="text-lg text-gray-800 leading-relaxed">
              Sua conta foi validada e seu pedido está sendo encaminhado
            </p>
          </div>

          {/* Informações adicionais */}
          <div className="text-sm text-gray-600 mb-6">
            <p className="mb-2">
              ✓ Documentos aprovados
            </p>
            <p className="mb-2">
              ✓ Cadastro validado
            </p>
            <p>
              ✓ Redirecionando para seus pedidos...
            </p>
          </div>

          {/* Loading animation */}
          <div className="flex justify-center items-center space-x-2">
            <div className="w-2 h-2 bg-adra-blue-600 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-adra-blue-600 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
            <div className="w-2 h-2 bg-adra-blue-600 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
          </div>

          {/* Timer visual */}
          <div className="mt-6 text-xs text-gray-500">
            Redirecionando em alguns segundos...
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContaValidada;