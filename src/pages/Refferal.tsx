import React, { useState, useEffect } from "react";
import {
  Copy,
  Check,
  Share2,
  Users,
  Clock,
  Trophy,
  TrendingUp,
  QrCode,
  ArrowRight,
  Star,
  Target,
  Award,
  DollarSign,
} from "lucide-react";
import { THEME, formatCurrency, formatNumber } from "@/utils/constants";
import referralService from "@/services/referral.service";
import profileService from "@/services/profileService";
import settingsService from "@/services/settingsService";
import type {
  ReferralStats,
  ReferralCode,
  ReferralHistory,
} from "@/services/referral.service";
import { useAppStore } from "@/store/appStore";
import { useAuthStore } from "@/store/authStore";

const ReferralProgram: React.FC = () => {
  const { setToast } = useAppStore();
  const { user, setUser } = useAuthStore();
  const [referralCode, setReferralCode] = useState<ReferralCode | null>(null);
  const [referralStats, setReferralStats] = useState<ReferralStats | null>(
    null
  );
  const [referralHistory, setReferralHistory] = useState<ReferralHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCopied, setIsCopied] = useState(false);

  // Dynamic settings from admin
  const [dynamicConfig, setDynamicConfig] = useState({
    commissionRates: {
      level1: 10,
      level2: 5,
      level3: 2,
    },
    milestones: [
      { referrals: 5, reward: 50000, title: "Người giới thiệu mới" },
      { referrals: 20, reward: 200000, title: "Cộng tác viên tích cực" },
      { referrals: 50, reward: 500000, title: "Đại lý chuyên nghiệp" },
      { referrals: 100, reward: 1000000, title: "Chuyên gia giới thiệu" },
    ],
    levelNames: {
      1: "Cấp 1 - Trực tiếp",
      2: "Cấp 2 - Gián tiếp",
      3: "Cấp 3 - Xa nhất",
    },
    levelColors: {
      1: {
        bg: "bg-gradient-to-r from-orange-50 to-red-50",
        border: "border-orange-200",
        text: "text-orange-500",
        accent: "text-orange-500",
      },
      2: {
        bg: "bg-gradient-to-r from-orange-50 to-amber-50",
        border: "border-orange-200",
        text: "text-orange-600",
        accent: "text-orange-600",
      },
      3: {
        bg: "bg-gradient-to-r from-amber-50 to-yellow-50",
        border: "border-amber-200",
        text: "text-amber-700",
        accent: "text-amber-600",
      },
    },
  });

  // Load data on component mount
  useEffect(() => {
    loadReferralData();
  }, []);

  const loadDynamicSettings = async () => {
    try {
      const settings = await settingsService.getSettings();
      if (settings && settings.data && (settings.data as any).commission) {
        const commission = (settings.data as any).commission;
        setDynamicConfig((prev) => ({
          ...prev,
          commissionRates: {
            level1: commission.level1Rate || 10,
            level2: commission.level2Rate || 5,
            level3: commission.level3Rate || 2,
          },
        }));
      }
    } catch (error: unknown) {
      console.log("Using default commission rates");
    }
  };

  const loadReferralData = async () => {
    try {
      setLoading(true);

      // Load dynamic settings first
      await loadDynamicSettings();

      // Load user profile first to get affiliate info
      const profile = await profileService.getProfile();
      setUser(profile);

      // Check if user has referral code in profile, if not try API
      if (profile.referralCode) {
        setReferralCode({
          code: profile.referralCode,
          shareUrl: `${window.location.origin}/register?ref=${profile.referralCode}`,
          createdAt: profile.createdAt || new Date().toISOString(),
        });
      } else {
        // Fallback: auto-generate referral code if user doesn't have one
        // This should not happen for registered users, but just in case
        try {
          const newCode = await referralService.generateReferralCode();
          setReferralCode(newCode);
        } catch (error) {
          // If that also fails, create a temporary one from user ID
          const tempCode = `REF${profile._id.slice(-6).toUpperCase()}`;
          setReferralCode({
            code: tempCode,
            shareUrl: `${window.location.origin}/register?ref=${tempCode}`,
            createdAt: new Date().toISOString(),
          });
        }
      }

      // Then load additional referral data from API
      const [statsData, historyData] = await Promise.all([
        referralService.getReferralStats().catch(() => null),
        referralService
          .getReferralHistory({ limit: 10 })
          .catch(() => ({ data: [] })),
      ]);

      // setReferralCode(codeData) - already set above

      // Merge stats from profile and API
      if (statsData) {
        setReferralStats(statsData);
      } else if (profile.affiliate) {
        // Fallback to profile affiliate data
        setReferralStats({
          totalReferrals: profile.affiliate.totalReferrals || 0,
          directReferrals: profile.affiliate.directReferrals || 0,
          level2Referrals: profile.affiliate.level2Referrals || 0,
          level3Referrals: profile.affiliate.level3Referrals || 0,
          totalCommissions: profile.affiliate.commissions || {
            level1Total: 0,
            level2Total: 0,
            level3Total: 0,
            totalEarned: 0,
          },
          monthlyStats: {
            referrals: 0,
            commissions: 0,
          },
        });
      }

      setReferralHistory(historyData.data || []);
    } catch (error) {
      setToast({
        type: "error",
        title: "Không thể tải dữ liệu giới thiệu",
        isVisible: true,
        timer: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const generateReferralCode = async () => {
    try {
      const newCode = await referralService.generateReferralCode();
      setReferralCode(newCode);

      // Update user profile after generating new code
      const updatedProfile = await profileService.getProfile();
      setUser(updatedProfile);

      setToast({
        type: "success",
        title: "Đã tạo mã giới thiệu mới!",
        isVisible: true,
        timer: 3000,
      });
    } catch (error) {
      setToast({
        type: "error",
        title: "Không thể tạo mã giới thiệu",
        isVisible: true,
        timer: 3000,
      });
    }
  };

  const handleCopyLink = async () => {
    if (!referralCode?.code) return;

    const success = await referralService.shareReferralLink(
      referralCode.code,
      "copy"
    );
    if (success) {
      setIsCopied(true);
      setToast({
        type: "success",
        title: "Đã copy link giới thiệu!",
        isVisible: true,
        timer: 2000,
      });
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const handleShare = async (
    platform: "facebook" | "zalo" | "telegram" | "whatsapp"
  ) => {
    if (!referralCode?.code) return;

    await referralService.shareReferralLink(referralCode.code, platform);
    setToast({
      type: "success",
      title: `Đã mở chia sẻ trên ${platform}!`,
      isVisible: true,
      timer: 2000,
    });
  };

  // Calculate next milestone
  const currentReferrals = referralStats?.totalReferrals || 0;
  const nextMilestone = dynamicConfig.milestones.find(
    (m) => currentReferrals < m.referrals
  );
  const progressPercentage = nextMilestone
    ? (currentReferrals / nextMilestone.referrals) * 100
    : 100;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-2 md:p-3 lg:p-4">
      <div className="max-w-6xl mx-auto space-y-3 md:space-y-4 lg:space-y-6">
        {/* Header & Quick Stats */}
        <div className="text-center mb-3 md:mb-4 lg:mb-6">
          <h1 className="text-xl md:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent mb-2 md:mb-3">
            🚀 Chương Trình Giới Thiệu 3 Cấp
          </h1>
          <p className="text-gray-600 text-sm md:text-base lg:text-lg max-w-2xl mx-auto">
            Mời bạn bè tham gia và nhận hoa hồng từ chuỗi giới thiệu 3 cấp độ
            với tỷ lệ hoa hồng lên đến 17%
          </p>
        </div>

        {/* Quick Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3 lg:gap-4 mb-3 md:mb-4 lg:mb-6">
          <div className="bg-gradient-to-r from-orange-50 to-red-50 border-l-4 border-orange-500 p-3 md:p-4 lg:p-6 rounded-lg md:rounded-xl shadow-md">
            <div className="flex items-center">
              <Users className="w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 text-orange-500 mr-2 md:mr-3" />
              <div>
                <p className="text-xs md:text-sm text-gray-600">
                  Tổng Giới Thiệu
                </p>
                <p className="text-lg md:text-xl lg:text-2xl font-bold text-orange-500">
                  {formatNumber(currentReferrals)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-orange-50 to-amber-50 border-l-4 border-orange-600 p-6 rounded-xl shadow-md">
            <div className="flex items-center">
              <DollarSign className="w-8 h-8 text-orange-600 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Tổng Hoa Hồng</p>
                <p className="text-2xl font-bold text-orange-600">
                  {formatCurrency(
                    referralStats?.totalCommissions?.totalEarned || 0
                  )}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-emerald-50 to-green-50 border-l-4 border-emerald-600 p-6 rounded-xl shadow-md">
            <div className="flex items-center">
              <TrendingUp className="w-8 h-8 text-emerald-600 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Tháng Này</p>
                <p className="text-2xl font-bold text-emerald-600">
                  {formatCurrency(
                    referralStats?.monthlyStats?.commissions || 0
                  )}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border-l-4 border-amber-500 p-6 rounded-xl shadow-md">
            <div className="flex items-center">
              <Award className="w-8 h-8 text-amber-600 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Cấp Cao Nhất</p>
                <p className="text-2xl font-bold text-amber-600">
                  Cấp{" "}
                  {referralStats?.level3Referrals
                    ? 3
                    : referralStats?.level2Referrals
                    ? 2
                    : referralStats?.directReferrals
                    ? 1
                    : 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Referral Link Section */}
        <div className="bg-white rounded-xl md:rounded-2xl shadow-xl border border-gray-100 p-4 md:p-6 lg:p-4">
          <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-5 lg:mb-6">
            <div className="p-2 md:p-3 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg md:rounded-xl">
              <Share2 className="w-5 h-5 md:w-6 md:h-6 text-orange-500" />
            </div>
            <div>
              <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-800">
                Link Giới Thiệu Của Bạn
              </h2>
              <p className="text-xs md:text-sm lg:text-base text-gray-600">
                Chia sẻ link này để nhận hoa hồng từ bạn bè
              </p>
            </div>
          </div>

          {referralCode ? (
            <div className="space-y-6">
              {/* Referral Code Display */}
              <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-6 border border-orange-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">
                      Mã Giới Thiệu
                    </p>
                    <p className="text-3xl font-bold font-mono text-orange-500">
                      {referralCode.code}
                    </p>
                  </div>
                  <QrCode className="w-12 h-12 text-orange-500" />
                </div>
              </div>

              {/* Share URL */}
              <div className="flex gap-3">
                <input
                  type="text"
                  value={referralCode.shareUrl}
                  readOnly
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-700 font-mono text-sm"
                />
                <button
                  onClick={handleCopyLink}
                  className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-xl font-medium transition-colors flex items-center gap-2 shadow-lg"
                >
                  {isCopied ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <Copy className="w-5 h-5" />
                  )}
                  {isCopied ? "Đã Copy!" : "Copy"}
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <button
                onClick={generateReferralCode}
                className="px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-xl font-semibold shadow-lg transition-colors"
              >
                Tạo Mã Giới Thiệu
              </button>
            </div>
          )}
        </div>

        {/* Commission Calculation Explanation */}
        <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl shadow-xl border border-orange-200 p-6 md:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-orange-100 rounded-xl">
              <DollarSign className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                Cách tính Hoa Hồng
              </h2>
              <p className="text-gray-600">
                Hiểu rõ cách bạn kiếm tiền từ chương trình giới thiệu
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                📊 Nguồn thu hoa hồng:
              </h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-200">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 shrink-0"></div>
                  <div>
                    <p className="font-semibold text-gray-800">
                      Hoàn thành Task
                    </p>
                    <p className="text-sm text-gray-600">
                      Người được giới thiệu hoàn thành nhiệm vụ và nhận thưởng
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-200">
                  <div className="w-2 h-2 bg-orange-600 rounded-full mt-2 shrink-0"></div>
                  <div>
                    <p className="font-semibold text-gray-800">
                      Affiliate Commission
                    </p>
                    <p className="text-sm text-gray-600">
                      Thu nhập từ tiếp thị liên kết và bán hàng
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-200">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 shrink-0"></div>
                  <div>
                    <p className="font-semibold text-gray-800">
                      Cashback Shopping
                    </p>
                    <p className="text-sm text-gray-600">
                      Hoàn tiền từ mua sắm qua các đối tác
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                💡 Ví dụ tính hoa hồng:
              </h3>
              <div className="bg-white rounded-xl p-5 border border-gray-200">
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                    <span className="font-semibold text-gray-800">
                      Bạn B hoàn thành task
                    </span>
                    <span className="font-bold text-orange-500">+100,000đ</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg border-l-4 border-green-400">
                    <span className="text-sm text-gray-700">
                      → A nhận (Cấp 1 - {dynamicConfig.commissionRates.level1}%)
                    </span>
                    <span className="font-bold text-green-600">
                      +
                      {(
                        (100000 * dynamicConfig.commissionRates.level1) /
                        100
                      ).toLocaleString("vi-VN")}
                      đ
                    </span>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                    <span className="font-semibold text-gray-800">
                      Bạn C hoàn thành task
                    </span>
                    <span className="font-bold text-orange-600">+200,000đ</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg border-l-4 border-green-400">
                    <span className="text-sm text-gray-700">
                      → A nhận (Cấp 2 - {dynamicConfig.commissionRates.level2}%)
                    </span>
                    <span className="font-bold text-green-600">
                      +
                      {(
                        (200000 * dynamicConfig.commissionRates.level2) /
                        100
                      ).toLocaleString("vi-VN")}
                      đ
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span className="text-gray-800">Tổng hoa hồng A nhận:</span>
                    <span className="text-green-600">
                      +
                      {(
                        (100000 * dynamicConfig.commissionRates.level1) / 100 +
                        (200000 * dynamicConfig.commissionRates.level2) / 100
                      ).toLocaleString("vi-VN")}
                      đ
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <span className="text-amber-600">💡</span>
                  <div>
                    <p className="text-sm font-semibold text-amber-800">
                      Lưu ý quan trọng:
                    </p>
                    <p className="text-sm text-amber-700">
                      • Hoa hồng không ảnh hưởng đến thu nhập của người được
                      giới thiệu
                    </p>
                    <p className="text-sm text-amber-700">
                      • Hệ thống sẽ tự động chi trả hoa hồng từ quỹ thưởng
                    </p>
                    <p className="text-sm text-amber-700">
                      • Hoa hồng được tính theo thời gian thực
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Commission Rates */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Object.entries(dynamicConfig.levelColors).map(([level, colors]) => (
            <div
              key={level}
              className={`${colors.bg} border ${colors.border} rounded-2xl p-6 shadow-lg`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 bg-white rounded-xl shadow-md`}>
                  <Target className={`w-6 h-6 ${colors.text}`} />
                </div>
                <span className={`${colors.accent} text-2xl font-bold`}>
                  {level === "1"
                    ? dynamicConfig.commissionRates.level1
                    : level === "2"
                    ? dynamicConfig.commissionRates.level2
                    : dynamicConfig.commissionRates.level3}
                  %
                </span>
              </div>
              <h3 className={`text-xl font-bold ${colors.text} mb-2`}>
                {
                  dynamicConfig.levelNames[
                    parseInt(level) as keyof typeof dynamicConfig.levelNames
                  ]
                }
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                {level === "1" && "Hoa hồng từ người bạn giới thiệu trực tiếp"}
                {level === "2" && "Hoa hồng từ người được F1 giới thiệu"}
                {level === "3" && "Hoa hồng từ người được F2 giới thiệu"}
              </p>
              <div className={`${colors.accent} text-lg font-semibold`}>
                Số người:{" "}
                {level === "1"
                  ? referralStats?.directReferrals || 0
                  : level === "2"
                  ? referralStats?.level2Referrals || 0
                  : referralStats?.level3Referrals || 0}
              </div>
            </div>
          ))}
        </div>

        {/* Progress to Next Milestone */}
        {nextMilestone && (
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl">
                <Trophy className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Mốc Thưởng Tiếp Theo
                </h2>
                <p className="text-gray-600">
                  Còn {nextMilestone.referrals - currentReferrals} người nữa để
                  đạt mốc
                </p>
              </div>
            </div>

            <div className="mb-4">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>
                  {currentReferrals} / {nextMilestone.referrals} người
                </span>
                <span>{Math.round(progressPercentage)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="h-3 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                ></div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl p-4 border border-amber-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-800">
                    {nextMilestone.title}
                  </p>
                  <p className="text-gray-600 text-sm">
                    Thưởng: {formatCurrency(nextMilestone.reward)}
                  </p>
                </div>
                <ArrowRight className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </div>
        )}

        {/* Recent Referral History */}
        {referralHistory.length > 0 && (
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className={`p-3 ${THEME.SUCCESS_BG_LIGHT} rounded-xl`}>
                  <Clock className={`w-6 h-6 ${THEME.SUCCESS_TEXT}`} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    Lịch Sử Giới Thiệu
                  </h2>
                  <p className="text-gray-600">
                    Hoa hồng từ những người bạn giới thiệu
                  </p>
                </div>
              </div>
              <button className="px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:opacity-90 transition-colors">
                Xem Tất Cả
              </button>
            </div>

            <div className="space-y-3">
              {referralHistory.slice(0, 5).map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-10 h-10 ${
                        dynamicConfig.levelColors[item.level].bg
                      } rounded-full flex items-center justify-center font-bold text-sm ${
                        dynamicConfig.levelColors[item.level].text
                      }`}
                    >
                      F{item.level}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">
                        {item.referredUser.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(item.createdAt).toLocaleDateString("vi-VN")}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${THEME.SUCCESS_TEXT}`}>
                      {formatCurrency(item.commission)}
                    </p>
                    <p
                      className={`text-xs px-2 py-1 rounded-full ${
                        item.status === "approved"
                          ? "bg-gradient-to-r from-orange-500/10 to-orange-600/10 text-orange-500 border border-orange-500/30"
                          : item.status === "pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {item.status === "approved"
                        ? "Đã duyệt"
                        : item.status === "pending"
                        ? "Chờ duyệt"
                        : "Từ chối"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReferralProgram;
