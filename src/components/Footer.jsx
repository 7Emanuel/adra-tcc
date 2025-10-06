import React from 'react';

const Footer = () => {
  return (
  <footer className="bg-adra-green text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo e Descrição */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <span className="text-adra-green font-bold text-sm">A</span>
              </div>
              <span className="text-xl font-bold">ADRA</span>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Conectamos quem quer ajudar com quem mais precisa através de uma plataforma simples e segura.
            </p>
          </div>

          {/* Links Úteis */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Links Úteis</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-gray-200 hover:text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white rounded">
                  Sobre a ADRA
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-200 hover:text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white rounded">
                  Nossa Missão
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-200 hover:text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white rounded">
                  Relatórios (em breve)
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-2 00 hover:text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white rounded">
                  Política de Privacidade (em breve)
                </a>
              </li>
            </ul>
          </div>

          {/* Contato */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contato</h3>
            <div className="space-y-2 text-sm text-gray-300">
              <p>
                <span className="font-medium">Email:</span> contato@adra.org.br
              </p>
              <p>
                <span className="font-medium">Telefone:</span> (11) 9999-9999
              </p>
              <p className="text-xs text-gray-400 mt-4">
                * Este é um protótipo. Funcionalidades completas serão implementadas nas próximas etapas.
              </p>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-sm text-gray-300">
            © 2025 ADRA - Agência de Desenvolvimento e Recursos Assistenciais. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
