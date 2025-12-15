import React, { useState, useEffect, useCallback } from "react";
import {
  Plus,
  XCircle,
  Search,
  RefreshCw,
  Edit,
  Trash2,
  Loader2,
  Target,
  FileText,
  List,
  Users,
  Smartphone,
  BarChart3,
  CheckCircle,
  DollarSign,
  X,
  UserIcon,
  PenTool,
  Check,
  Pause,
  Link2,
} from "lucide-react";
import taskService from "@/services/taskService";
import type { Task, CreateTaskData } from "@/services/taskService";
import { notification } from "@/utils/notification";
import { Link as RouterLink } from "react-router-dom";

const TaskManagement: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "active" | "inactive"
  >("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const [formData, setFormData] = useState<CreateTaskData>({
    title: "",
    description: "",
    requirements: [],
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
        limit: 20,
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
      setTotalPages(result.pagination?.totalPages || 1);
    } catch (err) {
      console.error("Error fetching tasks:", err);
      notification({
        message: "Không thể tải danh sách nhiệm vụ",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  }, [filterType, filterStatus, searchTerm, page]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleCreate = () => {
    setEditingTask(null);
    setFormData({
      title: "",
      description: "",
      requirements: [],
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
    setFormData({
      offerId: task.offerId,
      title: task.title,
      requirements: task.requirements || [],
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
    if (!confirm("Bạn có chắc muốn xóa nhiệm vụ này?")) return;

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
      active: "bg-green-100 text-green-800",
      inactive: "bg-gray-100 text-gray-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const getTaskTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      survey: "Khảo sát",
      app_install: "Cài app",
      registration: "Đăng ký",
      purchase: "Mua hàng",
      social_media: "Mạng xã hội",
      other: "Khác",
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
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-green-50 p-4 sm:p-6">
      {/* Header - Green Theme */}
      <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-green-500 rounded-2xl shadow-xl p-6 sm:p-8 mb-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-2">
              <Target className="w-6 h-6 text-green-600 mr-3" />
              Quản lý Nhiệm vụ
            </h1>
            <p className="text-green-50 text-base">
              Tạo và quản lý các nhiệm vụ cho người dùng
            </p>
            <div className="flex gap-4 mt-4">
              <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
                <p className="text-xs text-green-100">Tổng nhiệm vụ</p>
                <p className="text-2xl font-bold">{tasks.length}</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
                <p className="text-xs text-green-100">Đang hoạt động</p>
                <p className="text-2xl font-bold">
                  {tasks.filter((t) => t.status === "active").length}
                </p>
              </div>
            </div>
          </div>
          <button
            onClick={handleCreate}
            className="flex items-center gap-2 px-6 py-3 bg-white text-green-600 rounded-xl hover:bg-green-50 font-bold shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
          >
            <Plus size={20} />
            Tạo nhiệm vụ mới
          </button>
        </div>
      </div>

      {/* Filters - Green Theme */}
      <div className="bg-white p-6 rounded-2xl shadow-lg mb-6 border border-green-100">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Search size={20} className="text-green-600" />
          Bộ lọc & Tìm kiếm
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-500 w-5 h-5" />
            <input
              type="text"
              placeholder="Tìm kiếm nhiệm vụ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
            />
          </div>

          {/* Filter Type */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
            className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 font-medium transition-all"
          >
            <option value="all">
              <List className="inline w-4 h-4 mr-1" />
              Tất cả loại
            </option>
            <option value="social">
              <Users className="inline w-4 h-4 mr-1" />
              Mạng xã hội
            </option>
            <option value="app">
              <Smartphone className="inline w-4 h-4 mr-1" />
              Ứng dụng
            </option>
            <option value="registration">
              <PenTool className="inline w-4 h-4 mr-1" />
              Đăng ký
            </option>
            <option value="survey">
              <BarChart3 className="inline w-4 h-4 mr-1" />
              Khảo sát
            </option>
            <option value="checkin">
              <Check className="inline w-4 h-4 mr-1" />
              Check-in
            </option>
            <option value="content">
              <FileText className="inline w-4 h-4 mr-1" />
              Nội dung
            </option>
            <option value="referral">
              <Link2 className="inline w-4 h-4 mr-1" />
              Giới thiệu
            </option>
          </select>

          {/* Filter Status */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 font-medium transition-all"
          >
            <option value="all">🔄 Tất cả trạng thái</option>
            <option value="active">
              <CheckCircle className="inline w-4 h-4 mr-1" />
              Active
            </option>
            <option value="paused">
              <Pause className="inline w-4 h-4 mr-1" />
              Paused
            </option>
            <option value="closed">🔒 Closed</option>
          </select>
        </div>

        <button
          onClick={fetchTasks}
          className="mt-4 flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 rounded-xl hover:from-green-100 hover:to-emerald-100 font-semibold border-2 border-green-200 transition-all shadow-sm hover:shadow-md"
        >
          <RefreshCw size={18} />
          Làm mới dữ liệu
        </button>
      </div>

      {/* Tasks Table */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl shadow-lg">
          <Loader2 className="w-12 h-12 animate-spin text-green-600 mb-4" />
          <p className="text-gray-600 font-semibold">Đang tải dữ liệu...</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-green-100">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-green-50 to-emerald-50 border-b-2 border-green-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-green-800 uppercase tracking-wide">
                    Tiêu đề
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-green-800 uppercase tracking-wide">
                    Loại
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-green-800 uppercase tracking-wide">
                    Phần thưởng
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-green-800 uppercase tracking-wide">
                    Tiến độ
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-green-800 uppercase tracking-wide">
                    Trạng thái
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-green-800 uppercase tracking-wide">
                    Xác minh
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-green-800 uppercase tracking-wide">
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {tasks.map((task) => (
                  <tr
                    key={task._id}
                    className="hover:bg-green-50/50 transition-colors"
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
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                        {getTaskTypeLabel(task.type)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-base font-bold text-green-600">
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
                            className="bg-gradient-to-r from-green-500 to-emerald-600 h-2 rounded-full transition-all shadow-sm"
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
                          <Pause className="inline w-4 h-4 mr-1" />
                          Inactive
                        </option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
                        <UserIcon className="inline w-4 h-4 mr-1" />
                        Manual
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(task)}
                          className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-all hover:shadow-md"
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

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 p-6 border-t-2 border-green-100 bg-gradient-to-r from-green-50/50 to-emerald-50/50">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-5 py-2.5 border-2 border-green-200 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-green-50 font-semibold text-green-700 transition-all hover:shadow-md"
              >
                ← Trước
              </button>
              <span className="px-6 py-2.5 bg-white border-2 border-green-200 rounded-xl text-green-700 font-bold shadow-sm">
                Trang {page} / {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-5 py-2.5 border-2 border-green-200 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-green-50 font-semibold text-green-700 transition-all hover:shadow-md"
              >
                Sau →
              </button>
            </div>
          )}
        </div>
      )}

      {/* Create/Edit Modal - Green Theme */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border-2 border-green-200">
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-6 text-white rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-black flex items-center gap-2">
                  {editingTask ? "✏️ Sửa nhiệm vụ" : "➕ Tạo nhiệm vụ mới"}
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-white hover:bg-white/20 p-2 rounded-lg transition-all"
                >
                  <XCircle size={26} />
                </button>
              </div>
              <p className="text-green-100 text-sm mt-1">
                {editingTask
                  ? "Cập nhật thông tin nhiệm vụ"
                  : "Điền thông tin để tạo nhiệm vụ mới"}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-gray-800 mb-2">
                  <FileText className="text-gray-600" size={16} />
                  Tiêu đề *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  required
                  placeholder="Nhập tiêu đề nhiệm vụ..."
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-gray-800 mb-2">
                  <FileText className="w-5 h-5 text-blue-600 mr-2" />
                  Mô tả
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={3}
                  placeholder="Nhập mô tả chi tiết..."
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                />
              </div>

              {/* Requirements Section */}
              <div className="bg-green-50 p-4 rounded-xl border-2 border-green-200">
                <label className="flex items-center gap-2 text-sm font-bold text-gray-800 mb-3">
                  <List className="w-5 h-5 text-purple-600 mr-2" />
                  Các bước hướng dẫn chi tiết
                </label>
                <div className="space-y-2">
                  {(formData.requirements || []).map((requirement, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={requirement}
                        onChange={(e) => {
                          const newRequirements = [
                            ...(formData.requirements || []),
                          ];
                          newRequirements[index] = e.target.value;
                          setFormData({
                            ...formData,
                            requirements: newRequirements,
                          });
                        }}
                        placeholder={`Bước ${
                          index + 1
                        } - Tiêu đề: Mô tả chi tiết...`}
                        className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm transition-all bg-white"
                      />
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
                        className="px-3 py-3 bg-red-100 text-red-600 rounded-xl hover:bg-red-200 transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setFormData({
                      ...formData,
                      requirements: [...(formData.requirements || []), ""],
                    });
                  }}
                  className="mt-3 w-full px-4 py-3 bg-white border-2 border-dashed border-green-300 text-green-700 rounded-xl hover:bg-green-50 hover:border-green-400 font-semibold flex items-center justify-center gap-2 transition-all"
                >
                  <Plus size={18} />
                  Thêm bước hướng dẫn mới
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-800 mb-2">
                    🏷️ Loại *
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({ ...formData, type: e.target.value })
                    }
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 font-medium transition-all"
                  >
                    <option value="survey">Khảo sát</option>
                    <option value="app_install">Cài đặt app</option>
                    <option value="registration">Đăng ký</option>
                    <option value="purchase">Mua hàng</option>
                    <option value="social_media">Mạng xã hội</option>
                    <option value="other">Khác</option>
                  </select>
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-800 mb-2">
                    <DollarSign className="w-5 h-5 text-green-600 mr-2" />
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
                    placeholder="0"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 font-semibold transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-800 mb-2">
                    🔢 Số lượng tối đa
                  </label>
                  <input
                    type="number"
                    value={formData.maxCompletions || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        maxCompletions: Number(e.target.value),
                      })
                    }
                    min="1"
                    placeholder="Không giới hạn"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-800 mb-2">
                    🏢 Platform
                  </label>
                  <input
                    type="text"
                    value={formData.platform}
                    onChange={(e) =>
                      setFormData({ ...formData, platform: e.target.value })
                    }
                    placeholder="Tên platform..."
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-800 mb-2">
                    ⚡ Trạng thái *
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value })
                    }
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 font-medium transition-all"
                  >
                    <option value="active">
                      <CheckCircle className="inline w-4 h-4 mr-1" />
                      Active
                    </option>
                    <option value="inactive">
                      <Pause className="inline w-4 h-4 mr-1" />
                      Inactive
                    </option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-6 border-t-2 border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-100 font-semibold transition-all"
                >
                  <X className="w-4 h-4 mr-2" />
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 font-bold shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02]"
                >
                  {editingTask ? (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Cập nhật
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 mr-2" />
                      Tạo mới
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskManagement;
