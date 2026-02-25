import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  CheckCheck,
  DollarSign,
  Gift,
  CheckCircle,
  Settings,
  Clock,
  Sparkles,
  Loader2,
} from "lucide-react";
import notificationService, {
  type Notification,
} from "@/services/notificationService";

const NotificationDropdown = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const ref = useRef<HTMLDivElement>(null);

  // Fetch notifications when dropdown opens
  useEffect(() => {
    if (open) {
      fetchNotifications();
    }
  }, [open]);

  // Fetch unread count on mount
  useEffect(() => {
    fetchUnreadCount();
  }, []);

  // Listen for socket events to refetch notifications
  useEffect(() => {
    const handleNewNotification = () => {
      fetchNotifications();
      fetchUnreadCount();
    };

    const handleBroadcastNotification = () => {
      fetchNotifications();
      fetchUnreadCount();
    };

    const handleUnreadCountUpdate = (event: any) => {
      const count = event.detail;
      setUnreadCount(count);
    };

    window.addEventListener("notification:new", handleNewNotification);
    window.addEventListener(
      "notification:broadcast",
      handleBroadcastNotification,
    );
    window.addEventListener(
      "notification:unread-count",
      handleUnreadCountUpdate,
    );

    return () => {
      window.removeEventListener("notification:new", handleNewNotification);
      window.removeEventListener(
        "notification:broadcast",
        handleBroadcastNotification,
      );
      window.removeEventListener(
        "notification:unread-count",
        handleUnreadCountUpdate,
      );
    };
  }, []);

  const fetchNotifications = async () => {
    try {
      setIsLoading(true);
      const response = await notificationService.getUserNotifications(1, 5);
      setItems(response.data.notifications);
    } catch (error) {
      console.error("Error fetching notifications:", error);
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

  // Đóng khi bấm ra ngoài
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Format time helper
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "Vừa xong";
    if (minutes < 60) return `${minutes} phút trước`;
    if (hours < 24) return `${hours} giờ trước`;
    if (days < 7) return `${days} ngày trước`;
    return date.toLocaleDateString("vi-VN");
  };

  // Function to get icon based on notification type with gradient background
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "task_reward":
        return (
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center shadow-lg">
            <DollarSign className="w-5 h-5 text-white" strokeWidth={2.5} />
          </div>
        );
      case "referral":
        return (
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-indigo-600 flex items-center justify-center shadow-lg">
            <Gift className="w-5 h-5 text-white" strokeWidth={2.5} />
          </div>
        );
      case "task_new":
        return (
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-cyan-600 flex items-center justify-center shadow-lg">
            <CheckCircle className="w-5 h-5 text-white" strokeWidth={2.5} />
          </div>
        );
      case "system":
        return (
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-red-600 flex items-center justify-center shadow-lg">
            <Settings className="w-5 h-5 text-white" strokeWidth={2.5} />
          </div>
        );
      default:
        return (
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-400 to-slate-600 flex items-center justify-center shadow-lg">
            <Bell className="w-5 h-5 text-white" strokeWidth={2.5} />
          </div>
        );
    }
  };

  const markAllRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setItems((prev) => prev.map((i) => ({ ...i, read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error("Error marking all as read:", error);
    }
  };

  const handleItemClick = (id: string) => {
    navigate(`/notifications/${id}`);
    setOpen(false);
  };

  const handleViewAll = () => {
    navigate("/notifications");
    setOpen(false);
  };

  return (
    <div className="relative" ref={ref}>
      {/* Nút chuông với animation */}
      <button
        onClick={() => setOpen((v) => !v)}
        className={`relative group text-white bg-gradient-to-br from-orange-500 via-orange-600 to-amber-600 hover:from-orange-600 hover:to-amber-700 p-2 rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-pink-300/50 transform hover:scale-110 ${
          open ? "scale-110 ring-4 ring-orange-300/50" : ""
        }`}
        aria-label="Thông báo"
      >
        <Bell
          className={`size-4 transition-all duration-300 ${
            open ? "animate-wiggle" : ""
          }`}
          strokeWidth={2}
        />

        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full ring-2 ring-white bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center text-xs font-bold text-white shadow-lg animate-pulse">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}

        {/* Ripple effect */}
        {unreadCount > 0 && (
          <span className="absolute inset-0 rounded-full bg-red-400 opacity-75 animate-ping"></span>
        )}
      </button>

      {/* Dropdown với animation */}
      {open && (
        <>
          {/* Backdrop blur */}
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />

          <div
            className="fixed sm:absolute right-2 sm:right-0 left-2 sm:left-auto top-16 sm:top-auto sm:mt-4 sm:w-[420px] bg-white/95 backdrop-blur-xl shadow-2xl rounded-2xl border border-gray-200/50 z-50 overflow-hidden animate-in slide-in-from-top-2 duration-300"
            style={{ transformOrigin: "top right" }}
          >
            {/* Header với gradient */}
            <div className="relative px-4 sm:px-5 py-3 sm:py-4 border-b border-gray-100/50 bg-gradient-to-r from-pink-50/50 to-orange-50/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-gradient-to-br from-orange-500 via-orange-600 to-amber-600 rounded-xl shadow-lg">
                    <Bell className="w-4 h-4 text-white" strokeWidth={2} />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold bg-gradient-to-br from-orange-500 via-orange-600 to-amber-600 bg-clip-text text-transparent">
                      Thông báo
                    </h3>
                    <p className="text-xs text-slate-500">
                      {items.length} tin nhắn
                      {unreadCount > 0 && ` • ${unreadCount} chưa đọc`}
                    </p>
                  </div>
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    className="group flex items-center gap-1.5 px-2 sm:px-3 py-1.5 text-xs font-semibold text-[orange-600] hover:text-white hover:bg-gradient-to-r hover:from-[orange-600] hover:to-[#FF8C1A] rounded-lg transition-all duration-200 hover:shadow-lg"
                  >
                    <CheckCheck className="w-3.5 h-3.5" strokeWidth={2.5} />
                    <span className="hidden sm:inline">Đọc hết</span>
                  </button>
                )}
              </div>
            </div>

            {/* Body - Danh sách thông báo với custom scrollbar */}
            <div className="max-h-[50vh] sm:max-h-[420px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent hover:scrollbar-thumb-gray-400">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-12 px-6">
                  <Loader2 className="w-8 h-8 text-[orange-600] animate-spin mb-3" />
                  <p className="text-sm text-slate-500 font-bold">
                    Đang tải thông báo...
                  </p>
                </div>
              ) : items.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 px-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-slate-200 rounded-full flex items-center justify-center mb-4">
                    <Bell className="w-8 h-8 text-gray-400" strokeWidth={1.5} />
                  </div>
                  <p className="text-sm text-slate-600 font-bold mb-1">
                    Chưa có thông báo
                  </p>
                  <p className="text-xs text-slate-400">
                    Các thông báo mới sẽ hiện ở đây
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100/50">
                  {items.map((item, index) => (
                    <div
                      key={item._id}
                      onClick={() => handleItemClick(item._id)}
                      className={`group relative px-3 sm:px-5 py-3 sm:py-4 cursor-pointer transition-all duration-200 hover:bg-gradient-to-r hover:from-pink-50/50 hover:to-orange-50/50 ${
                        !item.read ? "bg-pink-50/30" : "bg-white"
                      }`}
                      style={{
                        animationDelay: `${index * 50}ms`,
                      }}
                    >
                      {/* Unread indicator bar */}
                      {!item.read && (
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-orange-500 via-orange-600 to-amber-600" />
                      )}

                      <div className="flex items-start gap-3">
                        {/* Icon với animation */}
                        <div className="relative shrink-0 group-hover:scale-110 transition-transform duration-200">
                          {getNotificationIcon(item.type)}
                          {!item.read && (
                            <span className="absolute -top-1 -right-1 h-2.5 w-2.5 sm:h-3 sm:w-3 bg-red-500 rounded-full border-2 border-white animate-pulse" />
                          )}
                        </div>

                        {/* Nội dung thông báo */}
                        <div className="flex-1 min-w-0 pr-6 sm:pr-8">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <h4
                              className={`text-sm font-semibold leading-snug line-clamp-2 ${
                                !item.read ? "text-slate-900" : "text-slate-700"
                              }`}
                            >
                              {item.title}
                            </h4>
                            {!item.read && (
                              <span className="shrink-0 w-2 h-2 bg-gradient-to-br from-red-500 to-pink-600 rounded-full shadow-sm" />
                            )}
                          </div>

                          {item.message && (
                            <p className="text-xs text-slate-500 line-clamp-2 mb-2 leading-relaxed">
                              {item.message}
                            </p>
                          )}

                          <div className="flex items-center gap-2 text-xs text-slate-400">
                            <Clock className="w-3 h-3" strokeWidth={2} />
                            <span>{formatTime(item.createdAt)}</span>
                            {item.targetType === "broadcast" && (
                              <>
                                <span>•</span>
                                <div className="flex items-center gap-1">
                                  <Sparkles className="w-3 h-3 text-orange-400" />
                                  <span className="text-orange-600 font-bold">
                                    Chung
                                  </span>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Hover arrow indicator */}
                      <div className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <svg
                          className="w-4 h-4 text-[orange-600]"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer với gradient button */}
            <div className="sticky bottom-0 bg-white/90 backdrop-blur-sm border-t border-gray-100/50 p-3">
              <button
                onClick={handleViewAll}
                className="w-full py-2.5 px-4 text-sm font-semibold text-white bg-gradient-to-br from-orange-500 via-orange-600 to-amber-600 hover:from-orange-600 hover:to-amber-700 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <span>Xem tất cả thông báo</span>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationDropdown;
