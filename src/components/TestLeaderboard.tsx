import { useEffect, useState } from "react";
import { leaderboardService } from "@/services/leaderboardService";

interface TestLeaderboardProps {
  onDataReady?: (hasData: boolean) => void;
}

export const TestLeaderboard: React.FC<TestLeaderboardProps> = ({
  onDataReady,
}) => {
  const [testResults, setTestResults] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const testLeaderboardData = async () => {
      try {
        console.log("🧪 Testing leaderboard API...");

        // Test the leaderboard service
        const data = await leaderboardService.getLeaderBoard("all", 5);

        console.log("✅ Leaderboard data received:", data);

        setTestResults({
          success: true,
          data,
          hasTopUsers: data.topUsers && data.topUsers.length > 0,
          userCount: data.topUsers ? data.topUsers.length : 0,
          totalEarnings: data.stats?.totalEarnings || 0,
          error: null,
        });

        onDataReady?.(data.topUsers && data.topUsers.length > 0);
      } catch (error) {
        console.error("❌ Leaderboard test failed:", error);

        setTestResults({
          success: false,
          data: null,
          hasTopUsers: false,
          userCount: 0,
          totalEarnings: 0,
          error: error instanceof Error ? error.message : "Unknown error",
        });

        onDataReady?.(false);
      } finally {
        setLoading(false);
      }
    };

    testLeaderboardData();
  }, [onDataReady]);

  if (loading) {
    return (
      <div className="p-4 bg-blue-50 rounded-lg">
        <h3 className="text-lg font-semibold text-blue-800">
          🧪 Testing Leaderboard Integration...
        </h3>
        <p className="text-blue-600">Đang kiểm tra kết nối với dữ liệu...</p>
      </div>
    );
  }

  return (
    <div
      className={`p-4 rounded-lg ${
        testResults?.success ? "bg-green-50" : "bg-red-50"
      }`}
    >
      <h3
        className={`text-lg font-semibold ${
          testResults?.success ? "text-green-800" : "text-red-800"
        }`}
      >
        {testResults?.success ? "✅ Kết nối thành công!" : "❌ Lỗi kết nối"}
      </h3>

      {testResults?.success ? (
        <div className="space-y-2 text-green-700">
          <p>👥 Số người dùng trong top: {testResults.userCount}</p>
          <p>
            💰 Tổng thu nhập: {testResults.totalEarnings.toLocaleString()} VND
          </p>
          <p>📊 Có dữ liệu: {testResults.hasTopUsers ? "Có" : "Không"}</p>

          {testResults.hasTopUsers && (
            <div className="mt-3">
              <h4 className="font-bold text-green-800">Top 3 Users:</h4>
              <ul className="text-sm space-y-1">
                {testResults.data.topUsers
                  .slice(0, 3)
                  .map((user: any, idx: number) => (
                    <li key={idx}>
                      #{user.rank} - {user.name} -{" "}
                      {user.totalEarnings.toLocaleString()} VND
                    </li>
                  ))}
              </ul>
            </div>
          )}
        </div>
      ) : (
        <div className="text-red-700">
          <p>Lỗi: {testResults?.error}</p>
          <p className="text-sm mt-2">Kiểm tra:</p>
          <ul className="text-sm list-disc list-inside">
            <li>Backend server có đang chạy không?</li>
            <li>Dữ liệu đã được seed chưa?</li>
            <li>API endpoint có hoạt động không?</li>
          </ul>
        </div>
      )}
    </div>
  );
};
