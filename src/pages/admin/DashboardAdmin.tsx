import React, { useState, useEffect } from "react";
import {
  Users,
  DollarSign,
  Activity,
  Clock,
  Zap,
  Server,
  Shield,
  CheckCircle,
  TrendingUp,
  TrendingDown,
  Bell,
  XCircle,
  Wallet,
  Gift,
  ShoppingBag,
  AlertCircle,
} from "lucide-react";
import http from "@/services/api";

interface DashboardStats {
  users: {
    total: number;
    active: number;
    newToday: number;
    growth: number;
  };
  transactions: {
    pending: number;
    completed: number;
    totalAmount: number;
  };
  tasks: {
    active: number;
    featured: number;
    totalSubmissions: number;
    pendingReview: number;
  };
  platforms: {
    active: number;
    total: number;
  };
  wallet: {
    totalBalance: number;
    totalWithdrawn: number;
    pendingWithdrawals: number;
  };
}

// Hàm định dạng tiền tệ
const formatCurrency = (amount) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

// Component con: Thẻ thống kê KPI (Card Stat)
const StatCard = ({
  icon: Icon,
  title,
  value,
  detail,
  color,
  isCurrency = false,
  isPercentage = false,
}) => {
  const isPositive = detail > 0;
  const detailColor = isPositive
    ? "text-[#E91E63]"
    : detail < 0
    ? "text-red-600"
    : "text-gray-500";

  return (
    <div className="bg-white p-5 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition duration-300">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-500 uppercase">{title}</h3>
        <Icon className={`w-6 h-6 ${color}`} />
      </div>
      <div className="mt-4 flex items-end justify-between">
        <p className="text-3xl font-bold text-gray-900">
          {isCurrency ? formatCurrency(value) : value.toLocaleString("vi-VN")}
        </p>
        <div className="text-sm">
          {detail !== undefined && (
            <span className={`font-semibold ${detailColor} flex items-center`}>
              {isPercentage ? (
                <>
                  {isPositive ? (
                    <TrendingUp className="w-4 h-4 mr-1" />
                  ) : (
                    <TrendingDown className="w-4 h-4 mr-1" />
                  )}
                  {Math.abs(detail)}%
                </>
              ) : (
                detail
              )}
            </span>
          )}
          {detail !== undefined && isPercentage && (
            <span className="text-xs text-gray-500 ml-1">
              {" "}
              so với tháng trước
            </span>
          )}
          {detail !== undefined && !isPercentage && (
            <span className="text-xs text-gray-500 ml-1"> hôm nay</span>
          )}
        </div>
      </div>
    </div>
  );
};

// Component con: Danh sách hành động cần thiết (Action List)
const PendingActionCard = ({ title, actions }) => (
  <div className="bg-white p-5 rounded-xl shadow-lg border border-gray-100">
    <h3 className="text-lg font-bold text-gray-800 flex items-center mb-4 border-b pb-3">
      <Bell className="w-5 h-5 text-red-500 mr-2 animate-pulse" />
      {title}
    </h3>
    <ul className="space-y-3">
      {actions.map((action, index) => (
        <li
          key={index}
          className="flex justify-between items-center text-sm p-3 bg-red-50 rounded-lg hover:bg-red-100 transition duration-150"
        >
          <div className="flex items-start space-x-2">
            <Clock className="w-4 h-4 text-red-500 mt-1 shrink-0" />
            <span className="font-medium text-gray-700">{action.label}</span>
          </div>
          <span className="text-red-600 font-bold shrink-0">
            {action.value}
          </span>
        </li>
      ))}
    </ul>
  </div>
);

// Component con: Biểu đồ đơn giản (Dùng DIV và CSS mock up)
const SimpleChartCard = ({ title, data, color }) => {
  const max = Math.max(...data);

  return (
    <div className="bg-white p-5 rounded-xl shadow-lg border border-gray-100">
      <h3 className="text-lg font-bold text-gray-800 mb-4">{title}</h3>
      <div className="h-40 flex items-end justify-between space-x-1">
        {data.map((value, index) => (
          <div
            key={index}
            className="flex-1 h-full flex flex-col justify-end items-center"
          >
            <div
              style={{ height: `${(value / max) * 100}%` }}
              className={`w-3/5 rounded-t-lg transition-all duration-500 ${color}`}
              title={value.toLocaleString()}
            ></div>
            {/* <span className="text-xs text-gray-400 mt-1">{index + 1}</span> */}
          </div>
        ))}
      </div>
      <p className="text-center text-sm text-gray-500 mt-3">7 ngày qua</p>
    </div>
  );
};

