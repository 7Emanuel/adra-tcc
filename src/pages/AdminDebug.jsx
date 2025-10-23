import React, { useState, useEffect } from 'react';
import { adminApi } from '../services/adminApi';

export default function AdminDebug() {
  const [logs, setLogs] = useState([]);
  const [password, setPassword] = useState('kahoot');

  const addLog = (message, type = 'info') => {
    setLogs(prev => [...prev, { 
      time: new Date().toLocaleTimeString(), 
      message, 
      type 
    }]);
  };

  const testLogin = async () => {
    try {
      addLog('🔐 Testando login...', 'info');
      const result = await adminApi.login(password);
      addLog(`✅ Login OK: ${JSON.stringify(result)}`, 'success');
    } catch (error) {
      addLog(`❌ Login falhou: ${error.message}`, 'error');
    }
  };

  const testBeneficiaries = async () => {
    try {
      addLog('👥 Testando beneficiários...', 'info');
      const result = await adminApi.beneficiaries({ page: 1, pageSize: 5 });
      addLog(`✅ Beneficiários OK: ${result.items?.length || 0} items`, 'success');
    } catch (error) {
      addLog(`❌ Beneficiários falhou: ${error.message}`, 'error');
    }
  };

  const testDonations = async () => {
    try {
      addLog('💰 Testando doações...', 'info');
      const result = await adminApi.donations({ page: 1, pageSize: 5 });
      addLog(`✅ Doações OK: ${result.items?.length || 0} items`, 'success');
    } catch (error) {
      addLog(`❌ Doações falhou: ${error.message}`, 'error');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">🔧 Debug Admin API</h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Testes de API</h2>
          
          <div className="flex gap-4 mb-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Senha admin"
              className="px-3 py-2 border rounded"
            />
          </div>
          
          <div className="flex gap-4 mb-6">
            <button 
              onClick={testLogin}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              🔐 Testar Login
            </button>
            <button 
              onClick={testBeneficiaries}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              👥 Testar Beneficiários
            </button>
            <button 
              onClick={testDonations}
              className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
            >
              💰 Testar Doações
            </button>
            <button 
              onClick={() => setLogs([])}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
            >
              🗑️ Limpar
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">📝 Logs</h2>
          <div className="bg-gray-900 text-green-400 p-4 rounded font-mono text-sm max-h-96 overflow-y-auto">
            {logs.length === 0 ? (
              <div className="text-gray-500">Nenhum log ainda...</div>
            ) : (
              logs.map((log, i) => (
                <div key={i} className={`mb-1 ${
                  log.type === 'error' ? 'text-red-400' : 
                  log.type === 'success' ? 'text-green-400' : 
                  'text-blue-400'
                }`}>
                  [{log.time}] {log.message}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}