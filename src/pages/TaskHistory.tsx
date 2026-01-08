import React, { useState, useEffect } from "react";
import {
  Clock,
  CheckCircle,
  XCircle,
  Filter,
  Search,
  Calendar,
  FileText,
  Award,
  AlertCircle,
} from "lucide-react";
import taskService, {
  type Submission,
  type Task,
} from "../services/taskService";
import { useAppStore } from "@/store/appStore";
import Pagination from "@/components/common/Pagination";

const TaskHistory: React.FC = () => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const { setToast } = useAppStore();

  const fetchSubmissions = async (page: number = 1, status: string = "") => {
    setLoading(true);
    try {
      const response = await taskService.getMySubmissions({
        page,
        limit: 10,
        ...(status && { status }),
      });

      setSubmissions(response.data || []);
      if (response.pagination) {
        setTotalPages(response.pagination.totalPages || 1);
      }
    } catch (error: any) {
      setToast({
        title: error.response?.data?.message || "Không thể tải lịch sử",
        type: "error",
        isVisible: true,
        timer: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions(currentPage, statusFilter);
  }, [currentPage, statusFilter]);

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "approved":
        return {
          label: "Đã duyệt",
          icon: CheckCircle,
          bgColor: "bg-green-100",
          textColor: "text-green-800",
          borderColor: "border-green-200",
        };
      case "rejected":
        return {
          label: "Từ chối",
          icon: XCircle,
          bgColor: "bg-red-100",
          textColor: "text-red-800",
          borderColor: "border-red-200",
        };
      case "pending":
      default:
        return {
          label: "Chờ duyệt",
          icon: Clock,
          bgColor: "bg-yellow-100",
          textColor: "text-yellow-800",
          borderColor: "border-yellow-200",
        };
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const getTaskTitle = (taskId: string | Task): string => {
    if (typeof taskId === "string") return "Nhiệm vụ";
    return taskId.title || "Nhiệm vụ";
  };

  const getTaskReward = (taskId: string | Task): number => {
    if (typeof taskId === "string") return 0;
    return taskId.reward || 0;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-4 sm:p-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <FileText className="h-8 w-8 text-orange-500" />
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Lịch Sử Làm Offer
            </h1>
          </div>
          <p className="text-gray-600">
            Theo dõi tất cả các nhiệm vụ bạn đã hoàn thành
          </p>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Chờ duyệt</p>
                <p className="text-2xl font-bold text-gray-900">
                  {submissions.filter((s) => s.status === "pending").length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Đã duyệt</p>
                <p className="text-2xl font-bold text-gray-900">
                  {submissions.filter((s) => s.status === "approved").length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-red-100 rounded-lg">
                <XCircle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Từ chối</p>
                <p className="text-2xl font-bold text-gray-900">
                  {submissions.filter((s) => s.status === "rejected").length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filter */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Filter className="h-5 w-5 text-gray-500" />
            <h2 className="text-lg font-semibold text-gray-800">
              Lọc theo trạng thái
            </h2>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => {
                setStatusFilter("");
                setCurrentPage(1);
              }}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                statusFilter === ""
                  ? "bg-orange-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Tất cả
            </button>
            <button
              onClick={() => {
                setStatusFilter("pending");
                setCurrentPage(1);
              }}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                statusFilter === "pending"
                  ? "bg-yellow-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Chờ duyệt
            </button>
            <button
              onClick={() => {
                setStatusFilter("approved");
                setCurrentPage(1);
              }}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                statusFilter === "approved"
                  ? "bg-green-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Đã duyệt
            </button>
            <button
              onClick={() => {
                setStatusFilter("rejected");
                setCurrentPage(1);
              }}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                statusFilter === "rejected"
                  ? "bg-red-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Từ chối
            </button>
          </div>
        </div>

        {/* Submissions List */}
        <div className="space-y-4">
          {loading ? (
            <div className="bg-white rounded-xl border border-gray-200 p-8">
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
              </div>
            </div>
          ) : submissions.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
              <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500">Chưa có lịch sử làm offer</p>
            </div>
          ) : (
            submissions.map((submission) => {
              const statusConfig = getStatusConfig(submission.status);
              const StatusIcon = statusConfig.icon;

              return (
                <div
                  key={submission._id}
                  className={`bg-white rounded-xl border-2 ${statusConfig.borderColor} p-4 sm:p-6 hover:shadow-lg transition-shadow`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    {/* Task Info */}
                    <div className="flex-1">
                      <div className="flex items-start gap-3 mb-3">
                        <Award className="h-6 w-6 text-orange-500 flex-shrink-0 mt-1" />
                        <div>
                          <h3 className="text-lg font-bold text-gray-900 mb-1">
                            {getTaskTitle(submission.taskId)}
                          </h3>
                          <p className="text-sm text-gray-600 flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {formatDate(submission.createdAt)}
                          </p>
                        </div>
                      </div>

                      {/* Reward */}
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-sm text-gray-600">
                          Phần thưởng:
                        </span>
                        <span className="text-lg font-bold text-orange-600">
                          {formatCurrency(getTaskReward(submission.taskId))}
                        </span>
                      </div>

                      {/* Rejection Reason */}
                      {submission.status === "rejected" &&
                        (submission.reasonReject || submission.reviewNote) && (
                          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-sm font-medium text-red-800 mb-1">
                              Lý do từ chối:
                            </p>
                            <p className="text-sm text-red-700">
                              {submission.reasonReject || submission.reviewNote}
                            </p>
                          </div>
                        )}
                    </div>

                    {/* Status Badge */}
                    <div
                      className={`flex items-center gap-2 px-4 py-2 rounded-full ${statusConfig.bgColor} ${statusConfig.textColor} font-medium`}
                    >
                      <StatusIcon className="h-5 w-5" />
                      <span>{statusConfig.label}</span>
                    </div>
                  </div>

                  {/* Proof Image */}
                  {submission.proof && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <p className="text-sm font-medium text-gray-700 mb-2">
                        Ảnh chứng minh:
                      </p>
                      <img
                        src={submission.proof}
                        alt="Proof"
                        className="w-full sm:w-64 h-auto rounded-lg border border-gray-200"
                      />
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskHistory;
