import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

/**
 * TEMPORARY: when AUTH_BYPASS is enabled, unauthenticated requests fall back
 * to a demo user so the app is browsable from the preview without login.
 * Disable by setting AUTH_BYPASS=false (or removing the env var).
 */
const AUTH_BYPASS =
  process.env.AUTH_BYPASS === "true" ||
  process.env.NEXT_PUBLIC_AUTH_BYPASS === "true" ||
  process.env.AUTH_BYPASS !== "false"; // default: bypass ON unless explicitly false

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
    // fall through to bypass check
  }
  // Bypass: return a demo user (the first user in the DB) so the app is usable
  // in the preview without authentication.
  if (AUTH_BYPASS) {
    try {
      return await db.user.findFirst({ orderBy: { createdAt: "asc" } });
    } catch {
      return null;
    }
  }
  return null;
}
