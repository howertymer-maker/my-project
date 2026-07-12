import { db } from "@/lib/db";
import { sendPushNotification } from "@/lib/push";

/**
 * Create a notification for a user AND send a web push notification to all
 * their subscribed devices. Safe to call from any API route after an event.
 */
export async function notify(params: {
  userId: string;
  type: "reward" | "streak" | "social" | "mission" | "challenge" | "system";
  icon: string;
  color: string;
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

    // Also send a web push notification (best-effort)
    await sendPushNotification({
      userId: params.userId,
      title: params.title,
      body: params.body,
    });
  } catch (e) {
    console.error("notify failed:", e);
  }
}
