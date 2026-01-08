import React, { useState, useEffect } from "react";
import {
  RotateCw,
  Coins,
  AlertCircle,
  Trophy,
  Sparkles,
  Gift,
  Clock,
} from "lucide-react";
import luckywheelService, {
  type LuckyWheelSettings,
  type SpinResult,
} from "../services/luckywheelService";
import { useWallet } from "../context/WalletContext";

interface LuckyWheelCardProps {
  onSpinComplete?: (result: SpinResult) => void;
}

const LuckyWheelCard: React.FC<LuckyWheelCardProps> = ({ onSpinComplete }) => {
  const [settings, setSettings] = useState<LuckyWheelSettings | null>(null);
  const [spinning, setSpinning] = useState(false);
  const [lastResult, setLastResult] = useState<SpinResult | null>(null);
  const [rotation, setRotation] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const { balance, updateBalance } = useWallet();
  const [error, setError] = useState<string | null>(null);
  const [spinsToday, setSpinsToday] = useState(0);
  const [canSpin, setCanSpin] = useState(true);

  const loadSettings = async () => {
    try {
      const data = await luckywheelService.getSettings();
      setSettings(data);

      // Check spins today - sử dụng UTC để khớp với backend
      const historyData = await luckywheelService.getHistory(1, 100);
      const now = new Date();
      const todayUTC = new Date(
        Date.UTC(
          now.getUTCFullYear(),
          now.getUTCMonth(),
          now.getUTCDate(),
          0,
          0,
          0,
          0
        )
      );
      const tomorrowUTC = new Date(todayUTC);
      tomorrowUTC.setUTCDate(tomorrowUTC.getUTCDate() + 1);

      const todaySpins = historyData.history.filter((item) => {
        const spinDate = new Date(item.spinDate);
        // Chỉ đếm lượt quay thực (không phải "Thử Lại")
        return (
          spinDate >= todayUTC && spinDate < tomorrowUTC && !item.isTryAgain
        );
      }).length;

      setSpinsToday(todaySpins);
      setCanSpin(todaySpins < (data.maxSpinsPerDay || 1));
      setError(null);
    } catch (err: any) {
      setError("Không thể tải cài đặt vòng quay");
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const handleSpin = async () => {
    if (!settings || spinning || !canSpin) return;

    setSpinning(true);
    setError(null);
    setShowResult(false);

    try {
      // Call API first to get result
      const result = await luckywheelService.spin();

      // Find the prize index to calculate rotation
      const prizeIndex = settings.prizes.findIndex(
        (p) => p.id === result.prize.id
      );
      const segments = getWheelSegments();
      const targetSegment = segments[prizeIndex];

      // Calculate rotation to land on prize
      // Kim chỉ ở vị trí -90° (12h trong hệ SVG)
      // Cần quay wheel để segment target về vị trí kim chỉ (-90°)
      const spins = 5; // Full rotations
      const pointerAngle = -90; // Kim chỉ ở 12 giờ
      const targetAngle = targetSegment.centerAngle;
      // Để đưa segment về vị trí kim chỉ, cần quay: pointerAngle - targetAngle
      const angleToRotate = pointerAngle - targetAngle;
      const finalRotation = rotation + spins * 360 + angleToRotate;

      setRotation(finalRotation);

      // Wait for animation to complete
      setTimeout(() => {
        setLastResult(result);
        setShowResult(true);
        setSpinning(false);
        updateBalance();

        // Nếu KHÔNG phải "Thử Lại" thì reload settings
        // Nếu là "Thử Lại" thì không reload để user có thể quay tiếp
        if (!result.isTryAgain) {
          loadSettings();
        }

        onSpinComplete?.(result);
      }, 4000);
    } catch (err: any) {
      setError(err.response?.data?.message || "Có lỗi xảy ra khi quay");
      setSpinning(false);
      loadSettings(); // Reload settings ngay cả khi lỗi
    }
  };

  const getWheelSegments = () => {
    if (!settings) return [];

    // Chia đều các segment
    const segmentAngle = 360 / settings.prizes.length;
    // Để segment đầu tiên có centerAngle = -90° (kim chỉ),
    // startAngle phải = -90 - segmentAngle/2
    let currentAngle = -90 - segmentAngle / 2;

    return settings.prizes.map((prize, index) => {
      const segment = {
        ...prize,
        startAngle: currentAngle,
        endAngle: currentAngle + segmentAngle,
        centerAngle: currentAngle + segmentAngle / 2,
      };
      currentAngle += segmentAngle;
      return segment;
    });
  };

  const segments = getWheelSegments();

  if (!settings) {
    return (
      <div className="bg-white rounded-xl border shadow-sm p-6">
        <div className="text-center text-gray-500">Đang tải...</div>
      </div>
    );
  }

  if (!settings.enabled) {
    return (
      <div className="bg-gray-100 rounded-xl border shadow-sm p-6">
        <div className="text-center text-gray-500">
          <AlertCircle className="mx-auto h-12 w-12 mb-2" />
          <h3 className="text-lg font-semibold mb-1">Vòng Quay Tạm Ngưng</h3>
          <p className="text-sm">Tính năng này hiện đang được bảo trì</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-red-500 p-6">
          <div className="text-center">
            <h3 className="text-3xl font-bold text-white mb-2 flex items-center justify-center gap-2">
              <Sparkles className="h-8 w-8" />
              Vòng Quay May Mắn
            </h3>
            <p className="text-white/90 text-sm font-medium">
              {settings.costPerSpin > 0
                ? `${settings.costPerSpin.toLocaleString("vi-VN")}đ mỗi lượt`
                : "Miễn phí mỗi ngày"}
            </p>
          </div>

          <div className="mt-4">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white/20 rounded-xl p-3 border border-white/30">
                <div className="text-white/90 text-xs mb-1 flex items-center gap-1">
                  <Coins className="h-3 w-3" />
                  Số dư
                </div>
                <div className="text-xl font-bold text-white">
                  {balance.toLocaleString()}đ
                </div>
              </div>

              <div className="bg-white/20 rounded-xl p-3 border border-white/30">
                <div className="text-white/90 text-xs mb-1 flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Lượt quay
                </div>
                <div className="text-xl font-bold text-white">
                  {spinsToday}/{settings.maxSpinsPerDay || 1}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Wheel Section */}
        <div className="p-8 bg-gray-50">
          <div
            className="relative mx-auto"
            style={{ width: "360px", height: "360px" }}
          >
            {/* Wheel SVG */}
            <div className="relative w-full h-full">
              <svg
                viewBox="0 0 200 200"
                className="w-full h-full drop-shadow-2xl"
                style={{
                  transform: `rotate(${rotation}deg)`,
                  transition: spinning
                    ? "transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)"
                    : "none",
                }}
              >
                {/* Outer Ring */}
                <circle
                  cx="100"
                  cy="100"
                  r="95"
                  fill="none"
                  stroke="#f97316"
                  strokeWidth="4"
                />
                <circle
                  cx="100"
                  cy="100"
                  r="92"
                  fill="none"
                  stroke="white"
                  strokeWidth="1"
                />

                {segments.map((segment) => {
                  const startAngle = (segment.startAngle * Math.PI) / 180;
                  const endAngle = (segment.endAngle * Math.PI) / 180;
                  const largeArcFlag =
                    segment.endAngle - segment.startAngle > 180 ? 1 : 0;

                  const x1 = 100 + 90 * Math.cos(startAngle);
                  const y1 = 100 + 90 * Math.sin(startAngle);
                  const x2 = 100 + 90 * Math.cos(endAngle);
                  const y2 = 100 + 90 * Math.sin(endAngle);

                  const textAngle = segment.centerAngle;
                  const textX =
                    100 + 65 * Math.cos((textAngle * Math.PI) / 180);
                  const textY =
                    100 + 65 * Math.sin((textAngle * Math.PI) / 180);

                  // Để text luôn đọc được (không bị ngược), ta cần điều chỉnh góc xoay
                  // Text sẽ luôn hướng lên (có thể đọc từ dưới lên hoặc giữ nguyên)
                  let textRotation = 0;
                  // Nếu text ở nửa trái (180° đến 360° hoặc -180° đến 0°), xoay 90° sang trái
                  // Nếu text ở nửa phải (0° đến 180°), xoay 90° sang phải
                  const normalizedAngle = ((textAngle % 360) + 360) % 360;
                  if (normalizedAngle > 180) {
                    textRotation = -90; // Xoay trái
                  } else {
                    textRotation = 90; // Xoay phải
                  }

                  // Format giá trị thành dạng ngắn gọn
                  const formatValue = (value: number) => {
                    if (value === 0) return "Retry";
                    if (value >= 1000000)
                      return `+${(value / 1000000).toFixed(0)}M`;
                    if (value >= 1000) return `+${(value / 1000).toFixed(0)}K`;
                    return `+${value}`;
                  };

                  return (
                    <g key={segment.id}>
                      <path
                        d={`M 100 100 L ${x1} ${y1} A 90 90 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
                        fill={segment.color}
                        stroke="#fff"
                        strokeWidth="3"
                        opacity="0.95"
                      />
                      {/* Giá trị */}
                      <text
                        x={textX}
                        y={textY}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fontSize="9"
                        fontWeight="900"
                        fill="white"
                        transform={`rotate(${textRotation}, ${textX}, ${textY})`}
                        style={{
                          textShadow: "0 2px 4px rgba(0,0,0,0.5)",
                        }}
                      >
                        {formatValue(segment.value)}
                      </text>
                    </g>
                  );
                })}
              </svg>

              {/* Center Circle */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-red-500 rounded-full shadow-xl flex items-center justify-center border-4 border-white">
                  <Trophy className="h-8 w-8 text-white" />
                </div>
              </div>

              {/* Pointer */}
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2 z-10">
                <div className="relative mt-[20px] rotate-[180deg]">
                  <div className="w-0 h-0 border-l-[12px] border-r-[12px] border-b-[20px] border-l-transparent border-r-transparent border-b-red-600 drop-shadow-lg"></div>
                  <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[9px] border-r-[9px] border-b-[15px] border-l-transparent border-r-transparent border-b-red-500"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Spin Button */}
          <div className="mt-6 text-center">
            {!canSpin ? (
              <div className="bg-gray-100 rounded-2xl p-4 border border-gray-300">
                <div className="flex items-center justify-center gap-2 text-gray-600">
                  <Clock className="h-5 w-5" />
                  <div className="text-sm font-semibold">
                    Đã hết lượt quay hôm nay. Quay lại vào ngày mai!
                  </div>
                </div>
              </div>
            ) : (
              <button
                onClick={handleSpin}
                disabled={spinning || !canSpin}
                className={`
                  w-full max-w-md mx-auto px-8 py-4 rounded-2xl font-bold text-lg
                  transition-all duration-200
                  ${
                    spinning || !canSpin
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600 shadow-lg hover:shadow-xl"
                  }
                `}
              >
                <div className="flex items-center justify-center gap-2">
                  {spinning ? (
                    <>
                      <RotateCw className="h-5 w-5 animate-spin" />
                      <span>Đang quay...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-5 w-5" />
                      <span>QUAY MIỄN PHÍ</span>
                    </>
                  )}
                </div>
              </button>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-4 bg-red-50 border-2 border-red-200 rounded-xl text-red-700 text-center shadow-sm">
              <div className="flex items-center justify-center gap-2">
                <AlertCircle className="h-5 w-5" />
                <span className="font-semibold">{error}</span>
              </div>
            </div>
          )}

          {/* Result */}
          {showResult && lastResult && (
            <div className="mt-6">
              <div className="p-6 bg-green-50 border-2 border-green-300 rounded-2xl text-center">
                <div className="flex items-center justify-center gap-2 text-green-800 mb-2">
                  <Trophy className="h-6 w-6" />
                  <span className="text-lg font-bold">Chúc mừng bạn!</span>
                </div>
                <div className="text-3xl font-bold text-green-700 mb-3">
                  {lastResult.prize.name}
                </div>
                {lastResult.rewardReceived > 0 && (
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full text-green-600 font-semibold shadow-sm border border-green-200">
                    <Coins className="h-5 w-5" />
                    <span>
                      +{lastResult.rewardReceived.toLocaleString("vi-VN")}đ
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Prizes Table */}
        <div className="px-8 pb-8">
          <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
            <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Gift className="h-5 w-5 text-orange-600" />
              Bảng Giải Thưởng
            </h4>
            <div className="space-y-2">
              {settings.prizes.map((prize) => (
                <div
                  key={prize.id}
                  className="flex items-center justify-between py-3 px-4 bg-white rounded-xl border border-gray-200"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: prize.color }}
                    >
                      <Coins className="h-5 w-5 text-white" />
                    </div>
                    <span className="font-semibold text-gray-900">
                      {prize.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-orange-600 bg-orange-50 px-2 py-1 rounded">
                      {prize.probability}%
                    </span>
                    <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-orange-400 to-red-500 rounded-full"
                        style={{ width: `${prize.probability}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LuckyWheelCard;
