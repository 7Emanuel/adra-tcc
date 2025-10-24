// Dev: touch to restart nodemon
let prisma = null;
export { prisma };

export async function initDb() {
  try {
    const { PrismaClient } = await import('@prisma/client');
    prisma = new PrismaClient();
    await prisma.$connect();
    console.log('✅ Prisma conectado');
  } catch (e) {
    console.error('❌ Erro ao conectar Prisma', e);
    throw e;
  }
}
