import React, { useState, useMemo } from "react";
import {
  Banknote,
  Wallet,
  Smartphone,
  Landmark,
  AlertTriangle,
  Lock,
  Save,
  CheckCircle,
  Clock,
  ArrowDownCircle,
  ArrowUpCircle,
  PlusCircle,
  ArrowRight,
  X,
  User,
  ArrowDownRight,
} from "lucide-react";

// =========================================================================
// MOCK DATA & TYPES
// =========================================================================

type PaymentMethod = "bank" | "momo" | "bep20";

interface Transaction {
  id: string;
  type: "RÚT" | "NẠP";
  amount: number;
  time: string;
  status: "Thành Công" | "Đang Xử Lý" | "Thất Bại";
  method: PaymentMethod;
}

interface UserProfile {
  hasPhone: boolean;
  hasBankingInfo: boolean;
  hasBEP20Info: boolean;
}

interface WalletState {
  availableBalance: number;
  pendingBalance: number;
  totalWithdrawn: number;
  transactions: Transaction[];
  userProfile: UserProfile;
}

const MOCK_WALLET_STATE: WalletState = {
  availableBalance: 1250000, // 1,250,000 ₫
  pendingBalance: 350000,
  totalWithdrawn: 4500000,
  transactions: [
    {
      id: "RUT001",
      type: "RÚT",
      amount: 500000,
      time: "10:30 04/12/2025",
      status: "Thành Công",
      method: "bank",
    },
    {
      id: "NAP001",
      type: "NẠP",
      amount: 100000,
      time: "09:00 04/12/2025",
      status: "Đang Xử Lý",
      method: "momo",
    },
    {
      id: "RUT002",
      type: "RÚT",
      amount: 750000,
      time: "15:45 03/12/2025",
      status: "Thành Công",
      method: "bep20",
    },
  ],
  userProfile: {
    hasPhone: true,
    hasBankingInfo: true,
    hasBEP20Info: false, // Giả sử BEP20 chưa có để hiển thị cảnh báo
  },
};

const MIN_WITHDRAWAL_AMOUNT = 50000;

// =========================================================================
// UI HELPERS
// =========================================================================

// Định dạng tiền tệ VND
const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);

// Status Badge Component
const StatusBadge: React.FC<{ status: Transaction["status"] }> = ({
  status,
}) => {
  let colorClass = "";
  switch (status) {
    case "Thành Công":
      colorClass = "bg-green-100 text-green-700";
      break;
    case "Đang Xử Lý":
      colorClass = "bg-yellow-100 text-yellow-700";
      break;
    case "Thất Bại":
      colorClass = "bg-red-100 text-red-700";
      break;
  }
  return (
    <span
      className={`px-3 py-1 text-xs font-semibold rounded-full flex items-center ${colorClass}`}
    >
      {status === "Đang Xử Lý" && <Clock className="w-3 h-3 mr-1" />}
      {status === "Thành Công" && <CheckCircle className="w-3 h-3 mr-1" />}
      {status}
    </span>
  );
};

// =========================================================================
// MODAL COMPONENT (Mô phỏng nạp tiền)
// =========================================================================

const DepositModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-slate-800 flex items-center">
            <PlusCircle className="w-6 h-6 mr-2 text-blue-600" /> Nạp Tiền
          </h3>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-800"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <p className="text-sm text-slate-600 mb-6">
          Vui lòng chuyển khoản đến tài khoản ngân hàng hoặc ví điện tử sau để
          nạp tiền vào tài khoản của bạn.
        </p>

        <div className="space-y-4">
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <p className="text-xs text-blue-600 font-medium mb-1">
              NGÂN HÀNG VIETCOMBANK
            </p>
            <p className="text-lg font-bold text-slate-800">00110022334455</p>
            <p className="text-sm text-slate-600">Chủ TK: CÔNG TY TNHH ABC</p>
          </div>
          <div className="p-4 bg-pink-50 border border-pink-200 rounded-xl">
            <p className="text-xs text-pink-600 font-medium mb-1">
              VÍ ĐIỆN TỬ MOMO
            </p>
            <p className="text-lg font-bold text-slate-800">0987654321</p>
            <p className="text-sm text-slate-600">Nội dung: [Tên đăng nhập]</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="mt-6 w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors flex items-center justify-center"
        >
          Đã Hiểu và Thực Hiện <CheckCircle className="w-4 h-4 ml-2" />
        </button>
      </div>
    </div>
  );
};

// =========================================================================
// MAIN COMPONENT
// =========================================================================

