import { useState, useEffect, useCallback } from "react";
import {
  Crown,
  Gem,
  Trophy,
  TrendingUp,
  DollarSign,
  Users,
  RefreshCw,
} from "lucide-react";
import { formatCurrency, formatNumber } from "@/utils/constants";
import { useAppStore } from "@/store/appStore";
import {
  leaderboardService,
  type LeaderBoardUser,
  type LeaderBoardStats,
} from "@/services/leaderboardService";

// Định nghĩa style cố định cho Top 3 (Vàng, Bạc, Đồng) - Đã điều chỉnh cho nền sáng
const TOP_RANK_STYLES: Record<
  number,
  {
    title: string;
    crown: string;
    bgColor: string;
    shadow: string;
    heightClass: string;
    order: string;
    avatarBg: string;
    avatarRing: string;
    scoreColor: string;
    textColor: string;
  }
> = {
  // Rank 1: GOLD - Vàng trên nền sáng
  1: {
    title: "Vàng",
    crown: "text-[#FFD700]",
    bgColor: "bg-white border-4 border-[#FFD700]/70",
    shadow:
      "shadow-[0_20px_40px_rgba(255,215,0,0.3),_0_0_10px_rgba(255,215,0,0.2)]",
    heightClass: "min-h-80",
    order: "order-1", // Giữa
    avatarBg: "bg-yellow-500/90 text-white",
    avatarRing: "ring-4 ring-yellow-400",
    scoreColor: "text-yellow-600",
    textColor: "text-gray-900",
  },
  // Rank 2: SILVER - Bạc trên nền sáng
  2: {
    title: "Bạc",
    crown: "text-[#C0C0C0]",
    bgColor: "bg-gray-100 border-4 border-[#C0C0C0]/70",
    shadow:
      "shadow-[0_15px_30px_rgba(192,192,192,0.25),_0_0_8px_rgba(192,192,192,0.1)]",
    heightClass: "min-h-72",
    order: "order-0", // Bên trái
    avatarBg: "bg-gray-500/90 text-white",
    avatarRing: "ring-4 ring-gray-400",
    scoreColor: "text-gray-600",
    textColor: "text-gray-800",
  },
  // Rank 3: BRONZE - Đồng trên nền sáng
  3: {
    title: "Đồng",
    crown: "text-[#CD7F32]",
    bgColor: "bg-orange-50 border-4 border-[#CD7F32]/70",
    shadow:
      "shadow-[0_15px_30px_rgba(205,127,50,0.25),_0_0_8px_rgba(205,127,50,0.1)]",
    heightClass: "min-h-72",
    order: "order-2", // Bên phải
    avatarBg: "bg-orange-500/90 text-white",
    avatarRing: "ring-4 ring-orange-400",
    scoreColor: "text-orange-600",
    textColor: "text-gray-800",
  },
};

