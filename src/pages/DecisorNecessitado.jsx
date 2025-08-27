import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthService } from '../services/AuthService';

const DecisorNecessitado = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // Pequeno delay para mostrar loading
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Verificar se usuário está logado
        if (!AuthService.isLoggedIn()) {
          // Não logado -> vai para login/cadastro
          navigate('/login-cadastro');
          return;
        }

        // Usuário está logado, verificar se está verificado
        if (AuthService.isVerified()) {
          // Verificado -> pode fazer pedidos
          navigate('/pedir-doacao');
        } else {
          // Não verificado -> precisa verificar
          navigate('/espera-validacao');
        }
      } catch (error) {
        console.error('Erro ao verificar status:', error);
        navigate('/login-cadastro');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-adra-green to-adra-green-light flex items-center justify-center">
        <div className="text-center text-white">
          <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="w-8 h-8 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
          <h2 className="text-xl font-semibold mb-2">Verificando sua conta...</h2>
          <p className="text-white text-opacity-80">Aguarde um momento</p>
        </div>
      </div>
    );
  }

  return null; // Component nunca renderiza conteúdo normal, sempre redireciona
};

export default DecisorNecessitado;
