import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  PieChart as PieChartIcon,
  BarChart3,
  Download,
  RefreshCw,
} from "lucide-react";
import cashbackService from "@/services/cashbackService";
import { notification } from "@/utils/notification";

interface CashbackStats {
  totalEarned: number;
  pendingAmount: number;
  approvedAmount: number;
  paidAmount: number;
  rejectedAmount: number;
  totalTransactions: number;
  monthlyStats: Array<{
    month: number;
    amount: number;
    count: number;
  }>;
  statusBreakdown: {
    pending: { amount: number; count: number };
    approved: { amount: number; count: number };
    rejected: { amount: number; count: number };
    paid: { amount: number; count: number };
  };
}

const StatsTab: React.FC = () => {
  const [stats, setStats] = useState<CashbackStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    loadStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedYear]);

  const loadStats = async () => {
    try {
      setLoading(true);
      const data = await cashbackService.getUserCashbackStatsNew();
      setStats(data);
    } catch (error) {
      console.error("Error loading stats:", error);
      notification({
        message: "Không thể tải dữ liệu thống kê",
        type: "error",
      });
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

  const getMonthName = (month: number) => {
    const date = new Date();
    date.setMonth(month - 1);
    return date.toLocaleDateString("vi-VN", { month: "short" });
  };

  const exportData = () => {
    if (!stats) return;

    const csvData = [
      ["Month", "Amount", "Transactions"],
      ...stats.monthlyStats.map((item) => [
        getMonthName(item.month),
        item.amount.toString(),
        item.count.toString(),
      ]),
    ];

    const csvContent = csvData.map((row) => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `cashback-stats-${selectedYear}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    notification({
      message: "Đã xuất dữ liệu thành công!",
      type: "success",
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-8 text-gray-500">
        <PieChartIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
        <p>Chưa có dữ liệu thống kê</p>
      </div>
    );
  }

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

  return (
    <div className="space-y-6">
      {/* Controls */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Thống kê hoàn tiền
              </CardTitle>
              <CardDescription>
                Phân tích chi tiết về thu nhập hoàn tiền
              </CardDescription>
            </div>

            <div className="flex flex-wrap gap-2">
              <Select
                value={selectedYear.toString()}
                onValueChange={(value) => setSelectedYear(parseInt(value))}
              >
                <SelectTrigger className="w-[120px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {years.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button onClick={loadStats} variant="outline" disabled={loading}>
                <RefreshCw
                  className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`}
                />
                Làm mới
              </Button>

              <Button onClick={exportData} variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Xuất dữ liệu
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        <Card className="p-3 sm:p-4">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 sm:pb-2 p-0">
            <CardTitle className="text-xs sm:text-sm font-medium">
              Tổng thu nhập
            </CardTitle>
            <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-green-500" />
          </CardHeader>
          <CardContent className="p-0">
            <div className="text-lg sm:text-2xl font-bold text-green-600 mb-1">
              {formatCurrency(stats.totalEarned)}
            </div>
            <p className="text-xs text-gray-500">
              {stats.totalTransactions} giao dịch
            </p>
          </CardContent>
        </Card>

        <Card className="p-3 sm:p-4">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 sm:pb-2 p-0">
            <CardTitle className="text-xs sm:text-sm font-medium">
              Đang chờ duyệt
            </CardTitle>
            <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-500" />
          </CardHeader>
          <CardContent className="p-0">
            <div className="text-lg sm:text-2xl font-bold text-yellow-600 mb-1">
              {formatCurrency(stats.pendingAmount)}
            </div>
            <p className="text-xs text-gray-500">
              {stats.statusBreakdown.pending.count} giao dịch
            </p>
          </CardContent>
        </Card>

        <Card className="p-3 sm:p-4">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 sm:pb-2 p-0">
            <CardTitle className="text-xs sm:text-sm font-medium">
              Đã thanh toán
            </CardTitle>
            <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-blue-500" />
          </CardHeader>
          <CardContent className="p-0">
            <div className="text-lg sm:text-2xl font-bold text-blue-600 mb-1">
              {formatCurrency(stats.paidAmount)}
            </div>
            <p className="text-xs text-gray-500">
              {stats.statusBreakdown.paid.count} giao dịch
            </p>
          </CardContent>
        </Card>

        <Card className="p-3 sm:p-4">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 sm:pb-2 p-0">
            <CardTitle className="text-xs sm:text-sm font-medium">
              Từ chối
            </CardTitle>
            <TrendingDown className="h-3 w-3 sm:h-4 sm:w-4 text-red-500" />
          </CardHeader>
          <CardContent className="p-0">
            <div className="text-lg sm:text-2xl font-bold text-red-600 mb-1">
              {formatCurrency(stats.rejectedAmount)}
            </div>
            <p className="text-xs text-gray-500">
              {stats.statusBreakdown.rejected.count} giao dịch
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Stats Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Thu nhập theo tháng ({selectedYear})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {stats.monthlyStats.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Chưa có dữ liệu cho năm {selectedYear}
            </div>
          ) : (
            <div className="space-y-4">
              {stats.monthlyStats.map((month, index) => (
                <div
                  key={month.month}
                  className="flex items-center justify-between p-4 rounded-lg bg-gray-50"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 via-orange-600 to-amber-600 flex items-center justify-center text-sm font-semibold text-white">
                      {month.month}
                    </div>
                    <div>
                      <p className="font-medium">{getMonthName(month.month)}</p>
                      <p className="text-sm text-gray-500">
                        {month.count} giao dịch
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-green-600">
                      {formatCurrency(month.amount)}
                    </p>
                    <div className="w-20 h-2 bg-gray-200 rounded-full mt-1">
                      <div
                        className="h-full bg-gradient-to-br from-orange-500 via-orange-600 to-amber-600 rounded-full"
                        style={{
                          width: `${
                            Math.max(stats.monthlyStats)
                              ? (month.amount /
                                  Math.max(
                                    ...stats.monthlyStats.map((m) => m.amount)
                                  )) *
                                100
                              : 0
                          }%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Status Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChartIcon className="w-5 h-5" />
            Phân bố trạng thái
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-4 bg-yellow-50 rounded-lg">
              <div className="w-4 h-4 bg-yellow-400 rounded-full"></div>
              <div>
                <p className="font-medium text-yellow-900">Chờ duyệt</p>
                <p className="text-yellow-700">
                  {formatCurrency(stats.statusBreakdown.pending.amount)}
                </p>
                <p className="text-sm text-yellow-600">
                  {stats.statusBreakdown.pending.count} giao dịch
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
              <div className="w-4 h-4 bg-green-400 rounded-full"></div>
              <div>
                <p className="font-medium text-green-900">Đã duyệt</p>
                <p className="text-green-700">
                  {formatCurrency(stats.statusBreakdown.approved.amount)}
                </p>
                <p className="text-sm text-green-600">
                  {stats.statusBreakdown.approved.count} giao dịch
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
              <div className="w-4 h-4 bg-[orange-600] rounded-full"></div>
              <div>
                <p className="font-medium text-blue-900">Đã thanh toán</p>
                <p className="text-blue-700">
                  {formatCurrency(stats.statusBreakdown.paid.amount)}
                </p>
                <p className="text-sm text-blue-600">
                  {stats.statusBreakdown.paid.count} giao dịch
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-red-50 rounded-lg">
              <div className="w-4 h-4 bg-red-400 rounded-full"></div>
              <div>
                <p className="font-medium text-red-900">Bị từ chối</p>
                <p className="text-red-700">
                  {formatCurrency(stats.statusBreakdown.rejected.amount)}
                </p>
                <p className="text-sm text-red-600">
                  {stats.statusBreakdown.rejected.count} giao dịch
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Phân tích hiệu suất</CardTitle>
          <CardDescription>
            Thống kê chi tiết về hoạt động của bạn
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">
                Thu nhập trung bình/tháng
              </h4>
              <p className="text-2xl font-bold text-blue-600">
                {formatCurrency(
                  stats.totalEarned / Math.max(stats.monthlyStats.length, 1)
                )}
              </p>
              <p className="text-sm text-blue-700 mt-1">Trung bình mỗi tháng</p>
            </div>

            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-semibold text-green-900 mb-2">
                Tỷ lệ thành công
              </h4>
              <p className="text-2xl font-bold text-green-600">
                {stats.totalTransactions > 0
                  ? (
                      ((stats.statusBreakdown.approved.count +
                        stats.statusBreakdown.paid.count) /
                        stats.totalTransactions) *
                      100
                    ).toFixed(1)
                  : 0}
                %
              </p>
              <p className="text-sm text-green-700 mt-1">
                Được duyệt/thanh toán
              </p>
            </div>

            <div className="p-4 bg-purple-50 rounded-lg">
              <h4 className="font-semibold text-purple-900 mb-2">
                Giá trị trung bình/giao dịch
              </h4>
              <p className="text-2xl font-bold text-purple-600">
                {formatCurrency(
                  stats.totalTransactions > 0
                    ? stats.totalEarned / stats.totalTransactions
                    : 0
                )}
              </p>
              <p className="text-sm text-purple-700 mt-1">Mỗi giao dịch</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsTab;
