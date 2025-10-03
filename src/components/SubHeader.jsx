import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from './Button';

// SubHeader simples para páginas internas: mostra Voltar, logo e atalhos úteis
const SubHeader = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    // Tenta voltar; se não houver histórico suficiente, vai para Home
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  return (
    <header className="bg-white/95 backdrop-blur border-b border-gray-200 sticky top-0 z-30">
      <nav className="container mx-auto px-4 py-3 flex items-center justify-between" aria-label="Navegação secundária">
        {/* Voltar */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleBack}
            className="inline-flex items-center gap-2 text-gray-700 hover:text-green-700 px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-green-600"
            aria-label="Voltar"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="hidden sm:inline">Voltar</span>
          </button>
        </div>

        {/* Logo centro (click para Home) */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-green-600 rounded px-2 py-1"
          aria-label="Ir para a página inicial"
        >
          <div className="w-7 h-7 bg-green-600 rounded-md flex items-center justify-center">
            <span className="text-white font-bold text-sm">A</span>
          </div>
          <span className="text-lg font-bold text-gray-900">ADRA</span>
        </button>

        {/* Ações rápidas */}
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={() => navigate('/doar')}>
            Doar
          </Button>
          <Button variant="primary" size="sm" onClick={() => navigate('/preciso-de-ajuda')}>
            Ajuda
          </Button>
        </div>
      </nav>
    </header>
  );
};

export default SubHeader;
