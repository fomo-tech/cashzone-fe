import React, { useState, useMemo } from "react";
import {
  Send,
  Bell,
  Users,
  User,
  Clock,
  CheckCircle,
  List,
  Trash2,
  Edit,
  Search,
} from "lucide-react";

// Định nghĩa kiểu dữ liệu cho Thông báo
interface Notification {
  id: string;
  title: string;
  content: string;
  targetType: "General" | "Individual";
  targetUserId: string | null;
  status: "Sent" | "Scheduled" | "Draft";
  sentDate: string;
}

// Dữ liệu giả định các thông báo đã gửi
const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: "NOTI001",
    title: "Cập nhật điều khoản dịch vụ mới",
    content:
      "Vui lòng đọc kỹ các điều khoản dịch vụ có hiệu lực từ 01/01/2025.",
    targetType: "General",
    targetUserId: null,
    status: "Sent",
    sentDate: "2024-12-01 10:30",
  },
  {
    id: "NOTI002",
    title: "Thông báo duyệt Cashback thành công",
    content:
      "Giao dịch Cashback của bạn đã được duyệt và sẽ thanh toán trong vòng 24h.",
    targetType: "Individual",
    targetUserId: "USER001",
    status: "Sent",
    sentDate: "2024-12-05 09:15",
  },
  {
    id: "NOTI003",
    title: "Bảo trì hệ thống",
    content: "Hệ thống sẽ tạm ngưng hoạt động từ 23h - 01h sáng.",
    targetType: "General",
    targetUserId: null,
    status: "Scheduled",
    sentDate: "2024-12-10 23:00",
  },
];

