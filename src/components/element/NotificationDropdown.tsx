import { useState, useRef, useEffect } from "react";
import {
  Bell,
  CheckCheck,
  DollarSign,
  Shield,
  Gift,
  AlertTriangle,
  CheckCircle,
  Settings,
} from "lucide-react";

interface NotificationItem {
  id: string;
  title: string;
  time: string;
  unread?: boolean;
  type: "money" | "security" | "system" | "error" | "success" | "update";
}

const mockNotifications: NotificationItem[] = [
  {
    id: "1",
    title: "Bạn nhận được 50.000đ từ nhiệm vụ",
    time: "2 phút trước",
    unread: true,
    type: "money",
  },
  {
    id: "2",
    title: "Tài khoản đăng nhập lúc 12:30",
    time: "1 giờ trước",
    unread: false,
    type: "security",
  },
  {
    id: "3",
    title: "Cập nhật tính năng mới",
    time: "Hôm qua",
    unread: false,
    type: "update",
  },
  {
    id: "4",
    title: "Có lỗi khi xử lý giao dịch",
    time: "Hôm qua",
    unread: true,
    type: "error",
  },
  {
    id: "5",
    title: "Yêu cầu rút tiền mới đã được duyệt",
    time: "2 ngày trước",
    unread: false,
    type: "success",
  },
  {
    id: "6",
    title: "Thông báo bảo trì hệ thống",
    time: "1 tuần trước",
    unread: false,
    type: "system",
  },
];

const NotificationDropdown = () => {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<NotificationItem[]>(mockNotifications);

  const ref = useRef<HTMLDivElement>(null);

  // Đóng khi bấm ra ngoài
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      // Sử dụng ref.current để kiểm tra xem click có nằm ngoài component hay không
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const unreadCount = items.filter((i) => i.unread).length;

  // Function to get icon based on notification type
  const getNotificationIcon = (type: NotificationItem["type"]) => {
    const iconClass = "w-5 h-5 shrink-0";

    switch (type) {
      case "money":
        return <DollarSign className={`${iconClass} text-green-600`} />;
      case "security":
        return <Shield className={`${iconClass} text-blue-600`} />;
      case "system":
        return <Settings className={`${iconClass} text-gray-600`} />;
      case "error":
        return <AlertTriangle className={`${iconClass} text-red-600`} />;
      case "success":
        return <CheckCircle className={`${iconClass} text-green-600`} />;
      case "update":
        return <Gift className={`${iconClass} text-purple-600`} />;
      default:
        return <Bell className={`${iconClass} text-gray-600`} />;
    }
  };

  const markAllRead = () => {
    setItems((prev) => prev.map((i) => ({ ...i, unread: false })));
  };

  const handleItemClick = (id: string) => {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, unread: false } : i))
    );
    // Có thể thêm logic điều hướng hoặc mở chi tiết tại đây
  };

  return (
    <div className="relative" ref={ref}>
      {/* Nút chuông (Thiết kế đẹp hơn) */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="relative text-white bg-green-600 hover:bg-green-700 p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-green-300 "
        aria-label="Thông báo"
      >
        <Bell className="size-4" strokeWidth={2} />

        {unreadCount > 0 && (
          // Badge hiển thị số lượng chưa đọc
          <span className="absolute top-0 right-0 h-5 w-5 rounded-full ring-2 ring-white bg-red-500 flex items-center justify-center text-xs font-bold text-white transform translate-x-1/4 -translate-y-1/4">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown (Thiết kế đẹp hơn) */}
      {open && (
        <div
          className="absolute right-0 mt-4 w-80 sm:w-96 bg-white shadow-2xl rounded-xl border border-gray-200 z-50 transition-transform duration-300"
          style={{ transformOrigin: "top right" }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h3 className="text-lg font-bold text-slate-800 flex items-center">
              Thông báo ({items.length})
              {unreadCount > 0 && (
                <span className="ml-2 px-2 py-0.5 bg-red-100 text-red-600 rounded-full text-xs font-medium">
                  {unreadCount} chưa đọc
                </span>
              )}
            </h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition duration-150 flex items-center space-x-1"
              >
                <CheckCheck className="w-4 h-4" />
                <span>Đánh dấu đã đọc</span>
              </button>
            )}
          </div>

          {/* Body - Danh sách thông báo */}
          <div className="max-h-96 overflow-y-auto divide-y divide-gray-50">
            {items.length === 0 ? (
              <div className="p-6 text-center text-sm text-slate-500">
                Không có thông báo mới
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleItemClick(item.id)}
                  className={`px-5 py-4 cursor-pointer transition-colors duration-150 border-l-4 ${
                    item.unread
                      ? "bg-green-50 hover:bg-green-100 border-green-500" // Chưa đọc: nền nhẹ, viền xanh
                      : "bg-white hover:bg-gray-50 border-transparent" // Đã đọc: nền trắng, không viền
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    {/* Icon cho loại thông báo */}
                    <div className="mt-0.5">
                      {getNotificationIcon(item.type)}
                    </div>

                    {/* Nội dung thông báo */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p
                          className={`text-sm font-medium ${
                            item.unread ? "text-green-900" : "text-slate-800"
                          }`}
                        >
                          {item.title}
                        </p>
                        {item.unread && (
                          <div
                            className="h-2 w-2 rounded-full bg-red-500 shrink-0 ml-2"
                            title="Chưa đọc"
                          />
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-1">{item.time}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-gray-100 text-center">
            <button className="text-sm text-green-600 font-medium hover:text-green-700">
              Xem tất cả thông báo
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
