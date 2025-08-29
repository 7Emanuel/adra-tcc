import React, { useState } from 'react';
import { LocationService } from '../../services/LocationService';
import Button from '../Button';
import InfoBanner from './InfoBanner';

const AddressCapture = ({ 
  address, 
  onAddressChange, 
  coordinates, 
  onCoordinatesChange,
  errors = {},
  className = '' 
}) => {
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [locationError, setLocationError] = useState(null);
  const [showLocationConsent, setShowLocationConsent] = useState(false);

  const handleInputChange = (field, value) => {
    onAddressChange({
      ...address,
      [field]: value
    });
    setLocationError(null);
  };

  const handleGetCurrentLocation = async () => {
    if (!LocationService.isSupported()) {
      setLocationError('Geolocalização não é suportada neste navegador');
      return;
    }

    setIsGettingLocation(true);
    setLocationError(null);

    try {
      const position = await LocationService.getCurrentPosition();
      onCoordinatesChange(position);
      setShowLocationConsent(false);
      
      // PLACEHOLDER: Em produção, fazer geocodificação reversa para preencher endereço
      console.log('[AddressCapture] Localização obtida:', position);
    } catch (error) {
      console.error('[AddressCapture] Erro ao obter localização:', error);
      setLocationError(error.message);
    } finally {
      setIsGettingLocation(false);
    }
  };

  const formatCep = (value) => {
    const cleanValue = value.replace(/\D/g, '');
    if (cleanValue.length <= 8) {
      return cleanValue.replace(/(\d{5})(\d{3})/, '$1-$2');
    }
    return cleanValue.substring(0, 8).replace(/(\d{5})(\d{3})/, '$1-$2');
  };

  const handleCepChange = (value) => {
    const formattedCep = formatCep(value);
    handleInputChange('cep', formattedCep);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Endereço para Entrega
        </h3>
        <p className="text-sm text-gray-900-secondary">
          Informe seu endereço para que possamos organizar a entrega das doações.
        </p>
      </div>

      {/* Geolocation Section */}
      <div className="bg-gray-50 rounded-xl p-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-1">
              Localização Automática
            </h4>
            <p className="text-xs text-gray-500">
              Use sua localização atual para preencher automaticamente as coordenadas
            </p>
          </div>
          
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowLocationConsent(true)}
            disabled={isGettingLocation}
            className="flex items-center space-x-2 flex-shrink-0"
          >
            {isGettingLocation ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Obtendo...</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Usar Localização</span>
              </>
            )}
          </Button>
        </div>

        {/* Location Status */}
        {coordinates && (
          <div className="text-xs text-green-600 flex items-center space-x-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>
              Localização obtida: {LocationService.formatCoordinates(coordinates.lat, coordinates.lng)}
            </span>
          </div>
        )}

        {locationError && (
          <div className="text-xs text-red-600 mt-2">
            {locationError}
          </div>
        )}
      </div>

      {/* Location Consent Modal */}
      {showLocationConsent && (
        <InfoBanner
          type="info"
          title="Autorização de Localização"
          className="mb-4"
        >
          <div className="space-y-3">
            <p className="text-sm">
              A localização é usada apenas para otimizar a logística da entrega. 
              Você pode editar o endereço manualmente após obter as coordenadas.
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                variant="primary"
                size="sm"
                onClick={handleGetCurrentLocation}
                disabled={isGettingLocation}
              >
                Autorizar Localização
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setShowLocationConsent(false)}
              >
                Cancelar
              </Button>
            </div>
          </div>
        </InfoBanner>
      )}

      {/* Manual Address Form */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-gray-700">
          Endereço Manual
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* CEP */}
          <div>
            <label htmlFor="address-cep" className="block text-sm font-medium text-gray-700 mb-1">
              CEP *
            </label>
            <input
              id="address-cep"
              type="text"
              value={address.cep || ''}
              onChange={(e) => handleCepChange(e.target.value)}
              placeholder="00000-000"
              maxLength="9"
              required
              className={`
                w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600
                ${errors.cep ? 'border-red-500' : 'border-gray-300'}
              `}
              aria-describedby={errors.cep ? "cep-error" : undefined}
              aria-invalid={errors.cep ? 'true' : 'false'}
            />
            {errors.cep && (
              <p id="cep-error" className="text-sm text-red-600 mt-1" role="alert">
                {errors.cep}
              </p>
            )}
          </div>

          {/* Logradouro */}
          <div>
            <label htmlFor="address-street" className="block text-sm font-medium text-gray-700 mb-1">
              Logradouro *
            </label>
            <input
              id="address-street"
              type="text"
              value={address.logradouro || ''}
              onChange={(e) => handleInputChange('logradouro', e.target.value)}
              placeholder="Rua, Avenida, Travessa..."
              required
              className={`
                w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600
                ${errors.logradouro ? 'border-red-500' : 'border-gray-300'}
              `}
              aria-describedby={errors.logradouro ? "street-error" : undefined}
              aria-invalid={errors.logradouro ? 'true' : 'false'}
            />
            {errors.logradouro && (
              <p id="street-error" className="text-sm text-red-600 mt-1" role="alert">
                {errors.logradouro}
              </p>
            )}
          </div>

          {/* Número */}
          <div>
            <label htmlFor="address-number" className="block text-sm font-medium text-gray-700 mb-1">
              Número *
            </label>
            <input
              id="address-number"
              type="text"
              value={address.numero || ''}
              onChange={(e) => handleInputChange('numero', e.target.value)}
              placeholder="123, S/N"
              required
              className={`
                w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600
                ${errors.numero ? 'border-red-500' : 'border-gray-300'}
              `}
              aria-describedby={errors.numero ? "number-error" : undefined}
              aria-invalid={errors.numero ? 'true' : 'false'}
            />
            {errors.numero && (
              <p id="number-error" className="text-sm text-red-600 mt-1" role="alert">
                {errors.numero}
              </p>
            )}
          </div>

          {/* Complemento */}
          <div>
            <label htmlFor="address-complement" className="block text-sm font-medium text-gray-700 mb-1">
              Complemento
            </label>
            <input
              id="address-complement"
              type="text"
              value={address.complemento || ''}
              onChange={(e) => handleInputChange('complemento', e.target.value)}
              placeholder="Apto, Bloco, Casa..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
            />
          </div>

          {/* Bairro */}
          <div>
            <label htmlFor="address-neighborhood" className="block text-sm font-medium text-gray-700 mb-1">
              Bairro *
            </label>
            <input
              id="address-neighborhood"
              type="text"
              value={address.bairro || ''}
              onChange={(e) => handleInputChange('bairro', e.target.value)}
              placeholder="Nome do bairro"
              required
              className={`
                w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600
                ${errors.bairro ? 'border-red-500' : 'border-gray-300'}
              `}
              aria-describedby={errors.bairro ? "neighborhood-error" : undefined}
              aria-invalid={errors.bairro ? 'true' : 'false'}
            />
            {errors.bairro && (
              <p id="neighborhood-error" className="text-sm text-red-600 mt-1" role="alert">
                {errors.bairro}
              </p>
            )}
          </div>

          {/* Cidade */}
          <div>
            <label htmlFor="address-city" className="block text-sm font-medium text-gray-700 mb-1">
              Cidade *
            </label>
            <input
              id="address-city"
              type="text"
              value={address.cidade || ''}
              onChange={(e) => handleInputChange('cidade', e.target.value)}
              placeholder="Nome da cidade"
              required
              className={`
                w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600
                ${errors.cidade ? 'border-red-500' : 'border-gray-300'}
              `}
              aria-describedby={errors.cidade ? "city-error" : undefined}
              aria-invalid={errors.cidade ? 'true' : 'false'}
            />
            {errors.cidade && (
              <p id="city-error" className="text-sm text-red-600 mt-1" role="alert">
                {errors.cidade}
              </p>
            )}
          </div>

          {/* UF */}
          <div>
            <label htmlFor="address-uf" className="block text-sm font-medium text-gray-700 mb-1">
              UF *
            </label>
            <select
              id="address-uf"
              value={address.uf || ''}
              onChange={(e) => handleInputChange('uf', e.target.value)}
              required
              className={`
                w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600
                ${errors.uf ? 'border-red-500' : 'border-gray-300'}
              `}
              aria-describedby={errors.uf ? "uf-error" : undefined}
              aria-invalid={errors.uf ? 'true' : 'false'}
            >
              <option value="">Selecione o estado</option>
              <option value="SP">São Paulo</option>
              <option value="RJ">Rio de Janeiro</option>
              <option value="MG">Minas Gerais</option>
              <option value="RS">Rio Grande do Sul</option>
              <option value="PR">Paraná</option>
              <option value="SC">Santa Catarina</option>
              <option value="BA">Bahia</option>
              <option value="GO">Goiás</option>
              <option value="ES">Espírito Santo</option>
              <option value="DF">Distrito Federal</option>
              {/* Adicionar outros estados conforme necessário */}
            </select>
            {errors.uf && (
              <p id="uf-error" className="text-sm text-red-600 mt-1" role="alert">
                {errors.uf}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Map Placeholder */}
      <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
        <div className="text-gray-500">
          <svg className="w-12 h-12 mx-auto mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
          <h4 className="text-sm font-medium text-gray-700 mb-1">
            Mapa Interativo
          </h4>
          <p className="text-xs text-gray-500">
            O mapa será habilitado futuramente para visualizar a localização exata
          </p>
        </div>
      </div>
    </div>
  );
};

export default AddressCapture;
