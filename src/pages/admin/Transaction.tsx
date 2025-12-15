import React, { useState, useMemo } from "react";
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
} from "lucide-react";

// Dữ liệu giao dịch giả lập
const mockTransactions = [
  {
    id: "TXN1001",
    type: "Nạp",
    amount: 5000000,
    user: "Nguyen Van A",
    userId: "U4567",
    date: "2025-11-20",
    status: "Pending",
    bankAccount: "1234567890",
    bankName: "Vietcombank",
    details: "Chuyển khoản từ cá nhân",
  },
  {
    id: "TXN1002",
    type: "Rút",
    amount: 1500000,
    user: "Tran Thi B",
    userId: "U4568",
    date: "2025-11-20",
    status: "Pending",
    bankAccount: "0987654321",
    bankName: "Techcombank",
    details: "Rút tiền lợi nhuận",
  },
  {
    id: "TXN1003",
    type: "Nạp",
    amount: 10000000,
    user: "Le Van C",
    userId: "U4569",
    date: "2025-11-19",
    status: "Approved",
    bankAccount: "1122334455",
    bankName: "ACB",
    details: "Nạp vốn",
  },
  {
    id: "TXN1004",
    type: "Rút",
    amount: 500000,
    user: "Pham Thu D",
    userId: "U4570",
    date: "2025-11-19",
    status: "Rejected",
    bankAccount: "6677889900",
    bankName: "BIDV",
    details: "Sai thông tin ngân hàng",
  },
  {
    id: "TXN1005",
    type: "Rút",
    amount: 50000000,
    user: "Nguyen Van A",
    userId: "U4567",
    date: "2025-11-21",
    status: "Pending",
    bankAccount: "1234567890",
    bankName: "Vietcombank",
    details: "Rút vốn",
  },
];

// Hàm định dạng tiền tệ Việt Nam
const formatCurrency = (amount) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

