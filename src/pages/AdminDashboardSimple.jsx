import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import { adminApi } from '../services/adminApi';
import AdminLoginModal from '../components/AdminLoginModal';

export default function AdminDashboardSimple() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(true);

  const handleLoginSuccess = () => {
    console.log('✅ Login bem-sucedido!');
    setIsAuthenticated(true);
    setShowLoginModal(false);
  };

  const handleLogout = async () => {
    try {
      await adminApi.logout();
      setIsAuthenticated(false);
      setShowLoginModal(true);
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-xl">A</span>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Painel Administrativo</h2>
          <p className="text-gray-600 mb-4">Faça login para continuar</p>
          
          <AdminLoginModal
            isOpen={showLoginModal}
            onClose={() => navigate('/')}
            onSuccess={handleLoginSuccess}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-20">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-green-600 rounded-md flex items-center justify-center">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <h1 className="text-xl font-bold text-gray-900">Painel Administrativo</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" onClick={() => navigate('/')}>
              Home
            </Button>
            <Button variant="primary" size="sm" onClick={handleLogout}>
              Sair
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">🎉 Login realizado com sucesso!</h2>
          <p className="text-gray-600 mb-4">
            Você está agora logado no painel administrativo. 
            Esta é uma versão simplificada para teste.
          </p>
          
          <div className="space-y-4">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <h3 className="font-medium text-green-800">Status da Autenticação</h3>
              <p className="text-green-700">✅ Autenticado com sucesso</p>
              <p className="text-sm text-green-600">Senha: kahoot</p>
            </div>
            
            <div className="flex gap-2">
              <Button onClick={() => window.location.href = '/admin'}>
                Ir para Dashboard Completo
              </Button>
              <Button variant="secondary" onClick={() => navigate('/')}>
                Voltar para Home
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}