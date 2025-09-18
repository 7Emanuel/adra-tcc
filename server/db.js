import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();

export async function initDb() {
  try {
    await prisma.$connect();
    console.log('✅ Prisma conectado');
  } catch (e) {
    console.error('❌ Erro ao conectar Prisma', e);
    process.exit(1);
  }
}
