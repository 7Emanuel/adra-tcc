import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const BackButton = ({ className = '' }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isHome = location.pathname === '/';

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  if (isHome) return null;

  return (
    <button
      onClick={handleBack}
      aria-label="Voltar"
      className={`fixed bottom-5 left-5 z-50 inline-flex items-center gap-2 rounded-full bg-white/90 backdrop-blur border border-gray-200 shadow-md hover:shadow-lg px-4 py-2 text-gray-700 hover:text-green-700 focus:outline-none focus:ring-2 focus:ring-green-600 ${className}`}
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
      </svg>
      <span className="hidden sm:inline">Voltar</span>
    </button>
  );
};

export default BackButton;
