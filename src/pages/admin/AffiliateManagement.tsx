import { useEffect, useState } from "react";
import {
  TrendingUp,
  DollarSign,
  Wallet,
  Globe,
  Plus,
  Edit,
  Trash2,
  X,
  Activity,
  BarChart3,
  Calendar,
} from "lucide-react";
import http from "@/services/api";
import ConfirmModal from "@/components/modals/ConfirmModal";
import { notification } from "@/utils/notification";
import PlatformSelect from "@/components/common/PlatformSelect";

interface AffiliateStats {
  totalCommission: number;
  pendingCommission: number;
  paidCommission: number;
  totalOrders: number;
  thisMonthCommission: number;
  topPlatforms: Array<{
    platformName: string;
    commission: number;
    orders: number;
  }>;
}

interface AffiliateCommission {
  _id: string;
  platformName: string;
  platformLogo?: string;
  orderValue: number;
  commissionRate: number;
  commissionAmount: number;
  orderDate: string;
  status: "pending" | "paid" | "rejected";
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

const AffiliateManagement = () => {
  const [stats, setStats] = useState<AffiliateStats | null>(null);
  const [commissions, setCommissions] = useState<AffiliateCommission[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCommission, setEditingCommission] =
    useState<AffiliateCommission | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
  });

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterStatus]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch statistics
      const statsRes = await http.get("/affiliate-commissions/stats");
      console.log("Stats response:", statsRes);
      console.log("Stats data:", statsRes.data);
      setStats(statsRes.data?.data || statsRes.data);

      // Fetch commissions list
      const commissionsRes = await http.get("/affiliate-commissions", {
        params: {
          status: filterStatus === "all" ? undefined : filterStatus,
          limit: 100,
        },
      });

      console.log("Commissions full response:", commissionsRes);
      console.log("Commissions data field:", commissionsRes.data);
      console.log("Type of data:", typeof commissionsRes.data);
      console.log("Is array?", Array.isArray(commissionsRes.data));

      // Handle different response structures
      let commissionsList = [];
      if (Array.isArray(commissionsRes.data)) {
        commissionsList = commissionsRes.data;
      } else if (
        commissionsRes.data?.data &&
        Array.isArray(commissionsRes.data.data)
      ) {
        commissionsList = commissionsRes.data.data;
      } else if (
        typeof commissionsRes.data === "object" &&
        commissionsRes.data !== null
      ) {
        console.log("Data is object, keys:", Object.keys(commissionsRes.data));
      }

      console.log("Final commissions list:", commissionsList);
      setCommissions(commissionsList);
    } catch (error) {
      console.error("Error fetching data:", error);
      // Set empty data on error
      setCommissions([]);
      setStats({
        totalCommission: 0,
        pendingCommission: 0,
        paidCommission: 0,
        totalOrders: 0,
        thisMonthCommission: 0,
        topPlatforms: [],
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCommission = async (id: string) => {
    setConfirmModal({
      isOpen: true,
      title: "Xóa hoa hồng",
      message:
        "Bạn có chắc chắn muốn xóa hoa hồng này? Hành động này không thể hoàn tác.",
      onConfirm: async () => {
        try {
          await http.delete(`/affiliate-commissions/${id}`);
          setCommissions(commissions.filter((c) => c._id !== id));
          fetchData();
          notification({
            message: "Xóa hoa hồng thành công!",
            type: "success",
          });
        } catch (error) {
          console.error("Error deleting commission:", error);
          notification({ message: "Không thể xóa hoa hồng", type: "error" });
        }
      },
    });
  };

  const handleUpdateStatus = async (
    id: string,
    newStatus: "pending" | "paid" | "rejected"
  ) => {
    try {
      await http.patch(`/affiliate-commissions/${id}`, { status: newStatus });
      setCommissions(
        commissions.map((c) => (c._id === id ? { ...c, status: newStatus } : c))
      );
      fetchData(); // Refresh stats
    } catch (error) {
      console.error("Error updating status:", error);
      notification({ message: "Không thể cập nhật trạng thái", type: "error" });
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "rejected":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
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

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold bg-gradient-to-br from-orange-500 via-orange-600 to-amber-600 bg-clip-text text-transparent">
              Quản Lý Hoa Hồng Affiliate
            </h1>
            <p className="text-gray-500 mt-1">
              Theo dõi và quản lý hoa hồng từ các nền tảng affiliate
            </p>
          </div>
          <button
            onClick={() => {
              setEditingCommission(null);
              setShowModal(true);
            }}
            className="px-6 py-3 bg-gradient-to-br from-orange-500 via-orange-600 to-amber-600 text-white rounded-lg font-semibold hover:opacity-90 transition-opacity flex items-center gap-2 shadow-lg"
          >
            <Plus className="w-5 h-5" />
            Thêm Hoa Hồng
          </button>
        </div>

        {/* Statistics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            icon={DollarSign}
            title="Tổng Hoa Hồng"
            value={formatCurrency(stats?.totalCommission || 0)}
            color="text-green-600"
            bgColor="bg-green-50"
          />
          <StatCard
            icon={Wallet}
            title="Đã Thanh Toán"
            value={formatCurrency(stats?.paidCommission || 0)}
            color="text-blue-600"
            bgColor="bg-blue-50"
          />
          <StatCard
            icon={Activity}
            title="Chờ Xử Lý"
            value={formatCurrency(stats?.pendingCommission || 0)}
            color="text-yellow-600"
            bgColor="bg-yellow-50"
          />
          <StatCard
            icon={BarChart3}
            title="Tổng Đơn Hàng"
            value={(stats?.totalOrders || 0).toString()}
            color="text-purple-600"
            bgColor="bg-purple-50"
          />
        </div>

        {/* Top Platforms & Filter */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Top Platforms */}
          <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
              <TrendingUp className="w-5 h-5 text-[#E91E63] mr-2" />
              Nền Tảng Hàng Đầu (Tháng Này)
            </h3>
            <div className="space-y-4">
              {(stats?.topPlatforms || []).map((platform, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 via-orange-600 to-amber-600 flex items-center justify-center text-white font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">
                        {platform.platformName}
                      </p>
                      <p className="text-sm text-gray-500">
                        {platform.orders} đơn hàng
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">
                      {formatCurrency(platform.commission)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
              <Calendar className="w-5 h-5 text-[#E91E63] mr-2" />
              Tháng Này
            </h3>
            <div className="space-y-4">
              <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Hoa Hồng</p>
                <p className="text-2xl font-black text-green-600">
                  {formatCurrency(stats?.thisMonthCommission || 0)}
                </p>
              </div>
              <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Đơn Hàng</p>
                <p className="text-2xl font-black text-blue-600">
                  {stats?.totalOrders || 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Commissions Table */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-800 flex items-center">
              <DollarSign className="w-5 h-5 text-[#E91E63] mr-2" />
              Danh Sách Hoa Hồng ({commissions.length})
            </h3>
            <div className="flex gap-2">
              <button
                onClick={() => setFilterStatus("all")}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  filterStatus === "all"
                    ? "bg-[#E91E63] text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                Tất cả
              </button>
              <button
                onClick={() => setFilterStatus("pending")}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  filterStatus === "pending"
                    ? "bg-yellow-500 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                Chờ xử lý
              </button>
              <button
                onClick={() => setFilterStatus("paid")}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  filterStatus === "paid"
                    ? "bg-green-500 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                Đã thanh toán
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                    Nền Tảng
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                    Giá Trị Đơn
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                    Tỷ Lệ
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                    Hoa Hồng
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                    Ngày
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                    Trạng Thái
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                    Thao Tác
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {commissions.map((commission) => (
                  <tr key={commission._id} className="hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 via-orange-600 to-amber-600 flex items-center justify-center">
                          <Globe className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-semibold text-gray-800">
                          {commission.platformName}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-gray-700">
                      {formatCurrency(commission.orderValue)}
                    </td>
                    <td className="px-4 py-4">
                      <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-sm font-semibold">
                        {commission.commissionRate}%
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="font-bold text-green-600">
                        {formatCurrency(commission.commissionAmount)}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-gray-600 text-sm">
                      {formatDate(commission.orderDate)}
                    </td>
                    <td className="px-4 py-4">
                      <select
                        value={commission.status}
                        onChange={(e) =>
                          handleUpdateStatus(
                            commission._id,
                            e.target.value as any
                          )
                        }
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                          commission.status
                        )}`}
                      >
                        <option value="pending">Chờ xử lý</option>
                        <option value="paid">Đã thanh toán</option>
                        <option value="rejected">Từ chối</option>
                      </select>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setEditingCommission(commission);
                            setShowModal(true);
                          }}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteCommission(commission._id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {commissions.length === 0 && (
            <div className="text-center py-12">
              <DollarSign className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Chưa có hoa hồng nào</p>
              <button
                onClick={() => setShowModal(true)}
                className="mt-4 px-6 py-2 bg-gradient-to-br from-orange-500 via-orange-600 to-amber-600 text-white rounded-lg font-semibold hover:opacity-90 transition-opacity"
              >
                Thêm Hoa Hồng Đầu Tiên
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Commission Modal */}
      {showModal && (
        <CommissionModal
          commission={editingCommission}
          onClose={() => {
            setShowModal(false);
            setEditingCommission(null);
          }}
          onSave={() => {
            setShowModal(false);
            setEditingCommission(null);
            fetchData();
          }}
        />
      )}

      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        message={confirmModal.message}
        type="danger"
        confirmText="Xóa"
        cancelText="Hủy"
      />
    </div>
  );
};

// Stat Card Component
const StatCard = ({
  icon: Icon,
  title,
  value,
  color,
  bgColor,
}: {
  icon: any;
  title: string;
  value: string;
  color: string;
  bgColor: string;
}) => (
  <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
    <div className="flex items-center justify-between">
      <div className={`p-3 ${bgColor} rounded-lg`}>
        <Icon className={`w-6 h-6 ${color}`} />
      </div>
    </div>
    <h3 className="text-sm text-gray-600 mt-4">{title}</h3>
    <p className={`text-2xl font-bold ${color} mt-1`}>{value}</p>
  </div>
);

// Commission Modal Component
const CommissionModal = ({
  commission,
  onClose,
  onSave,
}: {
  commission: AffiliateCommission | null;
  onClose: () => void;
  onSave: () => void;
}) => {
  const [formData, setFormData] = useState({
    platformName: commission?.platformName || "",
    platformLogo: commission?.platformLogo || "",
    orderValue: commission?.orderValue || 0,
    commissionRate: commission?.commissionRate || 0,
    commissionAmount: commission?.commissionAmount || 0,
    orderDate: commission?.orderDate || new Date().toISOString().split("T")[0],
    status: commission?.status || "pending",
    notes: commission?.notes || "",
  });

  const [saving, setSaving] = useState(false);

  // Auto-calculate commission amount when order value or rate changes
  const handleOrderValueChange = (value: number) => {
    setFormData({
      ...formData,
      orderValue: value,
      commissionAmount: (value * formData.commissionRate) / 100,
    });
  };

  const handleCommissionRateChange = (rate: number) => {
    setFormData({
      ...formData,
      commissionRate: rate,
      commissionAmount: (formData.orderValue * rate) / 100,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    console.log("Submitting form data:", formData);

    try {
      let response;
      if (commission) {
        // Update
        console.log("Updating commission:", commission._id);
        response = await http.patch(
          `/affiliate-commissions/${commission._id}`,
          formData
        );
      } else {
        // Create
        console.log("Creating new commission");
        response = await http.post("/affiliate-commissions", formData);
      }
      console.log("Save response:", response);
      notification({ message: "Lưu thành công!", type: "success" });
      onSave();
    } catch (error: any) {
      console.error("Error saving commission:", error);
      console.error("Error response:", error.response?.data);
      notification({
        message: "Không thể lưu hoa hồng",
        description: error.response?.data?.message || error.message,
        type: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN").format(amount);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white z-10">
          <h2 className="text-2xl font-bold text-gray-800">
            {commission ? "Chỉnh Sửa Hoa Hồng" : "Thêm Hoa Hồng Mới"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Tên Nền Tảng *
              </label>
              <PlatformSelect
                value={formData.platformName}
                onChange={(value) =>
                  setFormData({ ...formData, platformName: value })
                }
                required
                placeholder="Chọn nền tảng"
                className="rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Ngày Đơn Hàng *
              </label>
              <input
                type="date"
                required
                value={formData.orderDate}
                onChange={(e) =>
                  setFormData({ ...formData, orderDate: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E91E63] focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              URL Logo
            </label>
            <input
              type="url"
              value={formData.platformLogo}
              onChange={(e) =>
                setFormData({ ...formData, platformLogo: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E91E63] focus:border-transparent"
              placeholder="https://..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Giá Trị Đơn Hàng (VNĐ) *
              </label>
              <input
                type="number"
                required
                value={formData.orderValue}
                onChange={(e) => handleOrderValueChange(Number(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E91E63] focus:border-transparent"
                placeholder="0"
                min="0"
              />
              <p className="text-xs text-gray-500 mt-1">
                {formatCurrency(formData.orderValue)} VNĐ
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Tỷ Lệ Hoa Hồng (%) *
              </label>
              <input
                type="number"
                required
                value={formData.commissionRate}
                onChange={(e) =>
                  handleCommissionRateChange(Number(e.target.value))
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E91E63] focus:border-transparent"
                placeholder="0"
                min="0"
                max="100"
                step="0.01"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Số Tiền Hoa Hồng (Tự động tính)
            </label>
            <div className="px-4 py-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-2xl font-bold text-green-600">
                {formatCurrency(formData.commissionAmount)} VNĐ
              </p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Trạng Thái
            </label>
            <select
              value={formData.status}
              onChange={(e: any) =>
                setFormData({ ...formData, status: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E91E63] focus:border-transparent"
            >
              <option value="pending">Chờ xử lý</option>
              <option value="paid">Đã thanh toán</option>
              <option value="rejected">Từ chối</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Ghi Chú
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E91E63] focus:border-transparent"
              rows={3}
              placeholder="Ghi chú về đơn hàng..."
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 px-6 py-3 bg-gradient-to-br from-orange-500 via-orange-600 to-amber-600 text-white rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {saving ? "Đang lưu..." : commission ? "Cập Nhật" : "Tạo Mới"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AffiliateManagement;
