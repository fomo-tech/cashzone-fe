import React, { useState } from "react";
import { RotateCw, History, TrendingUp, Sparkles } from "lucide-react";
import LuckyWheelCard from "../components/LuckyWheelCard";
import LuckyWheelHistory from "../components/LuckyWheelHistory";
import { type SpinResult } from "../services/luckywheelService";

const LuckyWheelPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"spin" | "history">("spin");
  const [key, setKey] = useState(0);

  const handleSpinComplete = (result: SpinResult) => {
    // Refresh history when spin completes
    if (activeTab === "history") {
      setKey((prev) => prev + 1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
            <Sparkles className="h-8 w-8 text-orange-500" />
            Vòng Quay May Mắn
          </h1>
          <p className="text-gray-600">
            Thử vận may của bạn và nhận ngay phần thưởng hấp dẫn!
          </p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border mb-6">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab("spin")}
              className={`flex-1 px-6 py-4 font-semibold transition-colors relative ${
                activeTab === "spin"
                  ? "text-amber-600 bg-amber-50"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <RotateCw className="h-5 w-5" />
                <span>Quay Thưởng</span>
              </div>
              {activeTab === "spin" && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-amber-600" />
              )}
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={`flex-1 px-6 py-4 font-semibold transition-colors relative ${
                activeTab === "history"
                  ? "text-purple-600 bg-purple-50"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <History className="h-5 w-5" />
                <span>Lịch Sử</span>
              </div>
              {activeTab === "history" && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-purple-600" />
              )}
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="animate-fadeIn">
          {activeTab === "spin" ? (
            <LuckyWheelCard onSpinComplete={handleSpinComplete} />
          ) : (
            <LuckyWheelHistory key={key} />
          )}
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 border border-amber-200">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-amber-100 rounded-lg">
                <TrendingUp className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Cách chơi</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Sử dụng Points để quay vòng</li>
                  <li>• Nhận ngay phần thưởng khi dừng</li>
                  <li>• Phần thưởng được cộng vào tài khoản</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <RotateCw className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Mẹo nhỏ</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Quay nhiều tăng cơ hội trúng giải lớn</li>
                  <li>• Kiểm tra tỷ lệ trước khi quay</li>
                  <li>• Tích lũy Points để quay nhiều hơn</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LuckyWheelPage;
