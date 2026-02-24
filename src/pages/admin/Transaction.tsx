import React, { useState, useMemo, useEffect } from "react";
import {
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  XCircle,
  Search,
  DollarSign,
  ArrowRight,
  User,
  Banknote,
  Loader,
  Plus,
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import http from "@/services/api";

interface Transaction {
  _id: string;
  type: string;
  amount: number;
  status: string;
  userId: {
    _id: string;
    name?: string;
    email: string;
    phone?: string;
  };
  description?: string;
  paymentInfo?: {
    method?: string;
    transactionId?: string;
    bankName?: string;
    accountNumber?: string;
    accountName?: string;
    momoPhone?: string;
    bep20Address?: string;
  };
  createdAt: string;
  updatedAt: string;
}

// Hàm định dạng tiền tệ Việt Nam
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

// Hàm chuyển đổi tên ngân hàng sang mã ngân hàng VietQR
const getBankCode = (bankName: string): string => {
  const bankMap: { [key: string]: string } = {
    Vietcombank: "VCB",
    Techcombank: "TCB",
    BIDV: "BIDV",
    VietinBank: "CTG",
    Agribank: "AGR",
    ACB: "ACB",
    "MB Bank": "MB",
    MBBank: "MB",
    Sacombank: "STB",
    VPBank: "VPB",
    TPBank: "TPB",
    HDBank: "HDB",
    OCB: "OCB",
    MSB: "MSB",
    VIB: "VIB",
    SHB: "SHB",
    Eximbank: "EIB",
    SeABank: "SEAB",
    LienVietPostBank: "LPB",
    PVcomBank: "PVCB",
    VietCapitalBank: "VCCB",
    SCB: "SCB",
    BacABank: "BAB",
    ABBank: "ABB",
    NamABank: "NAB",
    PGBank: "PGB",
    VietBank: "VTB",
    BaoVietBank: "BVB",
    GPBank: "GPB",
    DongABank: "DOB",
    NCB: "NCB",
    OceanBank: "OCB",
    KienLongBank: "KLB",
    CBBank: "CBB",
  };

  // Tìm kiếm tương đối không phân biệt hoa thường
  const normalizedBankName = bankName.toUpperCase().replace(/\s+/g, "");

  for (const [key, code] of Object.entries(bankMap)) {
    if (normalizedBankName.includes(key.toUpperCase().replace(/\s+/g, ""))) {
      return code;
    }
  }

  // Nếu không tìm thấy, trả về bankName ban đầu
  return bankName.replace(/\s+/g, "").toUpperCase().slice(0, 10);
};

// Component con: Bảng giao dịch
const TransactionTable: React.FC<{
  transactions: Transaction[];
  onSelectTransaction: (txn: Transaction) => void;
  activeTab: string;
}> = ({ transactions, onSelectTransaction, activeTab }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "COMPLETED":
        return "bg-gradient-to-r from-[orange-600]/10 to-[#FF8C1A]/10 text-[orange-600] border border-[orange-600]/30";
      case "FAILED":
      case "REJECTED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "PENDING":
        return "Chờ duyệt";
      case "COMPLETED":
        return "Đã duyệt";
      case "FAILED":
      case "REJECTED":
        return "Đã hủy";
      default:
        return status;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "DEPOSIT":
        return "Nạp";
      case "WITHDRAW":
        return "Rút";
      case "COMMISSION":
        return "Hoa hồng";
      case "REFERRAL":
        return "Giới thiệu";
      case "REFUND":
        return "Hoàn tiền";
      default:
        return type;
    }
  };

  return (
    <div className="overflow-x-auto shadow-lg rounded-xl">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Mã GD
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Loại
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Số tiền
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Người dùng
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Trạng thái
            </th>
            <th className="px-6 py-3"></th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {transactions.length === 0 ? (
            <tr>
              <td
                colSpan={6}
                className="px-6 py-4 text-center text-sm text-gray-500"
              >
                Không tìm thấy giao dịch nào ở trạng thái "{activeTab}".
              </td>
            </tr>
          ) : (
            transactions.map((txn) => (
              <tr
                key={txn._id}
                className="hover:bg-gradient-to-r from-pink-50 to-orange-50 cursor-pointer transition duration-150"
                onClick={() => onSelectTransaction(txn)}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {txn._id.slice(-8)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 flex items-center">
                  {txn.type === "DEPOSIT" ? (
                    <TrendingUp className="w-4 h-4 text-[orange-600] mr-2" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-500 mr-2" />
                  )}
                  {getTypeLabel(txn.type)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-700">
                  {formatCurrency(txn.amount)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {txn.userId?.name || txn.userId?.email || "N/A"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                      txn.status,
                    )}`}
                  >
                    {getStatusLabel(txn.status)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <ArrowRight className="w-4 h-4 text-[orange-600]" />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

// Component con: Chi tiết giao dịch và Xét duyệt
const TransactionDetails: React.FC<{
  transaction: Transaction | null;
  onApprove: (id: string, note: string) => void;
  onReject: (id: string, note: string) => void;
}> = ({ transaction, onApprove, onReject }) => {
  const [adminNote, setAdminNote] = useState("");

  if (!transaction) {
    return (
      <div className="p-8 h-full flex items-center justify-center bg-white rounded-xl shadow-lg border border-gray-100">
        <div className="text-center text-gray-500">
          <Banknote className="w-12 h-12 mx-auto mb-3 text-[#EC407A]" />
          <p className="text-lg font-semibold">
            Chọn một giao dịch để xem chi tiết
          </p>
          <p className="text-sm">Và thực hiện xét duyệt (Duyệt/Từ chối).</p>
        </div>
      </div>
    );
  }

  const isPending = transaction.status === "PENDING";
  const headerIcon = transaction.type === "DEPOSIT" ? TrendingUp : TrendingDown;
  const headerColor =
    transaction.type === "DEPOSIT"
      ? "text-[orange-600] bg-gradient-to-r from-[orange-600]/10 to-[#FF8C1A]/10 border border-[orange-600]/30"
      : "text-red-600 bg-red-50";

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "DEPOSIT":
        return "Nạp";
      case "WITHDRAW":
        return "Rút";
      case "COMMISSION":
        return "Hoa hồng";
      case "REFERRAL":
        return "Giới thiệu";
      case "REFUND":
        return "Hoàn tiền";
      default:
        return type;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "PENDING":
        return "Chờ Duyệt";
      case "COMPLETED":
        return "Đã Duyệt";
      case "FAILED":
      case "REJECTED":
        return "Đã Hủy";
      default:
        return status;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className={`p-5 flex items-center justify-between ${headerColor}`}>
        <div className="flex items-center">
          {React.createElement(headerIcon, {
            className: `w-6 h-6 mr-3 ${headerColor.split(" ")[0]}`,
          })}
          <h2 className="text-xl font-bold text-gray-800">
            {getTypeLabel(transaction.type)} -{" "}
            {formatCurrency(transaction.amount)}
          </h2>
        </div>
        <span
          className={`px-3 py-1 text-sm font-bold rounded-full ${
            transaction.status === "PENDING"
              ? "bg-yellow-500 text-white"
              : transaction.status === "COMPLETED"
                ? "bg-[orange-600] text-white"
                : "bg-red-500 text-white"
          }`}
        >
          {getStatusLabel(transaction.status)}
        </span>
      </div>

      {/* Chi tiết */}
      <div className="p-5 space-y-4">
        <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">
          Thông tin Cơ bản
        </h3>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <DetailItem
            icon={DollarSign}
            label="Mã Giao Dịch"
            value={transaction._id.slice(-12)}
          />
          <DetailItem
            icon={Clock}
            label="Ngày Tạo"
            value={new Date(transaction.createdAt).toLocaleString("vi-VN")}
          />
          <DetailItem
            icon={User}
            label="Người Giao Dịch"
            value={`${
              transaction.userId?.name || transaction.userId?.email
            } (${transaction.userId?._id.slice(-8)})`}
          />
        </div>

        <h3 className="text-lg font-semibold text-gray-700 border-b pb-2 pt-4">
          Thông tin Thanh toán
        </h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          {transaction.paymentInfo?.method && (
            <DetailItem
              icon={Banknote}
              label="Phương Thức"
              value={
                transaction.paymentInfo.method === "bank" ||
                transaction.paymentInfo.method === "BANK"
                  ? "Ngân Hàng"
                  : transaction.paymentInfo.method === "momo" ||
                      transaction.paymentInfo.method === "MOMO"
                    ? "MoMo"
                    : transaction.paymentInfo.method === "bep20" ||
                        transaction.paymentInfo.method === "BEP20"
                      ? "BEP20"
                      : transaction.paymentInfo.method
              }
            />
          )}
          {transaction.paymentInfo?.bankName && (
            <DetailItem
              icon={Banknote}
              label="Ngân Hàng"
              value={transaction.paymentInfo.bankName}
            />
          )}
          {transaction.paymentInfo?.accountNumber && (
            <DetailItem
              icon={Banknote}
              label="Số Tài Khoản"
              value={transaction.paymentInfo.accountNumber}
            />
          )}
          {transaction.paymentInfo?.accountName && (
            <DetailItem
              icon={User}
              label="Chủ Tài Khoản"
              value={transaction.paymentInfo.accountName}
            />
          )}
          {transaction.paymentInfo?.momoPhone && (
            <DetailItem
              icon={Banknote}
              label="SĐT MoMo"
              value={transaction.paymentInfo.momoPhone}
            />
          )}
          {transaction.paymentInfo?.bep20Address && (
            <DetailItem
              icon={Banknote}
              label="Địa Chỉ BEP20"
              value={transaction.paymentInfo.bep20Address}
            />
          )}
        </div>

        {/* QR Code Section - Only for WITHDRAW transactions */}
        {(transaction.type === "WITHDRAW" ||
          transaction.type === "withdraw") && (
          <div className="pt-4 border-t">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              Mã QR Thanh Toán
            </h3>
            <div className="bg-gray-50 p-6 rounded-lg border-2 border-dashed border-gray-300">
              {/* VietQR for Bank Transfer */}
              {transaction.paymentInfo?.method?.toLowerCase() === "bank" &&
                transaction.paymentInfo?.bankName &&
                transaction.paymentInfo?.accountNumber && (
                  <div className="flex flex-col items-center space-y-4">
                    <div className="bg-white p-4 rounded-lg shadow-md">
                      <img
                        src={`https://img.vietqr.io/image/${getBankCode(
                          transaction.paymentInfo.bankName,
                        )}-${
                          transaction.paymentInfo.accountNumber
                        }-compact.jpg?amount=${
                          transaction.amount
                        }&addInfo=Rut tien ${transaction._id.slice(-8)}`}
                        alt="VietQR"
                        className="w-64 h-64 object-contain"
                        onError={(e) => {
                          // Fallback to QR code if VietQR fails
                          const target = e.target as HTMLImageElement;
                          target.style.display = "none";
                          const fallback =
                            target.nextElementSibling as HTMLElement;
                          if (fallback) fallback.style.display = "block";
                        }}
                      />
                      <div
                        style={{ display: "none" }}
                        className="flex items-center justify-center"
                      >
                        <QRCodeSVG
                          value={`Bank: ${
                            transaction.paymentInfo.bankName
                          }\nSTK: ${
                            transaction.paymentInfo.accountNumber
                          }\nTen: ${
                            transaction.paymentInfo.accountName
                          }\nSo tien: ${formatCurrency(transaction.amount)}`}
                          size={256}
                          level="H"
                        />
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-semibold text-gray-700">
                        Quét mã VietQR để chuyển khoản
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Ngân hàng: {transaction.paymentInfo.bankName}
                      </p>
                      <p className="text-xs text-gray-500">
                        STK: {transaction.paymentInfo.accountNumber}
                      </p>
                      <p className="text-xs text-gray-500">
                        Chủ TK: {transaction.paymentInfo.accountName}
                      </p>
                      <p className="text-xs font-bold text-[orange-600] mt-2">
                        Số tiền: {formatCurrency(transaction.amount)}
                      </p>
                    </div>
                  </div>
                )}

              {/* MoMo QR Code */}
              {transaction.paymentInfo?.method?.toLowerCase() === "momo" &&
                transaction.paymentInfo?.momoPhone && (
                  <div className="flex flex-col items-center space-y-4">
                    <div className="bg-white p-4 rounded-lg shadow-md">
                      <QRCodeSVG
                        value={transaction.paymentInfo.momoPhone}
                        size={256}
                        level="H"
                        includeMargin={true}
                      />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-semibold text-gray-700">
                        Quét mã QR để chuyển MoMo
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        SĐT: {transaction.paymentInfo.momoPhone}
                      </p>
                      <p className="text-xs font-bold text-pink-600 mt-2">
                        Số tiền: {formatCurrency(transaction.amount)}
                      </p>
                    </div>
                  </div>
                )}

              {/* BEP20 Wallet Address QR */}
              {transaction.paymentInfo?.method?.toLowerCase() === "bep20" &&
                transaction.paymentInfo?.bep20Address && (
                  <div className="flex flex-col items-center space-y-4">
                    <div className="bg-white p-4 rounded-lg shadow-md">
                      <QRCodeSVG
                        value={transaction.paymentInfo.bep20Address}
                        size={256}
                        level="H"
                        includeMargin={true}
                      />
                    </div>
                    <div className="text-center max-w-sm">
                      <p className="text-sm font-semibold text-gray-700">
                        Quét mã QR hoặc sao chép địa chỉ ví
                      </p>
                      <p className="text-xs text-gray-500 mt-1 break-all font-mono bg-gray-100 p-2 rounded">
                        {transaction.paymentInfo.bep20Address}
                      </p>
                      <p className="text-xs font-bold text-indigo-600 mt-2">
                        Số tiền: {formatCurrency(transaction.amount)}
                      </p>
                      <p className="text-xs text-orange-600 mt-1">
                        ⚠️ Chỉ gửi USDT trên mạng BEP20 (BSC)
                      </p>
                    </div>
                  </div>
                )}
            </div>
          </div>
        )}

        {transaction.description && (
          <div className="text-sm pt-4">
            <span className="font-semibold text-gray-700 block mb-1">
              Mô tả:
            </span>
            <p className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-600 italic">
              {transaction.description}
            </p>
          </div>
        )}

        {/* Khu vực xét duyệt */}
        {isPending && (
          <div className="space-y-4 pt-6 border-t border-gray-100">
            <h3 className="text-lg font-bold text-[orange-600]">
              Quyết Định Xét Duyệt
            </h3>

            <label
              htmlFor="adminNote"
              className="text-sm font-medium text-gray-700 block"
            >
              Ghi chú của Admin (Tùy chọn)
            </label>
            <textarea
              id="adminNote"
              rows={3}
              value={adminNote}
              onChange={(e) => setAdminNote(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-[orange-600] focus:border-[orange-600] text-sm"
              placeholder="Nhập lý do duyệt hoặc từ chối giao dịch..."
            />

            <div className="flex justify-end space-x-4">
              <button
                onClick={() => onReject(transaction._id, adminNote)}
                className="flex items-center px-4 py-2 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 transition duration-150"
              >
                <XCircle className="w-5 h-5 mr-2" /> Từ Chối
              </button>
              <button
                onClick={() => onApprove(transaction._id, adminNote)}
                className="flex items-center px-4 py-2 bg-[orange-600] text-white font-semibold rounded-lg shadow-md hover:bg-[orange-600] transition duration-150"
              >
                <CheckCircle className="w-5 h-5 mr-2" /> Duyệt
              </button>
            </div>
          </div>
        )}

        {/* Lịch sử Admin (Nếu giao dịch đã hoàn tất) */}
        {!isPending && (
          <div className="space-y-2 pt-4 border-t border-gray-100">
            <h3 className="text-lg font-semibold text-gray-700">
              Lịch sử Xét duyệt
            </h3>
            <p className="text-sm text-gray-600">
              Trạng thái:
              <span
                className={`font-bold ml-2 ${
                  transaction.status === "COMPLETED"
                    ? "text-[orange-600]"
                    : "text-red-500"
                }`}
              >
                {getStatusLabel(transaction.status)}
              </span>
            </p>
            <p className="text-sm text-gray-600">
              Cập nhật:{" "}
              {new Date(transaction.updatedAt).toLocaleString("vi-VN")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// Component con: Mục chi tiết trong bảng
const DetailItem: React.FC<{
  icon: React.ElementType;
  label: string;
  value: string;
}> = ({ icon: Icon, label, value }) => (
  <div className="flex items-start space-x-2">
    <Icon className="w-4 h-4 text-[orange-600] mt-1 shrink-0" />
    <div>
      <span className="font-medium text-gray-500 block">{label}</span>
      <span className="font-semibold text-gray-800">{value}</span>
    </div>
  </div>
);

const TransactionManagementPage: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const [activeTab, setActiveTab] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    try {
      setLoading(true);
      const response = await http.get("/wallet/admin/transactions");
      setTransactions(response.data.data.transactions || []);
    } catch (error) {
      console.error("Failed to load transactions:", error);
      showToast("Không thể tải danh sách giao dịch");
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Lọc giao dịch theo trạng thái và tìm kiếm
  const filteredTransactions = useMemo(() => {
    return transactions.filter((txn) => {
      const statusMatch = activeTab === "ALL" || txn.status === activeTab;
      const searchMatch =
        txn._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        txn.userId?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        txn.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase());
      return statusMatch && searchMatch;
    });
  }, [transactions, activeTab, searchTerm]);

  // Xử lý Duyệt giao dịch
  const handleApprove = async (id: string, note: string) => {
    try {
      setIsSubmitting(true);
      await http.post(`/wallet/admin/transactions/${id}/approve`, {
        note: note || "Được duyệt bởi Admin.",
      });
      showToast("Đã duyệt giao dịch thành công");
      setSelectedTransaction(null);
      loadTransactions();
    } catch (error: any) {
      console.error("Failed to approve transaction:", error);
      showToast(error.response?.data?.message || "Không thể duyệt giao dịch");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Xử lý Từ chối giao dịch
  const handleReject = async (id: string, note: string) => {
    if (!note) {
      showToast("Vui lòng nhập ghi chú lý do từ chối giao dịch");
      return;
    }

    try {
      setIsSubmitting(true);
      await http.post(`/wallet/admin/transactions/${id}/reject`, {
        note,
      });
      showToast("Đã từ chối giao dịch");
      setSelectedTransaction(null);
      loadTransactions();
    } catch (error: any) {
      console.error("Failed to reject transaction:", error);
      showToast(error.response?.data?.message || "Không thể từ chối giao dịch");
    } finally {
      setIsSubmitting(false);
    }
  };

  const tabItems = [
    {
      key: "ALL",
      label: "Tất cả",
      icon: Banknote,
      count: transactions.length,
    },
    {
      key: "PENDING",
      label: "Chờ duyệt",
      icon: Clock,
      count: transactions.filter((t) => t.status === "PENDING").length,
    },
    {
      key: "COMPLETED",
      label: "Đã duyệt",
      icon: CheckCircle,
      count: transactions.filter((t) => t.status === "COMPLETED").length,
    },
    {
      key: "FAILED",
      label: "Đã hủy",
      icon: XCircle,
      count: transactions.filter(
        (t) => t.status === "FAILED" || t.status === "REJECTED",
      ).length,
    },
  ];

  return (
    <div className="min-h-screen p-4 sm:p-8 ">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 bg-[orange-600] text-white px-6 py-3 rounded-xl shadow-lg">
          {toastMessage}
        </div>
      )}

      <div className="max-w-7xl mx-auto space-y-8">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader className="w-8 h-8 text-[orange-600] animate-spin" />
          </div>
        ) : (
          <>
            {/* Nội dung chính: 2 cột */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cột 1: Danh sách Giao dịch */}
              <div className="lg:col-span-2 space-y-6">
                {/* Thanh Tìm kiếm */}
                <div className="flex items-center p-4 bg-white rounded-xl shadow-lg border border-gray-100">
                  <Search className="w-5 h-5 text-gray-400 mr-3" />
                  <input
                    type="text"
                    placeholder="Tìm kiếm theo mã GD, người dùng..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full border-none focus:ring-0 text-sm"
                  />
                </div>

                {/* Tab Navigation */}
                <div className="flex border-b border-gray-200 bg-white rounded-xl shadow-lg p-1">
                  {tabItems.map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => {
                        setActiveTab(tab.key);
                        setSelectedTransaction(null); // Reset chi tiết khi đổi tab
                      }}
                      className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition duration-200 
                        ${
                          activeTab === tab.key
                            ? "bg-gradient-to-br from-orange-500 via-orange-600 to-amber-600 text-white shadow-md"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                    >
                      {React.createElement(tab.icon, {
                        className: "w-4 h-4 mr-2",
                      })}
                      {tab.label} ({tab.count})
                    </button>
                  ))}
                </div>

                <TransactionTable
                  transactions={filteredTransactions}
                  onSelectTransaction={setSelectedTransaction}
                  activeTab={activeTab}
                />
              </div>

              {/* Cột 2: Chi tiết Xét duyệt */}
              <div className="lg:col-span-1 h-full">
                <TransactionDetails
                  transaction={selectedTransaction}
                  onApprove={handleApprove}
                  onReject={handleReject}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TransactionManagementPage;