const WalletManagement: React.FC = () => {
  const [walletState, setWalletState] = useState(MOCK_WALLET_STATE);
  const [withdrawalAmount, setWithdrawalAmount] = useState<number>(0);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>("bank");
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);

  const {
    availableBalance,
    pendingBalance,
    totalWithdrawn,
    userProfile,
    transactions,
  } = walletState;

  // Kiểm tra các điều kiện để kích hoạt nút Rút tiền
  const canWithdraw = useMemo(() => {
    const isProfileComplete =
      userProfile.hasPhone &&
      (userProfile.hasBankingInfo || userProfile.hasBEP20Info);
    const isAmountValid =
      withdrawalAmount >= MIN_WITHDRAWAL_AMOUNT &&
      withdrawalAmount <= availableBalance &&
      withdrawalAmount > 0;

    // Kiểm tra thông tin thanh toán cho phương thức được chọn
    let hasSelectedMethodInfo = false;
    if (selectedMethod === "bank") {
      hasSelectedMethodInfo = userProfile.hasBankingInfo;
    } else if (selectedMethod === "momo") {
      hasSelectedMethodInfo = userProfile.hasPhone; // MoMo thường dùng SĐT đã đăng ký
    } else if (selectedMethod === "bep20") {
      hasSelectedMethodInfo = userProfile.hasBEP20Info;
    }

    return isProfileComplete && isAmountValid && hasSelectedMethodInfo;
  }, [withdrawalAmount, availableBalance, userProfile, selectedMethod]);

  // Danh sách các mục cần hoàn thành
  const requiredInfoList = useMemo(() => {
    const list = [];
    if (!userProfile.hasPhone)
      list.push("Chưa có số điện thoại (cần cho MoMo)");
    // Cần ít nhất 1 phương thức thanh toán
    if (!userProfile.hasBankingInfo && !userProfile.hasBEP20Info)
      list.push("Chưa có thông tin thanh toán (ngân hàng hoặc BEP20)");
    return list;
  }, [userProfile]);

  // Hàm xử lý Rút tiền (Mô phỏng)
  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canWithdraw) return;

    // Logic mô phỏng: trừ số dư, thêm giao dịch đang chờ
    const newTransaction: Transaction = {
      id: `RUT${Date.now()}`,
      type: "RÚT",
      amount: withdrawalAmount,
      time: new Date().toLocaleString("vi-VN"),
      status: "Đang Xử Lý",
      method: selectedMethod,
    };

    setWalletState((prev) => ({
      ...prev,
      availableBalance: prev.availableBalance - withdrawalAmount,
      pendingBalance: prev.pendingBalance + withdrawalAmount,
      transactions: [newTransaction, ...prev.transactions],
    }));
    setWithdrawalAmount(0);
    alert(`Yêu cầu rút ${formatCurrency(withdrawalAmount)} đang được xử lý!`);
  };

  // Hàm xử lý Nạp tiền (Mô phỏng - chỉ mở Modal)
  const handleDeposit = () => {
    setIsDepositModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-slate-800 mb-6">
          Quản Lý Tài Chính 🏦
        </h2>

        {/* Balance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Số Dư Khả Dụng */}
          <div className="bg-linear-to-br from-blue-600 to-blue-700 rounded-2xl p-6 text-white shadow-xl shadow-blue-500/30">
            <div className="text-blue-100 text-sm font-medium mb-1 flex justify-between items-center">
              Số Dư Khả Dụng
              <Banknote className="w-5 h-5" />
            </div>
            <div className="text-4xl font-extrabold mb-4">
              {formatCurrency(availableBalance)}
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center text-xs text-blue-100 bg-blue-500/30 inline-block px-2 py-1 rounded-full">
                <CheckCircle className="w-3 h-3 mr-1" /> Có thể rút ngay
              </div>
              <button
                onClick={handleDeposit}
                className="flex items-center text-sm font-semibold text-white hover:text-blue-200 transition-colors"
                title="Nạp tiền vào tài khoản"
              >
                Nạp <PlusCircle className="w-4 h-4 ml-1" />
              </button>
            </div>
          </div>

          {/* Đang Chờ Xử Lý */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
            <div className="text-slate-500 text-sm font-medium mb-1 flex justify-between items-center">
              Đang Chờ Xử Lý
              <Clock className="w-5 h-5 text-yellow-500" />
            </div>
            <div className="text-3xl font-bold text-slate-800 mb-4">
              {formatCurrency(pendingBalance)}
            </div>
            <div className="text-xs text-slate-400">
              Giao dịch đang chờ hoàn tất
            </div>
          </div>

          {/* Tổng Đã Rút */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
            <div className="text-slate-500 text-sm font-medium mb-1 flex justify-between items-center">
              Tổng Đã Rút
              <ArrowDownCircle className="w-5 h-5 text-green-500" />
            </div>
            <div className="text-3xl font-bold text-slate-800 mb-4">
              {formatCurrency(totalWithdrawn)}
            </div>
            <div className="text-xs text-slate-400">
              Tổng số tiền đã rút thành công
            </div>
          </div>
        </div>

        <hr className="my-8 border-slate-100" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Withdrawal Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-6">
              <h3 className="text-xl font-bold text-slate-800 mb-5">
                <ArrowDownRight className="inline w-5 h-5 mr-2 text-green-600" />
                Tạo Yêu Cầu Rút Tiền
              </h3>

              {/* Validation Messages */}
              {requiredInfoList.length > 0 && (
                <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                  <div className="flex items-start">
                    <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 mr-3 shrink-0" />
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-amber-800 mb-2">
                        Cần Hoàn Thành Thông Tin
                      </h4>
                      <ul className="text-xs text-amber-700 space-y-1">
                        {requiredInfoList.map((item, index) => (
                          <li key={index} className="flex items-center">
                            <X className="w-3 h-3 mr-2 text-red-500" />
                            {item}
                          </li>
                        ))}
                      </ul>
                      <div className="mt-3">
                        <a
                          href="/profile"
                          className="inline-flex items-center px-3 py-1.5 bg-amber-600 text-white text-xs font-medium rounded-lg hover:bg-amber-700 transition-colors"
                        >
                          <User className="w-3 h-3 mr-1.5" />
                          Cập Nhật Hồ Sơ
                          <ArrowRight className="w-3 h-3 ml-1.5" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <form id="withdrawalForm" onSubmit={handleWithdraw}>
                <div className="space-y-6">
                  {/* Số Tiền Muốn Rút */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Số Tiền Muốn Rút
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        name="amount"
                        required
                        className="block w-full pl-4 pr-12 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-bold text-lg shadow-sm"
                        placeholder={MIN_WITHDRAWAL_AMOUNT.toLocaleString(
                          "vi-VN"
                        )}
                        min={MIN_WITHDRAWAL_AMOUNT}
                        max={availableBalance}
                        value={withdrawalAmount || ""}
                        onChange={(e) =>
                          setWithdrawalAmount(parseInt(e.target.value) || 0)
                        }
                      />
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <span className="text-slate-500 font-bold">VND</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center mt-1">
                      <p className="text-xs text-slate-400">
                        Tối thiểu: {formatCurrency(MIN_WITHDRAWAL_AMOUNT)}
                      </p>
                      <p
                        id="max-amount-hint"
                        className="text-xs text-blue-600 font-medium cursor-pointer hover:underline"
                        onClick={() => setWithdrawalAmount(availableBalance)}
                      >
                        Tối đa: {formatCurrency(availableBalance)}
                      </p>
                    </div>
                  </div>

                  {/* Phương Thức Nhận */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Chọn Phương Thức Nhận
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {/* Ngân Hàng */}
                      <label className="cursor-pointer">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="bank"
                          className="peer sr-only"
                          checked={selectedMethod === "bank"}
                          onChange={() => setSelectedMethod("bank")}
                        />
                        <div
                          className={`p-3 border rounded-xl transition-all text-center ${
                            selectedMethod === "bank"
                              ? "border-blue-500 bg-blue-50"
                              : "border-slate-200 hover:border-slate-300 bg-white"
                          }`}
                        >
                          <Landmark
                            className={`w-6 h-6 mx-auto mb-1 ${
                              selectedMethod === "bank"
                                ? "text-blue-600"
                                : "text-slate-600"
                            }`}
                          />
                          <span className="text-sm font-medium text-slate-700">
                            Ngân Hàng
                          </span>
                          {userProfile.hasBankingInfo && (
                            <CheckCircle
                              className="w-3 h-3 text-green-500 mx-auto mt-1"
                              title="Đã có thông tin ngân hàng"
                            />
                          )}
                        </div>
                      </label>

                      {/* MoMo */}
                      <label className="cursor-pointer">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="momo"
                          className="peer sr-only"
                          checked={selectedMethod === "momo"}
                          onChange={() => setSelectedMethod("momo")}
                        />
                        <div
                          className={`p-3 border rounded-xl transition-all text-center ${
                            selectedMethod === "momo"
                              ? "border-pink-500 bg-pink-50"
                              : "border-slate-200 hover:border-slate-300 bg-white"
                          }`}
                        >
                          <Smartphone
                            className={`w-6 h-6 mx-auto mb-1 ${
                              selectedMethod === "momo"
                                ? "text-pink-600"
                                : "text-slate-600"
                            }`}
                          />
                          <span className="text-sm font-medium text-slate-700">
                            MoMo
                          </span>
                          {userProfile.hasPhone && (
                            <CheckCircle
                              className="w-3 h-3 text-green-500 mx-auto mt-1"
                              title="Đã có số điện thoại (dùng cho Momo)"
                            />
                          )}
                        </div>
                      </label>

                      {/* BEP20 */}
                      <label className="cursor-pointer">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="bep20"
                          className="peer sr-only"
                          checked={selectedMethod === "bep20"}
                          onChange={() => setSelectedMethod("bep20")}
                        />
                        <div
                          className={`p-3 border rounded-xl transition-all text-center ${
                            selectedMethod === "bep20"
                              ? "border-indigo-500 bg-indigo-50"
                              : "border-slate-200 hover:border-slate-300 bg-white"
                          }`}
                        >
                          <Wallet
                            className={`w-6 h-6 mx-auto mb-1 ${
                              selectedMethod === "bep20"
                                ? "text-indigo-600"
                                : "text-slate-600"
                            }`}
                          />
                          <span className="text-sm font-medium text-slate-700">
                            BEP20
                          </span>
                          {userProfile.hasBEP20Info && (
                            <CheckCircle
                              className="w-3 h-3 text-green-500 mx-auto mt-1"
                              title="Đã có địa chỉ ví BEP20"
                            />
                          )}
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Nút Rút Tiền */}
                  <button
                    type="submit"
                    disabled={!canWithdraw}
                    className={`w-full py-3 rounded-xl font-bold transition-all flex items-center justify-center ${
                      canWithdraw
                        ? "bg-green-600 text-white hover:bg-green-700 shadow-lg shadow-green-500/30"
                        : "bg-gray-400 text-white cursor-not-allowed opacity-80"
                    }`}
                    title={
                      canWithdraw
                        ? "Tạo yêu cầu rút tiền"
                        : "Vui lòng cập nhật đầy đủ thông tin hoặc kiểm tra số dư"
                    }
                  >
                    {canWithdraw ? (
                      <>
                        <Banknote className="w-5 h-5 inline mr-2" />
                        Rút {formatCurrency(withdrawalAmount)}
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4 inline mr-2" />
                        Chưa Hoàn Thành Điều Kiện
                      </>
                    )}
                  </button>
                  <p className="text-xs text-slate-400 text-center pt-1">
                    Phí giao dịch: 0% | Thời gian xử lý: 1-24 giờ làm việc
                  </p>
                </div>
              </form>
            </div>
          </div>

          {/* History */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-6">
              <h3 className="text-xl font-bold text-slate-800 mb-5">
                Lịch Sử Giao Dịch
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[600px]">
                  <thead>
                    <tr className="text-left border-b border-slate-100 bg-slate-50">
                      <th className="py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider rounded-tl-lg">
                        Mã GD
                      </th>
                      <th className="py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        Thời Gian
                      </th>
                      <th className="py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        Phương Thức
                      </th>
                      <th className="py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">
                        Số Tiền
                      </th>
                      <th className="py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center rounded-tr-lg">
                        Trạng Thái
                      </th>
                    </tr>
                  </thead>
                  <tbody className="text-sm divide-y divide-slate-100">
                    {transactions.length > 0 ? (
                      transactions.map((tx) => (
                        <tr
                          key={tx.id}
                          className="hover:bg-slate-50 transition-colors"
                        >
                          <td className="py-4 px-4 font-medium text-slate-700">
                            #{tx.id}
                          </td>
                          <td className="py-4 px-4 text-slate-500">
                            {tx.time}
                          </td>
                          <td className="py-4 px-4 text-slate-600">
                            <span
                              className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                                tx.method === "bank"
                                  ? "bg-blue-100 text-blue-800"
                                  : tx.method === "momo"
                                  ? "bg-pink-100 text-pink-800"
                                  : "bg-indigo-100 text-indigo-800"
                              }`}
                            >
                              {tx.method === "bank"
                                ? "BANK"
                                : tx.method === "momo"
                                ? "MOMO"
                                : "BEP20"}
                            </span>
                          </td>
                          <td
                            className={`py-4 px-4 font-bold text-right ${
                              tx.type === "RÚT"
                                ? "text-red-600"
                                : "text-green-600"
                            }`}
                          >
                            {tx.type === "RÚT" ? "-" : "+"}
                            {formatCurrency(tx.amount)}
                          </td>
                          <td className="py-4 px-4 text-center">
                            <StatusBadge status={tx.status} />
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={5}
                          className="py-12 text-center text-slate-500 italic"
                        >
                          <Banknote className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                          Chưa có giao dịch nào được ghi nhận.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Deposit Modal */}
      {isDepositModalOpen && (
        <DepositModal onClose={() => setIsDepositModalOpen(false)} />
      )}
    </div>
  );
};

export default WalletManagement;
