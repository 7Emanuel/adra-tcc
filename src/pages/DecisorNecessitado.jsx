import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthService } from '../services/AuthService';
import Button from '../components/Button';
import Footer from '../components/Footer';
import NeedsSelector from '../components/necessitado/NeedsSelector';
import { motion, AnimatePresence } from 'framer-motion';
 

const DecisorNecessitado = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState('selection'); // selection, auth, complete
  const [selectedItems, setSelectedItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);

  const handleItemsSelected = (items) => {
    setSelectedItems(items);
    // Salvar no localStorage para não perder os dados
    localStorage.setItem('necessitado_items_selecionados', JSON.stringify(items));
    setShowAuthPrompt(true);
  };

  const handleProceedToAuth = async () => {
    setIsLoading(true);
    
    try {
      // Sempre exigir login novamente, mesmo se já estiver logado
      // Isso força o usuário a fazer login a cada nova seleção de necessidade
      console.log('🔄 Sempre redirecionando para login para revalidar status');
      
      // Limpar sessão atual para forçar novo login
      AuthService.logout();
      
      // Redirecionar para login/cadastro
      navigate('/login-cadastro');
    } catch (error) {
      console.error('Erro ao processar:', error);
      navigate('/login-cadastro');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      
      <main className="pt-20 pb-16">
        <div className="container mx-auto px-4">
          
          {/* Hero Section */}
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                Vamos te ajudar!
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                Selecione os itens que você mais precisa e reservaremos para você. 
                É simples, rápido e gratuito.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">📋</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">1. Selecione</h3>
                  <p className="text-sm text-gray-600">Escolha os itens que você precisa da nossa lista</p>
                </div>
                
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">✅</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">2. Reserve</h3>
                  <p className="text-sm text-gray-600">Seus itens ficam reservados enquanto fazemos a validação</p>
                </div>
                
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🎁</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">3. Receba</h3>
                  <p className="text-sm text-gray-600">Após validação, organizamos a entrega ou retirada</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Needs Selector */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <NeedsSelector 
              onItemsSelected={handleItemsSelected}
              selectedItems={selectedItems}
            />
          </motion.div>

          {/* Authentication Prompt Modal */}
          <AnimatePresence>
            {showAuthPrompt && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                onClick={() => setShowAuthPrompt(false)}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  className="bg-white rounded-xl p-8 max-w-md w-full shadow-2xl"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      Itens Reservados!
                    </h3>
                    <p className="text-gray-600">
                      Reservamos <strong>{selectedItems.length} {selectedItems.length === 1 ? 'item' : 'itens'}</strong> para você.
                    </p>
                  </div>
                  
                  {/* Selected Items Preview */}
                  <div className="bg-gray-50 rounded-lg p-4 mb-6 max-h-40 overflow-y-auto">
                    <h4 className="font-medium text-gray-900 mb-2">Seus itens:</h4>
                    <div className="space-y-1">
                      {selectedItems.map(item => (
                        <div key={item.id} className="flex justify-between text-sm">
                          <span className="text-gray-700">{item.name}</span>
                          <span className="text-gray-500">x{item.quantity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <p className="text-sm text-blue-800">
                      <strong>Próximo passo:</strong> Precisamos validar sua identidade para garantir que as doações cheguem até você de forma segura.
                    </p>
                  </div>
                  
                  <div className="flex flex-col gap-3">
                    <Button
                      variant="primary"
                      size="lg"
                      onClick={handleProceedToAuth}
                      disabled={isLoading}
                      className="w-full"
                    >
                      {isLoading ? (
                        <div className="flex items-center justify-center">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                          Redirecionando...
                        </div>
                      ) : (
                        'Fazer Login/Cadastro'
                      )}
                    </Button>
                    
                    <Button
                      variant="secondary"
                      size="lg"
                      onClick={() => setShowAuthPrompt(false)}
                      className="w-full"
                    >
                      Selecionar mais itens
                    </Button>
                  </div>
                  
                  <p className="text-xs text-gray-500 text-center mt-4">
                    Seus itens ficam reservados por 24 horas
                  </p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </main>

      <Footer />
    </div>
  )
};

export default DecisorNecessitado;
