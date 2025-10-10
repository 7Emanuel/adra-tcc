import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../Button';

const NeedsSelector = ({ onItemsSelected, selectedItems = [] }) => {
  const [activeCategory, setActiveCategory] = useState('');
  const [localSelectedItems, setLocalSelectedItems] = useState(selectedItems);
  const [medicationDetails, setMedicationDetails] = useState({});

  // Catálogo de necessidades organizadas por categoria
  const needsCatalog = {
    'Alimentos Básicos': [
      { id: 'arroz', name: 'Arroz (5kg)', priority: 'alta', description: 'Arroz branco tipo 1' },
      { id: 'feijao', name: 'Feijão (1kg)', priority: 'alta', description: 'Feijão carioca ou preto' },
      { id: 'oleo', name: 'Óleo de cozinha (900ml)', priority: 'alta', description: 'Óleo de soja' },
      { id: 'acucar', name: 'Açúcar (1kg)', priority: 'média', description: 'Açúcar cristal' },
      { id: 'sal', name: 'Sal (1kg)', priority: 'média', description: 'Sal refinado' },
      { id: 'macarrao', name: 'Macarrão (500g)', priority: 'média', description: 'Massa alimentícia' },
      { id: 'farinha', name: 'Farinha de trigo (1kg)', priority: 'média', description: 'Farinha tipo 1' },
      { id: 'leite-po', name: 'Leite em pó', priority: 'alta', description: 'Leite integral em lata' }
    ],
    'Higiene Pessoal': [
      { id: 'sabonete', name: 'Sabonete', priority: 'alta', description: 'Sabonete em barra' },
      { id: 'pasta-dente', name: 'Pasta de dente', priority: 'alta', description: 'Creme dental' },
      { id: 'shampoo', name: 'Shampoo', priority: 'média', description: 'Shampoo 400ml' },
      { id: 'papel-higienico', name: 'Papel higiênico', priority: 'alta', description: 'Pacote com 4 rolos' },
      { id: 'absorvente', name: 'Absorvente íntimo', priority: 'alta', description: 'Absorvente feminino' },
      { id: 'fralda', name: 'Fraldas descartáveis', priority: 'alta', description: 'Especificar tamanho' }
    ],
    'Roupas e Calçados': [
      { id: 'roupa-adulto', name: 'Roupas para adulto', priority: 'alta', description: 'Especificar tamanho e tipo' },
      { id: 'roupa-crianca', name: 'Roupas infantis', priority: 'alta', description: 'Especificar idade e tamanho' },
      { id: 'calcado-adulto', name: 'Calçados adulto', priority: 'média', description: 'Especificar numeração' },
      { id: 'calcado-crianca', name: 'Calçados infantil', priority: 'média', description: 'Especificar numeração' },
      { id: 'cobertor', name: 'Cobertores', priority: 'alta', description: 'Cobertores ou edredons' }
    ],
    'Material de Limpeza': [
      { id: 'detergente', name: 'Detergente', priority: 'média', description: 'Detergente neutro' },
      { id: 'sabao-po', name: 'Sabão em pó', priority: 'média', description: 'Sabão para roupas' },
      { id: 'desinfetante', name: 'Desinfetante', priority: 'média', description: 'Desinfetante multiuso' },
      { id: 'sabao-barra', name: 'Sabão em barra', priority: 'média', description: 'Sabão de coco' }
    ],
    'Material Escolar': [
      { id: 'caderno', name: 'Cadernos', priority: 'alta', description: 'Cadernos universitários' },
      { id: 'lapis', name: 'Lápis e canetas', priority: 'alta', description: 'Material de escrita' },
      { id: 'mochila', name: 'Mochila escolar', priority: 'média', description: 'Mochila em bom estado' },
      { id: 'livros', name: 'Livros didáticos', priority: 'média', description: 'Livros escolares' }
    ],
    'Medicamentos': [
      { id: 'remedios-basicos', name: 'Medicamentos básicos', priority: 'alta', description: 'Analgésicos, antitérmicos' },
      { id: 'remedios-cronicos', name: 'Medicamentos para uso contínuo', priority: 'alta', description: 'Especificar tipo' }
    ]
  };

  const categories = Object.keys(needsCatalog);

  const handleItemToggle = (item) => {
    const isSelected = localSelectedItems.find(selected => selected.id === item.id);
    if (isSelected) {
      setLocalSelectedItems(prev => prev.filter(selected => selected.id !== item.id));
      // Limpar detalhes do medicamento se for removido
      if (item.id === 'remedios-cronicos') {
        setMedicationDetails(prev => {
          const newDetails = { ...prev };
          delete newDetails[item.id];
          return newDetails;
        });
      }
    } else {
      setLocalSelectedItems(prev => [...prev, { ...item, quantity: 1 }]);
    }
  };

  const handleQuantityChange = (itemId, quantity) => {
    setLocalSelectedItems(prev => 
      prev.map(item => 
        item.id === itemId ? { ...item, quantity: Math.max(1, parseInt(quantity) || 1) } : item
      )
    );
  };

  const handleMedicationDetailChange = (itemId, details) => {
    setMedicationDetails(prev => ({
      ...prev,
      [itemId]: details
    }));
  };

  const handleConfirmSelection = () => {
    // Verificar se medicamentos de uso contínuo foram especificados
    const hasContinuousMeds = localSelectedItems.find(item => item.id === 'remedios-cronicos');
    if (hasContinuousMeds && !medicationDetails['remedios-cronicos']?.trim()) {
      alert('Por favor, especifique qual medicamento de uso contínuo você precisa.');
      return;
    }

    // Adicionar detalhes dos medicamentos aos itens selecionados
    const itemsWithDetails = localSelectedItems.map(item => {
      if (item.id === 'remedios-cronicos' && medicationDetails[item.id]) {
        return {
          ...item,
          medicationDetails: medicationDetails[item.id]
        };
      }
      return item;
    });
    onItemsSelected(itemsWithDetails);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'alta': return 'bg-red-100 text-red-800 border-red-200';
      case 'média': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'alta': return '🔴';
      case 'média': return '🟡';
      default: return '⚪';
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Selecione suas necessidades
        </h2>
        <p className="text-lg text-gray-600 mb-6">
          Escolha os itens que você mais precisa. Isso nos ajudará a priorizar e organizar as doações.
        </p>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-center gap-4 text-sm">
            <span className="flex items-center gap-1">
              🔴 <span className="font-medium">Alta prioridade</span>
            </span>
            <span className="flex items-center gap-1">
              🟡 <span className="font-medium">Prioridade média</span>
            </span>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setActiveCategory(activeCategory === category ? '' : category)}
            className={`
              p-3 rounded-lg border text-sm font-medium transition-all
              ${activeCategory === category 
                ? 'border-green-500 bg-green-50 text-green-700' 
                : 'border-gray-200 hover:border-gray-300 text-gray-700'
              }
            `}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Items Grid */}
      <AnimatePresence>
        {activeCategory && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-8"
          >
            <h3 className="text-xl font-semibold mb-4 text-gray-800">
              {activeCategory}
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {needsCatalog[activeCategory].map(item => {
                const isSelected = localSelectedItems.find(selected => selected.id === item.id);
                return (
                  <div
                    key={item.id}
                    className={`
                      border rounded-lg p-4 cursor-pointer transition-all relative
                      ${isSelected 
                        ? 'border-green-500 bg-green-50 shadow-md' 
                        : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                      }
                    `}
                    onClick={() => handleItemToggle(item)}
                  >
                    {/* Priority Badge */}
                    <div className={`
                      absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium border
                      ${getPriorityColor(item.priority)}
                    `}>
                      {getPriorityIcon(item.priority)} {item.priority}
                    </div>
                    
                    {/* Checkbox */}
                    <div className={`
                      w-5 h-5 rounded border-2 flex items-center justify-center mb-3
                      ${isSelected ? 'border-green-500 bg-green-500' : 'border-gray-300'}
                    `}>
                      {isSelected && (
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    
                    <h4 className="font-semibold text-gray-900 mb-2">{item.name}</h4>
                    <p className="text-sm text-gray-600 mb-3">{item.description}</p>
                    
                    {isSelected && (
                      <div className="mt-3 space-y-3">
                        <div className="flex items-center gap-2">
                          <label className="text-sm font-medium text-gray-700">
                            Quantidade:
                          </label>
                          <input
                            type="number"
                            min="1"
                            max="10"
                            value={isSelected.quantity}
                            onChange={(e) => {
                              e.stopPropagation();
                              handleQuantityChange(item.id, e.target.value);
                            }}
                            onClick={(e) => e.stopPropagation()}
                            className="w-16 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-green-600"
                          />
                        </div>
                        
                        {/* Campo específico para medicamentos de uso contínuo */}
                        {item.id === 'remedios-cronicos' && (
                          <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium text-gray-700">
                              Especificar medicamento(s):
                            </label>
                            <textarea
                              placeholder="Digite o nome do medicamento, dosagem e frequência (ex: Losartana 50mg, 1x ao dia)"
                              value={medicationDetails[item.id] || ''}
                              onChange={(e) => {
                                e.stopPropagation();
                                handleMedicationDetailChange(item.id, e.target.value);
                              }}
                              onClick={(e) => e.stopPropagation()}
                              rows="3"
                              className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-green-600 resize-none"
                            />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Selected Items Summary */}
      {localSelectedItems.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm mb-6"
        >
          <h3 className="text-lg font-semibold mb-4 text-gray-800">
            Itens selecionados ({localSelectedItems.length})
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            {localSelectedItems.map(item => (
              <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{item.name}</h4>
                  <p className="text-sm text-gray-600">Quantidade: {item.quantity}</p>
                  {item.id === 'remedios-cronicos' && medicationDetails[item.id] && (
                    <div className="mt-1 p-2 bg-blue-50 rounded border-l-4 border-blue-400">
                      <p className="text-xs font-medium text-blue-800">Medicamento especificado:</p>
                      <p className="text-sm text-blue-700">{medicationDetails[item.id]}</p>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => handleItemToggle(item)}
                  className="text-red-600 hover:text-red-800 p-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button
          variant="secondary"
          size="lg"
          onClick={() => setLocalSelectedItems([])}
          disabled={localSelectedItems.length === 0}
        >
          Limpar Seleção
        </Button>
        
        <Button
          variant="primary"
          size="lg"
          onClick={handleConfirmSelection}
          disabled={localSelectedItems.length === 0}
          className="px-8"
        >
          Continuar com {localSelectedItems.length} {localSelectedItems.length === 1 ? 'item' : 'itens'}
        </Button>
      </div>

      {/* Help Text */}
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          💡 <strong>Dica:</strong> Você pode selecionar quantos itens precisar. Após confirmar, 
          faremos um processo de validação para garantir que as doações cheguem até você.
        </p>
      </div>
    </div>
  );
};

export default NeedsSelector;