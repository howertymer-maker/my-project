import webpush from "web-push";
import { db } from "@/lib/db";

let pushConfigured = false;

function configurePush() {
  if (pushConfigured) return;
  const publicKey = process.env.VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;

  if (!publicKey || !privateKey) return;

  try {
    webpush.setVapidDetails(
      "mailto:noreply@nevergiveup.app",
      publicKey,
      privateKey
    );
    pushConfigured = true;
  } catch {
    // VAPID keys might be invalid format — skip push, don't crash the app
    console.error("VAPID keys invalid, push notifications disabled");
  }
}

/**
 * Sends a web push notification to ALL subscribed devices of a user.
 * Called automatically by notify() when a notification is created.
 * Silently skips if VAPID keys aren't configured or user has no subscriptions.
 */
export async function sendPushNotification(params: {
  userId: string;
  title: string;
  body: string;
  url?: string;
}): Promise<void> {
  configurePush();
  if (!pushConfigured) return;

  try {
    const subs = await db.pushSubscription.findMany({
      where: { userId: params.userId },
    });

    if (subs.length === 0) return;

    const payload = JSON.stringify({
      title: params.title,
      body: params.body,
      url: params.url || "/",
    });

    await Promise.allSettled(
      subs.map((sub) => {
        const keys = sub.keys ? JSON.parse(sub.keys) : null;
        return webpush.sendNotification(
          {
            endpoint: sub.endpoint,
            keys: keys || {},
          },
          payload
        );
      })
    );
  } catch {
    // push is best-effort
  }
}
