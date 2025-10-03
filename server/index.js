import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initDb, prisma } from './db.js';
import { registerUser, loginUser, getUserFromToken } from './auth.js';
import fs from 'fs/promises';
import path from 'path';

dotenv.config();
await initDb();

const app = express();
app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());

// Simple file-based storage for pickup schedules
const dataDir = path.resolve(process.cwd(), 'server', 'data');
const schedulesFile = path.join(dataDir, 'schedules.json');

async function ensureDataFile() {
  try {
    await fs.mkdir(dataDir, { recursive: true });
    await fs.access(schedulesFile).catch(async () => {
      await fs.writeFile(schedulesFile, '[]', 'utf-8');
    });
  } catch (e) {
    console.error('Erro ao preparar storage de agendamentos', e);
  }
}

async function readSchedules() {
  await ensureDataFile();
  const txt = await fs.readFile(schedulesFile, 'utf-8');
  return JSON.parse(txt || '[]');
}

async function writeSchedules(list) {
  await ensureDataFile();
  await fs.writeFile(schedulesFile, JSON.stringify(list, null, 2), 'utf-8');
}

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

// Schedule pickup request
app.post('/coletas/agendar', async (req, res) => {
  try {
    const {
      nome,
      telefone,
      email,
      endereco,
      complemento,
      cidade,
      estado,
      cep,
      origem,
      disponibilidade, // texto livre ou estrutura
      itens, // opcional
      observacoes,
      unidadePreferida // opcional
    } = req.body || {};

    // validações básicas
    const required = { nome, telefone, endereco, disponibilidade };
    for (const [k, v] of Object.entries(required)) {
      if (!v || (typeof v === 'string' && !v.trim())) {
        return res.status(400).json({ error: `Campo obrigatório: ${k}` });
      }
    }

    const schedules = await readSchedules();
    const now = new Date().toISOString();
    const record = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      createdAt: now,
      usuarioId: req.user?.id || null,
      nome,
      telefone,
      email: email || null,
      endereco,
      complemento: complemento || null,
      cidade: cidade || null,
      estado: estado || null,
      cep: cep || null,
      origem: origem || null, // { type, coords, text }
      disponibilidade,
      itens: itens || null,
      observacoes: observacoes || null,
      unidadePreferida: unidadePreferida || null,
      status: 'novo'
    };
    schedules.push(record);
    await writeSchedules(schedules);
    return res.status(201).json({ ok: true, id: record.id });
  } catch (e) {
    console.error('Erro ao criar agendamento de coleta', e);
    res.status(500).json({ error: 'Erro ao criar agendamento' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API rodando em http://localhost:${PORT}`));
