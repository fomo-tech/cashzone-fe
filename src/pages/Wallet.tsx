import React, { useState, useMemo, useEffect, useCallback } from "react";
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
  User,
  ArrowDownRight,
  Loader,
  X,
} from "lucide-react";
import CommonModal from "@/components/common/Modal";
import walletService from "@/services/walletService";
import profileService from "@/services/profileService";
import { useAuthStore } from "@/store/authStore";
import type {
  WalletInfo,
  ProfileCompletion,
  PaymentInfo,
} from "@/services/walletService";

// =========================================================================
// TYPES
// =========================================================================

type PaymentMethod = "bank" | "momo" | "bep20";

interface Transaction {
  id: string;
  type: "RÚT" | "NẠP" | "HOA HỒNG";
  amount: number;
  time: string;
  status: "Thành Công" | "Đang Xử Lý" | "Thất Bại";
  method: string;
}

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
      colorClass = "bg-emerald-100 text-emerald-700";
      break;
    case "Đang Xử Lý":
      colorClass = "bg-amber-100 text-amber-700";
      break;
    case "Thất Bại":
      colorClass = "bg-red-100 text-red-700";
      break;
  }
  return (
    <span
      className={`px-3 py-1.5 text-xs font-bold rounded-full inline-flex items-center gap-1.5 ${colorClass}`}
    >
      {status === "Đang Xử Lý" && <Clock className="w-3.5 h-3.5" />}
      {status === "Thành Công" && <CheckCircle className="w-3.5 h-3.5" />}
      {status === "Thất Bại" && <X className="w-3.5 h-3.5" />}
      {status}
    </span>
  );
};

// =========================================================================
// MODAL COMPONENT (Mô phỏng nạp tiền)
// =========================================================================

const DepositModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  return (
    <CommonModal
      isOpen={isOpen}
      onClose={onClose}
      title="Nạp Tiền"
      width="max-w-md"
      headerClassName="flex items-center gap-2"
    >
      <div className="space-y-4">
        <p className="text-sm text-slate-600">
          Vui lòng chuyển khoản đến tài khoản ngân hàng hoặc ví điện tử sau để
          nạp tiền vào tài khoản của bạn.
        </p>

        <div className="space-y-3">
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
          className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors flex items-center justify-center"
        >
          Đã Hiểu và Thực Hiện
          <CheckCircle className="w-4 h-4 ml-2" />
        </button>
      </div>
    </CommonModal>
  );
};

// =========================================================================
// PAYMENT INFO MODAL
// =========================================================================

const PaymentInfoModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  currentInfo: PaymentInfo | null;
}> = ({ isOpen, onClose, onSuccess, currentInfo }) => {
  const { setUser } = useAuthStore();
  const [activeTab, setActiveTab] = useState<"bank" | "momo">("bank");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Bank form
  const [bankForm, setBankForm] = useState({
    bankName: currentInfo?.bankInfo?.bankName || "",
    accountNumber: currentInfo?.bankInfo?.accountNumber || "",
    accountName: currentInfo?.bankInfo?.accountName || "",
    branch: currentInfo?.bankInfo?.branch || "",
  });

  // Momo form
  const [momoForm, setMomoForm] = useState({
    phoneNumber: currentInfo?.momoInfo?.phoneNumber || "",
    accountName: currentInfo?.momoInfo?.accountName || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      let updatedProfile;

      if (activeTab === "bank") {
        updatedProfile = await profileService.updateBankingInfo({
          bankName: bankForm.bankName,
          accountNumber: bankForm.accountNumber,
          accountName: bankForm.accountName,
        });
      } else if (activeTab === "momo") {
        updatedProfile = await profileService.updateMomoInfo({
          phoneNumber: momoForm.phoneNumber,
          accountName: momoForm.accountName,
        });
      }

      // Update authStore to keep data in sync across app
      if (updatedProfile) {
        setUser(updatedProfile);
      }

      onSuccess();
      onClose();
    } catch (error: any) {
      console.error("Failed to update payment info:", error);
      setErrorMessage(
        error.response?.data?.message ||
          "Không thể cập nhật thông tin thanh toán",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <CommonModal
      isOpen={isOpen}
      onClose={onClose}
      title="Cập Nhật Thông Tin Thanh Toán"
      width="max-w-2xl"
    >
      <div className="space-y-6">
        {/* Tab Selection */}
        <div className="flex gap-2 mb-6 border-b">
          <button
            onClick={() => setActiveTab("bank")}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === "bank"
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-slate-600 hover:text-slate-800"
            }`}
          >
            <Landmark className="w-4 h-4 inline mr-2" />
            Ngân Hàng
          </button>
          <button
            onClick={() => setActiveTab("momo")}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === "momo"
                ? "border-b-2 border-pink-500 text-pink-600"
                : "text-slate-600 hover:text-slate-800"
            }`}
          >
            <Smartphone className="w-4 h-4 inline mr-2" />
            MoMo
          </button>
        </div>

        {errorMessage && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Bank Form */}
          {activeTab === "bank" && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Tên Ngân Hàng
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="VD: Vietcombank, Techcombank..."
                  value={bankForm.bankName}
                  onChange={(e) =>
                    setBankForm({ ...bankForm, bankName: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Số Tài Khoản
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Nhập số tài khoản"
                  value={bankForm.accountNumber}
                  onChange={(e) =>
                    setBankForm({ ...bankForm, accountNumber: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Tên Chủ Tài Khoản
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="NGUYEN VAN A"
                  value={bankForm.accountName}
                  onChange={(e) =>
                    setBankForm({ ...bankForm, accountName: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Chi Nhánh (Tùy chọn)
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="VD: Hà Nội, TP. HCM..."
                  value={bankForm.branch}
                  onChange={(e) =>
                    setBankForm({ ...bankForm, branch: e.target.value })
                  }
                />
              </div>
            </div>
          )}

          {/* Momo Form */}
          {activeTab === "momo" && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Số Điện Thoại MoMo
                </label>
                <input
                  type="tel"
                  required
                  className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                  placeholder="0987654321"
                  value={momoForm.phoneNumber}
                  onChange={(e) =>
                    setMomoForm({ ...momoForm, phoneNumber: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Tên Chủ Tài Khoản
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                  placeholder="NGUYEN VAN A"
                  value={momoForm.accountName}
                  onChange={(e) =>
                    setMomoForm({ ...momoForm, accountName: e.target.value })
                  }
                />
              </div>
            </div>
          )}

          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 border border-slate-300 rounded-xl font-medium text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-3 bg-orange-600 text-white rounded-xl font-bold hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isSubmitting ? (
                <>
                  <Loader className="w-5 h-5 mr-2 animate-spin" />
                  Đang lưu...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5 mr-2" />
                  Lưu Thông Tin
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </CommonModal>
  );
};

// =========================================================================
// MAIN COMPONENT
// =========================================================================

const WalletManagement: React.FC = () => {
  // State for wallet data
  const [walletInfo, setWalletInfo] = useState<WalletInfo>({
    availableBalance: 0,
    pendingBalance: 0,
    totalWithdrawn: 0,
  });
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [userProfile, setUserProfile] = useState<ProfileCompletion>({
    hasPhone: false,
    hasBankingInfo: false,
    hasMomoInfo: false,
    hasBEP20Info: false,
  });

  const [withdrawalAmount, setWithdrawalAmount] = useState<number>(0);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>("bank");
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [isPaymentInfoModalOpen, setIsPaymentInfoModalOpen] = useState(false);
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load wallet data on mount
  const loadWalletData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [walletData, transactionsData, profileData, paymentData] =
        await Promise.all([
          walletService.getWalletInfo(),
          walletService.getTransactions({ page: 1, limit: 20 }),
          walletService.getProfileCompletion(),
          walletService.getPaymentInfo().catch(() => null),
        ]);

      setWalletInfo(walletData);
      setUserProfile(profileData);
      setPaymentInfo(paymentData);

      // Transform API transactions to UI format
      const formattedTransactions: Transaction[] =
        transactionsData.transactions.map((tx) => ({
          id: tx._id,
          type: mapTransactionType(tx.type),
          amount: tx.amount,
          time: new Date(tx.createdAt).toLocaleString("vi-VN"),
          status: mapTransactionStatus(tx.status),
          method: tx.paymentInfo?.method?.toUpperCase() || "BANK",
        }));

      setTransactions(formattedTransactions);
    } catch (error: any) {
      console.error("Failed to load wallet data:", error);
      showToast("Không thể tải dữ liệu ví. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadWalletData();
  }, [loadWalletData]);

  // Helper functions to map API values to UI values
  const mapTransactionType = (type: string): "RÚT" | "NẠP" | "HOA HỒNG" => {
    switch (type) {
      case "WITHDRAW":
        return "RÚT";
      case "DEPOSIT":
        return "NẠP";
      case "COMMISSION":
      case "REFERRAL":
        return "HOA HỒNG";
      default:
        return "NẠP";
    }
  };

  const mapTransactionStatus = (
    status: string,
  ): "Thành Công" | "Đang Xử Lý" | "Thất Bại" => {
    switch (status) {
      case "COMPLETED":
        return "Thành Công";
      case "PENDING":
        return "Đang Xử Lý";
      case "REJECTED":
      case "FAILED":
        return "Thất Bại";
      default:
        return "Đang Xử Lý";
    }
  };

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const { availableBalance, pendingBalance, totalWithdrawn } = walletInfo;

  // Danh sách phương thức thanh toán có sẵn (đã được user cập nhật)
  const availablePaymentMethods = useMemo(() => {
    const methods: PaymentMethod[] = [];
    if (userProfile.hasBankingInfo) methods.push("bank");
    if (userProfile.hasMomoInfo) methods.push("momo");
    if (userProfile.hasBEP20Info) methods.push("bep20");
    return methods;
  }, [userProfile]);

  // Tự động chọn phương thức đầu tiên có sẵn
  useEffect(() => {
    if (
      availablePaymentMethods.length > 0 &&
      !availablePaymentMethods.includes(selectedMethod)
    ) {
      setSelectedMethod(availablePaymentMethods[0]);
    }
  }, [availablePaymentMethods, selectedMethod]);

  // Kiểm tra các điều kiện để kích hoạt nút Rút tiền
  const canWithdraw = useMemo(() => {
    // Log để debug
    console.log("canWithdraw check:", {
      withdrawalAmount,
      MIN_WITHDRAWAL_AMOUNT,
      availableBalance,
      userProfile,
      selectedMethod,
    });

    // Validate amount
    const isAmountValid =
      withdrawalAmount >= MIN_WITHDRAWAL_AMOUNT &&
      withdrawalAmount <= availableBalance &&
      withdrawalAmount > 0;

    if (!isAmountValid) {
      console.log("Amount validation failed");
      return false;
    }

    // Kiểm tra thông tin thanh toán cho phương thức được chọn
    let hasSelectedMethodInfo = false;
    if (selectedMethod === "bank") {
      hasSelectedMethodInfo = userProfile.hasBankingInfo;
    } else if (selectedMethod === "momo") {
      hasSelectedMethodInfo = userProfile.hasMomoInfo;
    } else if (selectedMethod === "bep20") {
      hasSelectedMethodInfo = userProfile.hasBEP20Info;
    }

    console.log("Method validation:", {
      selectedMethod,
      hasSelectedMethodInfo,
      hasBankingInfo: userProfile.hasBankingInfo,
      hasMomoInfo: userProfile.hasMomoInfo,
      hasPhone: userProfile.hasPhone,
      hasBEP20Info: userProfile.hasBEP20Info,
    });

    // Đơn giản hóa: chỉ cần amount valid, không bắt buộc profile info
    // User có thể update info sau khi admin liên hệ
    return isAmountValid;
  }, [withdrawalAmount, availableBalance, userProfile, selectedMethod]);

  // Danh sách các mục cần hoàn thành
  const requiredInfoList = useMemo(() => {
    const list = [];
    // Cần ít nhất 1 phương thức thanh toán
    if (availablePaymentMethods.length === 0) {
      list.push("Chưa có thông tin thanh toán (ngân hàng, Momo hoặc BEP20)");
    }
    return list;
  }, [availablePaymentMethods]);

  // Hàm xử lý Rút tiền (API Call)
  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log("Withdraw attempt:", {
      canWithdraw,
      isSubmitting,
      withdrawalAmount,
      selectedMethod,
      availableBalance,
      userProfile,
    });

    if (!canWithdraw || isSubmitting) {
      showToast(
        "Không đủ điều kiện để rút tiền. Vui lòng kiểm tra lại thông tin.",
      );
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await walletService.createWithdrawal({
        amount: withdrawalAmount,
        paymentMethod: selectedMethod,
      });

      console.log("Withdrawal response:", response);

      showToast(
        `Yêu cầu rút ${formatCurrency(withdrawalAmount)} đang được xử lý!`,
      );
      setWithdrawalAmount(0);

      // Reload wallet data
      await loadWalletData();
    } catch (error: any) {
      console.error("Withdrawal error:", error);
      const errorMessage =
        error.response?.data?.message || "Không thể tạo yêu cầu rút tiền";
      showToast(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Hàm xử lý Nạp tiền (Mô phỏng - chỉ mở Modal) - Reserved for future use
  const _handleDeposit = () => {
    setIsDepositModalOpen(true);
  };

  return (
    <div className="min-h-screen py-6 sm:py-8 lg:py-10">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 bg-green-600 text-white px-6 py-3 rounded-xl shadow-lg animate-fade-in flex items-center gap-2">
          <CheckCircle className="w-5 h-5" />
          {toastMessage}
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader className="w-8 h-8 text-[orange-600] animate-spin" />
        </div>
      ) : (
        <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-800 mb-4 sm:mb-6 lg:mb-8 flex items-center gap-2 sm:gap-3">
            <Wallet className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-[orange-600]" />
            Quản Lý Tài Chính
          </h2>

          {/* Balance Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 lg:gap-6 mb-6 sm:mb-7 lg:mb-8">
            {/* Số Dư Khả Dụng */}
            <div className="bg-gradient-to-br from-orange-500 via-orange-600 to-amber-600 rounded-xl sm:rounded-2xl p-4 sm:p-5 lg:p-6 text-white shadow-xl">
              <div className="flex justify-between items-center mb-2">
                <span className="text-white/80 text-sm font-medium">
                  Số Dư Khả Dụng
                </span>
                <Banknote className="w-6 h-6 text-white/60" />
              </div>
              <div className="text-2xl sm:text-3xl lg:text-4xl  mb-3 sm:mb-4">
                {formatCurrency(availableBalance)}
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-white/20">
                <div className="flex items-center text-xs text-white/80">
                  <CheckCircle className="w-4 h-4 mr-1.5" />
                  Có thể rút ngay
                </div>
                {/* <button
                  onClick={handleDeposit}
                  className="flex items-center text-sm font-semibold text-white hover:text-white/80 transition-colors"
                  title="Nạp tiền vào tài khoản"
                >
                  <PlusCircle className="w-5 h-5 mr-1" />
                  Nạp Tiền
                </button> */}
              </div>
            </div>

            {/* Đang Chờ Xử Lý */}
            <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 lg:p-6 border border-slate-200 shadow-sm">
              <div className="flex justify-between items-center mb-2">
                <span className="text-slate-600 text-sm font-medium">
                  Đang Chờ Xử Lý
                </span>
                <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-500" />
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-slate-800 mb-2">
                {formatCurrency(pendingBalance)}
              </div>
              <div className="text-xs text-slate-400 pt-2 border-t border-slate-100">
                Giao dịch đang chờ hoàn tất
              </div>
            </div>

            {/* Tổng Đã Rút */}
            <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 lg:p-6 border border-slate-200 shadow-sm">
              <div className="flex justify-between items-center mb-2">
                <span className="text-slate-600 text-sm font-medium">
                  Tổng Đã Rút
                </span>
                <ArrowDownCircle className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-500" />
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-slate-800 mb-2">
                {formatCurrency(totalWithdrawn)}
              </div>
              <div className="text-xs text-slate-400 pt-2 border-t border-slate-100">
                Tổng số tiền đã rút thành công
              </div>
            </div>
          </div>

          <hr className="my-8 border-slate-100" />

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 sm:gap-8">
            {/* Withdrawal Form */}
            <div className="xl:col-span-1">
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-slate-200 p-4 sm:p-5 lg:p-6">
                <h3 className="text-lg sm:text-xl font-bold text-slate-800 mb-4 sm:mb-6 flex items-center">
                  <ArrowDownRight className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-orange-600" />
                  Tạo Yêu Cầu Rút Tiền
                </h3>

                {/* Validation Messages */}
                {requiredInfoList.length > 0 && (
                  <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
                      <div className="flex-1">
                        <h4 className="text-sm font-semibold text-amber-800 mb-2">
                          Cần Hoàn Thành Thông Tin
                        </h4>
                        <ul className="text-xs text-amber-700 space-y-1 mb-3">
                          {requiredInfoList.map((item, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <span className="text-amber-500 mt-0.5">•</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                        <button
                          onClick={() => setIsPaymentInfoModalOpen(true)}
                          className="inline-flex items-center px-4 py-2 bg-amber-600 text-white text-sm font-medium rounded-lg hover:bg-amber-700 transition-colors"
                        >
                          <User className="w-4 h-4 mr-2" />
                          Cập Nhật Thông Tin
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                <form id="withdrawalForm" onSubmit={handleWithdraw}>
                  <div className="space-y-6">
                    {/* Số Tiền Muốn Rút */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Số Tiền Muốn Rút
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          name="amount"
                          required
                          className="block w-full pl-4 pr-16 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[orange-600] focus:border-[orange-600] font-semibold text-lg"
                          placeholder={MIN_WITHDRAWAL_AMOUNT.toLocaleString(
                            "vi-VN",
                          )}
                          min={MIN_WITHDRAWAL_AMOUNT}
                          max={availableBalance}
                          value={withdrawalAmount || ""}
                          onChange={(e) =>
                            setWithdrawalAmount(parseInt(e.target.value) || 0)
                          }
                        />
                        <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                          <span className="text-slate-500 font-semibold text-sm">
                            VND
                          </span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center mt-2 text-xs">
                        <span className="text-slate-500">
                          Tối thiểu: {formatCurrency(MIN_WITHDRAWAL_AMOUNT)}
                        </span>
                        <button
                          type="button"
                          className="text-[orange-600] font-medium hover:underline"
                          onClick={() => setWithdrawalAmount(availableBalance)}
                        >
                          Tối đa: {formatCurrency(availableBalance)}
                        </button>
                      </div>
                    </div>

                    {/* Phương Thức Nhận */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-3">
                        Chọn Phương Thức Nhận
                      </label>
                      {availablePaymentMethods.length === 0 ? (
                        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-center">
                          <AlertTriangle className="w-8 h-8 text-amber-600 mx-auto mb-2" />
                          <p className="text-sm text-amber-700 font-medium mb-2">
                            Chưa có phương thức thanh toán
                          </p>
                          <p className="text-xs text-amber-600">
                            Vui lòng cập nhật thông tin thanh toán để rút tiền
                          </p>
                        </div>
                      ) : (
                        <div
                          className={`grid gap-3 ${
                            availablePaymentMethods.length === 1
                              ? "grid-cols-1"
                              : availablePaymentMethods.length === 2
                                ? "grid-cols-2"
                                : "grid-cols-2"
                          }`}
                        >
                          {/* Ngân Hàng */}
                          {userProfile.hasBankingInfo && (
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
                                className={`h-full min-h-[110px] flex flex-col items-center justify-center p-4 border-2 rounded-xl transition-all ${
                                  selectedMethod === "bank"
                                    ? "border-blue-500 bg-blue-50"
                                    : "border-slate-200 hover:border-slate-300 bg-white"
                                }`}
                                title={
                                  userProfile.hasBankingInfo
                                    ? "Thông tin ngân hàng đã cập nhật"
                                    : "Chưa cập nhật thông tin ngân hàng"
                                }
                              >
                                <Landmark
                                  className={`w-8 h-8 mb-2 ${
                                    selectedMethod === "bank"
                                      ? "text-blue-600"
                                      : "text-slate-500"
                                  }`}
                                />
                                <span
                                  className={`text-sm font-semibold ${
                                    selectedMethod === "bank"
                                      ? "text-blue-700"
                                      : "text-slate-700"
                                  }`}
                                >
                                  Ngân Hàng
                                </span>
                                {userProfile.hasBankingInfo && (
                                  <CheckCircle className="w-4 h-4 text-emerald-500 mt-2" />
                                )}
                              </div>
                            </label>
                          )}

                          {/* MoMo */}
                          {userProfile.hasMomoInfo && (
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
                                className={`h-full min-h-[110px] flex flex-col items-center justify-center p-4 border-2 rounded-xl transition-all ${
                                  selectedMethod === "momo"
                                    ? "border-pink-500 bg-pink-50"
                                    : "border-slate-200 hover:border-slate-300 bg-white"
                                }`}
                                title={
                                  userProfile.hasMomoInfo
                                    ? "Thông tin Momo đã cập nhật"
                                    : "Chưa cập nhật thông tin Momo"
                                }
                              >
                                <Smartphone
                                  className={`w-8 h-8 mb-2 ${
                                    selectedMethod === "momo"
                                      ? "text-pink-600"
                                      : "text-slate-500"
                                  }`}
                                />
                                <span
                                  className={`text-sm font-semibold ${
                                    selectedMethod === "momo"
                                      ? "text-pink-700"
                                      : "text-slate-700"
                                  }`}
                                >
                                  MoMo
                                </span>
                                {userProfile.hasMomoInfo && (
                                  <CheckCircle className="w-4 h-4 text-emerald-500 mt-2" />
                                )}
                              </div>
                            </label>
                          )}

                          {/* BEP20 */}
                          {/* {userProfile.hasBEP20Info && (
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
                                className={`h-full min-h-[110px] flex flex-col items-center justify-center p-4 border-2 rounded-xl transition-all ${
                                  selectedMethod === "bep20"
                                    ? "border-indigo-500 bg-indigo-50"
                                    : "border-slate-200 hover:border-slate-300 bg-white"
                                }`}
                              >
                                <Wallet
                                  className={`w-8 h-8 mb-2 ${
                                    selectedMethod === "bep20"
                                      ? "text-indigo-600"
                                      : "text-slate-500"
                                  }`}
                                />
                                <span
                                  className={`text-sm font-semibold ${
                                    selectedMethod === "bep20"
                                      ? "text-indigo-700"
                                      : "text-slate-700"
                                  }`}
                                >
                                  BEP20
                                </span>
                                {userProfile.hasBEP20Info && (
                                  <CheckCircle className="w-4 h-4 text-emerald-500 mt-2" />
                                )}
                              </div>
                            </label>
                          )} */}
                        </div>
                      )}
                    </div>

                    {/* Nút Rút Tiền */}
                    <button
                      type="submit"
                      disabled={!canWithdraw || isSubmitting}
                      className={`w-full py-3.5 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
                        canWithdraw && !isSubmitting
                          ? "bg-gradient-to-br from-orange-500 via-orange-600 to-amber-600 text-white hover:shadow-lg hover:shadow-pink-500/30"
                          : "bg-slate-300 text-slate-500 cursor-not-allowed"
                      }`}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader className="w-5 h-5 animate-spin" />
                          <span>Đang xử lý...</span>
                        </>
                      ) : canWithdraw ? (
                        <>
                          <Banknote className="w-5 h-5" />
                          <span>Rút {formatCurrency(withdrawalAmount)}</span>
                        </>
                      ) : (
                        <>
                          <Lock className="w-5 h-5" />
                          <span>Chưa Đủ Điều Kiện</span>
                        </>
                      )}
                    </button>
                    <p className="text-xs text-slate-500 text-center mt-3 flex items-center justify-center gap-2">
                      <CheckCircle className="w-3.5 h-3.5" />
                      Miễn phí giao dịch | Xử lý trong 1-24 giờ
                    </p>
                  </div>
                </form>
              </div>
            </div>

            {/* History */}
            <div className="xl:col-span-2">
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-slate-200 p-4 sm:p-5 lg:p-6">
                <h3 className="text-lg sm:text-xl font-bold text-slate-800 mb-4 sm:mb-6 flex items-center gap-2">
                  <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600" />
                  Lịch Sử Giao Dịch
                </h3>
                <div className="overflow-x-auto -mx-4 sm:mx-0">
                  <table className="w-full min-w-[600px]">
                    <thead>
                      <tr className="border-b-2 border-slate-200">
                        <th className="py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider text-left">
                          Mã GD
                        </th>
                        <th className="py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider text-left">
                          Thời Gian
                        </th>
                        <th className="py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider text-left">
                          Phương Thức
                        </th>
                        <th className="py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider text-right">
                          Số Tiền
                        </th>
                        <th className="py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider text-center">
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
                            <td className="py-4 px-4 font-medium text-slate-700 text-xs sm:text-sm">
                              <span className="truncate block max-w-[100px] sm:max-w-none">
                                #{tx.id.slice(0, 8)}...
                              </span>
                            </td>
                            <td className="py-4 px-4 text-slate-500">
                              {tx.time}
                            </td>
                            <td className="py-4 px-4 text-slate-600">
                              <span
                                className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                                  tx.method.toUpperCase() === "BANK"
                                    ? "bg-blue-100 text-blue-800"
                                    : tx.method.toUpperCase() === "MOMO"
                                      ? "bg-pink-100 text-pink-800"
                                      : "bg-indigo-100 text-indigo-800"
                                }`}
                              >
                                {tx.method.toUpperCase()}
                              </span>
                            </td>
                            <td
                              className={`py-4 px-4 font-bold text-right ${
                                tx.type === "RÚT"
                                  ? "text-red-600"
                                  : "text-[orange-600]"
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
                            className="py-16 text-center text-slate-500"
                          >
                            <div className="flex flex-col items-center justify-center gap-3">
                              <Banknote className="w-12 h-12 text-slate-300" />
                              <div>
                                <p className="font-semibold text-slate-700 mb-1">
                                  Chưa có giao dịch nào
                                </p>
                                <p className="text-sm text-slate-500">
                                  Giao dịch của bạn sẽ hiển thị ở đây
                                </p>
                              </div>
                            </div>
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
      )}
      {/* Deposit Modal */}
      <DepositModal
        isOpen={isDepositModalOpen}
        onClose={() => setIsDepositModalOpen(false)}
      />

      {/* Payment Info Modal */}
      <PaymentInfoModal
        isOpen={isPaymentInfoModalOpen}
        onClose={() => setIsPaymentInfoModalOpen(false)}
        onSuccess={() => {
          showToast("Cập nhật thông tin thanh toán thành công!");
          loadWalletData();
        }}
        currentInfo={paymentInfo}
      />
    </div>
  );
};

export default WalletManagement;
