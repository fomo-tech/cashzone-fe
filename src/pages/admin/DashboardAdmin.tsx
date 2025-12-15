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
} from "lucide-react";

// Giả lập dữ liệu chỉ số chính (KPI)
const mockStats = {
  users: { total: 12500, today: 150, growth: 12.5 },
  revenue: { total: 550000000, month: 125000000, change: -5.2 },
  pendingTransactions: 25,
  maintenanceMode: false,
  serverLoad: 65, // %
  apiErrors: 12,
  auditLogs: 980,
};

// Giả lập dữ liệu cho biểu đồ (Dùng mock data đơn giản)
const mockChartData = {
  weeklyUsers: [50, 60, 45, 70, 80, 75, 90], // Số lượng người dùng mới
  transactionVolume: [100, 120, 90, 150, 110, 130, 160], // Khối lượng giao dịch (triệu VND)
};

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
    ? "text-green-600"
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
            ? "bg-green-100 text-green-700"
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
        className="px-4 py-2 text-sm font-semibold rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition duration-150 shadow-md"
      >
        {buttonLabel}
      </button>
    </div>
  </div>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState(mockStats);

  const pendingActions = [
    { label: "Giao dịch Nạp/Rút cần duyệt", value: stats.pendingTransactions },
    { label: "Lỗi API cần kiểm tra", value: stats.apiErrors },
    { label: "Yêu cầu hỗ trợ mới", value: 3 },
  ];

  const toggleMaintenanceMode = () => {
    setStats((prev) => ({ ...prev, maintenanceMode: !prev.maintenanceMode }));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center space-x-3">
          <Shield className="w-8 h-8 text-purple-600" />
          <h1 className="text-3xl font-extrabold text-gray-900">
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
            value={stats.users.total}
            detail={stats.users.today}
            color="text-blue-600"
          />
          <StatCard
            icon={TrendingUp}
            title="Doanh Thu Tháng Này"
            value={stats.revenue.month}
            detail={stats.revenue.change}
            color="text-green-600"
            isCurrency={true}
            isPercentage={true}
          />
          <StatCard
            icon={DollarSign}
            title="Tổng Khối Lượng GD"
            value={stats.revenue.total}
            detail={0}
            color="text-purple-600"
            isCurrency={true}
          />
          <StatCard
            icon={Clock}
            title="GD Chờ Duyệt"
            value={stats.pendingTransactions}
            detail={stats.pendingTransactions}
            color="text-yellow-600"
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
            status={stats.maintenanceMode ? "ĐANG BẬT" : "Tắt"}
            details={
              stats.maintenanceMode
                ? "Ứng dụng đang ngoại tuyến. Chỉ Admin có thể truy cập."
                : "Ứng dụng đang hoạt động bình thường."
            }
            color={stats.maintenanceMode ? "text-yellow-600" : "text-gray-500"}
            buttonLabel={
              stats.maintenanceMode
                ? "Tắt Chế Độ Bảo Trì"
                : "Bật Chế Độ Bảo Trì"
            }
            onAction={toggleMaintenanceMode}
          />

          {/* Tình trạng Server */}
          <div className="bg-white p-5 rounded-xl shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-800 flex items-center">
                <Server className="w-5 h-5 text-red-500 mr-2" />
                Tải Server (CPU)
              </h3>
              <span
                className={`px-3 py-1 text-xs font-bold rounded-full ${
                  stats.serverLoad > 75
                    ? "bg-red-100 text-red-700"
                    : "bg-green-100 text-green-700"
                }`}
              >
                {stats.serverLoad}%
              </span>
            </div>
            {/* Đã sửa lỗi: Thay thế ký tự '<' bằng '&lt;' để tránh lỗi biên dịch JSX */}
            <p className="text-sm text-gray-500 mt-2">
              Đảm bảo hiệu suất không bị tắc nghẽn. (Ngưỡng an toàn &lt; 75%)
            </p>
            <div className="mt-4 pt-3 border-t border-gray-100">
              <h4 className="text-sm font-semibold text-gray-700">
                Lỗi Hệ Thống:
              </h4>
              <p className="text-xs text-gray-500 flex items-center">
                <XCircle className="w-3 h-3 text-red-500 mr-1" />
                {stats.apiErrors} lỗi API 5xx trong 24h qua.
              </p>
            </div>
          </div>
        </div>

        {/* Khu vực 3: Biểu đồ Xu hướng */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SimpleChartCard
            title="Xu Hướng Người Dùng Mới"
            data={mockChartData.weeklyUsers}
            color="bg-blue-500"
          />
          <SimpleChartCard
            title="Khối Lượng Giao Dịch (Triệu VND)"
            data={mockChartData.transactionVolume}
            color="bg-purple-500"
          />
        </div>

        {/* Khu vực 4: Nhật ký Hoạt động Gần đây (Mock list) */}
        <div className="bg-white p-5 rounded-xl shadow-lg border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 flex items-center mb-4 border-b pb-3">
            <Activity className="w-5 h-5 text-green-500 mr-2" />
            Nhật Ký Hoạt Động Gần Đây ({stats.auditLogs} mục)
          </h3>
          <ul className="space-y-2 text-sm">
            <LogItem
              time="10:30"
              action="Đã duyệt giao dịch Nạp tiền"
              user="Admin #U001"
            />
            <LogItem
              time="09:15"
              action="Người dùng 'user456' đăng ký thành công"
              user="Hệ thống"
            />
            <LogItem
              time="08:45"
              action="Server đạt tải 80% trong 5 phút"
              user="Monitor"
            />
            <LogItem
              time="07:00"
              action="Bật Chế Độ Bảo Trì"
              user="SuperAdmin"
            />
          </ul>
          <button className="mt-4 text-purple-600 font-semibold text-sm hover:text-purple-800 flex items-center">
            Xem Toàn Bộ Nhật Ký <CheckCircle className="w-4 h-4 ml-2" />
          </button>
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