const LeaderBoard = () => {
  const { setToast } = useAppStore();
  const [topUsers, setTopUsers] = useState<LeaderBoardUser[]>([]);
  const [otherUsers, setOtherUsers] = useState<LeaderBoardUser[]>([]);
  const [currentUserStats, setCurrentUserStats] =
    useState<LeaderBoardUser | null>(null);
  const [stats, setStats] = useState<LeaderBoardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [timeFilter, setTimeFilter] = useState<
    "week" | "month" | "year" | "all"
  >("month");

  // Load leaderboard data
  const loadLeaderBoard = useCallback(async () => {
    try {
      const data = await leaderboardService.getLeaderBoard(timeFilter, 10);

      // Split into top 3 and others - with safety checks
      const validTopUsers = (data.topUsers || []).filter(
        (user) => user && typeof user.rank !== "undefined"
      );
      const top3 = validTopUsers.slice(0, 3);
      const others = validTopUsers.slice(3);

      setTopUsers(top3);
      setOtherUsers(others);
      setCurrentUserStats(data.currentUser || null);
      setStats(data.stats || null);
    } catch (error) {
      console.error("Error loading leaderboard:", error);
      setToast({
        type: "error",
        title: "Lỗi tải bảng xếp hạng",
        isVisible: true,
        timer: 3000,
      });
      // Reset to empty state on error
      setTopUsers([]);
      setOtherUsers([]);
      setCurrentUserStats(null);
      setStats(null);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [timeFilter, setToast]);

  useEffect(() => {
    loadLeaderBoard();
  }, [timeFilter, loadLeaderBoard]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadLeaderBoard();
  };

  // Component Avatar
  const Avatar = ({
    name,
    rank,
    isMobile = false,
  }: {
    name: string;
    rank: number;
    isMobile?: boolean;
  }) => {
    const style = TOP_RANK_STYLES[rank] || TOP_RANK_STYLES[1];
    const size = isMobile ? "w-12 h-12" : "w-16 h-16 md:w-[70px] md:h-[70px]";
    const textSize = isMobile ? "text-lg" : "text-2xl md:text-3xl";
    const border = isMobile ? "border-2" : "border-3 md:border-4";
    const initial = name ? name.charAt(0).toUpperCase() : "?";

    return (
      <div
        className={`${size} rounded-full ${border} ${style.avatarRing || ""} ${
          style.avatarBg || "bg-gray-500"
        } 
                flex items-center justify-center mb-2 md:mb-3 overflow-hidden shadow-lg
                ${textSize} font-extrabold text-white`}
      >
        {initial}
      </div>
    );
  };

  return (
    <div className="min-h-screen  text-gray-900 font-sans p-2 md:p-3 lg:p-4">
      <div className="max-w-6xl mx-auto flex flex-col items-center">
        {/* Header Section */}
        <div className="relative w-full text-center mb-6 md:mb-8 lg:mb-12 mt-3 md:mt-4 lg:mt-6">
          {/* Glow background */}
          <div className="absolute inset-0 flex justify-center opacity-30">
            <div className="w-96 h-96 bg-gradient-to-r from-orange-400 to-orange-1000 blur-[80px] rounded-full"></div>
          </div>

          {/* Title */}
          <h1 className="relative z-10 font-extrabold tracking-tighter uppercase text-2xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-1000">
            BẢNG XẾP HẠNG
          </h1>

          {/* Subtitle & Controls */}
          <div className="relative z-10 flex flex-col md:flex-row justify-center items-center mt-4 gap-4">
            <div className="flex items-center space-x-2 text-sm md:text-base lg:text-xl font-semibold text-gray-600">
              <Trophy className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 text-orange-500" />
              <span>
                <span className="hidden sm:inline">Top Earners: </span>
                <span className="text-orange-500">#{timeFilter}</span>
              </span>
            </div>

            {/* Time Filter */}
            <div className="flex bg-white rounded-xl p-1 shadow-lg border border-gray-200">
              {(["week", "month", "all"] as const).map((period) => (
                <button
                  key={period}
                  onClick={() => setTimeFilter(period)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                    timeFilter === period
                      ? "bg-gradient-to-r from-orange-400 to-orange-1000 text-white shadow-md"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  {period === "week"
                    ? "Tuần"
                    : period === "month"
                    ? "Tháng"
                    : "Tất cả"}
                </button>
              ))}
            </div>

            {/* Refresh Button */}
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 rounded-xl hover:bg-gray-50 transition-colors shadow-lg border border-gray-200"
            >
              <RefreshCw
                className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
              />
              <span className="hidden md:inline">Làm mới</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="w-full max-w-4xl mb-6 md:mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-6 shadow-lg border border-orange-200">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl">
                <Users className="w-6 h-6 text-orange-500" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Tổng thành viên</p>
                <p className="text-2xl font-bold text-orange-500">
                  {loading ? (
                    <div className="w-16 h-8 bg-gray-200 rounded animate-pulse"></div>
                  ) : (
                    formatNumber(stats?.totalUsers || 0)
                  )}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-orange-200">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl">
                <DollarSign className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Tổng thu nhập</p>
                <p className="text-2xl font-bold text-orange-600">
                  {loading ? (
                    <div className="w-20 h-8 bg-gray-200 rounded animate-pulse"></div>
                  ) : (
                    formatCurrency(stats?.totalEarnings || 0)
                  )}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-emerald-200">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl">
                <TrendingUp className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Xếp hạng của bạn</p>
                <p className="text-2xl font-bold text-emerald-600">
                  {loading ? (
                    <div className="w-12 h-8 bg-gray-200 rounded animate-pulse"></div>
                  ) : (
                    `#${currentUserStats?.rank || "N/A"}`
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* --- Top 3 Users --- */}
        <div className="w-full max-w-4xl mb-4 md:mb-8 lg:mb-12">
          {/* Mobile: Horizontal compact cards */}
          <div className="sm:hidden space-y-3">
            {loading ? (
              [...Array(3)].map((_, idx) => (
                <div
                  key={idx}
                  className="flex items-center p-3 rounded-xl bg-gray-200 animate-pulse"
                >
                  <div className="w-6 h-6 bg-gray-300 rounded mr-2"></div>
                  <div className="w-8 h-6 bg-gray-300 rounded mr-3"></div>
                  <div className="w-12 h-12 bg-gray-300 rounded-full mr-3"></div>
                  <div className="flex-1">
                    <div className="w-20 h-4 bg-gray-300 rounded mb-1"></div>
                    <div className="w-16 h-3 bg-gray-300 rounded"></div>
                  </div>
                  <div className="w-16 h-6 bg-gray-300 rounded"></div>
                </div>
              ))
            ) : topUsers && topUsers.length > 0 ? (
              topUsers.map((user) => {
                if (!user || typeof user.rank === "undefined") return null;
                const style = TOP_RANK_STYLES[user.rank] || TOP_RANK_STYLES[1];
                return (
                  <div
                    key={user.rank}
                    className={`flex items-center p-3 rounded-xl transition-all duration-500 backdrop-blur-sm ${style.bgColor} ${style.textColor}`}
                    style={{ boxShadow: style.shadow }}
                  >
                    {/* Left: Crown + Rank */}
                    <div className="flex items-center mr-3">
                      <div className={`${style.crown} drop-shadow-lg mr-2`}>
                        <Crown
                          className="w-6 h-6 fill-current"
                          strokeWidth={1}
                        />
                      </div>
                      <div
                        className="text-xl font-black"
                        style={{ color: style.crown }}
                      >
                        #{user.rank}
                      </div>
                    </div>

                    {/* Center: Avatar */}
                    <Avatar
                      name={user.name || "Unknown"}
                      rank={user.rank || 1}
                      isMobile={true}
                    />

                    {/* Right: User info */}
                    <div className="flex-1 ml-3">
                      <p className="text-lg font-black truncate">
                        {(user.name || "").length > 8
                          ? (user.name || "").substring(0, 8) + "..."
                          : user.name || "Unknown"}
                      </p>
                      <p className="text-sm font-bold opacity-90 flex items-center">
                        <Gem
                          className={`w-3 h-3 mr-1 fill-current ${style.scoreColor}`}
                          strokeWidth={1.5}
                        />
                        <span className={style.scoreColor}>
                          ${(user.totalEarnings || 0).toLocaleString()}
                        </span>
                      </p>
                    </div>

                    {/* Prize */}
                    <div className="p-1.5 px-3 rounded-full text-xs font-extrabold bg-linear-to-r from-orange-500 to-orange-1000 text-white shadow-lg">
                      {user.totalReferrals || 0} refs
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 font-medium">
                  Chưa có dữ liệu xếp hạng
                </p>
              </div>
            )}
          </div>

          {/* Desktop: Traditional podium layout */}
          <div className="hidden sm:flex sm:justify-center sm:items-end w-full gap-3 md:gap-4 lg:gap-6">
            {loading ? (
              [...Array(3)].map((_, idx) => (
                <div
                  key={idx}
                  className="flex flex-col items-center p-2 md:p-3 lg:p-4 rounded-xl md:rounded-2xl lg:rounded-3xl w-1/3 bg-gray-200 animate-pulse"
                  style={{ height: "240px" }}
                >
                  <div className="w-8 h-8 bg-gray-300 rounded mb-2"></div>
                  <div className="w-12 h-8 bg-gray-300 rounded mb-2"></div>
                  <div className="w-16 h-16 bg-gray-300 rounded-full mb-2"></div>
                  <div className="w-20 h-6 bg-gray-300 rounded mb-1"></div>
                  <div className="w-16 h-6 bg-gray-300 rounded mb-3"></div>
                  <div className="w-20 h-8 bg-gray-300 rounded"></div>
                </div>
              ))
            ) : topUsers && topUsers.length >= 3 ? (
              [topUsers[1], topUsers[0], topUsers[2]].map((user) => {
                if (!user || !user.rank) return null;
                const style = TOP_RANK_STYLES[user.rank];

                return (
                  <div
                    key={user.rank}
                    className={`flex flex-col items-center p-2 md:p-3 lg:p-4 rounded-xl md:rounded-2xl lg:rounded-3xl w-1/3 
                                      text-center transition-all duration-500 backdrop-blur-sm ${style.bgColor} ${style.heightClass} ${style.textColor}`}
                    style={{
                      boxShadow: style.shadow,
                      transform: user.rank === 1 ? "scale(1.08)" : "scale(1.0)",
                    }}
                  >
                    {/* Crown compact */}
                    <div className={`${style.crown} drop-shadow-lg mb-2`}>
                      <Crown
                        className="w-8 h-8 md:w-9 md:h-9 lg:w-10 lg:h-10 mx-auto fill-current"
                        strokeWidth={1}
                      />
                    </div>

                    {/* Rank Number compact */}
                    <div
                      className="text-xl md:text-2xl lg:text-3xl font-black mb-2 -mt-2"
                      style={{ color: style.crown }}
                    >
                      #{user.rank}
                    </div>

                    {/* Avatar */}
                    <Avatar
                      name={user.name || "Unknown"}
                      rank={user.rank || 1}
                    />

                    {/* Username */}
                    <p className="text-base md:text-lg lg:text-xl font-black mb-1 tracking-tight truncate max-w-full">
                      {user.name || "Unknown User"}
                    </p>

                    {/* Earnings */}
                    <p className="text-sm md:text-base lg:text-lg font-bold opacity-90 flex items-center mb-2 md:mb-3">
                      <Gem
                        className={`w-4 h-4 md:w-5 md:h-5 mr-1 fill-current ${style.scoreColor}`}
                        strokeWidth={1.5}
                      />
                      <span className={style.scoreColor}>
                        ${(user.totalEarnings || 0).toLocaleString()}
                      </span>
                    </p>

                    {/* Referrals */}
                    <div className="p-1.5 md:p-2 px-3 md:px-4 lg:px-5 rounded-full text-xs md:text-sm lg:text-base font-extrabold bg-gradient-to-r from-orange-500 to-orange-1000 text-white shadow-xl mt-auto">
                      {user.totalReferrals || 0} refs
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="flex justify-center items-center p-8">
                <p className="text-gray-500 font-medium">
                  Chưa có dữ liệu xếp hạng
                </p>
              </div>
            )}
          </div>
        </div>

        {/* --- Bảng Xếp Hạng Chính (Hạng 4+) --- */}
        <div className="w-full max-w-4xl space-y-2 md:space-y-3 lg:space-y-4">
          {/* Thanh thông tin người dùng hiện tại */}
          <div className="w-full p-3 md:p-4 rounded-lg md:rounded-xl bg-gradient-to-r from-orange-400 to-orange-1000 border border-orange-200 shadow-xl flex justify-between items-center transition-all duration-300">
            {loading ? (
              <>
                <div className="flex items-center space-x-2 md:space-x-3 lg:space-x-4">
                  <div className="w-8 h-8 md:w-9 md:h-9 lg:w-10 lg:h-10 rounded-full bg-white/20 animate-pulse"></div>
                  <div>
                    <div className="w-24 h-4 bg-white/20 rounded animate-pulse mb-1"></div>
                    <div className="w-20 h-3 bg-white/20 rounded animate-pulse"></div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="w-16 h-6 bg-white/20 rounded animate-pulse mb-1"></div>
                  <div className="w-12 h-3 bg-white/20 rounded animate-pulse"></div>
                </div>
              </>
            ) : currentUserStats ? (
              <>
                <div className="flex items-center space-x-2 md:space-x-3 lg:space-x-4">
                  <div className="w-8 h-8 md:w-9 md:h-9 lg:w-10 lg:h-10 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-sm md:text-base lg:text-lg ring-2 ring-white/30">
                    {currentUserStats.name?.charAt(0) || "U"}
                  </div>
                  <div>
                    <p className="text-sm md:text-base lg:text-lg font-extrabold text-white truncate max-w-[120px] md:max-w-none">
                      {currentUserStats.name || "User"} (Bạn)
                    </p>
                    <p className="text-sm font-semibold text-orange-100">
                      Hạng hiện tại: #
                      {(currentUserStats.rank || 0).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-base md:text-lg lg:text-xl font-extrabold text-yellow-300 flex items-center justify-end">
                    <Gem
                      className="w-4 h-4 md:w-5 md:h-5 mr-1 fill-yellow-300"
                      strokeWidth={1.5}
                    />
                    ${(currentUserStats.totalEarnings || 0).toLocaleString()}
                  </p>
                  <p className="text-xs md:text-sm text-orange-100">
                    {currentUserStats.totalReferrals || 0} lượt giới thiệu
                  </p>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center w-full">
                <p className="text-white font-semibold">
                  Không thể tải thông tin người dùng
                </p>
              </div>
            )}
          </div>

          {/* Bảng xếp hạng chi tiết */}
          <div className="w-full p-2 md:p-3 lg:p-4 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-x-auto">
            {loading ? (
              <div className="space-y-3">
                {/* Header skeleton */}
                <div className="flex justify-between items-center border-b pb-3">
                  <div className="w-8 h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="w-24 h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="w-16 h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="w-16 h-4 bg-gray-200 rounded animate-pulse"></div>
                </div>
                {/* Rows skeleton */}
                {[...Array(5)].map((_, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center py-2"
                  >
                    <div className="w-8 h-6 bg-gray-200 rounded animate-pulse"></div>
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
                      <div className="w-20 h-4 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                    <div className="w-16 h-4 bg-gray-200 rounded animate-pulse"></div>
                    <div className="w-12 h-6 bg-gray-200 rounded-full animate-pulse"></div>
                  </div>
                ))}
              </div>
            ) : (
              <table className="min-w-full text-left text-sm table-auto">
                {/* Header */}
                <thead>
                  <tr className="border-b border-gray-200 text-gray-500 font-semibold tracking-wider uppercase text-xs">
                    <th className="py-2 px-2 md:py-3 md:px-5 text-center w-12 md:w-16">
                      #
                    </th>
                    <th className="py-2 px-2 md:py-3 md:px-5">Người Dùng</th>
                    <th className="py-2 px-2 md:py-3 md:px-5 text-right w-24 md:w-32">
                      Thu Nhập
                    </th>
                    <th className="py-2 px-2 md:py-3 md:px-5 text-center w-20 md:w-24">
                      Refs
                    </th>
                  </tr>
                </thead>
                {/* Rows */}
                <tbody>
                  {otherUsers && otherUsers.length > 0 ? (
                    otherUsers.map((user, idx) => {
                      if (!user || !user.rank) return null;
                      return (
                        <tr
                          key={user.id || idx}
                          className="transition-colors border-b border-gray-100 last:border-b-0 hover:bg-orange-50"
                        >
                          {/* Ranking */}
                          <td className="py-2 px-2 md:py-3 md:px-5 text-center font-extrabold text-base md:text-lg text-orange-500">
                            #{user.rank}
                          </td>

                          {/* Username */}
                          <td className="py-2 px-2 md:py-3 md:px-5">
                            <div className="flex items-center space-x-2 md:space-x-3">
                              {/* Avatar */}
                              <div
                                className={`w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center text-white font-bold text-xs md:text-sm bg-gradient-to-r from-orange-400 to-orange-1000 ring-2 ring-orange-200 shadow-md shrink-0`}
                              >
                                {(user.name || "?").charAt(0).toUpperCase()}
                              </div>
                              <span className="text-gray-800 font-medium text-sm md:text-base truncate">
                                {user.name || "Unknown User"}
                              </span>
                            </div>
                          </td>

                          {/* Earnings */}
                          <td className="py-2 px-2 md:py-3 md:px-5 text-right font-semibold text-sm md:text-base text-gray-700">
                            <span className="text-yellow-500">
                              <Gem
                                className="w-3 h-3 md:w-4 md:h-4 inline-block mr-0.5 md:mr-1 mb-0.5 fill-yellow-500"
                                strokeWidth={1.5}
                              />
                            </span>
                            <span className="hidden sm:inline">
                              ${(user.totalEarnings || 0).toLocaleString()}
                            </span>
                            <span className="sm:hidden">
                              ${((user.totalEarnings || 0) / 1000).toFixed(1)}k
                            </span>
                          </td>

                          {/* Referrals */}
                          <td className="py-2 px-2 md:py-3 md:px-5 text-center">
                            <span className="bg-gradient-to-r from-orange-400 to-orange-1000 text-white font-extrabold text-xs md:text-sm p-1 px-2 md:p-1.5 md:px-3 rounded-full shadow-md">
                              {user.totalReferrals || 0}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td
                        colSpan={4}
                        className="text-center py-8 text-gray-500"
                      >
                        Chưa có dữ liệu bảng xếp hạng
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>

          {!loading && otherUsers.length === 0 && (
            <div className="text-center p-8">
              <p className="text-gray-500 font-medium">
                Chưa có dữ liệu xếp hạng
              </p>
            </div>
          )}

          {!loading && otherUsers.length > 0 && (
            <div className="text-center p-4">
              <button
                onClick={() => loadLeaderBoard()}
                className="text-sm font-semibold text-gray-600 hover:text-orange-500 transition flex items-center gap-2 mx-auto"
              >
                <RefreshCw className="w-4 h-4" />
                Làm mới dữ liệu
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeaderBoard;
