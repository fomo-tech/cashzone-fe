import { io, Socket } from "socket.io-client";

// Extract base URL without /api/v1
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api/v1";
const SOCKET_URL = API_URL.replace(/\/api\/v1$/, "");

class SocketService {
  private socket: Socket | null = null;
  private isConnected: boolean = false;

  /**
   * Connect to socket server with authentication
   */
  connect(token?: string): void {
    if (this.socket?.connected) {
      // console.log("Socket already connected");
      return;
    }

    this.socket = io(SOCKET_URL, {
      auth: {
        token: token || localStorage.getItem("accessToken"),
      },
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    this.socket.on("connect", () => {
      console.log("✅ Socket connected:", this.socket?.id);
      this.isConnected = true;
    });

    this.socket.on("disconnect", (reason) => {
      console.log("❌ Socket disconnected:", reason);
      this.isConnected = false;
    });

    this.socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error.message);
    });

    this.socket.on("reconnect", (attemptNumber) => {
      console.log(`🔄 Socket reconnected after ${attemptNumber} attempts`);
    });

    this.socket.on("reconnect_error", (error) => {
      console.error("Socket reconnection error:", error);
    });

    this.socket.on("reconnect_failed", () => {
      console.error("❌ Socket reconnection failed");
    });
  }

  /**
   * Disconnect from socket server
   */
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
      console.log("Socket disconnected");
    }
  }

  /**
   * Check if socket is connected
   */
  get connected(): boolean {
    return this.isConnected && this.socket?.connected === true;
  }

  /**
   * Get socket instance
   */
  getSocket(): Socket | null {
    return this.socket;
  }

  /**
   * Listen for new notifications (individual)
   */
  onNewNotification(callback: (notification: any) => void): void {
    if (!this.socket) {
      console.warn("Socket not initialized");
      return;
    }

    this.socket.on("notification:new", callback);
  }

  /**
   * Listen for broadcast notifications
   */
  onBroadcastNotification(callback: (notification: any) => void): void {
    if (!this.socket) {
      console.warn("Socket not initialized");
      return;
    }

    this.socket.on("notification:broadcast", callback);
  }

  /**
   * Listen for unread count updates
   */
  onUnreadCountUpdate(callback: (data: { count: number }) => void): void {
    if (!this.socket) {
      console.warn("Socket not initialized");
      return;
    }

    this.socket.on("notification:unread-count", callback);
  }

  /**
   * Remove all notification listeners
   */
  offNotificationListeners(): void {
    if (!this.socket) return;

    this.socket.off("notification:new");
    this.socket.off("notification:broadcast");
    this.socket.off("notification:unread-count");
  }

  /**
   * Emit custom event
   */
  emit(event: string, data?: any): void {
    if (!this.socket) {
      console.warn("Socket not initialized");
      return;
    }

    this.socket.emit(event, data);
  }

  /**
   * Listen for custom event
   */
  on(event: string, callback: (...args: any[]) => void): void {
    if (!this.socket) {
      console.warn("Socket not initialized");
      return;
    }

    this.socket.on(event, callback);
  }

  /**
   * Remove listener for custom event
   */
  off(event: string, callback?: (...args: any[]) => void): void {
    if (!this.socket) return;

    if (callback) {
      this.socket.off(event, callback);
    } else {
      this.socket.off(event);
    }
  }
}

// Export singleton instance
const socketService = new SocketService();
export default socketService;
