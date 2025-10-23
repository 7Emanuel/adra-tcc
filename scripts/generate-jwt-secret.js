import crypto from 'crypto';

// Gerar chave JWT segura de 64 caracteres
const jwtSecret = crypto.randomBytes(32).toString('hex');

console.log('🔐 Chave JWT gerada:');
console.log(`JWT_SECRET=${jwtSecret}`);
console.log('\n📋 Cole esta linha no seu .env.production:');
console.log(`JWT_SECRET=${jwtSecret}`);