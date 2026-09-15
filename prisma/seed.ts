import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  const user = await prisma.user.upsert({
    where: { email: 'demo@fluxio.app' },
    update: {},
    create: {
      name: 'Demo User',
      email: 'demo@fluxio.app',
      passwordHash: 'test-password',
      phone: '08123456789',
      dateOfBirth: new Date('1995-01-01'),
      settings: {},
    },
  });

  console.log('✅ User seeded:', user);
  console.log('📋 Gunakan userId ini:', user.id);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
