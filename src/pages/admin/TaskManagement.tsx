import React, { useState, useEffect, useCallback } from "react";
import {
  Plus,
  Search,
  RefreshCw,
  Edit,
  Trash2,
  Loader2,
  Target,
  DollarSign,
  CheckCircle,
  X,
  FileText,
  BarChart3,
  Smartphone,
  ToggleLeft,
  ImageIcon,
  List,
  User,
  Pause as PauseIcon,
} from "lucide-react";
import taskService from "@/services/taskService";
import type { Task, CreateTaskData } from "@/services/taskService";
import { notification } from "@/utils/notification";
import Pagination from "@/components/common/Pagination";
import PlatformSelect from "@/components/common/PlatformSelect";
import ConfirmModal from "@/components/modals/ConfirmModal";

const TaskManagement: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "active" | "inactive"
  >("all");
  const [page, setPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
  });

  const [formData, setFormData] = useState<CreateTaskData>({
    title: "",
    description: "",
    requirements: [],
    logoUrl: "",
    type: "survey",
    reward: 0,
    maxCompletions: 100,
    platform: "",
    status: "active",
  });

  // Fetch tasks
  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const filters: any = {
        page,
        limit: pageSize,
      };

      if (filterType !== "all") {
        filters.type = filterType;
      }

      if (filterStatus !== "all") {
        filters.status = filterStatus;
      }

      if (searchTerm) {
        filters.search = searchTerm;
      }

      const result = await taskService.getAllTasks(filters);
      setTasks(result.data || []);
      setTotalItems(result.pagination?.total || 0);
    } catch (err) {
      console.error("Error fetching tasks:", err);
      notification({
        message: "Không thể tải danh sách nhiệm vụ",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  }, [filterType, filterStatus, searchTerm, page, pageSize]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleCreate = () => {
    setEditingTask(null);
    setFormData({
      title: "",
      description: "",
      requirements: [],
      logoUrl: "",
      type: "survey",
      reward: 0,
      maxCompletions: 100,
      platform: "",
      status: "active",
    });
    setIsModalOpen(true);
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    const processedRequirements = (task.requirements || []).map((req) => {
      if (typeof req === "string") {
        const parts = req.split(":", 2);
        return {
          title: parts[0] || "",
          description: parts[1] || "",
        };
      }
      return req;
    });

    setFormData({
      offerId: task.offerId,
      title: task.title,
      requirements: processedRequirements,
      logoUrl: task.logoUrl || "",
      description: task.description,
      type: task.type,
      reward: task.reward,
      maxCompletions: task.maxCompletions,
      platform: task.platform,
      status: task.status,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingTask) {
        await taskService.updateTask(editingTask._id, formData);
        notification({
          message: "Cập nhật nhiệm vụ thành công!",
          type: "success",
        });
      } else {
        await taskService.createTask(formData);
        notification({
          message: "Tạo nhiệm vụ thành công!",
          type: "success",
        });
      }

      setIsModalOpen(false);
      fetchTasks();
    } catch (error: any) {
      notification({
        message: error?.response?.data?.message || "Thao tác thất bại",
        type: "error",
      });
    }
  };

  const handleDelete = async (taskId: string) => {
    setConfirmModal({
      isOpen: true,
      title: "Xóa nhiệm vụ",
      message:
        "Bạn có chắc muốn xóa nhiệm vụ này? Hành động này không thể hoàn tác.",
      onConfirm: async () => {
        try {
          await taskService.deleteTask(taskId);
          notification({
            message: "Xóa nhiệm vụ thành công!",
            type: "success",
          });
          fetchTasks();
        } catch (error: any) {
          notification({
            message: error?.response?.data?.message || "Xóa thất bại",
            type: "error",
          });
        }
      },
    });
  };

  const handleStatusChange = async (
    taskId: string,
    newStatus: "active" | "inactive"
  ) => {
    try {
      await taskService.updateTask(taskId, { status: newStatus });
      notification({
        message: "Cập nhật trạng thái thành công!",
        type: "success",
      });
      fetchTasks();
    } catch (error: any) {
      notification({
        message: error?.response?.data?.message || "Cập nhật thất bại",
        type: "error",
      });
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      active:
        "bg-gradient-to-r from-orange-400/10 to-orange-1000/10 text-orange-500 border border-orange-500/30",
      inactive: "bg-gray-100 text-gray-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const getTaskTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      survey: "Khảo sát",
      app: "Cài app",
      registration: "Đăng ký",
      social: "Mạng xã hội",
      checkin: "Check-in",
      content: "Tạo nội dung",
      referral: "Giới thiệu",
    };
    return labels[type] || type;
  };

  const formatReward = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-secondary-light/20 p-4 sm:p-6">
      {/* Header - Primary Theme */}
      <div className="bg-primary-gradient rounded-2xl shadow-2xl shadow-primary/30 p-6 sm:p-8 mb-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-2 flex items-center">
              <div className="p-2 bg-white/20 rounded-xl mr-3">
                <Target className="w-8 h-8 text-white" />
              </div>
              Quản lý Nhiệm vụ
            </h1>
            <p className="text-white/90 text-base">
              Tạo và quản lý các nhiệm vụ cho người dùng
            </p>
            <div className="flex gap-4 mt-4">
              <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
                <p className="text-xs text-white/80">Tổng nhiệm vụ</p>
                <p className="text-2xl font-bold">{totalItems}</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
                <p className="text-xs text-white/80">Đang hoạt động</p>
                <p className="text-2xl font-bold">
                  {tasks.filter((t) => t.status === "active").length}
                </p>
              </div>
            </div>
          </div>
          <button
            onClick={handleCreate}
            className="flex items-center gap-2 px-6 py-3 bg-white text-primary rounded-xl hover:bg-gray-50 font-bold shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
          >
            <Plus size={20} />
            Tạo nhiệm vụ mới
          </button>
        </div>
      </div>

      {/* Filters - Professional Design */}
      <div className="bg-white p-6 rounded-2xl shadow-lg mb-6 border-2 border-primary/20">
        <h3 className="text-xl font-bold text-primary-dark mb-6 flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-xl">
            <Search size={20} className="text-primary" />
          </div>
          Bộ lọc & Tìm kiếm nâng cao
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Search */}
          <div className="lg:col-span-2">
            <label className="block text-sm font-semibold text-primary-dark mb-2">
              Tìm kiếm nhiệm vụ
            </label>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Tìm theo tiêu đề, mô tả..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all shadow-sm"
              />
            </div>
          </div>

          {/* Filter Type */}
          <div>
            <label className="block text-sm font-semibold text-primary-dark mb-2">
              Loại nhiệm vụ
            </label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary font-medium transition-all shadow-sm bg-white"
            >
              <option value="all">Tất cả loại</option>
              <option value="social">Mạng xã hội</option>
              <option value="app">Ứng dụng</option>
              <option value="registration">Đăng ký</option>
              <option value="survey">Khảo sát</option>
              <option value="checkin">Check-in</option>
              <option value="content">Nội dung</option>
              <option value="referral">Giới thiệu</option>
            </select>
          </div>

          {/* Filter Status */}
          <div>
            <label className="block text-sm font-semibold text-primary-dark mb-2">
              Trạng thái
            </label>
            <select
              value={filterStatus}
              onChange={(e) =>
                setFilterStatus(e.target.value as "all" | "active" | "inactive")
              }
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary font-medium transition-all shadow-sm bg-white"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="active">Đang hoạt động</option>
              <option value="paused">Tạm dừng</option>
              <option value="closed">Đã đóng</option>
            </select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 mt-6 pt-4 border-t border-gray-200">
          <button
            onClick={fetchTasks}
            className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl hover:bg-primary-dark font-semibold transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <RefreshCw size={18} />
            Làm mới
          </button>

          <button
            onClick={() => {
              setSearchTerm("");
              setFilterType("all");
              setFilterStatus("all");
              setPage(1);
            }}
            className="flex items-center gap-2 px-5 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 font-medium transition-all"
          >
            <X size={18} />
            Xóa bộ lọc
          </button>
        </div>

        <button
          onClick={fetchTasks}
          className="mt-4 flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl hover:bg-primary-dark font-semibold transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          <RefreshCw size={18} />
          Làm mới dữ liệu
        </button>
      </div>

      {/* Tasks Table */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl shadow-lg">
          <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
          <p className="text-gray-600 font-semibold">Đang tải dữ liệu...</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-orange-500">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-orange-400/10 to-orange-1000/10 border-b-2 border-orange-500/20">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-orange-500 uppercase tracking-wide">
                    Tiêu đề
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-orange-500 uppercase tracking-wide">
                    Logo
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-orange-500 uppercase tracking-wide">
                    Loại
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-orange-500 uppercase tracking-wide">
                    Phần thưởng
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-orange-500 uppercase tracking-wide">
                    Tiến độ
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-orange-500 uppercase tracking-wide">
                    Trạng thái
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-orange-500 uppercase tracking-wide">
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {tasks.map((task) => (
                  <tr
                    key={task._id}
                    className="hover:bg-gradient-to-r hover:from-orange-50 hover:to-orange-100 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900 line-clamp-1">
                        {task.title}
                      </div>
                      <div className="text-xs text-gray-500 line-clamp-1">
                        {task.description}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center">
                        {task.logoUrl ? (
                          <img
                            src={task.logoUrl}
                            alt={`${task.title} logo`}
                            className="w-10 h-10 rounded-lg object-cover border-2 border-gray-200"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src =
                                "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiM5Y2E5YjAiIHN0cm9rZS13aWR0aD0iMS41Ij48cGF0aCBkPSJtMjEgMTYtNC04LTQgOCIvPjxwYXRoIGQ9Im0zIDEyaDEwLjUiLz48cGF0aCBkPSJtMTMgMTYgNCA4IDQtOCIvPjwvc3ZnPg==";
                            }}
                          />
                        ) : (
                          <div className="w-10 h-10 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center border-2 border-gray-200">
                            <Target className="w-5 h-5 text-gray-400" />
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-orange-400/10 to-orange-1000/10 text-orange-500 border border-orange-500/30">
                        {getTaskTypeLabel(task.type)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-base font-bold text-orange-500">
                        {formatReward(task.reward)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-xs font-semibold text-gray-700">
                        {task.completedCount}/
                        {task.maxCompletions || "Unlimited"}
                      </div>
                      {task.maxCompletions && (
                        <div className="w-32 bg-gray-200 rounded-full h-2 mt-1.5 overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-orange-400 to-orange-1000 h-2 rounded-full transition-all shadow-sm"
                            style={{
                              width: `${Math.min(
                                (task.completedCount / task.maxCompletions) *
                                  100,
                                100
                              )}%`,
                            }}
                          />
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={task.status}
                        onChange={(e) =>
                          handleStatusChange(task._id, e.target.value as any)
                        }
                        className={`text-xs px-3 py-1.5 rounded-full font-semibold border-0 cursor-pointer ${getStatusColor(
                          task.status
                        )}`}
                      >
                        <option value="active">
                          <CheckCircle className="inline w-4 h-4 mr-1" />
                          Active
                        </option>
                        <option value="inactive">
                          <PauseIcon className="inline w-4 h-4 mr-1" />
                          Inactive
                        </option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
                        <User className="inline w-4 h-4 mr-1" />
                        Manual
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(task)}
                          className="p-2 text-orange-500 hover:bg-gradient-to-r hover:from-orange-50 hover:to-orange-100 rounded-lg transition-all hover:shadow-md"
                          title="Chỉnh sửa"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(task._id)}
                          className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-all hover:shadow-md"
                          title="Xóa"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Professional Pagination */}
          <div className="border-t-2 border-primary/10 bg-gradient-to-r from-secondary-light/30 to-primary/5">
            <div className="p-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Hiển thị:</span>
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setPage(1);
                  }}
                  className="px-3 py-1 border border-gray-300 rounded text-sm"
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
                <span className="text-sm text-gray-600">mục</span>
              </div>
              <Pagination
                page={page}
                limit={pageSize}
                totalItems={totalItems}
                onPageChange={setPage}
              />
            </div>
          </div>
        </div>
      )}

      {/* Create/Edit Modal - Modern Professional Design */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-lg p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-hidden border border-gray-200">
            {/* Header */}
            <div className="relative bg-gradient-to-br from-slate-50 via-white to-gray-50 px-8 py-6 border-b border-gray-100">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-400 to-orange-1000"></div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-400/10 to-orange-1000/10 rounded-2xl flex items-center justify-center">
                    <Edit className="w-6 h-6 text-orange-500" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">
                      {editingTask ? "Chỉnh sửa nhiệm vụ" : "Tạo nhiệm vụ mới"}
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                      {editingTask
                        ? "Cập nhật thông tin nhiệm vụ của bạn"
                        : "Điền thông tin để tạo nhiệm vụ mới"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-xl flex items-center justify-center transition-all group"
                >
                  <X className="w-5 h-5 text-gray-600 group-hover:text-gray-800" />
                </button>
              </div>
            </div>

            {/* Form Content */}
            <div className="overflow-y-auto max-h-[calc(95vh-140px)]">
              <form onSubmit={handleSubmit} className="px-8 py-6 space-y-8">
                {/* Basic Information */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-2 h-2 bg-gradient-to-r from-orange-400 to-orange-1000 rounded-full"></div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      Thông tin cơ bản
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                        <FileText className="w-4 h-4 text-orange-500" />
                        Tiêu đề nhiệm vụ *
                      </label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) =>
                          setFormData({ ...formData, title: e.target.value })
                        }
                        required
                        placeholder="Nhập tiêu đề hấp dẫn cho nhiệm vụ..."
                        className="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-gray-800 placeholder-gray-400"
                      />
                    </div>

                    <div>
                      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                        <Smartphone className="w-4 h-4 text-orange-500" />
                        Nền tảng *
                      </label>
                      <PlatformSelect
                        value={formData.platform}
                        onChange={(value) =>
                          setFormData({ ...formData, platform: value })
                        }
                        required
                        placeholder="Chọn nền tảng"
                      />
                    </div>

                    <div>
                      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                        <Target className="w-4 h-4 text-orange-500" />
                        Loại nhiệm vụ *
                      </label>
                      <select
                        value={formData.type}
                        onChange={(e) =>
                          setFormData({ ...formData, type: e.target.value })
                        }
                        className="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all bg-white text-gray-800"
                      >
                        <option value="survey">📊 Khảo sát</option>
                        <option value="app">📱 Cài đặt ứng dụng</option>
                        <option value="registration">
                          ✍️ Đăng ký tài khoản
                        </option>
                        <option value="social">📢 Mạng xã hội</option>
                        <option value="checkin">✅ Check-in</option>
                        <option value="content">📝 Tạo nội dung</option>
                        <option value="referral">🤝 Giới thiệu bạn bè</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                      <FileText className="w-4 h-4 text-orange-500" />
                      Mô tả nhiệm vụ
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      rows={4}
                      placeholder="Mô tả chi tiết về nhiệm vụ, yêu cầu thực hiện..."
                      className="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all resize-none text-gray-800 placeholder-gray-400"
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                      <ImageIcon className="w-4 h-4 text-orange-500" />
                      Logo URL (tùy chọn)
                    </label>
                    <input
                      type="url"
                      value={formData.logoUrl || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, logoUrl: e.target.value })
                      }
                      placeholder="https://example.com/logo.png"
                      className="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-gray-800 placeholder-gray-400"
                    />
                  </div>
                </div>

                {/* Reward & Settings Section */}
                <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 p-6 rounded-2xl border border-emerald-200 space-y-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center">
                      <DollarSign className="w-4 h-4 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      Phần thưởng & Cài đặt
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                        <DollarSign className="w-4 h-4 text-emerald-600" />
                        Phần thưởng (VND) *
                      </label>
                      <input
                        type="number"
                        value={formData.reward}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            reward: Number(e.target.value),
                          })
                        }
                        required
                        min="0"
                        placeholder="Nhập số tiền thưởng"
                        className="w-full px-4 py-4 border-2 border-emerald-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-semibold transition-all bg-white text-gray-800"
                      />
                    </div>

                    <div>
                      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                        <BarChart3 className="w-4 h-4 text-emerald-600" />
                        Số lượng tối đa
                      </label>
                      <input
                        type="number"
                        value={formData.maxCompletions || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            maxCompletions: e.target.value
                              ? Number(e.target.value)
                              : undefined,
                          })
                        }
                        min="1"
                        placeholder="Không giới hạn"
                        className="w-full px-4 py-4 border-2 border-emerald-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all bg-white text-gray-800"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                      <ToggleLeft className="w-4 h-4 text-emerald-600" />
                      Trạng thái hoạt động
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) =>
                        setFormData({ ...formData, status: e.target.value })
                      }
                      className="w-full px-4 py-4 border-2 border-emerald-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium transition-all bg-white text-gray-800"
                    >
                      <option value="active">🟢 Hoạt động</option>
                      <option value="inactive">🔴 Tạm dừng</option>
                    </select>
                  </div>
                </div>

                {/* Requirements Section */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-2 h-2 bg-gradient-to-r from-orange-400 to-orange-1000 rounded-full"></div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      Các bước thực hiện nhiệm vụ
                    </h3>
                  </div>

                  <div className="bg-gradient-to-br from-orange-50 to-blue-100/50 p-6 rounded-3xl border border-orange-200">
                    <div className="flex items-start gap-3 mb-6">
                      <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center flex-shrink-0">
                        <List className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-800 mb-2">
                          Hướng dẫn từng bước
                        </h4>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          Tạo các bước hướng dẫn chi tiết và rõ ràng để người
                          dùng có thể hoàn thành nhiệm vụ một cách dễ dàng nhất.
                          Mỗi bước nên ngắn gọn, cụ thể và có thể thực hiện
                          được.
                        </p>
                      </div>
                    </div>

                    <div className="space-y-5">
                      {(formData.requirements || []).map(
                        (requirement, index) => {
                          const reqObj =
                            typeof requirement === "string"
                              ? {
                                  title: requirement.split(":", 2)[0] || "",
                                  description:
                                    requirement.split(":", 2)[1] || "",
                                }
                              : requirement;
                          const header = reqObj.title || "";
                          const content = reqObj.description || "";
                          return (
                            <div
                              key={index}
                              className="bg-white p-6 rounded-2xl border-2 border-orange-100 hover:border-orange-300 hover:shadow-md transition-all group"
                            >
                              <div className="flex items-start gap-4 mb-4">
                                <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-orange-400 to-orange-1000 text-white text-sm font-bold rounded-xl flex items-center justify-center shadow-lg">
                                  {index + 1}
                                </div>
                                <div className="flex-1">
                                  <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">
                                    Tiêu đề bước {index + 1}
                                  </label>
                                  <input
                                    type="text"
                                    value={header}
                                    onChange={(e) => {
                                      const newRequirements = [
                                        ...(formData.requirements || []),
                                      ];
                                      newRequirements[index] = {
                                        title: e.target.value,
                                        description: content,
                                      };
                                      setFormData({
                                        ...formData,
                                        requirements: newRequirements,
                                      });
                                    }}
                                    placeholder={`Ví dụ: Đăng ký tài khoản, Chia sẻ bài viết...`}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-orange-500 transition-all font-semibold text-gray-800 placeholder-gray-400"
                                  />
                                </div>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const newRequirements = (
                                      formData.requirements || []
                                    ).filter((_, i) => i !== index);
                                    setFormData({
                                      ...formData,
                                      requirements: newRequirements,
                                    });
                                  }}
                                  className="flex-shrink-0 w-10 h-10 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl flex items-center justify-center transition-all hover:scale-105 group-hover:opacity-100 opacity-70"
                                  title="Xóa bước này"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>

                              <div className="pl-14">
                                <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">
                                  Mô tả chi tiết
                                </label>
                                <textarea
                                  value={content}
                                  onChange={(e) => {
                                    const newRequirements = [
                                      ...(formData.requirements || []),
                                    ];
                                    newRequirements[index] = {
                                      title: header,
                                      description: e.target.value,
                                    };
                                    setFormData({
                                      ...formData,
                                      requirements: newRequirements,
                                    });
                                  }}
                                  placeholder="Hướng dẫn chi tiết cách thực hiện bước này. Ví dụ: Truy cập vào trang chủ, nhấn nút Đăng ký, điền thông tin cá nhân..."
                                  rows={3}
                                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-orange-500 transition-all resize-none text-gray-700 placeholder-gray-400"
                                />
                              </div>
                            </div>
                          );
                        }
                      )}
                    </div>

                    {(!formData.requirements ||
                      formData.requirements.length === 0) && (
                      <div className="text-center py-12">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <List className="w-8 h-8 text-gray-400" />
                        </div>
                        <p className="text-gray-500 font-medium mb-2">
                          Chưa có bước hướng dẫn nào
                        </p>
                        <p className="text-sm text-gray-400">
                          Thêm các bước để hướng dẫn người dùng hoàn thành nhiệm
                          vụ
                        </p>
                      </div>
                    )}

                    <div className="mt-6 flex gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          setFormData({
                            ...formData,
                            requirements: [
                              ...(formData.requirements || []),
                              { title: "", description: "" },
                            ],
                          });
                        }}
                        className="flex-1 px-6 py-4 bg-white border-2 border-dashed border-blue-300 text-orange-600 rounded-2xl hover:bg-orange-50 hover:border-blue-400 hover:shadow-md transition-all font-semibold flex items-center justify-center gap-2 group"
                      >
                        <Plus className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        Thêm bước mới
                      </button>

                      {formData.requirements &&
                        formData.requirements.length > 0 && (
                          <button
                            type="button"
                            onClick={() => {
                              if (
                                confirm(
                                  "Bạn có chắc muốn xóa tất cả các bước hướng dẫn?"
                                )
                              ) {
                                setFormData({
                                  ...formData,
                                  requirements: [],
                                });
                              }
                            }}
                            className="px-6 py-4 bg-red-50 border-2 border-red-200 text-red-600 rounded-2xl hover:bg-red-100 hover:border-red-300 font-semibold flex items-center gap-2 transition-all"
                          >
                            <Trash2 className="w-5 h-5" />
                            Xóa tất cả
                          </button>
                        )}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="bg-gray-50 -mx-6 -mb-6 px-6 py-4 rounded-b-2xl border-t border-gray-200">
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-100 hover:border-gray-400 font-semibold transition-all transform hover:scale-[1.01]"
                    >
                      <X className="w-4 h-4" />
                      Hủy bỏ
                    </button>
                    <button
                      type="submit"
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-orange-400 to-orange-1000 text-white rounded-xl hover:from-[#D81B60] hover:to-[#FF7043] font-bold shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.01] active:scale-[0.98]"
                    >
                      {editingTask ? (
                        <>
                          <CheckCircle className="w-5 h-5" />
                          Cập nhật nhiệm vụ
                        </>
                      ) : (
                        <>
                          <Plus className="w-5 h-5" />
                          Tạo nhiệm vụ mới
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        message={confirmModal.message}
        type="danger"
        confirmText="Xóa"
        cancelText="Hủy"
      />
    </div>
  );
};

export default TaskManagement;
