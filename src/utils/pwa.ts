// PWA Utilities
export const registerServiceWorker = async () => {
  if ("serviceWorker" in navigator) {
    try {
      const registration = await navigator.serviceWorker.register(
        "/service-worker.js",
        {
          scope: "/",
        }
      );

      console.log(
        "Service Worker registered successfully:",
        registration.scope
      );

      // Check for updates
      registration.addEventListener("updatefound", () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener("statechange", () => {
            if (
              newWorker.state === "installed" &&
              navigator.serviceWorker.controller
            ) {
              // New service worker is ready
              console.log("New service worker available");
              // Notify user about update
              if (confirm("Có bản cập nhật mới. Tải lại trang để cập nhật?")) {
                window.location.reload();
              }
            }
          });
        }
      });

      return registration;
    } catch (error) {
      console.error("Service Worker registration failed:", error);
    }
  } else {
    console.log("Service Worker is not supported in this browser");
  }
};

// Check if app is installed
export const isAppInstalled = (): boolean => {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (window.navigator as any).standalone === true
  );
};

// Request notification permission
export const requestNotificationPermission =
  async (): Promise<NotificationPermission> => {
    if (!("Notification" in window)) {
      console.log("This browser does not support notifications");
      return "denied";
    }

    if (Notification.permission === "granted") {
      return "granted";
    }

    if (Notification.permission !== "denied") {
      const permission = await Notification.requestPermission();
      return permission;
    }

    return Notification.permission;
  };

// Show notification
export const showNotification = async (
  title: string,
  options?: NotificationOptions
): Promise<void> => {
  const permission = await requestNotificationPermission();

  if (permission === "granted") {
    if ("serviceWorker" in navigator && navigator.serviceWorker.controller) {
      // Use service worker to show notification
      const registration = await navigator.serviceWorker.ready;
      await registration.showNotification(title, {
        icon: "/icons/icon-192x192.png",
        badge: "/icons/icon-72x72.png",
        vibrate: [200, 100, 200],
        ...options,
      });
    } else {
      // Fallback to regular notification
      new Notification(title, {
        icon: "/icons/icon-192x192.png",
        ...options,
      });
    }
  }
};

// Get push subscription
export const getPushSubscription =
  async (): Promise<PushSubscription | null> => {
    if ("serviceWorker" in navigator && "PushManager" in window) {
      try {
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.getSubscription();
        return subscription;
      } catch (error) {
        console.error("Failed to get push subscription:", error);
        return null;
      }
    }
    return null;
  };

// Subscribe to push notifications
export const subscribeToPush = async (
  vapidPublicKey: string
): Promise<PushSubscription | null> => {
  if ("serviceWorker" in navigator && "PushManager" in window) {
    try {
      const registration = await navigator.serviceWorker.ready;

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidPublicKey) as any,
      });

      console.log("Push subscription successful:", subscription);
      return subscription;
    } catch (error) {
      console.error("Failed to subscribe to push:", error);
      return null;
    }
  }
  return null;
};

// Unsubscribe from push notifications
export const unsubscribeFromPush = async (): Promise<boolean> => {
  const subscription = await getPushSubscription();
  if (subscription) {
    try {
      await subscription.unsubscribe();
      console.log("Push unsubscription successful");
      return true;
    } catch (error) {
      console.error("Failed to unsubscribe from push:", error);
      return false;
    }
  }
  return false;
};

// Helper function to convert VAPID key
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

// Install prompt
let deferredPrompt: any = null;

export const initInstallPrompt = () => {
  window.addEventListener("beforeinstallprompt", (e) => {
    // Prevent the mini-infobar from appearing on mobile
    e.preventDefault();
    // Stash the event so it can be triggered later
    deferredPrompt = e;
    console.log("Install prompt ready");

    // Dispatch custom event to notify app
    window.dispatchEvent(new CustomEvent("pwa:installable"));
  });

  window.addEventListener("appinstalled", () => {
    console.log("PWA was installed");
    deferredPrompt = null;

    // Dispatch custom event
    window.dispatchEvent(new CustomEvent("pwa:installed"));
  });
};

export const showInstallPrompt = async (): Promise<boolean> => {
  if (!deferredPrompt) {
    console.log("Install prompt not available");
    return false;
  }

  // Show the install prompt
  deferredPrompt.prompt();

  // Wait for the user to respond to the prompt
  const { outcome } = await deferredPrompt.userChoice;
  console.log(`User response to the install prompt: ${outcome}`);

  // Clear the deferred prompt
  deferredPrompt = null;

  return outcome === "accepted";
};

export const canShowInstallPrompt = (): boolean => {
  return deferredPrompt !== null;
};

// Check if online
export const isOnline = (): boolean => {
  return navigator.onLine;
};

// Listen to online/offline events
export const addNetworkListeners = (
  onOnline: () => void,
  onOffline: () => void
) => {
  window.addEventListener("online", onOnline);
  window.addEventListener("offline", onOffline);

  return () => {
    window.removeEventListener("online", onOnline);
    window.removeEventListener("offline", onOffline);
  };
};

// Cache API helpers
export const cacheData = async (key: string, data: any): Promise<void> => {
  try {
    const cache = await caches.open("api-cache");
    const response = new Response(JSON.stringify(data));
    await cache.put(key, response);
  } catch (error) {
    console.error("Failed to cache data:", error);
  }
};

export const getCachedData = async (key: string): Promise<any> => {
  try {
    const cache = await caches.open("api-cache");
    const response = await cache.match(key);
    if (response) {
      return await response.json();
    }
  } catch (error) {
    console.error("Failed to get cached data:", error);
  }
  return null;
};
