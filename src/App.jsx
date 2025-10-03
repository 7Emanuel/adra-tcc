import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import Doar from './pages/Doar';
import EmBreve from './pages/EmBreve';
import DecisorNecessitado from './pages/DecisorNecessitado';
import LoginCadastro from './pages/LoginCadastro';
import PaginaEsperaValidacao from './pages/PaginaEsperaValidacao';
import PaginaPedidoDoacao from './pages/PaginaPedidoDoacao';

// Novas páginas do sistema de doações
import DonorHub from './pages/DonorHub';
import DoarTransferencia from './pages/DoarTransferencia';
import DoarItens from './pages/DoarItens';
import MapaUnidades from './pages/MapaUnidades';
import ComoFunciona from './pages/ComoFunciona';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        {/* Rotas já existentes */}
        <Route path="/" element={<Home />} />
        <Route path="/doar" element={<DonorHub />} />
        <Route path="/preciso-de-ajuda" element={<DecisorNecessitado />} />
        <Route path="/login-cadastro" element={<LoginCadastro />} />
        <Route path="/espera-validacao" element={<PaginaEsperaValidacao />} />
        <Route path="/pedir-doacao" element={<PaginaPedidoDoacao />} />
        
        {/* NOVAS rotas do sistema de doações */}
        <Route path="/doar/transferencia" element={<DoarTransferencia />} />
        <Route path="/doar/itens" element={<DoarItens />} />
        <Route path="/doar/itens/unidades" element={<MapaUnidades />} />
        <Route path="/doar/como-funciona" element={<ComoFunciona />} />
      </Routes>
    </Router>
  );
}

export default App;
