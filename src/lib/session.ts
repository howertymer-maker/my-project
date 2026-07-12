import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

/**
 * Returns the authenticated user's DB record, or null if not signed in.
 * Use this in API routes instead of db.user.findFirst().
 */
export async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) return null;
  return db.user.findUnique({ where: { id: userId } });
}
