import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  TrendingUp,
  ShoppingBag,
  DollarSign,
  Clock,
  Shield,
  Zap,
  Mail,
  Calendar,
  Settings,
  Edit2,
  Trash2,
  MapPin,
  ListOrdered,
  Tag,
  Hash,
  Activity,
  User2,
  Award,
  CreditCard,
  CheckCircle2,
  XCircle,
  Phone,
  Wallet,
  Users,
  TrendingDown,
  RefreshCw,
  FileText,
  AlertCircle,
} from "lucide-react";
import StatusBadge from "@/components/admin/StatusBadge";
import StatCard from "@/components/admin/StatCard";
import DetailItemUser from "@/components/admin/DetailUserItem";
import { checkRole, formatCurrency } from "@/utils/lib";
import RoleBadge from "@/components/admin/RoleBadge";
import { useHandleSubmit } from "@/hooks/useHandleSubmit";
import http from "@/services/api";
import { useAppStore } from "@/store/appStore";
import type { User } from "@/utils/types";
import { useConfirmModal } from "@/hooks/useConfirmModal";
import { ConfirmModal } from "@/components/common/ConfirmModal";

/**
 * Transaction interface
 */
interface Transaction {
  _id: string;
  type: string;
  amount: number;
  createdAt: string;
  status: string;
  description?: string;
}

/**
 * Hiển thị chi tiết giao dịch gần nhất
 */
