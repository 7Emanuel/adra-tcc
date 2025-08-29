import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Doar from './pages/Doar';
import EmBreve from './pages/EmBreve';
import DecisorNecessitado from './pages/DecisorNecessitado';
import LoginCadastro from './pages/LoginCadastro';
import PaginaEsperaValidacao from './pages/PaginaEsperaValidacao';
import PaginaPedidoDoacao from './pages/PaginaPedidoDoacao';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/doar" element={<Doar />} />
        <Route path="/preciso-de-ajuda" element={<DecisorNecessitado />} />
        <Route path="/login-cadastro" element={<LoginCadastro />} />
        <Route path="/espera-validacao" element={<PaginaEsperaValidacao />} />
        <Route path="/pedir-doacao" element={<PaginaPedidoDoacao />} />
      </Routes>
    </Router>
  );
}

export default App;
