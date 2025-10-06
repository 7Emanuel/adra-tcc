import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import { adminApi } from '../services/adminApi';

const TabButton = ({ active, children, ...props }) => (
  <button
    className={`px-4 py-2 rounded-t-lg border-b-2 ${active ? 'border-green-600 text-green-700' : 'border-transparent text-gray-600 hover:text-gray-800'}`}
    {...props}
  >
    {children}
  </button>
);

function usePagedFetcher(fetcher, initialParams) {
  const [params, setParams] = useState(initialParams);
  const [data, setData] = useState({ items: [], page: 1, pageSize: 20, total: 0, pages: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError('');
    fetcher(params)
      .then((res) => { if (mounted) setData(res); })
      .catch((e) => { if (mounted) setError(e.message || 'Erro'); })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, [JSON.stringify(params)]);
  return { data, loading, error, params, setParams };
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('beneficiaries');

  const beneficiaries = usePagedFetcher(
    (p) => adminApi.beneficiaries(p),
    { status: 'pending', search: '', page: 1, pageSize: 20 }
  );
  const donations = usePagedFetcher(
    (p) => adminApi.donations(p),
    { status: '', search: '', page: 1, pageSize: 20 }
  );

  const handleExport = async () => {
    const isBenef = tab === 'beneficiaries';
    const csv = await (isBenef ? adminApi.exportBeneficiaries() : adminApi.exportDonations());
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = isBenef ? 'beneficiarios.csv' : 'doacoes.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleValidate = async (id, approved) => {
    const reason = !approved ? window.prompt('Motivo da rejeição (opcional):') || '' : undefined;
    await adminApi.validateBeneficiary(id, { approved, reason });
    beneficiaries.setParams({ ...beneficiaries.params });
  };

  // Redirect home if backend says no session
  useEffect(() => {
    const be = beneficiaries.error || '';
    const de = donations.error || '';
    if (/(Sem sessão|Sessão inválida)/i.test(be + ' ' + de)) {
      navigate('/');
    }
  }, [beneficiaries.error, donations.error]);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-20">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-green-600 rounded-md flex items-center justify-center"><span className="text-white font-bold text-sm">A</span></div>
            <h1 className="text-xl font-bold text-gray-900">Painel Administrativo</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" onClick={() => navigate('/')}>Home</Button>
            <Button variant="primary" size="sm" onClick={() => adminApi.logout().then(() => navigate('/'))}>Sair</Button>
          </div>
        </div>
        <div className="container mx-auto px-4">
          <div className="flex gap-2">
            <TabButton active={tab==='beneficiaries'} onClick={() => setTab('beneficiaries')}>Validações pendentes</TabButton>
            <TabButton active={tab==='donations'} onClick={() => setTab('donations')}>Coletas/Entregas</TabButton>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <div className="flex items-center gap-2 mb-4">
          <input
            className="border rounded-lg px-3 py-2 w-full max-w-sm"
            placeholder={tab==='beneficiaries' ? 'Buscar beneficiários' : 'Buscar doações'}
            value={(tab==='beneficiaries'?beneficiaries.params.search:donations.params.search) || ''}
            onChange={(e) => {
              const v = e.target.value;
              if (tab==='beneficiaries') beneficiaries.setParams({ ...beneficiaries.params, search: v, page: 1 });
              else donations.setParams({ ...donations.params, search: v, page: 1 });
            }}
          />
          <Button variant="secondary" onClick={handleExport}>Exportar CSV</Button>
        </div>

        {tab === 'beneficiaries' ? (
          <SectionTable
            loading={beneficiaries.loading}
            error={beneficiaries.error}
            data={beneficiaries.data}
            onPrev={() => beneficiaries.setParams({ ...beneficiaries.params, page: Math.max(1, (beneficiaries.data.page||1) - 1) })}
            onNext={() => beneficiaries.setParams({ ...beneficiaries.params, page: Math.min(beneficiaries.data.pages||1, (beneficiaries.data.page||1) + 1) })}
            renderRow={(b) => (
              <tr key={b.id} className="border-b">
                <td className="px-3 py-2 text-sm text-gray-700">{b.id}</td>
                <td className="px-3 py-2 text-sm">{b.name}</td>
                <td className="px-3 py-2 text-sm">{b.document?.value}</td>
                <td className="px-3 py-2 text-sm">{b.email}</td>
                <td className="px-3 py-2 text-sm">{b.phone}</td>
                <td className="px-3 py-2 text-sm">{b.address?.city}/{b.address?.state}</td>
                <td className="px-3 py-2 text-sm">{b.status}</td>
                <td className="px-3 py-2 text-sm text-right">
                  <Button size="sm" variant="secondary" onClick={() => alert('Detalhes em breve')}>Ver</Button>
                  <Button size="sm" className="ml-2" onClick={() => handleValidate(b.id, true)}>Validar</Button>
                  <Button size="sm" className="ml-2" variant="accent" onClick={() => handleValidate(b.id, false)}>Rejeitar</Button>
                </td>
              </tr>
            )}
          />
        ) : (
          <SectionTable
            loading={donations.loading}
            error={donations.error}
            data={donations.data}
            onPrev={() => donations.setParams({ ...donations.params, page: Math.max(1, (donations.data.page||1) - 1) })}
            onNext={() => donations.setParams({ ...donations.params, page: Math.min(donations.data.pages||1, (donations.data.page||1) + 1) })}
            renderRow={(d) => (
              <tr key={d.id} className="border-b">
                <td className="px-3 py-2 text-sm text-gray-700">{d.id}</td>
                <td className="px-3 py-2 text-sm">{d.donor?.name}</td>
                <td className="px-3 py-2 text-sm">{d.type}</td>
                <td className="px-3 py-2 text-sm">{d.status}</td>
                <td className="px-3 py-2 text-sm">{d.address?.city}/{d.address?.state}</td>
                <td className="px-3 py-2 text-sm truncate max-w-xs" title={(d.items||[]).map(i=>`${i.name} x${i.qty}`).join('; ')}>
                  {(d.items||[]).map(i=>i.name).join(', ')}
                </td>
                <td className="px-3 py-2 text-sm text-right">
                  <Button size="sm" variant="secondary" onClick={() => alert('Detalhes em breve')}>Ver</Button>
                  <Button size="sm" className="ml-2" onClick={() => adminApi.updateDonation(d.id, { status: 'scheduled' }).then(()=>donations.setParams({ ...donations.params }))}>Agendar</Button>
                </td>
              </tr>
            )}
          />
        )}
      </main>
    </div>
  );
}

function SectionTable({ loading, error, data, renderRow, onPrev, onNext }) {
  if (loading) return <p className="text-gray-600">Carregando...</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  return (
    <div className="bg-white rounded-xl shadow-sm border">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50 text-left text-xs uppercase text-gray-600">
            <tr>
              <th className="px-3 py-2">ID</th>
              <th className="px-3 py-2">Nome/Doador</th>
              <th className="px-3 py-2">Tipo/Doc</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2">Cidade</th>
              <th className="px-3 py-2">Resumo</th>
              <th className="px-3 py-2 text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {data.items.map(renderRow)}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between px-3 py-2 border-t">
        <span className="text-xs text-gray-600">{data.total} registros • Página {data.page} de {data.pages}</span>
        <div className="flex gap-2">
          <Button size="sm" variant="secondary" disabled={data.page<=1} onClick={onPrev}>Anterior</Button>
          <Button size="sm" variant="secondary" disabled={data.page>=data.pages} onClick={onNext}>Próxima</Button>
        </div>
      </div>
    </div>
  );
}
