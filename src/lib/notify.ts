import { db } from "@/lib/db";

/**
 * Create a notification for a user. Safe to call from any API route after an
 * event that the user should know about (mission stage ready, level up, like, ...).
 */
export async function notify(params: {
  userId: string;
  type: "reward" | "streak" | "social" | "mission" | "challenge" | "system";
  icon: string; // material symbol name
  color: string; // hex accent
  title: string;
  body: string;
}): Promise<void> {
  try {
    await db.notification.create({
      data: {
        userId: params.userId,
        type: params.type,
        icon: params.icon,
        color: params.color,
        title: params.title,
        body: params.body,
        read: false,
      },
    });
  } catch (e) {
    // notifications are best-effort; never fail the parent action
    console.error("notify failed:", e);
  }
}
