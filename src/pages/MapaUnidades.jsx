import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Button from '../components/Button';

export default function MapaUnidades() {
  const [userLocation, setUserLocation] = useState(null);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mapError, setMapError] = useState(null);
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

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
    // Solicitar geolocalização do usuário
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = [position.coords.latitude, position.coords.longitude];
          setUserLocation(location);
          setLoading(false);
          initializeMap(location);
        },
        (error) => {
          console.warn('Geolocalização negada ou indisponível:', error);
          // Usar localização padrão (São Paulo centro)
          const defaultLocation = [-23.5505, -46.6333];
          setUserLocation(defaultLocation);
          setLoading(false);
          initializeMap(defaultLocation);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000
        }
      );
    } else {
      // Fallback se geolocalização não estiver disponível
      const defaultLocation = [-23.5505, -46.6333];
      setUserLocation(defaultLocation);
      setLoading(false);
      initializeMap(defaultLocation);
    }
  }, []);

  const initializeMap = (centerLocation) => {
    // Verificar se o Leaflet está disponível
    if (typeof window !== 'undefined' && window.L) {
      try {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.remove();
        }

        const map = window.L.map(mapRef.current).setView(centerLocation, 12);

        // Adicionar tile layer do OpenStreetMap
        window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors'
        }).addTo(map);

        // Adicionar marcador da localização do usuário
        if (userLocation) {
          const userIcon = window.L.divIcon({
            html: '<div style="background-color: #3B82F6; width: 12px; height: 12px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 10px rgba(59,130,246,0.5);"></div>',
            iconSize: [18, 18],
            className: 'custom-div-icon'
          });

          window.L.marker(centerLocation, { icon: userIcon })
            .addTo(map)
            .bindPopup('Sua localização atual')
            .openPopup();
        }

        // Adicionar marcadores das unidades
        unidades.forEach(unidade => {
          const unitIcon = window.L.divIcon({
            html: `<div style="background-color: #059669; color: white; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; border: 2px solid white; box-shadow: 0 2px 10px rgba(5,150,105,0.4);">${unidade.id}</div>`,
            iconSize: [30, 30],
            className: 'custom-div-icon'
          });

          window.L.marker(unidade.coordenadas, { icon: unitIcon })
            .addTo(map)
            .bindPopup(`
              <div style="min-width: 200px;">
                <h3 style="margin: 0 0 8px 0; font-weight: bold;">${unidade.nome}</h3>
                <p style="margin: 0 0 4px 0; font-size: 12px;">${unidade.endereco}</p>
                <p style="margin: 0 0 8px 0; font-size: 12px; color: #666;">${unidade.horario}</p>
                <button onclick="window.selectUnit(${unidade.id})" style="background-color: #059669; color: white; border: none; padding: 4px 8px; border-radius: 4px; font-size: 12px; cursor: pointer;">Ver detalhes</button>
              </div>
            `);
        });

        mapInstanceRef.current = map;

        // Função global para selecionar unidade (chamada do popup)
        window.selectUnit = (unitId) => {
          const unit = unidades.find(u => u.id === unitId);
          setSelectedUnit(unit);
        };

      } catch (error) {
        console.error('Erro ao inicializar mapa:', error);
        setMapError('Erro ao carregar o mapa. Tente recarregar a página.');
      }
    } else {
      setMapError('Bibliotecas do mapa não carregadas. Tente recarregar a página.');
    }
  };

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

  const abrirRotaGoogle = (unidade) => {
    const endereco = encodeURIComponent(unidade.endereco);
    const url = `https://www.google.com/maps/dir/?api=1&destination=${endereco}`;
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Link do CSS do Leaflet */}
      <link 
        rel="stylesheet" 
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
        crossOrigin=""
      />
      
      {/* Script do Leaflet */}
      <script 
        src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
        integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo="
        crossOrigin=""
      ></script>

      <main className="container mx-auto px-4 py-16">
        <div className="max-w-7xl mx-auto">
          {/* Header da Página */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Unidades ADRA Próximas
            </h1>
            <p className="text-xl text-gray-600">
              Encontre a unidade mais próxima para entregar sua doação
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Lista de Unidades */}
            <div className="lg:col-span-1 space-y-4">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Unidades Disponíveis
              </h2>
              
              {unidades.map((unidade) => (
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
                    {userLocation && (
                      <span className="text-sm text-green-600 font-medium">
                        {getDistanciaString(unidade)}
                      </span>
                    )}
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-2">{unidade.endereco}</p>
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

            {/* Mapa */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-4 border-b border-gray-200">
                  <h2 className="text-xl font-bold text-gray-900">Mapa das Unidades</h2>
                  {loading && (
                    <p className="text-sm text-gray-600">Carregando sua localização...</p>
                  )}
                </div>
                
                <div className="relative">
                  {mapError ? (
                    <div className="h-96 flex items-center justify-center bg-gray-100">
                      <div className="text-center">
                        <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-gray-600">{mapError}</p>
                        <button 
                          onClick={() => window.location.reload()}
                          className="mt-2 text-green-600 hover:text-green-700 underline"
                        >
                          Recarregar página
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div 
                      ref={mapRef} 
                      className="h-96 w-full"
                      style={{ minHeight: '400px' }}
                    />
                  )}
                </div>
              </div>

              {/* Detalhes da Unidade Selecionada */}
              {selectedUnit && (
                <div className="mt-6 bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    {selectedUnit.nome}
                  </h3>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Endereço:</h4>
                      <p className="text-gray-600 mb-4">{selectedUnit.endereco}</p>
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
            </div>
          </div>

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
        </div>
      </main>

      <Footer />
    </div>
  );
}