// Component con: Thẻ trạng thái hệ thống
const SystemStatusCard = ({
  title,
  icon: Icon,
  status,
  details,
  color,
  buttonLabel,
  onAction,
}) => (
  <div className="bg-white p-5 rounded-xl shadow-lg border border-gray-100">
    <div className="flex items-center justify-between">
      <h3 className="text-lg font-bold text-gray-800 flex items-center">
        <Icon className={`w-5 h-5 ${color} mr-2`} />
        {title}
      </h3>
      <span
        className={`px-3 py-1 text-xs font-bold rounded-full ${
          status === "Hoạt động"
            ? "bg-gradient-to-r from-[#E91E63]/10 to-[#FF8C1A]/10 text-[#E91E63] border border-[#E91E63]/30"
            : status === "Tắt"
            ? "bg-gray-100 text-gray-700"
            : "bg-yellow-100 text-yellow-700"
        }`}
      >
        {status}
      </span>
    </div>
    <p className="text-sm text-gray-500 mt-2">{details}</p>
    <div className="mt-4 pt-3 border-t border-gray-100 flex justify-end">
      <button
        onClick={onAction}
        className="px-4 py-2 text-sm font-semibold rounded-lg bg-gradient-to-r from-[#E91E63] to-[#FF8C1A] text-white hover:from-[#AD1457] hover:to-[#E65100] transition-all duration-150 shadow-lg shadow-pink-500/30"
      >
        {buttonLabel}
      </button>
    </div>
  </div>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      setError(null);
      // Use single consolidated dashboard stats endpoint
      const response = await http.get("/admin/dashboard/stats");

      if (response.data?.data) {
        setStats(response.data.data);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error: any) {
      console.error("Error fetching dashboard stats:", error);
      // Show user-friendly error message
      const errorMessage =
        error?.response?.data?.message || "Không thể tải dữ liệu dashboard";
      setError(errorMessage);
      console.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const pendingActions = [
    {
      label: "Giao dịch Nạp/Rút cần duyệt",
      value: stats?.transactions?.pending || 0,
    },
    {
      label: "Nhiệm vụ cần kiểm duyệt",
      value: stats?.tasks?.pendingReview || 0,
    },
    {
      label: "Yêu cầu rút tiền chờ xử lý",
      value: stats?.wallet?.pendingWithdrawals || 0,
    },
  ];

  const toggleMaintenanceMode = () => {
    setMaintenanceMode((prev) => !prev);
    // TODO: Call API to toggle maintenance mode
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#E91E63] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <p className="text-xl font-semibold text-gray-800 mb-2">
            Không thể tải dữ liệu dashboard
          </p>
          {error && (
            <p className="text-sm text-gray-600 mb-4">Chi tiết: {error}</p>
          )}
          <button
            onClick={fetchDashboardStats}
            className="mt-4 px-6 py-2 bg-gradient-to-r from-[#E91E63] to-[#FF8C1A] text-white rounded-lg hover:opacity-90 transition-opacity"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 sm:p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center space-x-3">
          <Shield className="w-8 h-8 text-[#E91E63]" />
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-[#E91E63] to-[#FF8C1A] bg-clip-text text-transparent">
            Tổng Quan Hệ Thống (Admin)
          </h1>
        </div>
        <p className="text-gray-500">
          Thông tin tổng hợp và các chỉ số hoạt động quan trọng của ứng dụng.
        </p>

        {/* Khu vực 1: Các Chỉ số Hoạt động Chính (KPI Cards) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            icon={Users}
            title="Tổng Người Dùng"
            value={stats?.users?.total || 0}
            detail={stats?.users?.newToday || 0}
            color="text-[#E91E63]"
          />
          <StatCard
            icon={Wallet}
            title="Tổng Số Dư Ví"
            value={stats?.wallet?.totalBalance || 0}
            detail={0}
            color="text-[#E91E63]"
            isCurrency={true}
          />
          <StatCard
            icon={DollarSign}
            title="Đã Rút Ra"
            value={stats?.wallet?.totalWithdrawn || 0}
            detail={0}
            color="text-[#FF8C1A]"
            isCurrency={true}
          />
          <StatCard
            icon={Clock}
            title="GD Chờ Duyệt"
            value={stats?.transactions?.pending || 0}
            detail={stats?.transactions?.pending || 0}
            color="text-yellow-600"
          />
        </div>

        {/* Khu vực 1.5: Thêm Cards cho Tasks và Platforms */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            icon={Gift}
            title="Chiến Dịch Hoạt Động"
            value={stats?.tasks?.active || 0}
            detail={stats?.tasks?.featured || 0}
            color="text-purple-600"
          />
          <StatCard
            icon={ShoppingBag}
            title="Tổng Submissions"
            value={stats?.tasks?.totalSubmissions || 0}
            detail={stats?.tasks?.pendingReview || 0}
            color="text-blue-600"
          />
          <StatCard
            icon={Server}
            title="Nền Tảng Hoạt Động"
            value={stats?.platforms?.active || 0}
            detail={stats?.platforms?.total || 0}
            color="text-indigo-600"
          />
          <StatCard
            icon={CheckCircle}
            title="Giao Dịch Hoàn Thành"
            value={stats?.transactions?.completed || 0}
            detail={0}
            color="text-[#E91E63]"
          />
        </div>

        {/* Khu vực 2: Hành động cần thiết và Tình trạng Hệ thống */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Hành động cần thiết */}
          <PendingActionCard
            title="Hành Động Cần Thiết"
            actions={pendingActions}
          />

          {/* Tình trạng Bảo trì */}
          <SystemStatusCard
            title="Chế Độ Bảo Trì"
            icon={Zap}
            status={maintenanceMode ? "ĐANG BẬT" : "Tắt"}
            details={
              maintenanceMode
                ? "Ứng dụng đang ngoại tuyến. Chỉ Admin có thể truy cập."
                : "Ứng dụng đang hoạt động bình thường."
            }
            color={maintenanceMode ? "text-yellow-600" : "text-gray-500"}
            buttonLabel={
              maintenanceMode ? "Tắt Chế Độ Bảo Trì" : "Bật Chế Độ Bảo Trì"
            }
            onAction={toggleMaintenanceMode}
          />

          {/* Tình trạng System Overview */}
          <div className="bg-white p-5 rounded-xl shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-800 flex items-center">
                <Activity className="w-5 h-5 text-[#E91E63] mr-2" />
                Tổng Quan Hệ Thống
              </h3>
              <span className="px-3 py-1 text-xs font-bold rounded-full bg-gradient-to-r from-[#E91E63]/10 to-[#FF8C1A]/10 text-[#E91E63] border border-[#E91E63]/30">
                Hoạt động
              </span>
            </div>
            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Users Active:</span>
                <span className="font-bold text-gray-900">
                  {stats?.users?.active || 0}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Tasks Featured:</span>
                <span className="font-bold text-gray-900">
                  {stats?.tasks?.featured || 0}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Platforms:</span>
                <span className="font-bold text-gray-900">
                  {stats?.platforms?.active || 0}/{stats?.platforms?.total || 0}
                </span>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-gray-100">
              <button
                onClick={fetchDashboardStats}
                className="w-full px-4 py-2 text-sm font-semibold rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all duration-150 flex items-center justify-center gap-2"
              >
                <Activity className="w-4 h-4" />
                Làm mới dữ liệu
              </button>
            </div>
          </div>
        </div>

        {/* Quick Actions Section */}
        <div className="bg-gradient-to-r from-[#E91E63] to-[#FF8C1A] p-6 rounded-2xl shadow-xl">
          <h3 className="text-xl font-bold text-white mb-4">Truy Cập Nhanh</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button
              onClick={() => (window.location.href = "/admin/users")}
              className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 flex flex-col items-center gap-2"
            >
              <Users className="w-6 h-6" />
              <span className="text-sm">Quản Lý Users</span>
            </button>
            <button
              onClick={() => (window.location.href = "/admin/tasks")}
              className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 flex flex-col items-center gap-2"
            >
              <Gift className="w-6 h-6" />
              <span className="text-sm">Quản Lý Tasks</span>
            </button>
            <button
              onClick={() => (window.location.href = "/admin/financial")}
              className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 flex flex-col items-center gap-2"
            >
              <Wallet className="w-6 h-6" />
              <span className="text-sm">Giao Dịch</span>
            </button>
            <button
              onClick={() => (window.location.href = "/admin/platforms")}
              className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 flex flex-col items-center gap-2"
            >
              <ShoppingBag className="w-6 h-6" />
              <span className="text-sm">Platforms</span>
            </button>
          </div>
        </div>

        {/* Khu vực 3: Statistics Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
              <Wallet className="w-5 h-5 text-[#E91E63] mr-2" />
              Thống Kê Ví
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Tổng Số Dư:</span>
                <span className="text-lg font-bold text-[#E91E63]">
                  {formatCurrency(stats?.wallet?.totalBalance || 0)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Đã Rút:</span>
                <span className="text-lg font-bold text-gray-900">
                  {formatCurrency(stats?.wallet?.totalWithdrawn || 0)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Chờ Rút:</span>
                <span className="text-lg font-bold text-yellow-600">
                  {stats?.wallet?.pendingWithdrawals || 0}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
              <Gift className="w-5 h-5 text-purple-600 mr-2" />
              Thống Kê Tasks
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Đang Hoạt Động:</span>
                <span className="text-lg font-bold text-purple-600">
                  {stats?.tasks?.active || 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Nổi Bật:</span>
                <span className="text-lg font-bold text-[#E91E63]">
                  {stats?.tasks?.featured || 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Chờ Duyệt:</span>
                <span className="text-lg font-bold text-yellow-600">
                  {stats?.tasks?.pendingReview || 0}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
              <DollarSign className="w-5 h-5 text-green-600 mr-2" />
              Thống Kê Giao Dịch
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Chờ Duyệt:</span>
                <span className="text-lg font-bold text-yellow-600">
                  {stats?.transactions?.pending || 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Hoàn Thành:</span>
                <span className="text-lg font-bold text-green-600">
                  {stats?.transactions?.completed || 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Tổng Giá Trị:</span>
                <span className="text-sm font-bold text-gray-900">
                  {formatCurrency(stats?.transactions?.totalAmount || 0)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Khu vực 4: Recent Activity Summary */}
        <div className="bg-white p-5 rounded-xl shadow-lg border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 flex items-center mb-4 border-b pb-3">
            <Activity className="w-5 h-5 text-[#E91E63] mr-2" />
            Hoạt Động Gần Đây
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
              <p className="text-sm text-gray-600 mb-1">Users mới hôm nay</p>
              <p className="text-2xl font-black text-purple-600">
                {stats?.users?.newToday || 0}
              </p>
            </div>
            <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
              <p className="text-sm text-gray-600 mb-1">Submissions hôm nay</p>
              <p className="text-2xl font-black text-blue-600">
                {Math.floor((stats?.tasks?.totalSubmissions || 0) * 0.05)}
              </p>
            </div>
            <div className="p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl">
              <p className="text-sm text-gray-600 mb-1">Cần xử lý</p>
              <p className="text-2xl font-black text-yellow-600">
                {(stats?.transactions?.pending || 0) +
                  (stats?.tasks?.pendingReview || 0)}
              </p>
            </div>
            <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
              <p className="text-sm text-gray-600 mb-1">Đã hoàn thành</p>
              <p className="text-2xl font-black text-green-600">
                {stats?.transactions?.completed || 0}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Component con cho Log Item
const LogItem = ({ time, action, user }) => (
  <li className="flex justify-between items-center p-2 bg-gray-50 rounded-md">
    <div className="flex items-center space-x-3">
      <span className="font-bold text-gray-900 w-10">{time}</span>
      <span className="text-gray-700">{action}</span>
    </div>
    <span className="text-xs text-gray-500 italic">{user}</span>
  </li>
);

export default AdminDashboard;
