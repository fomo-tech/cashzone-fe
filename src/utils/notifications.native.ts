import {
  PushNotifications,
  Token,
  ActionPerformed,
} from "@capacitor/push-notifications";
import { Capacitor } from "@capacitor/core";

/**
 * Setup Push Notifications cho mobile app
 */
export const setupPushNotifications = async () => {
  if (!Capacitor.isNativePlatform()) {
    console.log("Push notifications only available on native platforms");
    return;
  }

  // Request permission
  const result = await PushNotifications.requestPermissions();

  if (result.receive === "granted") {
    // Register with Apple / Google
    await PushNotifications.register();
  }

  // On registration success
  PushNotifications.addListener("registration", async (token: Token) => {
    console.log("Push registration success:", token.value);

    // Send token to backend
    await fetch("/api/v1/users/push-token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token: token.value,
        platform: Capacitor.getPlatform(),
      }),
    });
  });

  // On registration error
  PushNotifications.addListener("registrationError", (error: any) => {
    console.error("Push registration error:", error);
  });

  // On notification received
  PushNotifications.addListener("pushNotificationReceived", (notification) => {
    console.log("Push notification received:", notification);

    // Show local notification or update badge
  });

  // On notification action performed
  PushNotifications.addListener(
    "pushNotificationActionPerformed",
    (action: ActionPerformed) => {
      console.log("Push action performed:", action);

      // Navigate to specific screen based on notification data
      const data = action.notification.data;
      if (data.link) {
        window.location.href = data.link;
      }
    },
  );
};

/**
 * Show local notification (không cần internet)
 */
export const showLocalNotification = async (options: {
  title: string;
  body: string;
  id?: number;
}) => {
  // Note: Cần install @capacitor/local-notifications plugin
  // npm install @capacitor/local-notifications

  console.log("Local notification:", options);
  // Implementation here
};

export default setupPushNotifications;
