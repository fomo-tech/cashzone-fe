import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  DollarSign,
  Clock,
  CheckCircle,
  History,
  ArrowUpRight,
  ArrowDownRight,
  Percent,
  Sparkles,
  Target,
  Award,
  Package,
  Calendar,
  LinkIcon,
} from "lucide-react";
import cashbackService from "@/services/cashbackService";
import { SkeletonTable } from "@/components/ui/Skeleton";

interface OrderTracking {
  _id: string;
  orderId: string;
  userId: string;
  affiliateLinkId: string;
  orderAmount: number;
  cashbackRate: number;
  cashbackAmount: number;
  cashbackStatus: "pending" | "processing" | "approved" | "rejected" | "paid";
  createdAt: string;
  updatedAt: string;
}

const CashbackHistory: React.FC = () => {
  // Quick stats state
  const [quickStats, setQuickStats] = useState({
    totalLinks: 0,
    totalEarned: 0,
    pendingAmount: 0,
    approvedAmount: 0,
    paidAmount: 0,
  });

  // Order tracking state
  const [orders, setOrders] = useState<OrderTracking[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Load quick stats function
  const loadQuickStats = async () => {
    try {
      // Load both link stats and cashback stats using proper service
      const [linkStats, cashbackStats] = await Promise.all([
        cashbackService.getUserLinkStats(),
        cashbackService.getUserCashbackStatsNew(),
      ]);

      setQuickStats({
        totalLinks: linkStats?.totalLinks || 0,
        totalEarned: cashbackStats?.totalCashback || 0,
        pendingAmount: cashbackStats?.pendingCashback || 0,
        approvedAmount: cashbackStats?.approvedCashback || 0,
        paidAmount: cashbackStats?.paidCashback || 0,
      });
    } catch (error) {
      console.error("Error loading quick stats:", error);
      // Set default values on error
      setQuickStats({
        totalLinks: 0,
        totalEarned: 0,
        pendingAmount: 0,
        approvedAmount: 0,
        paidAmount: 0,
      });
    }
  };

  // Load orders function
  const loadOrders = async () => {
    try {
      setLoading(true);
      const response = await cashbackService.getUserOrders({
        page,
        limit: 10,
      });
      setOrders(response.orders || []);
      setTotalPages(response.totalPages || 1);
    } catch (error) {
      console.error("Error loading orders:", error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  // Load quick stats and orders
  useEffect(() => {
    loadQuickStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    loadOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<
      string,
      { color: string; bg: string; text: string; icon: any }
    > = {
      pending: {
        color: "text-amber-700",
        bg: "bg-amber-50 border-amber-200",
        text: "Chờ duyệt",
        icon: Clock,
      },
      processing: {
        color: "text-purple-700",
        bg: "bg-purple-50 border-purple-200",
        text: "Đang xử lý",
        icon: Clock,
      },
      approved: {
        color: "text-blue-700",
        bg: "bg-blue-50 border-blue-200",
        text: "Đã duyệt",
        icon: CheckCircle,
      },
      rejected: {
        color: "text-red-700",
        bg: "bg-red-50 border-red-200",
        text: "Từ chối",
        icon: Clock,
      },
      paid: {
        color: "text-green-700",
        bg: "bg-green-50 border-green-200",
        text: "Đã thanh toán",
        icon: Award,
      },
    };

    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <span
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold ${config.bg} ${config.color}`}
      >
        <Icon className="w-3.5 h-3.5" />
        {config.text}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-pink-50/30 to-orange-50/30">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Premium Header with Gradient */}
        <div className="relative mb-8 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500 via-orange-600 to-amber-600 opacity-5 rounded-3xl"></div>
          <div className="relative rounded-2xl backdrop-blur-sm  p-6 md:p-8">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 via-orange-600 to-amber-600 flex items-center justify-center shadow-lg">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl md:text-3xl font-black bg-gradient-to-br from-orange-500 via-orange-600 to-amber-600 bg-clip-text text-transparent">
                      Hoàn Tiền Mua Sắm
                    </h1>
                    <p className="text-gray-600 text-sm mt-1">
                      Quản lý số tiền hoàn và lịch sử nhận thưởng
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-gradient-to-r from-green-50 to-emerald-50 px-5 py-3 rounded-2xl border border-green-100">
                <Target className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-xs text-gray-600 font-bold">
                    Tổng doanh thu
                  </p>
                  <p className="text-xl font-black text-green-600">
                    {formatCurrency(quickStats.totalEarned)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Premium Stats Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
          {/* Total Links Card */}
          <div className="group relative overflow-hidden bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-pink-200">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-pink-100/50 to-transparent rounded-full -mr-16 -mt-16"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <LinkIcon className="w-7 h-7 text-white" />
                </div>
                <div className="px-3 py-1 bg-pink-50 rounded-full">
                  <p className="text-xs font-bold text-pink-600">Active</p>
                </div>
              </div>
              <p className="text-sm text-gray-500 font-bold mb-1">
                Link đã tạo
              </p>
              <p className="text-3xl font-black text-gray-900 mb-2">
                {quickStats.totalLinks}
              </p>
              <div className="flex items-center gap-1 text-green-600">
                <ArrowUpRight className="w-4 h-4" />
                <span className="text-xs font-bold">Hoạt động</span>
              </div>
            </div>
          </div>

          {/* Pending Amount Card */}
          <div className="group relative overflow-hidden bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-amber-200">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-100/50 to-transparent rounded-full -mr-16 -mt-16"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <Clock className="w-7 h-7 text-white" />
                </div>
                <div className="px-3 py-1 bg-amber-50 rounded-full">
                  <p className="text-xs font-bold text-amber-600">Pending</p>
                </div>
              </div>
              <p className="text-sm text-gray-500 font-bold mb-1">Chờ duyệt</p>
              <p className="text-3xl font-black text-gray-900 mb-2">
                {formatCurrency(quickStats.pendingAmount)}
              </p>
              <div className="flex items-center gap-1 text-amber-600">
                <Clock className="w-4 h-4" />
                <span className="text-xs font-bold">Đang xử lý</span>
              </div>
            </div>
          </div>

          {/* Approved Amount Card */}
          <div className="group relative overflow-hidden bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-200">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-100/50 to-transparent rounded-full -mr-16 -mt-16"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <CheckCircle className="w-7 h-7 text-white" />
                </div>
                <div className="px-3 py-1 bg-blue-50 rounded-full">
                  <p className="text-xs font-bold text-blue-600">Approved</p>
                </div>
              </div>
              <p className="text-sm text-gray-500 font-bold mb-1">Đã duyệt</p>
              <p className="text-3xl font-black text-gray-900 mb-2">
                {formatCurrency(quickStats.approvedAmount)}
              </p>
              <div className="flex items-center gap-1 text-blue-600">
                <CheckCircle className="w-4 h-4" />
                <span className="text-xs font-bold">Xác nhận</span>
              </div>
            </div>
          </div>

          {/* Paid Amount Card */}
          <div className="group relative overflow-hidden bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-green-400">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <Award className="w-7 h-7 text-white" />
                </div>
                <div className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full">
                  <p className="text-xs font-bold text-white">Paid</p>
                </div>
              </div>
              <p className="text-sm text-green-100 font-bold mb-1">
                Đã thanh toán
              </p>
              <p className="text-3xl font-black text-white mb-2">
                {formatCurrency(quickStats.paidAmount)}
              </p>
              <div className="flex items-center gap-1 text-green-100">
                <DollarSign className="w-4 h-4" />
                <span className="text-xs font-bold">Hoàn thành</span>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl p-5 border border-purple-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-bold mb-1">
                  Tỷ lệ chuyển đổi
                </p>
                <p className="text-2xl font-black text-purple-600">
                  {quickStats.totalLinks > 0
                    ? (
                        (quickStats.paidAmount /
                          (quickStats.totalEarned || 1)) *
                        100
                      ).toFixed(1)
                    : "0.0"}
                  %
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-violet-500 flex items-center justify-center">
                <Percent className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-5 border border-orange-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-bold mb-1">
                  Thu nhập/Link
                </p>
                <p className="text-2xl font-black text-orange-600">
                  {quickStats.totalLinks > 0
                    ? formatCurrency(
                        quickStats.totalEarned / quickStats.totalLinks,
                      )
                    : formatCurrency(0)}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl p-5 border border-pink-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-bold mb-1">
                  Đang xử lý
                </p>
                <p className="text-2xl font-black text-pink-600">
                  {quickStats.totalEarned > 0
                    ? (
                        (quickStats.pendingAmount / quickStats.totalEarned) *
                        100
                      ).toFixed(1)
                    : "0.0"}
                  %
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center">
                <ArrowDownRight className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content - Order Tracking List */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white">
          <div className="p-6 md:p-8 border-b border-gray-100">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 via-orange-600 to-amber-600 flex items-center justify-center">
                <History className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl md:text-2xl font-black text-gray-900">
                Danh sách đơn hoàn tiền
              </h2>
            </div>
            <p className="text-sm text-gray-500 ml-13">
              Theo dõi tất cả các đơn hàng hoàn tiền của bạn
            </p>
          </div>

          <div className="p-4 md:p-8">
            {loading ? (
              <SkeletonTable rows={5} columns={6} />
            ) : orders.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center mx-auto mb-4">
                  <Package className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  Chưa có đơn hàng nào
                </h3>
                <p className="text-sm text-gray-500">
                  Các đơn hàng hoàn tiền sẽ hiển thị ở đây
                </p>
              </div>
            ) : (
              <>
                {/* Mobile View */}
                <div className="block md:hidden space-y-4">
                  {orders.map((order) => (
                    <div
                      key={order._id}
                      className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-all"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="text-xs text-gray-500 mb-1">
                            Mã đơn hàng
                          </p>
                          <p className="text-sm font-bold text-gray-900">
                            {order.orderId}
                          </p>
                        </div>
                        {getStatusBadge(order.cashbackStatus)}
                      </div>

                      <div className="grid grid-cols-2 gap-3 mb-3">
                        <div>
                          <p className="text-xs text-gray-500 mb-1">
                            Giá trị đơn hàng
                          </p>
                          <p className="text-sm font-bold text-gray-900">
                            {formatCurrency(order.orderAmount)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">
                            Hoàn tiền
                          </p>
                          <p className="text-sm font-bold text-green-600">
                            {formatCurrency(order.cashbackAmount)}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Tỷ lệ</p>
                          <p className="text-sm font-semibold text-orange-600">
                            {order.cashbackRate}%
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Ngày tạo</p>
                          <p className="text-xs text-gray-700">
                            {formatDate(order.createdAt)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Desktop Table View */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-4 px-4 text-xs font-bold text-gray-600 uppercase tracking-wider">
                          Mã đơn hàng
                        </th>
                        <th className="text-left py-4 px-4 text-xs font-bold text-gray-600 uppercase tracking-wider">
                          Giá trị
                        </th>
                        <th className="text-left py-4 px-4 text-xs font-bold text-gray-600 uppercase tracking-wider">
                          Tỷ lệ
                        </th>
                        <th className="text-left py-4 px-4 text-xs font-bold text-gray-600 uppercase tracking-wider">
                          Hoàn tiền
                        </th>
                        <th className="text-left py-4 px-4 text-xs font-bold text-gray-600 uppercase tracking-wider">
                          Trạng thái
                        </th>
                        <th className="text-left py-4 px-4 text-xs font-bold text-gray-600 uppercase tracking-wider">
                          Ngày tạo
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order) => (
                        <tr
                          key={order._id}
                          className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                        >
                          <td className="py-4 px-4">
                            <span className="text-sm font-semibold text-gray-900">
                              {order.orderId}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <span className="text-sm font-semibold text-gray-900">
                              {formatCurrency(order.orderAmount)}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <span className="text-sm font-semibold text-orange-600">
                              {order.cashbackRate}%
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <span className="text-sm font-bold text-green-600">
                              {formatCurrency(order.cashbackAmount)}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            {getStatusBadge(order.cashbackStatus)}
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Calendar className="w-4 h-4" />
                              {formatDate(order.createdAt)}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-6 pt-6 border-t border-gray-200">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Trước
                    </button>
                    <span className="text-sm text-gray-600 px-4">
                      Trang {page} / {totalPages}
                    </span>
                    <button
                      onClick={() =>
                        setPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={page === totalPages}
                      className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Sau
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Tips Section */}
        <div className="mt-8 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-100">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                💡 Mẹo tối ưu doanh thu
              </h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>
                    Chia sẻ link trên nhiều nền tảng mạng xã hội để tăng lượt
                    truy cập
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Theo dõi thống kê để biết link nào hiệu quả nhất</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>
                    Cập nhật thông tin thanh toán để nhận tiền nhanh chóng
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CashbackHistory;
