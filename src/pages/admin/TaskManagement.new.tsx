import React, { useState, useEffect } from "react";
import {
  Plus,
  CheckCircle,
  Clock,
  XCircle,
  Search,
  RefreshCw,
  Eye,
  Edit,
  Trash2,
  Loader2,
} from "lucide-react";
import taskService, {
  type Task,
  type TaskType,
  type CreateTaskData,
} from "@/services/taskService";
import { notification } from "@/utils/notification";

const TaskManagement: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<TaskType | "all">("all");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "active" | "paused" | "closed"
  >("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const [formData, setFormData] = useState<CreateTaskData>({
    title: "",
    description: "",
    requirements: [],
    type: "social",
    reward: 0,
    maxCompletion: 100,
    platform: "",
    proofType: "image",
    verificationMode: "manual",
    status: "active",
  });

  // Fetch tasks
  useEffect(() => {
    fetchTasks();
  }, [filterType, filterStatus, searchTerm, page]);

  const fetchTasks = async () => {
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
      setTasks(result.tasks);
      setTotalPages(result.totalPages);
    } catch (error) {
      notification({
        message: "Không thể tải danh sách nhiệm vụ",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingTask(null);
    setFormData({
      title: "",
      description: "",
      requirements: [],
      type: "social",
      reward: 0,
      maxCompletion: 100,
      platform: "",
      proofType: "image",
      verificationMode: "manual",
      status: "active",
    });
    setIsModalOpen(true);
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setFormData({
      offerId:
        task.offerId && typeof task.offerId === "object"
          ? task.offerId._id
          : undefined,
      title: task.title,
      requirements: task.requirements || [],

      description: task.description,
      type: task.type,
      reward: task.reward,
      maxCompletion: task.maxCompletion,
      platform: task.platform,
      proofType: task.proofType,
      verificationMode: task.verificationMode,
      status: task.status,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingTask) {
        // Remove offerId for update since it's a different type
        const { offerId, ...updateData } = formData;
        await taskService.updateTask(editingTask._id, updateData as any);
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
    newStatus: "active" | "paused" | "closed"
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
        "bg-gradient-to-r from-[#E91E63]/10 to-[#FF8C1A]/10 text-[#E91E63] border border-[#E91E63]/30",
      paused: "bg-yellow-100 text-yellow-800",
      closed: "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="min-h-screen p-4 sm:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Quản lý Nhiệm vụ
          </h1>
          <p className="text-sm text-gray-600">
            Tạo và quản lý các nhiệm vụ cho người dùng
          </p>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 px-4 py-2 bg-[#E91E63] text-white rounded-lg hover:bg-gradient-to-r hover:from-[#E91E63] hover:to-[#FF8C1A] hover:text-white text-sm"
        >
          <Plus size={18} />
          Tạo nhiệm vụ
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Tìm kiếm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Filter Type */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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

          {/* Filter Status */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="active">Active</option>
            <option value="paused">Paused</option>
            <option value="closed">Closed</option>
          </select>
        </div>

        <button
          onClick={fetchTasks}
          className="mt-4 flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm"
        >
          <RefreshCw size={16} />
          Làm mới
        </button>
      </div>

      {/* Tasks Table */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-[#E91E63]" />
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                    Tiêu đề
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                    Loại
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                    Phần thưởng
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                    Tiến độ
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                    Trạng thái
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                    Xác minh
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {tasks.map((task) => (
                  <tr key={task._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900 line-clamp-1">
                        {task.title}
                      </div>
                      <div className="text-xs text-gray-500 line-clamp-1">
                        {task.description}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-gray-700">
                        {taskService.getTaskTypeLabel(task.type)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm font-semibold text-[#E91E63]">
                        {taskService.formatReward(task.reward)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-xs text-gray-600">
                        {task.currentCompletion}/{task.maxCompletion}
                      </div>
                      <div className="w-24 bg-gray-200 rounded-full h-1.5 mt-1">
                        <div
                          className="bg-[#E91E63] h-1.5 rounded-full"
                          style={{
                            width: `${
                              (task.currentCompletion / task.maxCompletion) *
                              100
                            }%`,
                          }}
                        />
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={task.status}
                        onChange={(e) =>
                          handleStatusChange(task._id, e.target.value as any)
                        }
                        className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(
                          task.status
                        )}`}
                      >
                        <option value="active">Active</option>
                        <option value="paused">Paused</option>
                        <option value="closed">Closed</option>
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs text-gray-600">
                        {task.verificationMode === "ai"
                          ? "Tự động"
                          : "Thủ công"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(task)}
                          className="p-1 text-[#E91E63] hover:bg-gradient-to-r hover:from-pink-50 hover:to-orange-50 rounded"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(task._id)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                        >
                          <Trash2 size={16} />
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
            <div className="flex items-center justify-center gap-2 p-4 border-t">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Trước
              </button>
              <span className="px-4 py-2 text-gray-700">
                Trang {page} / {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Sau
              </button>
            </div>
          )}
        </div>
      )}

      {/* Create/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-bold text-gray-900">
                {editingTask ? "Sửa nhiệm vụ" : "Tạo nhiệm vụ mới"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tiêu đề *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mô tả
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Requirements Section */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
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
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
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
                        className="px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"
                      >
                        <Trash2 size={16} />
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
                  className="mt-2 px-4 py-2 bg-gradient-to-r from-[#E91E63]/10 to-[#FF8C1A]/10 text-[#E91E63] border border-[#E91E63]/30 rounded-lg hover:bg-gradient-to-r hover:from-[#E91E63] hover:to-[#FF8C1A] hover:text-white text-sm flex items-center gap-2"
                >
                  <Plus size={16} />
                  Thêm bước hướng dẫn
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Loại *
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        type: e.target.value as TaskType,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="social">Mạng xã hội</option>
                    <option value="app">Ứng dụng</option>
                    <option value="registration">Đăng ký</option>
                    <option value="survey">Khảo sát</option>
                    <option value="checkin">Check-in</option>
                    <option value="content">Nội dung</option>
                    <option value="referral">Giới thiệu</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Số lượng tối đa *
                  </label>
                  <input
                    type="number"
                    value={formData.maxCompletion}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        maxCompletion: Number(e.target.value),
                      })
                    }
                    required
                    min="1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Platform
                  </label>
                  <input
                    type="text"
                    value={formData.platform}
                    onChange={(e) =>
                      setFormData({ ...formData, platform: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Loại bằng chứng *
                  </label>
                  <select
                    value={formData.proofType}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        proofType: e.target.value as any,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="image">Ảnh</option>
                    <option value="video">Video</option>
                    <option value="text">Text</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Xác minh *
                  </label>
                  <select
                    value={formData.verificationMode}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        verificationMode: e.target.value as any,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="manual">Thủ công</option>
                    <option value="ai">Tự động (AI)</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-[#E91E63] to-[#FF8C1A] text-white rounded-lg hover:from-[#AD1457] hover:to-[#E65100]"
                >
                  {editingTask ? "Cập nhật" : "Tạo mới"}
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
