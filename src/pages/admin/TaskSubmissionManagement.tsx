import React, { useState, useEffect } from "react";
import {
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Search,
  Loader2,
  RefreshCw,
  Image as ImageIcon,
  FileText,
  User,
  Calendar,
} from "lucide-react";
import { notification } from "../../utils/notification";
import taskService from "../../services/taskService";

interface Submission {
  _id: string;
  taskId: {
    _id: string;
    title: string;
    reward: number;
  };
  userId: {
    _id: string;
    name: string;
    email: string;
  };
  proofUrl?: string;
  note?: string;
  status: "pending" | "approved" | "rejected";
  reviewedBy?: {
    _id: string;
    name: string;
  };
  reviewedAt?: string;
  reasonReject?: string;
  createdAt: string;
}

const TaskSubmissionManagement: React.FC = () => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);
  const [selectedSubmission, setSelectedSubmission] =
    useState<Submission | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchSubmissions();
  }, [filterStatus]);

  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      const filters = filterStatus !== "all" ? { status: filterStatus } : {};
      const response = await taskService.getAllSubmissions(filters);

      setSubmissions(response.data || []);
    } catch (error: any) {
      notification({
        message: "Không thể tải danh sách submissions",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (submissionId: string) => {
    setProcessing(submissionId);
    try {
      await taskService.approveSubmission(submissionId);

      // Refresh the submissions list
      await fetchSubmissions();

      notification({
        message: "Đã duyệt nhiệm vụ thành công!",
        type: "success",
      });

      setShowModal(false);
    } catch (error) {
      notification({
        message: "Không thể duyệt nhiệm vụ",
        type: "error",
      });
    } finally {
      setProcessing(null);
    }
  };

  const handleReject = async (submissionId: string) => {
    if (!rejectReason.trim()) {
      notification({
        message: "Vui lòng nhập lý do từ chối",
        type: "warning",
      });
      return;
    }

    setProcessing(submissionId);
    try {
      await taskService.rejectSubmission(submissionId, rejectReason);

      // Refresh the submissions list
      await fetchSubmissions();

      notification({
        message: "Đã từ chối nhiệm vụ",
        type: "success",
      });

      setShowModal(false);
      setRejectReason("");
    } catch (error) {
      notification({
        message: "Không thể từ chối nhiệm vụ",
        type: "error",
      });
    } finally {
      setProcessing(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <span className="flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-semibold">
            <Clock size={14} />
            Chờ duyệt
          </span>
        );
      case "approved":
        return (
          <span className="flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-500 border border-orange-500 rounded-full text-sm font-semibold">
            <CheckCircle size={14} />
            Đã duyệt
          </span>
        );
      case "rejected":
        return (
          <span className="flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-semibold">
            <XCircle size={14} />
            Từ chối
          </span>
        );
      default:
        return null;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("vi-VN");
  };

  const filteredSubmissions = submissions.filter(
    (s) =>
      s.userId?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.taskId?.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    total: submissions.length,
    pending: submissions.filter((s) => s.status === "pending").length,
    approved: submissions.filter((s) => s.status === "approved").length,
    rejected: submissions.filter((s) => s.status === "rejected").length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-orange-100 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-400 to-orange-1000 rounded-2xl shadow-xl p-6 sm:p-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-2 flex items-center gap-3">
                <CheckCircle size={40} className="text-white" /> Quản Lý Xét
                Duyệt Nhiệm Vụ
              </h1>
              <p className="text-white/90 text-base">
                Xem xét và phê duyệt các nhiệm vụ người dùng đã hoàn thành
              </p>
            </div>
            <button
              onClick={fetchSubmissions}
              disabled={loading}
              className="flex items-center gap-2 px-5 py-3 bg-white/20 backdrop-blur-sm text-white rounded-xl hover:bg-white/30 font-semibold transition-all border-2 border-white/30"
            >
              <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
              Làm mới
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl shadow-md p-5 border-2 border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold">Tổng số</p>
                <p className="text-3xl font-black text-gray-900">
                  {stats.total}
                </p>
              </div>
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                <FileText className="text-gray-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-5 border-2 border-yellow-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-600 text-sm font-semibold">
                  Chờ duyệt
                </p>
                <p className="text-3xl font-black text-yellow-600">
                  {stats.pending}
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                <Clock className="text-yellow-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-5 border-2 border-orange-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-500 text-sm font-semibold">Đã duyệt</p>
                <p className="text-3xl font-black text-orange-500">
                  {stats.approved}
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <CheckCircle className="text-orange-500" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-5 border-2 border-red-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-600 text-sm font-semibold">Từ chối</p>
                <p className="text-3xl font-black text-red-600">
                  {stats.rejected}
                </p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                <XCircle className="text-red-600" size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-md p-4 border border-orange-500">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Tìm kiếm theo tên người dùng hoặc nhiệm vụ..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                />
              </div>
            </div>

            <div className="flex gap-2">
              {["all", "pending", "approved", "rejected"].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                    filterStatus === status
                      ? "bg-orange-500 text-white shadow-lg"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {status === "all" && "Tất cả"}
                  {status === "pending" && "Chờ duyệt"}
                  {status === "approved" && "Đã duyệt"}
                  {status === "rejected" && "Từ chối"}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl shadow-lg">
            <Loader2 className="w-12 h-12 animate-spin text-orange-500 mb-4" />
            <p className="text-gray-600 font-semibold">Đang tải dữ liệu...</p>
          </div>
        ) : filteredSubmissions.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-lg">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-xl font-semibold text-gray-700">
              Không có submission nào
            </p>
            <p className="text-gray-500 mt-2">
              Chưa có người dùng nào gửi nhiệm vụ
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-xl border-2 border-orange-500 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-orange-400 to-orange-1000 text-white">
                    <th className="px-6 py-5 text-left font-bold text-white">
                      Người dùng
                    </th>
                    <th className="px-6 py-5 text-left font-bold text-white">
                      Nhiệm vụ
                    </th>
                    <th className="px-6 py-5 text-left font-bold text-white">
                      Phần thưởng
                    </th>
                    <th className="px-6 py-5 text-left font-bold text-white">
                      Trạng thái
                    </th>
                    <th className="px-6 py-5 text-left font-bold text-white">
                      Thời gian
                    </th>
                    <th className="px-6 py-5 text-center font-bold text-white">
                      Hành động
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredSubmissions.map((submission) => (
                    <tr
                      key={submission._id}
                      className="hover:bg-orange-50 transition-all duration-200 border-b border-gray-100"
                    >
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-orange-1000 rounded-full flex items-center justify-center shadow-md">
                            <User className="text-white" size={20} />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">
                              {submission.userId?.name || "N/A"}
                            </p>
                            <p className="text-sm text-gray-500">
                              {submission.userId?.email || "N/A"}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <p className="font-semibold text-gray-900 mb-1">
                          {submission.taskId?.title || "N/A"}
                        </p>
                        {submission.note && (
                          <p className="text-sm text-gray-500 line-clamp-2">
                            {submission.note}
                          </p>
                        )}
                      </td>
                      <td className="px-6 py-5">
                        <span className="font-bold text-orange-500 text-lg">
                          {formatCurrency(submission.taskId?.reward || 0)}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        {getStatusBadge(submission.status)}
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Calendar size={16} />
                          <span className="text-sm">
                            {formatDate(submission.createdAt)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => {
                              setSelectedSubmission(submission);
                              setShowModal(true);
                            }}
                            className="p-3 bg-orange-50 text-orange-500 border border-orange-500 rounded-xl hover:bg-orange-100 hover:text-orange-600 transition-all shadow-sm"
                            title="Xem chi tiết"
                          >
                            <Eye size={18} />
                          </button>
                          {submission.status === "pending" && (
                            <>
                              <button
                                onClick={() => handleApprove(submission._id)}
                                disabled={processing === submission._id}
                                className="p-3 bg-orange-50 text-orange-500 border border-orange-500 rounded-xl hover:bg-orange-100 hover:text-orange-600 transition-all disabled:opacity-50 shadow-sm"
                                title="Duyệt"
                              >
                                {processing === submission._id ? (
                                  <Loader2 size={18} className="animate-spin" />
                                ) : (
                                  <CheckCircle size={18} />
                                )}
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedSubmission(submission);
                                  setShowModal(true);
                                }}
                                disabled={processing === submission._id}
                                className="p-3 bg-red-50 text-red-600 border border-red-200 rounded-xl hover:bg-red-100 hover:text-red-700 transition-all disabled:opacity-50 shadow-sm"
                                title="Từ chối"
                              >
                                <XCircle size={18} />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Modal */}
        {showModal && selectedSubmission && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="bg-gradient-to-r from-orange-400 to-orange-1000 p-6 text-white relative">
                <h2 className="text-2xl font-black">Chi Tiết Submission</h2>
                <button
                  onClick={() => {
                    setShowModal(false);
                    setRejectReason("");
                  }}
                  className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                >
                  <XCircle size={20} />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* User Info */}
                <div className="bg-gray-50 p-4 rounded-xl">
                  <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <User size={20} className="text-orange-500" />
                    Thông tin người dùng
                  </h3>
                  <div className="space-y-2">
                    <p>
                      <span className="font-semibold">Tên:</span>{" "}
                      {selectedSubmission.userId?.name || "N/A"}
                    </p>
                    <p>
                      <span className="font-semibold">Email:</span>{" "}
                      {selectedSubmission.userId?.email || "N/A"}
                    </p>
                  </div>
                </div>

                {/* Task Info */}
                <div className="bg-gray-50 p-4 rounded-xl">
                  <h3 className="font-bold text-gray-900 mb-3">
                    Thông tin nhiệm vụ
                  </h3>
                  <div className="space-y-2">
                    <p>
                      <span className="font-semibold">Tiêu đề:</span>{" "}
                      {selectedSubmission.taskId?.title || "N/A"}
                    </p>
                    <p>
                      <span className="font-semibold">Phần thưởng:</span>{" "}
                      <span className="text-orange-500 font-bold">
                        {formatCurrency(selectedSubmission.taskId?.reward || 0)}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Proof */}
                {selectedSubmission.proofUrl && (
                  <div>
                    <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <ImageIcon size={20} className="text-orange-500" />
                      Ảnh chứng minh
                    </h3>
                    <img
                      src={selectedSubmission.proofUrl}
                      alt="Proof"
                      className="w-full rounded-xl border-2 border-gray-200"
                    />
                  </div>
                )}

                {/* Note */}
                {selectedSubmission.note && (
                  <div className="bg-orange-50 p-4 rounded-xl border border-orange-500">
                    <h3 className="font-bold text-gray-900 mb-2">Ghi chú</h3>
                    <p className="text-gray-700">{selectedSubmission.note}</p>
                  </div>
                )}

                {/* Status */}
                <div className="flex items-center gap-3">
                  <span className="font-semibold">Trạng thái:</span>
                  {getStatusBadge(selectedSubmission.status)}
                </div>

                {/* Reject reason input for pending status */}
                {selectedSubmission.status === "pending" && (
                  <div>
                    <label className="block font-semibold text-gray-900 mb-2">
                      Lý do từ chối (nếu có)
                    </label>
                    <textarea
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                      rows={3}
                      className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="Nhập lý do từ chối..."
                    />
                  </div>
                )}

                {/* Reject reason display */}
                {selectedSubmission.reasonReject && (
                  <div className="bg-red-50 p-4 rounded-xl border-2 border-red-200">
                    <h3 className="font-bold text-red-900 mb-2">
                      Lý do từ chối
                    </h3>
                    <p className="text-red-700">
                      {selectedSubmission.reasonReject}
                    </p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t">
                  {selectedSubmission.status === "pending" ? (
                    <>
                      <button
                        onClick={() => handleApprove(selectedSubmission._id)}
                        disabled={processing === selectedSubmission._id}
                        className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 font-bold transition-all shadow-lg disabled:opacity-50"
                      >
                        {processing === selectedSubmission._id ? (
                          <>
                            <Loader2 size={20} className="animate-spin" />
                            Đang xử lý...
                          </>
                        ) : (
                          <>
                            <CheckCircle size={20} />
                            Duyệt
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => handleReject(selectedSubmission._id)}
                        disabled={processing === selectedSubmission._id}
                        className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 font-bold transition-all shadow-lg disabled:opacity-50"
                      >
                        {processing === selectedSubmission._id ? (
                          <>
                            <Loader2 size={20} className="animate-spin" />
                            Đang xử lý...
                          </>
                        ) : (
                          <>
                            <XCircle size={20} />
                            Từ chối
                          </>
                        )}
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => {
                        setShowModal(false);
                        setRejectReason("");
                      }}
                      className="w-full px-6 py-3 bg-gradient-to-r from-orange-400 to-orange-1000 text-white rounded-xl hover:opacity-90 font-bold transition-all"
                    >
                      Đóng
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskSubmissionManagement;
