import { useEffect, useCallback, useRef } from "react";
import socketService from "@/services/socketService";
import { useAuthStore } from "@/store/authStore";

interface UseSocketNotificationsProps {
  onNewNotification?: (notification: any) => void;
  onBroadcastNotification?: (notification: any) => void;
  onUnreadCountUpdate?: (count: number) => void;
}

/**
 * Custom hook for handling real-time notifications via Socket.IO
 */
export const useSocketNotifications = ({
  onNewNotification,
  onBroadcastNotification,
  onUnreadCountUpdate,
}: UseSocketNotificationsProps = {}) => {
  const { isAuthenticated, accessToken } = useAuthStore();
  const hasConnected = useRef(false);

  // Connect to socket when authenticated (tránh reconnect không cần thiết)
  useEffect(() => {
    if (isAuthenticated && accessToken && !hasConnected.current) {
      socketService.connect(accessToken);
      hasConnected.current = true;

      return () => {
        socketService.offNotificationListeners();
      };
    } else if (!isAuthenticated && hasConnected.current) {
      socketService.disconnect();
      hasConnected.current = false;
    }
  }, [isAuthenticated, accessToken]);

  // Set up notification listeners
  useEffect(() => {
    if (!socketService.connected) return;

    // Listen for new individual notifications
    if (onNewNotification) {
      socketService.onNewNotification((notification) => {
        console.log("📬 New notification received:", notification);
        onNewNotification(notification);
      });
    }

    // Listen for broadcast notifications
    if (onBroadcastNotification) {
      socketService.onBroadcastNotification((notification) => {
        console.log("📢 Broadcast notification received:", notification);
        onBroadcastNotification(notification);
      });
    }

    // Listen for unread count updates
    if (onUnreadCountUpdate) {
      socketService.onUnreadCountUpdate(({ count }) => {
        console.log("🔢 Unread count updated:", count);
        onUnreadCountUpdate(count);
      });
    }

    return () => {
      socketService.offNotificationListeners();
    };
  }, [onNewNotification, onBroadcastNotification, onUnreadCountUpdate]);

  const emit = useCallback((event: string, data?: any) => {
    socketService.emit(event, data);
  }, []);

  const on = useCallback(
    (event: string, callback: (...args: any[]) => void) => {
      socketService.on(event, callback);
    },
    []
  );

  const off = useCallback(
    (event: string, callback?: (...args: any[]) => void) => {
      socketService.off(event, callback);
    },
    []
  );

  return {
    isConnected: socketService.connected,
    emit,
    on,
    off,
  };
};
