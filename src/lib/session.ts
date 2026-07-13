import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

/**
 * When AUTH_BYPASS is enabled, unauthenticated requests fall back to a demo
 * user so the app is browsable from the preview without login.
 * Set NEXT_PUBLIC_AUTH_BYPASS=true in .env to enable (dev only).
 * On Vercel/production: set to false (or don't set) to require login.
 */
const AUTH_BYPASS = process.env.AUTH_BYPASS === "true";

/**
 * Returns the authenticated user's DB record, or null if not signed in.
 * Use this in API routes instead of db.user.findFirst().
 */
export async function getCurrentUser() {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as { id?: string } | undefined)?.id;
    if (userId) {
      return db.user.findUnique({ where: { id: userId } });
    }
  } catch {
    // getServerSession can throw if NextAuth isn't configured properly
  }
  // Bypass: return a demo user (only in dev/preview with AUTH_BYPASS=true)
  if (AUTH_BYPASS) {
    try {
      return await db.user.findFirst({ orderBy: { createdAt: "asc" } });
    } catch {
      return null;
    }
  }
  return null;
}
