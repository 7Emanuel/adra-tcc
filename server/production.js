import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Servidor de produção para AlwaysData
const app = express();

// Servir arquivos estáticos do build
app.use(express.static(path.join(__dirname, '../dist')));

// Proxy para API - redireciona para o servidor da API que deve estar rodando separadamente
// Em produção, o servidor da API (index.js) roda numa porta e este servidor de frontend em outra
// Ou use um reverse proxy como nginx para lidar com isso

// Fallback para React Router - todas as rotas não-API retornam index.html
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(__dirname, '../dist', 'index.html'));
  }
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor de produção rodando na porta ${PORT}`);
  console.log(`📱 Frontend: http://localhost:${PORT}`);
  console.log(`🔌 API deve estar rodando separadamente em outra porta (ex: 3000)`);
});