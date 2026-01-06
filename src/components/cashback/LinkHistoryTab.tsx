import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Copy,
  ExternalLink,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Search,
  X,
  CircleDot,
  Store,
  Filter,
  Link2,
  TrendingUp,
  MousePointerClick,
} from "lucide-react";
import cashbackService from "@/services/cashbackService";

interface AffiliateLink {
  _id: string;
  originalUrl: string;
  shortUrl: string;
  shortCode: string;
  productName: string;
  productImage?: string;
  platformId: string;
  platformName: string;
  price?: number;
  commission?: number;
  commissionRate?: number;
  status: "active" | "paused" | "expired";
  clicks: number;
  conversions: number;
  earnings: number;
  createdAt: string;
  expiresAt?: string;
}

interface LinkHistoryTabProps {
  onStatsUpdate?: () => void;
}

const LinkHistoryTab: React.FC<LinkHistoryTabProps> = ({ onStatsUpdate }) => {
  const [links, setLinks] = useState<AffiliateLink[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [filters, setFilters] = useState({
    status: "",
    platform: "",
    search: "",
  });

  useEffect(() => {
    loadLinks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  useEffect(() => {
    if (page === 1) {
      loadLinks();
    } else {
      setPage(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const loadLinks = async () => {
    try {
      setLoading(true);

      // Only send filters that have values
      const params: any = { page, limit };
      if (filters.status) params.status = filters.status;
      if (filters.platform) params.platform = filters.platform;
      if (filters.search) params.search = filters.search;

      const response = await cashbackService.getUserLinks(params);

      setLinks(response.links || []);
      setTotal(response.total || 0);
      setTotalPages(response.totalPages || 0);

      if (onStatsUpdate) {
        onStatsUpdate();
      }
    } catch (error) {
      console.error("Error loading links:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You can add a toast notification here
  };

  const hasActiveFilters = filters.status || filters.platform || filters.search;

  const clearFilters = () => {
    setFilters({ status: "", platform: "", search: "" });
  };

  const IconButton = ({
    children,
    onClick,
    loading,
    active,
    className,
    ...props
  }: {
    children: React.ReactNode;
    onClick?: () => void;
    loading?: boolean;
    active?: boolean;
    className?: string;
    [key: string]: any;
  }) => (
    <button
      onClick={onClick}
      className={`relative flex items-center justify-center w-10 h-10 rounded-lg border border-gray-200 bg-white text-gray-600 hover:border-pink-500 hover:text-pink-600 hover:bg-pink-50/50 transition-all duration-200 active:scale-95 disabled:opacity-50 ${
        active ? "border-pink-500 bg-pink-50 text-pink-600" : ""
      } ${className}`}
      {...props}
    >
      {children}
    </button>
  );

  return (
    <div className="space-y-6">
      {/* Filters Section */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-4">
        <div className="flex flex-col gap-4">
          {/* Search Bar - Full Width */}
          <div className="relative group">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none z-10">
              <Search className="w-5 h-5 text-gray-400 group-focus-within:text-[#E91E63] transition-colors" />
            </div>
            <Input
              placeholder="Tìm kiếm sản phẩm, mã giảm giá..."
              value={filters.search}
              onChange={(e) =>
                setFilters({ ...filters, search: e.target.value })
              }
              className="pl-11 pr-10 h-12 text-base border-gray-200 focus:border-[#E91E63] focus:ring-[#E91E63] rounded-xl"
            />
            {filters.search && (
              <button
                onClick={() => setFilters({ ...filters, search: "" })}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Filters Row */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Filter Label */}
            <div className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200">
              <Filter className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-semibold text-gray-700">
                Bộ lọc:
              </span>
            </div>

            {/* Status Filter */}
            <div className="relative">
              <Select
                value={filters.status}
                onValueChange={(value: string) =>
                  setFilters({ ...filters, status: value })
                }
              >
                <SelectTrigger
                  className={`h-10 min-w-[140px] border-gray-200 rounded-xl transition-all ${
                    filters.status
                      ? "border-[#E91E63] bg-pink-50 text-[#E91E63] font-semibold"
                      : "hover:border-gray-300 bg-white"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <CircleDot className="w-4 h-4" />
                    <span className="text-sm">
                      {filters.status === "active"
                        ? "Hoạt động"
                        : filters.status === "paused"
                        ? "Tạm dừng"
                        : filters.status === "expired"
                        ? "Hết hạn"
                        : "Trạng thái"}
                    </span>
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Tất cả trạng thái</SelectItem>
                  <SelectItem value="active">✓ Hoạt động</SelectItem>
                  <SelectItem value="paused">⏸ Tạm dừng</SelectItem>
                  <SelectItem value="expired">⏰ Hết hạn</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Platform Filter */}
            <div className="relative">
              <Select
                value={filters.platform}
                onValueChange={(value: string) =>
                  setFilters({ ...filters, platform: value })
                }
              >
                <SelectTrigger
                  className={`h-10 min-w-[140px] border-gray-200 rounded-xl transition-all ${
                    filters.platform
                      ? "border-[#E91E63] bg-pink-50 text-[#E91E63] font-semibold"
                      : "hover:border-gray-300 bg-white"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Store className="w-4 h-4" />
                    <span className="text-sm">
                      {filters.platform === "shopee"
                        ? "Shopee"
                        : filters.platform === "lazada"
                        ? "Lazada"
                        : filters.platform === "tiki"
                        ? "Tiki"
                        : filters.platform === "sendo"
                        ? "Sendo"
                        : "Sàn TMĐT"}
                    </span>
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Tất cả sàn</SelectItem>
                  <SelectItem value="shopee">🛍 Shopee</SelectItem>
                  <SelectItem value="lazada">🛒 Lazada</SelectItem>
                  <SelectItem value="tiki">📦 Tiki</SelectItem>
                  <SelectItem value="sendo">🏪 Sendo</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Divider */}
            <div className="h-8 w-px bg-gray-200 hidden sm:block"></div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 ml-auto">
              <Button
                onClick={loadLinks}
                variant="outline"
                disabled={loading}
                className="h-10 px-4 border-gray-200 hover:border-[#E91E63] hover:bg-pink-50 hover:text-[#E91E63] transition-all rounded-xl"
              >
                <RefreshCw
                  className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`}
                />
                <span className="hidden sm:inline">Làm mới</span>
              </Button>

              {hasActiveFilters && (
                <Button
                  onClick={clearFilters}
                  variant="outline"
                  className="h-10 px-4 border-pink-200 bg-pink-50 text-[#E91E63] hover:bg-pink-100 hover:border-pink-300 transition-all rounded-xl font-semibold"
                >
                  <X className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Xóa lọc</span>
                </Button>
              )}
            </div>
          </div>

          {/* Active Filters Display */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-gray-100">
              <span className="text-xs font-medium text-gray-500">
                Đang lọc:
              </span>
              {filters.status && (
                <div className="flex items-center gap-1 px-2.5 py-1 bg-pink-50 border border-pink-200 rounded-lg">
                  <span className="text-xs font-medium text-[#E91E63]">
                    Trạng thái:{" "}
                    {filters.status === "active"
                      ? "Hoạt động"
                      : filters.status === "paused"
                      ? "Tạm dừng"
                      : "Hết hạn"}
                  </span>
                  <button
                    onClick={() => setFilters({ ...filters, status: "" })}
                    className="p-0.5 hover:bg-pink-100 rounded"
                  >
                    <X className="w-3 h-3 text-[#E91E63]" />
                  </button>
                </div>
              )}
              {filters.platform && (
                <div className="flex items-center gap-1 px-2.5 py-1 bg-pink-50 border border-pink-200 rounded-lg">
                  <span className="text-xs font-medium text-[#E91E63]">
                    Sàn:{" "}
                    {filters.platform.charAt(0).toUpperCase() +
                      filters.platform.slice(1)}
                  </span>
                  <button
                    onClick={() => setFilters({ ...filters, platform: "" })}
                    className="p-0.5 hover:bg-pink-100 rounded"
                  >
                    <X className="w-3 h-3 text-[#E91E63]" />
                  </button>
                </div>
              )}
              {filters.search && (
                <div className="flex items-center gap-1 px-2.5 py-1 bg-pink-50 border border-pink-200 rounded-lg">
                  <span className="text-xs font-medium text-[#E91E63]">
                    Tìm kiếm: "{filters.search}"
                  </span>
                  <button
                    onClick={() => setFilters({ ...filters, search: "" })}
                    className="p-0.5 hover:bg-pink-100 rounded"
                  >
                    <X className="w-3 h-3 text-[#E91E63]" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Links List */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl shadow-md border border-gray-100">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-[#E91E63]"></div>
            <Link2 className="w-8 h-8 text-[#E91E63] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          </div>
          <p className="mt-4 text-gray-600 font-medium">Đang tải dữ liệu...</p>
        </div>
      ) : links.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl shadow-md border border-gray-100">
          <div className="w-20 h-20 bg-gradient-to-br from-pink-100 to-orange-100 rounded-full flex items-center justify-center mb-4">
            <Link2 className="w-10 h-10 text-[#E91E63]" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Chưa có link nào
          </h3>
          <p className="text-gray-500 text-center max-w-md mb-6">
            Bạn chưa tạo link affiliate nào. Hãy bắt đầu tạo link để kiếm hoa
            hồng!
          </p>
          <Button
            onClick={() => (window.location.href = "/create-link")}
            className="bg-gradient-to-br from-orange-500 via-orange-600 to-amber-600 text-white hover:shadow-lg transition-all"
          >
            <Link2 className="w-4 h-4 mr-2" />
            Tạo link đầu tiên
          </Button>
        </div>
      ) : (
        <>
          {/* Mobile Cards */}
          <div className="sm:hidden space-y-4">
            {links.map((link) => (
              <div
                key={link._id}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-[#E91E63] overflow-hidden"
              >
                {/* Header with Status Badge */}
                <div className="relative">
                  <div className="flex items-start gap-3 p-4 pb-3">
                    {link.productImage && (
                      <div className="relative">
                        <img
                          src={link.productImage}
                          alt={link.productName}
                          className="w-20 h-20 object-cover rounded-xl border-2 border-gray-100 shadow-sm"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-2 mb-1.5">
                        <h4 className="font-bold text-sm text-gray-900 line-clamp-2 flex-1">
                          {link.productName}
                        </h4>
                        <Badge
                          className={`shrink-0 ${
                            link.status === "active"
                              ? "bg-green-500 text-white"
                              : link.status === "paused"
                              ? "bg-amber-500 text-white"
                              : "bg-gray-400 text-white"
                          }`}
                        >
                          {link.status === "active"
                            ? "Active"
                            : link.status === "paused"
                            ? "Paused"
                            : "Expired"}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Store className="w-3 h-3" />
                        <span className="font-medium">{link.platformName}</span>
                        <span>•</span>
                        <span>{formatDate(link.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-2 px-4 pb-3">
                  <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-3 border border-blue-100">
                    <div className="flex items-center gap-2 mb-1">
                      <MousePointerClick className="w-3.5 h-3.5 text-blue-600" />
                      <p className="text-xs font-medium text-blue-900">
                        Clicks
                      </p>
                    </div>
                    <p className="text-lg font-black text-blue-600">
                      {link.clicks}
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-3 border border-purple-100">
                    <div className="flex items-center gap-2 mb-1">
                      <TrendingUp className="w-3.5 h-3.5 text-purple-600" />
                      <p className="text-xs font-medium text-purple-900">
                        Chuyển đổi
                      </p>
                    </div>
                    <p className="text-lg font-black text-purple-600">
                      {link.conversions}
                    </p>
                  </div>
                </div>

                {/* Commission Info */}
                <div className="px-4 pb-3">
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-3 border border-green-100">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-medium text-green-900 mb-1">
                          Hoa hồng
                        </p>
                        <p className="text-base font-black text-green-600">
                          {link.commission
                            ? formatCurrency(link.commission)
                            : "N/A"}
                        </p>
                        {link.commissionRate && (
                          <p className="text-xs text-green-700 mt-0.5">
                            Tỷ lệ: {link.commissionRate}%
                          </p>
                        )}
                      </div>
                      {link.price && (
                        <div className="text-right">
                          <p className="text-xs text-gray-500">Giá gốc</p>
                          <p className="text-sm font-bold text-gray-700">
                            {formatCurrency(link.price)}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="px-4 pb-4">
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard(link.shortUrl)}
                      className="flex-1 h-10 border-gray-200 hover:border-[#E91E63] hover:bg-pink-50 hover:text-[#E91E63] transition-all rounded-xl font-semibold"
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copy
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => window.open(link.shortUrl, "_blank")}
                      className="flex-1 h-10 bg-gradient-to-br from-orange-500 via-orange-600 to-amber-600 text-white border-none hover:shadow-lg transition-all rounded-xl font-semibold"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Mở link
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table */}
          <div className="hidden sm:block overflow-hidden rounded-2xl bg-white shadow-md border border-gray-100">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
                  <th className="px-6 py-4 text-left">
                    <span className="text-sm font-bold text-gray-700 uppercase tracking-wide">
                      Sản phẩm
                    </span>
                  </th>
                  <th className="px-6 py-4 text-center">
                    <span className="text-sm font-bold text-gray-700 uppercase tracking-wide">
                      Sàn
                    </span>
                  </th>
                  <th className="px-6 py-4 text-center">
                    <span className="text-sm font-bold text-gray-700 uppercase tracking-wide">
                      Hoa hồng
                    </span>
                  </th>
                  <th className="px-6 py-4 text-center">
                    <span className="text-sm font-bold text-gray-700 uppercase tracking-wide">
                      Hiệu suất
                    </span>
                  </th>
                  <th className="px-6 py-4 text-center">
                    <span className="text-sm font-bold text-gray-700 uppercase tracking-wide">
                      Trạng thái
                    </span>
                  </th>
                  <th className="px-6 py-4 text-center">
                    <span className="text-sm font-bold text-gray-700 uppercase tracking-wide">
                      Thao tác
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {links.map((link, index) => (
                  <tr
                    key={link._id}
                    className="hover:bg-gradient-to-r hover:from-pink-50/50 hover:to-orange-50/50 transition-all duration-200 group"
                  >
                    {/* Sản phẩm */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        {link.productImage && (
                          <div className="relative">
                            <img
                              src={link.productImage}
                              alt={link.productName}
                              className="w-16 h-16 object-cover rounded-xl border-2 border-gray-100 shadow-sm group-hover:border-[#E91E63] transition-all"
                            />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-gray-900 line-clamp-2 mb-1 group-hover:text-[#E91E63] transition-colors">
                            {link.productName}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <span>{formatDate(link.createdAt)}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Sàn */}
                    <td className="px-6 py-4 text-center">
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg border border-gray-200">
                        <Store className="w-4 h-4 text-gray-600" />
                        <span className="font-semibold text-gray-700 text-sm">
                          {link.platformName}
                        </span>
                      </div>
                    </td>

                    {/* Hoa hồng */}
                    <td className="px-6 py-4 text-center">
                      <div className="space-y-1">
                        <p className="font-bold text-base text-green-600">
                          {link.commission
                            ? formatCurrency(link.commission)
                            : "N/A"}
                        </p>
                        {link.commissionRate && (
                          <p className="text-xs text-gray-500 font-medium">
                            Tỷ lệ: {link.commissionRate}%
                          </p>
                        )}
                        {link.price && (
                          <p className="text-xs text-gray-400">
                            Giá: {formatCurrency(link.price)}
                          </p>
                        )}
                      </div>
                    </td>

                    {/* Hiệu suất */}
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-3">
                        <div className="text-center px-3 py-2 bg-blue-50 rounded-lg border border-blue-100">
                          <p className="text-xs text-blue-600 font-medium mb-0.5">
                            Clicks
                          </p>
                          <p className="text-base font-bold text-blue-700">
                            {link.clicks}
                          </p>
                        </div>
                        <div className="text-center px-3 py-2 bg-purple-50 rounded-lg border border-purple-100">
                          <p className="text-xs text-purple-600 font-medium mb-0.5">
                            Chuyển đổi
                          </p>
                          <p className="text-base font-bold text-purple-700">
                            {link.conversions}
                          </p>
                        </div>
                      </div>
                      <p className="text-xs font-semibold text-green-600 text-center mt-2">
                        Thu nhập: {formatCurrency(link.earnings)}
                      </p>
                    </td>

                    {/* Trạng thái */}
                    <td className="px-6 py-4 text-center">
                      <Badge
                        className={`font-semibold px-3 py-1.5 text-xs ${
                          link.status === "active"
                            ? "bg-green-500 hover:bg-green-600 text-white"
                            : link.status === "paused"
                            ? "bg-amber-500 hover:bg-amber-600 text-white"
                            : "bg-gray-400 hover:bg-gray-500 text-white"
                        }`}
                      >
                        {link.status === "active"
                          ? "Active"
                          : link.status === "paused"
                          ? "Paused"
                          : "Expired"}
                      </Badge>
                    </td>

                    {/* Thao tác */}
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => copyToClipboard(link.shortUrl)}
                          title="Copy link"
                          className="h-9 w-9 p-0 border-gray-200 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 transition-all"
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => window.open(link.shortUrl, "_blank")}
                          title="Mở link"
                          className="h-9 px-4 bg-gradient-to-br from-orange-500 via-orange-600 to-amber-600 text-white border-none hover:shadow-lg transition-all font-semibold"
                        >
                          <ExternalLink className="w-4 h-4 mr-1.5" />
                          Mở
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 px-4 py-4 bg-white rounded-2xl shadow-md border border-gray-100">
              <p className="text-sm text-gray-600 font-medium">
                Hiển thị{" "}
                <span className="font-bold text-gray-900">
                  {(page - 1) * limit + 1}
                </span>{" "}
                -{" "}
                <span className="font-bold text-gray-900">
                  {Math.min(page * limit, total)}
                </span>{" "}
                trong tổng số{" "}
                <span className="font-bold text-[#E91E63]">{total}</span> link
              </p>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="h-10 px-4 border-gray-200 hover:border-[#E91E63] hover:bg-pink-50 hover:text-[#E91E63] transition-all rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  <span className="hidden sm:inline">Trước</span>
                </Button>

                <div className="flex items-center gap-2">
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (page <= 3) {
                      pageNum = i + 1;
                    } else if (page >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = page - 2 + i;
                    }

                    return (
                      <Button
                        key={pageNum}
                        size="sm"
                        variant={page === pageNum ? "default" : "outline"}
                        onClick={() => setPage(pageNum)}
                        className={`h-10 w-10 p-0 rounded-xl transition-all ${
                          page === pageNum
                            ? "bg-gradient-to-br from-orange-500 via-orange-600 to-amber-600 text-white border-none shadow-lg font-bold"
                            : "border-gray-200 hover:border-[#E91E63] hover:bg-pink-50 hover:text-[#E91E63]"
                        }`}
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="h-10 px-4 border-gray-200 hover:border-[#E91E63] hover:bg-pink-50 hover:text-[#E91E63] transition-all rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="hidden sm:inline">Sau</span>
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default LinkHistoryTab;
