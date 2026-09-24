import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  pool: Pool | undefined;
};

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL environment variable is not defined.');
  }

  // Tentukan apakah koneksi memerlukan SSL (Supabase, Neon, Railway, cloud db)
  const isCloudDb =
    connectionString.includes('supabase') ||
    connectionString.includes('pooler') ||
    connectionString.includes('neon.tech') ||
    connectionString.includes('render.com');

  const pool =
    globalForPrisma.pool ??
    new Pool({
      connectionString,
      ssl: isCloudDb ? { rejectUnauthorized: false } : undefined,
      connectionTimeoutMillis: 15000, // 15 detik timeout koneksi
      idleTimeoutMillis: 30000,
      max: 10,
    });

  if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.pool = pool;
  }

  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
