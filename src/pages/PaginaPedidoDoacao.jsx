import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthService } from '../services/AuthService';
import Button from '../components/Button';
import InfoBanner from '../components/necessitado/InfoBanner';
import AddressCapture from '../components/necessitado/AddressCapture';
import RequestItemRow from '../components/necessitado/RequestItemRow';
import TermsCheckbox from '../components/necessitado/TermsCheckbox';

const PaginaPedidoDoacao = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Form state
  const [address, setAddress] = useState({
    cep: '',
    logradouro: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    uf: ''
  });
  const [coordinates, setCoordinates] = useState(null);
  const [items, setItems] = useState([]);
  const [urgency, setUrgency] = useState('');
  const [description, setDescription] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  
  // Validation and UI state
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    // Verifica acesso e carrega dados
    const checkAccess = async () => {
      const isLoggedIn = AuthService.isLoggedIn();
      
      if (!isLoggedIn) {
        navigate('/preciso-de-ajuda', { replace: true });
        return;
      }
      
      // Sincroniza status do usuário com o backend primeiro
      let currentUser;
      try {
        currentUser = await AuthService.syncUserStatusWithBackend();
      } catch (error) {
        console.warn('Erro ao sincronizar status:', error);
        currentUser = AuthService.getUser();
      }
      
      // Guard: apenas usuários aprovados podem acessar
      if (currentUser.verificationStatus !== 'approved' && currentUser.isVerified !== true) {
        navigate('/espera-validacao', { replace: true });
        return;
      }
      
      setUser(currentUser);
      loadDraftData();
      setLoading(false);
    };

    checkAccess();
  }, [navigate]);

  // Carrega rascunho do localStorage
  const loadDraftData = () => {
    try {
      const draft = localStorage.getItem('pedido_rascunho');
      if (draft) {
        const data = JSON.parse(draft);
        setAddress(data.address || {});
        setCoordinates(data.coordinates || null);
        setItems(data.items || []);
        setUrgency(data.urgency || '');
        setDescription(data.description || '');
        console.log('[PaginaPedidoDoacao] Rascunho carregado:', data);
      }
    } catch (error) {
      console.error('[PaginaPedidoDoacao] Erro ao carregar rascunho:', error);
    }
  };

  // Salva rascunho no localStorage
  const saveDraft = () => {
    const draftData = {
      address,
      coordinates,
      items,
      urgency,
      description,
      savedAt: new Date().toISOString()
    };
    
    localStorage.setItem('pedido_rascunho', JSON.stringify(draftData));
    return draftData;
  };

  // Adiciona novo item
  const addItem = () => {
    const newItem = {
      id: Date.now().toString(),
      name: '',
      category: '',
      quantity: 1,
      unit: '',
      notes: ''
    };
    setItems([...items, newItem]);
  };

  // Atualiza item
  const updateItem = (updatedItem) => {
    setItems(items.map(item => 
      item.id === updatedItem.id ? updatedItem : item
    ));
  };

  // Remove item
  const removeItem = (itemId) => {
    setItems(items.filter(item => item.id !== itemId));
  };

  // Validação do formulário
  const validateForm = () => {
    const newErrors = {};

    // Validação de endereço
    if (!coordinates) {
      if (!address.cep) newErrors.cep = 'CEP é obrigatório';
      else if (!/^\d{5}-?\d{3}$/.test(address.cep)) newErrors.cep = 'CEP inválido';
      
      if (!address.logradouro) newErrors.logradouro = 'Logradouro é obrigatório';
      if (!address.numero) newErrors.numero = 'Número é obrigatório';
      if (!address.bairro) newErrors.bairro = 'Bairro é obrigatório';
      if (!address.cidade) newErrors.cidade = 'Cidade é obrigatória';
      if (!address.uf) newErrors.uf = 'UF é obrigatório';
    }

    // Validação de itens
    if (items.length === 0) {
      newErrors.items = 'Adicione pelo menos um item';
    } else {
      const itemErrors = {};
      items.forEach(item => {
        const itemError = {};
        if (!item.name?.trim()) itemError.name = 'Nome é obrigatório';
        if (!item.category) itemError.category = 'Categoria é obrigatória';
        if (!item.quantity || item.quantity < 1) itemError.quantity = 'Quantidade deve ser maior que 0';
        
        if (Object.keys(itemError).length > 0) {
          itemErrors[item.id] = itemError;
        }
      });
      
      if (Object.keys(itemErrors).length > 0) {
        newErrors.itemErrors = itemErrors;
      }
    }

    // Validação de termos
    if (!termsAccepted) {
      newErrors.terms = 'Você deve aceitar os termos para continuar';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Salvar rascunho
  const handleSaveDraft = async () => {
    setIsSaving(true);
    
    try {
      const draftData = saveDraft();
      
      // Simula delay da API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('[PaginaPedidoDoacao] Rascunho salvo:', draftData);
      
      // Feedback visual
      const originalText = document.querySelector('[data-save-button]')?.textContent;
      const button = document.querySelector('[data-save-button]');
      if (button) {
        button.textContent = 'Salvo!';
        setTimeout(() => {
          button.textContent = originalText;
        }, 2000);
      }
      
    } catch (error) {
      console.error('[PaginaPedidoDoacao] Erro ao salvar rascunho:', error);
      alert('Erro ao salvar rascunho. Tente novamente.');
    } finally {
      setIsSaving(false);
    }
  };

  // Enviar pedido
  const handleSubmitRequest = async () => {
    if (!validateForm()) {
      // Scroll para o primeiro erro
      const firstError = document.querySelector('[aria-invalid="true"]');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        firstError.focus();
      }
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Dados para API
      const requestData = {
        userId: user.id,
        contact: { name: user.nome, email: user.email, phone: user.telefone },
        address: coordinates ? null : address,
        coordinates: coordinates || null,
        items: items.map(item => ({
          name: item.name.trim(),
          category: item.category,
          quantity: item.quantity,
          unit: item.unit?.trim() || 'unidade',
          notes: item.notes?.trim() || ''
        })),
        urgency: urgency.trim(),
        description: description.trim(),
        termsAccepted
      };
      
      // Envia para API do servidor (proxy para /api)
      const res = await fetch('/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData)
      });
      if (!res.ok) {
        let msg = `Erro ${res.status}`;
        try {
          const err = await res.json();
          if (err?.error) msg = err.error;
        } catch {}
        throw new Error(msg);
      }
      const out = await res.json();
      console.log('[PaginaPedidoDoacao] Pedido enviado:', out);
      
      // Sucesso
      setSubmitSuccess(true);
      
      // Limpa rascunho após sucesso
      localStorage.removeItem('pedido_rascunho');
      
    } catch (error) {
      console.error('[PaginaPedidoDoacao] Erro ao enviar pedido:', error);
      alert(error?.message || 'Erro ao enviar pedido. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (submitSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Pedido Enviado com Sucesso!
          </h1>
          
          <p className="text-lg text-gray-600 mb-8 leading-relaxed">
            Obrigado, <strong>{user.nome}</strong>! Recebemos seu pedido e nossa equipe 
            entrará em contato em breve para confirmar os detalhes e coordenar a entrega.
          </p>
          
          <div className="bg-white rounded-2xl p-6 mb-8 text-left">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Próximos Passos:
            </h2>
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="flex items-start space-x-3">
                <span className="text-green-600 font-bold">1.</span>
                <span>Nossa equipe analisará seu pedido (até 24h)</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="text-green-600 font-bold">2.</span>
                <span>Entraremos em contato via telefone/WhatsApp</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="text-green-600 font-bold">3.</span>
                <span>Agendaremos a visita/entrega conforme disponibilidade</span>
              </li>
            </ul>
          </div>
          
          <Button
            variant="primary"
            size="lg"
            onClick={() => navigate('/')}
          >
            Voltar à Página Inicial
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header espaçamento */}
      <div className="pt-20 pb-16 px-4">
        <div className="container mx-auto max-w-4xl">
          
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Faça seu pedido de doações
            </h1>
            <p className="text-lg text-gray-600">
              Olá, <strong>{user?.nome}</strong>! Preencha os dados abaixo para solicitar as doações que você precisa.
            </p>
          </div>

          {/* Important Banner */}
          <InfoBanner 
            type="warning" 
            title="Importante"
            className="mb-8"
          >
            <p className="text-sm">
              <strong>Só peça o que realmente precisa.</strong> Ajuda justa beneficia mais famílias. 
              Lembre-se que haverá validação presencial/remota antes da entrega.
            </p>
          </InfoBanner>

          <form className="space-y-8">
            {/* Seção de Identificação */}
            <section className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  Identificação
                </h2>
                <Button
                  variant="secondary"
                  size="sm"
                  disabled
                  className="opacity-50"
                >
                  Editar dados (em breve)
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Nome completo:</span>
                  <p className="font-medium text-gray-900">{user.nome}</p>
                </div>
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
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    ✓ Conta Verificada
                  </span>
                </div>
              </div>
            </section>

            {/* Seção de Endereço */}
            <section className="bg-white rounded-2xl p-6 shadow-sm">
              <AddressCapture
                address={address}
                onAddressChange={setAddress}
                coordinates={coordinates}
                onCoordinatesChange={setCoordinates}
                errors={errors}
              />
            </section>

            {/* Seção de Pedido */}
            <section className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Itens Solicitados
                </h2>
                <p className="text-sm text-gray-600">
                  Liste os itens que você precisa. Seja específico quanto possível.
                </p>
              </div>

              {/* Lista de Itens */}
              <div className="space-y-4 mb-6">
                {items.map((item, index) => (
                  <RequestItemRow
                    key={item.id}
                    item={{ ...item, index: index + 1 }}
                    onUpdate={updateItem}
                    onRemove={() => removeItem(item.id)}
                    error={errors.itemErrors?.[item.id]}
                  />
                ))}
                
                {items.length === 0 && (
                  <div className="text-center py-8 text-gray-600">
                    <svg className="w-12 h-12 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m0 0V9a1 1 0 011-1h1m-1 1v4h-2" />
                    </svg>
                    <p>Nenhum item adicionado ainda</p>
                    <p className="text-xs">Clique em "Adicionar item" para começar</p>
                  </div>
                )}
              </div>

              {/* Error de itens */}
              {errors.items && (
                <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3 mb-4" role="alert">
                  {errors.items}
                </div>
              )}

              {/* Adicionar Item */}
              <Button
                type="button"
                variant="secondary"
                onClick={addItem}
                className="w-full mb-6"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Adicionar Item
              </Button>

              {/* Urgência e Descrição */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="urgency" className="block text-sm font-medium text-gray-700 mb-1">
                    Urgência (opcional)
                  </label>
                  <select
                    id="urgency"
                    value={urgency}
                    onChange={(e) => setUrgency(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                  >
                    <option value="">Selecione a urgência</option>
                    <option value="baixa">Baixa - posso aguardar</option>
                    <option value="media">Média - algumas semanas</option>
                    <option value="alta">Alta - alguns dias</option>
                    <option value="urgente">Urgente - situação crítica</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Descreva sua necessidade
                  </label>
                  <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Explique brevemente sua situação e por que precisa destes itens..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 resize-none"
                  />
                </div>
              </div>
            </section>

            {/* Termos */}
            <section className="bg-white rounded-2xl p-6 shadow-sm">
              <TermsCheckbox
                checked={termsAccepted}
                onChange={setTermsAccepted}
                error={errors.terms}
              />
            </section>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-end">
              <Button
                type="button"
                variant="secondary"
                size="lg"
                onClick={handleSaveDraft}
                disabled={isSaving || isSubmitting}
                className="w-full sm:w-auto"
                data-save-button
              >
                {isSaving ? 'Salvando...' : 'Salvar Rascunho'}
              </Button>
              
              <Button
                type="button"
                variant="primary"
                size="lg"
                onClick={handleSubmitRequest}
                disabled={isSubmitting || isSaving}
                className="w-full sm:w-auto min-w-[200px]"
              >
                {isSubmitting ? (
                  <>
                    <svg className="w-5 h-5 animate-spin mr-2" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Enviando Pedido...
                  </>
                ) : (
                  'Enviar Pedido'
                )}
              </Button>
            </div>

            {/* Info Footer */}
            <div className="text-center text-xs text-gray-500 mt-8">
              <p>
                Pedidos só podem ser feitos por contas verificadas e uma conta por pessoa. 
                Todas as informações serão validadas antes da entrega.
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PaginaPedidoDoacao;