const NotificationManagement: React.FC = () => {
  const [notifications, setNotifications] =
    useState<Notification[]>(MOCK_NOTIFICATIONS);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    targetType: "General", // 'General' or 'Individual'
    targetUserId: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [isSending, setIsSending] = useState(false);

  // Tính toán thống kê tổng quan
  const stats = useMemo(() => {
    const total = notifications.length;
    const sent = notifications.filter((n) => n.status === "Sent").length;
    const general = notifications.filter(
      (n) => n.targetType === "General"
    ).length;
    const individual = notifications.filter(
      (n) => n.targetType === "Individual"
    ).length;

    return { total, sent, general, individual };
  }, [notifications]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSendNotification = (e: React.FormEvent) => {
    e.preventDefault();

    // Giả lập trạng thái đang gửi
    setIsSending(true);

    // Dữ liệu thông báo mới
    const newNotification: Notification = {
      id: `NOTI${Date.now()}`,
      title: formData.title,
      content: formData.content,
      targetType: formData.targetType as "General" | "Individual",
      targetUserId:
        formData.targetType === "Individual"
          ? formData.targetUserId.trim()
          : null,
      status: "Sent", // Giả lập là gửi thành công ngay lập tức
      sentDate: new Date().toLocaleString("vi-VN", {
        dateStyle: "short",
        timeStyle: "short",
      }),
    };

    setTimeout(() => {
      // Cập nhật danh sách thông báo
      setNotifications([newNotification, ...notifications]);

      // Reset Form
      setFormData({
        title: "",
        content: "",
        targetType: "General",
        targetUserId: "",
      });

      setIsSending(false);
      console.log(`Đã gửi thông báo thành công: ${newNotification.title}`);
    }, 1500); // Giả lập độ trễ gửi 1.5 giây
  };

  const filteredNotifications = notifications.filter(
    (n) =>
      n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (n.targetUserId &&
        n.targetUserId.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Component Card Thống Kê
  const StatCard: React.FC<{
    icon: React.ReactNode;
    title: string;
    value: string | number;
    color: string;
  }> = ({ icon, title, value, color }) => (
    <div className="p-5 bg-white rounded-xl shadow-lg border border-slate-100 flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <p className={`text-2xl font-bold ${color} mt-1`}>{value}</p>
      </div>
      <div
        className={`flex items-center justify-center w-12 h-12 rounded-full ${color}/10`}
      >
        {React.cloneElement(icon as React.ReactElement, {
          className: `w-6 h-6 ${color}`,
        })}
      </div>
    </div>
  );

  const getTargetIcon = (type: Notification["targetType"]) => {
    if (type === "General") {
      return <Users className="w-4 h-4 text-purple-500" />;
    }
    return <User className="w-4 h-4 text-blue-500" />;
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-extrabold text-slate-800 flex items-center gap-3">
            <Bell className="w-8 h-8 text-purple-600" />
            Bảng Điều Khiển Thông Báo
          </h1>
        </div>

        {/* 1. Thống kê Tổng quan (Stats) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <StatCard
            icon={<List />}
            title="Tổng Số Thông Báo"
            value={stats.total}
            color="text-slate-600"
          />
          <StatCard
            icon={<CheckCircle />}
            title="Đã Gửi Thành Công"
            value={stats.sent}
            color="text-green-600"
          />
          <StatCard
            icon={<Users />}
            title="Thông báo Chung (All)"
            value={stats.general}
            color="text-purple-600"
          />
          <StatCard
            icon={<User />}
            title="Thông báo Riêng lẻ"
            value={stats.individual}
            color="text-blue-600"
          />
        </div>

        {/* 2. Form Gửi Thông Báo Mới */}
        <div className="bg-white rounded-xl shadow-lg border border-slate-100 p-6">
          <h2 className="text-xl font-bold text-slate-800 mb-4 border-b pb-2 flex items-center gap-2">
            <Send className="w-6 h-6 text-red-500" /> Gửi Thông Báo Mới
          </h2>

          <form onSubmit={handleSendNotification} className="space-y-4">
            {/* Tiêu đề */}
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-slate-700"
              >
                Tiêu đề (Ngắn gọn)
              </label>
              <input
                type="text"
                id="title"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                placeholder="Ví dụ: Quan trọng: Thay đổi chính sách thanh toán"
                className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
              />
            </div>

            {/* Nội dung */}
            <div>
              <label
                htmlFor="content"
                className="block text-sm font-medium text-slate-700"
              >
                Nội dung chi tiết
              </label>
              <textarea
                id="content"
                name="content"
                required
                value={formData.content}
                onChange={handleChange}
                rows={4}
                placeholder="Nhập nội dung đầy đủ của thông báo tại đây..."
                className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Loại đối tượng */}
              <div>
                <label
                  htmlFor="targetType"
                  className="block text-sm font-medium text-slate-700"
                >
                  Đối tượng nhận
                </label>
                <select
                  id="targetType"
                  name="targetType"
                  required
                  value={formData.targetType}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-slate-300 bg-white rounded-lg shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="General">Thông báo Chung (Tất cả User)</option>
                  <option value="Individual">
                    Thông báo Riêng lẻ (1 User)
                  </option>
                </select>
              </div>

              {/* ID User Cụ thể (Chỉ hiện khi chọn Riêng lẻ) */}
              {formData.targetType === "Individual" && (
                <div>
                  <label
                    htmlFor="targetUserId"
                    className="block text-sm font-medium text-slate-700"
                  >
                    ID Người Dùng Cụ thể
                  </label>
                  <input
                    type="text"
                    id="targetUserId"
                    name="targetUserId"
                    required
                    value={formData.targetUserId}
                    onChange={handleChange}
                    placeholder="Nhập ID người dùng (VD: USER001)"
                    className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
              )}
            </div>

            {/* Nút Gửi */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isSending}
                className={`w-full py-3 px-4 border border-transparent rounded-xl shadow-md text-base font-medium text-white transition duration-300 flex items-center justify-center gap-2
                  ${
                    isSending
                      ? "bg-slate-400 cursor-not-allowed"
                      : "bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                  }`}
              >
                {isSending ? (
                  <>
                    <Clock className="w-5 h-5 animate-spin" /> Đang Gửi...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" /> Gửi Thông Báo Ngay
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* 3. Lịch sử Thông báo đã Gửi */}
        <div className="bg-white rounded-xl shadow-lg border border-slate-100 p-6">
          <h2 className="text-xl font-bold text-slate-800 mb-4 border-b pb-2">
            Lịch Sử Thông Báo Đã Gửi
          </h2>

          <div className="relative mb-4">
            <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Tìm kiếm theo tiêu đề, nội dung hoặc ID người dùng..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-xl focus:ring-purple-500 focus:border-purple-500 text-slate-700"
            />
          </div>

          {/* Bảng dữ liệu */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Tiêu đề
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Đối tượng
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Ngày Gửi
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-100">
                {filteredNotifications.length > 0 ? (
                  filteredNotifications.map((n) => (
                    <tr
                      key={n.id}
                      className="hover:bg-purple-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-900">
                        {n.id}
                      </td>
                      <td className="px-6 py-4 max-w-sm text-sm text-slate-700 truncate">
                        {n.title}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm flex items-center gap-2 font-medium">
                        {getTargetIcon(n.targetType)}
                        {n.targetType === "General"
                          ? "Tất cả Users"
                          : n.targetUserId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span
                          className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            n.status === "Sent"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {n.status === "Sent" ? "Đã Gửi" : "Lên lịch"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                        {n.sentDate}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-center">
                        <div className="flex justify-center gap-2">
                          <button
                            title="Xem/Sửa chi tiết"
                            className="text-blue-600 hover:text-white hover:bg-blue-600 border border-blue-600 p-2 rounded-full transition duration-150"
                          >
                            <Edit className="w-5 h-5" />
                          </button>
                          <button
                            title="Xóa thông báo"
                            className="text-red-600 hover:text-white hover:bg-red-600 border border-red-600 p-2 rounded-full transition duration-150"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-500">
                      Không tìm thấy thông báo nào phù hợp.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationManagement;
