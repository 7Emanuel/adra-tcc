import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import Button from '../components/Button';
 

export default function MapaUnidades() {
  const [userLocation, setUserLocation] = useState(null);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [nearestUnitId, setNearestUnitId] = useState(null);
  const [sortMode, setSortMode] = useState('name'); // inicia por nome, muda para distância quando geo exata
  const [isGeoExact, setIsGeoExact] = useState(false);
  const [geoSource, setGeoSource] = useState('none'); // 'none' | 'gps' | 'manual'
  const [askLocation, setAskLocation] = useState(true);
  const [manualOrigin, setManualOrigin] = useState('');

  // Dados das unidades ADRA (dados estáticos para demonstração)
  const unidades = [
    {
      id: 1,
      nome: "ADRA São Paulo Centro",
      endereco: "Rua das Flores, 123 - Centro, São Paulo - SP",
      cep: "01234-567",
      telefone: "(11) 1234-5678",
      horario: "Seg-Sex: 8h às 17h | Sáb: 8h às 12h",
      coordenadas: [-23.5505, -46.6333],
      especialidades: ["Roupas", "Alimentos", "Móveis"]
    },
    {
      id: 2,
      nome: "ADRA São Paulo Norte",
      endereco: "Av. Principal, 456 - Vila Nova, São Paulo - SP",
      cep: "02345-678",
      telefone: "(11) 2345-6789",
      horario: "Seg-Sex: 9h às 18h | Sáb: 9h às 13h",
      coordenadas: [-23.5205, -46.6133],
      especialidades: ["Roupas", "Higiene", "Material Escolar"]
    },
    {
      id: 3,
      nome: "ADRA Campinas",
      endereco: "Rua da Esperança, 789 - Centro, Campinas - SP",
      cep: "13012-345",
      telefone: "(19) 3456-7890",
      horario: "Seg-Sex: 8h às 16h",
      coordenadas: [-22.9056, -47.0608],
      especialidades: ["Alimentos", "Móveis", "Eletrodomésticos"]
    },
    {
      id: 4,
      nome: "ADRA Santo André",
      endereco: "Av. das Nações, 321 - Centro, Santo André - SP",
      cep: "09123-456",
      telefone: "(11) 4567-8901",
      horario: "Seg-Sex: 9h às 17h | Sáb: 9h às 12h",
      coordenadas: [-23.6548, -46.5308],
      especialidades: ["Roupas", "Alimentos", "Produtos de Higiene"]
    }
  ];

  useEffect(() => {
    // Restaurar origem salva
    try {
      const saved = localStorage.getItem('adra_origin');
      if (saved) {
        const obj = JSON.parse(saved);
        if (obj && Array.isArray(obj.coords)) {
          setUserLocation(obj.coords);
          setIsGeoExact(obj.type === 'gps');
          setGeoSource(obj.type || 'none');
          setManualOrigin(obj.text || '');
          setAskLocation(false);
          setSortMode('distance');
        }
      }
    } catch {}
    // Não solicitar automaticamente; aguardamos ação do usuário se não houver origem salva
    setLoading(false);
  }, []);

  const solicitarMinhaLocalizacao = () => {
    if (!navigator.geolocation) {
      alert('Seu navegador não suporta geolocalização. Informe um endereço manualmente.');
      return;
    }
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = [position.coords.latitude, position.coords.longitude];
        setUserLocation(location);
        setIsGeoExact(true);
        setLoading(false);
        setAskLocation(false);
        setSortMode('distance');
        setGeoSource('gps');
        try { localStorage.setItem('adra_origin', JSON.stringify({ type: 'gps', coords: location })); } catch {}
      },
      (error) => {
        console.warn('Geolocalização negada ou indisponível:', error);
        setLoading(false);
        setAskLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000,
      }
    );
  };

  const geocodeAddress = async (query) => {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`;
    const res = await fetch(url, {
      headers: {
        'Accept': 'application/json'
      }
    });
    if (!res.ok) throw new Error('Falha ao geocodificar');
    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) throw new Error('Endereço não encontrado');
    const { lat, lon } = data[0];
    return [parseFloat(lat), parseFloat(lon)];
  };

  const usarEnderecoManual = async () => {
    if (!manualOrigin || !manualOrigin.trim()) {
      alert('Digite um endereço válido.');
      return;
    }
    try {
      setLoading(true);
      const coords = await geocodeAddress(manualOrigin.trim());
      setUserLocation(coords);
      setIsGeoExact(false);
      setAskLocation(false);
      setSortMode('distance');
      setGeoSource('manual');
      try { localStorage.setItem('adra_origin', JSON.stringify({ type: 'manual', coords, text: manualOrigin.trim() })); } catch {}
    } catch (e) {
      console.warn(e);
      alert('Não foi possível localizar este endereço. Tente ser mais específico.');
    } finally {
      setLoading(false);
    }
  };

  // Removido: inicialização de mapa (Leaflet)

  const calcularDistancia = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Raio da Terra em km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const getDistanciaString = (unidade) => {
    if (!userLocation) return '';
    const distancia = calcularDistancia(
      userLocation[0], userLocation[1],
      unidade.coordenadas[0], unidade.coordenadas[1]
    );
    return `${distancia.toFixed(1)} km`;
  };

  // Tempo estimado simples (aprox.) assumindo 35 km/h em vias urbanas
  const getTempoEstimado = (unidade) => {
    if (!userLocation) return '';
    const distancia = calcularDistancia(
      userLocation[0], userLocation[1],
      unidade.coordenadas[0], unidade.coordenadas[1]
    );
    const minutos = Math.max(3, Math.round((distancia / 35) * 60));
    return `~${minutos} min`;
  };

  // Definir unidade mais próxima quando tivermos userLocation
  useEffect(() => {
    if (!userLocation) return;
    let nearest = { id: null, dist: Infinity };
    unidades.forEach((u) => {
      const d = calcularDistancia(userLocation[0], userLocation[1], u.coordenadas[0], u.coordenadas[1]);
      if (d < nearest.dist) {
        nearest = { id: u.id, dist: d };
      }
    });
    setNearestUnitId(nearest.id);
  }, [userLocation]);

  // Lista ordenada conforme sortMode
  const unidadesOrdenadas = (() => {
    const arr = [...unidades];
    if (sortMode === 'name') {
      return arr.sort((a, b) => a.nome.localeCompare(b.nome));
    }
    // por distância
    return arr.sort((a, b) => {
      if (!userLocation) return 0;
      const da = calcularDistancia(userLocation[0], userLocation[1], a.coordenadas[0], a.coordenadas[1]);
      const db = calcularDistancia(userLocation[0], userLocation[1], b.coordenadas[0], b.coordenadas[1]);
      return da - db;
    });
  })();

  const abrirRotaGoogle = (unidade) => {
    const destLat = unidade.coordenadas[0];
    const destLng = unidade.coordenadas[1];
    let originParam = '';
    if (manualOrigin && manualOrigin.trim()) {
      originParam = `&origin=${encodeURIComponent(manualOrigin.trim())}`;
    } else if (Array.isArray(userLocation) && userLocation.length === 2) {
      originParam = `&origin=${userLocation[0]},${userLocation[1]}`;
    }
    const url = `https://www.google.com/maps/dir/?api=1&destination=${destLat},${destLng}${originParam}&travelmode=driving`;
    const win = window.open(url, '_blank', 'noopener');
    if (win) {
      win.opener = null;
    }
  };

  const copiarEndereco = async (texto) => {
    try {
      await navigator.clipboard.writeText(texto);
      alert('Endereço copiado!');
    } catch (e) {
      console.warn('Falha ao copiar', e);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">

      <main className="container mx-auto px-4 py-16">
          {/* Status da origem atual e ação para alterar */}
          {!askLocation && (userLocation || manualOrigin) && (
            <div className="mb-4 flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg p-3">
              <p className="text-sm text-gray-700">
                Origem: {geoSource === 'gps' ? 'Minha localização (GPS)' : manualOrigin ? `"${manualOrigin}"` : 'Indefinida'}
              </p>
              <button
                className="text-sm text-green-700 hover:text-green-800 underline"
                onClick={() => setAskLocation(true)}
              >
                Alterar origem
              </button>
            </div>
          )}
          {/* Banner para solicitar a origem */}
          {askLocation && (
            <div className="mb-6 bg-white border border-gray-200 rounded-xl p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div>
                <h3 className="font-semibold text-gray-900">De onde você está saindo?</h3>
                <p className="text-sm text-gray-600">Use sua localização atual ou informe um endereço para traçarmos a melhor rota e sugerirmos a unidade mais próxima.</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                <button
                  onClick={solicitarMinhaLocalizacao}
                  className="inline-flex items-center justify-center bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Usar minha localização
                </button>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={manualOrigin}
                    onChange={(e) => setManualOrigin(e.target.value)}
                    placeholder="Digite seu endereço (ex: Av. Paulista, 100 - SP)"
                    className="border border-gray-300 rounded-lg px-3 py-2 w-72"
                  />
                  <button
                    onClick={usarEnderecoManual}
                    className="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-200"
                  >
                    Usar este endereço
                  </button>
                </div>
              </div>
            </div>
          )}
          {loading && (
            <p className="text-sm text-gray-600 mb-4">Carregando sua localização…</p>
          )}

          {/* Sugestão de unidade mais próxima */}
          {!loading && nearestUnitId && (
            <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-wide text-green-700 font-semibold mb-1">Sugestão</p>
                  <h3 className="text-lg font-bold text-gray-900">
                    Unidade mais próxima: {unidades.find(u => u.id === nearestUnitId)?.nome}
                  </h3>
                  <p className="text-sm text-green-800 mt-1">
                    Distância {getDistanciaString(unidades.find(u => u.id === nearestUnitId))}
                    {userLocation && ` • Tempo ${getTempoEstimado(unidades.find(u => u.id === nearestUnitId))}`}
                    {geoSource==='gps' && ' • Baseado no GPS'}
                    {geoSource==='manual' && ' • Baseado no endereço informado'}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="primary"
                    onClick={() => setSelectedUnit(unidades.find(u => u.id === nearestUnitId))}
                  >
                    Ver detalhes
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => abrirRotaGoogle(unidades.find(u => u.id === nearestUnitId))}
                  >
                    Traçar rota
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Controles */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Unidades próximas</h2>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-600">Ordenar por:</span>
              <button
                className={`px-2 py-1 rounded ${sortMode==='distance' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700'}`}
                onClick={() => setSortMode('distance')}
              >
                Distância
              </button>
              <button
                className={`px-2 py-1 rounded ${sortMode==='name' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700'}`}
                onClick={() => setSortMode('name')}
              >
                Nome
              </button>
            </div>
          </div>

          <div className="grid lg:grid-cols-1 gap-8">
            {/* Lista de Unidades */}
            <div className="lg:col-span-1 space-y-4">
              {unidadesOrdenadas.map((unidade) => (
                <div 
                  key={unidade.id}
                  className={`bg-white rounded-lg shadow-md p-4 cursor-pointer transition-all ${
                    selectedUnit?.id === unidade.id 
                      ? 'ring-2 ring-green-500 bg-green-50' 
                      : 'hover:shadow-lg'
                  }`}
                  onClick={() => setSelectedUnit(unidade)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">{unidade.nome}</h3>
                    <div className="flex items-center gap-2">
                      {nearestUnitId === unidade.id && (
                        <span className="text-[10px] uppercase tracking-wide bg-green-100 text-green-800 px-2 py-0.5 rounded-full">Recomendado</span>
                      )}
                      {userLocation && (
                        <>
                          <span className="text-sm text-green-600 font-medium">
                            {getDistanciaString(unidade)}
                          </span>
                          <span className="text-[11px] text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                            {getTempoEstimado(unidade)}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 mb-2 flex items-center gap-2">
                    <span>{unidade.endereco}</span>
                    <button
                      onClick={(e) => { e.stopPropagation(); copiarEndereco(unidade.endereco); }}
                      className="text-xs text-gray-600 hover:text-gray-900 underline"
                    >
                      Copiar
                    </button>
                  </p>
                  <p className="text-sm text-gray-500 mb-3">{unidade.horario}</p>

                  <div className="flex flex-wrap gap-1 mb-3">
                    {unidade.especialidades.map((esp, index) => (
                      <span 
                        key={index}
                        className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                      >
                        {esp}
                      </span>
                    ))}
                  </div>

                  {userLocation && (
                    <p className="text-xs text-gray-600 mb-3">Tempo estimado: {getTempoEstimado(unidade)} { !isGeoExact && '(aprox.)' }</p>
                  )}

                  <div className="flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        abrirRotaGoogle(unidade);
                      }}
                      className="flex-1 text-xs bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition-colors"
                    >
                      <svg className="w-3 h-3 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m0 0L9 7" />
                      </svg>
                      Ver Rota
                    </button>
                    <a 
                      href={`tel:${unidade.telefone}`}
                      className="text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <svg className="w-3 h-3 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      Ligar
                    </a>
                  </div>
                </div>
              ))}
            </div>

            {/* Removido: Mapa interativo. Exibimos apenas a lista e, opcionalmente, detalhes abaixo. */}
          </div>

          {/* Detalhes da Unidade Selecionada (abaixo da lista) */}
          {selectedUnit && (
            <div className="mt-6 bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {selectedUnit.nome}
              </h3>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Endereço:</h4>
                  <p className="text-gray-600 mb-4 flex items-center gap-2">
                    <span>{selectedUnit.endereco}</span>
                    <button
                      onClick={() => copiarEndereco(selectedUnit.endereco)}
                      className="text-xs text-gray-600 hover:text-gray-900 underline"
                    >
                      Copiar
                    </button>
                  </p>
                  <p className="text-gray-600 mb-4">CEP: {selectedUnit.cep}</p>
                  
                  <h4 className="font-semibold text-gray-900 mb-2">Horário:</h4>
                  <p className="text-gray-600">{selectedUnit.horario}</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Contato:</h4>
                  <p className="text-gray-600 mb-4">{selectedUnit.telefone}</p>
                  
                  <h4 className="font-semibold text-gray-900 mb-2">Especialidades:</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedUnit.especialidades.map((esp, index) => (
                      <span 
                        key={index}
                        className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full"
                      >
                        {esp}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex gap-4">
                <button
                  onClick={() => abrirRotaGoogle(selectedUnit)}
                  className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                  Traçar Rota no Google Maps
                </button>
                <a 
                  href={`tel:${selectedUnit.telefone}`}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  Ligar
                </a>
              </div>
            </div>
          )}

          {/* Botões de Navegação */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <Link to="/doar/itens">
              <Button variant="secondary" size="lg">
                ← Voltar para Itens
              </Button>
            </Link>
            <Link to="/doar">
              <Button variant="secondary" size="lg">
                Voltar ao Hub de Doações
              </Button>
            </Link>
          </div>
      </main>

      <Footer />
    </div>
  );
}
