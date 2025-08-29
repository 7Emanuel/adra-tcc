import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Copy, 
  Check, 
  QrCode, 
  CreditCard, 
  Building,
  DollarSign,
  Shield,
  Clock
} from 'lucide-react';
import Button from '../Button';
import { DonationsService } from '../../services/DonationsService';

const TransferPixPanel = ({ onBack }) => {
  const [selectedMethod, setSelectedMethod] = useState('pix');
  const [amount, setAmount] = useState('');
  const [customAmount, setCustomAmount] = useState('');
  const [copiedField, setCopiedField] = useState(null);
  const [showQR, setShowQR] = useState(false);

  const bankData = DonationsService.getBankData();
  const pixData = DonationsService.getPixData();
  const suggestedAmounts = DonationsService.getSuggestedAmounts();

  const handleCopy = async (text, field) => {
    try {
      await DonationsService.copyToClipboard(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (error) {
      console.error('Erro ao copiar:', error);
    }
  };

  const handleAmountSelect = (value) => {
    setAmount(value);
    setCustomAmount('');
  };

  const handleCustomAmountChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    setCustomAmount(value);
    setAmount('custom');
  };

  const getFinalAmount = () => {
    if (amount === 'custom') {
      return parseFloat(customAmount) || 0;
    }
    return parseFloat(amount) || 0;
  };

  const formatCurrency = (value) => {
    return DonationsService.formatCurrency(value);
  };

  const CopyableField = ({ label, value, field, icon: Icon }) => (
    <div className="bg-gray-50 rounded-lg p-4">
      <div className="flex items-center gap-2 mb-2">
        {Icon && <Icon className="w-4 h-4 text-gray-600" />}
        <label className="text-sm font-medium text-gray-700">{label}</label>
      </div>
      <div className="flex items-center gap-2">
        <code className="flex-1 bg-white px-3 py-2 rounded border text-sm font-mono">
          {value}
        </code>
        <button
          onClick={() => handleCopy(value, field)}
          className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors flex items-center gap-1"
        >
          {copiedField === field ? (
            <>
              <Check className="w-4 h-4" />
              <span className="text-sm">Copiado!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              <span className="text-sm">Copiar</span>
            </>
          )}
        </button>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header com botão voltar */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center gap-4 mb-8"
      >
        <Button
          variant="outline"
          size="sm"
          onClick={onBack}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </Button>
        <h2 className="text-2xl font-bold text-gray-900">Doação Financeira</h2>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Seleção de método */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-1"
        >
          <h3 className="text-lg font-semibold mb-4">Escolha o método</h3>
          
          <div className="space-y-3">
            <button
              onClick={() => setSelectedMethod('pix')}
              className={`
                w-full p-4 rounded-lg border-2 transition-all text-left
                ${selectedMethod === 'pix' 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-gray-300'
                }
              `}
            >
              <div className="flex items-center gap-3">
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center
                  ${selectedMethod === 'pix' ? 'bg-blue-100' : 'bg-gray-100'}
                `}>
                  <QrCode className={`w-5 h-5 ${selectedMethod === 'pix' ? 'text-blue-600' : 'text-gray-600'}`} />
                </div>
                <div>
                  <h4 className="font-medium">PIX</h4>
                  <p className="text-sm text-gray-600">Transferência instantânea</p>
                </div>
              </div>
            </button>

            <button
              onClick={() => setSelectedMethod('bank')}
              className={`
                w-full p-4 rounded-lg border-2 transition-all text-left
                ${selectedMethod === 'bank' 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-gray-300'
                }
              `}
            >
              <div className="flex items-center gap-3">
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center
                  ${selectedMethod === 'bank' ? 'bg-blue-100' : 'bg-gray-100'}
                `}>
                  <Building className={`w-5 h-5 ${selectedMethod === 'bank' ? 'text-blue-600' : 'text-gray-600'}`} />
                </div>
                <div>
                  <h4 className="font-medium">Transferência</h4>
                  <p className="text-sm text-gray-600">DOC/TED bancário</p>
                </div>
              </div>
            </button>
          </div>

          {/* Valor da doação */}
          <div className="mt-6">
            <h4 className="font-medium mb-3">Valor da doação</h4>
            
            <div className="grid grid-cols-2 gap-2 mb-3">
              {suggestedAmounts.map(value => (
                <button
                  key={value}
                  onClick={() => handleAmountSelect(value)}
                  className={`
                    p-2 rounded border text-sm font-medium transition-all
                    ${amount === value 
                      ? 'border-blue-500 bg-blue-50 text-blue-700' 
                      : 'border-gray-200 hover:border-gray-300'
                    }
                  `}
                >
                  {formatCurrency(value)}
                </button>
              ))}
            </div>

            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Outro valor"
                value={customAmount}
                onChange={handleCustomAmountChange}
                className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </motion.div>

        {/* Dados para transferência */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2"
        >
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            
            {selectedMethod === 'pix' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold">Dados PIX</h3>
                  <div className="flex items-center gap-2 text-green-600">
                    <Shield className="w-4 h-4" />
                    <span className="text-sm font-medium">Seguro</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <CopyableField
                    label="Chave PIX (E-mail)"
                    value={pixData.key}
                    field="pix-key"
                    icon={QrCode}
                  />

                  <CopyableField
                    label="Código PIX (Cole no seu app)"
                    value={pixData.payload}
                    field="pix-payload"
                    icon={Copy}
                  />
                </div>

                {getFinalAmount() > 0 && (
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <div className="text-center">
                      <p className="text-sm text-blue-600 mb-1">Valor da doação</p>
                      <p className="text-2xl font-bold text-blue-900">
                        {formatCurrency(getFinalAmount())}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {selectedMethod === 'bank' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold">Dados Bancários</h3>
                  <div className="flex items-center gap-2 text-blue-600">
                    <Building className="w-4 h-4" />
                    <span className="text-sm font-medium">Banco do Brasil</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <CopyableField
                    label="Banco"
                    value={bankData.bankName}
                    field="bank-name"
                    icon={Building}
                  />

                  <div className="grid md:grid-cols-2 gap-4">
                    <CopyableField
                      label="Agência"
                      value={bankData.agency}
                      field="agency"
                    />
                    <CopyableField
                      label="Conta"
                      value={bankData.account}
                      field="account"
                    />
                  </div>

                  <CopyableField
                    label="Favorecido"
                    value={bankData.owner}
                    field="owner"
                  />

                  <CopyableField
                    label="CNPJ"
                    value={bankData.cnpj}
                    field="cnpj"
                  />
                </div>
              </div>
            )}

            {/* Instruções */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-gray-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">Instruções importantes</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Após a transferência, guarde o comprovante</li>
                    <li>• Em caso de dúvidas, entre em contato conosco</li>
                    <li>• Sua doação é 100% destinada aos projetos sociais</li>
                    {selectedMethod === 'pix' && (
                      <li>• A confirmação é automática e instantânea</li>
                    )}
                    {selectedMethod === 'bank' && (
                      <li>• A confirmação pode levar até 2 dias úteis</li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Botão de confirmação */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-8 text-center"
      >
        <Button
          size="lg"
          className="px-8"
          disabled={getFinalAmount() === 0}
        >
          {getFinalAmount() > 0 
            ? `Confirmar doação de ${formatCurrency(getFinalAmount())}`
            : 'Selecione um valor para continuar'
          }
        </Button>
        
        <p className="text-sm text-gray-500 mt-3">
          Ao confirmar, você concorda com nossos termos de doação
        </p>
      </motion.div>
    </div>
  );
};

export default TransferPixPanel;
