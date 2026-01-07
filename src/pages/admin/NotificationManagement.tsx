import React, { useState, useEffect } from "react";
import {
  Send,
  Bell,
  Users,
  User,
  Clock,
  CheckCircle,
  List,
  Trash2,
  Search,
  Upload,
  X,
  Image as ImageIcon,
  Loader,
} from "lucide-react";
import notificationService, {
  type Notification,
  type NotificationStats,
} from "@/services/notificationService";
import uploadService from "@/services/uploadService";
import { notification } from "@/utils/notification";

const NotificationManagement: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [stats, setStats] = useState<NotificationStats>({
    total: 0,
    unread: 0,
    byType: {},
  });
  const [formData, setFormData] = useState({
    title: "",
    message: "",
    type: "system" as "task_new" | "task_reward" | "referral" | "system",
    targetType: "all", // 'all' or 'individual'
    userId: "",
    link: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch notifications and stats
  useEffect(() => {
    fetchData();
  }, [currentPage, searchTerm]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [notifData, statsData] = await Promise.all([
        notificationService.adminGetAllNotifications(currentPage, 20, {
          search: searchTerm || undefined,
        }),
        notificationService.adminGetNotificationStats(),
      ]);

      setNotifications(notifData.data.notifications);
      setTotalPages(Math.ceil(notifData.data.total / 20));
      setStats(statsData.data);
    } catch (error: any) {
      notification({
        message: error?.response?.data?.message || "Lỗi khi tải dữ liệu",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview("");
  };

  const handleSendNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);

    try {
      let imageUrl = "";

      // Upload image if exists
      if (imageFile) {
        const uploadResult = await uploadService.uploadImage(imageFile);
        imageUrl = uploadResult.data.url;
      }

      // Send notification based on target type
      if (formData.targetType === "all") {
        await notificationService.adminSendSystemNotificationToAll({
          title: formData.title,
          message: formData.message,
          link: formData.link || undefined,
          imageUrl: imageUrl || undefined,
        });
      } else if (formData.userId) {
        await notificationService.adminCreateNotification({
          userId: formData.userId,
          type: formData.type,
          title: formData.title,
          message: formData.message,
          link: formData.link || undefined,
          imageUrl: imageUrl || undefined,
        });
      } else {
        throw new Error("Vui lòng nhập User ID cho thông báo cá nhân");
      }

      notification({
        message: "Gửi thông báo thành công!",
        type: "success",
      });

      // Reset form
      setFormData({
        title: "",
        message: "",
        type: "system",
        targetType: "all",
        userId: "",
        link: "",
      });
      handleRemoveImage();

      // Refresh data
      fetchData();
    } catch (error: any) {
      notification({
        message:
          error?.response?.data?.message ||
          error?.message ||
          "Lỗi khi gửi thông báo",
        type: "error",
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleDeleteNotification = async (notificationId: string) => {
    if (!confirm("Bạn có chắc muốn xóa thông báo này?")) return;

    try {
      await notificationService.adminDeleteNotification(notificationId);
      notification({
        message: "Xóa thông báo thành công!",
        type: "success",
      });
      fetchData();
    } catch (error: any) {
      notification({
        message: error?.response?.data?.message || "Lỗi khi xóa thông báo",
        type: "error",
      });
    }
  };

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

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      task_new: "Task mới",
      task_reward: "Reward",
      referral: "Referral",
      system: "Hệ thống",
    };
    return labels[type] || type;
  };

  const getUserDisplay = (userId: any) => {
    if (typeof userId === "string") return userId;
    if (userId?.username) return userId.username;
    if (userId?.email) return userId.email;
    return "N/A";
  };

  if (isLoading && notifications.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="w-8 h-8 animate-spin text-[orange-600]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-4">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-extrabold text-slate-800 flex items-center gap-3">
            <Bell className="w-8 h-8 text-[orange-600]" />
            Quản Lý Thông Báo
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
            title="Chưa Đọc"
            value={stats.unread}
            color="text-[orange-600]"
          />
          <StatCard
            icon={<Bell />}
            title="Thông Báo Hệ Thống"
            value={stats.byType.system || 0}
            color="text-blue-600"
          />
          <StatCard
            icon={<Users />}
            title="Task/Reward"
            value={
              (stats.byType.task_new || 0) + (stats.byType.task_reward || 0)
            }
            color="text-green-600"
          />
        </div>

        {/* 2. Form Gửi Thông Báo Mới */}
        <div className="bg-white rounded-xl shadow-lg border border-slate-100 p-6">
          <h2 className="text-xl font-bold text-slate-800 mb-4 border-b pb-2 flex items-center gap-2">
            <Send className="w-6 h-6 text-[orange-600]" /> Gửi Thông Báo Mới
          </h2>

          <form onSubmit={handleSendNotification} className="space-y-4">
            {/* Tiêu đề */}
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                Tiêu đề <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                placeholder="Ví dụ: Thông báo quan trọng"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[orange-600] focus:border-transparent"
              />
            </div>

            {/* Nội dung */}
            <div>
              <label
                htmlFor="message"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                Nội dung chi tiết <span className="text-red-500">*</span>
              </label>
              <textarea
                id="message"
                name="message"
                required
                value={formData.message}
                onChange={handleChange}
                rows={4}
                placeholder="Nhập nội dung đầy đủ của thông báo..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[orange-600] focus:border-transparent resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Loại thông báo */}
              <div>
                <label
                  htmlFor="type"
                  className="block text-sm font-medium text-slate-700 mb-1"
                >
                  Loại thông báo
                </label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-300 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[orange-600] focus:border-transparent"
                >
                  <option value="system">Hệ thống</option>
                  <option value="task_new">Task mới</option>
                  <option value="task_reward">Reward</option>
                  <option value="referral">Referral</option>
                </select>
              </div>

              {/* Đối tượng nhận */}
              <div>
                <label
                  htmlFor="targetType"
                  className="block text-sm font-medium text-slate-700 mb-1"
                >
                  Đối tượng nhận <span className="text-red-500">*</span>
                </label>
                <select
                  id="targetType"
                  name="targetType"
                  value={formData.targetType}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-300 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[orange-600] focus:border-transparent"
                >
                  <option value="all">Tất cả User</option>
                  <option value="individual">User cụ thể</option>
                </select>
              </div>
            </div>

            {/* User ID (nếu gửi cho cá nhân) */}
            {formData.targetType === "individual" && (
              <div>
                <label
                  htmlFor="userId"
                  className="block text-sm font-medium text-slate-700 mb-1"
                >
                  User ID <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="userId"
                  name="userId"
                  required
                  value={formData.userId}
                  onChange={handleChange}
                  placeholder="Nhập User ID"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[orange-600] focus:border-transparent"
                />
              </div>
            )}

            {/* Link (optional) */}
            <div>
              <label
                htmlFor="link"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                Link (tùy chọn)
              </label>
              <input
                type="text"
                id="link"
                name="link"
                value={formData.link}
                onChange={handleChange}
                placeholder="https://..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[orange-600] focus:border-transparent"
              />
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Hình ảnh (tùy chọn)
              </label>
              {!imagePreview ? (
                <label
                  htmlFor="image-upload"
                  className="flex items-center justify-center w-full h-32 px-4 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:border-[orange-600] hover:bg-pink-50 transition-colors"
                >
                  <div className="text-center">
                    <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                    <p className="text-sm text-slate-500">
                      Click để tải ảnh lên
                    </p>
                  </div>
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              ) : (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
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
                      : "bg-gradient-to-br from-orange-500 via-orange-600 to-amber-600 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[orange-600]/50"
                  }`}
              >
                {isSending ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" /> Đang Gửi...
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
              placeholder="Tìm kiếm theo tiêu đề..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-xl focus:ring-[orange-600] focus:border-[orange-600] text-slate-700"
            />
          </div>

          {/* Bảng dữ liệu */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Tiêu đề
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Loại
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Ngày tạo
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Hình ảnh
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-100">
                {notifications.length > 0 ? (
                  notifications.map((n) => (
                    <tr
                      key={n._id}
                      className="hover:bg-gradient-to-r from-pink-50 to-orange-50 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm text-slate-700 max-w-xs truncate">
                        <div className="font-semibold">{n.title}</div>
                        {n.message && (
                          <div className="text-xs text-slate-500 truncate mt-1">
                            {n.message}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                          {getTypeLabel(n.type)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                        {getUserDisplay(n.userId)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span
                          className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            n.read
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {n.read ? "Đã đọc" : "Chưa đọc"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                        {new Date(n.createdAt).toLocaleString("vi-VN")}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        {n.imageUrl ? (
                          <div className="flex justify-center">
                            <img
                              src={n.imageUrl}
                              alt="notification"
                              className="w-12 h-12 object-cover rounded-lg border border-slate-200"
                            />
                          </div>
                        ) : (
                          <span className="text-slate-400 text-xs">
                            Không có
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-center">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => handleDeleteNotification(n._id)}
                            title="Xóa thông báo"
                            className="text-red-600 hover:text-white hover:bg-red-600 border border-red-600 p-2 rounded-full transition duration-150"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-slate-500">
                      {isLoading ? (
                        <Loader className="w-6 h-6 animate-spin mx-auto" />
                      ) : (
                        "Không tìm thấy thông báo nào."
                      )}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-4">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-slate-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
              >
                Trước
              </button>
              <span className="px-4 py-2">
                Trang {currentPage} / {totalPages}
              </span>
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                className="px-4 py-2 border border-slate-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
              >
                Sau
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationManagement;
