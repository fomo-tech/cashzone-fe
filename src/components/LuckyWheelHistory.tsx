import React, { useState, useEffect } from "react";
import {
  History,
  Trophy,
  Calendar,
  Coins,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import luckywheelService, {
  type LuckyWheelHistory as HistoryItem,
} from "../services/luckywheelService";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

const LuckyWheelHistory: React.FC = () => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });

  const loadHistory = async (page = 1) => {
    setLoading(true);
    try {
      const data = await luckywheelService.getHistory(page, pagination.limit);
      setHistory(data.history);
      setPagination(data.pagination);
    } catch (error) {
      console.error("Error loading history:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory(pagination.page);
  }, []);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      loadHistory(newPage);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl border shadow-sm p-6">
        <div className="text-center text-gray-500">Đang tải lịch sử...</div>
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="bg-white rounded-xl border shadow-sm p-6">
        <div className="text-center text-gray-500">
          <History className="mx-auto h-12 w-12 mb-2 text-gray-400" />
          <p>Chưa có lịch sử quay</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 border-b">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-100 rounded-lg">
            <History className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">
              Lịch Sử Quay Thưởng
            </h3>
            <p className="text-sm text-gray-600">
              Tổng cộng {pagination.total} lượt quay
            </p>
          </div>
        </div>
      </div>

      {/* History List */}
      <div className="divide-y">
        {history.map((item) => (
          <div
            key={item._id}
            className="p-4 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 flex-1">
                <div className="p-2 bg-amber-100 rounded-lg">
                  <Trophy className="h-5 w-5 text-amber-600" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-900">
                    {item.prizeName}
                  </div>
                  <div className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                    <Calendar className="h-3 w-3" />
                    {format(new Date(item.spinDate), "dd/MM/yyyy HH:mm", {
                      locale: vi,
                    })}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-green-600">
                  +{item.prizeValue.toLocaleString("vi-VN")}đ
                </div>
                <div className="text-xs text-gray-500">
                  Chi phí:{" "}
                  {item.costPaid > 0
                    ? `${item.costPaid.toLocaleString("vi-VN")}đ`
                    : "Miễn phí"}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="p-4 border-t bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Trang {pagination.page} / {pagination.totalPages}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="p-2 rounded-lg border bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages}
                className="p-2 rounded-lg border bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LuckyWheelHistory;
