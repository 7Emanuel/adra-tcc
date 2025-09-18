import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initDb, prisma } from './db.js';
import { registerUser, loginUser, getUserFromToken } from './auth.js';

dotenv.config();
await initDb();

const app = express();
app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());

// Health
app.get('/health', (_req, res) => res.json({ ok: true }));

// Register
app.post('/auth/register', async (req, res) => {
  try {
    const required = ['name','email','senha','telefone','endereco','cidade','estado'];
    for (const f of required) if (!req.body[f]) return res.status(400).json({ error: `Campo obrigatório: ${f}` });
    const user = await registerUser(req.body);
    return res.status(201).json(user);
  } catch (e) {
    if (e.code === 'P2002') return res.status(409).json({ error: 'E-mail ou telefone já cadastrado' });
    console.error(e);
    res.status(500).json({ error: 'Erro ao registrar' });
  }
});

// Login
app.post('/auth/login', async (req, res) => {
  const { email, senha } = req.body;
  if (!email || !senha) return res.status(400).json({ error: 'Credenciais ausentes' });
  const result = await loginUser({ email, senha });
  if (!result) return res.status(401).json({ error: 'Credenciais inválidas' });
  res.json(result);
});

// Auth middleware
async function auth(req, _res, next) {
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    req.user = await getUserFromToken(token);
  }
  next();
}
app.use(auth);

// Current user
app.get('/auth/me', (req, res) => {
  if (!req.user) return res.status(401).json({ error: 'Não autenticado' });
  res.json(req.user);
});

// List users (temporário demo)
app.get('/users', async (_req, res) => {
  const users = await prisma.user.findMany({ orderBy: { id: 'asc' } });
  res.json(users.map(u => ({ id: u.id, name: u.name, email: u.email })));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API rodando em http://localhost:${PORT}`));
