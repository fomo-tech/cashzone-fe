import React, { useEffect, useState } from "react";
import {
  Search,
  Filter,
  Download,
  Calendar,
  TrendingUp,
  Users,
  Coins,
  Activity,
} from "lucide-react";
import activityEarningService, {
  type ActivityEarning,
  type ActivityEarningStats,
} from "@/services/activityEarningService";
import { useAppStore } from "@/store/appStore";
import Pagination from "@/components/common/Pagination";
import type { IPagination } from "@/utils/types/pagination";

const ActivityEarningManagement: React.FC = () => {
  const [earnings, setEarnings] = useState<ActivityEarning[]>([]);
  const [pagination, setPagination] = useState<IPagination>(null);
  const [stats, setStats] = useState<ActivityEarningStats | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchUserId, setSearchUserId] = useState("");
  const [activityTypeFilter, setActivityTypeFilter] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);
  const { setToast } = useAppStore();

  const activityTypeLabels: Record<string, string> = {
    checkin: "Điểm danh",
    lucky_wheel: "Vòng quay",
    task: "Nhiệm vụ",
    referral_bonus: "Giới thiệu",
    other: "Khác",
  };

  const activityTypeColors: Record<string, string> = {
    checkin: "bg-blue-100 text-blue-800",
    lucky_wheel: "bg-orange-100 text-orange-800",
    task: "bg-green-100 text-green-800",
    referral_bonus: "bg-purple-100 text-purple-800",
    other: "bg-gray-100 text-gray-800",
  };

  const fetchEarnings = async (page: number = 1) => {
    try {
      setLoading(true);
      const params: any = {
        page,
        limit: 20,
      };

      if (searchUserId) params.userId = searchUserId;
      if (activityTypeFilter) params.activityType = activityTypeFilter;
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      const response = await activityEarningService.getAllActivityEarnings(
        params
      );
      setEarnings(response.history);
      setPagination(response.pagination);
    } catch (error: any) {
      setToast({
        title:
          error.response?.data?.message || "Không thể tải lịch sử hoạt động",
        type: "error",
        isVisible: true,
        timer: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const params: any = {};
      if (searchUserId) params.userId = searchUserId;
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      const response = await activityEarningService.getActivityEarningStats(
        params
      );
      setStats(response);
    } catch (error: any) {
      console.error("Failed to fetch stats:", error);
    }
  };

  useEffect(() => {
    fetchEarnings(currentPage);
    fetchStats();
  }, [currentPage, searchUserId, activityTypeFilter, startDate, endDate]);

  const handleSearch = () => {
    setCurrentPage(1);
    fetchEarnings(1);
    fetchStats();
  };

  const handleReset = () => {
    setSearchUserId("");
    setActivityTypeFilter("");
    setStartDate("");
    setEndDate("");
    setCurrentPage(1);
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

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <Activity className="h-8 w-8 text-orange-500" />
          <h1 className="text-3xl font-bold text-gray-800">
            Lịch Sử Hoạt Động Cộng Tiền
          </h1>
        </div>
        <p className="text-gray-600">
          Quản lý và theo dõi lịch sử cộng tiền từ các hoạt động của người dùng
        </p>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-4 text-white">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="h-6 w-6" />
              <span className="text-xs font-medium bg-white/20 px-2 py-1 rounded">
                Tổng
              </span>
            </div>
            <p className="text-2xl font-bold">
              {formatCurrency(stats.overall.total)}
            </p>
            <p className="text-sm text-blue-100">Tổng tiền cộng</p>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-4 text-white">
            <div className="flex items-center justify-between mb-2">
              <Activity className="h-6 w-6" />
              <span className="text-xs font-medium bg-white/20 px-2 py-1 rounded">
                Hoạt động
              </span>
            </div>
            <p className="text-2xl font-bold">{stats.overall.count}</p>
            <p className="text-sm text-green-100">Tổng lượt cộng tiền</p>
          </div>

          {stats.byActivityType.map((item) => (
            <div
              key={item._id}
              className="bg-white border border-gray-200 rounded-lg p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <Coins className="h-6 w-6 text-orange-500" />
                <span
                  className={`text-xs font-medium px-2 py-1 rounded ${
                    activityTypeColors[item._id] || "bg-gray-100"
                  }`}
                >
                  {activityTypeLabels[item._id] || item._id}
                </span>
              </div>
              <p className="text-xl font-bold text-gray-800">
                {formatCurrency(item.totalAmount)}
              </p>
              <p className="text-sm text-gray-500">{item.count} lượt</p>
            </div>
          ))}
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="h-5 w-5 text-gray-500" />
          <h2 className="text-lg font-semibold text-gray-800">Bộ lọc</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              User ID
            </label>
            <input
              type="text"
              placeholder="Nhập User ID..."
              value={searchUserId}
              onChange={(e) => setSearchUserId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Loại hoạt động
            </label>
            <select
              value={activityTypeFilter}
              onChange={(e) => setActivityTypeFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="">Tất cả</option>
              <option value="checkin">Điểm danh</option>
              <option value="lucky_wheel">Vòng quay</option>
              <option value="task">Nhiệm vụ</option>
              <option value="referral_bonus">Giới thiệu</option>
              <option value="other">Khác</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Từ ngày
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Đến ngày
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>

          <div className="flex items-end gap-2">
            <button
              onClick={handleSearch}
              className="flex-1 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors font-medium"
            >
              <Search className="h-4 w-4 inline mr-1" />
              Tìm
            </button>
            <button
              onClick={handleReset}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Người dùng
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Hoạt động
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Loại
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Số tiền
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Số dư trước
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Số dư sau
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Thời gian
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                  </td>
                </tr>
              ) : earnings.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-8 text-center text-gray-500"
                  >
                    Không có dữ liệu
                  </td>
                </tr>
              ) : (
                earnings.map((earning) => (
                  <tr key={earning._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {earning.userId.avatar ? (
                          <img
                            src={earning.userId.avatar}
                            alt={earning.userId.name}
                            className="h-8 w-8 rounded-full"
                          />
                        ) : (
                          <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center">
                            <Users className="h-4 w-4 text-orange-600" />
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-medium text-gray-800">
                            {earning.userId.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {earning.userId.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm text-gray-800">
                        {earning.activityName}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          activityTypeColors[earning.activityType] ||
                          "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {activityTypeLabels[earning.activityType] ||
                          earning.activityType}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="text-sm font-semibold text-green-600">
                        +{formatCurrency(earning.amount)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="text-sm text-gray-600">
                        {formatCurrency(earning.balanceBefore)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="text-sm font-medium text-gray-800">
                        {formatCurrency(earning.balanceAfter)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Calendar className="h-3 w-3" />
                        {formatDate(earning.createdAt)}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="px-4 py-3 border-t border-gray-200">
            <Pagination
              currentPage={currentPage}
              totalPages={pagination.totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityEarningManagement;
