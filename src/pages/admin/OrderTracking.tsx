import { useEffect, useState } from "react";
import cashbackService from "@/services/cashbackService";
import {
  CheckCircle,
  XCircle,
  DollarSign,
  Search,
  Clock,
  Package,
  Plus,
  Edit,
  Trash2,
  X,
} from "lucide-react";
import PlatformSelect from "@/components/common/PlatformSelect";
import { notification } from "@/utils/notification";

interface OrderForm {
  userId: string;
  affiliateLinkId?: string;
  orderId: string;
  platform: string;
  orderAmount: number;
  commissionAmount: number;
  commissionRate: number;
  cashbackAmount: number;
  cashbackRate: number;
  orderDate: string;
  productName?: string;
  productImage?: string;
  cashbackStatus: "pending" | "approved" | "paid" | "rejected";
}

export default function OrderTracking() {
  const [orders, setOrders] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [editingOrder, setEditingOrder] = useState<any>(null);
  const [formData, setFormData] = useState<OrderForm>({
    userId: "",
    affiliateLinkId: "",
    orderId: "",
    platform: "shopee",
    orderAmount: 0,
    commissionAmount: 0,
    commissionRate: 10,
    cashbackAmount: 0,
    cashbackRate: 80,
    orderDate: new Date().toISOString().split("T")[0],
    productName: "",
    productImage: "",
    cashbackStatus: "pending",
  });
  const [filters, setFilters] = useState({
    platform: "",
    cashbackStatus: "",
    search: "",
    page: 1,
    limit: 20,
  });

  useEffect(() => {
    loadOrders();
    loadStats();
  }, [filters]);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const data = await cashbackService.getAllOrders(filters);
      setOrders(data.orders);
    } catch (error) {
      console.error("Failed to load orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const data = await cashbackService.getOverallOrderStats();
      setStats(data);
    } catch (error) {
      console.error("Failed to load stats:", error);
    }
  };

  const handleApprove = async (orderId: string) => {
    try {
      await cashbackService.approveOrder(orderId);
      loadOrders();
      loadStats();
      notification({ message: "Duyệt đơn hàng thành công!", type: "success" });
    } catch (error) {
      notification({ message: "Lỗi khi duyệt đơn hàng", type: "error" });
    }
  };

  const handleReject = async (orderId: string) => {
    const reason = prompt("Nhập lý do từ chối:");
    if (!reason) return;

    try {
      await cashbackService.rejectOrder(orderId, reason);
      loadOrders();
      loadStats();
      notification({
        message: "Từ chối đơn hàng thành công!",
        type: "success",
      });
    } catch (error) {
      notification({ message: "Lỗi khi từ chối đơn hàng", type: "error" });
    }
  };

  const handleMarkAsPaid = async (orderId: string) => {
    try {
      await cashbackService.markOrderAsPaid(orderId);
      loadOrders();
      loadStats();
      notification({
        message: "Đánh dấu đã thanh toán thành công!",
        type: "success",
      });
    } catch (error) {
      notification({ message: "Lỗi khi cập nhật trạng thái", type: "error" });
    }
  };

  const handleBulkApprove = async () => {
    if (selectedOrders.length === 0) {
      notification({
        message: "Vui lòng chọn ít nhất 1 đơn hàng",
        type: "warning",
      });
      return;
    }

    try {
      const count = await cashbackService.bulkApproveOrders(selectedOrders);
      loadOrders();
      loadStats();
      setSelectedOrders([]);
      alert(`Đã duyệt ${count} đơn hàng!`);
    } catch (error) {
      alert("Lỗi khi duyệt hàng loạt");
    }
  };

  const handleBulkMarkPaid = async () => {
    if (selectedOrders.length === 0) {
      notification({
        message: "Vui lòng chọn ít nhất 1 đơn hàng",
        type: "warning",
      });
      return;
    }

    try {
      const count = await cashbackService.bulkMarkAsPaid(selectedOrders);
      loadOrders();
      loadStats();
      setSelectedOrders([]);
      alert(`Đã đánh dấu thanh toán ${count} đơn hàng!`);
    } catch (error) {
      alert("Lỗi khi cập nhật hàng loạt");
    }
  };

  const handleCreateOrder = () => {
    setModalMode("create");
    setFormData({
      userId: "",
      affiliateLinkId: "",
      orderId: "",
      platform: "shopee",
      orderAmount: 0,
      commissionAmount: 0,
      commissionRate: 10,
      cashbackAmount: 0,
      cashbackRate: 80,
      orderDate: new Date().toISOString().split("T")[0],
      productName: "",
      productImage: "",
      cashbackStatus: "pending",
    });
    setShowModal(true);
  };

  const handleEditOrder = (order: any) => {
    setModalMode("edit");
    setEditingOrder(order);
    setFormData({
      userId:
        typeof order.userId === "string"
          ? order.userId
          : order.userId?._id || "",
      affiliateLinkId:
        typeof order.affiliateLinkId === "string"
          ? order.affiliateLinkId
          : order.affiliateLinkId?._id || "",
      orderId: order.orderId,
      platform: order.platform,
      orderAmount: order.orderAmount,
      commissionAmount: order.commissionAmount || 0,
      commissionRate: order.commissionRate || 10,
      cashbackAmount: order.cashbackAmount,
      cashbackRate: order.cashbackRate,
      orderDate: new Date(order.orderDate).toISOString().split("T")[0],
      productName: order.productName || "",
      productImage: order.productImage || "",
      cashbackStatus: order.cashbackStatus,
    });
    setShowModal(true);
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (!confirm("Bạn có chắc muốn xóa đơn hàng này?")) return;

    try {
      await cashbackService.deleteOrder(orderId);
      loadOrders();
      loadStats();
      notification({ message: "Xóa đơn hàng thành công!", type: "success" });
    } catch (error) {
      notification({ message: "Lỗi khi xóa đơn hàng", type: "error" });
    }
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (modalMode === "create") {
        await cashbackService.createOrder({
          ...formData,
          orderAmount: Number(formData.orderAmount),
          commissionAmount: Number(formData.commissionAmount),
          commissionRate: Number(formData.commissionRate),
          cashbackAmount: Number(formData.cashbackAmount),
          cashbackRate: Number(formData.cashbackRate),
        });
        alert("Thêm đơn hàng thành công!");
      } else {
        await cashbackService.updateOrder(editingOrder._id, {
          ...formData,
          orderAmount: Number(formData.orderAmount),
          commissionAmount: Number(formData.commissionAmount),
          commissionRate: Number(formData.commissionRate),
          cashbackAmount: Number(formData.cashbackAmount),
          cashbackRate: Number(formData.cashbackRate),
        });
        alert("Cập nhật đơn hàng thành công!");
      }
      loadOrders();
      loadStats();
      setShowModal(false);
    } catch (error: any) {
      alert(error.response?.data?.message || "Có lỗi xảy ra");
    }
  };

  const calculateCashback = () => {
    const amount = Number(formData.orderAmount);
    const rate = Number(formData.cashbackRate);
    if (amount > 0 && rate > 0) {
      setFormData({
        ...formData,
        cashbackAmount: (amount * rate) / 100,
      });
    }
  };

  const toggleSelectOrder = (orderId: string) => {
    setSelectedOrders((prev) =>
      prev.includes(orderId)
        ? prev.filter((id) => id !== orderId)
        : [...prev, orderId]
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
            <Package className="text-pink-600" size={32} />
            Quản lý Đơn hàng & Duyệt hoàn tiền
          </h1>
          <p className="text-gray-600 mt-2">
            Theo dõi và duyệt hoàn tiền cho các đơn hàng
          </p>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Tổng đơn</p>
                  <p className="text-2xl font-bold text-gray-800 mt-1">
                    {stats.overall?.totalOrders || 0}
                  </p>
                </div>
                <Package className="text-blue-500" size={32} />
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Tổng cashback</p>
                  <p className="text-xl font-bold text-green-600 mt-1">
                    {formatCurrency(stats.overall?.totalCashback || 0)}
                  </p>
                </div>
                <DollarSign className="text-green-500" size={32} />
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Chờ duyệt</p>
                  <p className="text-2xl font-bold text-yellow-600 mt-1">
                    {stats.byStatus?.find((s: any) => s._id === "pending")
                      ?.count || 0}
                  </p>
                </div>
                <Clock className="text-yellow-500" size={32} />
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Đã duyệt</p>
                  <p className="text-2xl font-bold text-purple-600 mt-1">
                    {stats.byStatus?.find((s: any) => s._id === "approved")
                      ?.count || 0}
                  </p>
                </div>
                <CheckCircle className="text-purple-500" size={32} />
              </div>
            </div>
          </div>
        )}

        {/* Filters & Bulk Actions */}
        <div className="bg-white rounded-xl p-6 shadow-md mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4 flex-wrap flex-1">
              <div className="flex-1 min-w-[200px]">
                <div className="relative">
                  <Search
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <input
                    type="text"
                    placeholder="Tìm kiếm đơn hàng, sản phẩm..."
                    value={filters.search}
                    onChange={(e) =>
                      setFilters({
                        ...filters,
                        search: e.target.value,
                        page: 1,
                      })
                    }
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                </div>
              </div>
              <PlatformSelect
                value={filters.platform}
                onChange={(value) =>
                  setFilters({ ...filters, platform: value, page: 1 })
                }
                placeholder="Tất cả Platform"
                className="px-4 py-2 rounded-lg"
              />
              <select
                value={filters.cashbackStatus}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    cashbackStatus: e.target.value,
                    page: 1,
                  })
                }
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              >
                <option value="">Tất cả Status</option>
                <option value="pending">Chờ duyệt</option>
                <option value="approved">Đã duyệt</option>
                <option value="paid">Đã trả</option>
                <option value="rejected">Từ chối</option>
              </select>
            </div>
            <button
              onClick={handleCreateOrder}
              className="ml-4 px-4 py-2 bg-gradient-to-r from-pink-500 to-orange-500 text-white rounded-lg hover:from-pink-600 hover:to-orange-600 flex items-center gap-2 whitespace-nowrap"
            >
              <Plus size={20} />
              Thêm đơn hàng
            </button>
          </div>

          {/* Bulk Actions */}
          {selectedOrders.length > 0 && (
            <div className="flex items-center gap-3 pt-4 border-t">
              <span className="text-sm text-gray-600">
                Đã chọn {selectedOrders.length} đơn
              </span>
              <button
                onClick={handleBulkApprove}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
              >
                <CheckCircle size={18} />
                Duyệt hàng loạt
              </button>
              <button
                onClick={handleBulkMarkPaid}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2"
              >
                <DollarSign size={18} />
                Đánh dấu đã trả
              </button>
            </div>
          )}
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-gray-500 mt-4">Đang tải...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Không có đơn hàng nào</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-4 py-4">
                      <input
                        type="checkbox"
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedOrders(orders.map((o) => o._id));
                          } else {
                            setSelectedOrders([]);
                          }
                        }}
                        checked={selectedOrders.length === orders.length}
                        className="w-4 h-4"
                      />
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">
                      Đơn hàng
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">
                      User
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">
                      Link Affiliate
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">
                      Số tiền
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">
                      Cashback
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">
                      Hành động
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {orders.map((order) => (
                    <tr key={order._id} className="hover:bg-gray-50">
                      <td className="px-4 py-4">
                        <input
                          type="checkbox"
                          checked={selectedOrders.includes(order._id)}
                          onChange={() => toggleSelectOrder(order._id)}
                          className="w-4 h-4"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {order.productImage && (
                            <img
                              src={order.productImage}
                              alt=""
                              className="w-12 h-12 rounded object-cover"
                            />
                          )}
                          <div>
                            <p className="font-medium text-gray-800 line-clamp-1">
                              {order.productName || "N/A"}
                            </p>
                            <p className="text-xs text-gray-500">
                              {order.orderId}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-800">
                          {(order.userId as any)?.name || "N/A"}
                        </p>
                        <p className="text-xs text-gray-500">
                          {(order.userId as any)?.email}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        {order.affiliateLinkId ? (
                          <div>
                            <p className="text-xs text-green-600 font-medium flex items-center gap-1">
                              <CheckCircle size={14} />
                              Có link
                            </p>
                            <p
                              className="text-xs text-gray-500 truncate max-w-[120px]"
                              title={(order.affiliateLinkId as any)?._id}
                            >
                              {(order.affiliateLinkId as any)?.shortCode ||
                                (order.affiliateLinkId as any)?._id ||
                                "N/A"}
                            </p>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400">
                            Không có
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium text-gray-800">
                          {formatCurrency(order.orderAmount)}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(order.orderDate).toLocaleDateString(
                            "vi-VN"
                          )}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-bold text-green-600">
                          {formatCurrency(order.cashbackAmount)}
                        </p>
                        <p className="text-xs text-gray-500">
                          {order.cashbackRate}%
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-1 text-xs rounded-full font-medium ${
                            order.cashbackStatus === "paid"
                              ? "bg-purple-100 text-purple-700"
                              : order.cashbackStatus === "approved"
                              ? "bg-green-100 text-green-700"
                              : order.cashbackStatus === "pending"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {order.cashbackStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {order.cashbackStatus === "pending" && (
                            <>
                              <button
                                onClick={() => handleApprove(order._id)}
                                className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                                title="Duyệt"
                              >
                                <CheckCircle size={18} />
                              </button>
                              <button
                                onClick={() => handleReject(order._id)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                title="Từ chối"
                              >
                                <XCircle size={18} />
                              </button>
                            </>
                          )}
                          {order.cashbackStatus === "approved" && (
                            <button
                              onClick={() => handleMarkAsPaid(order._id)}
                              className="px-3 py-1 bg-purple-600 text-white text-xs rounded-lg hover:bg-purple-700"
                            >
                              Đánh dấu đã trả
                            </button>
                          )}
                          <button
                            onClick={() => handleEditOrder(order)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                            title="Chỉnh sửa"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => handleDeleteOrder(order._id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                            title="Xóa"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modal for Create/Edit Order */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800">
                  {modalMode === "create"
                    ? "Thêm đơn hàng mới"
                    : "Chỉnh sửa đơn hàng"}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmitForm} className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      User ID <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.userId}
                      onChange={(e) =>
                        setFormData({ ...formData, userId: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      placeholder="ID của user"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Affiliate Link ID
                    </label>
                    <input
                      type="text"
                      value={formData.affiliateLinkId}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          affiliateLinkId: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      placeholder="ID của link đã tạo (nếu có)"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mã đơn hàng <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.orderId}
                      onChange={(e) =>
                        setFormData({ ...formData, orderId: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      placeholder="ORD123456"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Platform <span className="text-red-500">*</span>
                    </label>
                    <PlatformSelect
                      required
                      value={formData.platform}
                      onChange={(value) =>
                        setFormData({ ...formData, platform: value })
                      }
                      placeholder="Chọn platform"
                      className="rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ngày đặt hàng <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.orderDate}
                      onChange={(e) =>
                        setFormData({ ...formData, orderDate: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Số tiền đơn hàng (VND){" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={formData.orderAmount}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          orderAmount: Number(e.target.value),
                        })
                      }
                      onBlur={calculateCashback}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      placeholder="500000"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tỷ lệ hoa hồng (%) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      max="100"
                      step="0.01"
                      value={formData.commissionRate}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          commissionRate: Number(e.target.value),
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      placeholder="10"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Số tiền hoa hồng (VND){" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={formData.commissionAmount}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          commissionAmount: Number(e.target.value),
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-gray-50"
                      placeholder="50000"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tỷ lệ hoàn tiền (%){" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      max="100"
                      value={formData.cashbackRate}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          cashbackRate: Number(e.target.value),
                        })
                      }
                      onBlur={calculateCashback}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      placeholder="80"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Số tiền hoàn (VND) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={formData.cashbackAmount}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          cashbackAmount: Number(e.target.value),
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-gray-50"
                      placeholder="400000"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Trạng thái <span className="text-red-500">*</span>
                    </label>
                    <select
                      required
                      value={formData.cashbackStatus}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          cashbackStatus: e.target.value as any,
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    >
                      <option value="pending">Chờ duyệt</option>
                      <option value="approved">Đã duyệt</option>
                      <option value="paid">Đã trả</option>
                      <option value="rejected">Từ chối</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tên sản phẩm
                  </label>
                  <input
                    type="text"
                    value={formData.productName}
                    onChange={(e) =>
                      setFormData({ ...formData, productName: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    placeholder="Tên sản phẩm..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    URL hình ảnh sản phẩm
                  </label>
                  <input
                    type="text"
                    value={formData.productImage}
                    onChange={(e) =>
                      setFormData({ ...formData, productImage: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    placeholder="https://..."
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-pink-500 to-orange-500 text-white rounded-lg hover:from-pink-600 hover:to-orange-600"
                  >
                    {modalMode === "create" ? "Thêm đơn hàng" : "Cập nhật"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
