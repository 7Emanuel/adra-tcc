import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from './db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';
const JWT_EXPIRES = '1d';

export async function registerUser({ name, email, senha, telefone, endereco, cidade, estado }) {
  const hashed = await bcrypt.hash(senha, 10);
  const user = await prisma.user.create({
    data: { name, email, senha: hashed, telefone, endereco, cidade, estado }
  });
  return sanitize(user);
}

export async function loginUser({ email, senha }) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return null;
  const ok = await bcrypt.compare(senha, user.senha);
  if (!ok) return null;
  const token = jwt.sign({ sub: user.id }, JWT_SECRET, { expiresIn: JWT_EXPIRES });
  return { token, user: sanitize(user) };
}

export async function getUserFromToken(token) {
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const user = await prisma.user.findUnique({ where: { id: payload.sub } });
    if (!user) return null;
    return sanitize(user);
  } catch {
    return null;
  }
}

function sanitize(user) {
  const { senha, ...rest } = user;
  return rest;
}
