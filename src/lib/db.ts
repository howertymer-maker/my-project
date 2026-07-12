import { PrismaClient } from '@prisma/client'

// Force-load .env and override any system-level DATABASE_URL (the sandbox sets
// a stale SQLite value in the global env that breaks Prisma at query time).
if (!process.env.DATABASE_URL || process.env.DATABASE_URL.startsWith('file:')) {
  try {
    const { config } = require('dotenv')
    const { parsed } = config()
    if (parsed?.DATABASE_URL) {
      process.env.DATABASE_URL = parsed.DATABASE_URL
    }
  } catch {
    /* dotenv optional */
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
