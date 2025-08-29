import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Clock, Phone, Mail, ExternalLink, Star } from 'lucide-react';
import Button from '../Button';

const UnitCard = ({ 
  unit, 
  distance, 
  userLocation, 
  onGetDirections,
  onContactUnit,
  variant = 'default',
  showDistance = true,
  className = ''
}) => {
  const [openingStatus, setOpeningStatus] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    // Calcular status de funcionamento
    const now = new Date();
    const currentHour = now.getHours();
    const currentDay = now.getDay(); // 0 = domingo

    let status = {};
    
    if (currentDay === 0 || currentDay === 6) {
      status = { isOpen: false, text: 'Fechado - Final de semana', color: 'text-red-600' };
    } else if (currentHour >= 8 && currentHour < 17) {
      status = { isOpen: true, text: 'Aberto agora', color: 'text-green-600' };
    } else if (currentHour < 8) {
      const hoursUntilOpen = 8 - currentHour;
      status = { 
        isOpen: false, 
        text: `Abre em ${hoursUntilOpen}h`, 
        color: 'text-orange-600' 
      };
    } else {
      status = { isOpen: false, text: 'Fechado', color: 'text-red-600' };
    }
    
    setOpeningStatus(status);
  }, []);

  const handleToggleFavorite = () => {
    setIsFavorite(prev => !prev);
    // Salvar nos favoritos do localStorage
    const favorites = JSON.parse(localStorage.getItem('adra_favorite_units') || '[]');
    if (isFavorite) {
      const filtered = favorites.filter(id => id !== unit.id);
      localStorage.setItem('adra_favorite_units', JSON.stringify(filtered));
    } else {
      favorites.push(unit.id);
      localStorage.setItem('adra_favorite_units', JSON.stringify(favorites));
    }
  };

  const handleGetDirections = () => {
    if (onGetDirections) {
      onGetDirections(unit);
    } else {
      // Abrir Google Maps
      const url = `https://www.google.com/maps/dir/?api=1&destination=${unit.lat},${unit.lng}&travelmode=driving`;
      window.open(url, '_blank');
    }
  };

  const handleContact = (type, value) => {
    if (onContactUnit) {
      onContactUnit(unit, type, value);
      return;
    }

    switch (type) {
      case 'phone':
        window.open(`tel:${value}`);
        break;
      case 'whatsapp':
        const whatsappNumber = value.replace(/\D/g, '');
        window.open(`https://wa.me/55${whatsappNumber}?text=Olá! Gostaria de informações sobre doações.`);
        break;
      case 'email':
        window.open(`mailto:${value}?subject=Informações sobre doações&body=Olá! Gostaria de informações sobre como fazer doações.`);
        break;
    }
  };

  const formatDistance = (dist) => {
    if (dist < 1) {
      return `${Math.round(dist * 1000)}m`;
    }
    return `${dist.toFixed(1)}km`;
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    },
    hover: {
      y: -2,
      transition: {
        duration: 0.2,
        ease: "easeInOut"
      }
    }
  };

  const isCompact = variant === 'compact';

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      className={`
        bg-white/90 backdrop-blur-sm rounded-xl border border-gray-200/50 
        shadow-lg hover:shadow-xl transition-all duration-300
        ${isCompact ? 'p-4' : 'p-6'}
        ${className}
      `}
    >
      {/* Header com nome e tipo */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className={`font-semibold text-gray-900 ${isCompact ? 'text-base' : 'text-lg'}`}>
            {unit.nome}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <span className={`
              px-2 py-1 rounded-full text-xs font-medium
              ${unit.tipo === 'ADRA' 
                ? 'bg-blue-100 text-blue-700' 
                : 'bg-green-100 text-green-700'
              }
            `}>
              {unit.tipo}
            </span>
            {showDistance && distance && (
              <span className="text-xs text-gray-500 flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {formatDistance(distance)}
              </span>
            )}
          </div>
        </div>
        
        <button
          onClick={handleToggleFavorite}
          className={`
            p-2 rounded-full transition-colors
            ${isFavorite 
              ? 'text-yellow-500 hover:text-yellow-600' 
              : 'text-gray-400 hover:text-gray-600'
            }
          `}
          aria-label={isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
        >
          <Star className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Endereço */}
      <div className="mb-3">
        <p className={`text-gray-600 ${isCompact ? 'text-sm' : ''}`}>
          {unit.endereco.rua}, {unit.endereco.bairro}
        </p>
        <p className={`text-gray-500 ${isCompact ? 'text-xs' : 'text-sm'}`}>
          {unit.endereco.cidade} - {unit.endereco.estado}, {unit.endereco.cep}
        </p>
      </div>

      {/* Status e horário */}
      <div className={`mb-4 ${isCompact ? 'mb-3' : ''}`}>
        <div className="flex items-center gap-2 mb-1">
          <Clock className="w-4 h-4 text-gray-400" />
          {openingStatus && (
            <span className={`text-sm font-medium ${openingStatus.color}`}>
              {openingStatus.text}
            </span>
          )}
        </div>
        <p className={`text-gray-500 ${isCompact ? 'text-xs' : 'text-sm'}`}>
          {unit.horario}
        </p>
      </div>

      {/* Ações */}
      <div className="space-y-2">
        {!isCompact && (
          <div className="flex flex-wrap gap-2 mb-3">
            <button
              onClick={() => handleContact('phone', unit.contatos.tel)}
              className="flex items-center gap-1 px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
            >
              <Phone className="w-3 h-3" />
              Ligar
            </button>
            
            <button
              onClick={() => handleContact('whatsapp', unit.contatos.whatsapp)}
              className="flex items-center gap-1 px-3 py-1 text-xs bg-green-100 hover:bg-green-200 text-green-700 rounded-full transition-colors"
            >
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
              </svg>
              WhatsApp
            </button>
            
            <button
              onClick={() => handleContact('email', unit.contatos.email)}
              className="flex items-center gap-1 px-3 py-1 text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-full transition-colors"
            >
              <Mail className="w-3 h-3" />
              Email
            </button>
          </div>
        )}
        
        <div className={`flex gap-2 ${isCompact ? 'flex-col' : ''}`}>
          <Button
            variant="outline"
            size={isCompact ? "sm" : "default"}
            onClick={handleGetDirections}
            className="flex-1 flex items-center justify-center gap-2"
          >
            <ExternalLink className="w-4 h-4" />
            {isCompact ? 'Rota' : 'Como chegar'}
          </Button>
          
          {isCompact && (
            <div className="flex gap-1">
              <button
                onClick={() => handleContact('phone', unit.contatos.tel)}
                className="flex-1 flex items-center justify-center gap-1 px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                title="Ligar"
              >
                <Phone className="w-3 h-3" />
              </button>
              
              <button
                onClick={() => handleContact('whatsapp', unit.contatos.whatsapp)}
                className="flex-1 flex items-center justify-center gap-1 px-2 py-1 text-xs bg-green-100 hover:bg-green-200 text-green-700 rounded transition-colors"
                title="WhatsApp"
              >
                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                </svg>
              </button>
              
              <button
                onClick={() => handleContact('email', unit.contatos.email)}
                className="flex-1 flex items-center justify-center gap-1 px-2 py-1 text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 rounded transition-colors"
                title="Email"
              >
                <Mail className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default UnitCard;
