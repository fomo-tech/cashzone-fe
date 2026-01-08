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
  Share2,
  Target,
  TreePine,
  Gift,
  Plus,
  Minus,
} from "lucide-react";
import StatusBadge from "@/components/admin/StatusBadge";
import StatCard from "@/components/admin/StatCard";
import DetailItemUser from "@/components/admin/DetailUserItem";
import { checkRole, formatCurrency } from "@/utils/lib";
import RoleBadge from "@/components/admin/RoleBadge";
import http from "@/services/api";
import { useAppStore } from "@/store/appStore";
import type { User } from "@/utils/types";
import { useConfirmModal } from "@/hooks/useConfirmModal";
import ConfirmModal from "@/components/modals/ConfirmModal";

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
          <ListOrdered className="w-5 h-5 text-[orange-600]" />
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[orange-600]">
                      {txn._id.slice(-8)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      <span className="inline-flex items-center gap-1">
                        {txn.type === "INCOME" ? (
                          <TrendingUp className="w-4 h-4 text-[orange-600]" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-red-600" />
                        )}
                        {txn.type === "INCOME"
                          ? "Thu nhập"
                          : txn.type === "COMMISSION"
                          ? "Hoa hồng"
                          : "Chi tiêu"}
                      </span>
                    </td>
                    <td
                      className={`px-6 py-4 whitespace-nowrap text-sm font-semibold ${
                        txn.type === "INCOME" || txn.type === "COMMISSION"
                          ? "text-[orange-600]"
                          : "text-red-600"
                      }`}
                    >
                      {txn.type === "INCOME" || txn.type === "COMMISSION"
                        ? "+"
                        : "-"}
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
                      {txn.status === "COMPLETED" ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full bg-gradient-to-r from-[orange-600]/10 to-[#FF8C1A]/10 text-[orange-600] border border-[orange-600]/30">
                          <CheckCircle2 className="w-3 h-3" />
                          Thành công
                        </span>
                      ) : txn.status === "PENDING" ? (
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
            <button className="inline-flex items-center gap-2 text-sm font-semibold text-[orange-600] hover:text-[orange-600] transition-colors">
              Xem tất cả giao dịch
              <ArrowLeft className="w-4 h-4 rotate-180" />
            </button>
          </div>
        </>
      )}
    </div>
  );
};

/**
 * 3-Level Referral System Display Component
 */
interface ReferralSystemProps {
  user: User;
  referralStats?: any;
}

