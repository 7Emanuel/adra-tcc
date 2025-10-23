import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import { adminApi } from '../services/adminApi';
import AdminLoginModal from '../components/AdminLoginModal';

export default function AdminDashboardSimple() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    beneficiaries: [],
    donations: [],
    requests: []
  });

  // Função para carregar todos os dados após a autenticação
  const loadAllData = async () => {
    setLoading(true);
    try {
      console.log('🔄 Carregando dados do admin...');
      
      const [beneficiariesRes, donationsRes, requestsRes] = await Promise.all([
        adminApi.beneficiaries({ page: 1, pageSize: 50 }),
        adminApi.donations({ page: 1, pageSize: 50 }),
        adminApi.requests({ page: 1, pageSize: 50 })
      ]);

      setData({
        beneficiaries: beneficiariesRes.beneficiaries || [],
        donations: donationsRes.donations || [],
        requests: requestsRes.requests || []
      });
      
      console.log('✅ Dados carregados com sucesso');
    } catch (error) {
      console.error('❌ Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSuccess = () => {
    console.log('✅ Login realizado com sucesso');
    setShowAdminLogin(false);
    setIsAuthenticated(true);
    loadAllData();
  };

  const handleLogout = () => {
    adminApi.logout().finally(() => {
      setIsAuthenticated(false);
      setShowAdminLogin(true);
      setData({ beneficiaries: [], donations: [], requests: [] });
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <AdminLoginModal
          isOpen={showAdminLogin}
          onClose={() => navigate('/')}
          onSuccess={handleLoginSuccess}
        />
        <div className="text-center">
          <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-xl">A</span>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Painel Administrativo</h2>
          <p className="text-gray-600">Acesso restrito</p>
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
            <Button variant="secondary" size="sm" onClick={() => navigate('/')}>Home</Button>
            <Button variant="primary" size="sm" onClick={handleLogout}>Sair</Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando dados...</p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Beneficiários */}
            <section>
              <h2 className="text-lg font-semibold mb-4">Beneficiários ({data.beneficiaries.length})</h2>
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Nome</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Data</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {data.beneficiaries.map(item => (
                        <tr key={item.id}>
                          <td className="px-4 py-2 text-sm text-gray-900">{item.id}</td>
                          <td className="px-4 py-2 text-sm text-gray-900">{item.name}</td>
                          <td className="px-4 py-2 text-sm text-gray-500">{item.email}</td>
                          <td className="px-4 py-2 text-sm">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              item.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              item.status === 'validated' ? 'bg-green-100 text-green-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {item.status}
                            </span>
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-500">{new Date(item.createdAt).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            {/* Doações */}
            <section>
              <h2 className="text-lg font-semibold mb-4">Doações ({data.donations.length})</h2>
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Doador</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Data</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {data.donations.map(item => (
                        <tr key={item.id}>
                          <td className="px-4 py-2 text-sm text-gray-900">{item.id}</td>
                          <td className="px-4 py-2 text-sm text-gray-900">{item.donorName}</td>
                          <td className="px-4 py-2 text-sm text-gray-500">{item.type}</td>
                          <td className="px-4 py-2 text-sm">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              item.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              item.status === 'completed' ? 'bg-green-100 text-green-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {item.status}
                            </span>
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-500">{new Date(item.createdAt).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            {/* Pedidos */}
            <section>
              <h2 className="text-lg font-semibold mb-4">Pedidos de Ajuda ({data.requests.length})</h2>
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Beneficiário</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Prioridade</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Data</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {data.requests.map(item => (
                        <tr key={item.id}>
                          <td className="px-4 py-2 text-sm text-gray-900">{item.id}</td>
                          <td className="px-4 py-2 text-sm text-gray-900">{item.beneficiaryName}</td>
                          <td className="px-4 py-2 text-sm">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              item.priority === 'high' ? 'bg-red-100 text-red-800' :
                              item.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {item.priority}
                            </span>
                          </td>
                          <td className="px-4 py-2 text-sm">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              item.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              item.status === 'fulfilled' ? 'bg-green-100 text-green-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {item.status}
                            </span>
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-500">{new Date(item.createdAt).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          </div>
        )}
      </main>
    </div>
  );
}