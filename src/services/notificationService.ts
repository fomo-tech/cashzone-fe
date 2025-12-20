import http from "./api";

export interface Notification {
  _id: string;
  userId?: string | { _id: string; username: string; email: string };
  targetType: "individual" | "broadcast";
  type: "task_new" | "task_reward" | "referral" | "system";
  title: string;
  message?: string;
  link?: string;
  imageUrl?: string;
  read: boolean; // Computed field from backend for current user
  readBy?: string[]; // Array of user IDs who have read this notification
  createdAt: string;
}

export interface NotificationStats {
  total: number;
  unread: number;
  byType: {
    task_new?: number;
    task_reward?: number;
    referral?: number;
    system?: number;
  };
}

export interface CreateNotificationData {
  userId: string;
  type: "task_new" | "task_reward" | "referral" | "system";
  title: string;
  message?: string;
  link?: string;
  imageUrl?: string;
}

export interface BulkNotificationData {
  userIds: string[];
  type: "task_new" | "task_reward" | "referral" | "system";
  title: string;
  message?: string;
  link?: string;
  imageUrl?: string;
}

export interface SystemNotificationData {
  title: string;
  message: string;
  link?: string;
  imageUrl?: string;
}

class NotificationService {
  // ===== CLIENT APIS =====

  /**
   * Lấy danh sách thông báo của user hiện tại
   */
  async getUserNotifications(page: number = 1, limit: number = 20) {
    const response = await http.get("/notifications", {
      params: { page, limit },
    });
    return response.data;
  }

  /**
   * Đếm số lượng thông báo chưa đọc
   */
  async getUnreadCount() {
    const response = await http.get("/notifications/unread-count");
    return response.data;
  }

  /**
   * Đánh dấu thông báo đã đọc
   */
  async markAsRead(notificationId: string) {
    const response = await http.patch(`/notification/${notificationId}/read`);
    return response.data;
  }

  /**
   * Đánh dấu tất cả thông báo đã đọc
   */
  async markAllAsRead() {
    const response = await http.patch("/notifications/read-all");
    return response.data;
  }

  /**
   * Xóa thông báo
   */
  async deleteNotification(notificationId: string) {
    const response = await http.delete(`/notification/${notificationId}`);
    return response.data;
  }

  /**
   * Xóa tất cả thông báo của user
   */
  async deleteAllNotifications() {
    const response = await http.delete("/notifications");
    return response.data;
  }

  // ===== ADMIN APIS =====

  /**
   * Admin: Lấy tất cả thông báo
   */
  async adminGetAllNotifications(
    page: number = 1,
    limit: number = 20,
    filters?: {
      type?: string;
      read?: boolean;
      userId?: string;
      search?: string;
    }
  ) {
    const response = await http.get("/admin/notifications", {
      params: { page, limit, ...filters },
    });
    return response.data;
  }

  /**
   * Admin: Lấy thống kê thông báo
   */
  async adminGetNotificationStats() {
    const response = await http.get("/admin/notifications/stats");
    return response.data;
  }

  /**
   * Admin: Tạo thông báo cho một user
   */
  async adminCreateNotification(data: CreateNotificationData) {
    const response = await http.post("/admin/notification", data);
    return response.data;
  }

  /**
   * Admin: Gửi thông báo hệ thống cho tất cả user
   */
  async adminSendSystemNotificationToAll(data: SystemNotificationData) {
    const response = await http.post("/admin/notification/system/all", data);
    return response.data;
  }

  /**
   * Admin: Gửi thông báo cho nhiều user (bulk)
   */
  async adminSendBulkNotifications(data: BulkNotificationData) {
    const response = await http.post("/admin/notification/bulk", data);
    return response.data;
  }

  /**
   * Admin: Xóa thông báo
   */
  async adminDeleteNotification(notificationId: string) {
    const response = await http.delete(`/admin/notification/${notificationId}`);
    return response.data;
  }
}

export default new NotificationService();
