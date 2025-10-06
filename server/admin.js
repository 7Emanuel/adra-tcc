import express from 'express';
import fs from 'fs/promises';
import path from 'path';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

// Load environment variables early to ensure ADMIN_PASSWORD and secrets are available
dotenv.config();

const router = express.Router();

// Config
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'daniel';
const ADMIN_SESSION_SECRET = process.env.ADMIN_SESSION_SECRET || 'admin-dev-secret';
const ADMIN_AUTH_DISABLED = String(process.env.ADMIN_AUTH_DISABLED || '').toLowerCase() === 'true';
const SESSION_EXPIRES_HOURS = 12; // 12h

// Storage paths
const dataDir = path.resolve(process.cwd(), 'server', 'data');
const beneficiariesFile = path.join(dataDir, 'beneficiaries.json');
const donationsFile = path.join(dataDir, 'donations.json');

async function ensureJson(filePath, fallback = '[]') {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  try {
    await fs.access(filePath);
  } catch {
    await fs.writeFile(filePath, fallback, 'utf-8');
  }
}

async function readJson(filePath) {
  await ensureJson(filePath);
  try {
    const txt = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(txt || '[]');
  } catch (e) {
    console.warn(`[admin] JSON inválido em ${filePath}. Resetando para []`);
    await fs.writeFile(filePath, '[]', 'utf-8');
    return [];
  }
}

