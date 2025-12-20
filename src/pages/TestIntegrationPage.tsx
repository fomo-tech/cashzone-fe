import { useState, useEffect } from "react";
import { TestLeaderboard } from "@/components/TestLeaderboard";
import LeaderBoard from "@/pages/LeaderBoard";

const TestIntegrationPage: React.FC = () => {
  const [dataReady, setDataReady] = useState(false);
  const [showLeaderBoard, setShowLeaderBoard] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 p-4 space-y-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            🧪 Test Tích Hợp Leaderboard
          </h1>
          <p className="text-gray-600">
            Kiểm tra kết nối giữa frontend và backend với dữ liệu đã seed.
          </p>
        </div>

        {/* Test Component */}
        <TestLeaderboard onDataReady={setDataReady} />

        {/* Show/Hide Leaderboard Button */}
        {dataReady && (
          <div className="text-center">
            <button
              onClick={() => setShowLeaderBoard(!showLeaderBoard)}
              className="px-6 py-3 bg-gradient-to-r from-pink-500 to-orange-500 text-white rounded-lg font-medium hover:shadow-lg transition-all duration-200"
            >
              {showLeaderBoard ? "🙈 Ẩn Leaderboard" : "👀 Hiện Leaderboard"}
            </button>
          </div>
        )}

        {/* Actual Leaderboard Component */}
        {showLeaderBoard && (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-4 border-b bg-gray-50">
              <h2 className="text-xl font-semibold text-gray-800">
                📊 Leaderboard Với Dữ Liệu Thật
              </h2>
              <p className="text-gray-600 text-sm">
                Dữ liệu từ MongoDB với 132 users và 68 commissions đã được seed
              </p>
            </div>
            <LeaderBoard />
          </div>
        )}

        {/* Instructions */}
        <div className="bg-blue-50 rounded-lg p-4">
          <h3 className="font-semibold text-blue-800 mb-2">
            📋 Hướng dẫn kiểm tra:
          </h3>
          <ol className="text-blue-700 text-sm space-y-1 list-decimal list-inside">
            <li>
              Kiểm tra phần test trên có hiển thị "✅ Kết nối thành công!" không
            </li>
            <li>Xem số lượng users trong top và tổng thu nhập</li>
            <li>Click "👀 Hiện Leaderboard" để xem component thật</li>
            <li>
              Kiểm tra top 3 podium có hiển thị đúng không (Lê Minh Cường #1)
            </li>
            <li>Scroll xuống xem bảng ranking có đầy đủ data không</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default TestIntegrationPage;
