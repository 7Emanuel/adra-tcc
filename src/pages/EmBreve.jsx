import React from 'react';
import Button from '../components/Button';

const EmBreve = ({ type = 'geral' }) => {
  const getContent = () => {
    switch (type) {
      case 'doar':
        return {
          title: 'Doações - Em Breve',
          description: 'Estamos preparando uma experiência completa para facilitar suas doações. Em breve você poderá criar sua conta, escolher o tipo de doação e acompanhar o impacto de sua ajuda.',
          features: [
            'Sistema de cadastro seguro',
            'Múltiplas formas de doação',
            'Acompanhamento em tempo real',
            'Relatórios de impacto'
          ]
        };
      case 'ajuda':
        return {
          title: 'Solicitar Ajuda - Em Breve',
          description: 'Nossa plataforma de assistência está sendo desenvolvida para conectar você com os recursos que precisa. Em breve teremos um sistema completo de solicitação e acompanhamento.',
          features: [
            'Cadastro assistido',
            'Avaliação de necessidades',
            'Acompanhamento familiar',
            'Mapa de recursos locais'
          ]
        };
      default:
        return {
          title: 'Em Desenvolvimento',
          description: 'Esta funcionalidade está sendo desenvolvida e estará disponível em breve.',
          features: []
        };
    }
  };

  const content = getContent();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-2xl mx-auto text-center">
        {/* Icon */}
        <div className="mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-4xl font-bold text-gray-900 mb-6">
          {content.title}
        </h1>

        {/* Description */}
        <p className="text-lg text-gray-600 mb-8 leading-relaxed">
          {content.description}
        </p>

        {/* Features */}
        {content.features.length > 0 && (
          <div className="bg-white rounded-2xl p-6 shadow-lg mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Funcionalidades que estão chegando:
            </h2>
            <ul className="space-y-2 text-left">
              {content.features.map((feature, index) => (
                <li key={index} className="flex items-center text-gray-600">
                  <svg className="w-5 h-5 text-green-600 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Action */}
        <Button
          variant="primary"
          size="lg"
          onClick={() => window.history.back()}
          className="mx-auto"
        >
          Voltar à Página Inicial
        </Button>
      </div>
    </div>
  );
};

export default EmBreve;
