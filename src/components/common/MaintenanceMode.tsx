import React from "react";
import { Settings, RefreshCw } from "lucide-react";

interface MaintenanceModeProps {
  message?: string;
}

const MaintenanceMode: React.FC<MaintenanceModeProps> = ({
  message = "Hệ thống đang bảo trì, vui lòng quay lại sau.",
}) => {
  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-green-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="bg-linear-to-r from-green-600 to-emerald-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
          <Settings
            className="w-10 h-10 text-white animate-spin"
            style={{ animationDuration: "3s" }}
          />
        </div>

        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          🔧 Đang Bảo Trì
        </h1>

        <p className="text-gray-600 mb-6 leading-relaxed">{message}</p>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-green-700">
            Chúng tôi đang cải thiện hệ thống để mang đến trải nghiệm tốt hơn
            cho bạn.
          </p>
        </div>

        <button
          onClick={() => window.location.reload()}
          className="flex items-center gap-2 justify-center w-full px-6 py-3 bg-linear-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all shadow-md hover:shadow-lg"
        >
          <RefreshCw className="w-5 h-5" />
          Thử Lại
        </button>

        <p className="text-xs text-gray-500 mt-6">
          Nếu cần hỗ trợ, vui lòng liên hệ:{" "}
          <a
            href="mailto:support@affiliate.com"
            className="text-green-600 hover:underline"
          >
            support@affiliate.com
          </a>
        </p>
      </div>
    </div>
  );
};

export default MaintenanceMode;
