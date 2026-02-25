import React, { useState, useEffect } from "react";
import {
  CalendarDays,
  Gift,
  Flame,
  Check,
  Clock,
  Award,
  Target,
  CheckCircle,
} from "lucide-react";
import { toast } from "react-hot-toast";
import checkinService, {
  type CheckInRewards,
  type CheckInStats,
} from "../services/checkinService";
import { useWallet } from "../context/WalletContext";

const CheckInCard: React.FC = () => {
  const [stats, setStats] = useState<CheckInStats | null>(null);
  const [rewards, setRewards] = useState<CheckInRewards | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkingIn, setCheckingIn] = useState(false);
  const { updateBalance } = useWallet();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsData, rewardsData] = await Promise.all([
        checkinService.getStats(),
        checkinService.getRewardsConfig(),
      ]);
      setStats(statsData);
      setRewards(rewardsData);
    } catch (error) {
      console.error("Error fetching check-in data:", error);
      toast.error("Không thể tải dữ liệu điểm danh");
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async () => {
    if (!stats?.canCheckInToday) return;

    setCheckingIn(true);
    try {
      const result = await checkinService.checkIn();
      toast.success(result.message);
      await fetchData();
      updateBalance(); // Cập nhật wallet realtime
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Điểm danh thất bại");
    } finally {
      setCheckingIn(false);
    }
  };

  const getCurrentDayReward = (consecutiveDay: number): number => {
    if (!rewards) return 100;
    const dayKey = `day${Math.min(consecutiveDay, 7)}` as keyof CheckInRewards;
    const reward = rewards[dayKey];
    return (reward as number) || 100;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-100 animate-pulse">
        <div className="h-6 bg-gray-200 rounded-lg w-1/3 mb-6"></div>
        <div className="space-y-4">
          <div className="grid grid-cols-7 gap-2 sm:gap-3">
            {Array.from({ length: 7 }).map((_, i) => (
              <div
                key={i}
                className="aspect-square bg-gray-200 rounded-xl"
              ></div>
            ))}
          </div>
          <div className="h-20 bg-gray-200 rounded-xl"></div>
        </div>
      </div>
    );
  }

  if (!stats || !rewards) return null;

  // Tính ngày hiện tại trong tuần (1-7)
  const currentDayInWeek =
    stats.consecutiveCount === 0 ? 0 : ((stats.consecutiveCount - 1) % 7) + 1;
  // Ngày tiếp theo sẽ điểm danh trong tuần (1-7)
  const nextDayInWeek = (stats.consecutiveCount % 7) + 1;
  const nextReward = getCurrentDayReward(nextDayInWeek);

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl shadow-lg">
            <CalendarDays className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-900">
              Điểm danh hàng ngày
            </h3>
            <p className="text-sm text-gray-600">
              Điểm danh liên tiếp để nhận thưởng
            </p>
          </div>
        </div>

        {stats.consecutiveCount > 0 && (
          <div className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white px-3 sm:px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
            <Flame className="h-4 w-4" />
            <span>{stats.consecutiveCount} ngày liên tiếp</span>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-bold text-gray-700">
            Tiến độ tuần này
          </span>
          <span className="text-sm font-semibold text-orange-600">
            {currentDayInWeek}/7
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-orange-500 to-amber-500 h-2 rounded-full transition-all duration-500"
            style={{
              width: `${(currentDayInWeek / 7) * 100}%`,
            }}
          ></div>
        </div>
      </div>

      {/* Consecutive Days Grid */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <Target className="h-4 w-4 text-orange-500" />
          Thưởng theo ngày liên tiếp
        </h4>

        {/* Mobile: 5+2 layout with equal box sizes, Desktop: Single row */}
        <div className="block sm:hidden">
          {/* Mobile: First 5 days */}
          <div className="grid grid-cols-5 gap-2 mb-2">
            {Array.from({ length: 5 }).map((_, index) => {
              const dayNumber = index + 1;
              const dayReward = getCurrentDayReward(dayNumber);
              const isCompleted = currentDayInWeek >= dayNumber;
              const isCurrent =
                nextDayInWeek === dayNumber && stats.canCheckInToday;

              return (
                <div
                  key={dayNumber}
                  className={`
                    aspect-square rounded-xl border-2 p-2 flex flex-col items-center justify-center relative transition-all duration-300
                    ${
                      isCompleted
                        ? "border-green-400 bg-gradient-to-br from-green-50 to-emerald-100 shadow-md"
                        : isCurrent
                          ? "border-orange-400 bg-gradient-to-br from-orange-50 to-amber-100 shadow-md ring-2 ring-orange-300/50"
                          : "border-gray-200 bg-gray-50 hover:border-gray-300"
                    }
                  `}
                >
                  <div
                    className={`
                      w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold mb-1
                      ${
                        isCompleted
                          ? "bg-green-500 text-white"
                          : isCurrent
                            ? "bg-orange-500 text-white"
                            : "bg-gray-300 text-gray-600"
                      }
                    `}
                  >
                    {isCompleted ? <Check className="h-3 w-3" /> : dayNumber}
                  </div>
                  <div
                    className={`
                      text-xs font-semibold
                      ${
                        isCompleted
                          ? "text-green-700"
                          : isCurrent
                            ? "text-orange-700"
                            : "text-gray-500"
                      }
                    `}
                  >
                    +{(dayReward || 0).toLocaleString()}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Mobile: Last 2 days with same size as above */}
          <div className="grid grid-cols-5 gap-2">
            {Array.from({ length: 2 }).map((_, index) => {
              const dayNumber = index + 6;
              const dayReward = getCurrentDayReward(dayNumber);
              const isCompleted = currentDayInWeek >= dayNumber;
              const isCurrent =
                nextDayInWeek === dayNumber && stats.canCheckInToday;

              return (
                <div
                  key={dayNumber}
                  className={`
                    aspect-square rounded-xl border-2 p-2 flex flex-col items-center justify-center relative transition-all duration-300
                    ${
                      isCompleted
                        ? "border-green-400 bg-gradient-to-br from-green-50 to-emerald-100 shadow-md"
                        : isCurrent
                          ? "border-orange-400 bg-gradient-to-br from-orange-50 to-amber-100 shadow-md ring-2 ring-orange-300/50"
                          : "border-gray-200 bg-gray-50 hover:border-gray-300"
                    }
                  `}
                >
                  <div
                    className={`
                      w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold mb-1
                      ${
                        isCompleted
                          ? "bg-green-500 text-white"
                          : isCurrent
                            ? "bg-orange-500 text-white"
                            : "bg-gray-300 text-gray-600"
                      }
                    `}
                  >
                    {isCompleted ? <Check className="h-3 w-3" /> : dayNumber}
                  </div>
                  <div
                    className={`
                      text-xs font-semibold
                      ${
                        isCompleted
                          ? "text-green-700"
                          : isCurrent
                            ? "text-orange-700"
                            : "text-gray-500"
                      }
                    `}
                  >
                    +{(dayReward || 0).toLocaleString()}
                  </div>
                  {dayNumber === 7 && (
                    <div className="absolute -top-1 -right-1">
                      <Award className="h-3 w-3 text-yellow-500" />
                    </div>
                  )}
                </div>
              );
            })}
            <div></div> {/* Empty spacer */}
          </div>
        </div>

        {/* Desktop: Single row with 7 columns */}
        <div className="hidden sm:grid grid-cols-7 gap-3">
          {Array.from({ length: 7 }).map((_, index) => {
            const dayNumber = index + 1;
            const dayReward = getCurrentDayReward(dayNumber);
            const isCompleted = currentDayInWeek >= dayNumber;
            const isCurrent =
              nextDayInWeek === dayNumber && stats.canCheckInToday;

            return (
              <div
                key={dayNumber}
                className={`
                  aspect-square rounded-xl border-2 p-3 flex flex-col items-center justify-center relative transition-all duration-300
                  ${
                    isCompleted
                      ? "border-green-400 bg-gradient-to-br from-green-50 to-emerald-100 shadow-md"
                      : isCurrent
                        ? "border-orange-400 bg-gradient-to-br from-orange-50 to-amber-100 shadow-md ring-2 ring-orange-300/50"
                        : "border-gray-200 bg-gray-50 hover:border-gray-300"
                  }
                `}
              >
                <div
                  className={`
                    w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mb-1
                    ${
                      isCompleted
                        ? "bg-green-500 text-white"
                        : isCurrent
                          ? "bg-orange-500 text-white"
                          : "bg-gray-300 text-gray-600"
                    }
                  `}
                >
                  {isCompleted ? <Check className="h-4 w-4" /> : dayNumber}
                </div>
                <div
                  className={`
                    text-sm font-semibold
                    ${
                      isCompleted
                        ? "text-green-700"
                        : isCurrent
                          ? "text-orange-700"
                          : "text-gray-500"
                    }
                  `}
                >
                  +{(dayReward || 0).toLocaleString()}
                </div>
                {dayNumber === 7 && (
                  <div className="absolute -top-1 -right-1">
                    <Award className="h-4 w-4 text-yellow-500" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-3 sm:p-4 rounded-xl text-center">
          <div className="text-lg sm:text-xl font-bold text-blue-600">
            {stats.totalCheckIns}
          </div>
          <div className="text-xs sm:text-sm text-blue-700/80 font-bold">
            Tổng điểm danh
          </div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-emerald-100 p-3 sm:p-4 rounded-xl text-center">
          <div className="text-lg sm:text-xl font-bold text-green-600">
            {stats.totalRewards.toLocaleString()}
          </div>
          <div className="text-xs sm:text-sm text-green-700/80 font-bold">
            Tổng thưởng
          </div>
        </div>
        <div className="bg-gradient-to-br from-orange-50 to-amber-100 p-3 sm:p-4 rounded-xl text-center">
          <div className="text-lg sm:text-xl font-bold text-orange-600">
            {stats.consecutiveCount}
          </div>
          <div className="text-xs sm:text-sm text-orange-700/80 font-bold">
            Ngày liên tiếp
          </div>
        </div>
      </div>

      {/* Check-in Button */}
      <button
        onClick={handleCheckIn}
        disabled={!stats.canCheckInToday || checkingIn}
        className={`
          w-full py-3 sm:py-4 px-6 rounded-xl font-bold text-sm sm:text-lg flex items-center justify-center gap-3 transition-all duration-300
          ${
            stats.canCheckInToday && !checkingIn
              ? "bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
              : "bg-gray-300 text-gray-600 cursor-not-allowed"
          }
        `}
      >
        {checkingIn ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
            <span>Đang điểm danh...</span>
          </>
        ) : stats.canCheckInToday ? (
          <>
            <Gift className="h-5 w-5" />
            <span>Điểm danh ngay</span>
            <div className="bg-white/20 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-bold">
              +{(nextReward || 0).toLocaleString()}
            </div>
          </>
        ) : (
          <>
            <CheckCircle className="h-5 w-5" />
            <span>Đã điểm danh hôm nay</span>
          </>
        )}
      </button>

      {/* Next Day Info */}
      {!stats.canCheckInToday && (
        <div className="mt-4 p-3 sm:p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border border-orange-200">
          <div className="flex items-center justify-center gap-2 text-sm text-gray-700">
            <Clock className="h-4 w-4 text-orange-500" />
            <span>Ngày mai:</span>
            <span className="font-bold text-orange-700">
              +{(getCurrentDayReward(nextDayInWeek) || 0).toLocaleString()} VNĐ
            </span>
          </div>
        </div>
      )}

      {/* Week Completion Bonus */}
      {stats.consecutiveCount >= 7 &&
        rewards?.bonusWeekComplete &&
        rewards.bonusWeekComplete > 0 && (
          <div className="mt-4 p-3 sm:p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-200">
            <div className="flex items-center justify-center gap-2 text-sm">
              <Award className="h-4 w-4 text-yellow-500" />
              <span className="text-gray-700">Thưởng hoàn thành tuần:</span>
              <span className="font-bold text-yellow-700">
                +{(rewards.bonusWeekComplete || 0).toLocaleString()} VNĐ
              </span>
            </div>
          </div>
        )}
    </div>
  );
};

export default CheckInCard;
