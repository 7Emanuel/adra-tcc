import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import { adminApi } from '../services/adminApi';
import AdminLoginModal from '../components/AdminLoginModal';
import Modal from '../components/Modal';

const TabButton = ({ active, children, ...props }) => (
  <button
    className={`px-4 py-2 rounded-t-lg border-b-2 ${active ? 'border-green-600 text-green-700' : 'border-transparent text-gray-600 hover:text-gray-800'}`}
    {...props}
  >
    {children}
  </button>
);

function usePagedFetcher(fetcher, initialParams, enabled = true) {
  const [params, setParams] = useState(initialParams);
  const [data, setData] = useState({ items: [], page: 1, pageSize: 20, total: 0, pages: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => {
    if (!enabled) return;
    let mounted = true;
    setLoading(true);
    setError('');
    fetcher(params)
      .then((res) => { if (mounted) setData(res); })
      .catch((e) => { if (mounted) setError(e.message || 'Erro'); })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, [JSON.stringify(params), enabled]);
  return { data, loading, error, params, setParams };
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('beneficiaries');
  const [showAdminLogin, setShowAdminLogin] = useState(false); // Mudado para false
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [detailItem, setDetailItem] = useState(null);
  const [rejectItem, setRejectItem] = useState(null);
  const [rejectReason, setRejectReason] = useState('');

  console.log('🔍 AdminDashboard - Estado atual:', { showAdminLogin, isAuthenticated });

  // Verificar se já há uma sessão de admin ao carregar a página
  useEffect(() => {
    const checkExistingSession = async () => {
      console.log('🔍 Verificando sessão...');
      console.log('🌐 Hostname atual:', window.location.hostname);
      console.log('📍 Ambiente:', import.meta.env.MODE);
      // Por enquanto, sempre mostrar login para evitar problemas de "Carregando..."
      setShowAdminLogin(true);
      setIsAuthenticated(false);
    };
    
    checkExistingSession();
  }, []);

  const beneficiaries = usePagedFetcher(
    (p) => adminApi.beneficiaries(p),
    { status: 'pending', search: '', page: 1, pageSize: 20 },
    isAuthenticated
  );
  const donations = usePagedFetcher(
    (p) => adminApi.donations(p),
    { status: '', search: '', page: 1, pageSize: 20 },
    isAuthenticated
  );
  // New: requests fetcher
  const requests = usePagedFetcher(
    (p) => adminApi.requests(p),
    { status: '', search: '', page: 1, pageSize: 20 },
    isAuthenticated
  );

  const handleExport = async () => {
    const isBenef = tab === 'beneficiaries';
    const isDon = tab === 'donations';
    const csv = await (isBenef ? adminApi.exportBeneficiaries() : isDon ? adminApi.exportDonations() : adminApi.exportRequests());
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = isBenef ? 'beneficiarios.csv' : isDon ? 'doacoes.csv' : 'pedidos_ajuda.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleValidate = async (id, approved) => {
    if (!approved) {
      setRejectItem(id);
      setRejectReason('');
      return;
    }
    await adminApi.validateBeneficiary(id, { approved: true });
    beneficiaries.setParams({ ...beneficiaries.params });
  };

  // Prompt login if backend says no session (instead of redirecting away)
  useEffect(() => {
    const be = beneficiaries.error || '';
    const de = donations.error || '';
    const re = requests.error || '';
    console.log('🔍 Verificando erros:', { beneficiariesError: be, donationsError: de, requestsError: re });
    if (/(Sem sessão|Sessão inválida)/i.test(be + ' ' + de + ' ' + re)) {
      console.log('❌ Sessão inválida detectada, redirecionando para home');
      navigate('/');
    }
  }, [beneficiaries.error, donations.error, requests.error, navigate]);

  // If the admin API is down (proxy/500), show an empty-state message instead of raw error for beneficiaries
  const beneErrorLooksLikeServerDown = /Erro\s*5\d\d|ECONNREFUSED|Failed to fetch|NetworkError|proxy/i.test(
    beneficiaries.error || ''
  );
  const donaErrorLooksLikeServerDown = /Erro\s*5\d\d|ECONNREFUSED|Failed to fetch|NetworkError|proxy/i.test(
    donations.error || ''
  );
  const reqErrorLooksLikeServerDown = /Erro\s*5\d\d|ECONNREFUSED|Failed to fetch|NetworkError|proxy|404/i.test(
    requests.error || ''
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Debug info - remove this in production */}
      {import.meta.env.DEV && (
        <div className="fixed top-0 right-0 bg-yellow-200 p-2 text-xs z-50">
          Auth: {isAuthenticated ? 'TRUE' : 'FALSE'} | Modal: {showAdminLogin ? 'OPEN' : 'CLOSED'}
        </div>
      )}
      
      {/* Conteúdo principal - só mostra se autenticado */}
      {isAuthenticated ? (
        <div>
          <header className="bg-white border-b sticky top-0 z-20">
            <div className="container mx-auto px-4 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-600 rounded-md flex items-center justify-center"><span className="text-white font-bold text-sm">A</span></div>
                <h1 className="text-xl font-bold text-gray-900">Painel Administrativo</h1>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="secondary" size="sm" onClick={() => navigate('/')}>Home</Button>
                <Button variant="primary" size="sm" onClick={() => {
                  adminApi.logout().then(() => {
                    setIsAuthenticated(false);
                    setShowAdminLogin(true);
                  });
                }}>Sair</Button>
              </div>
            </div>
            <div className="container mx-auto px-4">
              <div className="flex gap-2">
                <TabButton active={tab==='beneficiaries'} onClick={() => setTab('beneficiaries')}>Validações pendentes</TabButton>
                <TabButton active={tab==='donations'} onClick={() => setTab('donations')}>Coletas/Entregas</TabButton>
                {/* New tab */}
                <TabButton active={tab==='requests'} onClick={() => setTab('requests')}>Pedidos de Ajuda</TabButton>
              </div>
            </div>
          </header>

      <main className="container mx-auto px-4 py-6">
        <div className="flex items-center gap-2 mb-4">
          <input
            className="border rounded-lg px-3 py-2 w-full max-w-sm"
            placeholder={tab==='beneficiaries' ? 'Buscar beneficiários' : tab==='donations' ? 'Buscar doações' : 'Buscar pedidos'}
            value={(tab==='beneficiaries'?beneficiaries.params.search: tab==='donations'?donations.params.search: requests.params.search) || ''}
            onChange={(e) => {
              const v = e.target.value;
              if (tab==='beneficiaries') beneficiaries.setParams({ ...beneficiaries.params, search: v, page: 1 });
              else if (tab==='donations') donations.setParams({ ...donations.params, search: v, page: 1 });
              else requests.setParams({ ...requests.params, search: v, page: 1 });
            }}
          />
          <Button variant="secondary" onClick={handleExport}>Exportar CSV</Button>
        </div>

        {tab === 'beneficiaries' ? (
          <SectionTable
            loading={beneficiaries.loading}
            // Hide low-level 5xx/proxy errors and show a friendly empty state instead
            error={beneErrorLooksLikeServerDown ? '' : beneficiaries.error}
            data={beneficiaries.data}
            emptyMessage="Não há contas de necessitados ainda."
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
                  <Button size="sm" variant="secondary" onClick={() => setDetailItem({ type: 'beneficiary', data: b })}>Ver</Button>
                  <Button size="sm" className="ml-2" onClick={() => handleValidate(b.id, true)}>Validar</Button>
                  <Button size="sm" className="ml-2" variant="accent" onClick={() => handleValidate(b.id, false)}>Rejeitar</Button>
                </td>
              </tr>
            )}
          />
        ) : tab === 'donations' ? (
          <SectionTable
            loading={donations.loading}
            error={donaErrorLooksLikeServerDown ? '' : donations.error}
            data={donations.data}
            emptyMessage="Ainda não há doadores."
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
                  <Button size="sm" variant="secondary" onClick={() => setDetailItem({ type: 'donation', data: d })}>Ver</Button>
                  <Button size="sm" className="ml-2" onClick={() => adminApi.updateDonation(d.id, { status: 'scheduled' }).then(()=>donations.setParams({ ...donations.params }))}>Agendar</Button>
                </td>
              </tr>
            )}
          />
        ) : (
          // Requests tab
          <SectionTable
            loading={requests.loading}
            error={reqErrorLooksLikeServerDown ? '' : requests.error}
            data={requests.data}
            emptyMessage="Ainda não há doadores."
            onPrev={() => requests.setParams({ ...requests.params, page: Math.max(1, (requests.data.page||1) - 1) })}
            onNext={() => requests.setParams({ ...requests.params, page: Math.min(requests.data.pages||1, (requests.data.page||1) + 1) })}
            renderRow={(r) => (
              <tr key={r.id} className="border-b">
                <td className="px-3 py-2 text-sm text-gray-700">{r.id}</td>
                <td className="px-3 py-2 text-sm">{r.contact?.name}</td>
                <td className="px-3 py-2 text-sm">{r.urgency || '-'}</td>
                <td className="px-3 py-2 text-sm">{r.status || '-'}</td>
                <td className="px-3 py-2 text-sm">{(r.address?.cidade||r.address?.city)}/{(r.address?.uf||r.address?.state)}</td>
                <td className="px-3 py-2 text-sm truncate max-w-xs" title={(r.items||[]).map(i=>`${i.name} x${i.qty||i.quantity||1}`).join('; ')}>
                  {(r.items||[]).map(i=>i.name).join(', ')}
                </td>
                <td className="px-3 py-2 text-sm text-right">
                  <Button size="sm" variant="secondary" onClick={() => setDetailItem({ type: 'request', data: r })}>Ver</Button>
                </td>
              </tr>
            )}
          />
        )}
      </main>

      {/* Admin login modal - obrigatório para acesso */}
      <AdminLoginModal
        isOpen={showAdminLogin}
        onClose={() => {
          // Não permitir fechar sem autenticação - redirecionar para home
          navigate('/');
        }}
        onSuccess={() => {
          console.log('✅ onSuccess do modal chamado');
          console.log('🔄 Definindo showAdminLogin = false');
          setShowAdminLogin(false);
          console.log('🔄 Definindo isAuthenticated = true');
          setIsAuthenticated(true);
          console.log('✅ Estado atualizado: isAuthenticated = true');
          
          // Force re-render by updating state in next tick
          setTimeout(() => {
            console.log('🔄 Trigger refetch dos dados...');
            beneficiaries.setParams({ ...beneficiaries.params });
            donations.setParams({ ...donations.params });
            requests.setParams({ ...requests.params });
            console.log('✅ Refetch disparado');
          }, 100);
        }}
      />

      {/* Detail modal */}
      <Modal
        isOpen={!!detailItem}
        onClose={() => setDetailItem(null)}
        title={detailItem?.type === 'donation' ? 'Detalhes da Doação' : detailItem?.type === 'beneficiary' ? 'Detalhes do Beneficiário' : 'Pedido de Ajuda'}
        primaryAction={{ label: 'Fechar', onClick: () => setDetailItem(null) }}
      >
        {detailItem && (
          <div className="space-y-2 text-sm">
            {detailItem.type === 'beneficiary' ? (
              <>
                <div><span className="text-gray-600">Nome: </span><span className="font-medium">{detailItem.data.name}</span></div>
                <div><span className="text-gray-600">Documento: </span><span className="font-medium">{detailItem.data.document?.type} {detailItem.data.document?.value}</span></div>
                <div><span className="text-gray-600">Email: </span><span className="font-medium">{detailItem.data.email}</span></div>
                <div><span className="text-gray-600">Telefone: </span><span className="font-medium">{detailItem.data.phone}</span></div>
                <div><span className="text-gray-600">Endereço: </span><span className="font-medium">{detailItem.data.address?.city}/{detailItem.data.address?.state}</span></div>
                <div><span className="text-gray-600">Status: </span><span className="font-medium">{detailItem.data.status}</span></div>
              </>
            ) : detailItem.type === 'donation' ? (
              <>
                <div><span className="text-gray-600">Doador: </span><span className="font-medium">{detailItem.data.donor?.name}</span></div>
                <div><span className="text-gray-600">Tipo: </span><span className="font-medium">{detailItem.data.type}</span></div>
                <div><span className="text-gray-600">Cidade/UF: </span><span className="font-medium">{detailItem.data.address?.city}/{detailItem.data.address?.state}</span></div>
                <div><span className="text-gray-600">Itens: </span><span className="font-medium">{(detailItem.data.items||[]).map(i=>`${i.name} x${i.qty}`).join('; ')}</span></div>
                <div><span className="text-gray-600">Status: </span><span className="font-medium">{detailItem.data.status}</span></div>
              </>
            ) : (
              // request details
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div><span className="text-gray-600">Nome: </span><span className="font-medium">{detailItem.data.contact?.name}</span></div>
                  <div><span className="text-gray-600">Email: </span><span className="font-medium">{detailItem.data.contact?.email}</span></div>
                  <div><span className="text-gray-600">Telefone: </span><span className="font-medium">{detailItem.data.contact?.phone}</span></div>
                  <div><span className="text-gray-600">Cidade/UF: </span><span className="font-medium">{(detailItem.data.address?.cidade||detailItem.data.address?.city)}/{(detailItem.data.address?.uf||detailItem.data.address?.state)}</span></div>
                </div>
                <div><span className="text-gray-600">Urgência: </span><span className="font-medium">{detailItem.data.urgency || '-'}</span></div>
                <div>
                  <span className="text-gray-600">Itens: </span>
                  <ul className="list-disc ml-5">
                    {(detailItem.data.items||[]).map((i, idx) => (
                      <li key={idx}>{i.name} — {i.qty||i.quantity||1} {i.unit||'unid.'} {i.category?`(${i.category})`:''}</li>
                    ))}
                  </ul>
                </div>
                {detailItem.data.description ? (
                  <div><span className="text-gray-600">Descrição: </span><span className="font-medium whitespace-pre-wrap">{detailItem.data.description}</span></div>
                ) : null}
              </>
            )}
          </div>
        )}
      </Modal>

      {/* Rejection reason modal */}
      <Modal
        isOpen={!!rejectItem}
        onClose={() => setRejectItem(null)}
        title="Rejeitar cadastro"
        primaryAction={{
          label: 'Rejeitar',
          onClick: async () => {
            const reason = (rejectReason || '').trim();
            if (!reason) return; // botão ficará desabilitado
            await adminApi.validateBeneficiary(rejectItem, { approved: false, reason });
            setRejectItem(null);
            setRejectReason('');
            beneficiaries.setParams({ ...beneficiaries.params });
          },
          disabled: !(rejectReason || '').trim(),
        }}
        secondaryAction={{ label: 'Cancelar', onClick: () => setRejectItem(null) }}
      >
        <div className="space-y-2">
          <p className="text-sm text-gray-700">Informe o motivo da rejeição. Esse texto será mostrado ao solicitante na página de espera.</p>
          <textarea
            className="w-full border rounded-lg p-2 text-sm"
            rows={4}
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder="Escreva o motivo da rejeição..."
          />
        </div>
      </Modal>
        </div>
      ) : (
        // Tela de login se não autenticado
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-xl">A</span>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Acesso Administrativo</h2>
            <p className="text-gray-600">Digite sua senha para continuar</p>
          </div>
        </div>
      )}
    </div>
  );
}

function SectionTable({ loading, error, data, renderRow, onPrev, onNext, emptyMessage }) {
  if (loading) return <p className="text-gray-600">Carregando...</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  const isEmpty = !data || !Array.isArray(data.items) || data.items.length === 0;
  if (isEmpty) {
    return (
      <div className="bg-white rounded-xl shadow-sm border">
        <div className="p-6 text-center text-gray-600">
          {emptyMessage || 'Nenhum registro encontrado.'}
        </div>
      </div>
    );
  }
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
