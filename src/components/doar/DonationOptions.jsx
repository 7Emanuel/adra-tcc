import React from 'react';
import { motion } from 'framer-motion';
import { 
  CreditCard, 
  Package, 
  MapPin, 
  ArrowRight, 
  Clock,
  Users,
  Heart,
  Zap
} from 'lucide-react';
import Button from '../Button';

const DonationOptions = ({ 
  onChoice, 
  onLocationRequest, 
  userLocation, 
  nearbyUnits, 
  isLoadingLocation 
}) => {
  
  const optionVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    },
    hover: {
      y: -5,
      transition: {
        duration: 0.2,
        ease: "easeInOut"
      }
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const benefits = [
    {
      icon: <Zap className="w-5 h-5" />,
      text: "Doação instantânea"
    },
    {
      icon: <Heart className="w-5 h-5" />,
      text: "100% destinado aos projetos"
    },
    {
      icon: <Users className="w-5 h-5" />,
      text: "Impacto direto na comunidade"
    }
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-4xl mx-auto"
    >
      <div className="grid lg:grid-cols-2 gap-8">
        
        {/* Opção 1: Doação em Dinheiro */}
        <motion.div
          variants={optionVariants}
          whileHover="hover"
          className="group"
        >
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
            
            {/* Header com gradiente */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <CreditCard className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-semibold">Doação em Dinheiro</h3>
              </div>
              <p className="text-blue-100">
                PIX, transferência bancária ou cartão
              </p>
            </div>

            {/* Conteúdo */}
            <div className="p-6">
              <div className="space-y-4 mb-6">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                      {benefit.icon}
                    </div>
                    <span className="text-gray-700">{benefit.text}</span>
                  </div>
                ))}
              </div>

              <div className="bg-blue-50 rounded-lg p-4 mb-6">
                <h4 className="font-medium text-blue-900 mb-2">Valores sugeridos:</h4>
                <div className="flex flex-wrap gap-2">
                  {[25, 50, 100, 200].map(value => (
                    <span key={value} className="px-3 py-1 bg-white text-blue-700 rounded-full text-sm font-medium">
                      R$ {value}
                    </span>
                  ))}
                </div>
              </div>

              <Button
                onClick={() => onChoice('money')}
                className="w-full group-hover:shadow-lg transition-all"
                size="lg"
              >
                Doar Agora
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Opção 2: Doação de Items */}
        <motion.div
          variants={optionVariants}
          whileHover="hover"
          className="group"
        >
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
            
            {/* Header com gradiente */}
            <div className="bg-gradient-to-r from-green-600 to-green-700 p-6 text-white">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <Package className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-semibold">Doação de Items</h3>
              </div>
              <p className="text-green-100">
                Roupas, alimentos, produtos de higiene
              </p>
            </div>

            {/* Conteúdo */}
            <div className="p-6">
              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                    <Package className="w-5 h-5" />
                  </div>
                  <span className="text-gray-700">Doação de items físicos</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <span className="text-gray-700">
                    {userLocation ? 
                      `${nearbyUnits.length} unidades próximas` :
                      'Encontre unidades próximas'
                    }
                  </span>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                    <Clock className="w-5 h-5" />
                  </div>
                  <span className="text-gray-700">Atendimento seg-sex 8h-17h</span>
                </div>
              </div>

              {/* Status da localização */}
              {!userLocation && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center gap-2 text-amber-800">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      {isLoadingLocation ? 
                        'Obtendo sua localização...' :
                        'Ative a localização para ver unidades próximas'
                      }
                    </span>
                  </div>
                </div>
              )}

              {/* Lista de unidades próximas */}
              {userLocation && nearbyUnits.length > 0 && (
                <div className="bg-green-50 rounded-lg p-4 mb-6">
                  <h4 className="font-medium text-green-900 mb-2">Unidades próximas:</h4>
                  <div className="space-y-2">
                    {nearbyUnits.slice(0, 2).map(unit => (
                      <div key={unit.id} className="flex items-center justify-between text-sm">
                        <span className="text-green-800">{unit.nome}</span>
                        <span className="text-green-600 font-medium">
                          {unit.distance < 1 ? 
                            `${Math.round(unit.distance * 1000)}m` :
                            `${unit.distance.toFixed(1)}km`
                          }
                        </span>
                      </div>
                    ))}
                    {nearbyUnits.length > 2 && (
                      <span className="text-green-600 text-xs">
                        +{nearbyUnits.length - 2} outras unidades
                      </span>
                    )}
                  </div>
                </div>
              )}

              <Button
                onClick={() => onChoice('items')}
                variant="secondary"
                className="w-full group-hover:shadow-lg transition-all"
                size="lg"
              >
                Encontrar Local
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Info adicional */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mt-8 text-center"
      >
        <p className="text-gray-600 mb-4">
          Não sabe o que escolher? Ambas as formas de doação são importantes e fazem a diferença!
        </p>
        
        <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
            <span>Doações financeiras: processamento imediato</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span>Doações físicas: consulte horários das unidades</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default DonationOptions;