async function writeJson(filePath, data) {
  await ensureJson(filePath);
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

// Minimal in-memory rate limit for login: 5 attempts per 5 minutes per IP
const loginAttempts = new Map();
function rateLimitLogin(req, res, next) {
  const ip = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress || 'unknown';
  const now = Date.now();
  const windowMs = 5 * 60 * 1000; // 5 min
  const max = 5;
  const rec = loginAttempts.get(ip) || [];
  const recent = rec.filter(t => now - t < windowMs);
  if (recent.length >= max) {
    return res.status(429).json({ error: 'Muitas tentativas. Aguarde alguns minutos e tente novamente.' });
  }
  recent.push(now);
  loginAttempts.set(ip, recent);
  next();
}

// Admin auth helpers
function signAdminToken(payload = {}) {
  return jwt.sign({ role: 'admin', ...payload }, ADMIN_SESSION_SECRET, { expiresIn: `${SESSION_EXPIRES_HOURS}h` });
}

function requireAdmin(req, res, next) {
  // Allow bypassing admin auth in development if explicitly enabled
  if (ADMIN_AUTH_DISABLED) {
    req.admin = { id: 'admin', role: 'admin', bypass: true };
    return next();
  }
  const token = req.cookies?.admin_session;
  if (!token) return res.status(401).json({ error: 'Sem sessão' });
  try {
    const decoded = jwt.verify(token, ADMIN_SESSION_SECRET);
    if (decoded?.role !== 'admin') throw new Error('not admin');
    req.admin = { id: 'admin', role: 'admin' };
    return next();
  } catch (e) {
    return res.status(401).json({ error: 'Sessão inválida' });
  }
}

// Login
router.post('/login', rateLimitLogin, (req, res) => {
  const { password } = req.body || {};
  if (!password || typeof password !== 'string') {
    return res.status(400).json({ error: 'Senha ausente' });
  }
  if (password !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Senha incorreta.' });
  }
  const token = signAdminToken({ at: Date.now() });
  const isProd = process.env.NODE_ENV === 'production';
  res.cookie('admin_session', token, {
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax',
    maxAge: SESSION_EXPIRES_HOURS * 60 * 60 * 1000,
    path: '/',
  });
  res.json({ ok: true });
});

// Logout
router.post('/logout', (req, res) => {
  res.clearCookie('admin_session', { path: '/' });
  res.json({ ok: true });
});

// Helpers for filtering, pagination, csv
function paginate(array, page = 1, pageSize = 20) {
  const p = Math.max(1, Number(page) || 1);
  const ps = Math.min(100, Math.max(1, Number(pageSize) || 20));
  const start = (p - 1) * ps;
  const items = array.slice(start, start + ps);
  return { items, page: p, pageSize: ps, total: array.length, pages: Math.ceil(array.length / ps) };
}

function toCSV(items, columns) {
  const header = columns.map(c => '"' + c.label.replaceAll('"', '""') + '"').join(',');
  const rows = items.map(it => columns.map(c => {
    const v = typeof c.accessor === 'function' ? c.accessor(it) : it[c.accessor];
    const s = v == null ? '' : String(v);
    return '"' + s.replaceAll('"', '""') + '"';
  }).join(','));
  return [header, ...rows].join('\n');
}

// Protected routes below
router.use(requireAdmin);

// Beneficiaries list
router.get('/beneficiaries', async (req, res) => {
  const { status = 'pending', search = '', page = '1', pageSize = '20' } = req.query || {};
  const all = await readJson(beneficiariesFile);
  const filtered = all.filter(b => {
    const st = (b.status || 'pending') === status;
    if (!st) return false;
    const q = String(search || '').toLowerCase();
    if (!q) return true;
    const hay = [b.id, b.name, b.email, b.phone, b.address?.city, b.address?.state, b.document?.value].map(x => (x || '').toLowerCase()).join(' ');
    return hay.includes(q);
  });
  const result = paginate(filtered, page, pageSize);
  res.json(result);
});

router.get('/beneficiaries/:id', async (req, res) => {
  const all = await readJson(beneficiariesFile);
  const b = all.find(x => x.id === req.params.id);
  if (!b) return res.status(404).json({ error: 'Não encontrado' });
  res.json(b);
});

router.patch('/beneficiaries/:id/validate', async (req, res) => {
  const { approved, reason } = req.body || {};
  if (approved === undefined) return res.status(400).json({ error: 'Campo approved é obrigatório' });
  const all = await readJson(beneficiariesFile);
  const idx = all.findIndex(x => x.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Não encontrado' });
  const status = approved ? 'validated' : 'rejected';
  const now = new Date().toISOString();
  all[idx] = {
    ...all[idx],
    status,
    notes: reason || all[idx].notes,
    history: [
      ...(all[idx].history || []),
      { at: now, by: 'admin', action: approved ? 'validated' : 'rejected', details: reason || '' }
    ]
  };
  await writeJson(beneficiariesFile, all);
  res.json({ ok: true });
});

// Donations
router.get('/donations', async (req, res) => {
  const { status = '', search = '', page = '1', pageSize = '20' } = req.query || {};
  const all = await readJson(donationsFile);
  const filtered = all.filter(d => {
    const st = status ? d.status === status : true;
    if (!st) return false;
    const q = String(search || '').toLowerCase();
    if (!q) return true;
    const hay = [d.id, d.donor?.name, d.donor?.email, d.donor?.phone, d.address?.city, d.address?.state, d.type].map(x => (x || '').toLowerCase()).join(' ');
    return hay.includes(q);
  });
  const result = paginate(filtered, page, pageSize);
  res.json(result);
});

router.get('/donations/:id', async (req, res) => {
  const all = await readJson(donationsFile);
  const d = all.find(x => x.id === req.params.id);
  if (!d) return res.status(404).json({ error: 'Não encontrado' });
  res.json(d);
});

router.patch('/donations/:id', async (req, res) => {
  const patch = req.body || {};
  const all = await readJson(donationsFile);
  const idx = all.findIndex(x => x.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Não encontrado' });
  const now = new Date().toISOString();
  all[idx] = {
    ...all[idx],
    ...patch,
    timeline: [
      ...(all[idx].timeline || []),
      patch.status ? { at: now, by: 'admin', status: patch.status, note: patch.notes || '' } : undefined
    ].filter(Boolean)
  };
  await writeJson(donationsFile, all);
  res.json({ ok: true });
});

// Export CSV
router.get('/beneficiaries/export.csv', async (req, res) => {
  const all = await readJson(beneficiariesFile);
  const csv = toCSV(all, [
    { label: 'ID', accessor: 'id' },
    { label: 'Nome', accessor: 'name' },
    { label: 'Documento', accessor: (b) => `${b.document?.type||''}:${b.document?.value||''}` },
    { label: 'Email', accessor: 'email' },
    { label: 'Telefone', accessor: 'phone' },
    { label: 'Cidade/UF', accessor: (b) => `${b.address?.city||''}/${b.address?.state||''}` },
    { label: 'Status', accessor: 'status' },
    { label: 'Criado em', accessor: 'createdAt' }
  ]);
  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', 'attachment; filename="beneficiaries.csv"');
  res.send(csv);
});

router.get('/donations/export.csv', async (req, res) => {
  const all = await readJson(donationsFile);
  const csv = toCSV(all, [
    { label: 'ID', accessor: 'id' },
    { label: 'Doador', accessor: (d) => d.donor?.name || '' },
    { label: 'Tipo', accessor: 'type' },
    { label: 'Status', accessor: 'status' },
    { label: 'Cidade/UF', accessor: (d) => `${d.address?.city||''}/${d.address?.state||''}` },
    { label: 'Itens', accessor: (d) => (d.items||[]).map(i => `${i.name} x${i.qty}`).join('; ') },
    { label: 'Criado em', accessor: 'createdAt' }
  ]);
  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', 'attachment; filename="donations.csv"');
  res.send(csv);
});

export default router;
