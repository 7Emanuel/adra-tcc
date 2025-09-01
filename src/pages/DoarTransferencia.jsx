import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Button from '../components/Button';

export default function DoarTransferencia() {
  const [comprovanteAnexado, setComprovanteAnexado] = useState(false);
  const [mostrarRecibo, setMostrarRecibo] = useState(false);

  const handleAnexarComprovante = (event) => {
    const file = event.target.files[0];
    if (file) {
      setComprovanteAnexado(true);
    }
  };

  const handleConcluir = () => {
    setMostrarRecibo(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header da Página */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Doação por Transferência
            </h1>
            <p className="text-xl text-gray-600">
              Faça sua doação de forma rápida e segura
            </p>
          </div>

          {!mostrarRecibo ? (
            <div className="space-y-8">
              {/* Passo a Passo */}
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Como doar</h2>
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                      1
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Escolha o valor</h3>
                      <p className="text-gray-600">Defina o valor que deseja doar usando os dados bancários ou PIX abaixo.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                      2
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Faça a transferência</h3>
                      <p className="text-gray-600">Use sua carteira digital ou internet banking para transferir o valor.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                      3
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Envie o comprovante</h3>
                      <p className="text-gray-600">Anexe seu comprovante para recebermos a confirmação da doação.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dados Bancários */}
              <div className="grid md:grid-cols-2 gap-8">
                {/* PIX */}
                <div className="bg-white rounded-xl shadow-lg p-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">PIX - Mais Rápido</h3>
                  
                  <div className="space-y-4 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Chave PIX (CNPJ)
                      </label>
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 font-mono text-center">
                        12.345.678/0001-90
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Favorecido
                      </label>
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-center">
                        Agência de Desenvolvimento e Recursos Assistenciais - ADRA
                      </div>
                    </div>
                  </div>

                  {/* QR Code Placeholder */}
                  <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <div className="w-32 h-32 bg-white border border-gray-200 rounded-lg mx-auto mb-4 flex items-center justify-center">
                      <svg className="w-16 h-16 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M3 3h8v8H3V3zm2 2v4h4V5H5zm8-2h8v8h-8V3zm2 2v4h4V5h-4zM3 13h8v8H3v-8zm2 2v4h4v-4H5zm10 0h2v2h-2v-2zm0 4h2v2h-2v-2zm4-4h2v2h-2v-2zm0 4h2v2h-2v-2zm-6-10h2v2h-2V9zm4 0h2v2h-2V9z"/>
                      </svg>
                    </div>
                    <p className="text-sm text-gray-500">QR Code PIX</p>
                    <p className="text-xs text-gray-400 mt-1">Escaneie com seu app bancário</p>
                  </div>
                </div>

                {/* Transferência Bancária */}
                <div className="bg-white rounded-xl shadow-lg p-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Transferência Bancária</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Banco</label>
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        Banco do Brasil (001)
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Agência</label>
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        1234-5
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Conta</label>
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        12345-6
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Favorecido</label>
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm">
                        Agência de Desenvolvimento e Recursos Assistenciais - ADRA
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">CNPJ</label>
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        12.345.678/0001-90
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Comprovante */}
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Enviar Comprovante</h3>
                
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <input
                    type="file"
                    id="comprovante"
                    accept="image/*,.pdf"
                    onChange={handleAnexarComprovante}
                    className="hidden"
                  />
                  <label htmlFor="comprovante" className="cursor-pointer">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </div>
                    <p className="text-lg font-medium text-gray-900 mb-2">
                      {comprovanteAnexado ? 'Comprovante anexado!' : 'Clique para anexar o comprovante'}
                    </p>
                    <p className="text-gray-600">
                      Formatos aceitos: JPG, PNG, PDF (máx. 5MB)
                    </p>
                  </label>
                </div>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Alternativa:</strong> Envie seu comprovante por e-mail para{' '}
                    <a href="mailto:doacoes@adra.org.br" className="underline">
                      doacoes@adra.org.br
                    </a>
                  </p>
                </div>
              </div>

              {/* Botões */}
              <div className="flex flex-col sm:flex-row gap-4 justify-between">
                <Link to="/doar">
                  <Button variant="secondary" size="lg">
                    ← Voltar
                  </Button>
                </Link>
                <Button 
                  variant="primary" 
                  size="lg" 
                  onClick={handleConcluir}
                  disabled={!comprovanteAnexado}
                >
                  Concluir Doação
                </Button>
              </div>
            </div>
          ) : (
            /* Tela de Recibo/Agradecimento */
            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Obrigado pela sua doação!
              </h2>
              
              <p className="text-xl text-gray-600 mb-8">
                Recebemos seu comprovante e em breve sua doação será processada.
              </p>
              
              <div className="bg-gray-50 rounded-lg p-6 mb-8">
                <h3 className="font-semibold text-gray-900 mb-4">Próximos passos:</h3>
                <ul className="text-left space-y-2 text-gray-600">
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Confirmação por e-mail em até 24 horas
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Recibo fiscal enviado em até 5 dias úteis
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Relatório de impacto trimestral
                  </li>
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/doar">
                  <Button variant="secondary" size="lg">
                    Fazer outra doação
                  </Button>
                </Link>
                <Link to="/">
                  <Button variant="primary" size="lg">
                    Voltar ao início
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
