import React, { useState } from 'react';
import { adminApi } from '../services/adminApi';

const AdminDebugVercel = () => {
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState({});

  const testEndpoint = async (name, apiCall) => {
    setLoading(prev => ({ ...prev, [name]: true }));
    try {
      const result = await apiCall();
      setResults(prev => ({ ...prev, [name]: { success: true, data: result } }));
    } catch (error) {
      console.error(`Error testing ${name}:`, error);
      setResults(prev => ({ ...prev, [name]: { success: false, error: error.message } }));
    } finally {
      setLoading(prev => ({ ...prev, [name]: false }));
    }
  };

  const tests = [
    {
      name: 'Login',
      call: () => adminApi.login('kahoot')
    },
    {
      name: 'Beneficiaries',
      call: () => adminApi.beneficiaries({ page: 1, pageSize: 5 })
    },
    {
      name: 'Donations',
      call: () => adminApi.donations({ page: 1, pageSize: 5 })
    },
    {
      name: 'Requests',
      call: () => adminApi.requests({ page: 1, pageSize: 5 })
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Debug Admin API - Vercel</h1>
        
        <div className="space-y-4">
          {tests.map(test => (
            <div key={test.name} className="bg-white p-4 rounded-lg shadow">
              <div className="flex items-center justify-between mb-2">
                <h2 className="font-semibold">{test.name}</h2>
                <button
                  onClick={() => testEndpoint(test.name, test.call)}
                  disabled={loading[test.name]}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading[test.name] ? 'Testando...' : 'Testar'}
                </button>
              </div>
              
              {results[test.name] && (
                <div className="mt-2">
                  <div className={`p-3 rounded ${results[test.name].success ? 'bg-green-100' : 'bg-red-100'}`}>
                    <strong>Status:</strong> {results[test.name].success ? 'Sucesso' : 'Erro'}
                    <pre className="mt-2 text-sm overflow-auto">
                      {JSON.stringify(results[test.name].success ? results[test.name].data : results[test.name].error, null, 2)}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-8 bg-white p-4 rounded-lg shadow">
          <h2 className="font-semibold mb-2">Informações do Ambiente</h2>
          <div className="text-sm space-y-1">
            <div><strong>Hostname:</strong> {window.location.hostname}</div>
            <div><strong>Environment:</strong> {import.meta.env.MODE}</div>
            <div><strong>API Base:</strong> {window.location.hostname.includes('vercel.app') ? '/api/admin' : 'LOCAL'}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDebugVercel;