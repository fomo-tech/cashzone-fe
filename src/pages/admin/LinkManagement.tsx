import { useEffect, useState } from "react";
import cashbackService from "@/services/cashbackService";
import {
  ExternalLink,
  Trash2,
  Ban,
  CheckCircle,
  Search,
  BarChart3,
  Copy,
  Check,
  ShoppingBag,
  X,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import PlatformSelect from "@/components/common/PlatformSelect";

export default function LinkManagement() {
  const [links, setLinks] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [selectedLink, setSelectedLink] = useState<any>(null);
  const [platforms, setPlatforms] = useState<any[]>([]);
  const [linkOrders, setLinkOrders] = useState<Record<string, any[]>>({});
  const [expandedLinks, setExpandedLinks] = useState<Set<string>>(new Set());
  const [loadingOrders, setLoadingOrders] = useState<Set<string>>(new Set());
  const [orderData, setOrderData] = useState({
    orderId: "",
    orderAmount: 0,
    cashbackRate: 5,
    notes: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [filters, setFilters] = useState({
    platform: "",
    status: "",
    search: "",
    page: 1,
    limit: 20,
  });

  useEffect(() => {
    loadPlatforms();
  }, []);

  useEffect(() => {
    loadLinks();
    loadStats();
  }, [filters]);

  const loadPlatforms = async () => {
    try {
      console.log("Loading platforms...");
      const data = await cashbackService.getPlatforms({ status: "active" });
      console.log("Platforms loaded:", data);
      setPlatforms(data || []);
    } catch (error) {
      console.error("Failed to load platforms:", error);
      setPlatforms([]);
    }
  };

  const loadLinks = async () => {
    setLoading(true);
    try {
      const data = await cashbackService.getAllLinks(filters);
      setLinks(data.links);
    } catch (error) {
      console.error("Failed to load links:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const data = await cashbackService.getOverallLinkStats();
      setStats(data);
    } catch (error) {
      console.error("Failed to load stats:", error);
    }
  };

  const handleUpdateStatus = async (linkId: string, status: string) => {
    try {
      await cashbackService.updateLinkStatus(
        linkId,
        status as "active" | "expired" | "suspended"
      );
      loadLinks();
      alert("Cập nhật trạng thái thành công!");
    } catch (error: any) {
      console.error("Error updating status:", error);
      alert("Lỗi khi cập nhật trạng thái");
    }
  };

  const handleDelete = async (linkId: string) => {
    if (!confirm("Bạn có chắc muốn xóa link này?")) return;

    try {
      await cashbackService.deleteLink(linkId);
      loadLinks();
      alert("Xóa link thành công!");
    } catch (error: any) {
      console.error("Error deleting link:", error);
      alert("Lỗi khi xóa link");
    }
  };

  const handleCopyId = async (id: string, type: "userId" | "linkId") => {
    try {
      await navigator.clipboard.writeText(id);
      setCopiedId(`${type}-${id}`);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  // Helper function: Lấy tỷ lệ hoàn tiền từ platform (reusable)
  const getPlatformRate = (platformName: string): number => {
    if (!platforms || platforms.length === 0) {
      console.warn("Platforms not loaded yet, using default rate");
      return 5;
    }

    const platform = platforms.find(
      (p) =>
        p.name.toLowerCase() === platformName.toLowerCase() ||
        p.slug === platformName.toLowerCase()
    );

    if (
      platform &&
      platform.commissionType === "percentage" &&
      platform.commissionValue > 0
    ) {
      console.log(
        `Found platform ${platformName} with rate: ${platform.commissionValue}%`
      );
      return platform.commissionValue;
    }

    console.log(
      `Platform ${platformName} not found or no rate, using default 5%`
    );
    return 5; // Default 5%
  };

  const handleOpenOrderModal = (link: any) => {
    console.log("Opening order modal for link:", link);
    setSelectedLink(link);

    // Lấy rate từ link hoặc platform
    const linkRate = link.cashbackRate || link.commissionRate;
    const platformRate = getPlatformRate(link.platform);
    const finalRate = linkRate || platformRate;

    console.log("Rate sources:", { linkRate, platformRate, finalRate });

    setOrderData({
      orderId: "",
      orderAmount: link.productPrice || 0,
      cashbackRate: finalRate,
      notes: "",
    });
    setShowOrderModal(true);
  };

  const handleCreateOrder = async () => {
    console.log("Creating order with data:", orderData);
    console.log("Selected link:", selectedLink);

    if (!selectedLink) {
      alert("Không tìm thấy thông tin link");
      return;
    }

    if (!orderData.orderId || orderData.orderAmount <= 0) {
      alert("Vui lòng nhập đầy đủ thông tin đơn hàng");
      return;
    }

    setSubmitting(true);
    try {
      console.log("Calling API with:", {
        linkId: selectedLink._id,
        data: {
          orderId: orderData.orderId,
          orderAmount: orderData.orderAmount,
          cashbackRate: orderData.cashbackRate,
          productName: selectedLink.productName,
          productImage: selectedLink.productImage,
          notes: orderData.notes || "Đơn hàng được tạo bởi admin",
        },
      });

      const response = await cashbackService.adminCreateOrderForLink(
        selectedLink._id,
        {
          orderId: orderData.orderId,
          orderAmount: orderData.orderAmount,
          cashbackRate: orderData.cashbackRate,
          productName: selectedLink.productName,
          productImage: selectedLink.productImage,
          notes: orderData.notes || "Đơn hàng được tạo bởi admin",
        }
      );

      console.log("API response:", response);
      alert("Tạo đơn hoàn tiền thành công!");
      setShowOrderModal(false);
      loadLinks();
      loadStats();
    } catch (error: any) {
      console.error("Error creating order:", error);
      console.error("Error response:", error?.response);
      alert(
        error?.response?.data?.message ||
          error?.message ||
          "Lỗi khi tạo đơn hoàn tiền. Vui lòng thử lại."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const toggleLinkExpand = async (linkId: string) => {
    const newExpanded = new Set(expandedLinks);
    if (newExpanded.has(linkId)) {
      newExpanded.delete(linkId);
    } else {
      newExpanded.add(linkId);
      // Load orders nếu chưa load
      if (!linkOrders[linkId]) {
        await loadLinkOrders(linkId);
      }
    }
    setExpandedLinks(newExpanded);
  };

  const loadLinkOrders = async (linkId: string) => {
    setLoadingOrders(new Set(loadingOrders).add(linkId));
    try {
      const response = await cashbackService.adminGetLinkOrders(linkId);
      setLinkOrders({ ...linkOrders, [linkId]: response.data.orders });
    } catch (error: any) {
      console.error("Error loading orders:", error);
    } finally {
      const newLoading = new Set(loadingOrders);
      newLoading.delete(linkId);
      setLoadingOrders(newLoading);
    }
  };

  const handleApproveOrder = async (orderId: string, linkId: string) => {
    if (!confirm("Đồng ý duyệt đơn hàng này?")) return;

    try {
      await cashbackService.adminApproveOrder(orderId);
      alert("Đã duyệt đơn hàng thành công!");
      await loadLinkOrders(linkId);
      loadStats();
    } catch (error: any) {
      alert(error?.response?.data?.message || "Lỗi khi duyệt đơn hàng");
    }
  };

  const handleMarkAsPaid = async (orderId: string, linkId: string) => {
    if (!confirm("Đánh dấu đã hoàn tiền và cộng tiền vào ví user?")) return;

    try {
      await cashbackService.adminMarkOrderAsPaid(orderId);
      alert("Đã hoàn tiền thành công!");
      await loadLinkOrders(linkId);
      loadStats();
    } catch (error: any) {
      alert(error?.response?.data?.message || "Lỗi khi đánh dấu đã hoàn tiền");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
            <ExternalLink className="text-pink-600" size={32} />
            Quản lý Link Affiliate
          </h1>
          <p className="text-gray-600 mt-2">
            Quản lý tất cả link affiliate được tạo bởi users
          </p>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Tổng Link</p>
                  <p className="text-2xl font-bold text-gray-800 mt-1">
                    {stats.overall?.totalLinks || 0}
                  </p>
                </div>
                <BarChart3 className="text-blue-500" size={32} />
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Link Active</p>
                  <p className="text-2xl font-bold text-green-600 mt-1">
                    {stats.overall?.activeLinks || 0}
                  </p>
                </div>
                <CheckCircle className="text-green-500" size={32} />
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Tổng Click</p>
                  <p className="text-2xl font-bold text-orange-600 mt-1">
                    {stats.overall?.totalClicks || 0}
                  </p>
                </div>
                <ExternalLink className="text-orange-500" size={32} />
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Conversion</p>
                  <p className="text-2xl font-bold text-purple-600 mt-1">
                    {stats.overall?.totalConversions || 0}
                  </p>
                </div>
                <BarChart3 className="text-purple-500" size={32} />
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-xl p-6 shadow-md mb-6">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Tìm kiếm link, product..."
                  value={filters.search}
                  onChange={(e) =>
                    setFilters({ ...filters, search: e.target.value, page: 1 })
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
              value={filters.status}
              onChange={(e) =>
                setFilters({ ...filters, status: e.target.value, page: 1 })
              }
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            >
              <option value="">Tất cả Status</option>
              <option value="active">Active</option>
              <option value="expired">Expired</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
        </div>

        {/* Links Table */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-gray-500 mt-4">Đang tải...</p>
            </div>
          ) : links.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Không có link nào</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">
                      Sản phẩm
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">
                      Link ID
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">
                      User
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">
                      User ID
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">
                      Platform
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">
                      Click
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
                  {links.map((link) => (
                    <>
                      <tr key={link._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => toggleLinkExpand(link._id)}
                              className="p-1 hover:bg-gray-200 rounded"
                            >
                              {expandedLinks.has(link._id) ? (
                                <ChevronDown size={16} />
                              ) : (
                                <ChevronRight size={16} />
                              )}
                            </button>
                            {link.productImage && (
                              <img
                                src={link.productImage}
                                alt=""
                                className="w-12 h-12 rounded object-cover"
                              />
                            )}
                            <div>
                              <p className="font-medium text-gray-800 line-clamp-1">
                                {link.productName || "N/A"}
                              </p>
                              <p className="text-xs text-gray-500">
                                {link.shortCode}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <code
                              className="text-xs bg-gray-100 px-2 py-1 rounded font-mono truncate max-w-[120px]"
                              title={link._id}
                            >
                              {link._id.substring(0, 8)}...
                            </code>
                            <button
                              onClick={() => handleCopyId(link._id, "linkId")}
                              className="p-1 text-gray-600 hover:bg-gray-100 rounded"
                              title="Copy Link ID"
                            >
                              {copiedId === `linkId-${link._id}` ? (
                                <Check size={14} className="text-green-600" />
                              ) : (
                                <Copy size={14} />
                              )}
                            </button>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-gray-800">
                            {(link.userId as any)?.name || "N/A"}
                          </p>
                          <p className="text-xs text-gray-500">
                            {(link.userId as any)?.email}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <code
                              className="text-xs bg-blue-50 px-2 py-1 rounded font-mono truncate max-w-[120px]"
                              title={(link.userId as any)?._id}
                            >
                              {((link.userId as any)?._id || "").substring(
                                0,
                                8
                              )}
                              ...
                            </code>
                            {(link.userId as any)?._id && (
                              <button
                                onClick={() =>
                                  handleCopyId(
                                    (link.userId as any)._id,
                                    "userId"
                                  )
                                }
                                className="p-1 text-gray-600 hover:bg-gray-100 rounded"
                                title="Copy User ID"
                              >
                                {copiedId ===
                                `userId-${(link.userId as any)._id}` ? (
                                  <Check size={14} className="text-green-600" />
                                ) : (
                                  <Copy size={14} />
                                )}
                              </button>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-1 text-xs rounded-full bg-orange-100 text-orange-700 font-medium">
                            {link.platform}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-gray-800">
                            {link.clickCount}
                          </p>
                          <p className="text-xs text-gray-500">
                            {link.conversionCount} conversions
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-2 py-1 text-xs rounded-full font-medium ${
                              link.status === "active"
                                ? "bg-green-100 text-green-700"
                                : link.status === "expired"
                                ? "bg-gray-100 text-gray-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {link.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleOpenOrderModal(link)}
                              className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg"
                              title="Tạo đơn hoàn tiền"
                            >
                              <ShoppingBag size={18} />
                            </button>
                            {link.status === "active" && (
                              <button
                                onClick={() =>
                                  handleUpdateStatus(link._id, "suspended")
                                }
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                title="Suspend"
                              >
                                <Ban size={18} />
                              </button>
                            )}
                            {link.status === "suspended" && (
                              <button
                                onClick={() =>
                                  handleUpdateStatus(link._id, "active")
                                }
                                className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                                title="Activate"
                              >
                                <CheckCircle size={18} />
                              </button>
                            )}
                            <button
                              onClick={() => handleDelete(link._id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                              title="Delete"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>

                      {/* Expandable Orders Row */}
                      {expandedLinks.has(link._id) && (
                        <tr>
                          <td colSpan={8} className="px-6 py-4 bg-gray-50">
                            <div className="pl-8">
                              <h4 className="font-semibold text-gray-800 mb-3">
                                Đơn hàng của link này
                              </h4>
                              {loadingOrders.has(link._id) ? (
                                <div className="text-center py-4">
                                  <div className="inline-block w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                                </div>
                              ) : linkOrders[link._id] &&
                                linkOrders[link._id].length > 0 ? (
                                <div className="space-y-3">
                                  {linkOrders[link._id].map((order: any) => (
                                    <div
                                      key={order._id}
                                      className="bg-white rounded-lg p-4 border"
                                    >
                                      <div className="grid grid-cols-5 gap-4 items-center">
                                        <div>
                                          <p className="text-xs text-gray-600">
                                            Mã đơn
                                          </p>
                                          <p className="font-mono text-sm">
                                            {order.orderId}
                                          </p>
                                        </div>
                                        <div>
                                          <p className="text-xs text-gray-600">
                                            Số tiền
                                          </p>
                                          <p className="font-semibold text-orange-600">
                                            {order.orderAmount.toLocaleString()}
                                            đ
                                          </p>
                                          <p className="text-xs text-gray-500">
                                            Hoàn:{" "}
                                            {order.cashbackAmount.toLocaleString()}
                                            đ
                                          </p>
                                        </div>
                                        <div>
                                          <p className="text-xs text-gray-600">
                                            Ngày tạo
                                          </p>
                                          <p className="text-sm">
                                            {new Date(
                                              order.createdAt
                                            ).toLocaleDateString("vi-VN")}
                                          </p>
                                        </div>
                                        <div>
                                          <p className="text-xs text-gray-600">
                                            Trạng thái
                                          </p>
                                          <span
                                            className={`inline-block px-2 py-1 text-xs rounded-full font-medium ${
                                              order.cashbackStatus === "paid"
                                                ? "bg-green-100 text-green-700"
                                                : order.cashbackStatus ===
                                                  "approved"
                                                ? "bg-blue-100 text-blue-700"
                                                : order.cashbackStatus ===
                                                  "pending"
                                                ? "bg-yellow-100 text-yellow-700"
                                                : "bg-gray-100 text-gray-700"
                                            }`}
                                          >
                                            {order.cashbackStatus === "paid"
                                              ? "Đã hoàn tiền"
                                              : order.cashbackStatus ===
                                                "approved"
                                              ? "Đã duyệt"
                                              : order.cashbackStatus ===
                                                "pending"
                                              ? "Đang xử lý"
                                              : order.cashbackStatus}
                                          </span>
                                        </div>
                                        <div className="flex gap-2">
                                          {order.cashbackStatus ===
                                            "pending" && (
                                            <button
                                              onClick={() =>
                                                handleApproveOrder(
                                                  order._id,
                                                  link._id
                                                )
                                              }
                                              className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
                                            >
                                              Duyệt
                                            </button>
                                          )}
                                          {order.cashbackStatus ===
                                            "approved" && (
                                            <button
                                              onClick={() =>
                                                handleMarkAsPaid(
                                                  order._id,
                                                  link._id
                                                )
                                              }
                                              className="px-3 py-1 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700"
                                            >
                                              Đã hoàn tiền
                                            </button>
                                          )}
                                          {order.cashbackStatus === "paid" && (
                                            <span className="text-xs text-green-600 font-medium">
                                              ✓ Hoàn thành
                                            </span>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-gray-500 text-sm">
                                  Chưa có đơn hàng nào. Click button 🛍️ để tạo
                                  đơn mới.
                                </p>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modal Tạo Đơn Hoàn Tiền */}
        {showOrderModal && selectedLink && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <ShoppingBag className="text-orange-600" size={28} />
                    Duyệt Đơn Hoàn Tiền
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Tạo đơn hoàn tiền từ link - Có thể thay đổi số tiền nếu cần
                  </p>
                </div>
                <button
                  onClick={() => setShowOrderModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={24} className="text-gray-600" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Thông tin Link */}
                <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-4">
                  <h3 className="font-semibold text-gray-800 mb-3">
                    Thông tin Link
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-600">Sản phẩm</p>
                      <p className="font-medium text-gray-800">
                        {selectedLink.productName || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Giá sản phẩm</p>
                      <p className="font-medium text-orange-600">
                        {selectedLink.productPrice
                          ? `${selectedLink.productPrice.toLocaleString()}đ`
                          : "Chưa có"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Platform</p>
                      <p className="font-medium text-gray-800">
                        {selectedLink.platform}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Tỷ lệ hoàn tiền</p>
                      <p className="font-medium text-green-600">
                        {selectedLink.cashbackRate ||
                          getPlatformRate(selectedLink.platform)}
                        %
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">User</p>
                      <p className="font-medium text-gray-800">
                        {(selectedLink.userId as any)?.name || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">
                        Click / Conversion
                      </p>
                      <p className="font-medium text-gray-800">
                        {selectedLink.clickCount} /{" "}
                        {selectedLink.conversionCount}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Form nhập thông tin đơn hàng */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mã đơn hàng <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={orderData.orderId}
                      onChange={(e) =>
                        setOrderData({ ...orderData, orderId: e.target.value })
                      }
                      placeholder="VD: 2401SHOP12345 (từ Shopee/Lazada...)"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Số tiền đơn hàng
                        {selectedLink.productPrice && (
                          <span className="text-xs text-green-600 ml-2">
                            (Mặc định:{" "}
                            {selectedLink.productPrice.toLocaleString()}đ)
                          </span>
                        )}
                      </label>
                      <input
                        type="number"
                        value={orderData.orderAmount || ""}
                        onChange={(e) =>
                          setOrderData({
                            ...orderData,
                            orderAmount: parseFloat(e.target.value) || 0,
                          })
                        }
                        placeholder={
                          selectedLink.productPrice?.toString() ||
                          "Nhập số tiền"
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Để trống nếu giá không thay đổi
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tỷ lệ hoàn tiền (%)
                        <span className="text-xs text-gray-500 ml-2">
                          (Từ platform: {getPlatformRate(selectedLink.platform)}
                          %)
                        </span>
                      </label>
                      <input
                        type="number"
                        value={orderData.cashbackRate}
                        onChange={(e) =>
                          setOrderData({
                            ...orderData,
                            cashbackRate: parseFloat(e.target.value) || 5,
                          })
                        }
                        placeholder={getPlatformRate(
                          selectedLink.platform
                        ).toString()}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Tính toán hoàn tiền */}
                  {orderData.orderAmount > 0 && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">
                          Số tiền hoàn lại:
                        </span>
                        <span className="text-xl font-bold text-green-600">
                          {(
                            (orderData.orderAmount * orderData.cashbackRate) /
                            100
                          ).toLocaleString()}
                          đ
                        </span>
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ghi chú
                    </label>
                    <textarea
                      value={orderData.notes}
                      onChange={(e) =>
                        setOrderData({ ...orderData, notes: e.target.value })
                      }
                      placeholder="Ghi chú thêm về đơn hàng (không bắt buộc)"
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="sticky bottom-0 bg-gray-50 px-6 py-4 flex items-center justify-end gap-3 border-t">
                <button
                  onClick={() => setShowOrderModal(false)}
                  disabled={submitting}
                  className="px-6 py-3 text-gray-700 hover:bg-gray-200 rounded-lg font-medium transition-colors disabled:opacity-50"
                >
                  Hủy
                </button>
                <button
                  onClick={handleCreateOrder}
                  disabled={
                    submitting ||
                    !orderData.orderId ||
                    orderData.orderAmount <= 0
                  }
                  className="px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg font-medium hover:from-orange-600 hover:to-amber-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {submitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Đang tạo...
                    </>
                  ) : (
                    <>
                      <ShoppingBag size={18} />
                      Duyệt Đơn (Trạng thái: Đang xử lý)
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Note: Sau khi duyệt, admin cần vào trang quản lý đơn hàng để đánh dấu đã hoàn tiền */}
      </div>
    </div>
  );
}
