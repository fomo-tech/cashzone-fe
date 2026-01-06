import React, { useState, useEffect } from "react";
import {
  Search,
  Plus,
  Minus,
  Loader,
  DollarSign,
  User,
  Save,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import http from "@/services/api";
import CommonModal from "@/components/common/Modal";

interface UserWallet {
  _id: string;
  name?: string;
  email: string;
  phone?: string;
  wallet: {
    available: number;
    pending: number;
  };
  createdAt: string;
}

interface AdjustBalanceForm {
  userId: string;
  userName: string;
  currentBalance: number;
  amount: number;
  type: "add" | "subtract";
  reason: string;
}

const WalletManagement: React.FC = () => {
  const [users, setUsers] = useState<UserWallet[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [adjustForm, setAdjustForm] = useState<AdjustBalanceForm | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    loadUsers();
  }, [page, search]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await http.get("/wallet/admin/users", {
        params: { page, limit: 20, search },
      });
      setUsers(response.data.data.users);
      setTotalPages(response.data.data.pagination.pages);
    } catch (error) {
      console.error("Failed to load users:", error);
      showToast("Không thể tải danh sách người dùng");
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);

  const openAdjustModal = (user: UserWallet, type: "add" | "subtract") => {
    setAdjustForm({
      userId: user._id,
      userName: user.name || user.email,
      currentBalance: user.wallet.available,
      amount: 0,
      type,
      reason: "",
    });
    setIsModalOpen(true);
  };

  const handleAdjustBalance = async () => {
    if (!adjustForm || adjustForm.amount <= 0 || !adjustForm.reason.trim()) {
      showToast("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    try {
      setIsSubmitting(true);
      await http.post("/wallet/admin/adjust-balance", {
        userId: adjustForm.userId,
        amount: adjustForm.amount,
        type: adjustForm.type,
        reason: adjustForm.reason,
      });

      showToast(
        `Đã ${adjustForm.type === "add" ? "cộng" : "trừ"} ${formatCurrency(
          adjustForm.amount
        )} thành công`
      );
      setIsModalOpen(false);
      setAdjustForm(null);
      loadUsers();
    } catch (error: any) {
      console.error("Failed to adjust balance:", error);
      showToast(error.response?.data?.message || "Không thể điều chỉnh số dư");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 bg-orange-500 text-white px-6 py-3 rounded-xl shadow-lg">
          {toastMessage}
        </div>
      )}

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm kiếm theo email, tên, số điện thoại..."
            className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>
      </div>

      {/* User List */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader className="w-8 h-8 text-orange-500 animate-spin" />
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-slate-200 bg-slate-50">
                  <th className="py-4 px-6 text-left text-xs font-bold text-slate-600 uppercase">
                    Người Dùng
                  </th>
                  <th className="py-4 px-6 text-left text-xs font-bold text-slate-600 uppercase">
                    Email
                  </th>
                  <th className="py-4 px-6 text-left text-xs font-bold text-slate-600 uppercase">
                    SĐT
                  </th>
                  <th className="py-4 px-6 text-right text-xs font-bold text-slate-600 uppercase">
                    Số Dư Khả Dụng
                  </th>
                  <th className="py-4 px-6 text-right text-xs font-bold text-slate-600 uppercase">
                    Đang Chờ
                  </th>
                  <th className="py-4 px-6 text-center text-xs font-bold text-slate-600 uppercase">
                    Thao Tác
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((user) => (
                  <tr
                    key={user._id}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-1000 rounded-full flex items-center justify-center text-white font-bold">
                          {(user.name || user.email).charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800">
                            {user.name || "N/A"}
                          </p>
                          <p className="text-xs text-slate-500">
                            ID: {user._id.slice(-8)}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-slate-700">{user.email}</td>
                    <td className="py-4 px-6 text-slate-700">
                      {user.phone || "N/A"}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <span className="font-bold text-emerald-600">
                        {formatCurrency(user.wallet.available)}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <span className="font-semibold text-amber-600">
                        {formatCurrency(user.wallet.pending)}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => openAdjustModal(user, "add")}
                          className="p-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition-colors"
                          title="Cộng tiền"
                        >
                          <Plus className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => openAdjustModal(user, "subtract")}
                          className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                          title="Trừ tiền"
                        >
                          <Minus className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 py-4 border-t border-slate-200">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 border border-slate-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
              >
                Trước
              </button>
              <span className="text-sm text-slate-600">
                Trang {page} / {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 border border-slate-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
              >
                Sau
              </button>
            </div>
          )}
        </div>
      )}

      {/* Adjust Balance Modal */}
      <CommonModal
        isOpen={isModalOpen && !!adjustForm}
        onClose={() => setIsModalOpen(false)}
        title={
          adjustForm?.type === "add"
            ? "Cộng Tiền Vào Tài Khoản"
            : "Trừ Tiền Từ Tài Khoản"
        }
        width="max-w-lg"
        headerClassName="bg-slate-50"
      >
        {adjustForm && (
          <>
            {/* User Info */}
            <div className="mb-6 p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl border border-orange-100">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {adjustForm.userName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <User className="w-4 h-4 text-slate-600" />
                    <span className="font-bold text-slate-800">
                      {adjustForm.userName}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-emerald-600" />
                    <span className="text-sm text-slate-600">
                      Số dư:{" "}
                      <span className="font-bold text-emerald-600">
                        {formatCurrency(adjustForm.currentBalance)}
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Amount Input */}
            <div className="mb-6">
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-3">
                {adjustForm.type === "add" ? (
                  <TrendingUp className="w-5 h-5 text-emerald-600" />
                ) : (
                  <TrendingDown className="w-5 h-5 text-red-600" />
                )}
                Số Tiền {adjustForm.type === "add" ? "Cộng" : "Trừ"}
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  step="1000"
                  className="w-full pl-4 pr-20 py-4 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-orange-500 font-bold text-xl transition-all"
                  placeholder="0"
                  value={adjustForm.amount || ""}
                  onChange={(e) =>
                    setAdjustForm({
                      ...adjustForm,
                      amount: parseInt(e.target.value) || 0,
                    })
                  }
                  autoFocus
                />
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                  <span className="text-slate-400 font-bold text-sm">VND</span>
                </div>
              </div>
              {adjustForm.amount > 0 && (
                <p className="mt-2 text-sm text-slate-500">
                  ≈ {formatCurrency(adjustForm.amount)}
                </p>
              )}
            </div>

            {/* Reason Input */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-slate-700 mb-3">
                Lý Do <span className="text-red-500">*</span>
              </label>
              <textarea
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-orange-500 resize-none transition-all"
                rows={4}
                placeholder="Nhập lý do điều chỉnh số dư (bắt buộc)..."
                value={adjustForm.reason}
                onChange={(e) =>
                  setAdjustForm({ ...adjustForm, reason: e.target.value })
                }
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                disabled={isSubmitting}
                className="flex-1 py-3.5 border-2 border-slate-200 rounded-xl font-semibold text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50"
              >
                Hủy Bỏ
              </button>
              <button
                onClick={handleAdjustBalance}
                disabled={
                  isSubmitting ||
                  adjustForm.amount <= 0 ||
                  !adjustForm.reason.trim()
                }
                className={`flex-1 py-3.5 rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg ${
                  adjustForm.type === "add"
                    ? "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/30"
                    : "bg-red-600 hover:bg-red-700 shadow-red-500/30"
                } text-white disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none`}
              >
                {isSubmitting ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    Đang xử lý...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Xác Nhận {adjustForm.type === "add" ? "Cộng" : "Trừ"}
                  </>
                )}
              </button>
            </div>
          </>
        )}
      </CommonModal>
    </div>
  );
};

export default WalletManagement;
