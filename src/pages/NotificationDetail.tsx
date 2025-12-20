import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, Loader } from "lucide-react";
import type { Notification } from "../services/notificationService";
import notificationService from "../services/notificationService";
import { notification as showNotification } from "../utils/notification";

const NotificationDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [notification, setNotification] = useState<Notification | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchNotificationDetail = async (notificationId: string) => {
    try {
      setIsLoading(true);
      const response = await notificationService.getUserNotifications(1, 100);
      const notif = response.data.notifications.find(
        (n: Notification) => n._id === notificationId
      );

      if (notif) {
        setNotification(notif);
        // Mark as read
        if (!notif.read) {
          await notificationService.markAsRead(notificationId);
        }
      } else {
        showNotification({
          message: "Không tìm thấy thông báo",
          type: "error",
        });
        navigate("/notifications");
      }
    } catch (error: any) {
      showNotification({
        message: error?.response?.data?.message || "Lỗi khi tải thông báo",
        type: "error",
      });
      navigate("/notifications");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchNotificationDetail(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const getTypeColor = (type: string) => {
    switch (type) {
      case "task_new":
        return "bg-blue-100 text-blue-800";
      case "task_reward":
        return "bg-green-100 text-green-800";
      case "referral":
        return "bg-purple-100 text-purple-800";
      case "system":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "task_new":
        return "Nhiệm vụ mới";
      case "task_reward":
        return "Phần thưởng";
      case "referral":
        return "Giới thiệu";
      case "system":
        return "Hệ thống";
      default:
        return type;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader className="w-8 h-8 animate-spin text-[#E91E63]" />
      </div>
    );
  }

  if (!notification) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate("/notifications")}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Quay lại danh sách thông báo</span>
        </button>

        {/* Notification Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="p-6 md:p-8 border-b border-gray-200">
            <div className="flex items-center gap-3 mb-3">
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(
                  notification.type
                )}`}
              >
                {getTypeLabel(notification.type)}
              </span>
              {notification.targetType === "broadcast" && (
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                  Thông báo chung
                </span>
              )}
              {notification.read ? (
                <span className="text-sm text-green-600">✓ Đã đọc</span>
              ) : (
                <span className="text-sm text-blue-600">● Chưa đọc</span>
              )}
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {notification.title}
            </h1>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Calendar className="w-4 h-4" />
              <span>
                {new Date(notification.createdAt).toLocaleDateString("vi-VN", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 md:p-8">
            {/* Image */}
            {notification.imageUrl && (
              <div className="mb-8">
                <img
                  src={notification.imageUrl}
                  alt={notification.title}
                  className="w-full h-auto rounded-xl shadow-lg"
                />
              </div>
            )}

            {/* Message */}
            {notification.message && (
              <div className="mb-8">
                <div className="prose prose-lg max-w-none">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap text-lg">
                    {notification.message}
                  </p>
                </div>
              </div>
            )}

            {/* Link */}
            {notification.link && (
              <div className="mb-6">
                <a
                  href={notification.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#E91E63] to-[#FF8C1A] text-white rounded-xl hover:shadow-lg transition-all font-medium"
                >
                  <span>Xem chi tiết</span>
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationDetail;
