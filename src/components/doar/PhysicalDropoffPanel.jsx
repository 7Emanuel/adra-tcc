import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  MapPin, 
  Package, 
  Plus,
  Minus,
  Info,
  Navigation,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import Button from '../Button';
import UnitCard from './UnitCard';
import { UnitsService } from '../../services/UnitsService';
import { ItemsService } from '../../services/ItemsService';

const PhysicalDropoffPanel = ({ 
  onBack, 
  userLocation, 
  nearbyUnits, 
  onLocationRequest 
}) => {
  const [currentStep, setCurrentStep] = useState('items'); // items, units, confirm
  const [donationItems, setDonationItems] = useState([]);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [newItem, setNewItem] = useState({ name: '', quantity: 1, description: '' });
  const [showAcceptableItems, setShowAcceptableItems] = useState(false);

  const acceptableItems = ItemsService.getAcceptableItems();
  const nonAcceptableItems = ItemsService.getNonAcceptableItems();
  const donationTips = ItemsService.getDonationTips();

  useEffect(() => {
    if (nearbyUnits.length > 0 && !selectedUnit) {
      setSelectedUnit(nearbyUnits[0]);
    }
  }, [nearbyUnits, selectedUnit]);

  const handleAddItem = () => {
    if (newItem.name.trim()) {
      setDonationItems([...donationItems, { 
        ...newItem, 
        id: Date.now(),
        acceptable: ItemsService.isItemAcceptable(newItem.name)
      }]);
      setNewItem({ name: '', quantity: 1, description: '' });
    }
  };

  const handleRemoveItem = (id) => {
    setDonationItems(donationItems.filter(item => item.id !== id));
  };

  const handleUpdateQuantity = (id, quantity) => {
    if (quantity > 0) {
      setDonationItems(donationItems.map(item => 
        item.id === id ? { ...item, quantity } : item
      ));
    }
  };

  const handleNextStep = () => {
    if (currentStep === 'items' && donationItems.length > 0) {
      setCurrentStep('units');
    } else if (currentStep === 'units' && selectedUnit) {
      setCurrentStep('confirm');
    }
  };

  const handlePrevStep = () => {
    if (currentStep === 'units') {
      setCurrentStep('items');
    } else if (currentStep === 'confirm') {
      setCurrentStep('units');
    } else {
      onBack();
    }
  };

  const validation = ItemsService.validateDonationList(donationItems);

  const renderItemsList = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Adicionar novo item */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">Adicionar itens para doação</h3>
        
        <div className="grid gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Item
            </label>
            <input
              type="text"
              value={newItem.name}
              onChange={(e) => setNewItem({...newItem, name: e.target.value})}
              placeholder="Ex: Roupas, alimentos, livros..."
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantidade
              </label>
              <input
                type="number"
                min="1"
                value={newItem.quantity}
                onChange={(e) => setNewItem({...newItem, quantity: parseInt(e.target.value) || 1})}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descrição (opcional)
              </label>
              <input
                type="text"
                value={newItem.description}
                onChange={(e) => setNewItem({...newItem, description: e.target.value})}
                placeholder="Ex: tamanho, estado..."
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <Button
            onClick={handleAddItem}
            disabled={!newItem.name.trim()}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Adicionar item
          </Button>
        </div>
      </div>

      {/* Lista de itens adicionados */}
      {donationItems.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">
            Itens para doação ({donationItems.length})
          </h3>
          
          <div className="space-y-3">
            {donationItems.map(item => (
              <div key={item.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{item.name}</span>
                    {item.acceptable?.acceptable === false && (
                      <AlertTriangle className="w-4 h-4 text-amber-500" title="Item pode não ser aceito" />
                    )}
                    {item.acceptable?.acceptable === true && (
                      <CheckCircle className="w-4 h-4 text-green-500" title="Item aceito" />
                    )}
                  </div>
                  {item.description && (
                    <span className="text-sm text-gray-600">{item.description}</span>
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                    className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center disabled:opacity-50"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="w-8 text-center font-medium">{item.quantity}</span>
                  <button
                    onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                    className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
                
                <button
                  onClick={() => handleRemoveItem(item.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          {validation.warnings.length > 0 && (
            <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <h4 className="font-medium text-amber-800 mb-1">Atenção:</h4>
              <ul className="text-sm text-amber-700 space-y-1">
                {validation.warnings.map((warning, index) => (
                  <li key={index}>• {warning}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Itens aceitos */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <button
          onClick={() => setShowAcceptableItems(!showAcceptableItems)}
          className="flex items-center justify-between w-full text-left"
        >
          <h3 className="text-lg font-semibold">Itens aceitos</h3>
          <Info className="w-5 h-5 text-gray-400" />
        </button>
        
        {showAcceptableItems && (
          <div className="mt-4 space-y-4">
            <div>
              <h4 className="font-medium text-green-700 mb-2">✅ Itens aceitos:</h4>
              <div className="grid md:grid-cols-2 gap-2">
                {acceptableItems.map((item, index) => (
                  <div key={index} className="text-sm text-gray-600 bg-green-50 px-2 py-1 rounded">
                    {item}
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-red-700 mb-2">❌ Itens NÃO aceitos:</h4>
              <div className="grid md:grid-cols-2 gap-2">
                {nonAcceptableItems.map((item, index) => (
                  <div key={index} className="text-sm text-gray-600 bg-red-50 px-2 py-1 rounded">
                    {item}
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-blue-700 mb-2">💡 Dicas importantes:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                {donationTips.map((tip, index) => (
                  <li key={index} className="bg-blue-50 px-2 py-1 rounded">• {tip}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );

  const renderUnitsSelection = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">Escolha uma unidade para entrega</h3>
        <p className="text-gray-600">
          {userLocation ? 
            'Unidades próximas à sua localização:' :
            'Principais unidades ADRA/ASA:'
          }
        </p>
      </div>

      {!userLocation && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-blue-800 mb-2">
            <MapPin className="w-4 h-4" />
            <span className="font-medium">Quer ver unidades próximas?</span>
          </div>
          <p className="text-sm text-blue-700 mb-3">
            Permita o acesso à localização para mostrarmos as unidades mais próximas de você.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={onLocationRequest}
            className="text-blue-700 border-blue-300"
          >
            <Navigation className="w-4 h-4 mr-2" />
            Ativar localização
          </Button>
        </div>
      )}

      <div className="grid gap-4">
        {(nearbyUnits.length > 0 ? nearbyUnits : UnitsService.getAllUnits()).map(unit => (
          <div key={unit.id} className="relative">
            <UnitCard
              unit={unit}
              distance={unit.distance}
              userLocation={userLocation}
              variant="default"
              className={`cursor-pointer transition-all ${
                selectedUnit?.id === unit.id 
                  ? 'ring-2 ring-blue-500 bg-blue-50/50' 
                  : 'hover:shadow-lg'
              }`}
              onClick={() => setSelectedUnit(unit)}
            />
            {selectedUnit?.id === unit.id && (
              <div className="absolute top-3 right-3">
                <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );

  const renderConfirmation = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">Confirme sua doação</h3>
        <p className="text-gray-600">
          Revise os detalhes antes de finalizar
        </p>
      </div>

      {/* Resumo dos itens */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h4 className="font-semibold mb-4">Itens para doação</h4>
        <div className="space-y-2">
          {donationItems.map(item => (
            <div key={item.id} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
              <span>{item.quantity}x {item.name}</span>
              {item.description && <span className="text-sm text-gray-500">({item.description})</span>}
            </div>
          ))}
        </div>
      </div>

      {/* Unidade selecionada */}
      {selectedUnit && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h4 className="font-semibold mb-4">Local de entrega</h4>
          <UnitCard
            unit={selectedUnit}
            distance={selectedUnit.distance}
            userLocation={userLocation}
            variant="compact"
            showDistance={true}
          />
        </div>
      )}

      {/* Instruções finais */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h4 className="font-medium text-green-800 mb-2">Próximos passos:</h4>
        <ul className="text-sm text-green-700 space-y-1">
          <li>• Entre em contato com a unidade para agendar a entrega</li>
          <li>• Organize os itens em sacolas ou caixas</li>
          <li>• Leve um documento com foto</li>
          <li>• Horário de funcionamento: Segunda a Sexta, 8h às 17h</li>
        </ul>
      </div>
    </motion.div>
  );

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center gap-4 mb-8"
      >
        <Button
          variant="outline"
          size="sm"
          onClick={handlePrevStep}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </Button>
        <h2 className="text-2xl font-bold text-gray-900">Doação de Itens</h2>
      </motion.div>

      {/* Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-center space-x-4">
          {['items', 'units', 'confirm'].map((step, index) => (
            <React.Fragment key={step}>
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                ${currentStep === step || ['items', 'units', 'confirm'].indexOf(currentStep) > index
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-400'
                }
              `}>
                {index + 1}
              </div>
              {index < 2 && (
                <div className={`
                  h-1 w-16 rounded-full
                  ${['items', 'units', 'confirm'].indexOf(currentStep) > index ? 'bg-blue-400' : 'bg-gray-200'}
                `} />
              )}
            </React.Fragment>
          ))}
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-2 px-4">
          <span>Itens</span>
          <span>Local</span>
          <span>Confirmar</span>
        </div>
      </div>

      {/* Content */}
      {currentStep === 'items' && renderItemsList()}
      {currentStep === 'units' && renderUnitsSelection()}
      {currentStep === 'confirm' && renderConfirmation()}

      {/* Navigation */}
      <div className="mt-8 flex justify-between">
        <div></div>
        <Button
          onClick={handleNextStep}
          disabled={
            (currentStep === 'items' && donationItems.length === 0) ||
            (currentStep === 'units' && !selectedUnit)
          }
          size="lg"
        >
          {currentStep === 'confirm' ? 'Finalizar doação' : 'Continuar'}
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default PhysicalDropoffPanel;
