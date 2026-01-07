import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  Check,
  Trash2,
  Filter,
  Loader,
  ExternalLink,
  Calendar,
} from "lucide-react";
import notificationService, {
  type Notification,
} from "@/services/notificationService";
import { notification as showNotification } from "@/utils/notification";

const NotificationPage: React.FC = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchNotifications();
    fetchUnreadCount();
  }, [currentPage]);

  const fetchNotifications = async () => {
    try {
      setIsLoading(true);
      const response = await notificationService.getUserNotifications(
        currentPage,
        20
      );
      setNotifications(response.data.notifications);
      setTotalPages(Math.ceil(response.data.total / 20));
    } catch (error: any) {
      showNotification({
        message: error?.response?.data?.message || "Lỗi khi tải thông báo",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const response = await notificationService.getUnreadCount();
      setUnreadCount(response.data.count);
    } catch (error) {
      console.error("Error fetching unread count:", error);
    }
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await notificationService.markAsRead(notificationId);
      setNotifications((prev) =>
        prev.map((n) => (n._id === notificationId ? { ...n, read: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
      showNotification({
        message: "Đã đánh dấu là đã đọc",
        type: "success",
      });
    } catch (error: any) {
      showNotification({
        message: error?.response?.data?.message || "Lỗi khi cập nhật",
        type: "error",
      });
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
      showNotification({
        message: "Đã đánh dấu tất cả là đã đọc",
        type: "success",
      });
    } catch (error: any) {
      showNotification({
        message: error?.response?.data?.message || "Lỗi khi cập nhật",
        type: "error",
      });
    }
  };

  const handleDelete = async (notificationId: string) => {
    if (!confirm("Bạn có chắc muốn xóa thông báo này?")) return;

    try {
      await notificationService.deleteNotification(notificationId);
      setNotifications((prev) => prev.filter((n) => n._id !== notificationId));
      showNotification({
        message: "Đã xóa thông báo",
        type: "success",
      });
    } catch (error: any) {
      showNotification({
        message: error?.response?.data?.message || "Lỗi khi xóa thông báo",
        type: "error",
      });
    }
  };

  const handleDeleteAll = async () => {
    if (!confirm("Bạn có chắc muốn xóa tất cả thông báo?")) return;

    try {
      await notificationService.deleteAllNotifications();
      setNotifications([]);
      setUnreadCount(0);
      showNotification({
        message: "Đã xóa tất cả thông báo",
        type: "success",
      });
    } catch (error: any) {
      showNotification({
        message: error?.response?.data?.message || "Lỗi khi xóa thông báo",
        type: "error",
      });
    }
  };

  const handleOpenDetail = (notif: Notification) => {
    navigate(`/notifications/${notif._id}`);
  };

  const filteredNotifications = notifications.filter((n) => {
    if (filter === "unread") return !n.read;
    if (filter === "read") return n.read;
    return true;
  });

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      task_new: "bg-blue-100 text-blue-800",
      task_reward: "bg-green-100 text-green-800",
      referral: "bg-purple-100 text-purple-800",
      system: "bg-orange-100 text-orange-800",
    };
    return colors[type] || "bg-gray-100 text-gray-800";
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      task_new: "Task mới",
      task_reward: "Phần thưởng",
      referral: "Giới thiệu",
      system: "Hệ thống",
    };
    return labels[type] || type;
  };

  if (isLoading && notifications.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="w-8 h-8 animate-spin text-[orange-600]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-3 sm:py-4 md:py-6 px-3 sm:px-4 md:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl border border-pink-100 p-4 sm:p-5 md:p-6 mb-4 sm:mb-5 md:mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="p-2.5 sm:p-3 bg-gradient-to-br from-orange-500 via-orange-600 to-amber-600 rounded-xl sm:rounded-2xl shadow-lg">
                <Bell className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-black bg-gradient-to-br from-orange-500 via-orange-600 to-amber-600 bg-clip-text text-transparent">
                  Thông Báo
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5 sm:mt-1">
                  {unreadCount > 0
                    ? `Bạn có ${unreadCount} thông báo chưa đọc`
                    : "Tất cả thông báo đã được đọc"}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 bg-green-50 text-green-700 rounded-lg sm:rounded-xl hover:bg-green-100 transition-colors text-xs sm:text-sm font-medium"
                >
                  <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span className="hidden xs:inline">Đánh dấu</span>
                  <span className="xs:hidden">Đọc hết</span>
                </button>
              )}
              {/* {notifications.length > 0 && (
                <button
                  onClick={handleDeleteAll}
                  className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 rounded-xl hover:bg-red-100 transition-colors text-sm font-medium"
                >
                  <Trash2 className="w-4 h-4" />
                  Xóa tất cả
                </button>
              )} */}
            </div>
          </div>

          {/* Filter */}
          <div className="flex gap-1.5 sm:gap-2 mt-3 sm:mt-4 border-t border-slate-100 pt-3 sm:pt-4 overflow-x-auto pb-1">
            <button
              onClick={() => setFilter("all")}
              className={`cursor-pointer flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
                filter === "all"
                  ? "bg-gradient-to-br from-orange-500 via-orange-600 to-amber-600 text-white shadow-md"
                  : "bg-slate-50 text-slate-600 hover:bg-slate-100"
              }`}
            >
              <Filter className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden xs:inline">
                Tất cả ({notifications.length})
              </span>
              <span className="xs:hidden">Tất cả</span>
            </button>
            <button
              onClick={() => setFilter("unread")}
              className={`cursor-pointer flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
                filter === "unread"
                  ? "bg-gradient-to-br from-orange-500 via-orange-600 to-amber-600 text-white shadow-md"
                  : "bg-slate-50 text-slate-600 hover:bg-slate-100"
              }`}
            >
              <span className="hidden xs:inline">Chưa đọc ({unreadCount})</span>
              <span className="xs:hidden">Chưa đọc</span>
            </button>
            <button
              onClick={() => setFilter("read")}
              className={`cursor-pointer flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
                filter === "read"
                  ? "bg-gradient-to-br from-orange-500 via-orange-600 to-amber-600 text-white shadow-md"
                  : "bg-slate-50 text-slate-600 hover:bg-slate-100"
              }`}
            >
              <span className="hidden xs:inline">
                Đã đọc ({notifications.length - unreadCount})
              </span>
              <span className="xs:hidden">Đã đọc</span>
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-2 sm:space-y-3">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((notif) => (
              <div
                key={notif._id}
                onClick={() => handleOpenDetail(notif)}
                className={`bg-white rounded-xl sm:rounded-2xl shadow-lg border transition-all duration-300 hover:shadow-xl cursor-pointer active:scale-[0.98] ${
                  !notif.read
                    ? "border-[orange-600]/30 bg-gradient-to-r from-pink-50/50 to-white"
                    : "border-slate-100"
                }`}
              >
                <div className="p-3 sm:p-4 md:p-5">
                  <div className="flex items-start gap-3 sm:gap-4">
                    {/* Icon/Image */}
                    <div className="flex-shrink-0">
                      {notif.imageUrl ? (
                        <img
                          src={notif.imageUrl}
                          alt="notification"
                          className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-lg sm:rounded-xl object-cover border-2 border-slate-100"
                        />
                      ) : (
                        <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-br from-[orange-600]/10 to-[#FF8C1A]/10 rounded-lg sm:rounded-xl flex items-center justify-center">
                          <Bell className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-[orange-600]" />
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 sm:gap-3 md:gap-4 mb-1.5 sm:mb-2">
                        <div className="flex items-center gap-1.5 sm:gap-2 flex-1 min-w-0">
                          <h3 className="text-sm sm:text-base md:text-lg font-bold text-slate-800 truncate">
                            {notif.title}
                          </h3>
                          {!notif.read && (
                            <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[orange-600] rounded-full flex-shrink-0"></span>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
                          {notif.targetType === "broadcast" && (
                            <span className="hidden sm:inline-block px-2 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium bg-orange-100 text-orange-600">
                              Chung
                            </span>
                          )}
                          <span
                            className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium ${getTypeColor(
                              notif.type
                            )}`}
                          >
                            {getTypeLabel(notif.type)}
                          </span>
                        </div>
                      </div>

                      {notif.message && (
                        <p className="text-slate-600 text-xs sm:text-sm mb-2 sm:mb-3 line-clamp-2">
                          {notif.message}
                        </p>
                      )}

                      <div className="flex flex-col xs:flex-row xs:items-center gap-2 xs:gap-4 text-[10px] xs:text-xs text-slate-400">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span className="truncate">
                            {new Date(notif.createdAt).toLocaleString("vi-VN")}
                          </span>
                        </div>
                        {notif.link && (
                          <span className="flex items-center gap-1 text-[orange-600]">
                            <ExternalLink className="w-3 h-3" />
                            <span className="whitespace-nowrap">
                              Xem chi tiết
                            </span>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    {/* <div
                      className="flex flex-col gap-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {!notif.read && (
                        <button
                          onClick={() => handleMarkAsRead(notif._id)}
                          title="Đánh dấu đã đọc"
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        >
                          <Check className="w-5 h-5" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(notif._id)}
                        title="Xóa"
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div> */}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-slate-100 p-8 sm:p-10 md:p-12 text-center">
              <Bell className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 text-slate-300 mx-auto mb-3 sm:mb-4" />
              <p className="text-slate-500 text-sm sm:text-base md:text-lg">
                {filter === "unread"
                  ? "Không có thông báo chưa đọc"
                  : filter === "read"
                  ? "Không có thông báo đã đọc"
                  : "Bạn chưa có thông báo nào"}
              </p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 sm:gap-3 mt-4 sm:mt-5 md:mt-6">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 sm:px-4 py-2 bg-white border border-slate-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 text-xs sm:text-sm font-medium transition-colors"
            >
              <span className="hidden xs:inline">Trang trước</span>
              <span className="xs:hidden">Trước</span>
            </button>
            <span className="px-2 sm:px-4 py-2 text-xs sm:text-sm font-medium text-slate-600 whitespace-nowrap">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 sm:px-4 py-2 bg-white border border-slate-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 text-xs sm:text-sm font-medium transition-colors"
            >
              <span className="hidden xs:inline">Trang sau</span>
              <span className="xs:hidden">Sau</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationPage;
