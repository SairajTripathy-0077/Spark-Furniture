import { PrismaClient } from '@/generated/client';

const globalForPrisma = global as unknown as { prisma: any };

export const prisma =
  (globalForPrisma.prisma && 'category' in globalForPrisma.prisma)
    ? globalForPrisma.prisma
    : new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