const ReferralSystemDisplay = ({
  user,
  referralStats,
}: ReferralSystemProps) => {
  const affiliate = user.affiliate || {};
  const commissions = affiliate.commissions || {};
  const referralTree = affiliate.referralTree || {
    level1: [],
    level2: [],
    level3: [],
  };

  // Use referralStats from API if available, otherwise fall back to user data
  const stats = referralStats || {
    directReferrals: affiliate.directReferrals || 0,
    level2Referrals: affiliate.level2Referrals || 0,
    level3Referrals: affiliate.level3Referrals || 0,
    totalEarned: (commissions as any)?.totalEarned || 0,
    level1Total: (commissions as any)?.level1Total || 0,
    level2Total: (commissions as any)?.level2Total || 0,
    level3Total: (commissions as any)?.level3Total || 0,
  };

  // Commission rates for display
  const commissionRates = {
    level1: 10, // 10%
    level2: 5, // 5%
    level3: 2, // 2%
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
        <h4 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Share2 className="w-5 h-5 text-[orange-600]" />
          Hệ Thống Giới Thiệu 3 Cấp
        </h4>
        {affiliate.code && (
          <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
            Mã: {affiliate.code}
          </span>
        )}
      </div>

      {/* Referral Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-br from-orange-500 via-orange-600 to-amber-600 p-4 rounded-xl border border-[orange-600]">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-4 h-4 text-white" />
            <span className="text-sm font-medium text-white">
              Tổng Giới Thiệu
            </span>
          </div>
          <p className="text-2xl font-bold text-white">
            {stats.directReferrals +
              stats.level2Referrals +
              stats.level3Referrals}
          </p>
        </div>

        <div className="bg-gradient-to-br from-pink-50 to-orange-50 p-4 rounded-xl border border-pink-200">
          <div className="flex items-center gap-2 mb-2">
            <Gift className="w-4 h-4 text-[orange-600]" />
            <span className="text-sm font-medium text-gray-600">
              Tổng Hoa Hồng
            </span>
          </div>
          <p className="text-xl font-bold text-[orange-600]">
            {formatCurrency(stats.totalEarned || 0)}
          </p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-xl border border-pink-200">
          <div className="flex items-center gap-2 mb-2">
            <TreePine className="w-4 h-4 text-[orange-600]" />
            <span className="text-sm font-medium text-gray-600">Cấp Độ</span>
          </div>
          <p className="text-2xl font-bold text-[orange-600]">
            {affiliate.referralLevel
              ? `Cấp ${affiliate.referralLevel}`
              : "Chưa có"}
          </p>
        </div>
      </div>

      {/* 3-Level Breakdown */}
      <div className="space-y-4 mb-6">
        <h5 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <Activity className="w-5 h-5 text-gray-600" />
          Chi Tiết Theo Cấp
        </h5>

        {/* Level 1 */}
        <div className="bg-gradient-to-r from-pink-50 to-orange-50 border border-pink-200 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-[orange-600] rounded-full"></div>
              <span className="font-semibold text-gray-800">
                Cấp 1 - Trực Tiếp
              </span>
              <span className="text-xs bg-gradient-to-r from-[orange-600]/10 to-[#FF8C1A]/10 text-[orange-600] border border-[orange-600]/30 px-2 py-1 rounded-full">
                {commissionRates.level1}% hoa hồng
              </span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-sm text-gray-600">Số người:</span>
              <p className="text-xl font-bold text-[orange-600]">
                {stats.directReferrals || 0}
              </p>
            </div>
            <div>
              <span className="text-sm text-gray-600">Hoa hồng:</span>
              <p className="text-lg font-semibold text-[orange-600]">
                {formatCurrency(stats.level1Total || 0)}
              </p>
            </div>
          </div>
        </div>

        {/* Level 2 */}
        <div className="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-[#FF8C1A] rounded-full"></div>
              <span className="font-semibold text-gray-800">
                Cấp 2 - Gián Tiếp
              </span>
              <span className="text-xs bg-gradient-to-r from-[orange-600]/10 to-[#FF8C1A]/10 text-[orange-600] border border-[orange-600]/30 px-2 py-1 rounded-full">
                {commissionRates.level2}% hoa hồng
              </span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-sm text-gray-600">Số người:</span>
              <p className="text-xl font-bold text-[orange-600]">
                {stats.level2Referrals || 0}
              </p>
            </div>
            <div>
              <span className="text-sm text-gray-600">Hoa hồng:</span>
              <p className="text-lg font-semibold text-[orange-600]">
                {formatCurrency(stats.level2Total || 0)}
              </p>
            </div>
          </div>
        </div>

        {/* Level 3 */}
        <div className="bg-gradient-to-r from-pink-50 to-orange-50 border border-pink-200 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-[orange-600] rounded-full"></div>
              <span className="font-semibold text-gray-800">
                Cấp 3 - Xa Nhất
              </span>
              <span className="text-xs bg-pink-100 text-[#AD1457] px-2 py-1 rounded-full">
                {commissionRates.level3}% hoa hồng
              </span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-sm text-gray-600">Số người:</span>
              <p className="text-xl font-bold text-[orange-600]">
                {stats.level3Referrals || 0}
              </p>
            </div>
            <div>
              <span className="text-sm text-gray-600">Hoa hồng:</span>
              <p className="text-lg font-semibold text-[orange-600]">
                {formatCurrency(stats.level3Total || 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Referral Chain Visualization */}
      {affiliate.referredBy && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-4">
          <div className="flex items-center gap-2 mb-2">
            <User2 className="w-4 h-4 text-orange-600" />
            <span className="font-semibold text-gray-800">
              Được Giới Thiệu Bởi
            </span>
          </div>
          <p className="text-sm text-gray-600">
            ID:{" "}
            <span className="font-mono text-orange-600">
              {affiliate.referredBy}
            </span>
          </p>
          {affiliate.referralLevel && (
            <p className="text-sm text-gray-600 mt-1">
              Vị trí trong chuỗi:{" "}
              <span className="font-semibold text-orange-600">
                Cấp {affiliate.referralLevel}
              </span>
            </p>
          )}
        </div>
      )}

      {/* Action Buttons for Admin */}
      <div className="flex gap-2 pt-4 border-t border-gray-200">
        <button className="flex-1 bg-gradient-to-r from-[orange-600]/10 to-[#FF8C1A]/10 text-[orange-600] border border-[orange-600]/30 hover:from-[orange-600] hover:to-[#FF8C1A] hover:text-white font-medium py-2 px-4 rounded-lg transition-all flex items-center justify-center gap-2">
          <RefreshCw className="w-4 h-4" />
          Cập nhật
        </button>
        <button className="flex-1 bg-gradient-to-r from-[orange-600]/10 to-[#FF8C1A]/10 text-[orange-600] border border-[orange-600]/30 hover:from-[orange-600] hover:to-[#FF8C1A] hover:text-white font-medium py-2 px-4 rounded-lg transition-all flex items-center justify-center gap-2">
          <FileText className="w-4 h-4" />
          Chi tiết
        </button>
      </div>

      {/* Performance Indicator */}
      {(affiliate.directReferrals || 0) > 0 && (
        <div className="mt-4 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-yellow-600" />
            <span className="text-sm font-medium text-yellow-800">
              Hoạt động giới thiệu tốt!
              {(commissions as any)?.totalEarned &&
                (commissions as any).totalEarned > 0 &&
                ` Đã kiếm được ${formatCurrency(
                  (commissions as any).totalEarned
                )}`}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

// --- Main Component ---

export default function UserDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { setToast, loading } = useAppStore();
  const { confirmModal, showConfirm, hideConfirm } = useConfirmModal();

  const [user, setUser] = useState<User | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [referralStats, setReferralStats] = useState<any>(null);
  const [stats, setStats] = useState({
    totalTasks: 0,
    totalRevenue: 0,
    totalCommission: 0,
    lastActivity: "-",
    referralCount: 0,
  });

  // Wallet adjustment states
  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);
  const [adjustType, setAdjustType] = useState<"add" | "subtract">("add");
  const [adjustAmount, setAdjustAmount] = useState(0);
  const [adjustReason, setAdjustReason] = useState("");
  const [isAdjusting, setIsAdjusting] = useState(false);

  useEffect(() => {
    const fetchUserDetail = async () => {
      try {
        const response = await http.get(`/admin/user/${id}`);

        if (response.data && response.data.data) {
          const { user, transactions, referralStats, stats } =
            response.data.data;

          if (user) {
            setUser(user);

            // Set transactions from API response
            if (transactions) {
              setTransactions(transactions);
            }

            // Set referral stats
            if (referralStats) {
              setReferralStats(referralStats);
            }

            // Set stats from API response
            if (stats) {
              setStats({
                totalTasks: stats.totalTasks || 0,
                totalRevenue: stats.totalRevenue || 0,
                totalCommission: stats.totalCommission || 0,
                lastActivity: user.updatedAt
                  ? new Date(user.updatedAt).toLocaleDateString("vi-VN")
                  : "-",
                referralCount: stats.referralCount || 0,
              });
            } else {
              // Fallback calculation if stats not provided
              setStats({
                totalTasks: 0,
                totalRevenue: user.wallet?.available || 0,
                totalCommission: 0,
                lastActivity: user.updatedAt
                  ? new Date(user.updatedAt).toLocaleDateString("vi-VN")
                  : "-",
                referralCount: 0,
              });
            }
          }
        }
      } catch (err: any) {
        console.error("Error fetching user detail:", err);
        setToast({
          type: "error",
          title:
            err.response?.data?.message || "Lấy thông tin người dùng thất bại",
          isVisible: true,
          timer: 2000,
        });
      }
    };

    if (id) {
      fetchUserDetail();
    }
  }, [id]);

  const openAdjustModal = (type: "add" | "subtract") => {
    setAdjustType(type);
    setAdjustAmount(0);
    setAdjustReason("");
    setIsAdjustModalOpen(true);
  };

  const handleAdjustBalance = async () => {
    if (!user || adjustAmount <= 0 || !adjustReason.trim()) {
      setToast({
        type: "error",
        title: "Vui lòng nhập đầy đủ thông tin",
        isVisible: true,
        timer: 2000,
      });
      return;
    }

    try {
      setIsAdjusting(true);
      await http.post("/wallet/admin/adjust-balance", {
        userId: user._id,
        amount: adjustAmount,
        type: adjustType,
        reason: adjustReason,
      });

      setToast({
        type: "success",
        title: `Đã ${adjustType === "add" ? "cộng" : "trừ"} ${formatCurrency(
          adjustAmount
        )} thành công`,
        isVisible: true,
        timer: 2000,
      });
      setIsAdjustModalOpen(false);

      // Reload user data
      const response = await http.get(`/admin/user/${id}`);
      if (response.data && response.data.data && response.data.data.user) {
        setUser(response.data.data.user);
      }
    } catch (err: any) {
      console.error("Error adjusting balance:", err);
      setToast({
        type: "error",
        title: err.response?.data?.message || "Không thể điều chỉnh số dư",
        isVisible: true,
        timer: 2000,
      });
    } finally {
      setIsAdjusting(false);
    }
  };

  const handleDelete = async () => {
    showConfirm({
      title: "Xác nhận xóa người dùng",
      message: `Bạn có chắc chắn muốn xóa người dùng "${
        user?.name || user?.email
      }"? Hành động này không thể hoàn tác.`,
      confirmText: "Xóa",
      cancelText: "Hủy",
      type: "danger",
      onConfirm: async () => {
        try {
          await http.delete(`/admin/user/${id}`);

          setToast({
            title: "Xóa người dùng thành công",
            type: "success",
            isVisible: true,
            timer: 2000,
          });
          hideConfirm();
          setTimeout(() => navigate("/admin/users"), 1000);
        } catch (err: any) {
          console.error("Error deleting user:", err);
          setToast({
            type: "error",
            title: err.response?.data?.message || "Xóa người dùng thất bại",
            isVisible: true,
            timer: 3000,
          });
        }
      },
    });
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  if (loading["global"]) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-orange-50/30">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 border-4 border-[orange-600] border-t-[orange-600] rounded-full animate-spin"></div>
          <div className="flex items-center space-x-2 text-[orange-600]">
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
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-orange-50/30">
        <div className="text-center">
          <AlertCircle size={64} className="mx-auto text-red-500 mb-4" />
          <p className="text-xl font-bold text-red-600">
            Không tìm thấy người dùng
          </p>
          <button
            onClick={() => navigate("/admin/users")}
            className="mt-4 px-6 py-2 bg-gradient-to-br from-orange-500 via-orange-600 to-amber-600 text-white rounded-lg hover:from-orange-600 hover:to-amber-700 transition"
          >
            Quay lại danh sách
          </button>
        </div>
      </div>
    );
  }

  if (checkRole(user.roles, "admin")) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-orange-50/30">
        <div className="text-center">
          <Shield size={64} className="mx-auto text-yellow-500 mb-4" />
          <p className="text-xl font-bold text-yellow-600">
            Không thể hiển thị chi tiết người dùng với vai trò Quản trị viên
          </p>
          <button
            onClick={() => navigate("/admin/users")}
            className="mt-4 px-6 py-2 bg-gradient-to-br from-orange-500 via-orange-600 to-amber-600 text-white rounded-lg hover:from-orange-600 hover:to-amber-700 transition"
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
      color: "text-[orange-600]",
    },
    {
      icon: <TrendingUp />,
      title: "Hoa hồng",
      value: formatCurrency(stats.totalCommission),
      color: "text-[orange-600]",
    },
    {
      icon: <Activity />,
      title: "Hoạt động",
      value: stats.lastActivity,
      color: "text-gray-600",
    },
  ];

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 to-orange-50/30 font-sans">
      {/* HEADER - Green theme */}
      <div className="bg-gradient-to-br from-orange-500 via-orange-600 to-amber-600 shadow-lg">
        <div className="max-w-7xl mx-auto py-6 px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/admin/users")}
              className="text-white hover:text-white/90 transition-colors p-2 hover:bg-white/10 rounded-lg"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                <User2 className="w-7 h-7" />
                Chi tiết Người dùng
              </h1>
              <p className="text-white/90 text-sm mt-1">
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
      <div className="p-6 lg:p-4 max-w-7xl mx-auto space-y-8 pb-12">
        {/* Thống kê Hoạt động (Stats) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {statCards.map((card, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div
                  className={`p-3 rounded-xl bg-gradient-to-br from-orange-500 via-orange-600 to-amber-600 ${card.color}`}
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
                  <User2 className="w-5 h-5 text-[orange-600]" /> Thông tin Cơ
                  bản
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
                    <Shield className="w-4 h-4 text-[orange-600]" /> Vai trò
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
            <div className="bg-gradient-to-br from-orange-500 via-orange-600 to-amber-600 p-6 sm:p-8 rounded-2xl shadow-lg text-white">
              <h4 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Wallet className="w-5 h-5" /> Thông tin Ví
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/20">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-white/20 rounded-lg">
                      <DollarSign className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-medium text-white/90">
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
                    <span className="text-sm font-medium text-white/90">
                      Số dư chờ xử lý
                    </span>
                  </div>
                  <p className="text-3xl font-bold">
                    {formatCurrency(user.wallet?.pending || 0)}
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-white/20">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-white/90">Tổng số dư</span>
                  <span className="text-2xl font-bold">
                    {formatCurrency(
                      (user.wallet?.available || 0) +
                        (user.wallet?.pending || 0)
                    )}
                  </span>
                </div>

                {/* Wallet adjustment buttons */}
                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() => openAdjustModal("add")}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl font-semibold transition-all border border-white/30"
                  >
                    <Plus className="w-5 h-5" />
                    Cộng tiền
                  </button>
                  <button
                    onClick={() => openAdjustModal("subtract")}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl font-semibold transition-all border border-white/30"
                  >
                    <Minus className="w-5 h-5" />
                    Trừ tiền
                  </button>
                </div>
              </div>
            </div>

            {/* 3. Thông tin Hệ thống Giới thiệu 3 Cấp */}
            {user && (
              <ReferralSystemDisplay
                user={user}
                referralStats={referralStats}
              />
            )}
          </div>

          {/* Cột phụ: Hành động Admin */}
          <div className="lg:col-span-1 space-y-8">
            {/* Người giới thiệu */}
            {user.affiliate?.referredBy && (
              <div className="p-4 bg-pink-50 border border-pink-200 rounded-xl">
                <span className="text-sm font-medium text-gray-600 block mb-2">
                  Được giới thiệu bởi
                </span>
                <p className="text-sm font-mono text-[orange-600]">
                  {user.affiliate.referredBy}
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
              <h4 className="text-lg font-bold text-gray-900 mb-4 pb-3 border-b border-gray-200 flex items-center gap-2">
                <Settings className="w-5 h-5 text-[orange-600]" /> Hành động
              </h4>

              <div className="flex flex-col gap-3">
                <button
                  onClick={() => navigate(`/admin/users/edit/${user._id}`)}
                  className="flex items-center justify-center gap-2 w-full py-3 px-4 text-base font-semibold rounded-xl text-white bg-gradient-to-br from-orange-500 via-orange-600 to-amber-600 hover:from-orange-600 hover:to-amber-700 shadow-lg shadow-pink-500/30 transition duration-200 transform hover:scale-[1.02]"
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
        isOpen={confirmModal.isOpen}
        onClose={hideConfirm}
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        message={confirmModal.message}
        confirmText={confirmModal.confirmText}
        cancelText={confirmModal.cancelText}
        type={confirmModal.type}
      />

      {/* Adjust Balance Modal */}
      {isAdjustModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                {adjustType === "add" ? (
                  <>
                    <Plus className="w-6 h-6 text-green-600" />
                    Cộng tiền vào ví
                  </>
                ) : (
                  <>
                    <Minus className="w-6 h-6 text-red-600" />
                    Trừ tiền khỏi ví
                  </>
                )}
              </h3>
              <p className="text-sm text-gray-500 mt-2">
                Người dùng:{" "}
                <span className="font-semibold">
                  {user?.name || user?.email}
                </span>
              </p>
              <p className="text-sm text-gray-500">
                Số dư hiện tại:{" "}
                <span className="font-semibold text-[orange-600]">
                  {formatCurrency(user?.wallet?.available || 0)}
                </span>
              </p>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Số tiền (VND) *
                </label>
                <input
                  type="number"
                  value={adjustAmount || ""}
                  onChange={(e) => setAdjustAmount(Number(e.target.value))}
                  placeholder="Nhập số tiền..."
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[orange-600]/20 focus:border-[orange-600] transition-all"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Lý do *
                </label>
                <textarea
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  placeholder={`Nhập lý do ${
                    adjustType === "add" ? "cộng" : "trừ"
                  } tiền...`}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[orange-600]/20 focus:border-[orange-600] transition-all resize-none"
                  rows={3}
                />
              </div>

              {adjustAmount > 0 && (
                <div
                  className={`p-4 rounded-xl ${
                    adjustType === "add"
                      ? "bg-green-50 border border-green-200"
                      : "bg-red-50 border border-red-200"
                  }`}
                >
                  <p className="text-sm font-semibold text-gray-700">
                    Số dư sau khi {adjustType === "add" ? "cộng" : "trừ"}:
                  </p>
                  <p
                    className={`text-2xl font-bold ${
                      adjustType === "add" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {formatCurrency(
                      (user?.wallet?.available || 0) +
                        (adjustType === "add" ? adjustAmount : -adjustAmount)
                    )}
                  </p>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-200 flex gap-3">
              <button
                onClick={() => setIsAdjustModalOpen(false)}
                className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-all"
              >
                Hủy
              </button>
              <button
                onClick={handleAdjustBalance}
                disabled={
                  isAdjusting || adjustAmount <= 0 || !adjustReason.trim()
                }
                className={`flex-1 px-4 py-3 ${
                  adjustType === "add"
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-red-600 hover:bg-red-700"
                } text-white font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2`}
              >
                {isAdjusting ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    Đang xử lý...
                  </>
                ) : (
                  <>
                    {adjustType === "add" ? (
                      <>
                        <Plus className="w-5 h-5" />
                        Cộng tiền
                      </>
                    ) : (
                      <>
                        <Minus className="w-5 h-5" />
                        Trừ tiền
                      </>
                    )}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
