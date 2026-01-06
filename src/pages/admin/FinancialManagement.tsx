import React from "react";
import { Receipt } from "lucide-react";
import TransactionManagementPage from "./Transaction";

const FinancialManagement: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-3 py-4">
            <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-orange-1000 rounded-xl flex items-center justify-center shadow-lg">
              <Receipt className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-orange-1000 bg-clip-text text-transparent">
                Quản lý Giao dịch
              </h1>
              <p className="text-sm text-gray-500">
                Xét duyệt và quản lý các giao dịch nạp/rút tiền
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto">
        <TransactionManagementPage />
      </div>
    </div>
  );
};

export default FinancialManagement;
