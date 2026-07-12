import { PrismaClient } from '@prisma/client'
import { config as loadEnv } from 'dotenv'

// The sandbox sets a stale SQLite DATABASE_URL in the global env that breaks
// Prisma at query time. Load .env and override it before Prisma is constructed.
if (!process.env.DATABASE_URL || process.env.DATABASE_URL.startsWith('file:')) {
  const { parsed } = loadEnv()
  if (parsed?.DATABASE_URL) {
    process.env.DATABASE_URL = parsed.DATABASE_URL
  }
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['error', 'warn'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