const RecentTransactions = ({
  transactions,
}: {
  transactions: Transaction[];
}) => {
  const hasTransactions = transactions && transactions.length > 0;

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
        <h4 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <ListOrdered className="w-5 h-5 text-green-600" />
          Giao dịch gần nhất
        </h4>
        {hasTransactions && (
          <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
            {transactions.length} giao dịch
          </span>
        )}
      </div>

      {!hasTransactions ? (
        <div className="flex flex-col items-center justify-center py-12">
          <FileText size={48} className="text-gray-300 mb-4" />
          <p className="text-gray-600 font-medium">Chưa có giao dịch nào</p>
          <p className="text-gray-500 text-sm mt-2">
            Giao dịch sẽ hiển thị khi người dùng thực hiện hoạt động
          </p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    <Hash className="w-4 h-4 inline mr-1" /> Mã GD
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    <Tag className="w-4 h-4 inline mr-1" /> Loại
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Số tiền
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Ngày
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Trạng thái
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {transactions.slice(0, 5).map((txn) => (
                  <tr
                    key={txn._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                      {txn._id.slice(-8)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      <span className="inline-flex items-center gap-1">
                        {txn.type === "deposit" ? (
                          <TrendingUp className="w-4 h-4 text-green-600" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-red-600" />
                        )}
                        {txn.description || txn.type}
                      </span>
                    </td>
                    <td
                      className={`px-6 py-4 whitespace-nowrap text-sm font-semibold ${
                        txn.type === "deposit"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {txn.type === "deposit" ? "+" : "-"}
                      {formatCurrency(txn.amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(txn.createdAt).toLocaleDateString("vi-VN", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {txn.status === "completed" ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                          <CheckCircle2 className="w-3 h-3" />
                          Thành công
                        </span>
                      ) : txn.status === "pending" ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                          <Clock className="w-3 h-3" />
                          Đang xử lý
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                          <XCircle className="w-3 h-3" />
                          Thất bại
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-6 pt-4 border-t border-gray-200 text-right">
            <button className="inline-flex items-center gap-2 text-sm font-semibold text-green-600 hover:text-green-700 transition-colors">
              Xem tất cả giao dịch
              <ArrowLeft className="w-4 h-4 rotate-180" />
            </button>
          </div>
        </>
      )}
    </div>
  );
};

// --- Main Component ---

export default function UserDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { setToast, loading } = useAppStore();
  const { handleSubmit } = useHandleSubmit();
  const { confirm, isOpen, close, options } = useConfirmModal();

  const [user, setUser] = useState<User | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [stats, setStats] = useState({
    totalTasks: 0,
    totalRevenue: 0,
    totalCommission: 0,
    lastActivity: "-",
    referralCount: 0,
  });

  useEffect(() => {
    const fetchUserDetail = async () => {
      const res = await handleSubmit(
        () => http.get(`/admin/user/${id}`),
        (err: any) =>
          setToast({
            type: "error",
            title:
              err.response?.data?.message ||
              "Lấy thông tin người dùng thất bại",
            isVisible: true,
            timer: 1500,
          })
      );
      if (res && res.data) {
        setUser(res.data.user);
        // Fetch transactions if available
        if (res.data.transactions) {
          setTransactions(res.data.transactions);
        }
        // Calculate stats from user data
        if (res.data.user) {
          setStats({
            totalTasks: res.data.stats?.totalTasks || 0,
            totalRevenue:
              res.data.stats?.totalRevenue ||
              res.data.user.wallet?.available ||
              0,
            totalCommission: res.data.stats?.totalCommission || 0,
            lastActivity: res.data.user.updatedAt
              ? new Date(res.data.user.updatedAt).toLocaleDateString("vi-VN")
              : "-",
            referralCount: res.data.stats?.referralCount || 0,
          });
        }
      }
    };
    fetchUserDetail();
  }, [id]);

  const handleDelete = async () => {
    const confirmed = await confirm({
      title: "Xác nhận xóa người dùng",
      message: `Bạn có chắc chắn muốn xóa người dùng "${
        user?.name || user?.email
      }"? Hành động này không thể hoàn tác.`,
      confirmText: "Xóa",
      cancelText: "Hủy",
      type: "danger",
    });

    if (confirmed) {
      const res = await handleSubmit(
        () => http.delete(`/admin/user/${id}`),
        (err: any) =>
          setToast({
            type: "error",
            title: err.response?.data?.message || "Xóa người dùng thất bại",
            isVisible: true,
            timer: 2000,
          })
      );

      if (res && res.data) {
        setToast({
          title: "Xóa người dùng thành công",
          type: "success",
          isVisible: true,
          timer: 2000,
        });
        setTimeout(() => navigate("/admin/users"), 1000);
      }
    }
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  if (loading["global"]) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-gray-50 to-green-50/30">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
          <div className="flex items-center space-x-2 text-green-600">
            <span className="text-lg font-semibold">
              Đang tải thông tin người dùng...
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-gray-50 to-green-50/30">
        <div className="text-center">
          <AlertCircle size={64} className="mx-auto text-red-500 mb-4" />
          <p className="text-xl font-bold text-red-600">
            Không tìm thấy người dùng
          </p>
          <button
            onClick={() => navigate("/admin/users")}
            className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            Quay lại danh sách
          </button>
        </div>
      </div>
    );
  }

  if (checkRole(user.roles, "admin")) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-gray-50 to-green-50/30">
        <div className="text-center">
          <Shield size={64} className="mx-auto text-yellow-500 mb-4" />
          <p className="text-xl font-bold text-yellow-600">
            Không thể hiển thị chi tiết người dùng với vai trò Quản trị viên
          </p>
          <button
            onClick={() => navigate("/admin/users")}
            className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            Quay lại danh sách
          </button>
        </div>
      </div>
    );
  }

  // Custom StatCard Data
  const statCards = [
    {
      icon: <ShoppingBag />,
      title: "Tổng nhiệm vụ",
      value: stats.totalTasks,
      color: "text-orange-600",
    },
    {
      icon: <DollarSign />,
      title: "Số dư ví",
      value: formatCurrency(stats.totalRevenue),
      color: "text-green-600",
    },
    {
      icon: <TrendingUp />,
      title: "Hoa hồng",
      value: formatCurrency(stats.totalCommission),
      color: "text-emerald-600",
    },
    {
      icon: <Activity />,
      title: "Hoạt động",
      value: stats.lastActivity,
      color: "text-gray-600",
    },
  ];

  return (
    <div className="w-full min-h-screen bg-linear-to-br from-gray-50 to-green-50/30 font-sans">
      {/* HEADER - Green theme */}
      <div className="bg-linear-to-r from-green-600 to-emerald-600 shadow-lg">
        <div className="max-w-7xl mx-auto py-6 px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/admin/users")}
              className="text-white hover:text-green-100 transition-colors p-2 hover:bg-white/10 rounded-lg"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                <User2 className="w-7 h-7" />
                Chi tiết Người dùng
              </h1>
              <p className="text-green-100 text-sm mt-1">
                Xem và quản lý thông tin chi tiết
              </p>
            </div>
            <button
              onClick={handleRefresh}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              <span className="hidden sm:inline">Làm mới</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-8 pb-12">
        {/* Thống kê Hoạt động (Stats) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {statCards.map((card, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div
                  className={`p-3 rounded-xl bg-linear-to-br from-green-50 to-emerald-50 ${card.color}`}
                >
                  {React.cloneElement(card.icon, { className: "w-6 h-6" })}
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-600">
                  {card.title}
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {card.value}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Layout Hai Cột cho Thông tin và Hành động/Lịch sử */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cột chính: Thông tin Tài khoản & Ví tiền (2/3 width on large screens) */}
          <div className="lg:col-span-2 space-y-8">
            {/* 1. Thông tin Tài khoản */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg border border-gray-200">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
                <h4 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <User2 className="w-5 h-5 text-green-600" /> Thông tin Cơ bản
                </h4>
                <StatusBadge status={user.status} />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-base">
                {/* ID */}
                <DetailItemUser
                  icon={<Hash className="w-4 h-4" />}
                  label="ID Người dùng"
                  value={user._id}
                  type="mono"
                />

                {/* Name */}
                <DetailItemUser
                  icon={<User2 className="w-4 h-4" />}
                  label="Tên người dùng"
                  value={user.name || "Chưa cập nhật"}
                  type="normal"
                />

                {/* Email */}
                <DetailItemUser
                  type="normal"
                  icon={<Mail className="w-4 h-4" />}
                  label="Email"
                  value={user.email}
                />

                {/* Số điện thoại */}
                <DetailItemUser
                  icon={<Phone className="w-4 h-4" />}
                  label="Số điện thoại"
                  value={user.phone}
                />

                {/* Vai trò */}
                <div className="flex flex-col">
                  <span className="font-semibold text-gray-600 flex items-center gap-2 mb-2">
                    <Shield className="w-4 h-4 text-green-600" /> Vai trò
                  </span>
                  <RoleBadge roles={user.roles} />
                </div>

                {/* Ngày tham gia */}
                <DetailItemUser
                  icon={<Calendar className="w-4 h-4" />}
                  label="Ngày tham gia"
                  value={new Date(user.createdAt).toLocaleDateString("vi-VN", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                />

                {/* Lần đăng nhập cuối */}
                <DetailItemUser
                  icon={<Clock className="w-4 h-4" />}
                  label="Hoạt động cuối"
                  value={new Date(user.updatedAt).toLocaleString("vi-VN")}
                  className="sm:col-span-2"
                />
              </div>
            </div>

            {/* 2. Thông tin Ví tiền */}
            <div className="bg-linear-to-br from-green-500 to-emerald-600 p-6 sm:p-8 rounded-2xl shadow-lg text-white">
              <h4 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Wallet className="w-5 h-5" /> Thông tin Ví
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/20">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-white/20 rounded-lg">
                      <DollarSign className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-medium text-green-100">
                      Số dư khả dụng
                    </span>
                  </div>
                  <p className="text-3xl font-bold">
                    {formatCurrency(user.wallet?.available || 0)}
                  </p>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/20">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-white/20 rounded-lg">
                      <Clock className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-medium text-green-100">
                      Số dư chờ xử lý
                    </span>
                  </div>
                  <p className="text-3xl font-bold">
                    {formatCurrency(user.wallet?.pending || 0)}
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-white/20">
                <div className="flex items-center justify-between">
                  <span className="text-green-100">Tổng số dư</span>
                  <span className="text-2xl font-bold">
                    {formatCurrency(
                      (user.wallet?.available || 0) +
                        (user.wallet?.pending || 0)
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Cột phụ: Referral & Hành động (1/3 width on large screens) */}
          <div className="lg:col-span-1 space-y-8">
            {/* Referral */}
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
              <h4 className="text-lg font-bold text-gray-900 mb-4 pb-3 border-b border-gray-200 flex items-center gap-2">
                <Users className="w-5 h-5 text-green-600" /> Giới thiệu
              </h4>

              <div className="space-y-4">
                {/* Mã giới thiệu */}
                {user.affiliate?.code && (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                    <span className="text-sm font-medium text-gray-600 block mb-2">
                      Mã giới thiệu
                    </span>
                    <p className="text-lg font-bold text-green-600 font-mono">
                      {user.affiliate.code}
                    </p>
                  </div>
                )}

                {/* Số người giới thiệu */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <span className="font-medium text-gray-600">
                    Số người đã giới thiệu
                  </span>
                  <span className="text-2xl font-bold text-green-600">
                    {stats.referralCount}
                  </span>
                </div>

                {/* Người giới thiệu */}
                {user.affiliate?.referredBy && (
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                    <span className="text-sm font-medium text-gray-600 block mb-2">
                      Được giới thiệu bởi
                    </span>
                    <p className="text-sm font-mono text-blue-600">
                      {user.affiliate.referredBy}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
              <h4 className="text-lg font-bold text-gray-900 mb-4 pb-3 border-b border-gray-200 flex items-center gap-2">
                <Settings className="w-5 h-5 text-green-600" /> Hành động
              </h4>

              <div className="flex flex-col gap-3">
                <button
                  onClick={() => navigate(`/admin/users/edit/${user._id}`)}
                  className="flex items-center justify-center gap-2 w-full py-3 px-4 text-base font-semibold rounded-xl text-white bg-linear-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-lg shadow-green-500/30 transition duration-200 transform hover:scale-[1.02]"
                >
                  <Edit2 className="w-5 h-5" />
                  Chỉnh sửa
                </button>

                <button
                  onClick={handleDelete}
                  className="flex items-center justify-center gap-2 w-full py-3 px-4 text-base font-semibold rounded-xl shadow-sm text-red-600 bg-red-50 hover:bg-red-100 border border-red-300 transition duration-200"
                >
                  <Trash2 className="w-5 h-5" />
                  Xóa người dùng
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Lịch sử Giao dịch (Full Width) */}
        <RecentTransactions transactions={transactions} />
      </div>

      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={isOpen}
        onClose={close}
        onConfirm={options.onConfirm}
        title={options.title}
        message={options.message}
        confirmText={options.confirmText}
        cancelText={options.cancelText}
        type={options.type}
      />
    </div>
  );
}