// Component con: Bảng giao dịch
const TransactionTable = ({ transactions, onSelectTransaction, activeTab }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Approved":
        return "bg-green-100 text-green-800";
      case "Rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
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
                colSpan="6"
                className="px-6 py-4 text-center text-sm text-gray-500"
              >
                Không tìm thấy giao dịch nào ở trạng thái "{activeTab}".
              </td>
            </tr>
          ) : (
            transactions.map((txn) => (
              <tr
                key={txn.id}
                className="hover:bg-purple-50 cursor-pointer transition duration-150"
                onClick={() => onSelectTransaction(txn)}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {txn.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 flex items-center">
                  {txn.type === "Nạp" ? (
                    <TrendingUp className="w-4 h-4 text-green-500 mr-2" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-500 mr-2" />
                  )}
                  {txn.type}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-700">
                  {formatCurrency(txn.amount)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {txn.user}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                      txn.status
                    )}`}
                  >
                    {txn.status === "Pending"
                      ? "Chờ duyệt"
                      : txn.status === "Approved"
                      ? "Đã duyệt"
                      : "Đã hủy"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <ArrowRight className="w-4 h-4 text-purple-500" />
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
const TransactionDetails = ({ transaction, onApprove, onReject }) => {
  const [adminNote, setAdminNote] = useState("");

  if (!transaction) {
    return (
      <div className="p-8 h-full flex items-center justify-center bg-white rounded-xl shadow-lg border border-gray-100">
        <div className="text-center text-gray-500">
          <Banknote className="w-12 h-12 mx-auto mb-3 text-purple-400" />
          <p className="text-lg font-semibold">
            Chọn một giao dịch để xem chi tiết
          </p>
          <p className="text-sm">Và thực hiện xét duyệt (Duyệt/Từ chối).</p>
        </div>
      </div>
    );
  }

  const isPending = transaction.status === "Pending";
  const headerIcon = transaction.type === "Nạp" ? TrendingUp : TrendingDown;
  const headerColor =
    transaction.type === "Nạp"
      ? "text-green-600 bg-green-50"
      : "text-red-600 bg-red-50";

  return (
    <div className="bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className={`p-5 flex items-center justify-between ${headerColor}`}>
        <div className="flex items-center">
          <headerIcon
            className={`w-6 h-6 mr-3 ${headerColor.replace("bg-", "text-")}`}
          />
          <h2 className="text-xl font-bold text-gray-800">
            {transaction.type} - {formatCurrency(transaction.amount)}
          </h2>
        </div>
        <span
          className={`px-3 py-1 text-sm font-bold rounded-full ${
            transaction.status === "Pending"
              ? "bg-yellow-500 text-white"
              : transaction.status === "Approved"
              ? "bg-green-500 text-white"
              : "bg-red-500 text-white"
          }`}
        >
          {transaction.status === "Pending"
            ? "Chờ Duyệt"
            : transaction.status === "Approved"
            ? "Đã Duyệt"
            : "Đã Hủy"}
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
            value={transaction.id}
          />
          <DetailItem
            icon={Clock}
            label="Ngày Tạo"
            value={new Date(transaction.date).toLocaleDateString("vi-VN")}
          />
          <DetailItem
            icon={User}
            label="Người Giao Dịch"
            value={`${transaction.user} (${transaction.userId})`}
          />
        </div>

        <h3 className="text-lg font-semibold text-gray-700 border-b pb-2 pt-4">
          Thông tin Thanh toán
        </h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <DetailItem
            icon={Banknote}
            label="Ngân Hàng"
            value={transaction.bankName}
          />
          <DetailItem
            icon={Banknote}
            label="Số Tài Khoản"
            value={transaction.bankAccount}
          />
        </div>

        <div className="text-sm pt-4">
          <span className="font-semibold text-gray-700 block mb-1">Mô tả:</span>
          <p className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-600 italic">
            {transaction.details}
          </p>
        </div>

        {/* Khu vực xét duyệt */}
        {isPending && (
          <div className="space-y-4 pt-6 border-t border-gray-100">
            <h3 className="text-lg font-bold text-purple-600">
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
              rows="3"
              value={adminNote}
              onChange={(e) => setAdminNote(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 text-sm"
              placeholder="Nhập lý do duyệt hoặc từ chối giao dịch..."
            />

            <div className="flex justify-end space-x-4">
              <button
                onClick={() => onReject(transaction.id, adminNote)}
                className="flex items-center px-4 py-2 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 transition duration-150"
              >
                <XCircle className="w-5 h-5 mr-2" /> Từ Chối
              </button>
              <button
                onClick={() => onApprove(transaction.id, adminNote)}
                className="flex items-center px-4 py-2 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition duration-150"
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
                  transaction.status === "Approved"
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                {transaction.status === "Approved" ? "Đã duyệt" : "Đã hủy"}
              </span>
            </p>
            <p className="text-sm text-gray-600">Ghi chú: [Không có ghi chú]</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Component con: Mục chi tiết trong bảng
const DetailItem = ({ icon: Icon, label, value }) => (
  <div className="flex items-start space-x-2">
    <Icon className="w-4 h-4 text-purple-500 mt-1 shrink-0" />
    <div>
      <span className="font-medium text-gray-500 block">{label}</span>
      <span className="font-semibold text-gray-800">{value}</span>
    </div>
  </div>
);

const TransactionManagementPage = () => {
  const [transactions, setTransactions] = useState(mockTransactions);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [activeTab, setActiveTab] = useState("Pending"); // Pending, Approved, Rejected
  const [searchTerm, setSearchTerm] = useState("");

  // Lọc giao dịch theo trạng thái và tìm kiếm
  const filteredTransactions = useMemo(() => {
    return transactions.filter((txn) => {
      const statusMatch = txn.status === activeTab;
      const searchMatch =
        txn.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        txn.user.toLowerCase().includes(searchTerm.toLowerCase());
      return statusMatch && searchMatch;
    });
  }, [transactions, activeTab, searchTerm]);

  // Xử lý Duyệt giao dịch
  const handleApprove = (id, note) => {
    setTransactions((prev) =>
      prev.map((txn) =>
        txn.id === id
          ? {
              ...txn,
              status: "Approved",
              adminNote: note || "Được duyệt bởi Admin.",
            }
          : txn
      )
    );
    setSelectedTransaction(null); // Đóng chi tiết sau khi duyệt
    console.log(`Giao dịch ${id} đã được duyệt. Ghi chú: ${note}`);
  };

  // Xử lý Từ chối giao dịch
  const handleReject = (id, note) => {
    // Yêu cầu ghi chú khi từ chối
    if (!note) {
      alert("Vui lòng nhập ghi chú lý do từ chối giao dịch.");
      return;
    }
    setTransactions((prev) =>
      prev.map((txn) =>
        txn.id === id ? { ...txn, status: "Rejected", adminNote: note } : txn
      )
    );
    setSelectedTransaction(null); // Đóng chi tiết sau khi từ chối
    console.log(`Giao dịch ${id} đã bị từ chối. Lý do: ${note}`);
  };

  const tabItems = [
    {
      key: "Pending",
      label: "Chờ duyệt",
      icon: Clock,
      count: transactions.filter((t) => t.status === "Pending").length,
    },
    {
      key: "Approved",
      label: "Đã duyệt",
      icon: CheckCircle,
      count: transactions.filter((t) => t.status === "Approved").length,
    },
    {
      key: "Rejected",
      label: "Đã hủy",
      icon: XCircle,
      count: transactions.filter((t) => t.status === "Rejected").length,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center space-x-3">
          <Banknote className="w-8 h-8 text-purple-600" />
          <h1 className="text-3xl font-extrabold text-gray-900">
            Quản Lý Giao Dịch (Nạp & Rút)
          </h1>
        </div>
        <p className="text-gray-500">
          Xem xét và xét duyệt chi tiết các giao dịch nạp và rút tiền trong hệ
          thống.
        </p>

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
                        ? "bg-purple-600 text-white shadow-md"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                >
                  <tab.icon className="w-4 h-4 mr-2" />
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
      </div>
    </div>
  );
};

export default TransactionManagementPage;
