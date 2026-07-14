import { db } from "@/lib/db";

/**
 * Returns true if the beta test is currently active (premium for all).
 * Checks the `betaTestEndsAt` setting in the database.
 */
export async function isBetaTestActive(): Promise<boolean> {
  try {
    const setting = await db.setting.findUnique({ where: { key: "betaTestEndsAt" } });
    if (!setting) return false;
    return new Date() < new Date(setting.value);
  } catch {
    return false;
  }
}
