export class GeoService {
  static async getCurrentPosition(options = {}) {
    const defaultOptions = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 300000 // 5 minutos
    };

    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocalização não é suportada neste navegador'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: position.timestamp
          });
        },
        (error) => {
          let errorMessage = 'Erro ao obter localização';
          
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Permissão de localização negada pelo usuário';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Informações de localização não disponíveis';
              break;
            case error.TIMEOUT:
              errorMessage = 'Tempo limite para obter localização excedido';
              break;
            default:
              errorMessage = 'Erro desconhecido ao obter localização';
              break;
          }
          
          reject(new Error(errorMessage));
        },
        { ...defaultOptions, ...options }
      );
    });
  }

  static isGeolocationSupported() {
    return 'geolocation' in navigator;
  }

  static async requestPermission() {
    if (!this.isGeolocationSupported()) {
      throw new Error('Geolocalização não é suportada');
    }

    try {
      const permission = await navigator.permissions.query({ name: 'geolocation' });
      return permission.state;
    } catch (error) {
      // Se navigator.permissions não está disponível, tenta obter localização diretamente
      try {
        await this.getCurrentPosition({ timeout: 5000 });
        return 'granted';
      } catch (geoError) {
        return 'denied';
      }
    }
  }

  static formatCoordinates(lat, lng, precision = 6) {
    return {
      lat: parseFloat(lat.toFixed(precision)),
      lng: parseFloat(lng.toFixed(precision))
    };
  }

  static isValidCoordinate(lat, lng) {
    return (
      typeof lat === 'number' && 
      typeof lng === 'number' &&
      lat >= -90 && lat <= 90 &&
      lng >= -180 && lng <= 180 &&
      !isNaN(lat) && !isNaN(lng)
    );
  }

  static async watchPosition(callback, errorCallback, options = {}) {
    if (!this.isGeolocationSupported()) {
      errorCallback(new Error('Geolocalização não é suportada'));
      return null;
    }

    const defaultOptions = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 60000 // 1 minuto
    };

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        callback({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp
        });
      },
      (error) => {
        errorCallback(new Error(`Erro de geolocalização: ${error.message}`));
      },
      { ...defaultOptions, ...options }
    );

    return watchId;
  }

  static stopWatching(watchId) {
    if (watchId !== null && this.isGeolocationSupported()) {
      navigator.geolocation.clearWatch(watchId);
    }
  }

  // Métodos para geocoding reverso (se necessário no futuro)
  static async reverseGeocode(lat, lng) {
    // Implementação futura para converter coordenadas em endereço
    // Pode usar serviços como Nominatim (OpenStreetMap) ou Google Geocoding API
    throw new Error('Geocoding reverso não implementado ainda');
  }

  // Método para calcular bounds de um conjunto de coordenadas
  static calculateBounds(coordinates) {
    if (!coordinates || coordinates.length === 0) {
      return null;
    }

    let minLat = coordinates[0].lat;
    let maxLat = coordinates[0].lat;
    let minLng = coordinates[0].lng;
    let maxLng = coordinates[0].lng;

    coordinates.forEach(coord => {
      minLat = Math.min(minLat, coord.lat);
      maxLat = Math.max(maxLat, coord.lat);
      minLng = Math.min(minLng, coord.lng);
      maxLng = Math.max(maxLng, coord.lng);
    });

    return {
      southWest: { lat: minLat, lng: minLng },
      northEast: { lat: maxLat, lng: maxLng },
      center: {
        lat: (minLat + maxLat) / 2,
        lng: (minLng + maxLng) / 2
      }
    };
  }
}
