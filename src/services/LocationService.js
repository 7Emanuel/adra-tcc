/**
 * LOCATION SERVICE - WRAPPER DA GEOLOCATION API
 * 
 * Este serviço encapsula a Geolocation API do navegador
 * e adiciona tratamento de erros e normalizações.
 * 
 * No backend real, complementar com:
 * - Geocodificação server-side
 * - Normalização de endereços (via CEP)
 * - Validação de coordenadas
 * - Compliance LGPD para dados de localização
 */

export const LocationService = {
  /**
   * Obtém posição atual do usuário via Geolocation API
   * @returns {Promise<{lat: number, lng: number, accuracy: number}>}
   */
  getCurrentPosition: () => {
    return new Promise((resolve, reject) => {
      // Verifica se Geolocation está disponível
      if (!navigator.geolocation) {
        reject(new Error('Geolocation não está disponível neste navegador'));
        return;
      }

      // Opções para alta precisão
      const options = {
        enableHighAccuracy: true,  // Usa GPS se disponível
        timeout: 10000,           // 10 segundos de timeout
        maximumAge: 300000        // Cache por 5 minutos
      };

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy, // em metros
            timestamp: position.timestamp
          };
          
          console.log('[LocationService] Posição obtida:', coords);
          resolve(coords);
        },
        (error) => {
          let errorMessage = 'Erro ao obter localização';
          
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Permissão negada. Habilite a localização nas configurações do navegador.';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Localização indisponível. Verifique sua conexão.';
              break;
            case error.TIMEOUT:
              errorMessage = 'Tempo esgotado. Tente novamente.';
              break;
            default:
              errorMessage = 'Erro desconhecido ao obter localização.';
              break;
          }
          
          console.error('[LocationService] Erro:', error);
          reject(new Error(errorMessage));
        },
        options
      );
    });
  },

  /**
   * Verifica se Geolocation está disponível
   * @returns {boolean}
   */
  isSupported: () => {
    return 'geolocation' in navigator;
  },

  /**
   * MOCK: Busca endereço por CEP (placeholder)
   * Backend real: integração com API de CEP (ViaCEP, etc.)
   */
  getAddressByCep: async (cep) => {
    // Remove caracteres não numéricos
    const cleanCep = cep.replace(/\D/g, '');
    
    // Validação básica de CEP
    if (cleanCep.length !== 8) {
      throw new Error('CEP deve ter 8 dígitos');
    }

    // PLACEHOLDER: simula delay da API
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // PLACEHOLDER: retorna endereço mockado
    return {
      cep: cleanCep,
      logradouro: 'Rua das Flores',
      bairro: 'Centro',
      cidade: 'São Paulo',
      uf: 'SP',
      // Backend real: incluir coordenadas se disponível
      coordinates: null
    };
  },

  /**
   * MOCK: Geocodifica endereço para coordenadas
   * Backend real: usar Google Maps API, Nominatim, etc.
   */
  geocodeAddress: async (address) => {
    // PLACEHOLDER: simula delay da API
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // PLACEHOLDER: retorna coordenadas mockadas de São Paulo
    return {
      lat: -23.5505,
      lng: -46.6333,
      accuracy: 100,
      formatted_address: address
    };
  },

  /**
   * Valida se coordenadas estão em formato válido
   */
  validateCoordinates: (lat, lng) => {
    if (typeof lat !== 'number' || typeof lng !== 'number') {
      return false;
    }
    
    // Latitude deve estar entre -90 e 90
    if (lat < -90 || lat > 90) {
      return false;
    }
    
    // Longitude deve estar entre -180 e 180
    if (lng < -180 || lng > 180) {
      return false;
    }
    
    return true;
  },

  /**
   * Formata coordenadas para exibição
   */
  formatCoordinates: (lat, lng) => {
    if (!LocationService.validateCoordinates(lat, lng)) {
      return 'Coordenadas inválidas';
    }
    
    return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
  }
};

// Helper para debug - REMOVER EM PRODUÇÃO
if (typeof window !== 'undefined') {
  window.LocationService = LocationService;
}
