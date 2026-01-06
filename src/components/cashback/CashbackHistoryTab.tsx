import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import {
  Search,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  X,
  CircleDot,
  FolderOpen,
  Filter,
} from "lucide-react";
import cashbackService from "@/services/cashbackService";

interface CashbackTransaction {
  _id: string;
  amount: number;
  status: "pending" | "approved" | "rejected" | "paid";
  type: "commission" | "bonus" | "referral";
  sourceType: "link" | "task" | "referral";
  sourceId: string;
  platformName: string;
  productName: string;
  description: string;
  transactionDate: string;
  approvedDate?: string;
  paidDate?: string;
  rejectedReason?: string;
  metadata: {
    orderId?: string;
    commissionRate?: number;
    originalAmount?: number;
  };
}

interface CashbackHistoryTabProps {
  onStatsUpdate?: () => void;
}

const CashbackHistoryTab: React.FC<CashbackHistoryTabProps> = ({
  onStatsUpdate,
}) => {
  const [transactions, setTransactions] = useState<CashbackTransaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [filters, setFilters] = useState({
    status: "",
    type: "",
    search: "",
  });

  useEffect(() => {
    loadHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  useEffect(() => {
    if (page === 1) {
      loadHistory();
    } else {
      setPage(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const loadHistory = async () => {
    try {
      setLoading(true);

      // Only send filters that have values
      const params: any = { page, limit };
      if (filters.status) params.status = filters.status;
      if (filters.type) params.type = filters.type;
      if (filters.search) params.search = filters.search;

      const response = await cashbackService.getUserOrders(params);

      setTransactions(response.orders || []);
      setTotal(response.total || 0);
      setTotalPages(response.totalPages || 0);

      if (onStatsUpdate) {
        onStatsUpdate();
      }
    } catch (error) {
      console.error("Error loading cashback history:", error);
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
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: string) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800",
      approved: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
      paid: "bg-orange-100 text-orange-800",
    };
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  const getTypeColor = (type: string) => {
    const colors = {
      commission: "bg-orange-100 text-orange-800",
      bonus: "bg-orange-100 text-orange-800",
      referral: "bg-green-100 text-green-800",
    };
    return colors[type as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  const hasActiveFilters = filters.status || filters.type || filters.search;

  const clearFilters = () => {
    setFilters({ status: "", type: "", search: "" });
  };

  return (
    <div className="space-y-6">
      {/* Filters Section */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-4">
        <div className="flex flex-col gap-4">
          {/* Search Bar - Full Width */}
          <div className="relative group">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none z-10">
              <Search className="w-5 h-5 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
            </div>
            <Input
              placeholder="Tìm kiếm giao dịch, đơn hàng..."
              value={filters.search}
              onChange={(e) =>
                setFilters({ ...filters, search: e.target.value })
              }
              className="pl-11 pr-10 h-12 text-base border-gray-200 focus:border-orange-500 focus:ring-orange-500 rounded-xl"
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
                      ? "border-orange-500 bg-orange-50 text-orange-500 font-semibold"
                      : "hover:border-gray-300 bg-white"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <CircleDot className="w-4 h-4" />
                    <span className="text-sm">
                      {filters.status === "pending"
                        ? "Chờ duyệt"
                        : filters.status === "approved"
                        ? "Đã duyệt"
                        : filters.status === "paid"
                        ? "Đã trả"
                        : filters.status === "rejected"
                        ? "Từ chối"
                        : "Trạng thái"}
                    </span>
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Tất cả trạng thái</SelectItem>
                  <SelectItem value="pending">⏳ Chờ duyệt</SelectItem>
                  <SelectItem value="approved">✅ Đã duyệt</SelectItem>
                  <SelectItem value="paid">💰 Đã trả</SelectItem>
                  <SelectItem value="rejected">❌ Từ chối</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Type Filter */}
            <div className="relative">
              <Select
                value={filters.type}
                onValueChange={(value: string) =>
                  setFilters({ ...filters, type: value })
                }
              >
                <SelectTrigger
                  className={`h-10 min-w-[140px] border-gray-200 rounded-xl transition-all ${
                    filters.type
                      ? "border-orange-500 bg-orange-50 text-orange-500 font-semibold"
                      : "hover:border-gray-300 bg-white"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <FolderOpen className="w-4 h-4" />
                    <span className="text-sm">
                      {filters.type === "commission"
                        ? "Hoa hồng"
                        : filters.type === "bonus"
                        ? "Thưởng"
                        : filters.type === "referral"
                        ? "Giới thiệu"
                        : "Loại GD"}
                    </span>
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Tất cả loại</SelectItem>
                  <SelectItem value="commission">💵 Hoa hồng</SelectItem>
                  <SelectItem value="bonus">🎁 Thưởng</SelectItem>
                  <SelectItem value="referral">👥 Giới thiệu</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Divider */}
            <div className="h-8 w-px bg-gray-200 hidden sm:block"></div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 ml-auto">
              <Button
                onClick={loadHistory}
                variant="outline"
                disabled={loading}
                className="h-10 px-4 border-gray-200 hover:border-orange-500 hover:bg-orange-50 hover:text-orange-500 transition-all rounded-xl"
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
                  className="h-10 px-4 border-orange-200 bg-orange-50 text-orange-500 hover:bg-orange-100 hover:border-orange-300 transition-all rounded-xl font-semibold"
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
                <div className="flex items-center gap-1 px-2.5 py-1 bg-orange-50 border border-orange-200 rounded-lg">
                  <span className="text-xs font-medium text-orange-500">
                    Trạng thái:{" "}
                    {filters.status === "pending"
                      ? "Chờ duyệt"
                      : filters.status === "approved"
                      ? "Đã duyệt"
                      : filters.status === "paid"
                      ? "Đã trả"
                      : "Từ chối"}
                  </span>
                  <button
                    onClick={() => setFilters({ ...filters, status: "" })}
                    className="p-0.5 hover:bg-orange-100 rounded"
                  >
                    <X className="w-3 h-3 text-orange-500" />
                  </button>
                </div>
              )}
              {filters.type && (
                <div className="flex items-center gap-1 px-2.5 py-1 bg-orange-50 border border-orange-200 rounded-lg">
                  <span className="text-xs font-medium text-orange-500">
                    Loại:{" "}
                    {filters.type === "commission"
                      ? "Hoa hồng"
                      : filters.type === "bonus"
                      ? "Thưởng"
                      : "Giới thiệu"}
                  </span>
                  <button
                    onClick={() => setFilters({ ...filters, type: "" })}
                    className="p-0.5 hover:bg-orange-100 rounded"
                  >
                    <X className="w-3 h-3 text-orange-500" />
                  </button>
                </div>
              )}
              {filters.search && (
                <div className="flex items-center gap-1 px-2.5 py-1 bg-orange-50 border border-orange-200 rounded-lg">
                  <span className="text-xs font-medium text-orange-500">
                    Tìm kiếm: "{filters.search}"
                  </span>
                  <button
                    onClick={() => setFilters({ ...filters, search: "" })}
                    className="p-0.5 hover:bg-orange-100 rounded"
                  >
                    <X className="w-3 h-3 text-orange-500" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Transaction List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
        </div>
      ) : transactions.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p>Chưa có giao dịch nào</p>
        </div>
      ) : (
        <>
          {/* Mobile Cards */}
          <div className="sm:hidden space-y-4">
            {transactions.map((transaction) => (
              <div
                key={transaction._id}
                className="bg-white rounded-lg p-4 border border-gray-100 hover:border-orange-500 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-gray-900 mb-2 line-clamp-2">
                      {transaction.productName || transaction.description}
                    </p>
                    <p className="text-xs text-gray-500">
                      {transaction.platformName}
                    </p>
                  </div>
                  <Badge
                    className={`${getStatusColor(
                      transaction.status
                    )} text-xs font-medium shrink-0`}
                  >
                    {transaction.status === "pending"
                      ? "Chờ"
                      : transaction.status === "approved"
                      ? "Duyệt"
                      : transaction.status === "paid"
                      ? "Trả"
                      : "Từ chối"}
                  </Badge>
                </div>

                <div className="flex items-center justify-between pt-3 mt-3 border-t">
                  <div className="flex items-center gap-2">
                    <Badge
                      className={`${getTypeColor(transaction.type)} text-xs`}
                    >
                      {transaction.type === "commission"
                        ? "Hoa hồng"
                        : transaction.type === "bonus"
                        ? "Thưởng"
                        : "Giới thiệu"}
                    </Badge>
                    {transaction.metadata?.commissionRate && (
                      <span className="text-xs text-gray-500">
                        {transaction.metadata.commissionRate}%
                      </span>
                    )}
                  </div>
                  <p className="text-base font-bold text-orange-500">
                    {formatCurrency(transaction.amount)}
                  </p>
                </div>

                <div className="flex items-center justify-between text-xs text-gray-400 pt-2 mt-2 border-t">
                  <span>{formatDate(transaction.transactionDate)}</span>
                </div>

                {transaction.rejectedReason && (
                  <div className="bg-red-50 rounded-lg p-2 mt-2">
                    <p className="text-xs text-red-600">
                      {transaction.rejectedReason}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Desktop Table */}
          <div className="hidden sm:block overflow-hidden rounded-lg border border-gray-100">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Mô tả
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
                    Loại
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
                    Số tiền
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
                    Trạng thái
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
                    Ngày
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {transactions.map((transaction) => (
                  <tr
                    key={transaction._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-sm text-gray-900">
                          {transaction.productName || transaction.description}
                        </p>
                        <p className="text-xs text-gray-500">
                          {transaction.platformName}
                        </p>
                        {transaction.metadata?.orderId && (
                          <p className="text-xs text-gray-400">
                            Mã ĐH: {transaction.metadata.orderId}
                          </p>
                        )}
                      </div>
                    </td>

                    <td className="px-6 py-4 text-center">
                      <Badge className={getTypeColor(transaction.type)}>
                        {transaction.type === "commission"
                          ? "Hoa hồng"
                          : transaction.type === "bonus"
                          ? "Thưởng"
                          : "Giới thiệu"}
                      </Badge>
                    </td>

                    <td className="px-4 py-3 text-center">
                      <div>
                        <p className="font-semibold text-orange-500 text-base">
                          {formatCurrency(transaction.amount)}
                        </p>
                        {transaction.metadata?.commissionRate && (
                          <p className="text-xs text-gray-500">
                            {transaction.metadata.commissionRate}%
                          </p>
                        )}
                      </div>
                    </td>

                    <td className="px-4 py-3 text-center">
                      <Badge className={getStatusColor(transaction.status)}>
                        {transaction.status === "pending"
                          ? "Chờ duyệt"
                          : transaction.status === "approved"
                          ? "Đã duyệt"
                          : transaction.status === "paid"
                          ? "Đã trả"
                          : "Từ chối"}
                      </Badge>
                      {transaction.rejectedReason && (
                        <p className="text-xs text-red-600 mt-1">
                          {transaction.rejectedReason}
                        </p>
                      )}
                    </td>

                    <td className="px-4 py-3 text-center">
                      <div className="space-y-1">
                        <p className="text-xs">
                          {formatDate(transaction.transactionDate)}
                        </p>
                        {transaction.approvedDate && (
                          <p className="text-xs text-green-600">
                            Duyệt: {formatDate(transaction.approvedDate)}
                          </p>
                        )}
                        {transaction.paidDate && (
                          <p className="text-xs text-orange-600">
                            Trả: {formatDate(transaction.paidDate)}
                          </p>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-4">
              <p className="text-sm text-gray-600">
                Hiển thị {(page - 1) * limit + 1} -{" "}
                {Math.min(page * limit, total)} / {total}
              </p>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <div className="flex items-center gap-1">
                  <span className="text-sm px-2">
                    {page} / {totalPages}
                  </span>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CashbackHistoryTab;
