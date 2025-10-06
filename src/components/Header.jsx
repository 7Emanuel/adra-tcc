import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from './Button';

const Header = ({ onDoarClick, onAjudaClick }) => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  const handleDoarClick = () => {
    if (onDoarClick) {
      onDoarClick();
    } else {
      navigate('/doar');
    }
  };

  const handleAjudaClick = () => {
    if (onAjudaClick) {
      onAjudaClick();
    } else {
      navigate('/preciso-de-ajuda');
    }
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-200 ${
        isScrolled ? 'bg-white shadow-lg' : 'bg-white bg-opacity-95'
      }`}
    >
      <nav className="container mx-auto px-4 py-4" role="navigation" aria-label="Navegação principal">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-adra-green rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <span className="text-xl font-bold text-gray-900">ADRA</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => scrollToSection('inicio')}
              className="text-gray-900 hover:text-adra-green transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-adra-green rounded px-2 py-1"
            >
              Início
            </button>
            <button
              onClick={() => scrollToSection('como-funciona')}
              className="text-gray-900 hover:text-adra-green transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-adra-green rounded px-2 py-1"
            >
              Como Funciona
            </button>
            <button
              onClick={() => scrollToSection('areas-atuacao')}
              className="text-gray-900 hover:text-adra-green transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-adra-green rounded px-2 py-1"
            >
              Áreas de Atuação
            </button>
            <button
              onClick={() => scrollToSection('transparencia')}
              className="text-gray-900 hover:text-adra-green transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-adra-green rounded px-2 py-1"
            >
              Transparência
            </button>
          </div>

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center space-x-3">
            <Button variant="secondary" size="sm" onClick={handleDoarClick}>
              Quero Doar
            </Button>
            <Button variant="primary" size="sm" onClick={handleAjudaClick}>
              Preciso de Ajuda
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-adra-green"
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            aria-label="Abrir menu de navegação"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div id="mobile-menu" className="md:hidden mt-4 pb-4 border-t border-gray-200 pt-4">
            <div className="flex flex-col space-y-3">
              <button
                onClick={() => scrollToSection('inicio')}
                className="text-left text-gray-900 hover:text-adra-green transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-adra-green rounded px-2 py-2"
              >
                Início
              </button>
              <button
                onClick={() => scrollToSection('como-funciona')}
                className="text-left text-gray-900 hover:text-adra-green transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-adra-green rounded px-2 py-2"
              >
                Como Funciona
              </button>
              <button
                onClick={() => scrollToSection('areas-atuacao')}
                className="text-left text-gray-900 hover:text-adra-green transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-adra-green rounded px-2 py-2"
              >
                Áreas de Atuação
              </button>
              <button
                onClick={() => scrollToSection('transparencia')}
                className="text-left text-gray-900 hover:text-adra-green transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-adra-green rounded px-2 py-2"
              >
                Transparência
              </button>
              
              <div className="flex flex-col space-y-2 pt-3 border-t border-gray-200">
                <Button variant="secondary" size="sm" onClick={handleDoarClick} className="w-full">
                  Quero Doar
                </Button>
                <Button variant="primary" size="sm" onClick={handleAjudaClick} className="w-full">
                  Preciso de Ajuda
                </Button>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
