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
} from "lucide-react";
import PlatformSelect from "@/components/common/PlatformSelect";

export default function LinkManagement() {
  const [links, setLinks] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    platform: "",
    status: "",
    search: "",
    page: 1,
    limit: 20,
  });

  useEffect(() => {
    loadLinks();
    loadStats();
  }, [filters]);

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
      await cashbackService.updateLinkStatus(linkId, status);
      loadLinks();
      alert("Cập nhật trạng thái thành công!");
    } catch (error) {
      alert("Lỗi khi cập nhật trạng thái");
    }
  };

  const handleDelete = async (linkId: string) => {
    if (!confirm("Bạn có chắc muốn xóa link này?")) return;

    try {
      await cashbackService.deleteLink(linkId);
      loadLinks();
      alert("Xóa link thành công!");
    } catch (error) {
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

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
            <ExternalLink className="text-orange-500" size={32} />
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
                <BarChart3 className="text-orange-500" size={32} />
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
                  <p className="text-2xl font-bold text-orange-500 mt-1">
                    {stats.overall?.totalConversions || 0}
                  </p>
                </div>
                <BarChart3 className="text-orange-500" size={32} />
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
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
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
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
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
              <div className="inline-block w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
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
                    <tr key={link._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
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
                            className="text-xs bg-orange-50 px-2 py-1 rounded font-mono truncate max-w-[120px]"
                            title={(link.userId as any)?._id}
                          >
                            {((link.userId as any)?._id || "").substring(0, 8)}
                            ...
                          </code>
                          {(link.userId as any)?._id && (
                            <button
                              onClick={() =>
                                handleCopyId((link.userId as any)._id, "userId")
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
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
