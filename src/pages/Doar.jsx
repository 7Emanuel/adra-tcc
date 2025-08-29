import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, 
  MapPin, 
  Gift, 
  CreditCard, 
  Package, 
  Users,
  ArrowRight,
  Shield,
  CheckCircle
} from 'lucide-react';
import Button from '../components/Button';
import Modal from '../components/Modal';
import DonationOptions from '../components/doar/DonationOptions';
import TransferPixPanel from '../components/doar/TransferPixPanel';
import PhysicalDropoffPanel from '../components/doar/PhysicalDropoffPanel';
import { GeoService } from '../services/GeoService';
import { UnitsService } from '../services/UnitsService';

const Doar = () => {
  const [currentStep, setCurrentStep] = useState('options'); // options, transfer, physical
  const [userLocation, setUserLocation] = useState(null);
  const [locationPermission, setLocationPermission] = useState(null);
  const [nearbyUnits, setNearbyUnits] = useState([]);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);

  useEffect(() => {
    // Verificar se já temos permissão de localização
    checkLocationPermission();
  }, []);

  const checkLocationPermission = async () => {
    try {
      const permission = await GeoService.requestPermission();
      setLocationPermission(permission);
      
      if (permission === 'granted') {
        getCurrentLocation();
      }
    } catch (error) {
      console.error('Erro ao verificar permissão:', error);
      setLocationPermission('denied');
    }
  };

  const getCurrentLocation = async () => {
    setIsLoadingLocation(true);
    try {
      const location = await GeoService.getCurrentPosition();
      setUserLocation(location);
      
      // Buscar unidades próximas
      const units = UnitsService.getNearestUnits(location.lat, location.lng, 5);
      setNearbyUnits(units);
    } catch (error) {
      console.error('Erro ao obter localização:', error);
    } finally {
      setIsLoadingLocation(false);
    }
  };

  const handleLocationRequest = async () => {
    setShowLocationModal(true);
  };

  const handleLocationConsent = async (consent) => {
    setShowLocationModal(false);
    
    if (consent) {
      await getCurrentLocation();
    } else {
      setLocationPermission('denied');
    }
  };

  const handleDonationChoice = (type) => {
    if (type === 'money') {
      setCurrentStep('transfer');
    } else if (type === 'items') {
      if (!userLocation && locationPermission !== 'denied') {
        handleLocationRequest();
        return;
      }
      setCurrentStep('physical');
    }
  };

  const handleBack = () => {
    setCurrentStep('options');
  };

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: -20 }
  };

  const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.5
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-green-600 rounded-full flex items-center justify-center">
              <Heart className="w-6 h-6 text-white fill-current" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              Faça sua Doação
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Sua generosidade transforma vidas. Escolha como deseja contribuir 
            com as ações sociais da ADRA.
          </p>
        </motion.div>

        {/* Progress Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="max-w-md mx-auto mb-8"
        >
          <div className="flex items-center justify-center space-x-4">
            <div className={`
              w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
              ${currentStep === 'options' 
                ? 'bg-blue-600 text-white' 
                : 'bg-green-100 text-green-600'
              }
            `}>
              1
            </div>
            <div className={`
              h-1 w-16 rounded-full
              ${currentStep !== 'options' ? 'bg-green-400' : 'bg-gray-200'}
            `} />
            <div className={`
              w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
              ${currentStep === 'transfer' || currentStep === 'physical'
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-400'
              }
            `}>
              2
            </div>
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-2 px-2">
            <span>Escolher tipo</span>
            <span>Doar</span>
          </div>
        </motion.div>

        {/* Content Area */}
        <AnimatePresence mode="wait">
          {currentStep === 'options' && (
            <motion.div
              key="options"
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <DonationOptions 
                onChoice={handleDonationChoice}
                onLocationRequest={handleLocationRequest}
                userLocation={userLocation}
                nearbyUnits={nearbyUnits}
                isLoadingLocation={isLoadingLocation}
              />
            </motion.div>
          )}

          {currentStep === 'transfer' && (
            <motion.div
              key="transfer"
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <TransferPixPanel onBack={handleBack} />
            </motion.div>
          )}

          {currentStep === 'physical' && (
            <motion.div
              key="physical"
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <PhysicalDropoffPanel 
                onBack={handleBack}
                userLocation={userLocation}
                nearbyUnits={nearbyUnits}
                onLocationRequest={handleLocationRequest}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-16 max-w-4xl mx-auto"
        >
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-8">
            <h3 className="text-lg font-semibold text-center mb-6 text-gray-800">
              Por que doar com a ADRA?
            </h3>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Shield className="w-6 h-6 text-blue-600" />
                </div>
                <h4 className="font-medium text-gray-800 mb-2">Transparência</h4>
                <p className="text-sm text-gray-600">
                  Prestamos contas de todas as doações recebidas
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
                <h4 className="font-medium text-gray-800 mb-2">Impacto Real</h4>
                <p className="text-sm text-gray-600">
                  Mais de 50 mil pessoas atendidas anualmente
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="w-6 h-6 text-purple-600" />
                </div>
                <h4 className="font-medium text-gray-800 mb-2">Certificação</h4>
                <p className="text-sm text-gray-600">
                  ONG certificada e reconhecida nacionalmente
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Location Permission Modal */}
      <Modal
        isOpen={showLocationModal}
        onClose={() => setShowLocationModal(false)}
        title="Permissão de Localização"
        size="md"
      >
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <MapPin className="w-8 h-8 text-blue-600" />
          </div>
          
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Encontrar unidades próximas
          </h3>
          
          <p className="text-gray-600 mb-6">
            Para mostrarmos as unidades ADRA mais próximas de você, 
            precisamos acessar sua localização. Seus dados de localização 
            não serão armazenados.
          </p>
          
          <div className="flex gap-3 justify-center">
            <Button
              variant="outline"
              onClick={() => handleLocationConsent(false)}
            >
              Não permitir
            </Button>
            <Button
              onClick={() => handleLocationConsent(true)}
            >
              Permitir localização
            </Button>
          </div>
          
          <p className="text-xs text-gray-500 mt-4">
            Esta informação é usada apenas para melhorar sua experiência
          </p>
        </div>
      </Modal>
    </div>
  );
};

export default Doar;
