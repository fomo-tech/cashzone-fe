import React, { useState, useMemo, useEffect } from "react";
import {
  DollarSign,
  RefreshCw,
  CheckCircle,
  XCircle,
  TrendingUp,
  Search,
  Loader,
} from "lucide-react";
import StatCard from "@/components/admin/StatCard";
import cashbackService from "@/services/cashbackService";
import type { CashbackStatistics } from "@/services/cashbackService";
import { notification } from "@/utils/notification";

// Định nghĩa kiểu dữ liệu cho giao dịch Cashback
interface CashbackTransaction {
  id: string;
  userId: string;
  userName: string;
  amount: number; // Số tiền Cashback
  source: string; // Nguồn: 'Order #12345', 'Referral Bonus'
  status: "pending" | "completed" | "rejected";
  date: string;
  platform: string;
  percentage: number;
  purchaseAmount: number;
}

const CashbackManagement: React.FC = () => {
  const [transactions, setTransactions] = useState<CashbackTransaction[]>([]);
  const [statistics, setStatistics] = useState<CashbackStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<
    "All" | "pending" | "completed" | "rejected"
  >("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 20;

  // Fetch cashback data from API
  const fetchCashbacks = async () => {
    try {
      setLoading(true);
      const filters: any = {
        page: currentPage,
        limit: pageSize,
      };

      if (filterStatus !== "All") {
        filters.status = filterStatus;
      }

      const response = await cashbackService.getAllCashbacks(filters);

      // Transform API data to component format
      const transformedData: CashbackTransaction[] = response.data.map(
        (item) => ({
          id: item._id,
          userId: item.userId._id,
          userName: item.userId.name,
          amount: item.cashbackAmount,
          source: item.offerId.title,
          status: item.status,
          date: new Date(item.createdAt).toLocaleDateString("vi-VN"),
          purchaseAmount: item.purchaseAmount,
          percentage: item.percentage,
          platform: item.flatformId.name,
        })
      );

      setTransactions(transformedData);
      setTotalPages(response.pagination.totalPages);
    } catch (error: any) {
      notification({
        type: "error",
        message: error.response?.data?.message || "Không thể tải dữ liệu",
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch statistics
  const fetchStatistics = async () => {
    try {
      const stats = await cashbackService.getCashbackStatistics();
      setStatistics(stats);
    } catch (error) {
      console.error("Failed to fetch statistics:", error);
    }
  };

  useEffect(() => {
    fetchCashbacks();
    fetchStatistics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, filterStatus]);

  // Utility function to format currency (Vietnamese Dong)
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  // Tính toán thống kê tổng quan
  const stats = useMemo(() => {
    if (statistics) {
      return {
        totalEarned: statistics.totalAmount,
        totalPaid: statistics.completedAmount,
        totalPending: statistics.pendingAmount,
      };
    }
    return { totalEarned: 0, totalPaid: 0, totalPending: 0 };
  }, [statistics]);

  // Xử lý hành động Duyệt/Từ chối
  const handleAction = async (
    id: string,
    newStatus: "completed" | "rejected"
  ) => {
    try {
      setActionLoading(id);
      await cashbackService.updateCashbackStatus(id, { status: newStatus });
      notification({
        type: "success",
        message: "Đã cập nhật trạng thái thành công",
      });
      await fetchCashbacks();
      await fetchStatistics();
    } catch (error: any) {
      notification({
        type: "error",
        message:
          error.response?.data?.message || "Không thể cập nhật trạng thái",
      });
    } finally {
      setActionLoading(null);
    }
  };

  // Component cho trạng thái
  const StatusBadge: React.FC<{ status: CashbackTransaction["status"] }> = ({
    status,
  }) => {
    let colorClass = "";
    let text = "";

    switch (status) {
      case "pending":
        colorClass = "bg-amber-100 text-amber-800";
        text = "Chờ duyệt";
        break;
      case "completed":
        colorClass =
          "bg-gradient-to-r from-[#E91E63]/10 to-[#FF8C1A]/10 text-[#E91E63] border border-[#E91E63]/30";
        text = "Đã hoàn thành";
        break;
      case "rejected":
        colorClass = "bg-red-100 text-red-800";
        text = "Từ chối";
        break;
      default:
        colorClass = "bg-slate-100 text-slate-800";
        text = "Không rõ";
    }

    return (
      <span
        className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${colorClass}`}
      >
        {text}
      </span>
    );
  };

  // Lọc và tìm kiếm giao dịch
  const filteredTransactions = transactions.filter((t) => {
    const searchMatch =
      t.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.source.toLowerCase().includes(searchTerm.toLowerCase());
    return searchMatch;
  });

  // Reset trang về 1 khi lọc/tìm kiếm thay đổi
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  if (loading && transactions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="w-8 h-8 animate-spin text-[#E91E63]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-extrabold text-slate-800 flex items-center gap-3">
            <DollarSign className="w-8 h-8 text-[#E91E63]" />
            Quản Lý Cashback
          </h1>
        </div>

        {/* 1. Thống kê Tổng quan (Stats) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            icon={<TrendingUp />}
            title="Tổng Số Tiền Đã Ghi Nhận"
            value={formatCurrency(stats.totalEarned)}
            color="text-[#E91E63]"
          />
          <StatCard
            icon={<CheckCircle />}
            title="Tổng Số Tiền Đã Thanh Toán"
            value={formatCurrency(stats.totalPaid)}
            color="text-[#E91E63]"
          />
          <StatCard
            icon={<RefreshCw />}
            title="Số Tiền Đang Chờ Duyệt"
            value={formatCurrency(stats.totalPending)}
            color="text-amber-600"
          />
        </div>

        {/* 2. Bảng Giao dịch Cashback */}
        <div className="bg-white rounded-xl shadow-lg border border-slate-100 p-6">
          <h2 className="text-xl font-bold text-slate-800 mb-4 border-b pb-2">
            Danh Sách Giao Dịch
          </h2>

          {/* Thanh Lọc & Tìm kiếm */}
          <div className="flex flex-col sm:flex-row gap-4 mb-5 items-center">
            <div className="relative w-full sm:w-80">
              <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Tìm theo Tên User hoặc Nguồn..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 text-slate-700"
              />
            </div>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="w-full sm:w-48 px-4 py-2 border border-slate-300 rounded-xl bg-white focus:ring-indigo-500 focus:border-indigo-500 text-slate-700"
            >
              <option value="All">Tất cả trạng thái</option>
              <option value="pending">Chờ duyệt</option>
              <option value="completed">Đã hoàn thành</option>
              <option value="rejected">Từ chối</option>
            </select>
            <p className="text-sm text-slate-500 ml-auto">
              Hiển thị:{" "}
              <span className="font-bold text-slate-800">
                {filteredTransactions.length}
              </span>{" "}
              giao dịch
            </p>
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
                    Người dùng
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Số tiền
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Nguồn
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Ngày
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-100">
                {filteredTransactions.length > 0 ? (
                  filteredTransactions.map((t) => (
                    <tr
                      key={t.id}
                      className="hover:bg-gradient-to-r from-pink-50 to-orange-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                        #{t.id.slice(-6)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                        {t.userName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-[#E91E63]">
                        {formatCurrency(t.amount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                        {t.source}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                        {t.date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <StatusBadge status={t.status} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-center">
                        {t.status === "pending" ? (
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={() => handleAction(t.id, "completed")}
                              disabled={actionLoading === t.id}
                              title="Duyệt"
                              className="text-[#E91E63] hover:text-white hover:bg-gradient-to-r hover:from-[#E91E63] hover:to-[#FF8C1A] border border-[#E91E63] p-2 rounded-full transition duration-150 disabled:opacity-50"
                            >
                              {actionLoading === t.id ? (
                                <Loader className="w-5 h-5 animate-spin" />
                              ) : (
                                <CheckCircle className="w-5 h-5" />
                              )}
                            </button>
                            <button
                              onClick={() => handleAction(t.id, "rejected")}
                              disabled={actionLoading === t.id}
                              title="Từ chối"
                              className="text-red-600 hover:text-white hover:bg-red-600 border border-red-600 p-2 rounded-full transition duration-150 disabled:opacity-50"
                            >
                              {actionLoading === t.id ? (
                                <Loader className="w-5 h-5 animate-spin" />
                              ) : (
                                <XCircle className="w-5 h-5" />
                              )}
                            </button>
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400">
                            Đã xử lý
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-slate-500">
                      Không tìm thấy giao dịch nào.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Phân trang */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center mt-6">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-slate-300 rounded-xl text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 disabled:opacity-50"
              >
                Trang Trước
              </button>
              <span className="text-sm text-slate-700">
                Trang <span className="font-bold">{currentPage}</span> /{" "}
                <span className="font-bold">{totalPages}</span>
              </span>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="px-4 py-2 border border-slate-300 rounded-xl text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 disabled:opacity-50"
              >
                Trang Sau
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CashbackManagement;
